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
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#09090b', color: '#fafafa', minHeight: '100vh', fontFamily: 'var(--font-inter), sans-serif', overflowX: 'hidden' }}>
      
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(9, 9, 11, 0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image src={vignetteLogo} alt="VignetteLab Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
          <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>VignetteLab</span>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: 500, color: '#a1a1aa' }}>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#a1a1aa'}>Features</a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#a1a1aa'}>Pricing</a>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/login" style={{ color: '#fafafa', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Log In</Link>
          <Link href="/home" style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', padding: '10px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 600,
            textDecoration: 'none', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
            transition: 'transform 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 1 }}>
          <Particles
            particleColors={['#6366f1', '#8b5cf6', '#ec4899']}
            particleCount={1200}
            particleSpread={25}
            speed={0.3}
            particleBaseSize={150}
            moveParticlesOnHover={true}
            alphaParticles={true}
            disableRotation={false}
          />
        </div>
        <Landing3D />
        
        <motion.div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px', padding: '0 20px', y, opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '32px' }}>
            <Sparkles size={14} color="#a855f7" /> <BlurText text="Introducing Vignette AI" delay={50} animateBy="words" />
          </div>
          
          <h1 style={{ textAlign: 'center', fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Outfit', sans-serif" }}>
            <BlurText text="Design at the speed of thoughts" delay={150} animateBy="words" />
            <BlurText 
              text="thoughts." 
              delay={100} 
              animateBy="letters" 
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', padding: '0 10px', marginTop: '-0.1em', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700 }}
            />
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            The infinite canvas workspace that teams love. Draw, diagram, collaborate, and let AI transform your ideas into polished outputs — all in one place.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <Link href="/home" style={{
              background: '#fafafa', color: '#09090b', padding: '16px 32px', borderRadius: '100px', fontSize: '16px', fontWeight: 600,
              textDecoration: 'none', transition: 'transform 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start for free <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '120px 40px', position: 'relative', zIndex: 10, background: '#09090b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>Everything you need</h2>
            <p style={{ fontSize: '1.25rem', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto' }}>A thoughtfully crafted toolset that gets out of your way and lets you focus on the work that matters.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {FEATURES.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                  padding: '40px 32px', borderRadius: '24px', position: 'relative', overflow: 'hidden'
                }}
                whileHover={{ y: -8, borderColor: f.color }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${f.color}22`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <f.icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '120px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(9,9,11,0) 70%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '24px' }}>Ready to transform your workflow?</h2>
          <p style={{ fontSize: '1.25rem', color: '#a1a1aa', marginBottom: '40px' }}>Join ambitious teams using VignetteLab to build the future.</p>
          <Link href="/home" style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', padding: '18px 40px', borderRadius: '100px', fontSize: '18px', fontWeight: 600,
            textDecoration: 'none', boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
            transition: 'transform 0.2s', display: 'inline-block'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Start your free workspace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 40px 40px', background: '#09090b' }}>
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
