import { ProductFeedback } from '@/types/product';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackListProps {
  feedback: ProductFeedback[];
  onVote?: (feedbackId: string, type: 'up' | 'down') => Promise<void>;
  isVoting?: boolean;
}

const statusColors = {
  'open': 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
  'declined': 'bg-red-100 text-red-800',
} as const;

const typeLabels = {
  'bug': '问题报告',
  'feature': '功能建议',
  'improvement': '改进建议',
} as const;

export function FeedbackList({ feedback, onVote, isVoting }: FeedbackListProps) {
  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <div key={item.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                'px-2 py-1 text-xs rounded-full',
                statusColors[item.status]
              )}>
                {item.status}
              </span>
              <span className="text-xs text-muted-foreground">
                {typeLabels[item.type]}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
            {onVote && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onVote(item.id, 'up')}
                  disabled={isVoting}
                  className={cn(
                    'flex items-center gap-1 text-sm',
                    'hover:text-primary transition-colors'
                  )}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{item.votes.up}</span>
                </button>
                <button
                  onClick={() => onVote(item.id, 'down')}
                  disabled={isVoting}
                  className={cn(
                    'flex items-center gap-1 text-sm',
                    'hover:text-primary transition-colors'
                  )}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{item.votes.down}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 