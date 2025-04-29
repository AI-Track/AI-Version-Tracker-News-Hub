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
        <h1 className="text-4xl font-bold mb-4">AI 产品追踪</h1>
        <p className="text-gray-600 mb-8">
          实时追踪各大 AI 产品的最新更新，及时了解产品动态
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="搜索产品..."
            className="flex-1 p-2 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">所有类别</option>
            <option value="chatbot">聊天机器人</option>
            <option value="code">代码</option>
            <option value="image">图像</option>
            <option value="audio">音频</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.type}</p>
              <p className="text-sm text-gray-500 mb-1">当前版本: {product.version}</p>
              <p className="text-sm text-gray-500 mb-4">最后更新: {product.lastUpdate}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                查看详情
              </button>
            </div>
          ))}
        </div>
      </main>
      <Toaster />
    </Layout>
  );
};

export default ProductsPage; 