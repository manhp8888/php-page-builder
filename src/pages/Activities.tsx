import { useState } from 'react';
import { Plus, Star } from 'lucide-react';
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import ActivityCard from '@/components/ActivityCard';
import ActivityFormModal, { Activity } from '@/components/ActivityFormModal';
import EvaluationModal from '@/components/EvaluationModal';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

interface SupabaseActivity {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number | null;
  user_id: string;
  description: string | null;
  created_at: string;
}

const mapSupabaseActivity = (activity: SupabaseActivity): Activity => ({
  id: activity.id,
  title: activity.title,
  date: activity.date,
  location: activity.location,
  participants: activity.participants || 0
});

const Activities = () => {
  const { user, userRole } = useAuth();
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [selectedActivityForEvaluation, setSelectedActivityForEvaluation] = useState<Activity | null>(null);
  
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error('Không thể tải hoạt động: ' + error.message);
        return [];
      }
      
      return data.map(mapSupabaseActivity);
    },
    enabled: !!user
  });
  
  const addActivityMutation = useMutation({
    mutationFn: async (formData: Omit<Activity, 'id'>) => {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          title: formData.title,
          date: formData.date,
          location: formData.location,
          participants: formData.participants,
          user_id: user!.id
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

  const registerActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const { data, error } = await supabase
        .from('student_registrations')
        .insert({
          activity_id: activityId,
          student_id: user!.id,
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
      const { error } = await supabase
        .rpc('add_activity_evaluation', {
          p_activity_id: activityId,
          p_student_id: user!.id,
          p_rating: rating,
          p_comment: comment
        });
        
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Đã gửi đánh giá thành công');
      setIsEvaluationModalOpen(false);
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
  
  const { data: myRegistrations = [] } = useQuery({
    queryKey: ['myRegistrations'],
    queryFn: async () => {
      if (userRole !== 'student') return [];
      
      const { data, error } = await supabase
        .from('student_registrations')
        .select('activity_id')
        .eq('student_id', user!.id);
        
      if (error) {
        toast.error('Không thể tải đăng ký: ' + error.message);
        return [];
      }
      
      return data.map(reg => reg.activity_id);
    },
    enabled: !!user && userRole === 'student'
  });
  
  const handleAddActivity = () => {
    setModalMode('add');
    setSelectedActivity(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditActivity = (id: string) => {
    const activityToEdit = activities.find(activity => activity.id === id);
    if (activityToEdit) {
      setSelectedActivity(activityToEdit);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };
  
  const handleDeleteActivity = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hoạt động này không?')) {
      deleteActivityMutation.mutate(id);
    }
  };
  
  const handleSaveActivity = (formData: Omit<Activity, 'id'> & { id?: string }) => {
    if (modalMode === 'add') {
      addActivityMutation.mutate(formData);
    } else {
      if (formData.id) {
        updateActivityMutation.mutate(formData as Activity);
      }
    }
    
    setIsModalOpen(false);
  };

  const handleRegisterActivity = (id: string) => {
    registerActivityMutation.mutate(id);
  };
  
  const handleEvaluateActivity = (activity: Activity) => {
    setSelectedActivityForEvaluation(activity);
    setIsEvaluationModalOpen(true);
  };
  
  const handleSaveEvaluation = (activityId: string, rating: number, comment: string) => {
    evaluateActivityMutation.mutate({ activityId, rating, comment });
  };
  
  const isRegistered = (activityId: string) => {
    return myRegistrations.includes(activityId);
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      
      <div className="flex-1 ml-64 p-8 animate-fade-in">
        <UserHeader />
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Quản lý hoạt động ngoại khóa</h1>
          
          {userRole === 'teacher' && (
            <button 
              onClick={handleAddActivity} 
              className="inline-flex items-center justify-center px-4 py-2 bg-system-green text-white rounded-md hover:bg-system-greenHover transition-colors gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm hoạt động</span>
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Đang tải hoạt động...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg bg-background">
            <p className="text-muted-foreground">
              {userRole === 'teacher' 
                ? "Chưa có hoạt động nào. Nhấn \"Thêm hoạt động\" để bắt đầu."
                : "Chưa có hoạt động nào được tạo."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <ActivityCard
                  title={activity.title}
                  date={activity.date}
                  location={activity.location}
                  participants={activity.participants}
                  onEdit={userRole === 'teacher' ? () => handleEditActivity(activity.id) : undefined}
                  onDelete={userRole === 'teacher' ? () => handleDeleteActivity(activity.id) : undefined}
                />
                
                {userRole === 'student' && (
                  <div className="mt-4 pt-4 border-t border-border flex gap-2">
                    <Button 
                      onClick={() => handleRegisterActivity(activity.id)}
                      variant={isRegistered(activity.id) ? "outline" : "default"}
                      className="flex-1"
                      disabled={isRegistered(activity.id)}
                    >
                      {isRegistered(activity.id) ? 'Đã đăng ký' : 'Đăng ký tham gia'}
                    </Button>
                    
                    <Button
                      onClick={() => handleEvaluateActivity(activity)}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Star className="h-4 w-4" />
                      <span>Đánh giá</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {userRole === 'teacher' && (
          <ActivityFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveActivity}
            activity={selectedActivity}
            mode={modalMode}
          />
        )}
        
        {selectedActivityForEvaluation && (
          <EvaluationModal
            activityId={selectedActivityForEvaluation.id}
            activityTitle={selectedActivityForEvaluation.title}
            isOpen={isEvaluationModalOpen}
            onClose={() => setIsEvaluationModalOpen(false)}
            onSave={handleSaveEvaluation}
          />
        )}
      </div>
    </div>
  );
};

export default Activities;
