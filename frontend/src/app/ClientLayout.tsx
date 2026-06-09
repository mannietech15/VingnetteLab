'use client';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const NO_SIDEBAR_ROUTES = ['/', '/login', '/register'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCanvasPage = pathname?.startsWith('/canvas');
  const showSidebar = !NO_SIDEBAR_ROUTES.includes(pathname) && !isCanvasPage;

  if (!showSidebar) return <>{children}</>;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}
