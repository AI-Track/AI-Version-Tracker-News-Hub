import { useState } from 'react';
import { useApi } from './useApi';
import { ProductRating } from '@/types/product';
import { ratingService } from '@/services/rating-service';

export function useRatingStats(productId: string) {
  return useApi<{
    average: number;
    total: number;
    distribution: Record<number, number>;
  }>(
    `/products/${productId}/ratings/stats`,
    'GET',
    { enabled: !!productId }
  );
}

export function useProductRatings(productId: string) {
  return useApi<ProductRating[]>(
    `/products/${productId}/ratings`,
    'GET',
    { enabled: !!productId }
  );
}

export function useSubmitRating(productId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRating = async (rating: number, comment: string) => {
    try {
      setIsSubmitting(true);
      await ratingService.submitRating(productId, { rating, comment });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitRating, isSubmitting };
} 