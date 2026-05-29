'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Pen, MousePointer2, Minus, Square, AppWindow, Circle, Triangle, Play, Diamond, Pentagon, Hexagon, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Sparkle, Star, Sparkles, Heart, Zap, Eraser, Undo2, Redo2, ChevronUp } from 'lucide-react';

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
  const [showShapes, setShowShapes] = useState(false);
  const shapesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Click outside to close shapes menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shapesMenuRef.current && !shapesMenuRef.current.contains(e.target as Node)) {
        setShowShapes(false);
      }
    };
    if (showShapes) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShapes]);

  const isShapeTool = SHAPES.some(s => s.id === currentTool);
  const CurrentShapeIcon = SHAPES.find(s => s.id === currentTool)?.icon || Square;

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
      <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '4px', position: 'relative' }}>
        <button 
          className={`icon-btn ${currentTool === 'select' ? 'active' : ''}`}
          onClick={() => { setTool('select'); setShowShapes(false); }}
          title="Select / Pan"
        >
          <MousePointer2 size={20} />
        </button>
        <button 
          className={`icon-btn ${currentTool === 'pen' ? 'active' : ''}`}
          onClick={() => { setTool('pen'); setShowShapes(false); }}
          title="Draw"
        >
          <Pen size={20} />
        </button>
        <button 
          className={`icon-btn ${currentTool === 'eraser' ? 'active' : ''}`}
          onClick={() => { setTool('eraser'); setShowShapes(false); }}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>
        
        {/* Shape Menu Button */}
        <div ref={shapesMenuRef} style={{ position: 'relative' }}>
          <button 
            className={`icon-btn ${isShapeTool ? 'active' : ''}`}
            onClick={() => setShowShapes(!showShapes)}
            title="Shapes"
            style={{ display: 'flex', alignItems: 'center', gap: '2px', paddingRight: '4px' }}
          >
            <CurrentShapeIcon size={20} />
            <ChevronUp size={12} style={{ transform: showShapes ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          
          {/* Popover Menu: 6 columns like MS Paint */}
          {showShapes && (
            <div className="glass-panel" style={{
              position: 'absolute',
              bottom: 'calc(100% + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '8px',
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '4px',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              {SHAPES.map(shape => (
                <button
                  key={shape.id}
                  className={`icon-btn ${currentTool === shape.id ? 'active' : ''}`}
                  onClick={() => {
                    setTool(shape.id as any);
                    setShowShapes(false);
                  }}
                  title={shape.label}
                >
                  <shape.icon size={20} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '1px', height: '32px', margin: '4px', background: 'var(--border-color)' }} />

        <button className="icon-btn" title="Undo" onClick={undo}>
          <Undo2 size={20} />
        </button>
        <button className="icon-btn" title="Redo" onClick={redo}>
          <Redo2 size={20} />
        </button>
      </div>
    </div>
  );
}
