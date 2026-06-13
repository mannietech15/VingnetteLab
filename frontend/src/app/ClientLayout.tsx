'use client';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

import ClickSpark from '@/components/ClickSpark';

const NO_SIDEBAR_ROUTES = ['/', '/login', '/register'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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
