
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps = {}) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('Protected Route - Current User Role:', userRole);
    console.log('Protected Route - Allowed Roles:', allowedRoles);
    console.log('Access allowed:', !allowedRoles || !allowedRoles.length || (userRole && allowedRoles.includes(userRole)));
  }, [loading, userRole, allowedRoles]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-system-blue mx-auto"></div>
        <p className="mt-3 text-muted-foreground">Đang tải...</p>
      </div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has the required role to access this route
  if (allowedRoles && allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    console.error(`Access denied: User with role ${userRole} attempting to access route requiring roles ${allowedRoles.join(', ')}`);
    
    toast.error(`Bạn không có quyền truy cập với vai trò ${userRole === 'student' ? 'Học sinh' : 'Giáo viên'}`);
    
    // Redirect students to dashboard when they try to access teacher-only routes
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
