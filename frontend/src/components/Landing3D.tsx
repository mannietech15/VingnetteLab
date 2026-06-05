'use client';

import ColorBends from './ColorBends';

export default function Landing3D() {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 0, 
      opacity: 0.75,
      maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
    }}>
      <ColorBends
        colors={["#3b82f6", "#10b981", "#059669", "#1e3a8a"]}
        rotation={45}
        speed={0.3}
        scale={1.2}
        frequency={1.5}
        warpStrength={1.5}
        mouseInfluence={1}
        noise={0.1}
        parallax={0.3}
        iterations={2}
        intensity={1.2}
        bandWidth={6}
        transparent
      />
    </div>
  );
}
