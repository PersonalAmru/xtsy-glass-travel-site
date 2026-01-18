/**
 * User Authentication Context - Supabase Auth
 * Handles email/password, OTP, Google sign-in, and password reset
 * SECURITY: Session isolation from admin/franchise auth
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

// Session isolation keys
const USER_SESSION_KEY = 'xtsy_user_session';
const ADMIN_SESSION_KEY = 'xtsy_admin_session';
const FRANCHISE_SESSION_KEY = 'xtsy_franchise_session';

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

// Check if this is an admin/franchise session (should be ignored by user context)
function isAdminOrFranchiseSession(): boolean {
  // Check multiple markers for comprehensive admin detection
  const isAdminSession = localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  const isFranchiseSession = localStorage.getItem(FRANCHISE_SESSION_KEY) === 'true';
  const isAdminFlow = sessionStorage.getItem('xtsy_auth_flow') === 'admin';
  const isAdminFlowPersistent = localStorage.getItem('xtsy_admin_auth_flow') === 'true';
  
  return isAdminSession || isFranchiseSession || isAdminFlow || isAdminFlowPersistent;
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

  // Create user profile if it doesn't exist
  const createUserProfileIfNeeded = useCallback(async (supabaseUser: User): Promise<UserProfile | null> => {
    try {
      // Check if profile exists
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();
      
      if (existing) return existing as UserProfile;
      
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: supabaseUser.id,
          email: supabaseUser.email || '',
          full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
          avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
          phone: supabaseUser.phone || null,
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating profile:', createError);
        return null;
      }
      
      return newProfile as UserProfile;
    } catch (err) {
      console.error('Profile creation error:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // SECURITY: Ignore ALL auth state changes if this is an admin/franchise session
        // This is CRITICAL to prevent admin login from affecting user state
        if (isAdminOrFranchiseSession()) {
          console.log('[UserAuth] Ignoring auth change - admin/franchise session detected');
          // Ensure user state is cleared for admin sessions
          setUser(null);
          setSession(null);
          return;
        }
        
        // Also check if the current user is the admin user
        const adminUserId = localStorage.getItem('xtsy_admin_user_id');
        if (currentSession?.user && adminUserId && currentSession.user.id === adminUserId) {
          console.log('[UserAuth] Ignoring auth change - admin user ID detected');
          setUser(null);
          setSession(null);
          return;
        }
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Mark as user session
          localStorage.setItem(USER_SESSION_KEY, 'true');
          
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            const profile = await createUserProfileIfNeeded(currentSession.user);
            setUser(convertToExtendedUser(currentSession.user, profile));
          }, 0);
        } else {
          localStorage.removeItem(USER_SESSION_KEY);
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      // SECURITY: Don't restore session if this is an admin/franchise flow
      if (isAdminOrFranchiseSession()) {
        console.log('[UserAuth] Skipping session restore - admin/franchise flow');
        setUser(null);
        setSession(null);
        setIsInitialized(true);
        return;
      }
      
      // Check if the session user is the admin user
      const adminUserId = localStorage.getItem('xtsy_admin_user_id');
      if (existingSession?.user && adminUserId && existingSession.user.id === adminUserId) {
        console.log('[UserAuth] Skipping session restore - admin user ID');
        setUser(null);
        setSession(null);
        setIsInitialized(true);
        return;
      }
      
      setSession(existingSession);
      
      if (existingSession?.user) {
        localStorage.setItem(USER_SESSION_KEY, 'true');
        const profile = await createUserProfileIfNeeded(existingSession.user);
        setUser(convertToExtendedUser(existingSession.user, profile));
      }
      
      setIsInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, createUserProfileIfNeeded]);

  // Sign in with email and password
  const signInEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // SECURITY: Clear any admin/franchise session markers before user login
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(FRANCHISE_SESSION_KEY);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (signInError) {
        throw signInError;
      }
      
      if (data.user) {
        // Mark as user session
        localStorage.setItem(USER_SESSION_KEY, 'true');
        
        const profile = await createUserProfileIfNeeded(data.user);
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
  }, [createUserProfileIfNeeded]);

  // Sign up with email and password
  const signUpEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // SECURITY: Clear any admin/franchise session markers
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(FRANCHISE_SESSION_KEY);
      
      const redirectUrl = `${window.location.origin}/auth`;
      
      console.log('[UserAuth] Attempting signup for:', email.trim());
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      
      console.log('[UserAuth] Signup response:', { 
        hasUser: !!data.user, 
        hasSession: !!data.session,
        identitiesCount: data.user?.identities?.length,
        error: signUpError?.message
      });
      
      if (signUpError) {
        // Handle specific Supabase errors
        const errorMsg = signUpError.message || '';
        const status = (signUpError as any).status;
        
        console.log('[UserAuth] Signup error:', { status, errorMsg });
        
        // Check if user already exists and has confirmed email (422 error)
        if (status === 422 || 
            errorMsg.toLowerCase().includes('already registered') || 
            errorMsg.toLowerCase().includes('user already registered')) {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        
        throw signUpError;
      }
      
      // With email confirmation DISABLED in Supabase:
      // - New user: returns user with session immediately (auto-confirmed)
      // - Existing user: returns 422 error (handled above)
      
      // With email confirmation ENABLED:
      // - New user: returns user with identities populated, no session
      // - Existing unconfirmed user: returns user with identities = [] (obfuscated)
      // - Existing confirmed user: returns 422 error (handled above)
      
      // CRITICAL FIX: Only check for empty identities if email confirmation is ENABLED
      // When email confirmation is DISABLED, we get a session directly
      if (!data.session && data.user && data.user.identities && data.user.identities.length === 0) {
        // This is an obfuscated response - user already exists (email confirmation is ON)
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      
      // Success case 1: Auto-confirmed (email confirmation disabled)
      if (data.user && data.session) {
        console.log('[UserAuth] User auto-confirmed, creating profile...');
        localStorage.setItem(USER_SESSION_KEY, 'true');
        const profile = await createUserProfileIfNeeded(data.user);
        setUser(convertToExtendedUser(data.user, profile));
        setSession(data.session);
        return;
      }
      
      // Success case 2: Needs email confirmation
      if (data.user && !data.session) {
        console.log('[UserAuth] User created, needs email confirmation');
        // User created but needs to confirm email
        setError(null);
        return;
      }
      
      // Edge case: No user returned (shouldn't happen)
      if (!data.user) {
        throw new Error('Failed to create account. Please try again.');
      }
    } catch (err: any) {
      const message = getErrorMessage(err.message || err.code || 'auth/unknown');
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [createUserProfileIfNeeded]);

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
        localStorage.setItem(USER_SESSION_KEY, 'true');
        const profile = await createUserProfileIfNeeded(data.user);
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
  }, [createUserProfileIfNeeded]);

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
      // Clear admin/franchise markers
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(FRANCHISE_SESSION_KEY);
      
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
      
      // Clear all session markers
      localStorage.removeItem(USER_SESSION_KEY);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(FRANCHISE_SESSION_KEY);
      
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
function getErrorMessage(errorInput: string | { message?: string; code?: string; status?: number }): string {
  // Handle object errors from Supabase
  const code = typeof errorInput === 'string' 
    ? errorInput 
    : errorInput.message || errorInput.code || 'unknown';
  
  const errorMessages: Record<string, string> = {
    // Supabase Auth errors
    'Invalid login credentials': 'Invalid email or password. Please check and try again.',
    'Email not confirmed': 'Please verify your email address first. Check your inbox for the confirmation link.',
    'User already registered': 'An account with this email already exists. Please sign in instead.',
    'user_already_exists': 'An account with this email already exists. Please sign in instead.',
    'Password should be at least 6 characters': 'Password must be at least 6 characters.',
    'Password should contain at least one character of each': 'Password must contain at least one lowercase letter, one uppercase letter, and one number.',
    'Invalid email': 'Please enter a valid email address.',
    'Rate limit exceeded': 'Too many attempts. Please try again in a few minutes.',
    'Token has expired or is invalid': 'The verification code has expired. Please request a new one.',
    'Signup requires a valid password': 'Please enter a valid password.',
    'Email rate limit exceeded': 'Too many email requests. Please wait a few minutes before trying again.',
    'For security purposes': 'For security purposes, please wait a moment before trying again.',
    'new password should be different': 'Your new password must be different from your current password.',
    'Unable to validate email address': 'Please enter a valid email address.',
    'Signups not allowed for this instance': 'Signups are currently disabled. Please contact support.',
    
    // Firebase-style errors (for backwards compat)
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  };
  
  // Check for exact matches first
  if (errorMessages[code]) {
    return errorMessages[code];
  }
  
  // Check for partial matches (case-insensitive)
  const lowerCode = code.toLowerCase();
  for (const [key, message] of Object.entries(errorMessages)) {
    if (lowerCode.includes(key.toLowerCase())) {
      return message;
    }
  }
  
  // Handle specific HTTP status patterns
  if (lowerCode.includes('422') || lowerCode.includes('already registered') || lowerCode.includes('already exists')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  
  if (lowerCode.includes('401') || lowerCode.includes('unauthorized')) {
    return 'Invalid credentials. Please check your email and password.';
  }
  
  if (lowerCode.includes('429') || lowerCode.includes('rate limit')) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  
  if (lowerCode.includes('network') || lowerCode.includes('fetch') || lowerCode.includes('connection')) {
    return 'Network error. Please check your internet connection.';
  }
  
  // Default message with the original error for debugging
  console.error('[Auth Error]', code);
  return 'Something went wrong. Please try again.';
}