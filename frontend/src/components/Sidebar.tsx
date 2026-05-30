'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, LayoutGrid, Clock, Star, LayoutTemplate, Settings, Search, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCanvasStore } from '@/store/useCanvasStore';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Workspaces', icon: LayoutGrid, href: '/workspaces' },
  { label: 'Recent', icon: Clock, href: '/recent' },
  { label: 'Favorites', icon: Star, href: '/favorites' },
  { label: 'Templates', icon: LayoutTemplate, href: '/templates' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useCanvasStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const toggleTheme = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  const isCurrentlyDark = mounted && (theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches));

  return (
    <aside className="sidebar-container">
      {/* Logo */}
      <div className="sidebar-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px', marginBottom: '32px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent-primary), #9c36b5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '20px'
        }}>
          V
        </div>
        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          VignetteLab
        </span>
      </div>

      {/* Search Bar (Mock) */}
      <div className="sidebar-desktop-only" style={{ marginBottom: '24px', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input 
          type="text" 
          placeholder="Search..." 
          style={{
            width: '100%',
            padding: '8px 12px 8px 36px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div 
                className="sidebar-nav-item"
                style={{
                  background: isActive ? 'var(--bg-hover)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
                onMouseOver={(e) => {
                  if (!isActive && window.innerWidth > 768) e.currentTarget.style.background = 'var(--bg-hover)';
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <item.icon size={18} style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
                <span className="sidebar-nav-label">{item.label}</span>
              </div>
            </Link>
          );
        })}

        {/* Mobile Theme Toggle (Visible only on mobile nav) */}
        <div 
          className="sidebar-nav-item sidebar-mobile-only"
          onClick={toggleTheme}
          style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          {mounted ? (isCurrentlyDark ? <Sun size={18} /> : <Moon size={18} />) : <div style={{width: 18, height: 18}} />}
          <span className="sidebar-nav-label">Theme</span>
        </div>

        <div className="sidebar-desktop-only" style={{ margin: '24px 0 8px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Your Workspaces
        </div>
        
        {/* Mock Workspaces List */}
        <div className="sidebar-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e03131' }} />
          <span style={{ flex: 1, fontSize: '14px' }}>Design Team</span>
        </div>
        <div className="sidebar-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2f9e44' }} />
          <span style={{ flex: 1, fontSize: '14px' }}>Engineering</span>
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className="sidebar-desktop-only" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '14px' }}>
            M
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Mannie Tech</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pro Plan</div>
          </div>
          <button onClick={toggleTheme} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            title="Toggle Theme"
          >
            {mounted ? (isCurrentlyDark ? <Sun size={14} /> : <Moon size={14} />) : <div style={{width: 14, height: 14}} />}
          </button>
          <div title="Settings" style={{ display: 'flex', alignItems: 'center' }}>
            <Settings size={16} color="var(--text-secondary)" style={{ cursor: 'pointer', marginLeft: '4px' }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
