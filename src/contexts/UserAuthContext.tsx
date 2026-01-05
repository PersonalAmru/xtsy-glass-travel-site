/**
 * User Authentication Context
 * Provides Firebase auth state and methods for user-facing app
 * Implements hybrid auth: Firebase for users, Supabase for admin/franchise
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
  sendPhoneOTP,
  verifyPhoneOTP,
  setupRecaptcha,
  onUserAuthStateChanged,
  signInWithGoogle,
  type ConfirmationResult
} from '@/lib/firebase';
import { RecaptchaVerifier } from 'firebase/auth';

interface UserAuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Email auth
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  
  // Phone auth
  sendOTP: (phoneNumber: string, recaptchaContainerId: string) => Promise<void>;
  verifyOTP: (code: string) => Promise<void>;
  
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
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

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

  // Phone OTP - send
  const sendOTP = useCallback(async (phoneNumber: string, recaptchaContainerId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create new reCAPTCHA verifier
      const verifier = setupRecaptcha(recaptchaContainerId);
      setRecaptchaVerifier(verifier);
      
      const result = await sendPhoneOTP(phoneNumber, verifier);
      setConfirmationResult(result);
    } catch (err: any) {
      console.error('[Firebase Auth] Phone OTP Error:', err.code, err.message, err);
      const message = getErrorMessage(err.code);
      setError(message);
      // Clean up reCAPTCHA on error
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        setRecaptchaVerifier(null);
      }
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [recaptchaVerifier]);

  // Phone OTP - verify
  const verifyOTP = useCallback(async (code: string) => {
    if (!confirmationResult) {
      setError('Please request a new OTP code.');
      throw new Error('No confirmation result available');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await verifyPhoneOTP(confirmationResult, code);
      setConfirmationResult(null);
      
      // Clean up reCAPTCHA
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        setRecaptchaVerifier(null);
      }
    } catch (err: any) {
      const message = getErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [confirmationResult, recaptchaVerifier]);

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
      // Don't show error for sign out, just clear local state
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
    sendOTP,
    verifyOTP,
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
      return 'No account found with this email. Would you like to create one?';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number with country code.';
    case 'auth/invalid-verification-code':
      return 'The code you entered is incorrect. Please try again.';
    case 'auth/code-expired':
      return 'This code has expired. Please request a new one.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Connection issue. Please check your internet and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
