'use client';

import dynamic from 'next/dynamic';
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
const Canvas = dynamic(() => import('@/components/Canvas'), { ssr: false });
const Toolbar = dynamic(() => import('@/components/Toolbar'), { ssr: false });
const ZoomControls = dynamic(() => import('@/components/ZoomControls'), { ssr: false });

import { useSearchParams } from 'next/navigation';

export default function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  
  const { data, loading, error } = useQuery(GET_CANVAS, {
    variables: { id }
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Hard-lock all scrolling while on the canvas page
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyHeight = body.style.height;

    const prevHtmlPosition = html.style.position;
    const prevHtmlWidth = html.style.width;
    const prevBodyPosition = body.style.position;
    const prevBodyWidth = body.style.width;
    const prevBodyOverscroll = body.style.overscrollBehavior;

    // CSS class approach (targets .app-container, .main-content etc.)
    body.classList.add('canvas-mode');

    // JS direct approach (targets html and body themselves)
    html.style.overflow = 'hidden';
    html.style.height = '100%';
    html.style.position = 'fixed';
    html.style.width = '100%';
    
    body.style.overflow = 'hidden';
    body.style.height = '100%';
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.overscrollBehavior = 'none';

    // Prevent touchmove default on document to stop pull-to-refresh and rubber-banding
    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    return () => {
      body.classList.remove('canvas-mode');
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      html.style.position = prevHtmlPosition;
      html.style.width = prevHtmlWidth;
      
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      body.style.position = prevBodyPosition;
      body.style.width = prevBodyWidth;
      body.style.overscrollBehavior = prevBodyOverscroll;
      
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, []);

  const title = (data as any)?.canvas?.title || (loading ? 'Loading...' : 'Canvas Not Found');

  return (
    <main style={{ position: 'fixed', inset: 0, width: '100vw', height: '100dvh', overflow: 'hidden', touchAction: 'none' }}>
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

        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '12px' }}>
          <button className="glass-panel" style={{ 
            padding: '0 16px', 
            height: '40px', 
            border: 'none', 
            background: 'var(--accent-primary)', 
            color: 'white', 
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            Share
          </button>
        </div>
      </div>

      <Canvas templateId={templateId} />
      <Toolbar />
      <ZoomControls />
    </main>
  );
}
