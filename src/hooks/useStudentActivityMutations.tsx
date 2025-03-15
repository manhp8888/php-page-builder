
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Activity } from '@/components/ActivityFormModal';

export const useStudentActivityMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const registerActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const { data, error } = await supabase
        .from('student_registrations')
        .insert({
          activity_id: activityId,
          student_id: userId!,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
      toast.success('Đã đăng ký hoạt động thành công');
    },
    onError: (error: any) => {
      console.error('Error registering for activity:', error);
      if (error.code === '23505') {
        toast.error('Bạn đã đăng ký hoạt động này rồi');
      } else {
        toast.error('Không thể đăng ký hoạt động');
      }
    }
  });
  
  const evaluateActivityMutation = useMutation({
    mutationFn: async ({ activityId, rating, comment }: { activityId: string, rating: number, comment: string }) => {
      type AddActivityEvaluationParams = {
        p_activity_id: string;
        p_student_id: string;
        p_rating: number;
        p_comment: string;
      };
      
      const { error } = await supabase
        .rpc<any, AddActivityEvaluationParams>('add_activity_evaluation', {
          p_activity_id: activityId,
          p_student_id: userId!,
          p_rating: rating,
          p_comment: comment
        });
        
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Đã gửi đánh giá thành công');
    },
    onError: (error: any) => {
      console.error('Error evaluating activity:', error);
      if (error.code === '23505') {
        toast.error('Bạn đã đánh giá hoạt động này rồi');
      } else {
        toast.error('Không thể gửi đánh giá: ' + error.message);
      }
    }
  });

  return {
    registerActivityMutation,
    evaluateActivityMutation
  };
};
