import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { showTelegramAlert } from '@/lib/telegram';
interface User {
  address: string;
  signature?: string;
  loginTime: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (address: string, signature?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('metamask_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Check if session is still valid (24 hours)
        if (Date.now() - userData.loginTime < 24 * 60 * 60 * 1000) {
          setUser(userData);
        } else {
          localStorage.removeItem('metamask_user');
        }
      } catch (error) {
        localStorage.removeItem('metamask_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (address: string, signature?: string) => {
    const userData: User = {
      address,
      signature,
      loginTime: Date.now()
    };
    
    setUser(userData);
    localStorage.setItem('metamask_user', JSON.stringify(userData));
    showTelegramAlert(`Welcome back, ${address.slice(0, 6)}...${address.slice(-4)}!`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('metamask_user');
    showTelegramAlert('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 