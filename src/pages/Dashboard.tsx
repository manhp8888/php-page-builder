
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import ActivityCard from '@/components/ActivityCard';
import NotificationCard from '@/components/NotificationCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

const Dashboard = () => {
  const { userRole } = useAuth();
  
  // Fetch upcoming activities
  const { data: upcomingActivities = [], isLoading: isLoadingActivities } = useQuery({
    queryKey: ['upcomingActivities'],
    queryFn: async () => {
      const today = new Date().toISOString();
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: true })
        .limit(4);
        
      if (error) {
        toast.error('Không thể tải hoạt động: ' + error.message);
        return [];
      }
      
      return data.map(activity => ({
        id: activity.id,
        title: activity.title,
        date: activity.date,
        location: activity.location,
        participants: activity.participants || 0
      }));
    }
  });
  
  // Fetch student registrations if user is a student
  const { data: myRegistrations = [] } = useQuery({
    queryKey: ['myRegistrations'],
    queryFn: async () => {
      if (userRole !== 'student') return [];
      
      const { data, error } = await supabase
        .from('student_registrations')
        .select('activity_id, status, activities(id, title, date, location, participants)')
        .eq('student_id', supabase.auth.getUser().then(res => res.data.user?.id))
        .order('registration_date', { ascending: false });
        
      if (error) {
        toast.error('Không thể tải đăng ký: ' + error.message);
        return [];
      }
      
      return data.map(reg => ({
        id: reg.activities.id,
        title: reg.activities.title,
        date: reg.activities.date,
        location: reg.activities.location,
        participants: reg.activities.participants || 0,
        status: reg.status
      }));
    },
    enabled: userRole === 'student'
  });
  
  // Placeholder notifications
  const notifications = [
    {
      type: 'event' as const,
      content: 'Đã cập nhật điểm cho Thi đấu bóng đá.'
    },
    {
      type: 'alert' as const,
      content: 'Bảo trì hệ thống: 20/10/2025.'
    }
  ];
  
  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      
      <div className="flex-1 ml-64 p-8 animate-fade-in">
        <UserHeader />
        
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h2 className="text-xl font-medium mb-4">Hoạt động sắp tới</h2>
            
            {isLoadingActivities ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground">Đang tải hoạt động...</p>
              </div>
            ) : upcomingActivities.length === 0 ? (
              <div className="bg-white rounded-xl p-6 border border-border card-shadow">
                <p className="text-muted-foreground text-center py-6">
                  Chưa có hoạt động nào sắp diễn ra
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5">
                {upcomingActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    title={activity.title}
                    date={activity.date}
                    location={activity.location}
                    participants={activity.participants}
                  />
                ))}
              </div>
            )}
            
            {userRole === 'student' && (
              <>
                <h2 className="text-xl font-medium mt-8 mb-4">Đăng ký của tôi</h2>
                {myRegistrations.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 border border-border card-shadow">
                    <p className="text-muted-foreground text-center py-6">
                      Bạn chưa đăng ký hoạt động nào
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-5">
                    {myRegistrations.map((reg) => (
                      <ActivityCard
                        key={reg.id}
                        title={reg.title}
                        date={reg.date}
                        location={reg.location}
                        participants={reg.participants}
                        className={`border-l-4 ${
                          reg.status === 'approved' 
                            ? 'border-l-green-500' 
                            : reg.status === 'rejected'
                            ? 'border-l-red-500'
                            : 'border-l-yellow-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-4">Thông báo</h2>
            <div className="bg-white rounded-xl border border-border card-shadow overflow-hidden">
              {notifications.map((notification, index) => (
                <NotificationCard
                  key={index}
                  type={notification.type}
                  content={notification.content}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
