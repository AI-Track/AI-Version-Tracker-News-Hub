import { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const menuItems = [
  {
    title: '仪表盘 / Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: '概览统计和关键指标'
  },
  {
    title: '新闻源管理 / Sources',
    href: '/admin/news-sources',
    icon: Newspaper,
    description: '管理爬虫和RSS订阅源'
  },
  {
    title: 'AI更新追踪 / Updates',
    href: '/admin/ai-updates',
    icon: Bot,
    description: '追踪AI模型和项目版本更新'
  },
  {
    title: '内容管理 / Content',
    href: '/admin/content',
    icon: FileText,
    description: '管理已抓取的文章和更新'
  },
  {
    title: '标签管理 / Tags',
    href: '/admin/tags',
    icon: Tags,
    description: '管理AI相关标签和分类'
  },
  {
    title: '系统设置 / Settings',
    href: '/admin/settings',
    icon: Settings,
    description: '系统配置和爬虫设置'
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'relative flex flex-col h-screen bg-background border-r transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!isCollapsed && (

        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold">AI News</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>返回网站首页</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          


        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        <TooltipProvider delayDuration={0}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      isCollapsed && 'justify-center px-2'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span>{item.title.split(' / ')[0]}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed ? (
                  <TooltipContent side="right" className="max-w-[200px]">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </TooltipContent>
                ) : null}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </div>
  );
} 