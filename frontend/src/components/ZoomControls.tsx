'use client';

import React from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Minus, Plus } from 'lucide-react';

export default function ZoomControls() {
  const { camera, setCamera } = useCanvasStore();

  const handleZoomIn = () => {
    setCamera((prev) => {
      const newZ = Math.min(prev.z * 1.2, 5);
      return { ...prev, z: newZ };
    });
  };

  const handleZoomOut = () => {
    setCamera((prev) => {
      const newZ = Math.max(prev.z / 1.2, 0.1);
      return { ...prev, z: newZ };
    });
  };

  return (
    <div className="glass-panel zoom-controls">
      <button 
        className="icon-btn" 
        onClick={handleZoomOut} 
        title="Zoom Out"
        style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Minus size={18} />
      </button>
      <div style={{ fontSize: '14px', fontWeight: 500, minWidth: '48px', textAlign: 'center', color: 'var(--text-primary)' }}>
        {Math.round(camera.z * 100)}%
      </div>
      <button 
        className="icon-btn" 
        onClick={handleZoomIn} 
        title="Zoom In"
        style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
