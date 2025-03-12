
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SideNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    {
      title: 'Hoạt động ngoại khóa',
      path: '/activities',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: 'Học sinh',
      path: '/students',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Báo cáo',
      path: '/reports',
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Tài khoản',
      path: '/profile',
      icon: <User className="h-5 w-5" />
    },
  ];

  return (
    <div className="w-64 h-screen bg-system-blue flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-white">Hệ thống</h1>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <Link 
          to="/dashboard" 
          className={cn(
            "sidebar-item mb-2",
            isActive('/dashboard') ? 'active' : ''
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Tổng quan</span>
        </Link>
        
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={cn(
              "sidebar-item mb-2",
              isActive(item.path) ? 'active' : ''
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <Link to="/login" className="sidebar-item">
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
