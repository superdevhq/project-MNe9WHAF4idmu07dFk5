
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ThreeBearProps {
  isEyesClosed: boolean;
}

const ThreeBear: React.FC<ThreeBearProps> = ({ isEyesClosed }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [bearHead, setBearHead] = useState<THREE.Group | null>(null);
  const [leftEye, setLeftEye] = useState<THREE.Mesh | null>(null);
  const [rightEye, setRightEye] = useState<THREE.Mesh | null>(null);

  // Setup the scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    setScene(scene);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 3;
    controls.maxDistance = 8;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create bear head
    const bearGroup = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.8,
      metalness: 0.2
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    bearGroup.add(head);

    // Ears
    const earGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const earMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.8,
      metalness: 0.2
    });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.7, 0.7, 0);
    bearGroup.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.7, 0.7, 0);
    bearGroup.add(rightEar);

    // Snout
    const snoutGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const snoutMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xA0522D,
      roughness: 0.7,
      metalness: 0.2
    });
    const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
    snout.position.set(0, -0.2, 0.8);
    bearGroup.add(snout);

    // Nose
    const noseGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, -0.2, 1.15);
    bearGroup.add(nose);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEyeMesh = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEyeMesh.position.set(-0.3, 0.1, 0.9);
    bearGroup.add(leftEyeMesh);
    setLeftEye(leftEyeMesh);
    
    const rightEyeMesh = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEyeMesh.position.set(0.3, 0.1, 0.9);
    bearGroup.add(rightEyeMesh);
    setRightEye(rightEyeMesh);

    // Add bear to scene
    scene.add(bearGroup);
    setBearHead(bearGroup);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Handle eye state changes
  useEffect(() => {
    if (!leftEye || !rightEye) return;

    if (isEyesClosed) {
      // Close eyes (scale them down vertically)
      leftEye.scale.set(1, 0.1, 1);
      rightEye.scale.set(1, 0.1, 1);
    } else {
      // Open eyes
      leftEye.scale.set(1, 1, 1);
      rightEye.scale.set(1, 1, 1);
    }
  }, [isEyesClosed, leftEye, rightEye]);

  // Add some gentle animation to the bear
  useEffect(() => {
    if (!bearHead) return;

    const interval = setInterval(() => {
      // Gentle bobbing motion
      bearHead.position.y = Math.sin(Date.now() * 0.001) * 0.05;
      
      // Slight head tilt
      bearHead.rotation.z = Math.sin(Date.now() * 0.0005) * 0.05;
    }, 16);

    return () => clearInterval(interval);
  }, [bearHead]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeBear;
