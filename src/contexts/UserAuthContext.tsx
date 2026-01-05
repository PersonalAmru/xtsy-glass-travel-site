/**
 * User Authentication Context
 * Provides Firebase auth state and methods for user-facing app
 * Supports Google Sign-in and Email/Password with password reset
 */

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback
} from 'react';
import { User } from 'firebase/auth';
import {
  initializeFirebase,
  signInWithEmail,
  createAccountWithEmail,
  signOutUser,
  onUserAuthStateChanged,
  signInWithGoogle,
  sendPasswordReset
} from '@/lib/firebase';

interface UserAuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Email auth
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Google auth
  signInGoogle: () => Promise<void>;
  
  // General
  signOut: () => Promise<void>;
  clearError: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within UserAuthProvider');
  }
  return context;
}

interface UserAuthProviderProps {
  children: ReactNode;
}

export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firebase and set up auth listener
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const init = async () => {
      try {
        await initializeFirebase();
        
        // Set up auth state listener
        unsubscribe = onUserAuthStateChanged((firebaseUser) => {
          setUser(firebaseUser);
          setIsInitialized(true);
        });
      } catch (err) {
        console.error('Firebase initialization failed:', err);
        setError('Unable to connect to authentication service. Please try again later.');
        setIsInitialized(true);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Email sign in
  const signInEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      const message = getErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Email sign up
  const signUpEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await createAccountWithEmail(email, password);
    } catch (err: any) {
      const message = getErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Password reset
  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await sendPasswordReset(email);
    } catch (err: any) {
      const message = getErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Google sign in
  const signInGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('[Firebase Auth] Google Sign-In Error:', err.code, err.message, err);
      const message = getErrorMessage(err.code);
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
      await signOutUser();
    } catch (err: any) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: UserAuthContextType = {
    user,
    isLoading,
    isInitialized,
    error,
    signInEmail,
    signUpEmail,
    resetPassword,
    signInGoogle,
    signOut,
    clearError,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

/**
 * Convert Firebase error codes to user-friendly messages
 */
function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Connection issue. Please check your internet and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked. Please allow pop-ups and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
