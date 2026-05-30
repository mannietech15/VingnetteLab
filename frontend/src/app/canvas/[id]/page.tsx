'use client';

import dynamic from 'next/dynamic';
import { Moon, Sun } from 'lucide-react';
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

export default function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { theme, setTheme } = useCanvasStore();
  
  const { data, loading, error } = useQuery(GET_CANVAS, {
    variables: { id }
  });

  const toggleTheme = () => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Determine current effective theme for icon rendering
  const isCurrentlyDark = mounted && (theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches));

  const title = (data as any)?.canvas?.title || (loading ? 'Loading...' : 'Canvas Not Found');

  return (
    <main style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', flex: 1 }}>
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
          <button className="icon-btn glass-panel" style={{ width: '40px', height: '40px', padding: 0 }} onClick={toggleTheme}>
            {mounted ? (isCurrentlyDark ? <Sun size={20} /> : <Moon size={20} />) : <div style={{width: 20, height: 20}} />}
          </button>
          <button className="glass-panel" style={{ 
            padding: '0 16px', 
            height: '40px', 
            border: 'none', 
            background: 'var(--accent-primary)', 
            color: 'white', 
            fontWeight: 500,
            cursor: 'pointer' 
          }}>
            Share
          </button>
        </div>
      </div>

      <Canvas />
      <Toolbar />
    </main>
  );
}
