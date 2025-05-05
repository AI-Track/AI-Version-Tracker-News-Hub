import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { FeedbackList } from '@/components/feedback/FeedbackList';
import { useProductFeedback } from '@/hooks/useFeedback';
import { useSubmitFeedback } from '@/hooks/useFeedback';
import { useVoteFeedback } from '@/hooks/useFeedback';

export default function ProductFeedbackPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const { data: feedbackList, refetch } = useProductFeedback(id as string);
  const { submitFeedback, isSubmitting } = useSubmitFeedback(id as string);
  const { voteFeedback, isVoting } = useVoteFeedback();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">产品反馈</h1>
          
          <div className="space-y-8">
            {/* 反馈表单 */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">提交反馈</h2>
              <FeedbackForm
                productId={id as string}
                onSubmit={async (data) => {
                  await submitFeedback(data);
                  refetch();
                }}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* 反馈列表 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">所有反馈</h2>
              <FeedbackList
                feedback={feedbackList || []}
                onVote={voteFeedback}
                isVoting={isVoting}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 