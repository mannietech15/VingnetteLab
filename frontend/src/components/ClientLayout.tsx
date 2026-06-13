'use client';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

import ClickSpark from '@/components/ClickSpark';

const NO_SIDEBAR_ROUTES = ['/', '/login', '/register'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const showSidebar = !NO_SIDEBAR_ROUTES.includes(pathname);

  const content = showSidebar ? (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  ) : (
    <>{children}</>
  );

  return (
    <ClickSpark sparkColor="#7c3aed" sparkSize={12} sparkRadius={20} sparkCount={8} duration={400}>
      {content}
    </ClickSpark>
  );
}
