
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserHeaderProps {
  userName: string;
  userRole?: string;
  className?: string;
}

const UserHeader = ({ userName, userRole = 'Giáo viên', className = '' }: UserHeaderProps) => {
  return (
    <div className={`flex items-center justify-between border-b border-border pb-4 mb-6 ${className}`}>
      <h1 className="text-2xl font-semibold">Chào mừng, {userName}!</h1>
      
      <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="flex flex-col items-end">
          <span className="font-medium">{userName}</span>
          <span className="text-sm text-muted-foreground">{userRole}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
          <User className="h-5 w-5" />
        </div>
      </Link>
    </div>
  );
};

export default UserHeader;
