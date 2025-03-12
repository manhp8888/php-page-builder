
import { Calendar, MapPin, Users, Edit, Trash } from 'lucide-react';
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
    <div className={cn("bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow", className)}>
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
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          {onEdit && (
            <button 
              onClick={onEdit} 
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-sm bg-system-blue text-white rounded hover:bg-system-blueHover transition-colors"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Sửa</span>
            </button>
          )}
          
          {onDelete && (
            <button 
              onClick={onDelete} 
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-sm bg-system-red text-white rounded hover:bg-system-redHover transition-colors"
            >
              <Trash className="h-3.5 w-3.5" />
              <span>Xóa</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
