'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const Image = ({ src, alt, width, height, className, fill, ...props }: any) => <img src={src} alt={alt} width={width} height={height} className={className} style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}} {...props} />;
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, User, Check, Loader2, AlertCircle } from 'lucide-react';
import vignetteLogo from '@/assets/vignetteLogo.png';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, id: number } | null>(null);

  React.useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql';
      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Signup($email: String!, $password: String!, $name: String, $ipAddress: String) {
              signup(email: $email, password: $password, name: $name, ipAddress: $ipAddress) {
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
            password,
            name,
            ipAddress
          }
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        console.error('Signup error:', result.errors);
        setNotification({ message: result.errors[0].message || 'Error signing up', id: Date.now() });
        setTimeout(() => setNotification(null), 4000);
        setIsLoading(false);
        return;
      }

      if (result.data?.signup?.token) {
        localStorage.setItem('token', result.data.signup.token);
        localStorage.setItem('user', JSON.stringify(result.data.signup.user));
      }

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (error) {
      console.error('Error during signup:', error);
      setNotification({ message: 'Failed to connect to the server', id: Date.now() });
      setTimeout(() => setNotification(null), 4000);
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    window.location.href = `${apiUrl}/auth/${provider.toLowerCase()}`;
  };

  const getStrength = () => {
    if (password.length === 0) return { score: 0, text: '', color: 'transparent', width: '0%' };
    if (password.length < 6) return { score: 1, text: 'Weak', color: '#ef4444', width: '33%' };
    if (password.length < 10) return { score: 2, text: 'Fair', color: '#f59e0b', width: '66%' };
    return { score: 3, text: 'Strong', color: '#10b981', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      // Canva-inspired vibrant background gradient
      background: 'linear-gradient(135deg, #00C4CC 0%, #7D2AE8 50%, #E81CFF 100%)', 
      fontFamily: "'Outfit', var(--font-inter), -apple-system, sans-serif",
      padding: '24px'
    }}>
      
      {/* Centered Modal Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ 
          margin: 'auto', 
          width: '100%', 
          maxWidth: '440px', 
          background: '#ffffff', 
          borderRadius: '16px', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          padding: '40px 32px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Link to="/" style={{ display: 'inline-block' }}>
              <Image src={vignetteLogo} alt="Logo" width={48} height={48} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </Link>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Log in or sign up in seconds
          </h1>
          <p style={{ color: '#4b5563', fontSize: '15px' }}>
            Use your email or another service to continue with VignetteLab (it's free!)
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <motion.button 
            type="button"
            onClick={() => handleSocialLogin('Google')}
            whileHover={{ backgroundColor: '#f9fafb' }}
            whileTap={{ scale: 0.98 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </motion.button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: '#9ca3af', fontSize: '14px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ padding: '0 16px', fontWeight: 500 }}>or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ position: 'relative' }}>
            <User size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required
              style={{ width: '100%', padding: '12px 16px 12px 44px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', color: '#111827', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#7D2AE8'; e.currentTarget.style.boxShadow = '0 0 0 1px #7D2AE8'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }} />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '12px 16px 12px 44px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', color: '#111827', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#7D2AE8'; e.currentTarget.style.boxShadow = '0 0 0 1px #7D2AE8'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }} />
          </div>

          <div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                style={{ width: '100%', padding: '12px 44px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', color: '#111827', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#7D2AE8'; e.currentTarget.style.boxShadow = '0 0 0 1px #7D2AE8'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', padding: '4px', borderRadius: '6px' }} onMouseOver={e => e.currentTarget.style.background='#f3f4f6'} onMouseOut={e => e.currentTarget.style.background='none'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <AnimatePresence>
              {password.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', padding: '0 4px' }}>
                    <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#e5e7eb', overflow: 'hidden', position: 'relative' }}>
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: strength.width, backgroundColor: strength.color }} transition={{ duration: 0.3 }}
                        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, borderRadius: '2px' }} 
                      />
                    </div>
                    <span style={{ fontSize: '12px', color: strength.color, width: '45px', textAlign: 'right', fontWeight: 600 }}>{strength.text}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button 
            type="submit" 
            disabled={isLoading || isSuccess || !email || !password}
            whileHover={(isLoading || isSuccess || !email || !password) ? {} : { backgroundColor: '#691cc2' }}
            whileTap={(isLoading || isSuccess || !email || !password) ? {} : { scale: 0.98 }}
            style={{
              width: '100%', padding: '12px', background: isSuccess ? '#10b981' : '#7D2AE8',
              border: 'none', borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: 600,
              cursor: (isLoading || isSuccess || !email || !password) ? 'not-allowed' : 'pointer',
              opacity: (isLoading || isSuccess || !email || !password) ? 0.7 : 1,
              transition: 'all 0.2s', marginTop: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Loader2 size={20} /></motion.div>
            ) : isSuccess ? (
              <><Check size={20} /> Account Created</>
            ) : (
              <>Sign up</>
            )}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#4b5563', fontSize: '14px', lineHeight: 1.5 }}>
          By continuing, you agree to VignetteLab's <a href="#" style={{ color: '#7D2AE8', textDecoration: 'none', fontWeight: 500 }}>Terms of Use</a>. Read our <a href="#" style={{ color: '#7D2AE8', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>.
        </p>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#4b5563', fontSize: '14px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
          Already signed up? <Link to="/login" style={{ color: '#7D2AE8', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
        </p>

      </motion.div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: '#ffffff',
              border: '1px solid #ef4444',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.2)',
              padding: '16px 24px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 100,
            }}
          >
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ef444420', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={14} strokeWidth={3} />
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#111827' }}>
              {notification.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
