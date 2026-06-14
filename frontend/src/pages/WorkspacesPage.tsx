'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Folder, Clock, MoreVertical, Users, 
  Settings, ChevronRight, Activity, Sparkles, LayoutTemplate,
  ArrowRight, FileText
} from 'lucide-react';
import TemplatePreview from '@/components/TemplatePreview';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

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

// Generate consistent colors for workspaces based on ID
function getWorkspaceColor(id: string) {
  const colors = ['#e03131', '#2f9e44', '#1971c2', '#f08c00', '#9c36b5'];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const PATTERNS = ['cards_grid', 'sticky_notes', 'timeline_h', 'hierarchy', 'flowchart', 'venn', 'columns_4', 'process_arrows', 'kanban', 'mindmap', 'radar', 'bars', 'table', 'circle_segments', 'columns_3', 'grid_2x2'];

function getVisuals(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  const s = 55 + (Math.abs(hash >> 8) % 30);
  const l = 38 + (Math.abs(hash >> 16) % 22);
  const color = `hsl(${h}, ${s}%, ${l}%)`;
  return { pattern: PATTERNS[Math.abs(hash) % PATTERNS.length] as any, color };
}

export default function WorkspacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data } = useQuery(GET_WORKSPACES);
  const workspaces = (data as any)?.workspaces || [];
  
  const allCanvases = workspaces.flatMap((ws: any) => 
    (ws.canvases || []).map((c: any) => ({ ...c, workspaceName: ws.name }))
  );
  
  const recentCanvases = [...allCanvases]
    .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
    .slice(0, 4);

  return (
    <main className="main-content" style={{ background: 'var(--bg-primary)' }}>
      {/* Premium Header / Welcome Area */}
      <div className="workspaces-hero">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: '0 0 8px' }}>
                Good evening, Mannie
              </h1>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
                You have 3 active collaborations across your workspaces.
              </p>
            </div>
            
            <div className="workspaces-header-actions">
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Search workspaces or canvases..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-light)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                />
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px', borderRadius: '10px', background: 'var(--accent-primary)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px var(--accent-light)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px var(--accent-light)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px var(--accent-light)'; }}
              >
                <Plus size={18} /> New Canvas
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="workspaces-section">
        
        {/* Intelligent Quick Actions Bento Grid */}
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Quick Action 1: Create */}
            <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                 onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                 onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>Start Blank Canvas</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>Launch an infinite workspace instantly and build from scratch.</p>
            </div>

            {/* Quick Action 2: Templates */}
            <Link to="/templates" style={{ textDecoration: 'none' }}>
              <div style={{ height: '100%', padding: '24px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                   onMouseOver={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                   onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <LayoutTemplate size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>Explore Templates</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>Browse 200+ professional frameworks to jumpstart your workflow.</p>
              </div>
            </Link>

            {/* Quick Action 3: AI Insight (Intelligent) */}
            <div style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent-primary), #9c36b5)', border: 'none', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1, transform: 'rotate(15deg)' }}>
                <Sparkles size={120} />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', fontSize: '12px', fontWeight: 600, marginBottom: '20px' }}>
                  <Activity size={14} /> AI Insight
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px' }}>Engineering Sync Needed</h3>
                <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.5, opacity: 0.9 }}>Your "System Architecture v2" canvas has seen high activity from 3 members. Consider scheduling a sync to align on changes.</p>
                <button style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: 'white', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                  View Canvas <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Quick Action 4: Active Collaborators */}
            <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                 onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                 onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} />
                </div>
                
                {/* Overlapping Online Avatars */}
                <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                  {['S', 'A', 'K'].map((u, i) => (
                    <div key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-primary)', border: '2px solid var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '-12px', zIndex: i, position: 'relative' }}>
                      {u}
                      {/* Online dot for the active user */}
                      {i === 2 && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid var(--bg-secondary)' }} />}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>Active Collaborators</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Sarah and 2 others are currently editing in the <strong style={{ color: 'var(--text-primary)' }}>Design Team</strong> workspace.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} style={{ color: 'var(--text-secondary)' }} /> Jump back in
            </h2>
            <Link to="/recent" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-primary)', textDecoration: 'none' }}>View all</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {recentCanvases.map((canvas: any) => {
              const visuals = getVisuals(canvas.id);
              return (
              <div key={canvas.id} style={{ borderRadius: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = visuals.color; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: '100%', height: '140px', background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                  <TemplatePreview pattern={visuals.pattern} color={visuals.color} width={300} height={140} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', fontSize: '11px', fontWeight: 600, color: '#1a1a1a', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {new Date(Number(canvas.updatedAt) || canvas.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{canvas.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <Folder size={14} /> {canvas.workspaceName}
                    </div>
                  </div>
                </div>
              </div>
            )})}
            {recentCanvases.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No recent canvases found.
              </div>
            )}
          </div>
        </section>

        {/* Workspaces List */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Folder size={20} style={{ color: 'var(--text-secondary)' }} /> Your Workspaces
            </h2>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Manage</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workspaces.map((ws: any) => {
              const wsColor = getWorkspaceColor(ws.id);
              return (
              <div key={ws.id} style={{ display: 'flex', alignItems: 'center', padding: '20px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${wsColor}15`, color: wsColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
                  <Folder size={24} fill={`${wsColor}33`} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>{ws.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={14} /> {ws.canvases?.length || 0} canvases</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> 1 members</span>
                  </div>
                </div>

                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            )})}
            {workspaces.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                You haven't created any workspaces yet.
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
