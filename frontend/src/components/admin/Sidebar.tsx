import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  FileText, 
  Newspaper, 
  Settings,
  Users,
  Tag
} from 'lucide-react';

const menuItems = [
  {
    title: '仪表盘',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    title: '文章管理',
    icon: FileText,
    href: '/admin/articles',
  },
  {
    title: '新闻管理',
    icon: Newspaper,
    href: '/admin/news',
  },
  {
    title: '用户管理',
    icon: Users,
    href: '/admin/users',
  },
  {
    title: '标签管理',
    icon: Tag,
    href: '/admin/tags',
  },
  {
    title: '系统设置',
    icon: Settings,
    href: '/admin/settings',
  },
];

export function AdminSidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="h-full py-6">
      <div className="px-4 mb-8">
        <h1 className="text-xl font-bold text-white">AI News 管理系统</h1>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = currentPath.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm
                ${isActive 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 