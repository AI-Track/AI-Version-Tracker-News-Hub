import { useRouter } from 'next/router';
import { MainLayout } from '@/components/layout/main/MainLayout';
import { ProductDetail } from '@/components/products/ProductDetail';
import { RatingStats } from '@/components/ratings/RatingStats';
import { RatingForm } from '@/components/ratings/RatingForm';
import { SubscribeButton } from '@/components/subscription/SubscribeButton';
import { useProductDetail } from '@/hooks/useProducts';
import { useRatingStats, useSubmitRating } from '@/hooks/useRating';
import { useSubscriptionStatus, useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, History } from 'lucide-react';
import { VersionTimeline } from '@/components/versions/VersionTimeline';
import { useProductVersions } from '@/hooks/useProducts';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: product } = useProductDetail(id as string);
  const { data: ratingStats } = useRatingStats(id as string);
  const { data: subscriptionStatus } = useSubscriptionStatus(id as string);
  const { subscribe, unsubscribe, isProcessing } = useSubscription(id as string);
  const { submitRating, isSubmitting } = useSubmitRating(id as string);
  const { data: versions } = useProductVersions(id as string);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* 主要内容 */}
          <div className="col-span-8">
            {product && <ProductDetail product={product} />}

            {/* 版本历史 */}
            {versions && versions.length > 0 && (
              <div className="mt-8 bg-card rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">版本历史</h2>
                <VersionTimeline
                  versions={versions}
                  productId={id as string}
                />
              </div>
            )}

            {/* 评分表单 */}
            <div className="mt-8 bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">评价产品</h2>
              <RatingForm
                onSubmit={submitRating}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="col-span-4 space-y-6">
            {/* 订阅按钮 */}
            <SubscribeButton
              productId={id as string}
              isSubscribed={subscriptionStatus?.isSubscribed || false}
              onSubscribe={subscribe}
              onUnsubscribe={unsubscribe}
              isProcessing={isProcessing}
            />

            {/* 评分统计 */}
            {ratingStats && (
              <div className="bg-card rounded-lg p-6">
                <h3 className="font-semibold mb-4">用户评价</h3>
                <RatingStats ratings={ratingStats} />
              </div>
            )}

            {/* 快速链接 */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/products/${id}/versions/${versions?.[0]?.version}`)}
              >
                <History className="w-4 h-4 mr-2" />
                版本历史
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/products/${id}/feedback`)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                提供反馈
              </Button>
              
              {subscriptionStatus?.isSubscribed && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/products/${id}/settings`)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  通知设置
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}