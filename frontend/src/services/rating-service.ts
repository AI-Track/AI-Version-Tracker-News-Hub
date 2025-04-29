import { ApiService, ApiResponse } from '@/lib/api-client';
import { ProductRating } from '@/types/product';

export class RatingService extends ApiService {
  constructor() {
    super('/ratings');
  }

  // 提交评分
  async submitRating(
    productId: string,
    data: {
      rating: number;
      comment: string;
    }
  ): Promise<ApiResponse<ProductRating>> {
    return this.client.post(`/products/${productId}/ratings`, { data });
  }

  // 获取产品评分列表
  async getProductRatings(productId: string): Promise<ApiResponse<ProductRating[]>> {
    return this.client.get(`/products/${productId}/ratings`);
  }

  // 获取产品评分统计
  async getRatingStats(
    productId: string
  ): Promise<ApiResponse<{
    average: number;
    total: number;
    distribution: Record<number, number>;
  }>> {
    return this.client.get(`/products/${productId}/ratings/stats`);
  }
}

export const ratingService = new RatingService(); 