import { ReactNode } from 'react';
import { AdminSidebar } from './Sidebar';
import { AdminHeader } from './Header';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 侧边栏 */}
      <aside className="w-64 bg-gray-900 text-white">
        <AdminSidebar />
      </aside>

      {/* 主内容区 */}
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 