import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ArrowLeft, Calendar, Tag, Code, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const ProductDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedYear, setExpandedYear] = useState<string | null>(null);

  // 模拟更多的版本历史数据
  const moreVersions = [
    {
      version: 'GPT-4 Turbo Preview',
      date: '2024-04-15',
      changes: ['更新了上下文窗口大小', '提升了响应速度', '优化了代码生成能力'],
    },
    {
      version: 'GPT-4 v2',
      date: '2024-03-20',
      changes: ['增加了新的 API 功能', '改进了多模态能力', '优化了性能'],
    },
    {
      version: 'GPT-4 v1.5',
      date: '2024-02-15',
      changes: ['提升了推理能力', '优化了多语言支持', '改进了代码生成'],
    },
    {
      version: 'GPT-4 v1.2',
      date: '2024-01-10',
      changes: ['修复了已知问题', '提升了稳定性', '优化了响应时间'],
    },
    {
      version: 'GPT-4 v1.1',
      date: '2023-12-20',
      changes: ['增加了新特性', '改进了性能', '优化了用户体验'],
    },
    // ... 添加更多版本历史
  ];

  // 更新产品数据，加入更多版本历史
  const productData = {
    openai: {
      name: 'OpenAI',
      logo: '/images/chatgpt-icon.png',
      type: '聊天机器人',
      currentVersion: 'GPT-4 Turbo',
      lastUpdate: '2024-04-15',
      description: 'OpenAI 的 GPT-4 是一个先进的大型语言模型，能够理解和生成人类语言，支持多种任务。',
      features: [
        '更大的上下文窗口',
        '更快的响应速度',
        '更强的代码生成能力',
        '更好的多语言支持',
      ],
      versions: moreVersions,
    },
    'github-copilot': {
      name: 'GitHub Copilot',
      logo: '/images/github-copilot-icon.png',
      type: '代码助手',
      currentVersion: '2.0',
      lastUpdate: '2024-04-10',
      description: 'GitHub Copilot 是一个 AI 驱动的代码助手，能够帮助开发者更快地编写代码。',
      features: [
        '实时代码建议',
        '自然语言转代码',
        '多语言支持',
        '代码解释功能',
      ],
      versions: moreVersions,
    },
    cursor: {
      name: 'Cursor',
      logo: '/images/cursor-icon.webp',
      type: '代码编辑器',
      currentVersion: '0.20.0',
      lastUpdate: '2024-04-20',
      description: 'Cursor 是一个现代化的代码编辑器，集成了 AI 功能，提供智能代码补全和重构。',
      features: [
        'AI 代码补全',
        '代码重构工具',
        '智能错误检测',
        '集成终端',
      ],
      versions: moreVersions,
    },
  };

  const product = productData[id as keyof typeof productData];

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">产品未找到</h1>
        </div>
      </Layout>
    );
  }

  // 按年份对版本进行分组
  const versionsByYear = product.versions.reduce((acc, version) => {
    const year = version.date.split('-')[0];
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(version);
    return acc;
  }, {} as Record<string, typeof product.versions>);

  // 获取所有年份并排序
  const years = Object.keys(versionsByYear).sort((a, b) => Number(b) - Number(a));

  // 渲染版本历史时间线
  const renderVersionTimeline = () => {
    return years.map((year) => (
      <div key={year} className="mb-8 last:mb-0">
        <button
          onClick={() => setExpandedYear(expandedYear === year ? null : year)}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h3 className="text-xl font-semibold">{year} 年</h3>
          {expandedYear === year ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        
        {expandedYear === year && (
          <div className="space-y-6 relative before:absolute before:left-2 before:top-0 before:bottom-0 before:w-0.5 before:bg-border">
            {versionsByYear[year].map((version, index) => (
              <div
                key={index}
                className="relative pl-8"
              >
                <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-background border-2 border-primary"></div>
                <div className="card p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium">{version.version}</h4>
                    <span className="text-sm text-muted-foreground">{version.date}</span>
                  </div>
                  <ul className="space-y-2">
                    {version.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="text-muted-foreground flex items-start">
                        <span className="mr-2">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <Layout>
      <Head>
        <title>{product.name} - AI Tracker</title>
        <meta name="description" content={`Track ${product.name} updates and changes`} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回产品列表
        </button>

        {/* Product Header */}
        <div className="flex items-center mb-8">
          <img
            src={product.logo}
            alt={product.name}
            className="w-16 h-16 rounded-lg mr-6"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {product.type}
              </span>
              <span className="flex items-center">
                <Code className="w-4 h-4 mr-1" />
                {product.currentVersion}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {product.lastUpdate}
              </span>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">产品介绍</h2>
          <p className="text-muted-foreground">{product.description}</p>
        </div>

        {/* Features */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">主要功能</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Version History */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">版本历史</h2>
            <div className="text-sm text-muted-foreground">
              共 {product.versions.length} 个版本
            </div>
          </div>
          {renderVersionTimeline()}
        </div>
      </main>
    </Layout>
  );
};

export default ProductDetailPage; 