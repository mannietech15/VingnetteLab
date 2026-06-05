'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, ArrowRight, Layers, Cpu, Zap, Shield, Globe, Star, Check } from 'lucide-react';
import Image from 'next/image';
import vignetteLogo from '@/app/workspaces/vignetteLogo.png';
import Landing3D from '@/components/Landing3D';
import Particles from '@/components/Particles';
import BlurText from '@/components/BlurText';
import { SmartGetStartedButton, SmartLoginButton } from '@/components/SmartButtons';

const FEATURES = [
  { icon: Layers, color: '#6366f1', title: 'Infinite Canvas', desc: 'An endlessly scalable workspace. Pan, zoom, draw, and think without limits.' },
  { icon: Cpu, color: '#8b5cf6', title: 'AI-Powered Layouts', desc: 'Let Vignette AI organize your chaos into structured, beautiful diagrams instantly.' },
  { icon: Zap, color: '#f59e0b', title: 'Real-time Sync', desc: 'CRDT-powered collaboration. Multiple cursors, zero conflicts.' },
  { icon: Shield, color: '#10b981', title: 'Enterprise Security', desc: 'SOC 2 compliant. Your data, encrypted end-to-end.' },
  { icon: Globe, color: '#3b82f6', title: 'Works Everywhere', desc: 'Browser, desktop, tablet. Syncs seamlessly across all devices.' },
  { icon: Star, color: '#ec4899', title: 'Smart Templates', desc: 'Jump-start any project with 50+ professionally designed canvas templates.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Setup intersection observer for sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <div style={{ background: '#09090b', color: '#fafafa', minHeight: '100vh', fontFamily: "'Outfit', var(--font-inter), sans-serif", overflowX: 'hidden' }}>
      
      {/* Global Particles Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 1, pointerEvents: 'none' }}>
        <Particles
          particleColors={['#3b82f6', '#10b981', '#059669']}
          particleCount={1200}
          particleSpread={25}
          speed={0.3}
          particleBaseSize={150}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Navbar */}
      <div style={{ position: 'fixed', top: scrolled ? '16px' : '24px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 50, pointerEvents: 'none', transition: 'all 0.3s ease' }}>
        <nav style={{
          pointerEvents: 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 24px', 
          background: scrolled ? 'rgba(9, 9, 11, 0.6)' : 'rgba(9, 9, 11, 0.3)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '100px',
          width: '90%',
          maxWidth: '1100px',
          boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 4px 20px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image src={vignetteLogo} alt="VignetteLab Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
          <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>VignetteLab</span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#a1a1aa' }}>
          {[
            { id: 'features', label: 'Design' },
            { id: 'scale', label: 'Scale' },
            { id: 'pricing', label: 'Pricing' }
          ].map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              style={{ 
                color: activeSection === link.id ? '#fff' : 'inherit', 
                background: activeSection === link.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                padding: '6px 16px',
                borderRadius: '100px',
                textDecoration: 'none', 
                transition: 'all 0.2s ease'
              }} 
              onMouseOver={e => { if (activeSection !== link.id) e.currentTarget.style.color = '#fff' }} 
              onMouseOut={e => { if (activeSection !== link.id) e.currentTarget.style.color = 'inherit' }}
            >
              {link.label}
            </a>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <SmartLoginButton href="/login" />
          <SmartGetStartedButton href="/register" text="Get Started" size="sm" />
        </div>
      </nav>
      </div>

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', overflow: 'hidden' }}>
        <Landing3D />
        
        <motion.div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px', padding: '0 20px', y, opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '32px' }}>
            <Sparkles size={14} color="#10b981" /> <BlurText text="Introducing Vignette AI" delay={50} animateBy="words" />
          </div>
          
          <h1 style={{ textAlign: 'center', fontSize: 'clamp(3rem, 5.5vw, 5rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Outfit', sans-serif" }}>
            <BlurText text="Design at the speed of" delay={150} animateBy="words" />
            <BlurText 
              text="thoughts." 
              delay={100} 
              animateBy="letters" 
              style={{ marginTop: '-0.2em', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700 }}
              spanStyle={{ background: 'linear-gradient(135deg, #3b82f6, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', padding: '0 5px' }}
            />
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            The infinite canvas workspace that teams love. Draw, diagram, collaborate, and let AI transform your ideas into polished outputs — all in one place.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <SmartGetStartedButton href="/register" text="Start for free" size="md" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '120px 40px', position: 'relative', zIndex: 10, background: 'transparent' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px', fontFamily: "'Outfit', sans-serif" }}>Intelligent by design</h2>
            <p style={{ fontSize: '1.25rem', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto' }}>A meticulously engineered workspace that anticipates your needs, so you can focus entirely on your creative flow.</p>
          </div>
          
          {/* Bento Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '24px', gridAutoRows: 'minmax(320px, auto)' }}>
            {FEATURES.map((f, i) => {
              // Calculate bento box spanning
              let colSpan = 'span 2';
              if (i === 0) colSpan = 'span 4'; // Top left large
              else if (i === 1) colSpan = 'span 2'; // Top right small
              else if (i === 2) colSpan = 'span 2'; // Middle left small
              else if (i === 3) colSpan = 'span 4'; // Middle right large
              else if (i === 4) colSpan = 'span 3'; // Bottom left half
              else if (i === 5) colSpan = 'span 3'; // Bottom right half
              
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    gridColumn: colSpan,
                    background: 'linear-gradient(180deg, rgba(24,24,27,0.6) 0%, rgba(9,9,11,0.8) 100%)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '28px', position: 'relative', overflow: 'hidden',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.5)',
                    display: 'flex', flexDirection: 'column'
                  }}
                  whileHover={{ y: -4, borderColor: `${f.color}66`, boxShadow: `0 15px 40px -10px ${f.color}44, inset 0 1px 1px rgba(255,255,255,0.1)` }}
                >
                  {/* Ambient Background Glow inside the card */}
                  <div style={{ 
                    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, pointerEvents: 'none',
                    background: `radial-gradient(circle at ${i % 2 === 0 ? 'top right' : 'bottom left'}, ${f.color}15 0%, transparent 60%)`,
                    opacity: 0.8
                  }} />
                  
                  {/* Glassmorphic Icon Box */}
                  <div style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      width: '56px', height: '56px', borderRadius: '16px', 
                      background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0))`, 
                      backdropFilter: 'blur(10px)',
                      color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      marginBottom: 'auto', border: `1px solid rgba(255,255,255,0.1)`, 
                      boxShadow: `inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.2)` 
                    }}>
                      <f.icon size={26} />
                    </div>
                    
                    <div style={{ marginTop: '60px' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>{f.title}</h3>
                      <p style={{ color: '#a1a1aa', lineHeight: 1.6, fontSize: '1.1rem' }}>{f.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Graph / Social Proof Section */}
      <section id="scale" style={{ padding: '120px 40px', position: 'relative', zIndex: 10, background: 'transparent' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px', fontFamily: "'Outfit', sans-serif" }}>Built for global scale</h2>
          <p style={{ fontSize: '1.25rem', color: '#a1a1aa', marginBottom: '60px' }}>Join thousands of teams already designing at the speed of thought.</p>
          
          <div style={{
            background: 'linear-gradient(180deg, rgba(24,24,27,0.4) 0%, rgba(9,9,11,0.6) 100%)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Stats Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', textAlign: 'left', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ color: '#a1a1aa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>Active Users</div>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>124,500+</div>
              </div>
              <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: '#a1a1aa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>Canvases Created</div>
                  <div style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>2.4M</div>
                </div>
                <div>
                  <div style={{ color: '#a1a1aa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>Uptime</div>
                  <div style={{ fontSize: '2rem', fontWeight: 600, color: '#10b981', fontFamily: "'Outfit', sans-serif" }}>99.99%</div>
                </div>
              </div>
            </div>

            {/* SVG Graph */}
            <div style={{ height: '240px', width: '100%', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 1000 240" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                <path d="M 0 60 L 1000 60 M 0 120 L 1000 120 M 0 180 L 1000 180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Fill Area */}
                <motion.path 
                  d="M 0 240 L 0 200 C 150 190, 300 180, 450 150 C 600 120, 650 140, 750 80 C 850 20, 950 40, 1000 20 L 1000 240 Z"
                  fill="url(#fillGrad)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  viewport={{ once: true, margin: '-100px' }}
                />

                {/* Animated Line */}
                <motion.path 
                  d="M 0 200 C 150 190, 300 180, 450 150 C 600 120, 650 140, 750 80 C 850 20, 950 40, 1000 20"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                  viewport={{ once: true, margin: '-100px' }}
                />
                
                {/* Glowing dot at end */}
                <motion.circle 
                  cx="1000" cy="20" r="6" 
                  fill="#10b981" 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 2.2, type: 'spring' }}
                  viewport={{ once: true, margin: '-100px' }}
                  style={{ filter: 'drop-shadow(0 0 12px #10b981)' }}
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '120px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(9,9,11,0) 70%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '24px' }}>Ready to transform your workflow?</h2>
          <p style={{ fontSize: '1.25rem', color: '#a1a1aa', marginBottom: '40px' }}>Join ambitious teams using VignetteLab to build the future.</p>
          <SmartGetStartedButton href="/register" text="Start your free workspace" size="lg" />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 40px 40px', background: 'transparent', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Image src={vignetteLogo} alt="Logo" width={24} height={24} style={{ borderRadius: '6px' }} />
              <span style={{ fontSize: '18px', fontWeight: 700 }}>VignetteLab</span>
            </div>
            <p style={{ color: '#71717a', fontSize: '14px', maxWidth: '300px' }}>The infinite canvas for ambitious teams. Draw, diagram, collaborate, and let AI transform your ideas.</p>
          </div>
          <div style={{ display: 'flex', gap: '80px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontWeight: 600, marginBottom: '8px' }}>Product</span>
              {['Features', 'Pricing', 'Templates', 'Changelog'].map(l => <a key={l} href="#" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}>{l}</a>)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontWeight: 600, marginBottom: '8px' }}>Company</span>
              {['About', 'Blog', 'Careers', 'Contact'].map(l => <a key={l} href="#" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}>{l}</a>)}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '40px auto 0', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', color: '#71717a', fontSize: '14px' }}>
          <span>© 2026 VignetteLab. All rights reserved.</span>
          <span>Made with ❤️ for creators everywhere.</span>
        </div>
      </footer>
    </div>
  );
}
