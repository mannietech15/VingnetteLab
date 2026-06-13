'use client';

import { Suspense, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function OAuthCallbackContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', userStr);
        navigate('/home');
      } catch (e) {
        console.error('Error saving auth state', e);
        navigate('/login?error=true');
      }
    } else {
      navigate('/login?error=missing_credentials');
    }
  }, [navigate, searchParams]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b', color: '#fafafa', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Completing login...</h2>
        <p style={{ color: '#a1a1aa' }}>Please wait while we redirect you to your workspace.</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b', color: '#fafafa', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter), sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Completing login...</h2>
          <p style={{ color: '#a1a1aa' }}>Please wait while we redirect you to your workspace.</p>
        </div>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}
