'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const MagneticWrapper = ({ children, className = '', disabled = false }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2);
    y.set(middleY * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ position: 'relative', x, y, display: 'inline-flex' }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SmartGetStartedButton = ({ 
  href = '/home', 
  text = 'Get Started', 
  size = 'md' 
}: { 
  href?: string, 
  text?: string,
  size?: 'sm' | 'md' | 'lg'
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state !== 'idle') return;
    
    setState('loading');
    
    // Simulate intelligent initialization / pre-fetching
    setTimeout(() => {
      setState('success');
      setTimeout(() => {
        router.push(href);
      }, 500);
    }, 800);
  };

  const padding = size === 'sm' ? '10px 20px' : size === 'lg' ? '18px 40px' : '14px 28px';
  const fontSize = size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px';

  return (
    <MagneticWrapper disabled={state !== 'idle'}>
      <motion.button
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        whileHover={state === 'idle' ? { scale: 1.02 } : {}}
        whileTap={state === 'idle' ? { scale: 0.98 } : {}}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
          padding,
          borderRadius: '100px',
          fontSize,
          fontWeight: 600,
          border: 'none',
          outline: 'none',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4), inset 0 1px 1px rgba(255,255,255,0.2)',
          cursor: state !== 'idle' ? 'default' : 'pointer',
          minWidth: size === 'lg' ? '240px' : '160px',
        }}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[100px] opacity-0 transition duration-300"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                120px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.4),
                transparent 80%
              )
            `,
          }}
          onHoverStart={(e) => {
            if (state === 'idle') (e.target as HTMLElement).style.opacity = '1';
          }}
          onHoverEnd={(e) => {
            (e.target as HTMLElement).style.opacity = '0';
          }}
        />
        
        <span style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {state === 'idle' && (
            <>
              {text} 
              <motion.span initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 200 }}>
                <ArrowRight size={size === 'sm' ? 16 : 18} />
              </motion.span>
            </>
          )}
          {state === 'loading' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={size === 'sm' ? 16 : 18} />
              </motion.div>
              Initializing...
            </motion.span>
          )}
          {state === 'success' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Check size={size === 'sm' ? 16 : 18} /> Ready
            </motion.span>
          )}
        </span>
      </motion.button>
    </MagneticWrapper>
  );
};

export const SmartLoginButton = ({ href = '/login' }: { href?: string }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MagneticWrapper>
      <motion.button
        onClick={() => router.push(href)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#a1a1aa',
          padding: '10px 20px',
          borderRadius: '100px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
            borderRadius: '100px'
          }}
        />
        <span style={{ position: 'relative', zIndex: 2 }}>Log In</span>
      </motion.button>
    </MagneticWrapper>
  );
};
