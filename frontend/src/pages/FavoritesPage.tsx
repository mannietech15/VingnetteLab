'use client';

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star, Search, LayoutGrid, List, Clock, Folder, ArrowRight,
  Sparkles, Heart, Filter, TrendingUp, Zap, MoreVertical, Trash2, ExternalLink
} from 'lucide-react';
import TemplatePreview from '@/components/TemplatePreview';
import TiltedCard from '@/components/TiltedCard';

// --- MOCK FAVOURITES DATA ---
const FAVOURITE_ITEMS = [
  { id: 'fav-1', title: 'Q3 Product Roadmap', type: 'canvas', workspace: 'Product Strategy', pattern: 'timeline_h', color: '#0ea5e9', favoritedAt: '2026-06-07', editedAt: '2 hours ago', collaborators: ['M', 'S', 'J'] },
  { id: 'fav-2', title: 'System Architecture v2', type: 'canvas', workspace: 'Engineering', pattern: 'hierarchy', color: '#8b5cf6', favoritedAt: '2026-06-06', editedAt: '5 hours ago', collaborators: ['M', 'A'] },
  { id: 'fav-3', title: 'User Research Synthesis', type: 'canvas', workspace: 'Design Team', pattern: 'sticky_notes', color: '#f59e0b', favoritedAt: '2026-06-05', editedAt: 'Yesterday', collaborators: ['M', 'L', 'K'] },
  { id: 'fav-4', title: 'Marketing Campaign Flow', type: 'canvas', workspace: 'Marketing', pattern: 'flowchart', color: '#ec4899', favoritedAt: '2026-06-04', editedAt: '2 days ago', collaborators: ['M'] },
  { id: 'fav-5', title: 'Brand Guidelines 2026', type: 'template', workspace: 'Design Team', pattern: 'cards_grid', color: '#14b8a6', favoritedAt: '2026-06-03', editedAt: '3 days ago', collaborators: ['M', 'T'] },
  { id: 'fav-6', title: 'Sprint Retrospective', type: 'template', workspace: 'Engineering', pattern: 'columns_3', color: '#e03131', favoritedAt: '2026-06-02', editedAt: '4 days ago', collaborators: ['M', 'R', 'D'] },
  { id: 'fav-7', title: 'Revenue Dashboard', type: 'canvas', workspace: 'Analytics', pattern: 'bars', color: '#2f9e44', favoritedAt: '2026-06-01', editedAt: '5 days ago', collaborators: ['M'] },
  { id: 'fav-8', title: 'Customer Journey Map', type: 'canvas', workspace: 'Product Strategy', pattern: 'process_arrows', color: '#9c36b5', favoritedAt: '2026-05-30', editedAt: '1 week ago', collaborators: ['M', 'S'] },
];

type FilterType = 'all' | 'canvas' | 'template';
type ViewMode = 'grid' | 'list';

