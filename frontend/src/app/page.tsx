'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, ArrowRight, Layers, Cpu, Zap, Shield, Globe, Star, Check } from 'lucide-react';
import Image from 'next/image';
import vignetteLogo from '@/app/workspaces/vignetteLogo.png';
import { SmartGetStartedButton, SmartLoginButton } from '@/components/SmartButtons';

const FEATURES = [
  { icon: Layers, title: 'Infinite Canvas', desc: 'An endlessly scalable workspace that adapts to your needs. Pan, zoom, draw, and think without boundaries.' },
  { icon: Cpu, title: 'AI-Powered Layouts', desc: 'Harness the power of Vignette AI to automatically organize your chaotic brainstorming sessions into beautiful diagrams.' },
  { icon: Zap, title: 'Real-time Sync', desc: 'Experience seamless collaboration. Work with your entire team simultaneously with zero merge conflicts.' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Built from the ground up to be SOC 2 compliant. Your intellectual property is protected with end-to-end encryption.' },
  { icon: Globe, title: 'Works Everywhere', desc: 'Access your workspaces from anywhere. Syncs your changes seamlessly across all devices for an uninterrupted workflow.' },
  { icon: Star, title: 'Smart Templates', desc: 'Never start from a blank page again. Jump-start your next project with over 50 professionally designed templates.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#1e140f', color: '#fafafa', minHeight: '100vh', fontFamily: "'Outfit', var(--font-inter), sans-serif", overflowX: 'hidden' }}>
      
      {/* Minimalist Navbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent', background: scrolled ? 'rgba(30, 20, 15, 0.8)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', transition: 'all 0.3s ease' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src={vignetteLogo} alt="Logo" width={28} height={28} style={{ borderRadius: '6px' }} />
            <span style={{ fontSize: '18px', fontWeight: 600 }}>VignetteLab</span>
          </div>
          <div style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: 500, color: '#a1a1aa' }}>
            <a href="#features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'inherit'}>Features</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'inherit'}>Pricing</a>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <SmartLoginButton href="/login" />
            <SmartGetStartedButton href="/register" text="Get Started" size="sm" />
          </div>
        </nav>
      </div>

      {/* Clean Hero */}
      <section style={{ minHeight: '95vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(30,20,15,0) 70%)', pointerEvents: 'none' }} />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ textAlign: 'center', maxWidth: '800px', padding: '0 24px', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '32px' }}>
            <Sparkles size={14} color="#71717a" /> Introducing the new workspace
          </div>
          <h1 style={{ fontSize: '5.5rem', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px' }}>
            Design at the speed of <br/><span style={{ color: '#3b82f6' }}>thought.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            The minimalist, infinite canvas workspace that teams love. Draw, diagram, collaborate, and build the future—without the clutter.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <SmartGetStartedButton href="/register" text="Start your free workspace" size="lg" />
          </div>
        </motion.div>
      </section>

      {/* Simple Features Grid */}
      <section id="features" style={{ padding: '120px 40px', background: '#1e140f', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>Everything you need.<br/>Nothing you don't.</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {FEATURES.map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ padding: '40px', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}
                whileHover={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <f.icon size={22} color="#a1a1aa" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: '#71717a', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.03)', padding: '60px 40px', background: '#1e140f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#71717a', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image src={vignetteLogo} alt="Logo" width={20} height={20} style={{ borderRadius: '4px', opacity: 0.5 }} />
            <span>© 2026 VignetteLab. Minimalism works.</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'inherit'}>Privacy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'inherit'}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
