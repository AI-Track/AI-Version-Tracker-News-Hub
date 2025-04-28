import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>AI Version Tracker & News Hub</title>
        <meta name="description" content="Track AI product updates and news" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            AI Version Tracker & News Hub
          </h1>
          <p className="text-xl text-gray-600">
            实时追踪 AI 产品版本迭代和新闻动态
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Version Updates Section */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">版本更新</h2>
            <div className="space-y-4">
              {/* Version update items will be added here */}
            </div>
          </div>

          {/* News Section */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">新闻动态</h2>
            <div className="space-y-4">
              {/* News items will be added here */}
            </div>
          </div>

          {/* Products Section */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">产品追踪</h2>
            <div className="space-y-4">
              {/* Product tracking items will be added here */}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home; 