'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Layers, Cpu, Zap, Shield, Globe, Star, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import vignetteLogo from '@/app/workspaces/vignetteLogo.png';
import { SmartGetStartedButton, SmartLoginButton } from '@/components/SmartButtons';

const FEATURES = [
  { icon: Layers, color: '#6366f1', title: 'Infinite Canvas', desc: 'An endlessly scalable workspace. Pan, zoom, draw, and think without limits.' },
  { icon: Cpu, color: '#8b5cf6', title: 'AI-Powered Layouts', desc: 'Let Vignette AI organize your chaos into structured, beautiful diagrams instantly.' },
  { icon: Zap, color: '#f59e0b', title: 'Real-time Sync', desc: 'CRDT-powered collaboration. Multiple cursors, zero conflicts.' },
  { icon: Shield, color: '#10b981', title: 'Enterprise Security', desc: 'SOC 2 compliant. Your data, encrypted end-to-end.' },
  { icon: Globe, color: '#3b82f6', title: 'Works Everywhere', desc: 'Browser, desktop, tablet. Syncs seamlessly across all devices.' },
  { icon: Star, color: '#ec4899', title: 'Smart Templates', desc: 'Jump-start any project with 50+ professionally designed canvas templates.' },
];

const STEPS = [
  { title: "Drop your ideas", desc: "Start typing, drawing, or pasting images onto the infinite canvas." },
  { title: "Let AI structure it", desc: "Click 'Auto-Organize' and watch Vignette AI create a perfect layout." },
  { title: "Collaborate instantly", desc: "Share a link and work with your team in real-time." }
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const theme = {
    '--bg': isDark ? '#09090b' : '#fafafa',
    '--text': isDark ? '#fafafa' : '#09090b',
    '--muted': isDark ? '#a1a1aa' : '#52525b',
    '--card-bg': isDark ? 'linear-gradient(180deg, rgba(24,24,27,0.6) 0%, rgba(9,9,11,0.8) 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f4f4f5 100%)',
    '--card-border': isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    '--nav-bg': isDark ? 'rgba(9, 9, 11, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    '--nav-border': isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    '--shadow': isDark ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 30px rgba(0,0,0,0.05)',
  } as React.CSSProperties;

  return (
    <div style={{ ...theme, background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', fontFamily: "'Outfit', var(--font-inter), sans-serif", overflowX: 'hidden', transition: 'background 0.3s ease, color 0.3s ease' }}>
      
      {/* Navbar */}
      <div style={{ position: 'fixed', top: scrolled ? '16px' : '24px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 50, transition: 'all 0.3s ease' }}>
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 24px', 
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: scrolled ? `1px solid var(--nav-border)` : '1px solid transparent',
          borderRadius: '100px',
          width: '90%',
          maxWidth: '1200px',
          boxShadow: scrolled ? 'var(--shadow)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src={vignetteLogo} alt="Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
            <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>VignetteLab</span>
          </div>
          
          <div style={{ display: 'flex', gap: '32px', fontSize: '15px', fontWeight: 500, color: 'var(--muted)' }}>
            {['Features', 'How it Works', 'Pricing'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text)'} onMouseOut={e => e.currentTarget.style.color = 'inherit'}>{l}</a>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => setIsDark(!isDark)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', padding: '8px', borderRadius: '50%' }}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <SmartLoginButton href="/login" />
            <SmartGetStartedButton href="/register" text="Get Started" size="sm" />
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: isDark ? 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(9,9,11,0) 70%)' : 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(250,250,250,0) 70%)', pointerEvents: 'none' }} />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', maxWidth: '900px', padding: '0 24px', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--nav-bg)', border: '1px solid var(--card-border)', padding: '8px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, color: '#3b82f6', marginBottom: '32px' }}>
            <Sparkles size={16} /> Introducing Vignette AI 2.0
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '24px' }}>
            Design at the speed of <br/><span style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>thought.</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            The infinite canvas workspace that ambitious teams love. Draw, diagram, collaborate, and let AI transform your ideas into polished outputs — all in one unified place.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <SmartGetStartedButton href="/register" text="Start your free workspace" size="lg" />
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" style={{ padding: '120px 40px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '16px' }}>Intelligent by design</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto' }}>A meticulously engineered workspace that anticipates your needs, so you can focus entirely on your creative flow.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '24px', gridAutoRows: 'minmax(280px, auto)' }}>
            {FEATURES.map((f, i) => {
              let colSpan = 'span 2';
              if (i === 0) colSpan = 'span 4'; 
              else if (i === 3) colSpan = 'span 4'; 
              else if (i === 4) colSpan = 'span 3'; 
              else if (i === 5) colSpan = 'span 3'; 
              
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    gridColumn: colSpan,
                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                    borderRadius: '28px', position: 'relative', overflow: 'hidden',
                    boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column'
                  }}
                >
                  <div style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>{f.title}</h3>
                      <div style={{ 
                        width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                        background: isDark ? `${f.color}15` : `${f.color}20`, 
                        color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        border: `1px solid ${f.color}30`
                      }}>
                        <f.icon size={28} />
                      </div>
                    </div>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.6, fontSize: '1rem', margin: 0, maxWidth: colSpan.includes('4') || colSpan.includes('3') ? '85%' : '100%' }}>{f.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" style={{ padding: '120px 40px', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '16px' }}>How VignetteLab works</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto' }}>From scattered thoughts to structured brilliance in three simple steps.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ flex: '1 1 300px', textAlign: 'center', padding: '40px', background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, margin: '0 auto 24px' }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="pricing" style={{ padding: '120px 40px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '16px' }}>Built for global scale</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '60px' }}>Join thousands of teams already designing at the speed of thought.</p>
          
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '24px', padding: '40px 60px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px' }}>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>Active Users</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>124,500+</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>Canvases Created</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>2.4M</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>Uptime</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>99.99%</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '120px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '40px', padding: '80px 40px', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '20px' }}>Ready to transform your <br/><span style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>workflow?</span></h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>Join ambitious teams using VignetteLab to design, brainstorm, and build the future.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <SmartGetStartedButton href="/register" text="Start your free workspace" size="lg" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--card-border)', padding: '60px 40px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src={vignetteLogo} alt="Logo" width={24} height={24} style={{ borderRadius: '6px', filter: isDark ? 'none' : 'invert(1)' }} />
            <span style={{ fontWeight: 600 }}>© 2026 VignetteLab. All rights reserved.</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
