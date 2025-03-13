
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps = {}) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      console.log('Protected Route - User Role:', userRole);
      console.log('Allowed Roles:', allowedRoles);
      console.log('Access allowed:', !allowedRoles || !allowedRoles.length || (userRole && allowedRoles.includes(userRole)));
    }
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

  // Kiểm tra xem người dùng có quyền truy cập vào tuyến đường này không
  if (allowedRoles && allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    console.log(`Chuyển hướng: Người dùng có vai trò ${userRole} không có quyền truy cập vào tuyến đường yêu cầu vai trò ${allowedRoles.join(', ')}`);
    // Chuyển hướng học sinh đến dashboard khi họ cố gắng truy cập các tuyến đường chỉ dành cho giáo viên
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
