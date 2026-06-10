'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import vignetteLogo from '@/app/workspaces/vignetteLogo.png';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                token
                user {
                  id
                  email
                  name
                }
              }
            }
          `,
          variables: {
            email,
            password
          }
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        console.error('Login error:', result.errors);
        alert(result.errors[0].message || 'Error logging in');
        setIsLoading(false);
        return;
      }

      if (result.data?.login?.token) {
        localStorage.setItem('token', result.data.login.token);
        localStorage.setItem('user', JSON.stringify(result.data.login.user));
      }

      setIsLoading(false);
      window.location.href = '/home';
    } catch (error) {
      console.error('Error during login:', error);
      alert('Failed to connect to the server');
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/home';
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b', color: '#fafafa', fontFamily: 'var(--font-inter), sans-serif' }}>
      
      {/* Left Panel (60%) */}
      <div style={{ flex: '0 0 60%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '60px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(59,130,246,0.1) 0%, transparent 50%)', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'auto' }}>
          <Image src={vignetteLogo} alt="Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
          <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>VignetteLab</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ position: 'relative', zIndex: 10, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '24px' }}>
            <Sparkles size={14} color="#10b981" /> The infinite canvas for teams
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '32px' }}>
            Pick up exactly where you left off.
          </h1>
          
          <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', backdropFilter: 'blur(10px)' }}>
            <p style={{ fontSize: '1.125rem', color: '#a1a1aa', fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.6 }}>
              "VignetteLab replaced 4 tools for our design team. The infinite canvas experience is unlike anything else we've tried."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>SC</div>
              <div>
                <div style={{ fontWeight: 600 }}>Sarah Chen</div>
                <div style={{ fontSize: '14px', color: '#71717a' }}>Head of Design, Stripe</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel (40%) */}
      <div style={{ flex: '0 0 40%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '40px 40px 40px 20px', position: 'relative', zIndex: 10, background: '#09090b' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: '400px' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>Welcome back</h2>
            <p style={{ color: '#a1a1aa' }}>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#71717a" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '14px 16px 14px 44px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fafafa', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.2)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#71717a" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '14px 44px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fafafa', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.2)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#a1a1aa' }}>
                <input type="checkbox" style={{ accentColor: '#10b981', width: '16px', height: '16px', cursor: 'pointer' }} />
                Remember me
              </label>
              <a href="#" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              style={{
                width: '100%', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600,
                cursor: (isLoading || !email || !password) ? 'not-allowed' : 'pointer', opacity: (isLoading || !email || !password) ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s', marginTop: '8px'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in to your account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0', color: '#71717a', fontSize: '14px' }}>
            <div style={{ flex: 1, height: '1px', background: '#27272a' }} />
            <span style={{ padding: '0 16px' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: '#27272a' }} />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button type="button" onClick={() => handleSocialLogin('Google')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fafafa', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#27272a'} onMouseOut={e => e.currentTarget.style.background = '#18181b'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" onClick={() => handleSocialLogin('GitHub')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fafafa', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#27272a'} onMouseOut={e => e.currentTarget.style.background = '#18181b'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#fafafa"/>
              </svg>
              GitHub
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '32px', color: '#a1a1aa', fontSize: '14px' }}>
            Don't have an account? <Link href="/register" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}
