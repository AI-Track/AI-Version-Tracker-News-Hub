import { NextPage } from 'next';
import Head from 'next/head';
import { MainLayout } from '@/components/layout/main/MainLayout';
import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { useFeaturedArticles, useArticles } from '@/hooks/useNews';

const HomePage: NextPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  
  // 获取特色文章
  const { data: featuredArticles, isLoading: featuredLoading } = useFeaturedArticles();
  
  // 使用 useMemo 稳定参数对象引用
  const articlesParams = useMemo(() => ({
    page: 1,
    page_size: 6
  }), []);
  
  // 获取最新文章
  const { data: articlesResponse, isLoading: articlesLoading } = useArticles(articlesParams);
  
  const featuredNews = featuredArticles || [];
  const newsList = articlesResponse?.data || [];

  // 自动轮播
  useEffect(() => {
    if (featuredNews.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredNews.length]);

  // 处理轮播导航
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
  };

  return (
    <MainLayout>
      <Head>
        <title>AI Track - Your AI Development Tracker</title>
        <meta name="description" content="Latest AI news and updates" />
      </Head>

      <main className="min-h-screen">
        {/* Hero Carousel */}
        <div className="relative h-[500px] bg-gradient-to-b from-background to-secondary group">
          <div className="container mx-auto px-4 h-full">
            {featuredLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">加载特色新闻中...</p>
                </div>
              </div>
            ) : featuredNews.length > 0 ? (
              <div className="relative h-full">
                {featuredNews.map((news, index) => (
                  <div
                    key={news.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
                      <div className="space-y-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {news.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold">{news.title}</h1>
                        <p className="text-lg text-muted-foreground">{news.excerpt}</p>
                        <Link 
                          href={`/news/${news.id}`}
                          className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          {t('news.readMore')}
                        </Link>
                      </div>
                      <div className="hidden md:block">
                        <Link href={`/news/${news.id}`} className="block">
                          <div className="relative h-[400px] rounded-lg overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                            <img
                              src={news.cover_image}
                              alt={news.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder.svg';
                              }}
                            />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground">暂无特色新闻</p>
                </div>
              </div>
            )}
            
            {/* Carousel Controls */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
              {featuredNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-primary w-8'
                      : 'bg-primary/30'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 text-foreground hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 text-foreground hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Latest News */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center">
                <Clock className="w-6 h-6 mr-2 text-primary" />
                {t('news.latestNews')}
              </h2>
              <div className="flex items-center space-x-4">
                <button className="text-sm text-muted-foreground hover:text-primary">
                  {t('news.latestNews')}
                </button>
                <button className="text-sm text-muted-foreground hover:text-primary">
                  {t('news.hotNews')}
                </button>
                <button className="text-sm text-muted-foreground hover:text-primary">
                  {t('news.trending')}
                </button>
              </div>
            </div>
            
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="card overflow-hidden">
                    <div className="relative h-48 bg-muted animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-muted rounded animate-pulse mb-4 w-3/4"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 bg-muted rounded animate-pulse w-20"></div>
                        <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : newsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsList.map((news) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.id}`}
                    className="block"
                  >
                    <article className="card overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={news.cover_image}
                          alt={news.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder.svg';
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-background/80 text-sm">
                            {news.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {news.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {new Date(news.publish_date).toLocaleDateString('zh-CN')}
                          </span>
                          <span className="text-primary hover:text-primary/90">
                            {t('news.readMore')} →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">暂无新闻数据</p>
              </div>
            )}

            {/* Load More */}
            <div className="mt-12 text-center">
              <button
                className="btn-primary"
                onClick={() => {
                  setLoading(true);
                  // 模拟加载更多
                  setTimeout(() => setLoading(false), 1000);
                }}
              >
                {loading ? t('news.loading') : t('news.loadMore')}
              </button>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default HomePage; 