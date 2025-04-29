import { ApiService, ApiResponse } from '@/lib/api-client';
import { ProductFeedback } from '@/types/product';

export class FeedbackService extends ApiService {
  constructor() {
    super('/feedback');
  }

  // 提交反馈
  async submitFeedback(
    productId: string,
    data: {
      title: string;
      description: string;
      type: 'bug' | 'feature' | 'improvement';
    }
  ): Promise<ApiResponse<ProductFeedback>> {
    return this.client.post(`/products/${productId}/feedback`, { data });
  }

  // 获取产品反馈列表
  async getProductFeedback(productId: string): Promise<ApiResponse<ProductFeedback[]>> {
    return this.client.get(`/products/${productId}/feedback`);
  }

  // 投票
  async voteFeedback(feedbackId: string, type: 'up' | 'down'): Promise<ApiResponse<void>> {
    return this.client.post(`/feedback/${feedbackId}/vote`, { data: { type } });
  }
}

export const feedbackService = new FeedbackService(); 