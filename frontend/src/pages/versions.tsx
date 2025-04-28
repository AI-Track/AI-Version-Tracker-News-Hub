import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';

const VersionsPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>版本更新 - AI Version Tracker</title>
        <meta name="description" content="Track AI product version updates" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-4xl font-bold mb-4">AI 产品版本更新</h1>
          <p className="text-muted-foreground text-lg">
            追踪主流 AI 产品的版本迭代和功能更新
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* OpenAI Updates */}
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <img
                src="/images/chatgpt-icon.png"
                alt="OpenAI"
                className="w-12 h-12 rounded-lg mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">OpenAI</h2>
                <p className="text-sm text-muted-foreground">聊天机器人</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">GPT-4 Turbo</span>
                  <span className="text-sm text-muted-foreground">2024-04-15</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  更新了上下文窗口大小，提升了响应速度
                </p>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">GPT-4</span>
                  <span className="text-sm text-muted-foreground">2024-03-20</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  优化了代码生成能力，增加了新的 API 功能
                </p>
              </div>
            </div>
          </div>

          {/* GitHub Copilot Updates */}
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <img
                src="/images/github-copilot-icon.png"
                alt="GitHub Copilot"
                className="w-12 h-12 rounded-lg mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">GitHub Copilot</h2>
                <p className="text-sm text-muted-foreground">代码助手</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Copilot 2.0</span>
                  <span className="text-sm text-muted-foreground">2024-04-10</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  新增了代码解释功能，支持更多编程语言
                </p>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Copilot Chat</span>
                  <span className="text-sm text-muted-foreground">2024-03-15</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  改进了代码建议的准确性，优化了性能
                </p>
              </div>
            </div>
          </div>

          {/* Cursor Updates */}
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <img
                src="/images/cursor-icon.webp"
                alt="Cursor"
                className="w-12 h-12 rounded-lg mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">Cursor</h2>
                <p className="text-sm text-muted-foreground">代码编辑器</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Cursor 0.20.0</span>
                  <span className="text-sm text-muted-foreground">2024-04-20</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  新增了代码重构功能，改进了 AI 补全
                </p>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Cursor 0.19.0</span>
                  <span className="text-sm text-muted-foreground">2024-03-25</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  优化了编辑器性能，增加了新的快捷键
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">其他 AI 产品</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Additional product cards will be added here */}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default VersionsPage; 