export default function FavouritesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return FAVOURITE_ITEMS.filter(item => {
      if (removingId === item.id) return false;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.workspace.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, removingId]);

  const handleRemoveFavourite = (id: string) => {
    setRemovingId(id);
  };

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All Favorites', icon: <Star size={14} /> },
    { key: 'canvas', label: 'Canvases', icon: <Zap size={14} /> },
    { key: 'template', label: 'Templates', icon: <TrendingUp size={14} /> },
  ];

  return (
    <main className="main-content" style={{ background: 'var(--bg-primary)' }}>

      {/* Hero Banner */}
      <div className="favorites-hero">

        {/* Animated star-field background */}
        <div style={{ position: 'absolute', inset: '-100%', opacity: 0.08, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 2px 2px, #f59e0b 1.5px, transparent 0)', backgroundSize: '64px 64px', animation: 'pan-stars 60s linear infinite', zIndex: 0 }} />
        <style>{`
          @keyframes pan-stars {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-64px, -64px); }
          }
          @keyframes shimmer-star {
            0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
          }
          @keyframes float-gently {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
        `}</style>

        {/* Ambient glow */}
        <div style={{ position: 'absolute', right: '8%', top: '-40%', width: '350px', height: '350px', background: '#f59e0b', borderRadius: '50%', opacity: 0.08, filter: 'blur(60px)', animation: 'float-gently 10s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', left: '-3%', bottom: '-60%', width: '250px', height: '250px', background: 'var(--accent-primary)', borderRadius: '50%', opacity: 0.06, filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, marginBottom: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <Star size={14} style={{ color: '#f59e0b' }} fill="#f59e0b" /> Your Collection
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: '0 0 8px' }}>
            Favorites
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0, maxWidth: '500px' }}>
            Quick access to the canvases and templates you love most. Your starred items, always within reach.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{FAVOURITE_ITEMS.length}</span> Starred
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <Zap size={16} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{FAVOURITE_ITEMS.filter(i => i.type === 'canvas').length}</span> Canvases
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <TrendingUp size={16} color="#10b981" />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{FAVOURITE_ITEMS.filter(i => i.type === 'template').length}</span> Templates
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="favorites-controls">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border-color)' }}>
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                  borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  background: activeFilter === f.key ? 'var(--accent-primary)' : 'transparent',
                  color: activeFilter === f.key ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          {/* Search + View Toggle */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            <div className="favorites-search-wrapper" style={{ flex: 1, minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-light)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <button onClick={() => setViewMode('grid')} style={{ padding: '8px 12px', border: 'none', cursor: 'pointer', background: viewMode === 'grid' ? 'var(--accent-light)' : 'transparent', color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} style={{ padding: '8px 12px', border: 'none', cursor: 'pointer', background: viewMode === 'list' ? 'var(--accent-light)' : 'transparent', color: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="favorites-content">

        {filtered.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px dashed var(--border-color)', marginTop: '8px' }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Star size={36} color="#f59e0b" style={{ animation: 'shimmer-star 3s ease-in-out infinite' }} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {searchQuery ? 'No matches found' : 'No favorites yet'}
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              {searchQuery
                ? `We couldn't find any favorites matching "${searchQuery}". Try a different search term.`
                : 'Star your most important canvases and templates to access them instantly from here.'}
            </p>
            {!searchQuery && (
              <Link to="/home" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'var(--accent-primary)', color: '#fff', fontWeight: 600, fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 12px var(--accent-light)', transition: 'transform 0.2s' }}>
                <Sparkles size={16} /> Browse your canvases <ArrowRight size={14} />
              </Link>
            )}
          </motion.div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '8px' }}
          >
            <AnimatePresence>
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s, border-color 0.3s', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', ...(hoveredId === item.id ? { transform: 'translateY(-4px)', boxShadow: 'var(--shadow-md)', borderColor: item.color } : {}) }}
                >
                  {/* Top accent */}
                  <div style={{ height: '4px', background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }} />

                  {/* Star badge */}
                  <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 5, width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                  </div>

                  {/* Preview */}
                  <div style={{ width: 'calc(100% - 24px)', margin: '12px 12px 0', height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <TemplatePreview pattern={item.pattern as any} color={item.color} width={300} height={140} />
                  </div>

                  {/* Info */}
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '100px', background: item.type === 'canvas' ? 'var(--accent-light)' : 'rgba(16,185,129,0.1)', fontSize: '11px', fontWeight: 600, color: item.type === 'canvas' ? 'var(--accent-primary)' : '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {item.type}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Folder size={12} /> {item.workspace}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        {item.collaborators.map((c, i) => (
                          <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-primary)', border: '2px solid var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: i > 0 ? '-8px' : 0, zIndex: i }}>
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Clock size={12} /> {item.editedAt}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={(e) => { e.preventDefault(); handleRemoveFavourite(item.id); }} title="Remove from favorites" style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <Trash2 size={14} />
                        </button>
                        <Link to={`/canvas/${item.id}`} title="Open" style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s', textDecoration: 'none' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* List View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <AnimatePresence>
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                >
                  <Link to={`/canvas/${item.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s', gap: '16px' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = item.color; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                      {/* Color dot */}
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}18`, border: `1px solid ${item.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                      </div>

                      {/* Title + workspace */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Folder size={12} /> {item.workspace}</span>
                          <span style={{ padding: '1px 6px', borderRadius: '4px', background: item.type === 'canvas' ? 'var(--accent-light)' : 'rgba(16,185,129,0.1)', fontSize: '11px', fontWeight: 600, color: item.type === 'canvas' ? 'var(--accent-primary)' : '#10b981' }}>
                            {item.type}
                          </span>
                        </div>
                      </div>

                      {/* Collaborators */}
                      <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'row-reverse', marginRight: '8px' }}>
                        {item.collaborators.map((c, i) => (
                          <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-primary)', border: '2px solid var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: i > 0 ? '-8px' : 0, zIndex: i }}>
                            {c}
                          </div>
                        ))}
                      </div>

                      {/* Time */}
                      <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)', minWidth: '100px' }}>
                        <Clock size={13} /> {item.editedAt}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={(e) => { e.preventDefault(); handleRemoveFavourite(item.id); }} title="Remove" style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <ArrowRight size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
