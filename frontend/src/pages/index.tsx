import { NextPage } from 'next';
import Head from 'next/head';
import { NextPage } from 'next';
import { MainLayout } from '@/components/layout/main/MainLayout';
import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { useFeaturedArticles, useArticles, useLatestArticles, useHotArticles, useTrendingArticles } from '@/hooks/useNews';

const HomePage: NextPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'latest' | 'hot' | 'trending'>('latest');
  const { t } = useTranslation();
  
  // 获取特色文章
  const { data: featuredArticles, isLoading: featuredLoading } = useFeaturedArticles();
  
  // 文章列表状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // 为每个分类单独管理参数，避免重复请求
  // 确保切换分类时从第1页开始，加载更多时使用当前页
  const latestParams = useMemo(() => {
    if (activeCategory === 'latest') {
      return { page: currentPage, page_size: 3 };
    }
    return undefined;
  }, [activeCategory, currentPage]);
  
  const hotParams = useMemo(() => {
    if (activeCategory === 'hot') {
      return { page: currentPage, page_size: 3 };
    }
    return undefined;
  }, [activeCategory, currentPage]);
  
  const trendingParams = useMemo(() => {
    if (activeCategory === 'trending') {
      return { page: currentPage, page_size: 3 };
    }
    return undefined;
  }, [activeCategory, currentPage]);
  
  // 按需加载文章数据 - 只请求当前选择的分类
  const { data: latestResponse, isLoading: latestLoading, refetch: refetchLatest } = useLatestArticles(latestParams);
  const { data: hotResponse, isLoading: hotLoading, refetch: refetchHot } = useHotArticles(hotParams);
  const { data: trendingResponse, isLoading: trendingLoading, refetch: refetchTrending } = useTrendingArticles(trendingParams);
  
  // 根据当前选择的分类确定要显示的数据
  const currentResponse = activeCategory === 'latest' ? latestResponse : 
                         activeCategory === 'hot' ? hotResponse : trendingResponse;
  const isInitialLoading = activeCategory === 'latest' ? latestLoading : 
                          activeCategory === 'hot' ? hotLoading : trendingLoading;
  
  const featuredNews = featuredArticles || [];
  const newsList = allArticles; // 使用累积的文章列表
  
  // 调试信息
  console.log('currentResponse:', currentResponse);
  console.log('pagination:', pagination);
  console.log('allArticles length:', allArticles.length);

  // 处理分类切换 - 重置数据
  useEffect(() => {
    console.log('分类切换到:', activeCategory);
    // 立即重置所有相关状态
    setCurrentPage(1);
    setAllArticles([]);
    setPagination(null);
    setIsLoadingMore(false);
  }, [activeCategory]);

  // 处理新数据 - 确保正确的时序
  useEffect(() => {
    if (currentResponse && Array.isArray(currentResponse)) {
      console.log(`处理${activeCategory}数据, 第${currentPage}页:`, currentResponse.length, '条');
      
      if (currentPage === 1) {
        // 第一页：直接设置数据
        setAllArticles(currentResponse);
        console.log('重置数据为第一页');
      } else {
        // 后续页：追加数据（去重）
        setAllArticles(prev => {
          // 避免重复添加相同的文章
          const existingIds = new Set(prev.map(article => article.id));
          const newArticles = currentResponse.filter(article => !existingIds.has(article.id));
          const combined = [...prev, ...newArticles];
          console.log(`追加${newArticles.length}条新数据，总计:`, combined.length, '条');
          return combined;
        });
      }
      
      // 设置分页信息
      setPagination({ 
        has_next: currentResponse.length >= 3, // 如果返回满页说明可能还有下一页
        has_prev: currentPage > 1,
        page: currentPage,
        page_size: 3,
        total: 20 // 临时设置，等后续从API获取
      });
      setIsLoadingMore(false);
    }
  }, [currentResponse, activeCategory, currentPage]);

  // 加载更多函数
  const handleLoadMore = async () => {
    if (pagination?.has_next && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  };

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
                <button 
                  onClick={() => setActiveCategory('latest')}
                  className={`text-sm transition-colors ${
                    activeCategory === 'latest' 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {t('news.latestNews')}
                </button>
                <button 
                  onClick={() => setActiveCategory('hot')}
                  className={`text-sm transition-colors ${
                    activeCategory === 'hot' 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {t('news.hotNews')}
                </button>
                <button 
                  onClick={() => setActiveCategory('trending')}
                  className={`text-sm transition-colors ${
                    activeCategory === 'trending' 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {t('news.trending')}
                </button>
              </div>
            </div>
            
            {/* 初始加载时显示骨架屏 */}
            {isInitialLoading && allArticles.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={`skeleton-${index}`} className="card overflow-hidden">
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
              <>
                {/* 文章列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsList.map((news, index) => (
                  <Link
                    key={`${activeCategory}-${news.id}`}
                    href={`/news/${news.id}`}
                    className="block"
                  >
                    <article className="card overflow-hidden hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-2" style={{ animationDelay: `${(index % 3) * 100}ms` }}>
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
              
              {/* 加载更多时的loading状态 */}
              {isLoadingMore && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 animate-in fade-in duration-300">
                  {[...Array(3)].map((_, index) => (
                    <div key={`loading-${index}`} className="card overflow-hidden animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="relative h-48 bg-muted animate-pulse rounded-lg"></div>
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
              )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">暂无新闻数据</p>
              </div>
            )}

            {/* Load More / No More Data */}
            <div className="mt-12 text-center">
              {pagination?.has_next ? (
                isLoadingMore ? (
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">正在加载更多...</span>
                  </div>
                ) : (
                  <button
                    className="btn-primary hover:scale-105 transition-transform"
                    onClick={handleLoadMore}
                  >
                    {t('news.loadMore')}
                  </button>
                )
              ) : allArticles.length > 0 ? (
                <div className="flex flex-col items-center space-y-3 py-4">
                  <div className="flex items-center space-x-4 w-full max-w-md">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border"></div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">已全部加载</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border"></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    共 {allArticles.length} 条{activeCategory === 'latest' ? '最新' : activeCategory === 'hot' ? '热门' : '趋势'}文章
                  </p>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center space-x-1 mt-2"
                  >
                    <ChevronLeft className="w-3 h-3 rotate-90" />
                    <span>回到顶部</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default HomePage; 