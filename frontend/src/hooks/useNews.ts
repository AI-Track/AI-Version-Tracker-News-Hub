import { useApi, useApiWithParams } from './useApi';

// 新闻文章类型
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  status: string;
  publish_date: string;
  last_modified: string;
  read_time: number;
  view_count: number;
  is_featured: boolean;
  priority: number;
  source: {
    id: string;
    name: string;
    url: string;
  };
  created_at: string;
  updated_at: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

// 使用新闻列表的 Hook
export function useArticles(params?: {
  page?: number;
  page_size?: number;
  category?: string;
  keyword?: string;
}) {
  return useApiWithParams<PaginatedResponse<Article>>('/news/articles', 'GET', params, {
    showToast: false,
  });
}

// 使用最新文章的 Hook
export function useLatestArticles(params?: {
  page?: number;
  page_size?: number;
}) {
  return useApiWithParams<PaginatedResponse<Article>>('/news/latest', 'GET', params, {
    showToast: false,
    enabled: !!params, // 只有当params存在时才请求
  });
}

// 使用热门文章的 Hook
export function useHotArticles(params?: {
  page?: number;
  page_size?: number;
}) {
  return useApiWithParams<PaginatedResponse<Article>>('/news/hot', 'GET', params, {
    showToast: false,
    enabled: !!params, // 只有当params存在时才请求
  });
}

// 使用趋势文章的 Hook
export function useTrendingArticles(params?: {
  page?: number;
  page_size?: number;
}) {
  return useApiWithParams<PaginatedResponse<Article>>('/news/trending', 'GET', params, {
    showToast: false,
    enabled: !!params, // 只有当params存在时才请求
  });
}

// 使用特色新闻的 Hook
export function useFeaturedArticles() {
  return useApi<Article[]>('/news/featured', 'GET', {
    showToast: false,
  });
}

// 使用单篇文章的 Hook
export function useArticle(id: string) {
  return useApi<Article>(`/news/articles/${id}`, 'GET', {
    enabled: !!id,
  });
}

// 搜索文章的 Hook
export function useSearchArticles(keyword: string) {
  return useApi<PaginatedResponse<Article>>('/news/search', 'GET', {
    params: { keyword },
    enabled: !!keyword,
    showToast: false,
  });
}

// 按分类获取文章的 Hook
export function useArticlesByCategory(category: string, params?: {
  page?: number;
  page_size?: number;
}) {
  return useApi<PaginatedResponse<Article>>(`/news/categories/${category}/articles`, 'GET', {
    params,
    enabled: !!category,
    showToast: false,
  });
}