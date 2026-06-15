'use client';

import { lazy, Suspense } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { use, useState, useEffect } from 'react';

const GET_CANVAS = gql`
  query GetCanvas($id: ID!) {
    canvas(id: $id) {
      id
      title
      workspaceId
    }
  }
`;

// Dynamic import Canvas to avoid SSR issues with window/canvas API
const Canvas = lazy(() => import('@/components/Canvas'));
const Toolbar = lazy(() => import('@/components/Toolbar'));
const ZoomControls = lazy(() => import('@/components/ZoomControls'));

import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Edit2, Share2, Download, Trash2, Eraser } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CanvasPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  
  const { data, loading, error } = useQuery(GET_CANVAS, {
    variables: { id }
  });

  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.canvas-menu-container')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => setMounted(true), []);

  // Hard-lock all scrolling while on the canvas page
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyHeight = body.style.height;

    // CSS class approach (targets .app-container, .main-content etc.)
    body.classList.add('canvas-mode');

    // JS direct approach (targets html and body themselves)
    html.style.overflow = 'hidden';
    html.style.height = '100%';
    body.style.overflow = 'hidden';
    body.style.height = '100%';

    return () => {
      body.classList.remove('canvas-mode');
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
    };
  }, []);

  const title = (data as any)?.canvas?.title || (loading ? 'Loading...' : 'Canvas Not Found');

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      {/* Header/Nav overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        pointerEvents: 'none' // Let clicks pass through except on children
      }}>
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} title="Go Back" className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'background 0.2s, opacity 0.2s'
          }} onMouseOver={e => e.currentTarget.style.opacity = '0.8'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            <ChevronLeft size={20} />
          </button>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            V
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
            {title}
          </h1>
        </div>

        <div className="canvas-menu-container" style={{ pointerEvents: 'auto', display: 'flex', gap: '12px', position: 'relative' }}>
          <button className="glass-panel" style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'background 0.2s, opacity 0.2s',
            background: isMenuOpen ? 'var(--bg-hover)' : ''
          }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          title="Menu"
          >
            <MoreVertical size={20} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{ position: 'absolute', top: 'calc(100% + 8px)', right: '0', width: '200px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '8px', zIndex: 101 }}
              >
                <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '8px', textAlign: 'left', fontSize: '14px', fontWeight: 500, transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => setIsMenuOpen(false)}>
                  <Edit2 size={16} /> Rename Canvas
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '8px', textAlign: 'left', fontSize: '14px', fontWeight: 500, transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => setIsMenuOpen(false)}>
                  <Share2 size={16} /> Share...
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '8px', textAlign: 'left', fontSize: '14px', fontWeight: 500, transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => setIsMenuOpen(false)}>
                  <Download size={16} /> Export as PNG
                </button>
                <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
                <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '8px', textAlign: 'left', fontSize: '14px', fontWeight: 500, transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => { useCanvasStore.getState().clearElements(); setIsMenuOpen(false); }}>
                  <Eraser size={16} /> Clear Canvas
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: '8px', textAlign: 'left', fontSize: '14px', fontWeight: 500, transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => setIsMenuOpen(false)}>
                  <Trash2 size={16} /> Delete Canvas
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Suspense fallback={<div>Loading Canvas...</div>}>
        <Canvas templateId={templateId} />
        <Toolbar />
        <ZoomControls />
      </Suspense>
    </main>
  );
}
