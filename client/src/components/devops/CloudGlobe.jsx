import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CloudGlobe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Globe Base (Dark Sphere)
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x05070d,
      transparent: true,
      opacity: 0.9,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globe);

    // 2. Wireframe / Grid Layer
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.15,
    });
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(1.01, 32, 32)),
      wireframeMaterial
    );
    globeGroup.add(wireframe);

    // 3. Dot map (approximated points on a sphere)
    const pointsCount = 1000;
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);
    
    const colorIndigo = new THREE.Color(0x6366f1);
    const colorCyan = new THREE.Color(0x06b6d4);

    for (let i = 0; i < pointsCount; i++) {
      // Golden ratio spiral for even distribution
      const phi = Math.acos(-1 + (2 * i) / pointsCount);
      const theta = Math.sqrt(pointsCount * Math.PI) * phi;
      
      const x = 1.02 * Math.cos(theta) * Math.sin(phi);
      const y = 1.02 * Math.sin(theta) * Math.sin(phi);
      const z = 1.02 * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Randomly mix cyan and indigo
      const mixedColor = Math.random() > 0.5 ? colorIndigo : colorCyan;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    globeGroup.add(points);

    // 4. Server Nodes (Glowing larger dots)
    const nodeCount = 15;
    const nodeGeometry = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * Math.random()));
      const theta = Math.random() * Math.PI * 2;
      
      nodePositions[i * 3] = 1.05 * Math.cos(theta) * Math.sin(phi);
      nodePositions[i * 3 + 1] = 1.05 * Math.sin(theta) * Math.sin(phi);
      nodePositions[i * 3 + 2] = 1.05 * Math.cos(phi);
    }
    
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    
    // Canvas texture for glowing nodes
    const getGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 1)'); // Emerald green for healthy servers
      gradient.addColorStop(0.3, 'rgba(16, 185, 129, 0.5)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0,0,64,64);
      return new THREE.CanvasTexture(canvas);
    };

    const nodeMaterial = new THREE.PointsMaterial({
      size: 0.15,
      map: getGlowTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    globeGroup.add(nodes);

    // Interaction variables
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    const mouseX = { current: 0 };
    const mouseY = { current: 0 };
    
    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      mouseX.current = (x / container.clientWidth) * 2 - 1;
      mouseY.current = -(y / container.clientHeight) * 2 + 1;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Base rotation
      globeGroup.rotation.y += 0.002;
      
      // Mouse interaction parallax
      targetRotationY = mouseX.current * 0.5;
      targetRotationX = 0.2 + mouseY.current * 0.5;
      
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;
      
      // Pulse nodes
      nodes.material.size = 0.15 + Math.sin(elapsed * 4) * 0.05;

      renderer.render(scene, camera);
    };
    
    animate();

    // Resize handler
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-2xl overflow-hidden bg-[#05070d] border border-indigo-500/20 shadow-2xl shadow-indigo-500/10" ref={mountRef}>
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-xl font-bold text-white mb-1 tracking-tight tracking-wider uppercase text-[10px] text-gray-500 mb-2">Global .com Clusters</h3>
        <p className="text-emerald-400 text-sm font-medium flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2"></span>
          15 Regions Online
        </p>
      </div>
      <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex-1 mr-4">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Global Traffic</div>
          <div className="text-white font-mono text-2xl">45.2<span className="text-sm text-gray-500 ml-1">TB/s</span></div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex-1">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Avg Latency</div>
          <div className="text-white font-mono text-2xl">24<span className="text-sm text-gray-500 ml-1">ms</span></div>
        </div>
      </div>
    </div>
  );
};

export default CloudGlobe;
