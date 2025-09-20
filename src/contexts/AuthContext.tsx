import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

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
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
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

// Hardcoded admin credentials
const ADMIN_EMAIL = 'amru@xtsy.one';
const ADMIN_PASSWORD = 'xtsy.one';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: 'user',
          user_metadata: session.user.user_metadata
        });
      } else {
        // Check for stored admin session
        const storedUser = localStorage.getItem('admin_auth');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            localStorage.removeItem('admin_auth');
          }
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: 'user',
            user_metadata: session.user.user_metadata
          });
        } else {
          // Check if admin is still logged in
          const storedAdmin = localStorage.getItem('admin_auth');
          if (storedAdmin) {
            try {
              setUser(JSON.parse(storedAdmin));
            } catch (error) {
              localStorage.removeItem('admin_auth');
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Check if it's admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin-user',
        email: ADMIN_EMAIL,
        role: 'admin',
        user_metadata: {
          role: 'admin',
          full_name: 'Admin User'
        }
      };
      
      setUser(adminUser);
      localStorage.setItem('admin_auth', JSON.stringify(adminUser));
      return { error: null };
    }
    
    // Regular user login via Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    
    return { error };
  };

  const signOut = async () => {
    // Sign out from Supabase (for regular users)
    await supabase.auth.signOut();
    
    // Clear admin session
    localStorage.removeItem('admin_auth');
    
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};