'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCanvasStore, Tool, BrushType } from '@/store/useCanvasStore';
import { Pen, Paintbrush, MousePointer2, Minus, Plus, Square, AppWindow, Circle, Triangle, Play, Diamond, Pentagon, Hexagon, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Sparkle, Star, Sparkles, Heart, Zap, Eraser, Undo2, Redo2, ChevronUp, PaintBucket, Type } from 'lucide-react';

const COLORS = [
  '#000000', '#1a1a1a', '#404040', '#737373', '#a3a3a3', '#d4d4d4', '#f5f5f5', '#ffffff',
  '#7f1d1d', '#b91c1c', '#ef4444', '#f97316', '#fb923c', '#fdba74', '#fef3c7', '#fff7ed',
  '#713f12', '#ca8a04', '#eab308', '#a3e635', '#84cc16', '#4ade80', '#22c55e', '#16a34a',
  '#14532d', '#166534', '#059669', '#10b981', '#2dd4bf', '#06b6d4', '#0891b2', '#0369a1',
  '#1e3a5f', '#1d4ed8', '#3b82f6', '#60a5fa', '#a78bfa', '#7c3aed', '#9333ea', '#c026d3',
  '#db2777', '#f43f5e', '#fb7185', '#fda4af', '#d97706', '#92400e', '#78350f', '#451a03',
];
const PALETTE_ROWS = 6;
const PALETTE_COLS = 8;
const SIZES = [2, 4, 8, 12, 16];

const FONT_GROUPS = [
  { label: 'Sans-Serif', fonts: ['Inter', 'Roboto', 'Outfit', 'Montserrat', 'Lato', 'Poppins', 'Raleway', 'Nunito', 'Ubuntu', 'Quicksand', 'Josefin Sans'] },
  { label: 'Serif', fonts: ['Playfair Display', 'Merriweather', 'Lora', 'Georgia', 'Times New Roman', 'Palatino', 'Garamond', 'Bookman'] },
  { label: 'Display & Handwriting', fonts: ['Lucida Calligraphy', 'Dancing Script', 'Pacifico', 'Caveat', 'Great Vibes', 'Lobster', 'Permanent Marker', 'Righteous', 'Comfortaa', 'Bebas Neue', 'Anton', 'Cinzel', 'Comic Sans MS', 'Brush Script MT', 'Papyrus'] },
  { label: 'Monospace', fonts: ['Fira Code', 'Inconsolata', 'Space Mono', 'Courier New', 'Lucida Console'] },
  { label: 'System & Classic', fonts: ['Arial', 'Helvetica', 'Verdana', 'Trebuchet MS', 'Tahoma', 'Geneva', 'Arial Black', 'Impact', 'Century Gothic', 'Optima', 'Copperplate'] },
];

