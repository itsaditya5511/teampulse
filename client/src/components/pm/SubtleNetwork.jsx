import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SubtleNetwork = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const particlesCount = 50;
    const positions = new Float32Array(particlesCount * 3);
    const geometry = new THREE.BufferGeometry();
    
    for(let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.02,
      transparent: true,
      opacity: 0.4
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Create lines between points
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.1
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePoints = [];
    const pointsArray = [];
    for(let i = 0; i < particlesCount; i++) {
      pointsArray.push(new THREE.Vector3(positions[i*3], positions[i*3+1], positions[i*3+2]));
    }

    const animate = () => {
      requestAnimationFrame(animate);
      
      points.rotation.y += 0.001;
      points.rotation.x += 0.0005;

      renderer.render(scene, camera);
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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />;
};

export default SubtleNetwork;
