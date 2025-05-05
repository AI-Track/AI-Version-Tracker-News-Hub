import { AdminLayout } from '@/components/layout/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { Newspaper, FileText, Settings, Users } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  const menuItems = [
    {
      title: '新闻管理',
      description: '管理新闻来源、抓取规则和发布状态',
      icon: <Newspaper className="w-6 h-6" />,
      href: '/admin/news',
      color: 'text-blue-500',
    },
    {
      title: '文章管理',
      description: '管理文章内容、分类和标签',
      icon: <FileText className="w-6 h-6" />,
      href: '/admin/articles',
      color: 'text-green-500',
    },
    {
      title: '用户管理',
      description: '管理用户账号和权限设置',
      icon: <Users className="w-6 h-6" />,
      href: '/admin/users',
      color: 'text-purple-500',
    },
    {
      title: '系统设置',
      description: '配置系统参数和基本设置',
      icon: <Settings className="w-6 h-6" />,
      href: '/admin/settings',
      color: 'text-orange-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">管理后台</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {menuItems.map((item) => (
            <Card
              key={item.href}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(item.href)}
            >
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className={item.color}>{item.icon}</span>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 数据概览 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">数据概览</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">2,345</CardTitle>
                <p className="text-sm text-muted-foreground">今日新闻数</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">156</CardTitle>
                <p className="text-sm text-muted-foreground">待审核文章</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">89%</CardTitle>
                <p className="text-sm text-muted-foreground">抓取成功率</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">12,456</CardTitle>
                <p className="text-sm text-muted-foreground">总访问量</p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 