const BRUSHES: { id: BrushType; label: string; preview: React.ReactNode }[] = [
  {
    id: 'round', label: 'Round',
    preview: (
      <svg width="56" height="24" viewBox="0 0 56 24">
        <path d="M4 12 Q14 6 28 12 Q42 18 52 12" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'flat', label: 'Flat',
    preview: (
      <svg width="56" height="24" viewBox="0 0 56 24">
        <path d="M4 12 Q14 6 28 12 Q42 18 52 12" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter" />
      </svg>
    ),
  },
  {
    id: 'marker', label: 'Marker',
    preview: (
      <svg width="56" height="24" viewBox="0 0 56 24">
        <path d="M4 12 Q14 6 28 12 Q42 18 52 12" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        <path d="M4 12 Q14 6 28 12 Q42 18 52 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'splatter', label: 'Splatter',
    preview: (
      <svg width="56" height="24" viewBox="0 0 56 24">
        {[4,10,16,22,28,34,40,46,52].flatMap((x, i) => [
          <circle key={`a${i}`} cx={x} cy={12 + Math.sin(i * 1.3) * 5} r="1.5" fill="currentColor" />,
          <circle key={`b${i}`} cx={x + 2} cy={12 + Math.cos(i * 2.1) * 4} r="1" fill="currentColor" />,
          <circle key={`c${i}`} cx={x - 2} cy={12 + Math.sin(i * 0.9) * 6} r="1.2" fill="currentColor" />,
        ])}
      </svg>
    ),
  },
  {
    id: 'calligraphy', label: 'Calligraphy',
    preview: (
      <svg width="56" height="24" viewBox="0 0 56 24">
        {[4,10,16,22,28,34,40,46,52].map((x, i) => {
          const y = 20 - i * 1.5;
          return <ellipse key={i} cx={x} cy={y} rx={5 - i * 0.15} ry={1.1} transform={`rotate(-45 ${x} ${y})`} fill="currentColor" />;
        })}
      </svg>
    ),
  },
];

const SHAPES = [
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'rect', icon: Square, label: 'Rectangle' },
  { id: 'rounded_rect', icon: AppWindow, label: 'Rounded Rect' },
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
  { id: 'lightning', icon: Zap, label: 'Lightning' },
] as const;

export default function Toolbar() {
  const {
    currentTool, setTool,
    currentColor, setColor,
    currentSize, setSize,
    currentBrushType, setBrushType,
    currentFontFamily, setFontFamily,
    currentFontSize, setFontSize,
    isFilled, setIsFilled,
    theme, undo, redo,
  } = useCanvasStore();

  const [showShapes, setShowShapes]         = useState(false);
  const [showPalette, setShowPalette]       = useState(false);
  const [showBrushPanel, setShowBrushPanel] = useState(false);

  const shapesMenuRef  = useRef<HTMLDivElement>(null);
  const paletteRef     = useRef<HTMLDivElement>(null);
  const brushPanelRef  = useRef<HTMLDivElement>(null);
  const colorInputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shapesMenuRef.current && !shapesMenuRef.current.contains(e.target as Node)) setShowShapes(false);
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) setShowPalette(false);
      if (brushPanelRef.current && !brushPanelRef.current.contains(e.target as Node)) setShowBrushPanel(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isShapeTool = SHAPES.some(s => s.id === currentTool);
  const CurrentShapeIcon = SHAPES.find(s => s.id === currentTool)?.icon || Square;

  // ── Shared colour palette grid (used in pen toolbar AND brush panel) ──
  const ColorGrid = () => (
    <>
      {Array.from({ length: PALETTE_ROWS }).map((_, row) => (
        <div key={row} style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: PALETTE_COLS }).map((_, col) => {
            const color = COLORS[row * PALETTE_COLS + col];
            const isSelected = currentColor === color;
            const isLight = ['#ffffff','#f5f5f5','#fef3c7','#fff7ed'].includes(color);
            return (
              <button
                key={color}
                onClick={() => { setColor(color); setShowPalette(false); }}
                title={color}
                style={{
                  width: '22px', height: '22px', borderRadius: '4px',
                  backgroundColor: color,
                  border: isSelected ? '2px solid var(--text-primary)' : isLight ? '1px solid var(--border-color)' : '2px solid transparent',
                  cursor: 'pointer', transition: 'transform 0.1s',
                  boxShadow: isSelected ? '0 0 0 1px var(--bg-secondary)' : 'none',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              />
            );
          })}
        </div>
      ))}
      <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Custom</span>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => colorInputRef.current?.click()}
            title="Custom color"
            style={{
              width: '22px', height: '22px', borderRadius: '4px',
              background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
              border: '2px solid transparent', cursor: 'pointer', transition: 'transform 0.1s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          <input ref={colorInputRef} type="color" value={currentColor}
            onChange={e => setColor(e.target.value)}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} />
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          {currentColor.toUpperCase()}
        </span>
      </div>
    </>
  );

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 10,
    }}>

      {/* ── Secondary toolbar: pen / shape / text ── */}
      {(currentTool === 'pen' || isShapeTool || currentTool === 'text') && (
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', gap: '16px', alignItems: 'center' }}>

          {/* Color swatch */}
          <div ref={paletteRef} style={{ position: 'relative' }}>
            <button onClick={() => setShowPalette(p => !p)} title="Choose color"
              style={{
                width: '28px', height: '28px', borderRadius: '6px', backgroundColor: currentColor,
                border: '2px solid var(--border-color)', cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'transform 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.12)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            {showPalette && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                borderRadius: '12px', padding: '10px', boxShadow: 'var(--shadow-lg)',
                display: 'flex', flexDirection: 'column', gap: '4px',
                animation: 'fadeIn 0.15s ease-out', zIndex: 20,
              }}>
                <ColorGrid />
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Font controls for text tool */}
            {currentTool === 'text' && (
              <>
                <select value={currentFontFamily} onChange={e => setFontFamily(e.target.value)}
                  style={{
                    background: 'transparent', border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)', padding: '4px 8px', borderRadius: '4px',
                    fontFamily: `"${currentFontFamily}", sans-serif`, outline: 'none', cursor: 'pointer',
                    fontSize: '14px', maxWidth: '160px',
                  }}>
                  {FONT_GROUPS.map(group => (
                    <optgroup key={group.label} label={group.label}>
                      {group.fonts.map(f => <option key={f} value={f} style={{ fontFamily: `"${f}", sans-serif`, color: '#1a1a1a' }}>{f}</option>)}
                    </optgroup>
                  ))}
                </select>
                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 4px' }} />
              </>
            )}

            {/* Fill toggle for shapes */}
            {isShapeTool && (
              <>
                <button onClick={() => setIsFilled(!isFilled)} className={`icon-btn ${isFilled ? 'active' : ''}`}
                  title="Toggle Fill" style={{ width: '28px', height: '28px', padding: '4px' }}>
                  <PaintBucket size={16} />
                </button>
                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 4px' }} />
              </>
            )}

            {/* Font size vs brush size */}
            {currentTool === 'text' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button onClick={() => setFontSize(currentFontSize - 2)}
                  style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  title="Decrease font size"><Minus size={14} /></button>
                <input type="number" value={currentFontSize} onChange={e => setFontSize(parseInt(e.target.value) || 8)}
                  min={8} max={200}
                  style={{ width: '48px', textAlign: 'center', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', padding: '4px 2px', fontSize: '13px', fontWeight: 500, outline: 'none', appearance: 'textfield', MozAppearance: 'textfield' as any }} />
                <button onClick={() => setFontSize(currentFontSize + 2)}
                  style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  title="Increase font size"><Plus size={14} /></button>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '2px' }}>px</span>
              </div>
            ) : (
              <>
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <div style={{ width: `${s}px`, height: `${s}px`, borderRadius: '50%', backgroundColor: currentSize === s ? 'var(--text-primary)' : 'var(--text-secondary)' }} />
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Main Tools Toolbar ── */}
      <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '4px', position: 'relative' }}>

        <button className={`icon-btn ${currentTool === 'select' ? 'active' : ''}`}
          onClick={() => { setTool('select'); setShowShapes(false); setShowBrushPanel(false); }} title="Select / Pan">
          <MousePointer2 size={20} />
        </button>

        <button className={`icon-btn ${currentTool === 'pen' ? 'active' : ''}`}
          onClick={() => { setTool('pen'); setShowShapes(false); setShowBrushPanel(false); }} title="Pen">
          <Pen size={20} />
        </button>

        {/* ── Paintbrush button with popover ── */}
        <div ref={brushPanelRef} style={{ position: 'relative' }}>
          <button
            className={`icon-btn ${currentTool === 'brush' ? 'active' : ''}`}
            onClick={() => {
              setTool('brush');
              setShowShapes(false);
              setShowBrushPanel(p => !p);
            }}
            title="Paintbrush"
            style={{ display: 'flex', alignItems: 'center', gap: '2px', paddingRight: '4px' }}
          >
            <Paintbrush size={20} />
            <ChevronUp size={12} style={{ transform: showBrushPanel ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {/* Brush Panel Popover */}
          {showBrushPanel && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: '16px', padding: '12px', boxShadow: 'var(--shadow-lg)',
              display: 'flex', flexDirection: 'column', gap: '10px',
              animation: 'fadeIn 0.15s ease-out', zIndex: 20, minWidth: '220px',
            }}>

              {/* Brush Types */}
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Brush</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {BRUSHES.map(brush => (
                    <button
                      key={brush.id}
                      onClick={() => setBrushType(brush.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '6px 8px', borderRadius: '8px',
                        border: currentBrushType === brush.id ? '1.5px solid var(--accent-primary)' : '1.5px solid transparent',
                        background: currentBrushType === brush.id ? 'var(--bg-hover)' : 'transparent',
                        cursor: 'pointer', color: currentColor,
                        transition: 'background 0.12s, border 0.12s',
                        width: '100%', textAlign: 'left',
                      }}
                      onMouseOver={e => { if (currentBrushType !== brush.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                      onMouseOut={e => { if (currentBrushType !== brush.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ flexShrink: 0 }}>{brush.preview}</span>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{brush.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)' }} />

              {/* Colour */}
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Colour</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <ColorGrid />
                </div>
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)' }} />

              {/* Size */}
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Size</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <div style={{ width: `${s}px`, height: `${s}px`, borderRadius: '50%', backgroundColor: currentSize === s ? 'var(--text-primary)' : 'var(--text-secondary)' }} />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        <button className={`icon-btn ${currentTool === 'text' ? 'active' : ''}`}
          onClick={() => { setTool('text'); setShowShapes(false); setShowBrushPanel(false); }} title="Text">
          <Type size={20} />
        </button>

        <button className={`icon-btn ${currentTool === 'eraser' ? 'active' : ''}`}
          onClick={() => { setTool('eraser'); setShowShapes(false); setShowBrushPanel(false); }} title="Eraser">
          <Eraser size={20} />
        </button>

        {/* Shape Menu Button */}
        <div ref={shapesMenuRef} style={{ position: 'relative' }}>
          <button className={`icon-btn ${isShapeTool ? 'active' : ''}`}
            onClick={() => { setShowShapes(!showShapes); setShowBrushPanel(false); }}
            title="Shapes"
            style={{ display: 'flex', alignItems: 'center', gap: '2px', paddingRight: '4px' }}>
            <CurrentShapeIcon size={20} />
            <ChevronUp size={12} style={{ transform: showShapes ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showShapes && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
              padding: '8px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px',
              animation: 'fadeIn 0.2s ease-out', background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)', borderRadius: '12px',
            }}>
              {SHAPES.map(shape => (
                <button key={shape.id}
                  className={`icon-btn ${currentTool === shape.id ? 'active' : ''}`}
                  onClick={() => { setTool(shape.id as Tool); setShowShapes(false); }}
                  title={shape.label}>
                  <shape.icon size={20} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '1px', height: '32px', margin: '4px', background: 'var(--border-color)' }} />

        <button className="icon-btn" title="Undo" onClick={undo}><Undo2 size={20} /></button>
        <button className="icon-btn" title="Redo" onClick={redo}><Redo2 size={20} /></button>
      </div>
    </div>
  );
}
