'use client';

import React, { useEffect } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Pen, MousePointer2, Square, Circle, Eraser, Undo2, Redo2 } from 'lucide-react';

const COLORS = ['#1a1a1a', '#e03131', '#2f9e44', '#1971c2', '#f08c00', '#9c36b5'];
const SIZES = [2, 4, 8, 12, 16];

export default function Toolbar() {
  const { currentTool, setTool, currentColor, setColor, currentSize, setSize, theme, setTheme } = useCanvasStore();

  useEffect(() => {
    // Set data-theme on html element
    const root = document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);



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
      {currentTool === 'pen' && (
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
      <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '4px' }}>
        <button 
          className={`icon-btn ${currentTool === 'select' ? 'active' : ''}`}
          onClick={() => setTool('select')}
          title="Select / Pan"
        >
          <MousePointer2 size={20} />
        </button>
        <button 
          className={`icon-btn ${currentTool === 'pen' ? 'active' : ''}`}
          onClick={() => setTool('pen')}
          title="Draw"
        >
          <Pen size={20} />
        </button>
        <button 
          className={`icon-btn ${currentTool === 'eraser' ? 'active' : ''}`}
          onClick={() => setTool('eraser')}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>
        <button 
          className={`icon-btn ${currentTool === 'rect' ? 'active' : ''}`}
          onClick={() => setTool('rect')}
          title="Rectangle"
        >
          <Square size={20} />
        </button>
        <button 
          className={`icon-btn ${currentTool === 'ellipse' ? 'active' : ''}`}
          onClick={() => setTool('ellipse')}
          title="Ellipse"
        >
          <Circle size={20} />
        </button>

        <div style={{ width: '1px', height: '32px', margin: '4px', background: 'var(--border-color)' }} />

        <button className="icon-btn" title="Undo">
          <Undo2 size={20} />
        </button>
        <button className="icon-btn" title="Redo">
          <Redo2 size={20} />
        </button>
      </div>
    </div>
  );
}
