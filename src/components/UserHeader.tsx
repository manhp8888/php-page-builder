
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface UserHeaderProps {
  className?: string;
  userName?: string;
  userRole?: string;
}

const UserHeader = ({ className = '', userName: propUserName, userRole: propUserRole }: UserHeaderProps) => {
  const auth = useAuth();
  
  // Use props if provided, otherwise use values from auth context
  const displayName = propUserName || auth.userName || 'Người dùng';
  const userRole = propUserRole || auth.userRole;
  const displayRole = userRole === 'teacher' ? 'Giáo viên' : 'Học sinh';

  return (
    <div className={`flex items-center justify-between border-b border-border pb-4 mb-6 ${className}`}>
      <h1 className="text-2xl font-semibold">Chào mừng, {displayName}!</h1>
      
      <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="flex flex-col items-end">
          <span className="font-medium">{displayName}</span>
          <span className="text-sm text-muted-foreground">{displayRole}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
          <User className="h-5 w-5" />
        </div>
      </Link>
    </div>
  );
};

export default UserHeader;
