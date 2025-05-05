import { useState } from 'react';
import { AdminLayout } from '@/components/layout/admin/AdminLayout';
import { ArticleList } from '@/components/admin/articles/ArticleList';
import { ArticleFilters } from '@/components/admin/articles/ArticleFilters';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { useRouter } from 'next/router';
import type { Article, ArticleFilter, ArticleSort } from '@/types/article';

// 模拟数据
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'GPT-4 Turbo 发布：更强大的多模态能力',
    content: '...',
    excerpt: 'OpenAI 发布了最新版本的 GPT-4 Turbo，带来了更强大的多模态能力和更低的延迟...',
    status: 'published',
    tags: ['AI', 'GPT-4', 'OpenAI'],
    author: {
      id: '1',
      name: '张三',
      avatar: '/avatars/1.png'
    },
    category: 'AI 新闻',
    publishDate: '2024-04-15',
    lastModified: '2024-04-15',
    readTime: 5,
    viewCount: 1200,
    relatedProducts: ['GPT-4']
  },
  {
    id: '2',
    title: 'Claude 3 性能测评：与 GPT-4 的详细对比',
    content: '...',
    excerpt: '本文将深入对比 Claude 3 和 GPT-4 在各个方面的性能表现...',
    status: 'draft',
    tags: ['AI', 'Claude', 'Anthropic'],
    author: {
      id: '2',
      name: '李四',
      avatar: '/avatars/2.png'
    },
    category: 'AI 评测',
    lastModified: '2024-04-14',
    readTime: 8,
    viewCount: 0,
    relatedProducts: ['Claude 3', 'GPT-4']
  },
];

export default function ArticlesPage() {
  const router = useRouter();
  const [articles] = useState<Article[]>(mockArticles);
  const [filters, setFilters] = useState<ArticleFilter>({});
  const [sort, setSort] = useState<ArticleSort>({
    field: 'lastModified',
    direction: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 固定每页显示10条
  const totalItems = articles.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 处理筛选
  const handleFilterChange = (newFilters: ArticleFilter) => {
    setFilters(newFilters);
  };

  // 处理排序
  const handleSortChange = (newSort: ArticleSort) => {
    setSort(newSort);
  };

  // 新建文章
  const handleCreateArticle = () => {
    router.push('/admin/articles/new/edit');
  };

  // 编辑文章
  const handleEditArticle = (articleId: string) => {
    router.push(`/admin/articles/${articleId}/edit`);
  };

  // 删除文章
  const handleDeleteArticle = async (articleId: string) => {
    // TODO: 实现删除逻辑
    console.log('Delete article:', articleId);
  };

  // 处理发布文章
  const handlePublishArticle = async (articleId: string) => {
    // TODO: 实现发布逻辑
    console.log('Publish article:', articleId);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 头部操作栏 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">文章管理</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
            <Button onClick={handleCreateArticle}>
              <Plus className="w-4 h-4 mr-2" />
              新建文章
            </Button>
          </div>
        </div>

        {/* 筛选器 */}
        {showFilters && (
          <ArticleFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* 文章列表 */}
        <ArticleList
          articles={articles}
          sort={sort}
          onSortChange={handleSortChange}
          onEdit={handleEditArticle}
          onDelete={handleDeleteArticle}
          onPublish={handlePublishArticle}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </AdminLayout>
  );
} 