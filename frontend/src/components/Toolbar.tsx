'use client';

import React, { useEffect } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Pen, MousePointer2, Minus, Square, AppWindow, Circle, Triangle, Play, Diamond, Pentagon, Hexagon, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Sparkle, Star, Sparkles, Heart, Zap, Eraser, Undo2, Redo2 } from 'lucide-react';

const COLORS = ['#1a1a1a', '#e03131', '#2f9e44', '#1971c2', '#f08c00', '#9c36b5'];
const SIZES = [2, 4, 8, 12, 16];
const SHAPES = [
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'rect', icon: Square, label: 'Rectangle' },
  { id: 'rounded_rect', icon: AppWindow, label: 'Rounded Rectangle' },
  { id: 'ellipse', icon: Circle, label: 'Ellipse' },
  { id: 'triangle', icon: Triangle, label: 'Triangle' },
  { id: 'right_triangle', icon: Play, label: 'Right Triangle' },
  { id: 'diamond', icon: Diamond, label: 'Diamond' },
  { id: 'pentagon', icon: Pentagon, label: 'Pentagon' },
  { id: 'hexagon', icon: Hexagon, label: 'Hexagon' },
  { id: 'arrow_right', icon: ArrowRight, label: 'Right Arrow' },
  { id: 'arrow_left', icon: ArrowLeft, label: 'Left Arrow' },
  { id: 'arrow_up', icon: ArrowUp, label: 'Up Arrow' },
  { id: 'arrow_down', icon: ArrowDown, label: 'Down Arrow' },
  { id: 'star_4', icon: Sparkle, label: '4-Point Star' },
  { id: 'star_5', icon: Star, label: '5-Point Star' },
  { id: 'star_6', icon: Sparkles, label: '6-Point Star' },
  { id: 'heart', icon: Heart, label: 'Heart' },
  { id: 'lightning', icon: Zap, label: 'Lightning' }
] as const;

export default function Toolbar() {
  const { currentTool, setTool, currentColor, setColor, currentSize, setSize, theme, undo, redo } = useCanvasStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const isShapeTool = SHAPES.some(s => s.id === currentTool);

  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      zIndex: 10,
      width: 'max-content',
      maxWidth: '90vw'
    }}>
      {/* Colors & Sizes Toolbar */}
      {(currentTool === 'pen' || isShapeTool) && (
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: currentColor === c ? '2px solid var(--text-primary)' : '2px solid transparent',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: `${s}px`,
                  height: `${s}px`,
                  borderRadius: '50%',
                  backgroundColor: currentSize === s ? 'var(--text-primary)' : 'var(--text-secondary)'
                }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Tools Toolbar */}
      <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className={`icon-btn ${currentTool === 'select' ? 'active' : ''}`} onClick={() => setTool('select')} title="Select / Pan">
            <MousePointer2 size={20} />
          </button>
          <button className={`icon-btn ${currentTool === 'pen' ? 'active' : ''}`} onClick={() => setTool('pen')} title="Draw">
            <Pen size={20} />
          </button>
          <button className={`icon-btn ${currentTool === 'eraser' ? 'active' : ''}`} onClick={() => setTool('eraser')} title="Eraser">
            <Eraser size={20} />
          </button>
        </div>
        
        <div style={{ width: '1px', height: '32px', margin: '4px', background: 'var(--border-color)' }} />

        {/* All Shapes directly inline */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '60vw', justifyContent: 'center' }}>
          {SHAPES.map(shape => (
            <button
              key={shape.id}
              className={`icon-btn ${currentTool === shape.id ? 'active' : ''}`}
              onClick={() => setTool(shape.id as any)}
              title={shape.label}
            >
              <shape.icon size={18} />
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '32px', margin: '4px', background: 'var(--border-color)' }} />

        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="icon-btn" title="Undo" onClick={undo}>
            <Undo2 size={20} />
          </button>
          <button className="icon-btn" title="Redo" onClick={redo}>
            <Redo2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
