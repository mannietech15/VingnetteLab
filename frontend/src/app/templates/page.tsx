'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Sparkles, Users, Briefcase, Code, Palette, TrendingUp, ArrowRight, Star, Eye } from 'lucide-react';
import { TEMPLATES, Template } from '@/data/templates';
import TemplatePreview from '@/components/TemplatePreview';
import TiltedCard from '@/components/TiltedCard';

const CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: Sparkles },
  { id: 'strategy', label: 'Strategy', icon: TrendingUp },
  { id: 'engineering', label: 'Engineering', icon: Code },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'agile', label: 'Agile & PM', icon: Briefcase },
  { id: 'collaboration', label: 'Collaboration', icon: Users },
];

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function TemplateCard({ t, isFeatured }: { t: Template; isFeatured?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const height = isFeatured ? '180px' : '160px';
  const preview = t.image ? t.image : <TemplatePreview pattern={t.pattern} color={t.color} width={400} height={isFeatured ? 270 : 240} />;

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        cursor: 'pointer',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'none',
        borderColor: isHovered ? t.color + '66' : 'var(--border-color)',
        // IMPORTANT: No 'overflow: hidden' here! It clips 3D transforms.
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isFeatured && <div style={{ height: '6px', borderTopLeftRadius: '14px', borderTopRightRadius: '14px', background: `linear-gradient(90deg, ${t.color}, ${t.color}88)` }} />}
      
      <div style={{ padding: '12px 12px 0', zIndex: isHovered ? 20 : 1 }}>
        <TiltedCard
          imageSrc={preview}
          altText={t.title}
          captionText={`${t.title} - ${t.category}`}
          containerHeight={height}
          containerWidth="100%"
          imageHeight="100%"
          imageWidth="100%"
          scaleOnHover={1.05}
          rotateAmplitude={12}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          overlayContent={
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              borderRadius: '15px',
              background: `linear-gradient(135deg, ${t.color}cc, ${t.color}77)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
              pointerEvents: 'none' // Allow mouse movement to pass through to TiltedCard
            }}>
              <div style={{
                pointerEvents: 'auto',
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
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                Use Template <ArrowRight size={16} />
              </div>
              {!isFeatured && (
                <div style={{
                  pointerEvents: 'auto',
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
                  cursor: 'pointer'
                }}>
                  <Eye size={18} />
                </div>
              )}
            </div>
          }
        />
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
    </div>
  );
}

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featured = TEMPLATES.filter((t) => t.isFeatured);

  return (
    <main style={{ flex: 1, overflowY: 'auto', height: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section style={{ padding: '48px 48px 0', maxWidth: '1200px', margin: '0 auto' }}>
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
        <section style={{ padding: '40px 48px 0', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} style={{ color: '#f59e0b' }} /> Featured Templates
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {featured.slice(0, 3).map((t) => (
              <TemplateCard key={`f-${t.id}`} t={t} isFeatured={true} />
            ))}
          </div>
        </section>
      )}

      {/* All Templates Grid */}
      <section style={{ padding: '40px 48px 64px', maxWidth: '1200px', margin: '0 auto' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filtered.map((t) => (
              <TemplateCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
