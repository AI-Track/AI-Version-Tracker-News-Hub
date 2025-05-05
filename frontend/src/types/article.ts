export type ArticleStatus = 'draft' | 'pending' | 'published' | 'archived';

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  status: ArticleStatus;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  publishDate?: string;
  lastModified: string;
  readTime: number;
  viewCount: number;
  relatedProducts?: string[];
}

export interface ArticleFilter {
  status?: ArticleStatus;
  category?: string;
  tag?: string;
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ArticleSort {
  field: 'publishDate' | 'lastModified' | 'viewCount' | 'title';
  direction: 'asc' | 'desc';
} 