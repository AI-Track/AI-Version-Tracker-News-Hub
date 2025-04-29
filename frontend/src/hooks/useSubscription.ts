import { useState } from 'react';
import { useApi } from './useApi';
import { Subscription } from '@/types/product';
import { subscriptionService } from '@/services/subscription-service';

export function useSubscriptionStatus(productId: string) {
  return useApi<{
    isSubscribed: boolean;
    preferences?: Subscription['preferences'];
  }>(
    `/products/${productId}/subscribe/status`,
    'GET',
    { enabled: !!productId }
  );
}

export function useSubscription(productId: string) {
  const [isProcessing, setIsProcessing] = useState(false);

  const subscribe = async () => {
    try {
      setIsProcessing(true);
      await subscriptionService.subscribe(productId);
    } finally {
      setIsProcessing(false);
    }
  };

  const unsubscribe = async () => {
    try {
      setIsProcessing(true);
      await subscriptionService.unsubscribe(productId);
    } finally {
      setIsProcessing(false);
    }
  };

  const updatePreferences = async (preferences: Subscription['preferences']) => {
    try {
      setIsProcessing(true);
      await subscriptionService.updatePreferences(productId, preferences);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    subscribe,
    unsubscribe,
    updatePreferences,
    isProcessing
  };
} 