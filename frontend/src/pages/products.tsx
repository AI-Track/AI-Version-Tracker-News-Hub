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
import { useStore } from '../store';
import { useEffect } from 'react';

const ProductsPage: NextPage = () => {
  const { 
    products, 
    setProducts, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useStore()

  useEffect(() => {
    // Mock data - replace with actual API call
    setProducts([
      {
        id: '1',
        name: 'OpenAI',
        type: 'chatbot',
        version: 'GPT-4',
        lastUpdate: '2024-03-20',
        image: '/images/openai.png',
        description: 'Leading AI language model'
      },
      {
        id: '2',
        name: 'GitHub Copilot',
        type: 'code',
        version: '2.0',
        lastUpdate: '2024-03-15',
        image: '/images/github-copilot.png',
        description: 'AI pair programmer'
      },
      {
        id: '3',
        name: 'Cursor',
        type: 'code',
        version: '1.5',
        lastUpdate: '2024-03-18',
        image: '/images/cursor.png',
        description: 'AI-powered code editor'
      }
    ])
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.type === selectedCategory
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Layout>
      <Head>
        <title>AI 产品追踪 | AI News</title>
        <meta name="description" content="追踪最新 AI 产品的更新动态" />
      </Head>

      <main className="container mx-auto px-4 py-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card p-6 rounded-2xl shadow-lg bg-card transition-transform hover:scale-105 hover:shadow-2xl flex flex-col">
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
          ))}
        </div>
      </main>
      <Toaster />
    </Layout>
  );
};

export default ProductsPage; 