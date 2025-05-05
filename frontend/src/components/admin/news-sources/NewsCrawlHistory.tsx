import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface CrawlHistoryItem {
  id: string;
  sourceId: string;
  sourceName: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  endTime?: string;
  articlesFound: number;
  articlesAdded: number;
  error?: string;
}

interface NewsCrawlHistoryProps {
  history: CrawlHistoryItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sourceId?: string; // 可选的过滤特定新闻源
}

const statusColors = {
  success: 'bg-green-500',
  failed: 'bg-red-500',
  running: 'bg-blue-500',
};

const statusLabels = {
  success: '成功',
  failed: '失败',
  running: '进行中',
};

export function NewsCrawlHistory({
  history,
  currentPage,
  totalPages,
  onPageChange,
  sourceId,
}: NewsCrawlHistoryProps) {
  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 计算持续时间
  const getDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return '进行中...';
    
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMs = end - start;
    
    if (durationMs < 1000) return `${durationMs}毫秒`;
    
    const seconds = Math.floor(durationMs / 1000);
    if (seconds < 60) return `${seconds}秒`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}分${remainingSeconds}秒`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>抓取历史记录</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {!sourceId && <TableHead>来源</TableHead>}
              <TableHead>状态</TableHead>
              <TableHead>开始时间</TableHead>
              <TableHead>结束时间</TableHead>
              <TableHead>持续时间</TableHead>
              <TableHead>发现文章</TableHead>
              <TableHead>新增文章</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={sourceId ? 6 : 7}
                  className="text-center py-8"
                >
                  暂无抓取记录
                </TableCell>
              </TableRow>
            ) : (
              history.map((item) => (
                <TableRow key={item.id}>
                  {!sourceId && (
                    <TableCell className="font-medium">
                      {item.sourceName}
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${statusColors[item.status]} text-white`}
                    >
                      {statusLabels[item.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatTime(item.startTime)}</TableCell>
                  <TableCell>
                    {item.endTime ? formatTime(item.endTime) : '-'}
                  </TableCell>
                  <TableCell>
                    {getDuration(item.startTime, item.endTime)}
                  </TableCell>
                  <TableCell>{item.articlesFound}</TableCell>
                  <TableCell>{item.articlesAdded}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                    className={currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <button
                      className={`h-9 w-9 rounded-md flex items-center justify-center ${
                        currentPage === i + 1
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground'
                      }`}
                      onClick={() => onPageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                    className={currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        {history.some(item => item.status === 'failed') && (
          <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
            <h4 className="font-bold mb-2">抓取错误</h4>
            <ul className="list-disc pl-5 space-y-1">
              {history
                .filter(item => item.status === 'failed' && item.error)
                .map(item => (
                  <li key={`error-${item.id}`}>
                    <span className="font-medium">{item.sourceName}: </span>
                    {item.error}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 