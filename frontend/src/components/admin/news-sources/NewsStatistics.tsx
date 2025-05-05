import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewsSource } from './NewsSourceList';
import { 
  FileText, 
  Rss, 
  Activity, 
  Calendar 
} from 'lucide-react';

interface NewsStatisticsProps {
  sources: NewsSource[];
  todayCrawlCount?: number;
}

export function NewsStatistics({ sources, todayCrawlCount = 0 }: NewsStatisticsProps) {
  // 计算总来源数
  const totalSources = sources.length;
  
  // 计算活跃来源数
  const activeSources = sources.filter(source => source.status === 'active').length;
  
  // 计算文章总数
  const totalArticles = sources.reduce((sum, source) => sum + source.totalArticles, 0);
  
  const stats = [
    {
      title: '总来源数',
      value: totalSources,
      icon: <Rss className="h-4 w-4 text-blue-500" />,
      description: '所有配置的新闻来源总数',
      color: 'bg-blue-50',
      textColor: 'text-blue-500'
    },
    {
      title: '活跃来源',
      value: activeSources,
      icon: <Activity className="h-4 w-4 text-green-500" />,
      description: '当前正在抓取的来源数',
      color: 'bg-green-50',
      textColor: 'text-green-500'
    },
    {
      title: '文章总数',
      value: totalArticles,
      icon: <FileText className="h-4 w-4 text-purple-500" />,
      description: '所有来源的文章总数',
      color: 'bg-purple-50',
      textColor: 'text-purple-500'
    },
    {
      title: '今日抓取',
      value: todayCrawlCount,
      icon: <Calendar className="h-4 w-4 text-orange-500" />,
      description: '今日执行的抓取任务数',
      color: 'bg-orange-50',
      textColor: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.color}`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 