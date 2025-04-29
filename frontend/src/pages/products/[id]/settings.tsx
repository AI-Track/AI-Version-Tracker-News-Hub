import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';
import { NotificationPreferences } from '@/components/subscription/NotificationPreferences';
import { useSubscriptionStatus, useSubscription } from '@/hooks/useSubscription';

export default function ProductSettingsPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const { data: subscriptionStatus } = useSubscriptionStatus(id as string);
  const { updatePreferences, isProcessing } = useSubscription(id as string);

  if (!subscriptionStatus?.isSubscribed) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">未订阅</h1>
            <p className="text-muted-foreground mb-8">
              你需要先订阅产品才能设置通知偏好。
            </p>
            <button
              onClick={() => router.push(`/products/${id}`)}
              className="text-primary hover:underline"
            >
              返回产品页面
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">通知设置</h1>
          
          {subscriptionStatus?.preferences && (
            <div className="bg-card rounded-lg p-6">
              <NotificationPreferences
                preferences={subscriptionStatus.preferences}
                onUpdate={updatePreferences}
                isUpdating={isProcessing}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 