'use client';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const NO_SIDEBAR_ROUTES = ['/', '/login', '/register'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !NO_SIDEBAR_ROUTES.includes(pathname);

  if (!showSidebar) return <>{children}</>;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}
