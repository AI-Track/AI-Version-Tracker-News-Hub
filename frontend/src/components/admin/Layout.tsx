'use client';

import { ReactNode } from 'react';
import { AdminSidebar } from './Sidebar';
import { AdminHeader } from './Header';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* 侧边栏 */}
      <aside className="w-64 border-r bg-background">
        <AdminSidebar />
      </aside>

      {/* 主内容区 */}
      <div className="flex-1">
        <AdminHeader />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 