
import { Calendar, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  title: string;
  date: string;
  location: string;
  participants: number;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActivityCard = ({
  title,
  date,
  location,
  participants,
  className = '',
  onEdit,
  onDelete
}: ActivityCardProps) => {
  return (
    <div className={cn("activity-card", className)}>
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{participants} học sinh</span>
        </div>
      </div>
      
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2 mt-3">
          {onEdit && (
            <button onClick={onEdit} className="btn-edit">
              <span>Sửa</span>
            </button>
          )}
          
          {onDelete && (
            <button onClick={onDelete} className="btn-delete">
              <span>Xóa</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
