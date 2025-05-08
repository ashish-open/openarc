
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { toast } from 'sonner';

export { UserRole };

export const useRequireAuth = (requiredRole?: UserRole | UserRole[]) => {
  const { isAuthenticated, user, isLoading, checkUserAccess } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth state to be determined
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.error("You must be logged in to view this page");
      navigate('/login');
      return;
    }

    // Check role-based access if a required role is specified
    if (requiredRole && !checkUserAccess(requiredRole)) {
      toast.error("You don't have permission to access this page");
      navigate('/dashboard'); // Redirect to a safe page
      return;
    }
  }, [isAuthenticated, isLoading, navigate, requiredRole, checkUserAccess]);

  return { user, isLoading };
};
