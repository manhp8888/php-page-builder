
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Activity } from '@/components/ActivityFormModal';

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

export const useActivitiesData = (user: any, userRole: string | null) => {
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

  const isRegistered = (activityId: string) => {
    return myRegistrations.includes(activityId);
  };

  return {
    activities,
    isLoading,
    myRegistrations,
    isRegistered
  };
};
