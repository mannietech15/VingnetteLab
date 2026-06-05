'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, User, Sparkles, ArrowRight, Check, Loader2 } from 'lucide-react';
import vignetteLogo from '@/app/workspaces/vignetteLogo.png';
import Particles from '@/components/Particles';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/ip')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    }, 2000);
  };

  const getStrength = () => {
    if (password.length === 0) return { score: 0, text: '', color: 'transparent', width: '0%' };
    if (password.length < 6) return { score: 1, text: 'Weak', color: '#ef4444', width: '33%' };
    if (password.length < 10) return { score: 2, text: 'Fair', color: '#f59e0b', width: '66%' };
    return { score: 3, text: 'Strong', color: '#10b981', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b', color: '#fafafa', fontFamily: "'Outfit', var(--font-inter), sans-serif" }}>
      
      {/* Background Effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Particles
          particleColors={['#3b82f6', '#10b981', '#059669']}
          particleCount={800}
          particleSpread={15}
          speed={0.2}
          particleBaseSize={120}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(9,9,11,0.2) 0%, rgba(9,9,11,1) 60%)' }} />
      </div>

      {/* Left Panel (55%) */}
      <div style={{ flex: '0 0 55%', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', padding: '60px', overflow: 'hidden' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'auto' }}>
          <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Image src={vignetteLogo} alt="Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>VignetteLab</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ position: 'relative', zIndex: 10, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '8px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, color: '#34d399', marginBottom: '32px', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}
          >
            <Sparkles size={16} /> Join 10,000+ creators
          </motion.div>
          
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '32px' }}>
            Design without <br/>
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>boundaries.</span>
          </h1>
          
          <div style={{ position: 'relative', padding: '40px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '40px', fontSize: '60px', color: 'rgba(16,185,129,0.2)', fontFamily: 'serif', lineHeight: 1 }}>"</div>
            <p style={{ fontSize: '1.25rem', color: '#d4d4d8', fontStyle: 'italic', marginBottom: '32px', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>
              The infinite canvas experience combined with AI spatial organization is unlike anything else we've tried. VignetteLab completely replaced our previous whiteboard and diagramming tools.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>MW</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>Marcus Webb</div>
                <div style={{ fontSize: '14px', color: '#a1a1aa' }}>CTO, Linear</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel (45%) */}
      <div style={{ flex: '0 0 45%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }} 
          style={{ width: '100%', maxWidth: '440px', background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(20px)', padding: '48px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)' }}
        >
          
          <div style={{ marginBottom: '40px', textAlign: 'center', position: 'relative' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>Create your account</h2>
            <p style={{ color: '#a1a1aa', fontSize: '16px', marginBottom: '24px' }}>Start your 14-day free trial today</p>
            
            <AnimatePresence>
              {ipAddress && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 16px', borderRadius: '100px', margin: '0 auto' }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                    SECURE SESSION • ORIGIN IP: {ipAddress}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ position: 'relative', group: 'input' }} className="group">
              <User size={18} color="#71717a" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, transition: 'color 0.2s' }} />
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required
                style={{ width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', color: '#fafafa', fontSize: '15px', outline: 'none', transition: 'all 0.3s' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.1)'; e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#71717a" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
              <input type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', color: '#fafafa', fontSize: '15px', outline: 'none', transition: 'all 0.3s' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.1)'; e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; }} />
            </div>

            <div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#71717a" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ width: '100%', padding: '16px 48px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', color: '#fafafa', fontSize: '15px', outline: 'none', transition: 'all 0.3s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.1)'; e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', display: 'flex', padding: '4px', borderRadius: '6px' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background='none'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', padding: '0 4px' }}>
                      <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative' }}>
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: strength.width, backgroundColor: strength.color }} transition={{ duration: 0.3 }}
                          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, borderRadius: '3px' }} 
                        />
                      </div>
                      <span style={{ fontSize: '13px', color: strength.color, width: '45px', textAlign: 'right', fontWeight: 600 }}>{strength.text}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#a1a1aa', marginTop: '4px' }}>
              <input type="checkbox" required style={{ accentColor: '#10b981', width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px', borderRadius: '4px' }} />
              <span style={{ lineHeight: 1.5 }}>I agree to the <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Terms of Service</a> and <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Privacy Policy</a></span>
            </div>

            <motion.button 
              type="submit" 
              disabled={isLoading || isSuccess || !email || !password || password !== confirmPassword}
              whileHover={(isLoading || isSuccess || !email || !password) ? {} : { scale: 1.02 }}
              whileTap={(isLoading || isSuccess || !email || !password) ? {} : { scale: 0.98 }}
              style={{
                width: '100%', padding: '16px', background: isSuccess ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #10b981)',
                border: 'none', borderRadius: '16px', color: '#fff', fontSize: '16px', fontWeight: 700,
                cursor: (isLoading || isSuccess || !email || !password) ? 'not-allowed' : 'pointer',
                opacity: (isLoading || isSuccess || !email || !password) ? 0.7 : 1,
                boxShadow: isSuccess ? '0 8px 30px rgba(16, 185, 129, 0.4)' : '0 8px 30px rgba(16, 185, 129, 0.4)', transition: 'all 0.3s', marginTop: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Loader2 size={20} /></motion.div>
              ) : isSuccess ? (
                <><Check size={20} /> Account Created</>
              ) : (
                <>Create account <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0', color: '#71717a', fontSize: '14px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <span style={{ padding: '0 16px', fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <motion.button whileHover={{ y: -2 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fafafa', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </motion.button>
            <motion.button whileHover={{ y: -2 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fafafa', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#fafafa"/>
              </svg>
              GitHub
            </motion.button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '40px', color: '#a1a1aa', fontSize: '15px' }}>
            Already have an account? <Link href="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Log in</Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}
