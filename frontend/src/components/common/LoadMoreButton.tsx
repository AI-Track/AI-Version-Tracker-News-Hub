import { useTranslation } from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const LoadMoreButton = ({
  onClick,
  loading = false,
  disabled = false,
  className = '',
}: LoadMoreButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full max-w-sm mx-auto py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {t('news.loadMore')}
    </button>
  );
}; 