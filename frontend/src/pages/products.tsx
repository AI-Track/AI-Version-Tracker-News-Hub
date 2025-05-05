import { NextPage } from 'next';
import Head from 'next/head';
import { MainLayout } from '@/components/layout/main/MainLayout';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, History } from "lucide-react";
import { SubscribeDialog } from "@/components/subscription/SubscribeDialog";
import { Toaster } from "@/components/ui/toaster";
import { useStore } from '../store';
import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/router';

const ProductsPage: NextPage = () => {
  const { t } = useTranslation();
  const { 
    products, 
    setProducts, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useStore();
  const router = useRouter();

  useEffect(() => {
    // Mock data - replace with actual API call
    setProducts([
      {
        id: '1',
        name: 'OpenAI',
        type: 'chatbot',
        version: 'GPT-4',
        lastUpdate: '2024-03-20',
        image: '/logo/openai.png',
        description: 'Leading AI language model'
      },
      {
        id: '2',
        name: 'GitHub Copilot',
        type: 'code',
        version: '2.0',
        lastUpdate: '2024-03-15',
        image: '/logo/github-copilot.png',
        description: 'AI pair programmer'
      },
      {
        id: '3',
        name: 'Cursor',
        type: 'code',
        version: '1.5',
        lastUpdate: '2024-03-18',
        image: '/logo/cursor.webp',
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
    <MainLayout>
      <Head>
        <title>{t('products.title')} | {t('layout.title')}</title>
        <meta name="description" content={t('products.subtitle')} />
      </Head>

      <div className="py-8">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t('products.title')}</h1>
              <p className="text-muted-foreground text-lg">
                {t('products.subtitle')}
              </p>
            </div>
            <SubscribeDialog />
          </div>
          <div className="w-fit">
            <Select 
              defaultValue="all" 
              onValueChange={setSelectedCategory}
              options={[
                { label: t('products.filter.all'), value: 'all' },
                { label: t('products.filter.chatbot'), value: 'chatbot' },
                { label: t('products.filter.code'), value: 'code' },
                { label: t('products.filter.image'), value: 'image' },
                { label: t('products.filter.audio'), value: 'audio' }
              ]}
            >
              <SelectTrigger className="w-48 rounded-full text-base bg-background border border-input focus:ring-2 focus:ring-primary/30 transition-all">
                <SelectValue placeholder={t('products.filter.title')} />
              </SelectTrigger>
              <SelectContent className="w-48">
                <SelectItem value="all">{t('products.filter.all')}</SelectItem>
                <SelectItem value="chatbot">{t('products.filter.chatbot')}</SelectItem>
                <SelectItem value="code">{t('products.filter.code')}</SelectItem>
                <SelectItem value="image">{t('products.filter.image')}</SelectItem>
                <SelectItem value="audio">{t('products.filter.audio')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              {t('products.noResults')}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="card p-6 rounded-2xl shadow-lg bg-card transition-transform hover:scale-105 hover:shadow-2xl flex flex-col">
                <div className="flex items-center mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl mr-4 object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{t(`products.filter.${product.type}`)}</p>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('products.card.currentVersion')}</span>
                    <span className="font-medium">{product.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('products.card.lastUpdate')}</span>
                    <span className="text-muted-foreground">{product.lastUpdate}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/products/${product.id}`}
                    className="block w-full text-center py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-all"
                  >
                    {t('products.card.viewDetails')}
                  </Link>
                </div>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push(`/products/${product.id}/versions/${product.version}`)}
                  >
                    <History className="w-4 h-4 mr-2" />
                    版本历史
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Toaster />
    </MainLayout>
  );
};

export default ProductsPage; 