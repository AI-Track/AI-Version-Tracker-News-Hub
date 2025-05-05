import { useState } from 'react';
import { AdminLayout } from '@/components/layout/admin/AdminLayout';
import { ArticleList } from '@/components/admin/articles/ArticleList';
import { ArticleFilters } from '@/components/admin/articles/ArticleFilters';
import { ArticleActivityLog } from '@/components/admin/articles/ArticleActivityLog';
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

// 模拟操作记录数据
const mockActivityLogs = [
  {
    id: '1',
    type: 'publish' as const,
    articleId: '1',
    articleTitle: 'GPT-4 Turbo 发布：更强大的多模态能力',
    userId: '1',
    userName: '张三',
    userAvatar: '/avatars/1.png',
    timestamp: '2024-04-15T10:30:00Z',
    details: {
      description: '文章已发布到首页'
    }
  },
  {
    id: '2',
    type: 'edit' as const,
    articleId: '1',
    articleTitle: 'GPT-4 Turbo 发布：更强大的多模态能力',
    userId: '2',
    userName: '李四',
    userAvatar: '/avatars/2.png',
    timestamp: '2024-04-15T09:45:00Z',
    details: {
      description: '更新了性能数据和技术规格'
    }
  },
  {
    id: '3',
    type: 'status_change' as const,
    articleId: '1',
    articleTitle: 'GPT-4 Turbo 发布：更强大的多模态能力',
    userId: '1',
    userName: '张三',
    userAvatar: '/avatars/1.png',
    timestamp: '2024-04-15T09:20:00Z',
    details: {
      from: '待审核',
      to: '已发布'
    }
  },
  {
    id: '4',
    type: 'edit' as const,
    articleId: '2',
    articleTitle: 'Claude 3 性能测评：与 GPT-4 的详细对比',
    userId: '2',
    userName: '李四',
    userAvatar: '/avatars/2.png',
    timestamp: '2024-04-14T15:45:00Z',
    details: {
      description: '补充了性能测试数据和对比结论'
    }
  },
  {
    id: '5',
    type: 'status_change' as const,
    articleId: '2',
    articleTitle: 'Claude 3 性能测评：与 GPT-4 的详细对比',
    userId: '3',
    userName: '王五',
    userAvatar: '/avatars/3.png',
    timestamp: '2024-04-14T14:30:00Z',
    details: {
      from: '草稿',
      to: '待审核'
    }
  },
  {
    id: '6',
    type: 'edit' as const,
    articleId: '2',
    articleTitle: 'Claude 3 性能测评：与 GPT-4 的详细对比',
    userId: '2',
    userName: '李四',
    userAvatar: '/avatars/2.png',
    timestamp: '2024-04-14T11:20:00Z',
    details: {
      description: '添加了最新的基准测试结果'
    }
  },
  {
    id: '7',
    type: 'edit' as const,
    articleId: '3',
    articleTitle: 'Gemini 2.0 发布在即：谷歌的AI新突破',
    userId: '1',
    userName: '张三',
    userAvatar: '/avatars/1.png',
    timestamp: '2024-04-14T10:15:00Z',
    details: {
      description: '更新了发布会信息和技术预览'
    }
  },
  {
    id: '8',
    type: 'status_change' as const,
    articleId: '3',
    articleTitle: 'Gemini 2.0 发布在即：谷歌的AI新突破',
    userId: '3',
    userName: '王五',
    userAvatar: '/avatars/3.png',
    timestamp: '2024-04-14T09:30:00Z',
    details: {
      from: '草稿',
      to: '待审核'
    }
  },
  {
    id: '9',
    type: 'publish' as const,
    articleId: '4',
    articleTitle: 'AI 安全和隐私保护：2024年最新进展',
    userId: '1',
    userName: '张三',
    userAvatar: '/avatars/1.png',
    timestamp: '2024-04-13T16:45:00Z',
    details: {
      description: '文章已发布并推送到订阅用户'
    }
  },
  {
    id: '10',
    type: 'status_change' as const,
    articleId: '4',
    articleTitle: 'AI 安全和隐私保护：2024年最新进展',
    userId: '2',
    userName: '李四',
    userAvatar: '/avatars/2.png',
    timestamp: '2024-04-13T15:30:00Z',
    details: {
      from: '待审核',
      to: '已发布'
    }
  }
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
  const [activityLogs] = useState(mockActivityLogs);

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
        />

        {/* 操作记录列表 */}
        <div className="mt-8">
          <ArticleActivityLog logs={activityLogs} />
        </div>
      </div>
    </AdminLayout>
  );
} 