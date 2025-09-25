import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: string) => Promise<boolean>;
  logout: () => void;
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
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: role as 'doctor' | 'patient' | 'therapist',
      createdAt: new Date().toISOString(),
    };

    setAuthState({
      user,
      isAuthenticated: true,
    });

    return true;
  };

  const register = async (email: string, password: string, name: string, role: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful registration
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: role as 'doctor' | 'patient' | 'therapist',
      createdAt: new Date().toISOString(),
    };

    setAuthState({
      user,
      isAuthenticated: true,
    });

    return true;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};