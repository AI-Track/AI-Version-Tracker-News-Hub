import { Article, ArticleSort } from '@/types/article';
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
import { Edit2, Trash2, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ArticleListProps {
  articles: Article[];
  sort: ArticleSort;
  onSortChange: (sort: ArticleSort) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  draft: 'bg-gray-500',
  pending: 'bg-yellow-500',
  published: 'bg-green-500',
  archived: 'bg-red-500',
};

const statusLabels = {
  draft: '草稿',
  pending: '待审核',
  published: '已发布',
  archived: '已归档',
};

export function ArticleList({
  articles,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: ArticleListProps) {
  // 处理排序
  const handleSort = (field: ArticleSort['field']) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ field, direction });
  };

  // 获取排序图标
  const getSortIcon = (field: ArticleSort['field']) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <button
                className="flex items-center space-x-1"
                onClick={() => handleSort('title')}
              >
                <span>标题</span>
                <span>{getSortIcon('title')}</span>
              </button>
            </TableHead>
            <TableHead>状态</TableHead>
            <TableHead>作者</TableHead>
            <TableHead>
              <button
                className="flex items-center space-x-1"
                onClick={() => handleSort('publishDate')}
              >
                <span>发布日期</span>
                <span>{getSortIcon('publishDate')}</span>
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center space-x-1"
                onClick={() => handleSort('viewCount')}
              >
                <span>浏览量</span>
                <span>{getSortIcon('viewCount')}</span>
              </button>
            </TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">{article.title}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`${statusColors[article.status]} text-white`}
                >
                  {statusLabels[article.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {article.author.avatar && (
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span>{article.author.name}</span>
                </div>
              </TableCell>
              <TableCell>
                {article.publishDate ? formatDate(article.publishDate) : '-'}
              </TableCell>
              <TableCell>{article.viewCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/articles/${article.id}`, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(article.id)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(article.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 