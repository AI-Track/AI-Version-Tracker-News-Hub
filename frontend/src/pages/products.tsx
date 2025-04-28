import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { SubscribeDialog } from "@/components/subscription/SubscribeDialog";
import { Toaster } from "@/components/ui/toaster";

const ProductsPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>产品追踪 - AI Tracker</title>
        <meta name="description" content="Track AI product updates and changes" />
      </Head>

      <div className="container mx-auto px-4 py-8 flex-1">
        <section className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">AI 产品追踪</h1>
              <p className="text-muted-foreground text-lg">
                追踪 AI 产品的更新、变化和重要事件
              </p>
            </div>
            <SubscribeDialog />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-10 w-48 rounded-full text-base bg-background border border-input focus:ring-2 focus:ring-primary/30 transition-all">
              <SelectValue placeholder="选择类别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🧩 所有类别</SelectItem>
              <SelectItem value="chatbot">💬 聊天机器人</SelectItem>
              <SelectItem value="code">💻 代码助手</SelectItem>
              <SelectItem value="image">🖼️ 图像生成</SelectItem>
              <SelectItem value="audio">🎵 音频处理</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* 产品卡片区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
          {/* OpenAI */}
          <div className="card p-6 rounded-2xl shadow-lg bg-card transition-transform hover:scale-105 hover:shadow-2xl flex flex-col">
            <div className="flex items-center mb-4">
              <img
                src="/images/chatgpt-icon.png"
                alt="OpenAI"
                className="w-14 h-14 rounded-xl mr-4 object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">OpenAI</h3>
                <p className="text-sm text-muted-foreground">聊天机器人</p>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">当前版本</span>
                <span className="font-medium">GPT-4 Turbo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">上次更新</span>
                <span className="text-muted-foreground">2024-04-15</span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/products/openai"
                className="block w-full text-center py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-all"
              >
                查看详情
              </Link>
            </div>
          </div>

          {/* GitHub Copilot */}
          <div className="card p-6 rounded-2xl shadow-lg bg-card transition-transform hover:scale-105 hover:shadow-2xl flex flex-col">
            <div className="flex items-center mb-4">
              <img
                src="/images/github-copilot-icon.png"
                alt="GitHub"
                className="w-14 h-14 rounded-xl mr-4 object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">GitHub Copilot</h3>
                <p className="text-sm text-muted-foreground">代码助手</p>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">当前版本</span>
                <span className="font-medium">2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">上次更新</span>
                <span className="text-muted-foreground">2024-04-10</span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/products/github-copilot"
                className="block w-full text-center py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-all"
              >
                查看详情
              </Link>
            </div>
          </div>

          {/* Cursor */}
          <div className="card p-6 rounded-2xl shadow-lg bg-card transition-transform hover:scale-105 hover:shadow-2xl flex flex-col">
            <div className="flex items-center mb-4">
              <img
                src="/images/cursor-icon.webp"
                alt="Cursor"
                className="w-14 h-14 rounded-xl mr-4 object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">Cursor</h3>
                <p className="text-sm text-muted-foreground">代码编辑器</p>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">当前版本</span>
                <span className="font-medium">0.20.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">上次更新</span>
                <span className="text-muted-foreground">2024-04-20</span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/products/cursor"
                className="block w-full text-center py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-all"
              >
                查看详情
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </Layout>
  );
};

export default ProductsPage; 