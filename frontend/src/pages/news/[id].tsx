import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Calendar, Clock, Tag, BookOpen, BookOpenCheck } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

// 模拟新闻详情数据
const newsData = {
  '1': {
    title: 'OpenAI 发布 GPT-5，性能提升显著',
    category: '重大发布',
    date: '2024-04-28',
    readTime: '8 分钟',
    author: 'AI News',
    coverImage: '/images/news/gpt5.jpg',
    content: `
      在人工智能领域的一个重大突破中，OpenAI 今日正式发布了其最新的语言模型 GPT-5。这个新版本在多个方面都展现出了显著的性能提升，进一步推动了 AI 技术的边界。

      性能提升
      相比前代产品，GPT-5 在以下几个方面都有明显改进：
      1. 理解能力：模型现在能够更准确地理解复杂的上下文和细微的语言差异
      2. 推理能力：在解决复杂问题时展现出更强的逻辑推理能力
      3. 知识范围：训练数据的更新使其掌握了更广泛的知识
      4. 多语言支持：新增了对多种语言的深度支持

      技术创新
      GPT-5 采用了多项创新技术：
      - 改进的注意力机制
      - 更高效的训练方法
      - 更好的知识表示方式
      - 更强的多模态能力

      应用场景
      新版本的 GPT-5 可以在更多场景中发挥作用：
      - 科学研究
      - 教育培训
      - 创意写作
      - 代码开发
      - 商业分析

      影响与展望
      GPT-5 的发布标志着 AI 技术又向前迈进了一大步。它不仅提升了现有应用的性能，还开启了新的可能性。然而，这也带来了一些需要关注的问题，如 AI 安全、伦理使用等。

      总结
      GPT-5 的发布再次证明了 AI 技术的快速发展。它的出现不仅推动了技术进步，也为未来的发展指明了方向。我们期待看到它在各个领域带来的创新应用。
    `,
  },
  // ... 可以添加更多新闻数据
};

const NewsDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isBionicReading, setIsBionicReading] = useState(false);

  const news = newsData[id as keyof typeof newsData];

  if (!news) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">新闻未找到</h1>
        </div>
      </Layout>
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
  const paragraphs = news.content.trim().split('\n\n');

  return (
    <Layout>
      <Head>
        <title>{news.title} - AI Tracker</title>
        <meta name="description" content={news.title} />
      </Head>

      <main className="min-h-screen py-8">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Cover Image */}
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <img
              src={news.coverImage}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                <Tag className="w-4 h-4 mr-1" />
                {news.category}
              </span>
              <span className="inline-flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                {news.date}
              </span>
              <span className="inline-flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {news.readTime}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">作者：{news.author}</span>
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
          <div className="prose prose-lg max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {isBionicReading ? convertToBionic(paragraph) : paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>
    </Layout>
  );
};

export default NewsDetailPage; 