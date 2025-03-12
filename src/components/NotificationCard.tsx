
import { Bell, Calendar, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationType = 'info' | 'event' | 'alert';

interface NotificationCardProps {
  type: NotificationType;
  content: string;
  className?: string;
}

const NotificationCard = ({ type, content, className = '' }: NotificationCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-system-blue" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-system-green" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-system-orange" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("notification-card", className)}>
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <p className="text-sm">{content}</p>
    </div>
  );
};

export default NotificationCard;
