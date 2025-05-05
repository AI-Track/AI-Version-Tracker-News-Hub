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
import { Edit2, Trash2, Eye, Send } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ArticleListProps {
  articles: Article[];
  sort: ArticleSort;
  onSortChange: (sort: ArticleSort) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
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
  onPublish,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
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

  // 计算当前页的文章
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = articles.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
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
              <TableHead>最近更新</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedArticles.map((article) => (
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
                <TableCell>
                  {article.lastModified ? formatDate(article.lastModified) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/articles/${article.id}`, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {article.status !== 'published' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPublish(article.id)}
                        title="发布文章"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
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

      {/* 分页控制 */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
} 