'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Image = ({ src, alt, width, height, className, fill, ...props }: any) => <img src={src} alt={alt} width={width} height={height} className={className} style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}} {...props} />;
import vignetteLogo from '@/assets/vignetteLogo.png';
import { Home, LayoutGrid, Clock, Star, LayoutTemplate, Settings, Search, Sun, Moon, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useCanvasStore } from '@/store/useCanvasStore';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_SIDEBAR_WORKSPACES = gql`
  query GetSidebarWorkspaces {
    workspaces {
      id
      name
    }
  }
`;

const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/home' },
  { label: 'Workspaces', icon: LayoutGrid, href: '/workspaces' },
  { label: 'Vignette AI', icon: Sparkles, href: '/vignette-ai' },
  { label: 'Recent', icon: Clock, href: '/recent' },
  { label: 'Favorites', icon: Star, href: '/favorites' },
  { label: 'Templates', icon: LayoutTemplate, href: '/templates' },
];

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme, setTheme } = useCanvasStore();
  const [mounted, setMounted] = useState(false);
  
  const { data } = useQuery(GET_SIDEBAR_WORKSPACES);
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : { name: 'User' };
  const workspaces = (data as any)?.workspaces || [];
  
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
        <Image src={vignetteLogo} alt="VignetteLab Logo" width={36} height={36} style={{ borderRadius: '10px', objectFit: 'cover' }} />
        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          VignetteLab
        </span>
      </div>

      {/* Search Bar (Mock) */}
      <div 
        className="sidebar-desktop-only" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)', 
          padding: '8px 12px', 
          borderRadius: '10px',
          cursor: 'pointer',
          border: '1px solid transparent',
          transition: 'all 0.2s',
          margin: '0 8px 24px 8px'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.border = '1px solid var(--border-color)';
          e.currentTarget.style.background = 'var(--bg-hover)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.border = '1px solid transparent';
          e.currentTarget.style.background = 'var(--bg-secondary)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={18} color="var(--text-secondary)" />
            <Sparkles size={10} color="var(--text-secondary)" style={{ position: 'absolute', top: -3, right: -3 }} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Search</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <kbd style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '2px 6px', fontFamily: 'inherit', fontSize: '12px' }}>Ctrl</kbd>
          <span style={{ fontSize: '12px' }}>+</span>
          <kbd style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '2px 6px', fontFamily: 'inherit', fontSize: '12px' }}>K</kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} to={item.href} style={{ textDecoration: 'none' }}>
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
                <item.icon size={18} style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }} fill={isActive ? 'currentColor' : 'none'} />
                <span className="sidebar-nav-label">{item.label}</span>
              </div>
            </Link>
          );
        })}


        <div className="sidebar-desktop-only" style={{ margin: '24px 0 8px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Your Workspaces
        </div>
        
        {workspaces.map((ws: any, index: number) => {
          const colors = ['#e03131', '#2f9e44', '#1971c2', '#f08c00', '#9c36b5'];
          const color = colors[index % colors.length];
          return (
            <div key={ws.id} className="sidebar-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
              <span style={{ flex: 1, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ws.name}</span>
            </div>
          );
        })}
        {workspaces.length === 0 && (
          <div className="sidebar-desktop-only" style={{ padding: '0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            No workspaces yet.
          </div>
        )}
      </nav>

      {/* User Profile Footer */}
      <div className="sidebar-desktop-only" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '14px' }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name || 'User'}</div>
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
