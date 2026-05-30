'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Folder, FileText, ArrowRight, Sparkles, LayoutTemplate, Settings, Clock, Users } from 'lucide-react';
import TemplatePreview from '@/components/TemplatePreview';
import TiltedCard from '@/components/TiltedCard';

const GET_WORKSPACES = gql`
  query GetWorkspaces {
    workspaces {
      id
      name
      canvases {
        id
        title
        updatedAt
      }
    }
  }
`;

const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($name: String!) {
    createWorkspace(name: $name) {
      id
      name
      canvases {
        id
      }
    }
  }
`;

const CREATE_CANVAS = gql`
  mutation CreateCanvas($workspaceId: ID!, $title: String!) {
    createCanvas(workspaceId: $workspaceId, title: $title) {
      id
      title
      workspaceId
    }
  }
`;

// Helper to dynamically assign beautiful patterns and colors to user-created canvases
const PATTERNS = ['cards_grid', 'sticky_notes', 'timeline_h', 'hierarchy', 'flowchart', 'venn', 'columns_4', 'process_arrows'];
const COLORS = ['#4361ee', '#e03131', '#2f9e44', '#f59e0b', '#9c36b5', '#14b8a6', '#0ea5e9', '#ec4899'];

function getVisuals(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return {
    pattern: PATTERNS[Math.abs(hash) % PATTERNS.length] as any,
    color: COLORS[Math.abs(hash) % COLORS.length]
  };
}

export default function Dashboard() {
  const { data, loading, error, refetch } = useQuery(GET_WORKSPACES);
  const [createWorkspace] = useMutation(CREATE_WORKSPACE);
  const [createCanvas] = useMutation(CREATE_CANVAS);
  const [newWsName, setNewWsName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading Command Center...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid #ef4444', color: '#ef4444', textAlign: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Connection Error</h3>
        <p>{error.message}</p>
      </div>
    </div>
  );

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setIsCreating(true);
    await createWorkspace({ variables: { name: newWsName } });
    setNewWsName('');
    setIsCreating(false);
    refetch();
  };

  const handleCreateCanvas = async (workspaceId: string) => {
    const title = prompt('Enter canvas title:');
    if (!title) return;
    await createCanvas({ variables: { workspaceId, title } });
    refetch();
  };

  const workspaces = data?.workspaces || [];
  const totalCanvases = workspaces.reduce((acc: number, ws: any) => acc + ws.canvases.length, 0);

  return (
    <main className="main-content" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero Banner */}
      {/* Hero Banner */}
      <div style={{ padding: '32px 48px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Animated Infinite Canvas Dot Grid */}
        <div style={{
          position: 'absolute',
          inset: '-100%',
          opacity: 0.15,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 2px 2px, var(--accent-primary) 2px, transparent 0)',
          backgroundSize: '48px 48px',
          animation: 'pan-canvas 40s linear infinite',
          zIndex: 0
        }} />
        <style>{`
          @keyframes pan-canvas {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-48px, -48px); }
          }
          @keyframes float-shape-1 {
            0% { transform: translateY(0) rotate(-5deg) scale(1); }
            50% { transform: translateY(-25px) rotate(5deg) scale(1.05); }
            100% { transform: translateY(0) rotate(-5deg) scale(1); }
          }
          @keyframes float-shape-2 {
            0% { transform: translateY(0) translateX(0) rotate(10deg); }
            50% { transform: translateY(20px) translateX(15px) rotate(-5deg); }
            100% { transform: translateY(0) translateX(0) rotate(10deg); }
          }
          @keyframes pulse-glow {
            0% { opacity: 0.15; filter: blur(40px); transform: scale(1); }
            50% { opacity: 0.3; filter: blur(50px); transform: scale(1.2); }
            100% { opacity: 0.15; filter: blur(40px); transform: scale(1); }
          }
        `}</style>

        {/* Ambient Glowing Orbs */}
        <div style={{ position: 'absolute', right: '10%', top: '-20%', width: '400px', height: '400px', background: 'var(--accent-primary)', borderRadius: '50%', animation: 'pulse-glow 12s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', left: '-5%', bottom: '-50%', width: '300px', height: '300px', background: '#10b981', borderRadius: '50%', animation: 'pulse-glow 15s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />

        {/* Floating Glassmorphic "Canvas Elements" */}
        <div style={{ position: 'absolute', right: '15%', top: '25%', width: '120px', height: '80px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', animation: 'float-shape-1 14s ease-in-out infinite', pointerEvents: 'none', zIndex: 0, boxShadow: 'var(--shadow-md)' }} />
        <div style={{ position: 'absolute', right: '5%', bottom: '-10%', width: '160px', height: '110px', background: 'var(--accent-light)', opacity: 0.3, backdropFilter: 'blur(8px)', border: '1px solid var(--accent-primary)', borderRadius: '16px', animation: 'float-shape-2 18s ease-in-out infinite', pointerEvents: 'none', zIndex: 0, boxShadow: 'var(--shadow-sm)' }} />

        <div style={{ position: 'absolute', right: '2%', top: '-15%', opacity: 0.05, transform: 'rotate(15deg)', pointerEvents: 'none', zIndex: 0 }}>
          <LayoutTemplate size={280} />
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, marginBottom: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} /> Welcome to VignetteLab
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: '0 0 12px' }}>
            Home
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', color: 'var(--accent-primary)' }}>
                <Folder size={16} />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{workspaces.length}</span> Workspaces
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', color: '#10b981' }}>
                <FileText size={16} />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{totalCanvases}</span> Canvases
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 48px 64px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* Workspace Creation */}
        <section>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Create New Workspace</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Organize your canvases into dedicated team or project folders.</p>
            </div>
            <form onSubmit={handleCreateWorkspace} style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px', maxWidth: '400px' }}>
              <input 
                type="text" 
                placeholder="E.g. Marketing Team" 
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                disabled={isCreating}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  flex: 1,
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              />
              <button type="submit" disabled={isCreating || !newWsName.trim()} style={{
                padding: '0 24px',
                borderRadius: '10px',
                border: 'none',
                background: newWsName.trim() ? 'var(--accent-primary)' : 'var(--border-color)',
                color: newWsName.trim() ? 'white' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: newWsName.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Plus size={18} /> {isCreating ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>
        </section>

        {/* Workspaces & Canvases List */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {workspaces.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
              <Folder size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No Workspaces Yet</h3>
              <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>Create your first workspace above to start organizing your infinite canvas projects.</p>
            </div>
          ) : (
            workspaces.map((ws: any) => (
              <div key={ws.id}>
                {/* Workspace Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Folder size={16} />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{ws.name}</h2>
                    <span style={{ padding: '2px 8px', borderRadius: '100px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {ws.canvases.length} Canvas{ws.canvases.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleCreateCanvas(ws.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  >
                    <Plus size={14} /> New Canvas
                  </button>
                </div>
                
                {/* Canvases Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {ws.canvases.map((canvas: any) => {
                    const visuals = getVisuals(canvas.id);
                    return (
                      <Link key={canvas.id} href={`/canvas/${canvas.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                        <div style={{ borderRadius: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease', display: 'flex', flexDirection: 'column' }}
                             onMouseOver={(e) => { e.currentTarget.style.borderColor = visuals.color; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                             onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                        >
                          {/* Top Border Accent */}
                          <div style={{ height: '4px', borderTopLeftRadius: '14px', borderTopRightRadius: '14px', background: `linear-gradient(90deg, ${visuals.color}, ${visuals.color}88)` }} />
                          
                          {/* Premium Abstract SVG Preview */}
                          <div style={{ width: '100%', height: '140px', background: '#f8fafc', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border-color)' }}>
                            <TemplatePreview pattern={visuals.pattern} color={visuals.color} width={300} height={140} />
                            
                            {/* Hover Overlay Layer */}
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.03)', opacity: 0, transition: 'opacity 0.2s' }}
                                 onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                                 onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
                            />
                          </div>

                          <div style={{ padding: '16px 20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {canvas.title}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <Clock size={12} /> {new Date(Number(canvas.updatedAt) || canvas.updatedAt).toLocaleDateString()}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', fontSize: '12px', fontWeight: 600 }}>
                                Open <ArrowRight size={12} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  
                  {/* Empty State for Canvases */}
                  {ws.canvases.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 16px' }}>This workspace is empty.</p>
                      <button 
                        onClick={() => handleCreateCanvas(ws.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: 'var(--text-primary)', color: 'var(--bg-primary)', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
                      >
                        Create your first canvas
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </section>

      </div>
    </main>
  );
}
