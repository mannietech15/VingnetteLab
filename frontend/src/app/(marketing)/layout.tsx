'use client';

import { useEffect } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';

function MarketingThemeSync() {
  const theme = useCanvasStore((state) => state.theme);

  useEffect(() => {
    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [theme]);

  return null;
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <MarketingThemeSync />
      {children}
    </div>
  );
}
