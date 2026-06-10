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
        {/* Gradient Orbs */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', maxWidth: '900px', padding: '0 24px', zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '100px', padding: '8px 20px', fontSize: '14px', color: '#a78bfa', fontWeight: 600, marginBottom: '32px' }}>
            <Sparkles size={16} /> Now with AI-powered design tools
          </motion.div>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px' }}>
            What will you<br />
            <span style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6, #10b981, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% 200%', animation: 'gradientShift 4s ease infinite' }}>design today?</span>
          </h1>

          <p className="hero-subtitle" style={{ fontSize: '1.2rem', color: t.muted, lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 40px', fontWeight: 400 }}>
            VignetteLab makes it easy to create professional presentations, social media graphics, diagrams, posters, and more — with the power of AI.
          </p>

          {/* Search-style CTA like Canva */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
            className="search-cta" style={{ display: 'flex', alignItems: 'center', gap: '0', maxWidth: '560px', margin: '0 auto 28px', background: t.inputBg, borderRadius: '100px', border: `1px solid ${t.inputBorder}`, padding: '6px 6px 6px 24px', backdropFilter: 'blur(8px)' }}>
            <div className="search-input-wrapper" style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}>
              <Search size={20} style={{ color: t.mutedFaint, flexShrink: 0 }} />
              <input type="text" placeholder="Search for templates, designs..." readOnly
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: '16px', padding: '14px 16px', fontFamily: 'inherit', minWidth: 0 }} />
            </div>
            <div className="search-btn-wrapper">
              <SmartGetStartedButton href="/register" text="Start designing" size="sm" />
            </div>
          </motion.div>

          <p style={{ fontSize: '13px', color: t.mutedFaintest, marginBottom: '48px' }}>Free forever. No credit card required.</p>
        </motion.div>

        {/* Category Carousel */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
          className="cat-carousel" style={{ display: 'flex', gap: '16px', padding: '0 40px', overflowX: 'auto', maxWidth: '100%', zIndex: 10, scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat, i) => (
            <motion.a key={i} href="/register" className="cat-item"
              whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px 28px', background: t.catCardBg, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', cursor: 'pointer', textDecoration: 'none', color: t.text, minWidth: '130px', transition: 'all 0.3s ease', flexShrink: 0 }}
              onMouseOver={e => { e.currentTarget.style.background = t.catCardHover; e.currentTarget.style.borderColor = cat.color + '60'; }}
              onMouseOut={e => { e.currentTarget.style.background = t.catCardBg; e.currentTarget.style.borderColor = t.cardBorder; }}>
              <div className="cat-item-icon" style={{ width: '52px', height: '52px', borderRadius: '16px', background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: `0 8px 20px ${cat.color}40` }}>
                <cat.icon className="cat-icon-svg" size={24} />
              </div>
              <span className="cat-item-text" style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>{cat.label}</span>
            </motion.a>
          ))}
        </motion.div>
      </motion.section>

      {/* === HERO SHOWCASE IMAGE === */}
      <section className="section-pad hero-showcase-section" style={{ padding: '0 40px 100px', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ maxWidth: '1200px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', border: `1px solid ${t.cardBorder}`, boxShadow: t.imgShadow }}>
          <Image src="/hero-mockup.png" alt="VignetteLab workspace" width={1200} height={675} style={{ width: '100%', height: 'auto', display: 'block' }} />
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
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{ borderRadius: '20px', overflow: 'hidden', background: t.cardBg, border: `1px solid ${t.cardBorder}`, cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = t.cardHoverBorder; e.currentTarget.style.boxShadow = `0 20px 40px ${t.cardHoverShadow}`; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = t.cardBorder; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                  <Image src={item.img} alt={item.title} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')} />
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

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {FEATURES.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="feature-card" style={{ padding: '48px', background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: '28px', transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = f.color + '50'; e.currentTarget.style.boxShadow = `0 20px 40px ${f.color}15`; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = t.cardBorder; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: f.color + '15', color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${f.color}30`, marginBottom: '24px' }}>
                  <f.icon size={28} />
                </div>
                <h3 className="feature-title" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: t.muted, lineHeight: 1.7, fontSize: '1rem', margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
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
        ::-webkit-scrollbar { display: none; }
        
        /* Mobile First Responsive Styles */
        .desktop-nav-links { display: none !important; }
        .desktop-nav-actions { display: none !important; }
        .mobile-nav-toggle { display: flex !important; }
        .hero-title { font-size: clamp(2.2rem, 8vw, 5rem) !important; }
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
          .hero-title { font-size: clamp(2.8rem, 6vw, 5rem) !important; }
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
          .section-pad { padding: 120px 40px !important; }
          .cat-carousel { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; justify-content: center !important; padding: 0 40px !important; gap: 16px !important; }
          .cat-item { min-width: 130px !important; padding: 20px 28px !important; }
          .cat-item-icon { width: 52px !important; height: 52px !important; border-radius: 16px !important; }
          .cat-item-text { white-space: nowrap !important; }
        }
      `}</style>
    </div>
  );
}
