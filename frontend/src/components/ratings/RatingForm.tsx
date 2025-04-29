import { useState } from 'react';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RatingFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function RatingForm({ onSubmit, isSubmitting }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) return;
    
    await onSubmit(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">评分</label>
        <RatingStars
          value={rating}
          onChange={setRating}
          size="lg"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">评论</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="分享你的使用体验..."
          rows={4}
        />
      </div>

      <Button
        type="submit"
        disabled={rating === 0 || isSubmitting}
      >
        {isSubmitting ? '提交中...' : '提交评价'}
      </Button>
    </form>
  );
} 