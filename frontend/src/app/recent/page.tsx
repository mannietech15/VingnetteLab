'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock, Search, LayoutGrid, List, Folder, ArrowRight,
  Sparkles, History, Calendar, Trash2, ExternalLink
} from 'lucide-react';
import TemplatePreview from '@/components/TemplatePreview';

// --- MOCK RECENT DATA ---
const RECENT_ITEMS = [
  { id: 'rec-1', title: 'Q3 Product Roadmap', type: 'canvas', workspace: 'Product Strategy', pattern: 'timeline_h', color: '#0ea5e9', viewedAt: 'Just now', group: 'Today', collaborators: ['M', 'S', 'J'] },
  { id: 'rec-2', title: 'Homepage Redesign wireframes', type: 'canvas', workspace: 'Design Team', pattern: 'wireframe', color: '#8b5cf6', viewedAt: '2 hours ago', group: 'Today', collaborators: ['M', 'A'] },
  { id: 'rec-3', title: 'User Research Synthesis', type: 'canvas', workspace: 'Design Team', pattern: 'sticky_notes', color: '#f59e0b', viewedAt: 'Yesterday at 4:30 PM', group: 'Yesterday', collaborators: ['M', 'L', 'K'] },
  { id: 'rec-4', title: 'Marketing Campaign Flow', type: 'canvas', workspace: 'Marketing', pattern: 'flowchart', color: '#ec4899', viewedAt: 'Yesterday at 11:15 AM', group: 'Yesterday', collaborators: ['M'] },
  { id: 'rec-5', title: 'Brand Guidelines 2026', type: 'template', workspace: 'Design Team', pattern: 'cards_grid', color: '#14b8a6', viewedAt: 'Last Tuesday', group: 'Last Week', collaborators: ['M', 'T'] },
  { id: 'rec-6', title: 'Sprint Retrospective', type: 'template', workspace: 'Engineering', pattern: 'columns_3', color: '#e03131', viewedAt: 'Last Monday', group: 'Last Week', collaborators: ['M', 'R', 'D'] },
  { id: 'rec-7', title: 'Revenue Dashboard', type: 'canvas', workspace: 'Analytics', pattern: 'bars', color: '#2f9e44', viewedAt: '2 weeks ago', group: 'Older', collaborators: ['M'] },
];

type FilterType = 'all' | 'canvas' | 'template';
type ViewMode = 'grid' | 'list';

export default function RecentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // Default to list for Recent
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return RECENT_ITEMS.filter(item => {
      if (removingId === item.id) return false;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.workspace.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, removingId]);

  const handleRemoveRecent = (id: string) => {
    setRemovingId(id);
  };

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All Recent', icon: <History size={14} /> },
    { key: 'canvas', label: 'Canvases', icon: <LayoutGrid size={14} /> },
    { key: 'template', label: 'Templates', icon: <Calendar size={14} /> },
  ];

  // Group items
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof RECENT_ITEMS> = {};
    filtered.forEach(item => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    return groups;
  }, [filtered]);

  return (
    <main className="main-content" style={{ background: 'var(--bg-primary)' }}>

      {/* Hero Banner */}
      <div className="recent-hero">

        {/* Animated background lines */}
        <div style={{ position: 'absolute', inset: '-100%', opacity: 0.06, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, var(--accent-primary) 10px, var(--accent-primary) 11px)', backgroundSize: '100px 100px', animation: 'pan-lines 30s linear infinite', zIndex: 0 }} />
        <style>{`
          @keyframes pan-lines {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100px, 100px); }
          }
          @keyframes pulse-clock {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          @keyframes float-glow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>

        {/* Ambient glow */}
        <div style={{ position: 'absolute', right: '10%', top: '-20%', width: '300px', height: '300px', background: 'var(--accent-primary)', borderRadius: '50%', opacity: 0.1, filter: 'blur(50px)', animation: 'float-glow 8s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, marginBottom: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <Clock size={14} style={{ color: 'var(--accent-primary)' }} /> Jump back in
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: '0 0 8px' }}>
            Recent Activity
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0, maxWidth: '500px' }}>
            Pick up exactly where you left off. Here are the canvases and templates you've viewed or edited recently.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <History size={16} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{filtered.length}</span> Items
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <Clock size={16} color="#10b981" />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Updated Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="recent-controls">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border-color)', overflowX: 'auto', scrollbarWidth: 'none', maxWidth: '100%' }}>
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                  borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  background: activeFilter === f.key ? 'var(--text-primary)' : 'transparent',
                  color: activeFilter === f.key ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          {/* Search + View Toggle */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            <div className="recent-search-wrapper" style={{ flex: 1, minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search recent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', transition: 'all 0.2s', maxWidth: '100%' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--bg-hover)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <button onClick={() => setViewMode('grid')} style={{ padding: '8px 12px', border: 'none', cursor: 'pointer', background: viewMode === 'grid' ? 'var(--bg-hover)' : 'transparent', color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} style={{ padding: '8px 12px', border: 'none', cursor: 'pointer', background: viewMode === 'list' ? 'var(--bg-hover)' : 'transparent', color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="recent-content">

        {filtered.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px dashed var(--border-color)', marginTop: '8px' }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <History size={36} style={{ color: 'var(--accent-primary)', animation: 'pulse-clock 3s ease-in-out infinite' }} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {searchQuery ? 'No matches found' : 'No recent activity'}
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              {searchQuery
                ? `We couldn't find anything matching "${searchQuery}". Try a different search term.`
                : 'As you view and edit canvases and templates, they will appear here.'}
            </p>
            {!searchQuery && (
              <Link href="/home" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'var(--text-primary)', color: 'var(--bg-primary)', fontWeight: 600, fontSize: '14px', textDecoration: 'none', transition: 'transform 0.2s' }}>
                <Sparkles size={16} /> Create a new Canvas <ArrowRight size={14} />
              </Link>
            )}
          </motion.div>
        ) : (
          /* Grouped Content */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '8px' }}>
            {Object.entries(groupedItems).map(([group, items], groupIndex) => (
              <div key={group}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {group} <span style={{ padding: '2px 8px', borderRadius: '100px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{items.length}</span>
                </h2>
                
                {viewMode === 'grid' ? (
                  /* Grid View */
                  <motion.div
                    layout
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}
                  >
                    <AnimatePresence>
                      {items.map((item, index) => (
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

                          {/* Preview */}
                          <div style={{ width: 'calc(100% - 24px)', margin: '12px 12px 0', height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
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
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Folder size={12} style={{ flexShrink: 0 }} /> {item.workspace}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <Clock size={12} /> {item.viewedAt}
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={(e) => { e.preventDefault(); handleRemoveRecent(item.id); }} title="Remove from recent" style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
                                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                >
                                  <Trash2 size={14} />
                                </button>
                                <Link href={`/canvas/${item.id}`} title="Open" style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s', textDecoration: 'none' }}
                                  onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.25, delay: index * 0.03 }}
                        >
                          <Link href={`/canvas/${item.id}`} style={{ textDecoration: 'none' }}>
                            <div
                              style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s', gap: '16px' }}
                              onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = item.color; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                            >
                              {/* Preview Thumbnail for list view */}
                              <div style={{ width: '60px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', flexShrink: 0 }} className="hide-on-mobile">
                                <TemplatePreview pattern={item.pattern as any} color={item.color} width={60} height={40} />
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
                              <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)', minWidth: '130px' }}>
                                <Clock size={13} /> {item.viewedAt}
                              </div>

                              {/* Actions */}
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={(e) => { e.preventDefault(); handleRemoveRecent(item.id); }} title="Remove" style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
