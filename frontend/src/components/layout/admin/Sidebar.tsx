import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Tags,
  Users,
  Settings,
  Newspaper,
  Bot,
} from 'lucide-react';

const menuItems = [
  {
    title: '仪表盘',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '文章管理',
    href: '/admin/articles',
    icon: FileText,
  },
  {
    title: '新闻管理',
    href: '/admin/news',
    icon: Newspaper,
  },
  {
    title: 'AI 产品',
    href: '/admin/products',
    icon: Bot,
  },
  {
    title: '标签管理',
    href: '/admin/tags',
    icon: Tags,
  },
  {
    title: '用户管理',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: '系统设置',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="py-4 space-y-4">
      {/* Logo */}
      <div className="px-6 py-2">
        <Link href="/admin" className="flex items-center">
          <span className="text-2xl font-bold">AI News</span>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="space-y-1 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 