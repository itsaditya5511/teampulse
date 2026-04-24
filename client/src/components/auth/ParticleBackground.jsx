import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e1a, 0.04);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Futuristic Particle Network ---
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleBasePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 15;
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      
      particleBasePositions[i * 3] = x;
      particleBasePositions[i * 3 + 1] = y;
      particleBasePositions[i * 3 + 2] = z;

      particleSpeeds[i] = Math.random() * 0.002 + 0.001;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x06b6d4, // Cyan
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Grid / Wireframes (Futuristic) ---
    const gridHelper = new THREE.GridHelper(40, 40, 0x6366f1, 0x8b5cf6);
    gridHelper.position.y = -6;
    gridHelper.rotation.x = Math.PI / 8;
    gridHelper.material.opacity = 0.15;
    gridHelper.material.transparent = true;
    gridHelper.material.blending = THREE.AdditiveBlending;
    scene.add(gridHelper);

    // --- Connecting Lines (Plexus) ---
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1, // Indigo
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    let connectionLines = null;

    const updateConnections = () => {
      if (connectionLines) scene.remove(connectionLines);
      const positions = particleGeometry.attributes.position.array;
      const linePositions = [];
      const maxDistance = 2.0;
      let lineCount = 0;
      const maxLines = 150;

      for (let i = 0; i < particleCount && lineCount < maxLines; i++) {
        for (let j = i + 1; j < particleCount && lineCount < maxLines; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            linePositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
            lineCount++;
          }
        }
      }

      if (linePositions.length > 0) {
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        connectionLines = new THREE.LineSegments(lineGeometry, linesMaterial);
        scene.add(connectionLines);
      }
    };

    // --- Soft Futuristic Cursor Glow ---
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 1)'); 
      gradient.addColorStop(0.3, 'rgba(139, 92, 246, 0.4)'); 
      gradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.1)'); 
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(canvas);
    };

    const glowMaterial = new THREE.SpriteMaterial({
      map: createGlowTexture(),
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    });
    
    const cursorGlow = new THREE.Sprite(glowMaterial);
    cursorGlow.scale.set(4, 4, 1);
    scene.add(cursorGlow);

    // --- Mouse Tracking ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(0, 0);
    const targetPos = new THREE.Vector3(0, 0, 0);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let isMouseMoving = false;
    let mouseTimeout;

    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, targetPos);
      
      isMouseMoving = true;
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => { isMouseMoving = false; }, 100);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- Animation Loop ---
    let frameCount = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      frameCount++;

      particles.rotation.y = Math.sin(elapsed * 0.05) * 0.1;
      particles.rotation.x = Math.cos(elapsed * 0.05) * 0.1;
      if (connectionLines) {
        connectionLines.rotation.y = particles.rotation.y;
        connectionLines.rotation.x = particles.rotation.x;
      }

      cursorGlow.position.lerp(targetPos, 0.15);
      cursorGlow.scale.setScalar(4 + Math.sin(elapsed * 5) * 0.3);

      const pos = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += particleSpeeds[i];
        if (pos[i * 3 + 1] > 10) pos[i * 3 + 1] = -10;

        const dx = cursorGlow.position.x - pos[i * 3];
        const dy = cursorGlow.position.y - pos[i * 3 + 1];
        const dz = cursorGlow.position.z - pos[i * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 4.0 && isMouseMoving) {
          const force = (4.0 - dist) / 4.0;
          pos[i * 3] += (dx / dist) * force * 0.08 + (dy / dist) * force * 0.05;
          pos[i * 3 + 1] += (dy / dist) * force * 0.08 - (dx / dist) * force * 0.05;
          pos[i * 3 + 2] += (dz / dist) * force * 0.08;
        } else {
          const bx = particleBasePositions[i * 3];
          const bz = particleBasePositions[i * 3 + 2];
          pos[i * 3] += (bx - pos[i * 3]) * 0.02;
          pos[i * 3 + 2] += (bz - pos[i * 3 + 2]) * 0.02;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      if (frameCount % 6 === 0) updateConnections();

      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      container._animationId = animationId;
    };

    animate();

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(mouseTimeout);
      if (container._animationId) cancelAnimationFrame(container._animationId);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at center, #0a0e1a 0%, #05070d 100%)'
      }}
    />
  );
};

export default ParticleBackground;
