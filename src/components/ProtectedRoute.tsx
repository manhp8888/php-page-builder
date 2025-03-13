
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps = {}) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

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

  // If specific roles are required and the user doesn't have one of those roles
  if (allowedRoles && allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    // Redirect students to dashboard when they try to access teacher-only routes
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
