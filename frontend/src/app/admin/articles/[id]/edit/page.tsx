'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/Layout';
import { ArticleEditor } from '@/components/admin/articles/ArticleEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { uploadService } from '@/services/upload';
import type { Article } from '@/types/article';

// 模拟数据
const categories = [
  'AI 新闻',
  'AI 评测',
  'AI 教程',
  'AI 观点',
  'AI 应用',
];

const tags = [
  'GPT-4',
  'Claude',
  'Gemini',
  'OpenAI',
  'Anthropic',
  'Google',
];

interface Props {
  params: {
    id: string;
  };
}

export default function ArticleEditPage({ params }: Props) {
  const router = useRouter();
  const { id } = params;
  
  const [article, setArticle] = useState<Partial<Article>>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContentChange = (content: string) => {
    setArticle(prev => ({ ...prev, content }));
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const result = await uploadService.uploadFile(file);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.url;
  };

  const handleSubmit = async (status: Article['status']) => {
    setIsSubmitting(true);
    try {
      // TODO: 实现保存逻辑
      const updatedArticle = {
        ...article,
        status,
        lastModified: new Date().toISOString(),
      };
      
      console.log('Save article:', updatedArticle);
      
      router.push('/admin/articles');
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {id === 'new' ? '新建文章' : '编辑文章'}
          </h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
            >
              保存草稿
            </Button>
            <Button
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting}
            >
              发布文章
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="文章标题"
              value={article.title}
              onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <Textarea
              placeholder="文章摘要"
              value={article.excerpt}
              onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                value={article.category}
                onValueChange={(category) => setArticle(prev => ({ ...prev, category }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={article.tags?.[0]}
                onValueChange={(tag) => setArticle(prev => ({ ...prev, tags: [tag] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择标签" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ArticleEditor
            content={article.content || ''}
            onChange={handleContentChange}
          />
        </div>
      </div>
    </AdminLayout>
  );
} 