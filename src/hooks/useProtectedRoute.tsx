
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, checkUserAccess } = useAuth();
  
  // While checking authentication status, show nothing or a loading indicator
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If role check is required and user doesn't have permission
  if (requiredRole && !checkUserAccess(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If authenticated and has permission, render the protected content
  return <>{children}</>;
};
