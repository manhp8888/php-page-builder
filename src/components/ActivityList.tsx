
import { Activity } from '@/components/ActivityFormModal';
import ActivityItem from '@/components/ActivityItem';

interface ActivityListProps {
  activities: Activity[];
  isRegistered: (activityId: string) => boolean;
  userRole: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRegister: (id: string) => void;
  onEvaluate: (activity: Activity) => void;
}

const ActivityList = ({
  activities,
  isRegistered,
  userRole,
  onEdit,
  onDelete,
  onRegister,
  onEvaluate
}: ActivityListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isRegistered={isRegistered(activity.id)}
          userRole={userRole}
          onEdit={onEdit}
          onDelete={onDelete}
          onRegister={onRegister}
          onEvaluate={onEvaluate}
        />
      ))}
    </div>
  );
};

export default ActivityList;
