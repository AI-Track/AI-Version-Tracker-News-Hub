import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main/MainLayout';
import { VersionTimeline } from '@/components/versions/VersionTimeline';
import { useProductVersions } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, GitBranch } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProductVersionsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  
  const { data: versions, isLoading, error } = useProductVersions(id as string);

  // 加载状态
  if (isLoading) {
    return (
      <MainLayout>
        <Head>
          <title>版本历史 | {t('layout.title')}</title>
        </Head>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 错误状态
  if (error) {
    return (
      <MainLayout>
        <Head>
          <title>版本历史 | {t('layout.title')}</title>
        </Head>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">加载失败</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回上一页
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>版本历史 | {t('layout.title')}</title>
        <meta name="description" content="查看产品的版本更新历史和详细变更信息" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回产品详情
          </Button>
          
          <div className="flex items-center mb-4">
            <GitBranch className="w-8 h-8 mr-3 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">版本历史</h1>
              <p className="text-muted-foreground">
                共 {versions.length} 个版本
              </p>
            </div>
          </div>
        </div>

        {/* 版本概览统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">最新版本</p>
                <p className="text-2xl font-bold">{versions[0]?.version}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">最近更新</p>
                <p className="text-2xl font-bold">
                  {versions[0]?.date ? new Date(versions[0].date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <GitBranch className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">版本类型</p>
                <div className="flex space-x-1 mt-1">
                  {['major', 'minor', 'patch'].map(type => {
                    const count = versions.filter(v => v.type === type).length;
                    return count > 0 ? (
                      <span key={type} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                        {count} {type}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 版本列表 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">所有版本</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {versions.map((version, index) => (
              <Link
                key={version.version}
                href={`/products/${id}/versions/${version.version}`}
                className="block"
              >
                <div className="card p-6 hover:shadow-lg transition-shadow border-l-4 border-l-primary/20 hover:border-l-primary">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">v{version.version}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        version.type === 'major' ? 'bg-red-100 text-red-800' :
                        version.type === 'minor' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {version.type?.toUpperCase()}
                      </span>
                      {version.importance && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          version.importance === 'high' ? 'bg-orange-100 text-orange-800' :
                          version.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {version.importance}
                        </span>
                      )}
                      {index === 0 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground">
                          最新
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(version.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {version.details && (
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {version.details}
                    </p>
                  )}
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">主要变更：</p>
                    <ul className="space-y-1">
                      {version.changes.slice(0, 3).map((change, changeIndex) => (
                        <li key={changeIndex} className="text-sm flex items-start">
                          <span className="w-2 h-2 rounded-full bg-primary/60 mt-2 mr-2 flex-shrink-0"></span>
                          <span className="line-clamp-1">{change}</span>
                        </li>
                      ))}
                      {version.changes.length > 3 && (
                        <li className="text-sm text-muted-foreground">
                          还有 {version.changes.length - 3} 项变更...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 