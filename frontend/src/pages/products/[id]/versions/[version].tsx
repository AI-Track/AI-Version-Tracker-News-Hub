import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { VersionDetail } from '@/components/versions/VersionDetail';
import { VersionTimeline } from '@/components/versions/VersionTimeline';
import { useProductVersions } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

export default function VersionDetailPage() {
  const router = useRouter();
  const { id, version } = router.query;
  
  const { data: versions, isLoading, error } = useProductVersions(id as string);
  
  // 在数据加载完成后查找当前版本
  const currentVersion = versions.find(v => v.version === version);

  console.log('Debug Info:', {
    id,
    version,
    versionsCount: versions.length,
    currentVersion,
    isLoading,
    error
  });

  // 加载状态
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* 左侧时间线骨架屏 */}
            <div className="col-span-3">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            </div>
            
            {/* 右侧详情骨架屏 */}
            <div className="col-span-9">
              <Skeleton className="h-12 w-3/4 mb-6" />
              <Skeleton className="h-24 w-full mb-8" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // 错误状态
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">加载失败</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => router.back()}
              className="btn btn-primary"
            >
              返回上一页
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // 版本未找到
  if (!currentVersion) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">版本未找到</h2>
            <p className="text-gray-600 mb-4">
              无法找到版本 {version} 的相关信息
            </p>
            <div className="mt-4 text-sm text-gray-500">
              可用版本: {versions.map(v => v.version).join(', ')}
            </div>
            <button
              onClick={() => router.back()}
              className="btn btn-primary mt-4"
            >
              返回上一页
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧时间线 */}
          <div className="col-span-3">
            <VersionTimeline 
              versions={versions}
              currentVersion={version as string}
              productId={id as string}
            />
          </div>
          
          {/* 右侧版本详情 */}
          <div className="col-span-9">
            <VersionDetail version={currentVersion} />
          </div>
        </div>
      </div>
    </Layout>
  );
} 