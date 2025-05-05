import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, RefreshCw, Trash2, MoreHorizontal } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 新闻来源类型
export interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: string;
  status: 'active' | 'paused' | 'error';
  lastCrawled: string;
  totalArticles: number;
  crawlFrequency: string;
  crawlRules?: {
    titleSelector?: string;
    contentSelector?: string;
    dateSelector?: string;
    authorSelector?: string;
    listSelector?: string;
    maxDepth: number;
    followLinks: boolean;
    useAI: boolean;
    excludePatterns?: string;
  };
}

interface NewsSourceListProps {
  sources: NewsSource[];
  onEditSource: (sourceId: string) => void;
  onDeleteSource: (sourceId: string) => void;
  onToggleStatus: (sourceId: string) => void;
  onCrawlNow: (sourceId: string) => void;
}

const statusColors = {
  active: 'bg-green-500',
  paused: 'bg-yellow-500',
  error: 'bg-red-500'
};

const statusLabels = {
  active: '运行中',
  paused: '已暂停',
  error: '错误'
};

export function NewsSourceList({
  sources,
  onEditSource,
  onDeleteSource,
  onToggleStatus,
  onCrawlNow
}: NewsSourceListProps) {
  const [sortColumn, setSortColumn] = useState<keyof NewsSource>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof NewsSource) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedSources = [...sources].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[200px] cursor-pointer" 
              onClick={() => handleSort('name')}
            >
              名称 {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('category')}
            >
              分类 {sortColumn === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('status')}
            >
              状态 {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>抓取频率</TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('lastCrawled')}
            >
              最近抓取 {sortColumn === 'lastCrawled' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('totalArticles')}
            >
              文章数 {sortColumn === 'totalArticles' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSources.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            sortedSources.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{source.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {source.url}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{source.category}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${statusColors[source.status]} text-white cursor-pointer`}
                    onClick={() => onToggleStatus(source.id)}
                  >
                    {statusLabels[source.status]}
                  </Badge>
                </TableCell>
                <TableCell>{source.crawlFrequency}</TableCell>
                <TableCell>{formatDate(source.lastCrawled)}</TableCell>
                <TableCell>{source.totalArticles}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCrawlNow(source.id)}
                      title="立即抓取"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditSource(source.id)}
                      title="编辑"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => onDeleteSource(source.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 