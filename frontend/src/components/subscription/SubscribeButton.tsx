import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';

interface SubscribeButtonProps {
  productId: string;
  isSubscribed: boolean;
  onSubscribe: () => Promise<void>;
  onUnsubscribe: () => Promise<void>;
  isProcessing?: boolean;
}

export function SubscribeButton({
  productId,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  isProcessing
}: SubscribeButtonProps) {
  const handleClick = async () => {
    if (isSubscribed) {
      await onUnsubscribe();
    } else {
      await onSubscribe();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isProcessing}
      variant={isSubscribed ? 'outline' : 'default'}
      className="w-full"
    >
      {isProcessing ? (
        '处理中...'
      ) : (
        <>
          {isSubscribed ? (
            <>
              <BellOff className="w-4 h-4 mr-2" />
              取消订阅
            </>
          ) : (
            <>
              <Bell className="w-4 h-4 mr-2" />
              订阅更新
            </>
          )}
        </>
      )}
    </Button>
  );
} 