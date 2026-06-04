'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles, ArrowRight, Play, Check, ChevronDown,
  Sun, Moon, Menu, X, Star, Zap, Shield, Globe, Layers, Cpu
} from 'lucide-react';
import vignetteLogo from '@/app/workspaces/vignetteLogo.png';
import './landing.css';

/* ─── DATA ──────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

const FEATURES = [
  { icon: Layers, color: '#6366f1', title: 'Infinite Canvas', desc: 'An endlessly scalable workspace. Pan, zoom, draw, and think without limits.', span: 'large' },
  { icon: Cpu, color: '#8b5cf6', title: 'AI-Powered Layouts', desc: 'Let Vignette AI organize your chaos into structured, beautiful diagrams instantly.', span: 'large' },
  { icon: Zap, color: '#f59e0b', title: 'Real-time Sync', desc: 'CRDT-powered collaboration. Multiple cursors, zero conflicts.' },
  { icon: Shield, color: '#10b981', title: 'Enterprise Security', desc: 'SOC 2 compliant. Your data, encrypted end-to-end.' },
  { icon: Globe, color: '#3b82f6', title: 'Works Everywhere', desc: 'Browser, desktop, tablet. Syncs seamlessly across all devices.' },
  { icon: Star, color: '#ec4899', title: 'Smart Templates', desc: 'Jump-start any project with 50+ professionally designed canvas templates.' },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Head of Design, Stripe', quote: 'VignetteLab replaced 4 tools for our design team. The canvas experience is unlike anything else.', initials: 'SC', color: '#6366f1' },
  { name: 'Marcus Webb', role: 'CTO, Linear', quote: 'The AI layout feature cut our architecture planning time in half. Absolutely remarkable.', initials: 'MW', color: '#10b981' },
  { name: 'Priya Nair', role: 'Product Lead, Vercel', quote: 'Our entire product team lives in VignetteLab now. It\'s the best collaborative canvas on the market.', initials: 'PN', color: '#f59e0b' },
  { name: 'James Okafor', role: 'Founder, Figma', quote: 'The performance is insane. 10,000 elements on canvas and it\'s still buttery smooth.', initials: 'JO', color: '#ec4899' },
  { name: 'Lena Müller', role: 'Engineering Director, GitHub', quote: 'Finally a canvas tool built by engineers, for engineers. The keyboard shortcuts alone are worth it.', initials: 'LM', color: '#3b82f6' },
  { name: 'Alex Rivera', role: 'Design Systems, Shopify', quote: 'I\'ve tried every canvas tool out there. VignetteLab wins on every single dimension.', initials: 'AR', color: '#8b5cf6' },
];

const PRICING = [
  {
    name: 'Free', price: { monthly: 0, annual: 0 }, desc: 'Perfect for individuals exploring infinite canvas.',
    features: ['3 canvases', '10MB storage', 'Basic shapes & drawing', 'Export to PNG', 'Community support'],
    cta: 'Get Started Free', highlight: false,
  },
  {
    name: 'Pro', price: { monthly: 19, annual: 15 }, desc: 'For professionals who demand the best canvas experience.',
    features: ['Unlimited canvases', '100GB storage', 'Vignette AI (500 generations/mo)', 'Real-time collaboration (5 users)', 'All templates', 'Priority support', 'Custom fonts & export'],
    cta: 'Start Pro Trial', highlight: true,
  },
  {
    name: 'Enterprise', price: { monthly: 79, annual: 59 }, desc: 'For teams that need power, security, and scale.',
    features: ['Everything in Pro', 'Unlimited users', 'SSO / SAML', 'SOC 2 compliance', 'Dedicated Vignette AI', 'Custom integrations', 'SLA guarantee', '24/7 dedicated support'],
    cta: 'Contact Sales', highlight: false,
  },
];

const FAQS = [
  { q: 'Is VignetteLab truly free to start?', a: 'Yes — no credit card required. Create an account and get 3 canvases and all core tools instantly.' },
  { q: 'How does the AI layout feature work?', a: 'Vignette AI analyzes your canvas elements and uses generative models to reorganize them into clean, structured layouts — flowcharts, hierarchies, grids, and more.' },
  { q: 'Can I collaborate in real time?', a: 'Absolutely. Pro plan supports up to 5 simultaneous collaborators with live cursors, powered by our CRDT engine built on Yjs.' },
  { q: 'Is my data secure?', a: 'All data is encrypted in transit and at rest. Enterprise plans include SOC 2 compliance and private cloud deployment options.' },
  { q: 'Can I import from Figma or Miro?', a: 'We currently support importing from Figma via our plugin and from Miro via JSON export. More integrations are shipping soon.' },
];

/* ─── COMPONENT ─────────────────────────────────────────── */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  /* theme */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* navbar scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    const count = 80;
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const isDark = theme === 'dark';

      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.3)';
        ctx.fill();
      });

      /* draw connections */
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(99,102,241,${0.15 * (1 - dist / 120)})`
              : `rgba(99,102,241,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [theme]);

  /* scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`landing-root ${theme}`}>
      {/* ── PARTICLE CANVAS ── */}
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* ══════════ NAVBAR ══════════ */}
      <nav className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav__inner">
          {/* Logo */}
          <Link href="/landing" className="lp-nav__logo">
            <Image src={vignetteLogo} alt="VignetteLab" width={32} height={32} style={{ borderRadius: 8 }} />
            <span className="lp-nav__brand">VignetteLab</span>
          </Link>

          {/* Center links */}
          <ul className="lp-nav__links">
            {NAV_LINKS.map(l => (
              <li key={l.label}>
                <a href={l.href} className="lp-nav__link">{l.label}</a>
              </li>
            ))}
          </ul>

          {/* Right CTAs */}
          <div className="lp-nav__actions">
            <button
              className="lp-icon-btn"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/login" className="lp-btn lp-btn--ghost">Log In</Link>
            <Link href="/register" className="lp-btn lp-btn--primary">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="lp-hamburger"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`lp-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              className="lp-mobile-link"
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="lp-mobile-btns">
            <Link href="/login" className="lp-btn lp-btn--ghost" style={{ flex: 1 }}>Log In</Link>
            <Link href="/register" className="lp-btn lp-btn--primary" style={{ flex: 1 }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section className="lp-hero">
        <div className="lp-hero__content">
          <div className="lp-pill reveal">
            <Sparkles size={13} style={{ color: '#a78bfa' }} />
            <span>Introducing Vignette AI — now in beta</span>
          </div>

          <h1 className="lp-hero__h1 reveal">
            Design at the
            <span className="lp-gradient-text"> speed of thought.</span>
          </h1>

          <p className="lp-hero__sub reveal">
            The infinite canvas workspace that teams love. Draw, diagram, collaborate,
            and let AI transform your ideas into polished outputs — all in one place.
          </p>

          <div className="lp-hero__ctas reveal">
            <Link href="/register" className="lp-btn lp-btn--primary lp-btn--lg">
              Start for free <ArrowRight size={17} />
            </Link>
            <button className="lp-btn lp-btn--video">
              <span className="lp-play-icon"><Play size={14} fill="currentColor" /></span>
              Watch demo
            </button>
          </div>

          <p className="lp-hero__note reveal">No credit card required · Free forever plan</p>

          {/* Trust logos */}
          <div className="lp-trust reveal">
            <span className="lp-trust__label">Trusted by teams at</span>
            {['Stripe', 'Vercel', 'Linear', 'GitHub', 'Shopify', 'Figma'].map(co => (
              <span key={co} className="lp-trust__logo">{co}</span>
            ))}
          </div>
        </div>

        {/* Hero mockup */}
        <div className="lp-hero__mockup reveal">
          <div className="lp-mockup">
            <div className="lp-mockup__bar">
              <span /><span /><span />
            </div>
            <div className="lp-mockup__body">
              {/* fake canvas */}
              <div className="lp-fake-canvas">
                <div className="lp-fc-node lp-fc-node--1">Brainstorm</div>
                <div className="lp-fc-node lp-fc-node--2">Research</div>
                <div className="lp-fc-node lp-fc-node--3">Design</div>
                <div className="lp-fc-node lp-fc-node--4">Ship 🚀</div>
                <svg className="lp-fc-lines" viewBox="0 0 400 200" fill="none">
                  <path d="M80 50 L160 100" stroke="url(#lg1)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M160 100 L240 60" stroke="url(#lg1)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M240 60 L320 110" stroke="url(#lg1)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <defs>
                    <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* sticky notes */}
                <div className="lp-sticky lp-sticky--1">🎨 New color system</div>
                <div className="lp-sticky lp-sticky--2">Fix nav bug</div>
                <div className="lp-sticky lp-sticky--3">AI feature?</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="lp-section">
        <div className="lp-section__inner">
          <div className="lp-section__badge reveal">Features</div>
          <h2 className="lp-section__h2 reveal">Everything you need to think clearly</h2>
          <p className="lp-section__sub reveal">
            A thoughtfully crafted toolset that gets out of your way and lets you focus on the work that matters.
          </p>

          <div className="lp-bento reveal">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`lp-bento__card ${f.span === 'large' ? 'lp-bento__card--large' : ''}`}
                style={{ '--card-color': f.color } as React.CSSProperties}
              >
                <div className="lp-bento__icon" style={{ background: `${f.color}18`, color: f.color }}>
                  <f.icon size={22} />
                </div>
                <h3 className="lp-bento__title">{f.title}</h3>
                <p className="lp-bento__desc">{f.desc}</p>
                <div className="lp-bento__glow" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="lp-section lp-hiw">
        <div className="lp-section__inner">
          <div className="lp-section__badge reveal">How it works</div>
          <h2 className="lp-section__h2 reveal">From idea to shipped in 3 steps</h2>
          <div className="lp-steps">
            {[
              { n: '01', title: 'Create a canvas', desc: 'Start from a blank infinite canvas or choose from 50+ templates. Your workspace appears instantly.' },
              { n: '02', title: 'Think freely', desc: 'Draw, write, add shapes, connect ideas. The canvas expands infinitely — never run out of space.' },
              { n: '03', title: 'Ship with AI', desc: 'Let Vignette AI clean up your canvas, generate reports, or export directly to code and documentation.' },
            ].map((step, i) => (
              <div key={step.n} className="lp-step reveal" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="lp-step__num">{step.n}</div>
                <h3 className="lp-step__title">{step.title}</h3>
                <p className="lp-step__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section id="testimonials" className="lp-section">
        <div className="lp-section__inner">
          <div className="lp-section__badge reveal">Testimonials</div>
          <h2 className="lp-section__h2 reveal">Loved by 10,000+ teams worldwide</h2>
        </div>
        <div className="lp-marquee-wrap">
          <div className="lp-marquee lp-marquee--left">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="lp-tcard">
                <p className="lp-tcard__quote">"{t.quote}"</p>
                <div className="lp-tcard__author">
                  <div className="lp-tcard__avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="lp-tcard__name">{t.name}</div>
                    <div className="lp-tcard__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-marquee lp-marquee--right">
            {[...TESTIMONIALS, ...TESTIMONIALS].reverse().map((t, i) => (
              <div key={i} className="lp-tcard">
                <p className="lp-tcard__quote">"{t.quote}"</p>
                <div className="lp-tcard__author">
                  <div className="lp-tcard__avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="lp-tcard__name">{t.name}</div>
                    <div className="lp-tcard__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section id="pricing" className="lp-section">
        <div className="lp-section__inner">
          <div className="lp-section__badge reveal">Pricing</div>
          <h2 className="lp-section__h2 reveal">Simple, transparent pricing</h2>
          <p className="lp-section__sub reveal">Start free. Scale when you're ready. No surprise bills.</p>

          <div className="lp-toggle-wrap reveal">
            <span className={!annual ? 'active' : ''}>Monthly</span>
            <button
              className={`lp-toggle ${annual ? 'on' : ''}`}
              onClick={() => setAnnual(v => !v)}
              aria-label="Toggle annual billing"
            />
            <span className={annual ? 'active' : ''}>Annual <em>Save 20%</em></span>
          </div>

          <div className="lp-pricing-grid reveal">
            {PRICING.map(plan => (
              <div key={plan.name} className={`lp-pricing-card ${plan.highlight ? 'lp-pricing-card--highlight' : ''}`}>
                {plan.highlight && <div className="lp-pricing-badge">Most Popular</div>}
                <h3 className="lp-pricing__name">{plan.name}</h3>
                <div className="lp-pricing__price">
                  <span className="lp-pricing__currency">$</span>
                  <span className="lp-pricing__amount">
                    {annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="lp-pricing__period">/mo</span>
                </div>
                <p className="lp-pricing__desc">{plan.desc}</p>
                <ul className="lp-pricing__features">
                  {plan.features.map(f => (
                    <li key={f}><Check size={15} style={{ color: '#10b981', flexShrink: 0 }} /><span>{f}</span></li>
                  ))}
                </ul>
                <Link
                  href={plan.name === 'Enterprise' ? '#contact' : '/register'}
                  className={`lp-btn ${plan.highlight ? 'lp-btn--primary' : 'lp-btn--outline'} lp-btn--full`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section id="faq" className="lp-section">
        <div className="lp-section__inner lp-section__inner--narrow">
          <div className="lp-section__badge reveal">FAQ</div>
          <h2 className="lp-section__h2 reveal">Everything you need to know</h2>
          <div className="lp-faq reveal">
            {FAQS.map((faq, i) => (
              <div key={i} className={`lp-faq__item ${openFaq === i ? 'open' : ''}`}>
                <button className="lp-faq__q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <ChevronDown size={18} className="lp-faq__chevron" />
                </button>
                <div className="lp-faq__a">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section className="lp-cta-banner">
        <div className="lp-cta-banner__inner reveal">
          <h2 className="lp-cta-banner__h2">Ready to think without limits?</h2>
          <p className="lp-cta-banner__sub">Join 10,000+ teams already using VignetteLab to build what's next.</p>
          <Link href="/register" className="lp-btn lp-btn--white lp-btn--lg">
            Start for free — it's forever free <ArrowRight size={17} />
          </Link>
        </div>
        <div className="lp-cta-banner__orb lp-cta-banner__orb--1" />
        <div className="lp-cta-banner__orb lp-cta-banner__orb--2" />
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <div className="lp-footer__logo">
              <Image src={vignetteLogo} alt="VignetteLab" width={28} height={28} style={{ borderRadius: 7 }} />
              <span>VignetteLab</span>
            </div>
            <p className="lp-footer__tagline">The infinite canvas for ambitious teams.</p>
          </div>
          {[
            { heading: 'Product', links: ['Features', 'Pricing', 'Templates', 'Changelog', 'Roadmap'] },
            { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { heading: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
          ].map(col => (
            <div key={col.heading} className="lp-footer__col">
              <h4>{col.heading}</h4>
              {col.links.map(l => <a key={l} href="#">{l}</a>)}
            </div>
          ))}
        </div>
        <div className="lp-footer__bottom">
          <span>© 2026 VignetteLab. All rights reserved.</span>
          <span>Made with ❤️ for creators everywhere.</span>
        </div>
      </footer>
    </div>
  );
}
