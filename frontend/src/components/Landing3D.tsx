'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';

function AnimatedSphere() {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.6}>
      <MeshDistortMaterial
        color="#8b5cf6"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
        emissive="#4c1d95"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}

export default function Landing3D() {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 0, 
      pointerEvents: 'none', 
      opacity: 0.8,
      maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)'
    }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#fff" />
        <directionalLight position={[-5, -5, -5]} intensity={1} color="#6366f1" />
        <AnimatedSphere />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
