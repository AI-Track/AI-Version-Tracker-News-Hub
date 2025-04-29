import { ApiService, ApiResponse } from '@/lib/api-client';
import { Subscription } from '@/types/product';

export class SubscriptionService extends ApiService {
  constructor() {
    super('/subscriptions');
  }

  // 订阅产品
  async subscribe(productId: string): Promise<ApiResponse<Subscription>> {
    return this.client.post(`/products/${productId}/subscribe`);
  }

  // 取消订阅
  async unsubscribe(productId: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/products/${productId}/subscribe`);
  }

  // 更新订阅偏好
  async updatePreferences(
    productId: string,
    preferences: Subscription['preferences']
  ): Promise<ApiResponse<Subscription>> {
    return this.client.patch(`/products/${productId}/subscribe/preferences`, {
      data: preferences,
    });
  }

  // 检查订阅状态
  async checkSubscription(
    productId: string
  ): Promise<ApiResponse<{
    isSubscribed: boolean;
    preferences?: Subscription['preferences'];
  }>> {
    return this.client.get(`/products/${productId}/subscribe/status`);
  }
}

export const subscriptionService = new SubscriptionService(); 