'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Users, Briefcase, Code, Palette, TrendingUp, ArrowRight, Star, Eye, Loader2 } from 'lucide-react';
import { TEMPLATES, Template } from '@/data/templates';
import TemplatePreview from '@/components/TemplatePreview';
import { motion, useSpring, useMotionValue } from 'motion/react';
import type { SpringOptions } from 'motion/react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

const Image = ({ src, alt, width, height, className, fill, ...props }: any) => <img src={src} alt={alt} width={width} height={height} className={className} style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}} {...props} />;

const GET_WORKSPACES = gql`
  query GetWorkspaces {
    workspaces {
      id
      name
    }
  }
`;

const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($name: String!) {
    createWorkspace(name: $name) {
      id
      name
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

const CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: Sparkles },
  { id: 'strategy', label: 'Strategy', icon: TrendingUp },
  { id: 'engineering', label: 'Engineering', icon: Code },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'agile', label: 'Agile & PM', icon: Briefcase },
  { id: 'collaboration', label: 'Collaboration', icon: Users },
];

const tiltSpring: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function TemplateCard({ t, isFeatured, onUseTemplate, isCreating }: { t: Template; isFeatured?: boolean; onUseTemplate: (t: Template) => void; isCreating: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const height = isFeatured ? '180px' : '160px';

  // --- 3D Tilt Animation Physics ---
  const TILT_AMPLITUDE = 22;
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), tiltSpring);
  const rotateY = useSpring(useMotionValue(0), tiltSpring);
  const scale = useSpring(1, tiltSpring);
  const shimmerX = useMotionValue(0);
  const shimmerY = useMotionValue(0);

  function handleTiltMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rx = (offsetY / (rect.height / 2)) * -TILT_AMPLITUDE;
    const ry = (offsetX / (rect.width / 2)) * TILT_AMPLITUDE;
    rotateX.set(rx);
    rotateY.set(ry);
    shimmerX.set(((e.clientX - rect.left) / rect.width) * 100);
    shimmerY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handleTiltEnter() {
    setIsHovered(true);
    scale.set(1.04);
  }

  function handleTiltLeave() {
    setIsHovered(false);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }
  // --- End 3D Tilt Animation Physics ---

  return (
    <div
      ref={cardRef}
      style={{ perspective: '900px', height: '100%', cursor: isCreating ? 'wait' : 'pointer' }}
      onMouseMove={handleTiltMove}
      onMouseEnter={handleTiltEnter}
      onMouseLeave={handleTiltLeave}
      onClick={() => !isCreating && onUseTemplate(t)}
    >
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: '14px',
          border: `1px solid ${isHovered ? t.color + '80' : 'var(--border-color)'}`,
          background: 'var(--bg-secondary)',
          boxShadow: isHovered
            ? `0 24px 60px -12px ${t.color}55, 0 8px 20px -6px rgba(0,0,0,0.35)`
            : 'none',
          opacity: isCreating ? 0.7 : 1,
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Shimmer highlight layer */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '14px',
            pointerEvents: 'none',
            zIndex: 10,
            opacity: isHovered ? 1 : 0,
            background: shimmerX.get() !== 0
              ? `radial-gradient(circle at ${shimmerX.get()}% ${shimmerY.get()}%, rgba(255,255,255,0.12) 0%, transparent 65%)`
              : 'none',
            transition: 'opacity 0.3s ease',
          }}
        />

        {isFeatured && <div style={{ height: '6px', borderTopLeftRadius: '14px', borderTopRightRadius: '14px', background: `linear-gradient(90deg, ${t.color}, ${t.color}88)`, flexShrink: 0 }} />}

        <div style={{ padding: '16px', zIndex: isHovered ? 20 : 1 }}>
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: height, 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)', 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
            background: 'var(--bg-primary)',
          }}>
            {/* SVG preview — always visible immediately as placeholder */}
            <div style={{ position: 'absolute', inset: 0, opacity: t.image && imgLoaded ? 0 : 1, transition: 'opacity 0.3s ease' }}>
              <TemplatePreview pattern={t.pattern} color={t.color} width={400} height={isFeatured ? 270 : 240} />
            </div>

            {/* Shimmer skeleton shown while real image is in-flight */}
            {t.image && !imgLoaded && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s ease infinite',
                zIndex: 2,
              }} />
            )}

            {/* Real PNG — fades in once loaded */}
            {t.image && (
              <img
                src={t.image}
                alt={t.title}
                loading={isFeatured ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={() => setImgLoaded(true)}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'opacity 0.35s ease',
                  zIndex: 1,
                }}
              />
            )}

            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: `linear-gradient(135deg, ${t.color}cc, ${t.color}77)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
              zIndex: 2
            }}>
              <div
                onClick={(e) => { e.stopPropagation(); if (!isCreating) onUseTemplate(t); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#1a1a1a',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                  transform: isHovered ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: isCreating ? 'wait' : 'pointer',
                }}>
                {isCreating ? <Loader2 size={16} className="animate-spin" /> : null}
                {isCreating ? 'Creating...' : 'Use Template'} {!isCreating && <ArrowRight size={16} />}
              </div>
              {!isFeatured && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transform: isHovered ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s',
                }}>
                  <Eye size={18} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: isFeatured ? '16px 20px 20px' : '14px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: `${t.color}15`, color: t.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.category}</span>
            {t.isFeatured && <Star size={14} style={{ color: '#f59e0b' }} fill="#f59e0b" />}
            {isFeatured && !t.isFeatured && <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {formatCount(t.usageCount)} uses</span>}
          </div>

          <h3 style={{ fontSize: isFeatured ? '18px' : '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{t.title}</h3>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: isFeatured ? '0' : '0 0 12px', display: isFeatured ? 'block' : '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {isFeatured ? t.description.slice(0, 100) + '...' : t.description}
          </p>

          {!isFeatured && (
            <>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px', marginTop: 'auto' }}>
                {t.tags.map((tag) => (
                  <span key={tag} style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '11px', background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {formatCount(t.usageCount)} uses</span>
                <span>by {t.author}</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, activeCategory]);

  const { data: workspacesData } = useQuery(GET_WORKSPACES);
  const [createWorkspace] = useMutation(CREATE_WORKSPACE);
  const [createCanvas] = useMutation(CREATE_CANVAS);

  async function handleUseTemplate(template: Template) {
    if (creatingTemplateId) return; // Prevent double-clicks
    setCreatingTemplateId(template.id);

    try {
      // Get or create a workspace
      let workspaceId: string;
      const workspaces = (workspacesData as any)?.workspaces;

      if (workspaces && workspaces.length > 0) {
        workspaceId = workspaces[0].id;
      } else {
        // Auto-create a default workspace
        const { data: wsData } = await createWorkspace({
          variables: { name: 'My Workspace' },
          refetchQueries: [{ query: GET_WORKSPACES }],
        });
        workspaceId = (wsData as any).createWorkspace.id;
      }

      // Create a new canvas from the template
      const { data: canvasData } = await createCanvas({
        variables: {
          workspaceId,
          title: template.title,
        },
      });

      const newCanvasId = (canvasData as any).createCanvas.id;
      navigate(`/canvas/${newCanvasId}?template=${template.id}`);
    } catch (error) {
      console.error('Failed to create canvas from template:', error);
      setCreatingTemplateId(null);
    }
  }

  const filtered = useMemo(() => TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }), [activeCategory, searchQuery]);

  const displayedTemplates = filtered.slice(0, visibleCount);

  const featured = TEMPLATES.filter((t) => t.isFeatured);

  return (
    <main style={{ flex: 1, overflowY: 'auto', height: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="templates-hero">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: 'var(--accent-light)', color: 'var(--accent-primary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
          <Sparkles size={14} /> Curated by VignetteLab
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', margin: '12px 0 8px', letterSpacing: '-0.5px' }}>Templates</h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6, margin: '0 0 28px' }}>
          Jumpstart your next project with professionally designed canvas templates. Pick a layout, customize it, and start collaborating in seconds.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '480px', marginBottom: '32px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search templates by name, tag, or keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-light)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)' }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', border: 'none', borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent', background: 'transparent', color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 400, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-1px' }}>
                <cat.icon size={16} /> {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      {activeCategory === 'all' && searchQuery === '' && (
        <section className="templates-section" style={{ paddingBottom: '0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} style={{ color: '#f59e0b' }} /> Featured Templates
          </h2>
          <div className="featured-grid">
            {featured.slice(0, 3).map((t) => (
              <TemplateCard key={`f-${t.id}`} t={t} isFeatured={true} onUseTemplate={handleUseTemplate} isCreating={creatingTemplateId === t.id} />
            ))}
          </div>
        </section>
      )}

      {/* All Templates Grid */}
      <section className="templates-section">
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
          {activeCategory === 'all' ? 'All Templates' : CATEGORIES.find(c => c.id === activeCategory)?.label}
          <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '8px' }}>({filtered.length})</span>
        </h2>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
            <Search size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '16px', fontWeight: 500 }}>No templates found</p>
            <p style={{ fontSize: '14px' }}>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="templates-grid">
              {displayedTemplates.map((t) => (
                <TemplateCard key={t.id} t={t} onUseTemplate={handleUseTemplate} isCreating={creatingTemplateId === t.id} />
              ))}
            </div>
            
            {visibleCount < filtered.length && (
              <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
                <button 
                  onClick={() => setVisibleCount(v => v + 24)} 
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: '12px', 
                    background: 'var(--bg-secondary)', 
                    color: 'var(--text-primary)', 
                    border: '1px solid var(--border-color)', 
                    cursor: 'pointer', 
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                >
                  Load More Templates
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
