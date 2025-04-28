import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/Layout';

const VersionsPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>版本更新 - AI Version Tracker</title>
        <meta name="description" content="Track AI product version updates" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">AI 产品版本更新</h1>
          <p className="text-gray-600">
            追踪主流 AI 产品的版本迭代和功能更新
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* OpenAI Updates */}
          <div className="card">
            <div className="flex items-center mb-4">
              <img src="/images/openai-logo.png" alt="OpenAI" className="w-8 h-8 mr-2" />
              <h2 className="text-xl font-semibold">OpenAI</h2>
            </div>
            <div className="space-y-4">
              {/* Version items will be added here */}
            </div>
          </div>

          {/* GitHub Copilot Updates */}
          <div className="card">
            <div className="flex items-center mb-4">
              <img src="/images/github-logo.png" alt="GitHub Copilot" className="w-8 h-8 mr-2" />
              <h2 className="text-xl font-semibold">GitHub Copilot</h2>
            </div>
            <div className="space-y-4">
              {/* Version items will be added here */}
            </div>
          </div>

          {/* Cursor Updates */}
          <div className="card">
            <div className="flex items-center mb-4">
              <img src="/images/cursor-logo.png" alt="Cursor" className="w-8 h-8 mr-2" />
              <h2 className="text-xl font-semibold">Cursor</h2>
            </div>
            <div className="space-y-4">
              {/* Version items will be added here */}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">其他 AI 产品</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Additional product cards will be added here */}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default VersionsPage; 