'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles, Layers, Cpu, Zap, Shield, Globe, Star, Moon, Sun, ArrowRight, Play, Search, Wand2, PenTool, Type, ImageIcon, LayoutGrid, Presentation, Share2, Users } from 'lucide-react';
import Image from 'next/image';
import vignetteLogo from '@/app/workspaces/vignetteLogo.png';
import vignetteLab from '@/app/workspaces/vignetteLab.png';
import { SmartGetStartedButton, SmartLoginButton } from '@/components/SmartButtons';

const CATEGORIES = [
  { label: 'Presentations', icon: Presentation, color: '#7c3aed', bg: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
  { label: 'Social Media', icon: Share2, color: '#ec4899', bg: 'linear-gradient(135deg, #ec4899, #f9a8d4)' },
  { label: 'Posters', icon: ImageIcon, color: '#f59e0b', bg: 'linear-gradient(135deg, #f59e0b, #fcd34d)' },
  { label: 'Diagrams', icon: LayoutGrid, color: '#10b981', bg: 'linear-gradient(135deg, #10b981, #6ee7b7)' },
  { label: 'Whiteboards', icon: PenTool, color: '#3b82f6', bg: 'linear-gradient(135deg, #3b82f6, #93c5fd)' },
  { label: 'AI Art', icon: Wand2, color: '#f43f5e', bg: 'linear-gradient(135deg, #f43f5e, #fda4af)' },
  { label: 'Documents', icon: Type, color: '#06b6d4', bg: 'linear-gradient(135deg, #06b6d4, #67e8f9)' },
  { label: 'Team Spaces', icon: Users, color: '#8b5cf6', bg: 'linear-gradient(135deg, #8b5cf6, #c4b5fd)' },
  { label: 'Websites', icon: Globe, color: '#14b8a6', bg: 'linear-gradient(135deg, #14b8a6, #5eead4)' },
];

const SHOWCASE = [
  { img: '/hero-mockup.png', title: 'Business Presentations', cat: 'Presentations' },
  { img: '/showcase-social.png', title: 'Social Media Posts', cat: 'Social Media' },
  { img: '/showcase-presentation.png', title: 'Data Dashboards', cat: 'Analytics' },
  { img: '/showcase-poster.png', title: 'Event Posters', cat: 'Marketing' },
];

const FEATURES = [
  { icon: Layers, color: '#6366f1', title: 'Infinite Canvas', desc: 'Pan, zoom, draw, and think without any limits on a boundless workspace.' },
  { icon: Cpu, color: '#8b5cf6', title: 'AI-Powered Design', desc: 'Let AI organize your chaos into structured, beautiful outputs instantly.' },
  { icon: Zap, color: '#f59e0b', title: 'Real-time Collaboration', desc: 'Multiple cursors, zero conflicts. Work together seamlessly.' },
  { icon: Shield, color: '#10b981', title: 'Enterprise Security', desc: 'SOC 2 compliant with end-to-end encryption for all your data.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const mockupRotateX = useTransform(scrollYProgress, [0, 0.5], [15, 0]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);

  // Theme tokens
  const t = {
    bg: isDark ? '#09090b' : '#ffffff',
    text: isDark ? '#fafafa' : '#09090b',
    muted: isDark ? '#a1a1aa' : '#6b7280',
    mutedFaint: isDark ? '#71717a' : '#9ca3af',
    mutedFaintest: isDark ? '#52525b' : '#d1d5db',
    cardBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    cardBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    cardHoverBorder: isDark ? 'rgba(124,58,237,0.4)' : 'rgba(124,58,237,0.3)',
    cardHoverShadow: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.1)',
    navBg: isDark ? 'rgba(9,9,11,0.85)' : 'rgba(255,255,255,0.9)',
    navBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    navShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.08)',
    inputBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    inputBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
    sectionBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    imgShadow: isDark ? '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' : '0 40px 80px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
    catCardBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    catCardHover: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    browseBtnBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    browseBtnBorder: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    featureGrad: isDark ? 'linear-gradient(180deg, rgba(124,58,237,0.05) 0%, transparent 100%)' : 'linear-gradient(180deg, rgba(124,58,237,0.04) 0%, transparent 100%)',
    logoFilter: isDark ? 'none' : 'invert(1)',
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100vh', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden', transition: 'background 0.4s ease, color 0.4s ease' }}>

      {/* Navbar */}
      <div style={{ position: 'fixed', top: scrolled ? '12px' : '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 50, transition: 'all 0.3s ease' }}>
        <nav className="nav-wrapper" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 24px',
          background: scrolled ? t.navBg : 'transparent',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: scrolled ? `1px solid ${t.navBorder}` : '1px solid transparent',
          borderRadius: '100px', width: '92%', maxWidth: '1300px',
          boxShadow: scrolled ? t.navShadow : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src={vignetteLogo} alt="Logo" width={32} height={32} style={{ borderRadius: '8px', filter: t.logoFilter }} />
            <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>VignetteLab</span>
          </div>
          
          <div className="desktop-nav-links" style={{ display: 'flex', gap: '28px', fontSize: '14px', fontWeight: 500, color: t.muted }}>
            {['Features', 'Templates', 'Pricing', 'Enterprise'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.color = t.text)} onMouseOut={e => (e.currentTarget.style.color = t.muted)}>{l}</a>
            ))}
          </div>

          <div className="desktop-nav-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <motion.button onClick={() => setIsDark(!isDark)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', transition: 'color 0.3s' }}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <SmartLoginButton href="/login" />
            <SmartGetStartedButton href="/register" text="Get Started Free" size="sm" />
          </div>

          <div className="mobile-nav-toggle" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
            <motion.button onClick={() => setIsDark(!isDark)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', transition: 'color 0.3s' }}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }}
              style={{ position: 'absolute', top: 'calc(100% + 12px)', left: '16px', right: '16px', background: t.navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: `1px solid ${t.navBorder}`, borderRadius: '24px', padding: '24px', zIndex: 40, display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: t.navShadow }}>
              {['Features', 'Templates', 'Pricing', 'Enterprise'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ color: t.text, textDecoration: 'none', fontSize: '18px', fontWeight: 600 }}>{l}</a>
              ))}
              <hr style={{ border: 'none', borderTop: `1px solid ${t.navBorder}`, margin: '4px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <SmartLoginButton href="/login" />
                <SmartGetStartedButton href="/register" text="Get Started Free" size="lg" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* === HERO === */}
      <motion.section ref={heroRef} className="hero-section" style={{ opacity: heroOpacity, scale: heroScale, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: '100px', paddingBottom: '60px', overflow: 'hidden' }}>

        {/* Dot grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: isDark ? 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)' : 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none', zIndex: 0 }} />

        {/* Ambient Background Orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '10%', left: '15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)', filter: 'blur(60px)', animation: 'floatOrb1 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 65%)', filter: 'blur(60px)', animation: 'floatOrb2 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: '30%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)', filter: 'blur(60px)', animation: 'floatOrb3 12s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '900px', height: '900px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="hero-content" style={{ textAlign: 'center', maxWidth: '1100px', width: '100%', padding: '0 40px', zIndex: 10 }}>
          
          {/* Animated Shimmer Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="hero-badge"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', position: 'relative', borderRadius: '100px', padding: '8px 20px', fontSize: '14px', color: '#c4b5fd', fontWeight: 600, marginBottom: '28px', background: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.08)', overflow: 'hidden', cursor: 'default' }}>
            <div className="badge-shimmer" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
              <Sparkles size={15} style={{ color: '#a78bfa' }} />
              <span>Now with AI-powered design tools</span>
              <span style={{ background: 'linear-gradient(90deg, #7c3aed, #3b82f6)', borderRadius: '100px', padding: '2px 10px', fontSize: '11px', color: '#fff', fontWeight: 700, letterSpacing: '0.02em' }}>NEW</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }} className="hero-title" style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.05em', marginBottom: '24px' }}>
            What will you<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa, #34d399, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '300% 300%', animation: 'gradientShift 5s ease infinite' }}>design today?</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="hero-subtitle" style={{ fontSize: '1.25rem', color: t.muted, lineHeight: 1.75, maxWidth: '640px', margin: '0 auto 36px', fontWeight: 400 }}>
            From polished presentations to social graphics — create anything with <strong style={{ color: t.text, fontWeight: 600 }}>AI-powered tools</strong> and a drag-and-drop canvas.
          </motion.p>

          {/* Premium Search CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}
            className="search-cta-wrapper" style={{ position: 'relative', maxWidth: '660px', margin: '0 auto 20px' }}>
            <div className="search-cta-glow" />
            <div className="search-cta pulse-glow-border" style={{ display: 'flex', alignItems: 'center', gap: '0', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', borderRadius: '100px', border: isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.1)', padding: '6px 6px 6px 22px', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
              <div className="search-input-wrapper" style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '10px' }}>
                <Search size={18} style={{ color: t.mutedFaint, flexShrink: 0 }} />
                <input type="text" placeholder="Search for templates, designs..." readOnly
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: '15px', padding: '13px 12px', fontFamily: 'inherit', minWidth: 0 }} />
              </div>
              <div className="search-btn-wrapper">
                <SmartGetStartedButton href="/register" text="Start designing" size="sm" />
              </div>
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ fontSize: '13px', color: t.mutedFaintest, marginBottom: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <span>✓ Free forever</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>✓ No credit card required</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>✓ Instant access</span>
          </motion.p>
        </motion.div>

        {/* Category Carousel - staggered entrance */}
        <div className="cat-carousel" style={{ display: 'flex', gap: '16px', padding: '0 40px', overflowX: 'auto', maxWidth: '100%', zIndex: 10, scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat, i) => (
            <motion.a key={i} href="/register" className="cat-item"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ scale: 1.06, y: -10 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '18px 22px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', borderRadius: '22px', cursor: 'pointer', textDecoration: 'none', color: t.text, minWidth: '118px', transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)', flexShrink: 0, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', position: 'relative', overflow: 'hidden' }}
              onMouseOver={e => {
                e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = cat.color + '90';
                e.currentTarget.style.boxShadow = `0 20px 40px ${cat.color}30, 0 0 0 1px ${cat.color}20`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                className="cat-item-icon"
                style={{ width: '52px', height: '52px', borderRadius: '16px', background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: `0 8px 24px ${cat.color}50, inset 0 1px 0 rgba(255,255,255,0.2)` }}>
                <cat.icon className="cat-icon-svg" size={22} strokeWidth={2} />
              </motion.div>
              <span className="cat-item-text" style={{ fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{cat.label}</span>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* === HERO SHOWCASE IMAGE === */}
      <section className="section-pad hero-showcase-section" style={{ padding: '0 40px 100px', position: 'relative', zIndex: 10, perspective: '1200px' }}>
        <motion.div style={{ rotateX: mockupRotateX, scale: mockupScale, transformStyle: 'preserve-3d', maxWidth: '960px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', border: `1px solid ${t.cardBorder}`, boxShadow: t.imgShadow, maxHeight: '500px', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05), transparent)', zIndex: 10, pointerEvents: 'none' }} />
          <Image src="/hero-mockup.png" alt="VignetteLab workspace" width={1200} height={675} style={{ width: '100%', height: '500px', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
        </motion.div>
      </section>

      {/* === SOCIAL PROOF BAR === */}
      <section className="section-pad" style={{ padding: '60px 40px', borderTop: `1px solid ${t.sectionBorder}`, borderBottom: `1px solid ${t.sectionBorder}` }}>
        <div className="stats-container" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
          {[
            { num: '124,500+', label: 'Active creators' },
            { num: '2.4M', label: 'Designs created' },
            { num: '50+', label: 'Template categories' },
            { num: '99.99%', label: 'Uptime', accent: true },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: s.accent ? '#10b981' : t.text }}>{s.num}</div>
              <div style={{ fontSize: '14px', color: t.mutedFaint, fontWeight: 500, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === SHOWCASE GRID (Canva-style) === */}
      <section id="templates" className="section-pad" style={{ padding: '120px 40px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Start with a stunning <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>template</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: t.muted, maxWidth: '550px', margin: '0 auto' }}>Browse thousands of professional templates for every need. Customize anything with drag-and-drop simplicity.</p>
          </motion.div>

          <div className="showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {SHOWCASE.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
                whileHover={{ y: -10 }}
                className="showcase-card"
                style={{ borderRadius: '20px', overflow: 'hidden', background: t.cardBg, border: `1px solid ${t.cardBorder}`, cursor: 'pointer', transition: 'all 0.4s ease', position: 'relative' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = t.cardHoverBorder; e.currentTarget.style.boxShadow = `0 20px 40px ${t.cardHoverShadow}`; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = t.cardBorder; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
                  <Image src={item.img} alt={item.title} width={400} height={400} className="showcase-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
                  <div className="showcase-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.4s ease', pointerEvents: 'none' }} />
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: t.mutedFaint }}>{item.cat}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <motion.a href="/register" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '100px', border: `1px solid ${t.browseBtnBorder}`, background: t.browseBtnBg, color: t.text, fontSize: '15px', fontWeight: 600, textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
              Browse all templates <ArrowRight size={18} />
            </motion.a>
          </div>
        </div>
      </section>

      {/* === FEATURES === */}
      <section id="features" className="section-pad" style={{ padding: '120px 40px', background: t.featureGrad }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Everything you need to <span style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>create</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: t.muted, maxWidth: '550px', margin: '0 auto' }}>A complete visual workspace with powerful tools that help you go from idea to polished design in minutes.</p>
          </motion.div>

          <div className="features-bento">
            {FEATURES.map((f, i) => {
              const isLarge = i === 0 || i === 3;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className={`feature-card bento-${i} group`} style={{ position: 'relative', overflow: 'hidden', padding: '48px', background: t.cardBg, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: `1px solid ${t.cardBorder}`, borderRadius: '32px', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'default', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = f.color + '60'; e.currentTarget.style.boxShadow = `0 30px 60px ${f.color}15`; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = t.cardBorder; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle, ${f.color}10 0%, transparent 50%)`, opacity: 0, transition: 'opacity 0.5s', pointerEvents: 'none' }} className="bento-glow" />
                  <motion.div whileHover={{ scale: 1.15, rotate: 8 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} style={{ width: '64px', height: '64px', borderRadius: '20px', background: f.color + '15', color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${f.color}30`, marginBottom: '32px', zIndex: 2 }}>
                    <f.icon size={32} />
                  </motion.div>
                  <h3 className="feature-title" style={{ fontSize: isLarge ? '2rem' : '1.5rem', fontWeight: 800, marginBottom: '16px', zIndex: 2, letterSpacing: '-0.02em' }}>{f.title}</h3>
                  <p style={{ color: t.muted, lineHeight: 1.7, fontSize: '1.1rem', margin: 0, zIndex: 2, maxWidth: isLarge ? '80%' : '100%' }}>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === BIG CTA SECTION === */}
      <section className="section-pad" style={{ padding: '140px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '24px', lineHeight: 1.1 }}>
            Ready to bring your<br />ideas to <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>life?</span>
          </h2>
          <p style={{ fontSize: '1.15rem', color: t.muted, marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Join over 124,000 creators already using VignetteLab. Start for free, no credit card needed.
          </p>
          <SmartGetStartedButton href="/register" text="Start designing for free" size="lg" />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="section-pad footer-section" style={{ borderTop: `1px solid ${t.sectionBorder}`, padding: '60px 40px', background: t.bg }}>
        <div className="footer-content" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: t.mutedFaintest, fontSize: '14px', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src={vignetteLogo} alt="Logo" width={24} height={24} style={{ borderRadius: '6px', filter: t.logoFilter }} />
            <span style={{ fontWeight: 600 }}>© 2026 VignetteLab. All rights reserved.</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Contact', 'Blog'].map(l => (
              <a key={l} href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.color = t.muted)} onMouseOut={e => (e.currentTarget.style.color = t.mutedFaintest)}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.08); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, 30px) scale(1.05); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.1); }
        }
        @keyframes badgeShimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }
        ::-webkit-scrollbar { display: none; }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
          50% { box-shadow: 0 0 40px 0 rgba(124, 58, 237, 0.35), 0 0 80px 0 rgba(59, 130, 246, 0.1); }
        }
        .pulse-glow-border { animation: pulseGlow 4s infinite ease-in-out; }
        .showcase-card:hover .showcase-img { transform: scale(1.08) !important; }
        .showcase-card:hover .showcase-overlay { opacity: 1 !important; }
        .feature-card:hover .bento-glow { opacity: 1 !important; }

        /* Hero Badge */
        .hero-badge { border: 1px solid rgba(124,58,237,0.35); }
        .badge-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.25), transparent);
          animation: badgeShimmer 3.5s ease-in-out infinite;
        }

        /* Search CTA glow */
        .search-cta-wrapper { position: relative; }
        .search-cta-glow {
          position: absolute; inset: -2px; border-radius: 100px;
          background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(59,130,246,0.4), rgba(16,185,129,0.3));
          opacity: 0; filter: blur(8px);
          transition: opacity 0.4s ease;
          z-index: -1;
        }
        .search-cta-wrapper:hover .search-cta-glow { opacity: 1; }

        .features-bento { display: grid; grid-template-columns: repeat(1, 1fr); gap: 24px; }
        .bento-0 { grid-column: span 1; }
        .bento-1 { grid-column: span 1; }
        .bento-2 { grid-column: span 1; }
        .bento-3 { grid-column: span 1; }

        /* Mobile First Responsive Styles */
        .desktop-nav-links { display: none !important; }
        .desktop-nav-actions { display: none !important; }
        .mobile-nav-toggle { display: flex !important; }
        .hero-title { font-size: clamp(2.2rem, 8vw, 4rem) !important; }
        .hero-section { padding-top: 100px !important; padding-bottom: 40px !important; }
        .hero-subtitle { font-size: 1rem !important; margin-bottom: 24px !important; }
        .search-cta { flex-direction: column !important; gap: 12px !important; padding: 12px !important; border-radius: 24px !important; }
        .search-input-wrapper { width: 100% !important; padding: 0 !important; }
        .search-btn-wrapper { width: 100% !important; }
        .search-btn-wrapper > a { width: 100% !important; justify-content: center !important; }
        
        .section-pad { padding: 60px 20px !important; }
        .hero-showcase-section { padding: 0 20px 60px !important; }
        .showcase-grid { grid-template-columns: repeat(1, 1fr) !important; gap: 16px !important; }
        .features-grid { grid-template-columns: repeat(1, 1fr) !important; gap: 20px !important; }
        .stats-container { flex-direction: column !important; gap: 32px !important; }
        .nav-wrapper { width: 95% !important; padding: 8px 16px !important; }
        .cat-carousel { 
          display: grid !important; 
          grid-template-columns: repeat(3, 1fr) !important; 
          gap: 10px !important;
          padding: 0 16px !important;
          overflow: visible !important;
        }
        .cat-item {
          min-width: 0 !important;
          padding: 12px 8px !important;
          gap: 8px !important;
        }
        .cat-item-icon {
          width: 36px !important; height: 36px !important; border-radius: 10px !important;
        }
        .cat-icon-svg { width: 18px !important; height: 18px !important; }
        .cat-item-text { font-size: 11px !important; white-space: normal !important; text-align: center !important; line-height: 1.2 !important; }
        .footer-content { flex-direction: column !important; gap: 24px !important; text-align: center !important; justify-content: center !important; }
        .feature-card { padding: 32px 24px !important; }
        .feature-title { font-size: 1.2rem !important; }
        .footer-section { padding: 40px 20px !important; }
        
        @media (min-width: 480px) {
          .cat-carousel { gap: 12px !important; padding: 0 20px !important; }
          .cat-item { padding: 16px 12px !important; gap: 10px !important; }
          .cat-item-icon { width: 40px !important; height: 40px !important; border-radius: 12px !important; }
          .cat-icon-svg { width: 20px !important; height: 20px !important; }
          .cat-item-text { font-size: 12px !important; }
        }

        @media (min-width: 640px) {
          .stats-container { flex-direction: row !important; flex-wrap: wrap !important; }
          .footer-content { flex-direction: row !important; text-align: left !important; justify-content: space-between !important; }
          .cat-carousel { grid-template-columns: repeat(4, 1fr) !important; gap: 16px !important; }
          .cat-item { padding: 20px 16px !important; }
          .cat-item-icon { width: 48px !important; height: 48px !important; border-radius: 14px !important; }
          .cat-icon-svg { width: 24px !important; height: 24px !important; }
          .cat-item-text { font-size: 13px !important; }
        }
        
        @media (min-width: 768px) {
          .desktop-nav-links { display: flex !important; }
          .desktop-nav-actions { display: flex !important; }
          .mobile-nav-toggle { display: none !important; }
          .hero-title { font-size: clamp(3.2rem, 6vw, 5.5rem) !important; }
          .hero-section { padding-top: 120px !important; padding-bottom: 60px !important; }
          .hero-subtitle { font-size: 1.2rem !important; margin-bottom: 40px !important; }
          .search-cta { flex-direction: row !important; gap: 0 !important; padding: 6px 6px 6px 24px !important; border-radius: 100px !important; }
          .search-btn-wrapper { width: auto !important; }
          .search-btn-wrapper > a { width: auto !important; }
          
          .section-pad { padding: 100px 40px !important; }
          .hero-showcase-section { padding: 0 40px 100px !important; }
          .showcase-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
          .nav-wrapper { width: 92% !important; padding: 10px 24px !important; }
          .cat-carousel { padding: 0 40px !important; }
          .feature-card { padding: 48px !important; }
          .feature-title { font-size: 1.4rem !important; }
          .footer-section { padding: 60px 40px !important; }
        }
        
        @media (min-width: 1024px) {
          .showcase-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .section-pad { padding: 120px 60px !important; }
          .cat-carousel { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; justify-content: center !important; padding: 0 60px !important; gap: 16px !important; }
          .cat-item { min-width: 140px !important; padding: 22px 28px !important; }
          .cat-item-icon { width: 60px !important; height: 60px !important; border-radius: 18px !important; }
          .cat-icon-svg { width: 28px !important; height: 28px !important; }
          .cat-item-text { white-space: nowrap !important; font-size: 13px !important; }
          .hero-title { font-size: clamp(4rem, 6.5vw, 6.5rem) !important; }
          .hero-subtitle { font-size: 1.3rem !important; }
          .hero-content { padding: 0 60px !important; }
          
          .features-bento { grid-template-columns: repeat(6, 1fr); }
          .bento-0 { grid-column: span 4; }
          .bento-1 { grid-column: span 2; }
          .bento-2 { grid-column: span 2; }
          .bento-3 { grid-column: span 4; }
        }

        @media (min-width: 1280px) {
          .hero-title { font-size: clamp(5rem, 6vw, 7rem) !important; letter-spacing: -0.055em !important; }
          .hero-subtitle { font-size: 1.35rem !important; max-width: 700px !important; }
          .hero-content { max-width: 1200px !important; }
          .cat-carousel { gap: 20px !important; padding: 0 80px !important; }
          .cat-item { min-width: 150px !important; padding: 24px 32px !important; gap: 14px !important; }
          .cat-item-icon { width: 64px !important; height: 64px !important; border-radius: 20px !important; }
          .cat-icon-svg { width: 30px !important; height: 30px !important; }
          .cat-item-text { font-size: 14px !important; }
          .section-pad { padding: 140px 80px !important; }
          .hero-showcase-section { padding: 0 80px 120px !important; }
        }

        @media (min-width: 1440px) {
          .hero-title { font-size: 7rem !important; }
          .hero-content { max-width: 1300px !important; padding: 0 80px !important; }
          .cat-item { padding: 26px 36px !important; min-width: 160px !important; }
          .cat-item-icon { width: 68px !important; height: 68px !important; }
          .cat-icon-svg { width: 32px !important; height: 32px !important; }
          .cat-item-text { font-size: 14.5px !important; }
        }
      `}</style>
    </div>
  );
}
