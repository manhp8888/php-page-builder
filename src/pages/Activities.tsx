
import { useState } from 'react';
import { Plus } from 'lucide-react';
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import ActivityCard from '@/components/ActivityCard';
import { toast } from 'sonner';

const Activities = () => {
  const [userName] = useState('Nguyễn Văn A');
  
  const activities = [
    {
      id: 1,
      title: 'Thi đấu bóng đá',
      date: '02/03/2025',
      location: 'Sân trường',
      participants: 20
    },
    {
      id: 2,
      title: 'Dã ngoại',
      date: '01/03/2025',
      location: 'Công viên',
      participants: 15
    }
  ];
  
  const handleAddActivity = () => {
    toast('Tính năng đang phát triển');
  };
  
  const handleEditActivity = (id: number) => {
    toast(`Chỉnh sửa hoạt động ID: ${id}`);
  };
  
  const handleDeleteActivity = (id: number) => {
    toast.error(`Xóa hoạt động ID: ${id}`);
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      
      <div className="flex-1 ml-64 p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Quản lý hoạt động ngoại khóa</h1>
          
          <button onClick={handleAddActivity} className="btn-success flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Thêm hoạt động</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              title={activity.title}
              date={activity.date}
              location={activity.location}
              participants={activity.participants}
              onEdit={() => handleEditActivity(activity.id)}
              onDelete={() => handleDeleteActivity(activity.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
