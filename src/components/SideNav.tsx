
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText,
  User,
  LogOut,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';

const SideNav = () => {
  const location = useLocation();
  const { userRole, signOut, userName } = useAuth();
  
  console.log('SideNav - Current User Role:', userRole);
  
  const isActive = (path: string) => location.pathname === path;
  
  // Shared menu items for both teachers and students
  const sharedMenuItems = [
    {
      title: 'Hoạt động ngoại khóa',
      path: '/activities',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: 'Tài khoản',
      path: '/profile',
      icon: <User className="h-5 w-5" />
    },
  ];
  
  // Teacher-only menu items
  const teacherMenuItems = [
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
  ];
  
  // Student-only menu items
  const studentMenuItems = [
    {
      title: 'Đăng ký của tôi',
      path: '/my-registrations',
      icon: <ClipboardList className="h-5 w-5" />
    },
  ];
  
  // Determine which items to display based on role
  const menuItems = [
    ...sharedMenuItems,
    ...(userRole === 'teacher' ? teacherMenuItems : []),
    ...(userRole === 'student' ? studentMenuItems : []),
  ];

  return (
    <div className="w-64 h-screen bg-system-blue flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-white">Hệ thống</h1>
        <p className="text-sm text-white/80">
          {userRole === 'teacher' ? 'Giáo viên' : userRole === 'student' ? 'Học sinh' : 'Người dùng'}
        </p>
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
        <button onClick={signOut} className="sidebar-item w-full text-left">
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default SideNav;
