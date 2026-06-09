'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCanvasStore, Tool, BrushType } from '@/store/useCanvasStore';
import { Pen, Paintbrush, MousePointer2, Minus, Plus, Square, AppWindow, Circle, Triangle, Play, Diamond, Pentagon, Hexagon, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Sparkle, Star, Sparkles, Heart, Zap, Eraser, Undo2, Redo2, ChevronUp, PaintBucket, Type } from 'lucide-react';

const COLORS = [
  // Row 1 – Blacks, Grays, Whites
  '#000000', '#1a1a1a', '#404040', '#737373', '#a3a3a3', '#d4d4d4', '#f5f5f5', '#ffffff',
  // Row 2 – Reds → Oranges
  '#7f1d1d', '#b91c1c', '#ef4444', '#f97316', '#fb923c', '#fdba74', '#fef3c7', '#fff7ed',
  // Row 3 – Yellows → Limes
  '#713f12', '#ca8a04', '#eab308', '#a3e635', '#84cc16', '#4ade80', '#22c55e', '#16a34a',
  // Row 4 – Greens → Teals
  '#14532d', '#166534', '#059669', '#10b981', '#2dd4bf', '#06b6d4', '#0891b2', '#0369a1',
  // Row 5 – Blues → Purples
  '#1e3a5f', '#1d4ed8', '#3b82f6', '#60a5fa', '#a78bfa', '#7c3aed', '#9333ea', '#c026d3',
  // Row 6 – Pinks → Browns
  '#db2777', '#f43f5e', '#fb7185', '#fda4af', '#d97706', '#92400e', '#78350f', '#451a03',
];

