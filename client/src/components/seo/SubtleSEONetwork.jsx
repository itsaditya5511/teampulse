import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SubtleSEONetwork = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const particlesCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Create a somewhat spherical distribution for a "global/web" feel
      const radius = 2 + Math.random() * 2;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta); // x
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      positions[i + 2] = radius * Math.cos(phi); // z

      // SEO colors: Orange (f97316), Teal (14b8a6), Purple (a855f7)
      const colorType = Math.random();
      if (colorType > 0.66) {
        colors[i] = 0.97; colors[i + 1] = 0.45; colors[i + 2] = 0.08; // Orange
      } else if (colorType > 0.33) {
        colors[i] = 0.07; colors[i + 1] = 0.72; colors[i + 2] = 0.65; // Teal
      } else {
        colors[i] = 0.65; colors[i + 1] = 0.33; colors[i + 2] = 0.96; // Purple
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Create a wireframe globe to represent the WWW
    const sphereGeometry = new THREE.SphereGeometry(2.5, 16, 16);
    const sphereMaterial = new THREE.LineBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.03
    });
    const globe = new THREE.LineSegments(new THREE.WireframeGeometry(sphereGeometry), sphereMaterial);
    scene.add(globe);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      points.rotation.y -= 0.001;
      globe.rotation.y += 0.0005;
      globe.rotation.x += 0.0002;
      renderer.render(scene, camera);
      container._animationId = animationId;
    };

    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container._animationId) cancelAnimationFrame(container._animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default SubtleSEONetwork;
