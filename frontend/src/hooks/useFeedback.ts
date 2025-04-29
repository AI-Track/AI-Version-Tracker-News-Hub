import { useState } from 'react';
import { useApi } from './useApi';
import { ProductFeedback } from '@/types/product';
import { feedbackService } from '@/services/feedback-service';

export function useProductFeedback(productId: string) {
  return useApi<ProductFeedback[]>(
    `/products/${productId}/feedback`,
    'GET',
    { enabled: !!productId }
  );
}

export function useSubmitFeedback(productId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async (data: {
    title: string;
    description: string;
    type: 'bug' | 'feature' | 'improvement';
  }) => {
    try {
      setIsSubmitting(true);
      await feedbackService.submitFeedback(productId, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitFeedback, isSubmitting };
}

export function useVoteFeedback() {
  const [isVoting, setIsVoting] = useState(false);

  const voteFeedback = async (feedbackId: string, type: 'up' | 'down') => {
    try {
      setIsVoting(true);
      await feedbackService.voteFeedback(feedbackId, type);
    } finally {
      setIsVoting(false);
    }
  };

  return { voteFeedback, isVoting };
} 