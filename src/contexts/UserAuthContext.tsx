/**
 * User Authentication Context - Supabase Auth
 * Handles email/password, OTP, Google sign-in, and password reset
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

// User profile type from our custom table
interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Extended user type with profile data (compatible with old Firebase shape)
interface ExtendedUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  providerData?: Array<{ providerId: string }>;
  profile?: UserProfile | null;
}

interface UserAuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signInWithOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}

// Convert Supabase user to our extended user format
function convertToExtendedUser(supabaseUser: User, profile?: UserProfile | null): ExtendedUser {
  const providerData = supabaseUser.app_metadata?.providers?.map((p: string) => ({ providerId: p })) || [];
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || null,
    displayName: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || null,
    photoURL: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
    phoneNumber: profile?.phone || supabaseUser.phone || null,
    emailVerified: supabaseUser.email_confirmed_at !== null,
    metadata: {
      creationTime: supabaseUser.created_at,
      lastSignInTime: supabaseUser.last_sign_in_at || undefined,
    },
    providerData,
    profile,
  };
}

interface UserAuthProviderProps {
  children: ReactNode;
}

export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from our custom table
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError);
        return null;
      }
      return data as UserProfile | null;
    } catch {
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            const profile = await fetchUserProfile(currentSession.user.id);
            setUser(convertToExtendedUser(currentSession.user, profile));
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      
      if (existingSession?.user) {
        const profile = await fetchUserProfile(existingSession.user.id);
        setUser(convertToExtendedUser(existingSession.user, profile));
      }
      
      setIsInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  // Sign in with email and password
  const signInEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (signInError) {
        throw signInError;
      }
      
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setUser(convertToExtendedUser(data.user, profile));
        setSession(data.session);
      }
    } catch (err: any) {
      const message = getErrorMessage(err.message || err.code || 'auth/unknown');
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  // Sign up with email and password
  const signUpEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setUser(convertToExtendedUser(data.user, profile));
        setSession(data.session);
      }
    } catch (err: any) {
      const message = getErrorMessage(err.message || err.code || 'auth/unknown');
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  // Sign in with OTP (magic link)
  const signInWithOTP = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (otpError) {
        throw otpError;
      }
    } catch (err: any) {
      const message = getErrorMessage(err.message || err.code || 'auth/unknown');
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify OTP token
  const verifyOTP = useCallback(async (email: string, token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: 'email',
      });
      
      if (verifyError) {
        throw verifyError;
      }
      
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setUser(convertToExtendedUser(data.user, profile));
        setSession(data.session);
      }
    } catch (err: any) {
      const message = getErrorMessage(err.message || err.code || 'auth/unknown');
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        }
      );
      
      if (resetError) {
        throw resetError;
      }
    } catch (err: any) {
      const message = getErrorMessage(err.message || err.code || 'auth/unknown');
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign in with Google
  const signInGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (googleError) {
        throw googleError;
      }
    } catch (err: any) {
      const message = getErrorMessage(err.message || err.code || 'auth/unknown');
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        throw signOutError;
      }
      
      setUser(null);
      setSession(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError('Failed to sign out. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Refresh profile
      const updatedProfile = await fetchUserProfile(user.id);
      if (updatedProfile && session?.user) {
        setUser(convertToExtendedUser(session.user, updatedProfile));
      }
    } catch (err: any) {
      setError('Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, session, fetchUserProfile]);

  const value = useMemo(() => ({
    user,
    session,
    isLoading,
    isInitialized,
    error,
    signInEmail,
    signUpEmail,
    signInWithOTP,
    verifyOTP,
    resetPassword,
    signInGoogle,
    signOut,
    clearError,
    updateProfile,
  }), [
    user,
    session,
    isLoading,
    isInitialized,
    error,
    signInEmail,
    signUpEmail,
    signInWithOTP,
    verifyOTP,
    resetPassword,
    signInGoogle,
    signOut,
    clearError,
    updateProfile,
  ]);

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

// Convert error codes to user-friendly messages
function getErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please verify your email address',
    'User already registered': 'An account with this email already exists',
    'Password should be at least 6 characters': 'Password must be at least 6 characters',
    'Invalid email': 'Please enter a valid email address',
    'Rate limit exceeded': 'Too many attempts. Please try again later',
    'Token has expired or is invalid': 'The verification code has expired',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/popup-closed-by-user': 'Sign-in was cancelled',
    'auth/operation-not-allowed': 'This sign-in method is not enabled',
  };
  
  return errorMessages[code] || 'Something went wrong. Please try again.';
}
