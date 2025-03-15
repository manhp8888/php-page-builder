
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Activity } from '@/components/ActivityFormModal';

export const useActivityMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const addActivityMutation = useMutation({
    mutationFn: async (formData: Omit<Activity, 'id'>) => {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          title: formData.title,
          date: formData.date,
          location: formData.location,
          participants: formData.participants,
          user_id: userId!
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Đã thêm hoạt động thành công');
    },
    onError: (error) => {
      console.error('Error adding activity:', error);
      toast.error('Không thể thêm hoạt động');
    }
  });
  
  const updateActivityMutation = useMutation({
    mutationFn: async (formData: Activity) => {
      const { data, error } = await supabase
        .from('activities')
        .update({
          title: formData.title,
          date: formData.date,
          location: formData.location,
          participants: formData.participants
        })
        .eq('id', formData.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Đã cập nhật hoạt động thành công');
    },
    onError: (error) => {
      console.error('Error updating activity:', error);
      toast.error('Không thể cập nhật hoạt động');
    }
  });
  
  const deleteActivityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Đã xóa hoạt động thành công');
    },
    onError: (error) => {
      console.error('Error deleting activity:', error);
      toast.error('Không thể xóa hoạt động');
    }
  });

  return {
    addActivityMutation,
    updateActivityMutation,
    deleteActivityMutation
  };
};
