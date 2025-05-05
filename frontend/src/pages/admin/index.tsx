import { AdminLayout } from '@/components/layout/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// 模拟数据
const stats = [
  {
    title: '文章总数',
    value: '124',
    icon: FileText,
    trend: 'up',
    change: '+12.5%',
    timeframe: '较上月'
  },
  {
    title: '总访问量',
    value: '45.2K',
    icon: Eye,
    trend: 'up',
    change: '+8.2%',
    timeframe: '较上月'
  },
  {
    title: '活跃用户',
    value: '3.2K',
    icon: Users,
    trend: 'down',
    change: '-2.4%',
    timeframe: '较上月'
  },
  {
    title: '转化率',
    value: '2.4%',
    icon: TrendingUp,
    trend: 'up',
    change: '+4.1%',
    timeframe: '较上月'
  }
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">仪表盘</h1>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                {stat.trend === 'up' ? (
                  <div className="flex items-center text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm">{stat.change}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <ArrowDownRight className="w-4 h-4" />
                    <span className="text-sm">{stat.change}</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.timeframe}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* 最近活动 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">最近活动</h2>
          <div className="space-y-4">
            {/* 这里可以添加活动列表 */}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
} 