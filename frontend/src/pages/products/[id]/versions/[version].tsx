import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { VersionDetail } from '@/components/versions/VersionDetail';
import {   } from '@/components/versions/VersionTimeline';
import { useProductVersions } from '@/hooks/useProducts';

export default function VersionDetailPage() {
  const router = useRouter();
  const { id, version } = router.query;
  
  const { data: versions, isLoading } = useProductVersions(id as string);
  const currentVersion = versions?.find(v => v.version === version);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!currentVersion) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          Version not found
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
              versions={versions || []}
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