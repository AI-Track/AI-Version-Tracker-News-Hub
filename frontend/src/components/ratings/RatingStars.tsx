import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function RatingStars({
  value,
  onChange,
  readonly = false,
  size = 'md'
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const displayValue = hoverValue ?? value;

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={cn(
            'focus:outline-none',
            !readonly && 'cursor-pointer hover:scale-110 transition-transform'
          )}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(null)}
          onClick={() => !readonly && onChange?.(star)}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= displayValue
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  );
} 