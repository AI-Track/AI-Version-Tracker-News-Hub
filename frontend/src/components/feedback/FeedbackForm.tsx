import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ProductFeedback } from '@/types/product';

interface FeedbackFormProps {
  productId: string;
  onSubmit: (feedback: Omit<ProductFeedback, 'id' | 'userId' | 'votes' | 'createdAt' | 'status'>) => Promise<void>;
  isSubmitting?: boolean;
}

const feedbackTypes = [
  { label: '功能建议', value: 'feature' },
  { label: '问题报告', value: 'bug' },
  { label: '改进建议', value: 'improvement' },
] satisfies Array<{ label: string; value: 'feature' | 'bug' | 'improvement' }>;

export function FeedbackForm({ productId, onSubmit, isSubmitting }: FeedbackFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'bug' | 'feature' | 'improvement'>('feature');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description) return;
    
    await onSubmit({
      productId,
      title,
      description,
      type,
    });

    setTitle('');
    setDescription('');
    setType('feature');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="简短描述你的反馈"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">类型</label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as typeof type)}
          options={feedbackTypes}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">详细描述</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="详细描述你的想法..."
          rows={6}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !title || !description}
      >
        {isSubmitting ? '提交中...' : '提交反馈'}
      </Button>
    </form>
  );
} 