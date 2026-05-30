'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Sparkles, Users, Briefcase, Code, Palette, TrendingUp, ArrowRight, Star, Eye } from 'lucide-react';
import { TEMPLATES, Template } from '@/data/templates';
import TemplatePreview from '@/components/TemplatePreview';

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

// Renders either a raster image or SVG preview
function CardThumbnail({ t, hovered }: { t: Template; hovered: boolean }) {
  if (t.image) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', background: '#f1f5f9' }}>
        <Image src={t.image} alt={t.title} fill style={{ objectFit: 'cover', transition: 'transform 0.4s', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
        <HoverOverlay t={t} hovered={hovered} />
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', transition: 'transform 0.4s', transform: hovered ? 'scale(1.02)' : 'scale(1)' }}>
      <TemplatePreview pattern={t.pattern} color={t.color} width={400} height={240} />
      <HoverOverlay t={t} hovered={hovered} />
    </div>
  );
}

function HoverOverlay({ t, hovered }: { t: Template; hovered: boolean }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(135deg, ${t.color}cc, ${t.color}88)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
      opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
    }}>
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '8px 20px', borderRadius: '8px',
        background: 'white', color: '#1a1a1a', border: 'none',
        fontWeight: 600, fontSize: '13px', cursor: 'pointer',
      }}>
        Use Template <ArrowRight size={14} />
      </button>
      <button style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px', borderRadius: '8px',
        background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', cursor: 'pointer',
      }}>
        <Eye size={16} />
      </button>
    </div>
  );
}

function FeaturedThumbnail({ t, hovered }: { t: Template; hovered: boolean }) {
  if (t.image) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', background: '#f1f5f9' }}>
        <Image src={t.image} alt={t.title} fill style={{ objectFit: 'cover', transition: 'transform 0.4s', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '10px', background: 'white', color: '#1a1a1a', border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transform: hovered ? 'translateY(0)' : 'translateY(10px)', transition: 'transform 0.3s' }}>
            Use Template <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', transition: 'transform 0.4s', transform: hovered ? 'scale(1.02)' : 'scale(1)' }}>
      <TemplatePreview pattern={t.pattern} color={t.color} width={400} height={270} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '10px', background: 'white', color: '#1a1a1a', border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transform: hovered ? 'translateY(0)' : 'translateY(10px)', transition: 'transform 0.3s' }}>
          Use Template <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
              <div key={t.id} onMouseEnter={() => setHoveredCard(`f-${t.id}`)} onMouseLeave={() => setHoveredCard(null)}
                style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', cursor: 'pointer', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s', transform: hoveredCard === `f-${t.id}` ? 'translateY(-4px)' : 'none', boxShadow: hoveredCard === `f-${t.id}` ? 'var(--shadow-lg)' : 'var(--shadow-sm)' }}>
                <div style={{ height: '6px', background: `linear-gradient(90deg, ${t.color}, ${t.color}88)` }} />
                <FeaturedThumbnail t={t} hovered={hoveredCard === `f-${t.id}`} />
                <div style={{ padding: '16px 20px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: `${t.color}18`, color: t.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.category}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {formatCount(t.usageCount)} uses</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>{t.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{t.description.slice(0, 100)}...</p>
                </div>
              </div>
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
              <div key={t.id} onMouseEnter={() => setHoveredCard(t.id)} onMouseLeave={() => setHoveredCard(null)}
                style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', cursor: 'pointer', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s, border-color 0.3s', transform: hoveredCard === t.id ? 'translateY(-4px)' : 'none', boxShadow: hoveredCard === t.id ? 'var(--shadow-lg)' : 'none', borderColor: hoveredCard === t.id ? t.color + '66' : 'var(--border-color)' }}>
                <CardThumbnail t={t} hovered={hoveredCard === t.id} />
                <div style={{ padding: '14px 18px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: `${t.color}15`, color: t.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.category}</span>
                    {t.isFeatured && <Star size={14} style={{ color: '#f59e0b' }} fill="#f59e0b" />}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{t.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.description}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {t.tags.map((tag) => (
                      <span key={tag} style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '11px', background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {formatCount(t.usageCount)} uses</span>
                    <span>by {t.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
