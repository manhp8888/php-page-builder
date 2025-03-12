
import { useState } from 'react';
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import ActivityCard from '@/components/ActivityCard';
import NotificationCard from '@/components/NotificationCard';

const Dashboard = () => {
  const [userName] = useState('Nguyễn Văn A');
  
  const upcomingActivities = [
    {
      title: 'Thi đấu bóng đá',
      date: '15/02/2025',
      location: 'Sân trường',
      participants: 20
    },
    {
      title: 'Dã ngoại',
      date: '01/03/2025',
      location: 'Công viên',
      participants: 15
    }
  ];
  
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
        <UserHeader userName={userName} />
        
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h2 className="text-xl font-medium mb-4">Lịch hoạt động</h2>
            <div className="bg-white rounded-xl p-6 border border-border card-shadow">
              <p className="text-muted-foreground text-center py-6">
                [Lịch hoạt động sẽ được hiển thị ở đây]
              </p>
            </div>
            
            <h2 className="text-xl font-medium mt-8 mb-4">Hoạt động gần đây</h2>
            <div className="grid grid-cols-2 gap-5">
              {upcomingActivities.map((activity, index) => (
                <ActivityCard
                  key={index}
                  title={activity.title}
                  date={activity.date}
                  location={activity.location}
                  participants={activity.participants}
                />
              ))}
            </div>
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
