
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();
  
  // If still loading auth state, show nothing
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground">Đang tải...</p>
    </div>;
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If roles are specified and user doesn't have required role
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
