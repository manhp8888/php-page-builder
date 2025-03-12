
import { useState } from 'react';
import { Plus } from 'lucide-react';
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import ActivityCard from '@/components/ActivityCard';
import ActivityFormModal, { Activity } from '@/components/ActivityFormModal';
import { toast } from 'sonner';

const Activities = () => {
  const [userName] = useState('Nguyễn Văn A');
  const [activities, setActivities] = useState<Activity[]>([
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
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  
  const handleAddActivity = () => {
    setModalMode('add');
    setSelectedActivity(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditActivity = (id: number) => {
    const activityToEdit = activities.find(activity => activity.id === id);
    if (activityToEdit) {
      setSelectedActivity(activityToEdit);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };
  
  const handleDeleteActivity = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hoạt động này không?')) {
      setActivities(activities.filter(activity => activity.id !== id));
      toast.success('Đã xóa hoạt động thành công');
    }
  };
  
  const handleSaveActivity = (formData: Omit<Activity, 'id'> & { id?: number }) => {
    if (modalMode === 'add') {
      // Generate a new ID (in a real app, this would come from the backend)
      const newId = Math.max(0, ...activities.map(a => a.id)) + 1;
      const newActivity = { ...formData, id: newId };
      setActivities([...activities, newActivity]);
      toast.success('Đã thêm hoạt động thành công');
    } else {
      // Edit existing activity
      setActivities(activities.map(activity => 
        activity.id === formData.id ? { ...formData as Activity } : activity
      ));
      toast.success('Đã cập nhật hoạt động thành công');
    }
    
    setIsModalOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      
      <div className="flex-1 ml-64 p-8 animate-fade-in">
        <UserHeader userName={userName} />
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Quản lý hoạt động ngoại khóa</h1>
          
          <button 
            onClick={handleAddActivity} 
            className="inline-flex items-center justify-center px-4 py-2 bg-system-green text-white rounded-md hover:bg-system-greenHover transition-colors gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm hoạt động</span>
          </button>
        </div>
        
        {activities.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg bg-background">
            <p className="text-muted-foreground">Chưa có hoạt động nào. Nhấn "Thêm hoạt động" để bắt đầu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                date={activity.date}
                location={activity.location}
                participants={activity.participants}
                onEdit={() => handleEditActivity(activity.id)}
                onDelete={() => handleDeleteActivity(activity.id)}
                className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              />
            ))}
          </div>
        )}
        
        <ActivityFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveActivity}
          activity={selectedActivity}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default Activities;
