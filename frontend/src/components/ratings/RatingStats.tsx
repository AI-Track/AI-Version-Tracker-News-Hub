import { Star } from 'lucide-react';
import { RatingStars } from './RatingStars';

interface RatingStatsProps {
  ratings: {
    average: number;
    total: number;
    distribution: Record<number, number>;
  };
}

export function RatingStats({ ratings }: RatingStatsProps) {
  const { average, total, distribution } = ratings;
  const maxCount = Math.max(...Object.values(distribution));

  return (
    <div className="space-y-4">
      {/* 平均评分 */}
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold">{average.toFixed(1)}</div>
        <div>
          <RatingStars value={average} readonly size="lg" />
          <div className="text-sm text-muted-foreground mt-1">
            {total} 个评分
          </div>
        </div>
      </div>

      {/* 评分分布 */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-16">
                <span>{star}</span>
                <Star className="w-4 h-4" />
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="w-16 text-sm text-muted-foreground">
                {percentage.toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 