import { NextPage } from 'next';
import Head from 'next/head';
import { NextPage } from 'next';
import { MainLayout } from '@/components/layout/main/MainLayout';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Calendar, Clock, Tag, BookOpen, BookOpenCheck, ArrowLeft } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import Link from 'next/link';
import { useArticleDetail } from '@/hooks/useNews';

const NewsDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isBionicReading, setIsBionicReading] = useState(false);

  // 使用真实API获取文章详情
  const { data: article, loading, error } = useArticleDetail(id as string);

  // Loading状态
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-muted rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 错误状态
  if (error || !article) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
            <p className="text-muted-foreground mb-6">
              {error ? '加载文章时出现错误' : '请检查文章ID是否正确'}
            </p>
            <Link href="/" className="btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Bionic Reading 转换函数
  const convertToBionic = (text: string) => {
    return text.split(' ').map((word, index) => {
      const boldLength = Math.ceil(word.length * 0.6); // 将单词的前 60% 加粗
      return (
        <span key={index} className="inline-block">
          <span className="font-bold">{word.slice(0, boldLength)}</span>
          {word.slice(boldLength)}
          {' '}
        </span>
      );
    });
  };

  // 将内容按段落分割
  const paragraphs = article.content.trim().split('\n\n').filter(p => p.trim());

  return (
    <MainLayout>
      <Head>
        <title>{article.title} - AI Tracker</title>
        <meta name="description" content={article.excerpt || article.title} />
      </Head>

      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Link>
          </div>
        </div>
        
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Cover Image */}
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.svg';
              }}
            />
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                <Tag className="w-4 h-4 mr-1" />
                {article.category}
              </span>
              <span className="inline-flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(article.publish_date).toLocaleDateString('zh-CN')}
              </span>
              <span className="inline-flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {article.read_time} 分钟
              </span>
              <span className="inline-flex items-center text-sm text-muted-foreground">
                👁️ {article.view_count} 次浏览
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                作者：{article.author?.name || article.source?.name || '未知'}
              </span>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => setIsBionicReading(!isBionicReading)}
                      className="inline-flex items-center p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                      aria-label={isBionicReading ? '切换到普通阅读' : '切换到 Bionic 阅读'}
                    >
                      {isBionicReading ? (
                        <BookOpenCheck className="w-5 h-5" />
                      ) : (
                        <BookOpen className="w-5 h-5" />
                      )}
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md shadow-md"
                      sideOffset={5}
                    >
                      {isBionicReading ? '切换到普通阅读' : '切换到 Bionic 阅读'}
                      <Tooltip.Arrow className="fill-secondary" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {isBionicReading ? convertToBionic(paragraph) : paragraph}
              </p>
            ))}
          </div>

          {/* 标签 */}
          {article.tags && article.tags.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">相关标签</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </MainLayout>
  );
};

export default NewsDetailPage; 