const PALETTE_ROWS = 6;
const PALETTE_COLS = 8;
const SIZES = [2, 4, 8, 12, 16];
const FONT_GROUPS = [
  {
    label: 'Sans-Serif',
    fonts: ['Inter', 'Roboto', 'Outfit', 'Montserrat', 'Lato', 'Poppins', 'Raleway', 'Nunito', 'Ubuntu', 'Quicksand', 'Josefin Sans']
  },
  {
    label: 'Serif',
    fonts: ['Playfair Display', 'Merriweather', 'Lora', 'Georgia', 'Times New Roman', 'Palatino', 'Garamond', 'Bookman']
  },
  {
    label: 'Display & Handwriting',
    fonts: ['Lucida Calligraphy', 'Dancing Script', 'Pacifico', 'Caveat', 'Great Vibes', 'Lobster', 'Permanent Marker', 'Righteous', 'Comfortaa', 'Bebas Neue', 'Anton', 'Cinzel', 'Comic Sans MS', 'Brush Script MT', 'Papyrus']
  },
  {
    label: 'Monospace',
    fonts: ['Fira Code', 'Inconsolata', 'Space Mono', 'Courier New', 'Lucida Console']
  },
  {
    label: 'System & Classic',
    fonts: ['Arial', 'Helvetica', 'Verdana', 'Trebuchet MS', 'Tahoma', 'Geneva', 'Arial Black', 'Impact', 'Century Gothic', 'Optima', 'Copperplate']
  }
];
const BRUSHES: { id: BrushType; label: string; preview: React.ReactNode }[] = [
  {
    id: 'round',
    label: 'Round',
    preview: (
      <svg width="52" height="28" viewBox="0 0 52 28">
        <path d="M4 14 Q13 8 26 14 Q39 20 48 14" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'flat',
    label: 'Flat',
    preview: (
      <svg width="52" height="28" viewBox="0 0 52 28">
        <path d="M4 14 Q13 8 26 14 Q39 20 48 14" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter" />
      </svg>
    ),
  },
  {
    id: 'marker',
    label: 'Marker',
    preview: (
      <svg width="52" height="28" viewBox="0 0 52 28">
        <path d="M4 14 Q13 8 26 14 Q39 20 48 14" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
        <path d="M4 14 Q13 8 26 14 Q39 20 48 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'splatter',
    label: 'Splatter',
    preview: (
      <svg width="52" height="28" viewBox="0 0 52 28">
        {[4,10,16,22,28,34,40,46].flatMap((x, i) => [
          <circle key={`a${i}`} cx={x} cy={14 + Math.sin(i*1.3)*5} r="1.5" fill="currentColor" />,
          <circle key={`b${i}`} cx={x + 3} cy={14 + Math.cos(i*2.1)*4} r="1" fill="currentColor" />,
          <circle key={`c${i}`} cx={x - 2} cy={14 + Math.sin(i*0.9)*6} r="1.2" fill="currentColor" />,
        ])}
      </svg>
    ),
  },
  {
    id: 'calligraphy',
    label: 'Calligraphy',
    preview: (
      <svg width="52" height="28" viewBox="0 0 52 28">
        <path d="M4 22 C12 4 24 4 32 14 C38 20 44 10 48 6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M4 22 C12 12 24 8 32 14 C38 20 44 14 48 6" fill="currentColor" strokeWidth="0"
          style={{ transform: 'scaleX(1)' }}
        />
        {/* Calligraphy ribbon using thick angled strokes */}
        {[4,10,16,22,28,34,40,46].map((x, i) => {
          const y = 22 - i * 2;
          return <ellipse key={i} cx={x} cy={y} rx={4 - i * 0.1} ry={1} transform={`rotate(-45 ${x} ${y})`} fill="currentColor" />;
        })}
      </svg>
    ),
  },
];


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
  const { currentTool, setTool, currentColor, setColor, currentSize, setSize, currentBrushType, setBrushType, currentFontFamily, setFontFamily, currentFontSize, setFontSize, isFilled, setIsFilled, theme, undo, redo } = useCanvasStore();
  const [showShapes, setShowShapes] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showBrushPicker, setShowBrushPicker] = useState(false);
  const shapesMenuRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const brushPickerRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

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
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setShowPalette(false);
      }
      if (brushPickerRef.current && !brushPickerRef.current.contains(e.target as Node)) {
        setShowBrushPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isShapeTool = SHAPES.some(s => s.id === currentTool);
  const CurrentShapeIcon = SHAPES.find(s => s.id === currentTool)?.icon || Square;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      zIndex: 10,
    }}>
      {/* Colors & Sizes Toolbar — pen / shape / text tools */}
      {(currentTool === 'pen' || isShapeTool || currentTool === 'text') && (
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          
          {/* Color swatch button — opens palette popover */}
          <div ref={paletteRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPalette(p => !p)}
              title="Choose color"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: currentColor,
                border: '2px solid var(--border-color)',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.15)',
                transition: 'transform 0.15s',
                flexShrink: 0,
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.12)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />

            {/* Palette Popover */}
            {showPalette && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 12px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '10px',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                animation: 'fadeIn 0.15s ease-out',
                zIndex: 20,
              }}>
                {/* 6 rows × 8 cols grid */}
                {Array.from({ length: PALETTE_ROWS }).map((_, row) => (
                  <div key={row} style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: PALETTE_COLS }).map((_, col) => {
                      const color = COLORS[row * PALETTE_COLS + col];
                      const isSelected = currentColor === color;
                      return (
                        <button
                          key={color}
                          onClick={() => { setColor(color); setShowPalette(false); }}
                          title={color}
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '4px',
                            backgroundColor: color,
                            border: isSelected
                              ? '2px solid var(--text-primary)'
                              : color === '#ffffff' || color === '#f5f5f5' || color === '#fef3c7' || color === '#fff7ed'
                                ? '1px solid var(--border-color)'
                                : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'transform 0.1s, box-shadow 0.1s',
                            boxShadow: isSelected ? '0 0 0 1px var(--bg-secondary)' : 'none',
                          }}
                          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.zIndex = '2'; }}
                          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = '1'; }}
                        />
                      );
                    })}
                  </div>
                ))}

                {/* Divider + Custom color picker */}
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
                        border: '2px solid transparent', cursor: 'pointer',
                        transition: 'transform 0.1s',
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={currentColor}
                      onChange={e => { setColor(e.target.value); }}
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                    />
                  </div>
                  {/* Show the currently active custom color hex */}
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                    {currentColor.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {currentTool === 'text' && (

              <>
                <select 
                  value={currentFontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontFamily: `"${currentFontFamily}", sans-serif`,
                    outline: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    maxWidth: '160px'
                  }}
                >
                  {FONT_GROUPS.map(group => (
                    <optgroup key={group.label} label={group.label}>
                      {group.fonts.map(f => (
                        <option key={f} value={f} style={{fontFamily: `"${f}", sans-serif`, color: '#1a1a1a'}}>{f}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 4px' }} />
              </>
            )}
            {isShapeTool && (
              <>
                <button
                  onClick={() => setIsFilled(!isFilled)}
                  className={`icon-btn ${isFilled ? 'active' : ''}`}
                  title="Toggle Fill"
                  style={{ width: '28px', height: '28px', padding: '4px' }}
                >
                  <PaintBucket size={16} />
                </button>
                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 4px' }} />
              </>
            )}
            {currentTool === 'text' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => setFontSize(currentFontSize - 2)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.15s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  title="Decrease font size"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={currentFontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value) || 8)}
                  min={8}
                  max={200}
                  style={{
                    width: '48px',
                    textAlign: 'center',
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '6px',
                    padding: '4px 2px',
                    fontSize: '13px',
                    fontWeight: 500,
                    outline: 'none',
                    appearance: 'textfield',
                    MozAppearance: 'textfield' as any
                  }}
                />
                <button
                  onClick={() => setFontSize(currentFontSize + 2)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.15s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  title="Increase font size"
                >
                  <Plus size={14} />
                </button>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '2px' }}>px</span>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}

      {/* Brush Tool Toolbar — brush type + color */}
      {currentTool === 'brush' && (
        <div className="glass-panel" style={{ padding: '8px 14px', display: 'flex', gap: '12px', alignItems: 'center' }}>

          {/* Brush type picker button */}
          <div ref={brushPickerRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowBrushPicker(p => !p)}
              title="Choose brush"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-color)',
                background: showBrushPicker ? 'var(--bg-hover)' : 'transparent',
                color: currentColor,
                cursor: 'pointer',
                transition: 'background 0.15s, transform 0.12s',
                fontSize: '12px',
                fontWeight: 600,
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseOut={e => e.currentTarget.style.background = showBrushPicker ? 'var(--bg-hover)' : 'transparent'}
            >
              {/* Preview of the current brush in the toolbar */}
              <span style={{ color: currentColor, display: 'flex', alignItems: 'center' }}>
                {BRUSHES.find(b => b.id === currentBrushType)?.preview}
              </span>
              <span style={{ color: 'var(--text-primary)', fontSize: '11px', textTransform: 'capitalize' }}>
                {currentBrushType}
              </span>
              <ChevronUp size={11} style={{ color: 'var(--text-secondary)', transform: showBrushPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Brush Picker Popover */}
            {showBrushPicker && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 12px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '10px 8px',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                animation: 'fadeIn 0.15s ease-out',
                zIndex: 20,
                minWidth: '160px',
              }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 4px 4px' }}>Brush Type</span>
                {BRUSHES.map(brush => (
                  <button
                    key={brush.id}
                    onClick={() => { setBrushType(brush.id); setShowBrushPicker(false); }}
                    title={brush.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: currentBrushType === brush.id ? '1.5px solid var(--accent-primary)' : '1.5px solid transparent',
                      background: currentBrushType === brush.id ? 'var(--bg-hover)' : 'transparent',
                      cursor: 'pointer',
                      color: currentColor,
                      transition: 'background 0.12s, border 0.12s',
                      width: '100%',
                      textAlign: 'left',
                    }}
                    onMouseOver={e => { if (currentBrushType !== brush.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseOut={e => { if (currentBrushType !== brush.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{brush.preview}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{brush.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

          {/* Color swatch for brush */}
          <div ref={paletteRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPalette(p => !p)}
              title="Choose color"
              style={{
                width: '28px', height: '28px', borderRadius: '6px',
                backgroundColor: currentColor,
                border: '2px solid var(--border-color)',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.15)',
                transition: 'transform 0.15s', flexShrink: 0,
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.12)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            {/* Palette Popover (shared) */}
            {showPalette && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 12px)', left: '50%',
                transform: 'translateX(-50%)', background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)', borderRadius: '12px',
                padding: '10px', boxShadow: 'var(--shadow-lg)',
                display: 'flex', flexDirection: 'column', gap: '4px',
                animation: 'fadeIn 0.15s ease-out', zIndex: 20,
              }}>
                {Array.from({ length: PALETTE_ROWS }).map((_, row) => (
                  <div key={row} style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: PALETTE_COLS }).map((_, col) => {
                      const color = COLORS[row * PALETTE_COLS + col];
                      const isSelected = currentColor === color;
                      return (
                        <button
                          key={color}
                          onClick={() => { setColor(color); setShowPalette(false); }}
                          title={color}
                          style={{
                            width: '22px', height: '22px', borderRadius: '4px',
                            backgroundColor: color,
                            border: isSelected ? '2px solid var(--text-primary)'
                              : (color === '#ffffff' || color === '#f5f5f5' || color === '#fef3c7' || color === '#fff7ed'
                                ? '1px solid var(--border-color)' : '2px solid transparent'),
                            cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s',
                            boxShadow: isSelected ? '0 0 0 1px var(--bg-secondary)' : 'none',
                          }}
                          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.zIndex = '2'; }}
                          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = '1'; }}
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
                    <input ref={colorInputRef} type="color" value={currentColor} onChange={e => setColor(e.target.value)}
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                    {currentColor.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

          {/* Size dots for brush */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'transparent', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <div style={{
                  width: `${s}px`, height: `${s}px`, borderRadius: '50%',
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
          title="Pen"
        >
          <Pen size={20} />
        </button>
        <button 
          className={`icon-btn ${currentTool === 'brush' ? 'active' : ''}`}
          onClick={() => { setTool('brush'); setShowShapes(false); }}
          title="Paintbrush"
        >
          <Paintbrush size={20} />
        </button>
        <button 
          className={`icon-btn ${currentTool === 'text' ? 'active' : ''}`}
          onClick={() => { setTool('text'); setShowShapes(false); }}
          title="Text"
        >
          <Type size={20} />
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
            <div style={{
              position: 'absolute',
              bottom: 'calc(100% + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '8px',
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '4px',
              animation: 'fadeIn 0.2s ease-out',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              borderRadius: '12px'
            }}>
              {SHAPES.map(shape => (
                <button
                  key={shape.id}
                  className={`icon-btn ${currentTool === shape.id ? 'active' : ''}`}
                  onClick={() => {
                    setTool(shape.id as Tool);
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
