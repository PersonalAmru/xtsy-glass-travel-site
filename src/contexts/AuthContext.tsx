import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  user_metadata?: {
    role?: string;
    full_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hardcoded credentials
const VALID_EMAIL = 'amru@xtsy.one';
const VALID_PASSWORD = 'xtsy.one';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const userData: User = {
        id: 'admin-user',
        email: VALID_EMAIL,
        role: 'admin',
        user_metadata: {
          role: 'admin',
          full_name: 'Admin User'
        }
      };
      
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return { error: null };
    } else {
      return { error: { message: 'Invalid email or password' } };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};