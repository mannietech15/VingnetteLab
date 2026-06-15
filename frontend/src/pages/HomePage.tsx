'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Folder, FileText, ArrowRight, Sparkles, LayoutTemplate, Settings, Clock, Users, Check, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TemplatePreview from '@/components/TemplatePreview';
import TiltedCard from '@/components/TiltedCard';
import vignetteLogo from '@/assets/vignetteLogo.png';

const Image = ({ src, alt, width, height, className, fill, ...props }: any) => <img src={src} alt={alt} width={width} height={height} className={className} style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}} {...props} />;

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

// All available patterns
const PATTERNS = ['cards_grid', 'sticky_notes', 'timeline_h', 'hierarchy', 'flowchart', 'venn', 'columns_4', 'process_arrows', 'kanban', 'mindmap', 'radar', 'bars', 'table', 'circle_segments', 'columns_3', 'grid_2x2'];

// Generate a unique full-spectrum color from any string using HSL
// This gives every canvas its own distinct hue across the full color wheel
function getVisuals(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;               // Full hue wheel 0-359°
  const s = 55 + (Math.abs(hash >> 8) % 30);   // Saturation 55-85% (vivid but not garish)
  const l = 38 + (Math.abs(hash >> 16) % 22);  // Lightness 38-60% (rich, readable)
  const color = `hsl(${h}, ${s}%, ${l}%)`;
  return {
    pattern: PATTERNS[Math.abs(hash) % PATTERNS.length] as any,
    color,
  };
}

export default function Dashboard() {
  const { data, loading, error, refetch } = useQuery(GET_WORKSPACES);
  const [createWorkspace] = useMutation(CREATE_WORKSPACE);
  const [createCanvas] = useMutation(CREATE_CANVAS);
  const [newWsName, setNewWsName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{ message: string, id: number } | null>(null);

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
    const workspaceName = newWsName;
    try {
      await createWorkspace({ variables: { name: workspaceName } });
      setNotification({ message: `Workspace "${workspaceName}" created successfully!`, id: Date.now() });
      setNewWsName('');
      setTimeout(() => setNotification(null), 4000);
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCanvas = async (workspaceId: string) => {
    const title = prompt('Enter canvas title:');
    if (!title) return;
    await createCanvas({ variables: { workspaceId, title } });
    refetch();
  };

  const workspaces: any[] = (data as any)?.workspaces || [];
  const totalCanvases = workspaces.reduce((acc: number, ws: any) => acc + (ws.canvases?.length || 0), 0);

  return (
    <main className="main-content" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero Banner */}
      <div className="home-hero">
        
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
          <div className="sidebar-mobile-only" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Image src={vignetteLogo} alt="VignetteLab Logo" width={36} height={36} style={{ borderRadius: '10px', objectFit: 'cover' }} />
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                VignetteLab
              </span>
            </div>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Menu size={24} />
            </button>
          </div>
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', width: '100%' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: 0 }}>
              Home
            </h1>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '8px', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <Menu size={28} />
            </button>
          </div>

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

      <div className="home-section">
        
        {/* Workspace Creation */}
        <section>
          <div className="home-create-workspace">
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Create New Workspace</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Organize your canvases into dedicated team or project folders.</p>
            </div>
            <form onSubmit={handleCreateWorkspace} className="home-create-form">
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
                <div className="home-workspace-header">
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
                      <Link key={canvas.id} to={`/canvas/${canvas.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                        <div style={{ borderRadius: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease', display: 'flex', flexDirection: 'column' }}
                             onMouseOver={(e) => { e.currentTarget.style.borderColor = visuals.color; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                             onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                        >
                          {/* Top Border Accent */}
                          <div style={{ height: '4px', borderTopLeftRadius: '14px', borderTopRightRadius: '14px', background: `linear-gradient(90deg, ${visuals.color}, ${visuals.color}88)` }} />
                          
                          {/* Premium Abstract SVG Preview with TiltedCard */}
                          <div style={{ width: 'calc(100% - 24px)', margin: '12px 12px 0 12px', height: '140px', position: 'relative', zIndex: 10 }}>
                            <TiltedCard
                              imageSrc={<div style={{ width: '100%', height: '100%', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)', overflow: 'hidden' }}><TemplatePreview pattern={visuals.pattern} color={visuals.color} width={300} height={140} /></div>}
                              altText={canvas.title}
                              captionText="Open Canvas"
                              containerHeight="140px"
                              containerWidth="100%"
                              imageHeight="140px"
                              imageWidth="100%"
                              rotateAmplitude={12}
                              scaleOnHover={1.05}
                              showMobileWarning={false}
                              showTooltip={true}
                              displayOverlayContent={true}
                              overlayContent={
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.03)', borderRadius: '10px', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.2s' }}
                                     onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                                     onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
                                />
                              }
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

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              padding: '16px 24px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 100,
            }}
          >
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b98120', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={14} strokeWidth={3} />
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
              {notification.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
