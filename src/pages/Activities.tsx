
import { useState } from 'react';
import { Plus } from 'lucide-react';
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import ActivityFormModal, { Activity } from '@/components/ActivityFormModal';
import EvaluationModal from '@/components/EvaluationModal';
import { useAuth } from '@/components/AuthProvider';
import ActivityList from '@/components/ActivityList';
import { useActivitiesData } from '@/hooks/useActivitiesData';
import { useActivityMutations } from '@/hooks/useActivityMutations';
import { useStudentActivityMutations } from '@/hooks/useStudentActivityMutations';

const Activities = () => {
  const { user, userRole } = useAuth();
  
  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [selectedActivityForEvaluation, setSelectedActivityForEvaluation] = useState<Activity | null>(null);
  
  // Custom hooks for data and mutations
  const { activities, isLoading, isRegistered } = useActivitiesData();
  const { addActivityMutation, updateActivityMutation, deleteActivityMutation } = useActivityMutations(user?.id);
  const { registerActivityMutation, evaluateActivityMutation } = useStudentActivityMutations(user?.id);
  
  // Handler functions
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
    evaluateActivityMutation.mutate({ 
      activityId, 
      rating, 
      comment 
    });
    setIsEvaluationModalOpen(false);
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
          <ActivityList
            activities={activities}
            isRegistered={isRegistered}
            userRole={userRole}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
            onRegister={handleRegisterActivity}
            onEvaluate={handleEvaluateActivity}
          />
        )}
        
        {isModalOpen && (
          <ActivityFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveActivity}
            activity={selectedActivity}
            mode={modalMode}
          />
        )}
        
        {selectedActivityForEvaluation && isEvaluationModalOpen && (
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
