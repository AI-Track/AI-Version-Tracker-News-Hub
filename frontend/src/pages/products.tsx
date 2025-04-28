import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Search } from 'lucide-react';
import Link from 'next/link';

const ProductsPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>产品追踪 - AI Version Tracker</title>
        <meta name="description" content="Track AI product updates and changes" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-4xl font-bold mb-4">AI 产品追踪</h1>
          <p className="text-muted-foreground text-lg">
            追踪 AI 产品的更新、变化和重要事件
          </p>
        </section>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="搜索产品..."
                className="input pl-10"
              />
            </div>
            <select className="input">
              <option value="">所有类别</option>
              <option value="chatbot">聊天机器人</option>
              <option value="code">代码助手</option>
              <option value="image">图像生成</option>
              <option value="audio">音频处理</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* OpenAI */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <img
                src="/images/chatgpt-icon.png"
                alt="OpenAI"
                className="w-12 h-12 rounded-lg mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold">OpenAI</h3>
                <p className="text-sm text-muted-foreground">聊天机器人</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">当前版本</span>
                <span className="font-medium">GPT-4 Turbo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">上次更新</span>
                <span className="text-muted-foreground">2024-04-15</span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/products/openai"
                className="btn-primary w-full text-center block"
              >
                查看详情
              </Link>
            </div>
          </div>

          {/* GitHub Copilot */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <img
                src="/images/github-copilot-icon.png"
                alt="GitHub"
                className="w-12 h-12 rounded-lg mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold">GitHub Copilot</h3>
                <p className="text-sm text-muted-foreground">代码助手</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">当前版本</span>
                <span className="font-medium">2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">上次更新</span>
                <span className="text-muted-foreground">2024-04-10</span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/products/github-copilot"
                className="btn-primary w-full text-center block"
              >
                查看详情
              </Link>
            </div>
          </div>

          {/* Cursor */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <img
                src="/images/cursor-icon.webp"
                alt="Cursor"
                className="w-12 h-12 rounded-lg mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold">Cursor</h3>
                <p className="text-sm text-muted-foreground">代码编辑器</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">当前版本</span>
                <span className="font-medium">0.20.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">上次更新</span>
                <span className="text-muted-foreground">2024-04-20</span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/products/cursor"
                className="btn-primary w-full text-center block"
              >
                查看详情
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ProductsPage; 