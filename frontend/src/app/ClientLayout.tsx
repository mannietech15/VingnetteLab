'use client';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const NO_SIDEBAR = ['/', '/login', '/register'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasSidebar = !NO_SIDEBAR.includes(pathname);
  if (!hasSidebar) return <>{children}</>;
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}
