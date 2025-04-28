import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';

const NewsPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>新闻动态 - AI Version Tracker</title>
        <meta name="description" content="Latest AI news and updates" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">AI 新闻动态</h1>
          <p className="text-gray-600">
            获取最新的 AI 行业新闻、产品发布和技术突破
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main News Section */}
          <div className="lg:col-span-2">
            <section className="space-y-6">
              {/* Featured News */}
              <div className="card">
                <div className="relative h-48 mb-4">
                  <img
                    src="/images/placeholder.jpg"
                    alt="Featured news"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <span className="text-white text-sm">最新发布</span>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  重大新闻标题
                </h2>
                <p className="text-gray-600 mb-4">
                  新闻摘要内容将在这里显示...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">2024-04-28</span>
                  <a href="#" className="text-primary-600 hover:text-primary-700">
                    阅读更多 →
                  </a>
                </div>
              </div>

              {/* News List */}
              <div className="space-y-4">
                {/* News items will be added here */}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">新闻分类</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-600">
                    产品发布
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-600">
                    技术突破
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-600">
                    行业动态
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-600">
                    研究进展
                  </a>
                </li>
              </ul>
            </div>

            {/* Popular Tags */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  OpenAI
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  GPT-4
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Copilot
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  AI 研究
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default NewsPage; 