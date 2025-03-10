
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
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const mouseTimerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      // Invert the Y value to fix the direction issue
      // When mouse is at the bottom (high Y value), we want negative Y for the bear to look down
      const y = -((event.clientY / window.innerHeight) * 2 - 1);
      
      setMousePosition({ x, y });
      setIsMouseMoving(true);
      
      // Reset the mouse moving flag after a short delay
      if (mouseTimerRef.current) {
        window.clearTimeout(mouseTimerRef.current);
      }
      
      mouseTimerRef.current = window.setTimeout(() => {
        setIsMouseMoving(false);
      }, 300);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimerRef.current) {
        window.clearTimeout(mouseTimerRef.current);
      }
    };
  }, []);

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
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.enableZoom = true;
    orbitControls.enablePan = false;
    orbitControls.rotateSpeed = 0.5;
    orbitControls.minDistance = 3;
    orbitControls.maxDistance = 8;
    setControls(orbitControls);

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
      orbitControls.update();
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

  // Combined animation effect for both mouse tracking and idle
  useEffect(() => {
    if (!bearHead) return;
    
    // Store initial position for reference
    const initialY = 0;
    
    // Single animation function that handles both mouse tracking and idle
    const animateBear = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      const animate = () => {
        // Always apply gentle bobbing motion to Y position
        bearHead.position.y = initialY + Math.sin(Date.now() * 0.001) * 0.05;
        
        if (isMouseMoving && !isEyesClosed) {
          // Mouse tracking mode
          // Calculate target rotation based on mouse position
          const targetRotationX = mousePosition.y * 0.5; // Using the correct sign for vertical tracking
          const targetRotationY = mousePosition.x * 0.8;
          
          // Smoothly animate to the target rotation
          bearHead.rotation.x = bearHead.rotation.x + (targetRotationX - bearHead.rotation.x) * 0.05;
          bearHead.rotation.y = bearHead.rotation.y + (targetRotationY - bearHead.rotation.y) * 0.05;
          
          // Keep a slight z-tilt for character
          bearHead.rotation.z = Math.sin(Date.now() * 0.0005) * 0.02;
        } else if (!isEyesClosed) {
          // Idle animation mode - very subtle movements
          // Gentle looking around when idle
          const idleRotationX = Math.sin(Date.now() * 0.0004) * 0.1;
          const idleRotationY = Math.sin(Date.now() * 0.0003) * 0.2;
          
          // Smoothly transition to idle rotations
          bearHead.rotation.x = bearHead.rotation.x + (idleRotationX - bearHead.rotation.x) * 0.01;
          bearHead.rotation.y = bearHead.rotation.y + (idleRotationY - bearHead.rotation.y) * 0.01;
          bearHead.rotation.z = Math.sin(Date.now() * 0.0005) * 0.05;
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start the animation
    animateBear();
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bearHead, mousePosition, isMouseMoving, isEyesClosed]);

  // Disable orbit controls when mouse is moving (to prevent conflicts)
  useEffect(() => {
    if (!controls) return;
    
    controls.enabled = !isMouseMoving;
  }, [controls, isMouseMoving]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeBear;
