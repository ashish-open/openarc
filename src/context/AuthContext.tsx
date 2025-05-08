
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export type UserRole = 'super-admin' | 'admin' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkUserAccess: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS = [
  { 
    id: '1', 
    email: 'admin@example.com', 
    password: 'admin123', 
    name: 'Super Admin', 
    role: 'super-admin' as UserRole 
  },
  { 
    id: '2', 
    email: 'manager@example.com', 
    password: 'manager123', 
    name: 'Admin User', 
    role: 'admin' as UserRole 
  },
  { 
    id: '3', 
    email: 'viewer@example.com', 
    password: 'viewer123', 
    name: 'View Only', 
    role: 'viewer' as UserRole 
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Session restore error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching credentials (mock authentication)
      const mockUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (mockUser) {
        // Create session user without password
        const { password, ...sessionUser } = mockUser;
        
        // Save to state and localStorage
        setUser(sessionUser);
        localStorage.setItem('auth_user', JSON.stringify(sessionUser));
        toast.success(`Welcome back, ${sessionUser.name}!`);
        return;
      }
      
      toast.error('Invalid email or password.');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    toast.success('Logged out successfully');
  };

  const checkUserAccess = (requiredRole: UserRole | UserRole[]) => {
    if (!user) return false;
    
    // Role hierarchy: super-admin > admin > viewer
    // A user with a higher role can perform actions of lower roles
    const roleHierarchy: Record<UserRole, number> = {
      'super-admin': 3,
      'admin': 2,
      'viewer': 1
    };
    
    const userRoleLevel = roleHierarchy[user.role];
    
    if (Array.isArray(requiredRole)) {
      // Check if user has any of the required roles or higher
      const requiredLevels = requiredRole.map(role => roleHierarchy[role]);
      const minimumRequiredLevel = Math.min(...requiredLevels);
      return userRoleLevel >= minimumRequiredLevel;
    } else {
      // Check if user has the required role or higher
      return userRoleLevel >= roleHierarchy[requiredRole];
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      checkUserAccess,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
