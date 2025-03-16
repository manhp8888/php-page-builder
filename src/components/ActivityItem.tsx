
import { Activity } from '@/components/ActivityFormModal';
import ActivityCard from '@/components/ActivityCard';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface ActivityItemProps {
  activity: Activity;
  isRegistered: boolean;
  userRole: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRegister: (id: string) => void;
  onEvaluate: (activity: Activity) => void;
}

const ActivityItem = ({
  activity,
  isRegistered,
  userRole,
  onEdit,
  onDelete,
  onRegister,
  onEvaluate
}: ActivityItemProps) => {
  console.log('ActivityItem - Current User Role:', userRole);
  
  return (
    <div className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <ActivityCard
        title={activity.title}
        date={activity.date}
        location={activity.location}
        participants={activity.participants}
        onEdit={userRole === 'teacher' ? () => onEdit(activity.id) : undefined}
        onDelete={userRole === 'teacher' ? () => onDelete(activity.id) : undefined}
      />
      
      {userRole === 'student' && (
        <div className="mt-4 pt-4 border-t border-border flex gap-2">
          <Button 
            onClick={() => onRegister(activity.id)}
            variant={isRegistered ? "outline" : "default"}
            className="flex-1"
            disabled={isRegistered}
          >
            {isRegistered ? 'Đã đăng ký' : 'Đăng ký tham gia'}
          </Button>
          
          <Button
            onClick={() => onEvaluate(activity)}
            variant="outline"
            className="flex items-center gap-1"
          >
            <Star className="h-4 w-4" />
            <span>Đánh giá</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivityItem;
