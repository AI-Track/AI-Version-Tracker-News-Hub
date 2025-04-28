import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

const HomePage: NextPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  // 模拟新闻数据
  const featuredNews = [
    {
      id: 1,
      title: 'OpenAI 发布 GPT-5，性能提升显著',
      image: '/images/news/gpt5.jpg',
      category: '重大发布',
      date: '2024-04-28',
      summary: 'OpenAI 今日正式发布 GPT-5 模型，相比前代产品在理解力和创造力方面都有显著提升...',
    },
    {
      id: 2,
      title: 'GitHub Copilot 新增代码重构功能',
      image: '/images/news/copilot.jpg',
      category: '功能更新',
      date: '2024-04-27',
      summary: 'GitHub 为 Copilot 添加了智能代码重构功能，可以自动优化代码结构...',
    },
    {
      id: 3,
      title: 'AI 研究突破：新型神经网络架构问世',
      image: '/images/news/research.jpg',
      category: '研究进展',
      date: '2024-04-26',
      summary: '来自斯坦福大学的研究团队提出了一种新型神经网络架构，大幅提升了模型效率...',
    },
  ];

  const newsList = [
    {
      id: 1,
      title: 'Anthropic 推出 Claude 3.0，挑战 GPT-4',
      image: '/images/news/claude.jpg',
      category: '产品发布',
      date: '2024-04-25',
      summary: 'Anthropic 发布了最新版本的 AI 助手 Claude 3.0，在多项测试中表现优异...',
    },
    // ... 更多新闻项目
  ];

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 处理轮播导航
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
  };

  return (
    <Layout>
      <Head>
        <title>AI Version Tracker - 首页</title>
        <meta name="description" content="Latest AI news and updates" />
      </Head>

      <main className="min-h-screen">
        {/* Hero Carousel */}
        <div className="relative h-[500px] bg-gradient-to-b from-background to-secondary">
          <div className="container mx-auto px-4 h-full">
            <div className="relative h-full group">
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
                      <p className="text-lg text-muted-foreground">{news.summary}</p>
                      <Link 
                        href={`/news/${news.id}`}
                        className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        阅读更多
                      </Link>
                    </div>
                    <div className="hidden md:block">
                      <Link href={`/news/${news.id}`} className="block">
                        <div className="relative h-[400px] rounded-lg overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
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
        </div>

        {/* Latest News */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center">
                <Clock className="w-6 h-6 mr-2 text-primary" />
                最新动态
              </h2>
              <div className="flex items-center space-x-4">
                <button className="text-sm text-muted-foreground hover:text-primary">
                  最新
                </button>
                <button className="text-sm text-muted-foreground hover:text-primary">
                  最热
                </button>
                <button className="text-sm text-muted-foreground hover:text-primary">
                  推荐
                </button>
              </div>
            </div>
            
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
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover"
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
                        {news.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {news.date}
                        </span>
                        <span className="text-primary hover:text-primary/90">
                          阅读更多 →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

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
                {loading ? '加载中...' : '加载更多'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default HomePage; 