/**
 * Firebase Client Configuration
 * Handles initialization and provides auth instance for user authentication
 */

import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { supabase } from '@/integrations/supabase/client';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
}

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let configPromise: Promise<FirebaseConfig> | null = null;

/**
 * Fetch Firebase config from edge function
 */
async function fetchFirebaseConfig(): Promise<FirebaseConfig> {
  const { data, error } = await supabase.functions.invoke('get-firebase-config');
  
  if (error) {
    console.error('Failed to fetch Firebase config:', error);
    throw new Error('Unable to initialize authentication service');
  }
  
  if (data.error) {
    console.error('Firebase config error:', data.error);
    throw new Error('Authentication service configuration incomplete');
  }
  
  return data as FirebaseConfig;
}

/**
 * Initialize Firebase lazily
 */
export async function initializeFirebase(): Promise<Auth> {
  // Return existing auth if already initialized
  if (firebaseAuth) {
    return firebaseAuth;
  }
  
  // Check if Firebase is already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0];
    firebaseAuth = getAuth(firebaseApp);
    return firebaseAuth;
  }
  
  // Fetch config only once
  if (!configPromise) {
    configPromise = fetchFirebaseConfig();
  }
  
  const config = await configPromise;
  
  firebaseApp = initializeApp(config);
  firebaseAuth = getAuth(firebaseApp);
  
  return firebaseAuth;
}

/**
 * Get auth instance (throws if not initialized)
 */
export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firebaseAuth;
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email);
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string, 
  password: string
): Promise<User> {
  const auth = getFirebaseAuth();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Create account with email and password
 */
export async function createAccountWithEmail(
  email: string, 
  password: string
): Promise<User> {
  const auth = getFirebaseAuth();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Send verification email
  await sendEmailVerification(result.user);
  
  return result.user;
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

/**
 * Sign out user
 */
export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function onUserAuthStateChanged(
  callback: (user: User | null) => void
): () => void {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

// Export types
export type { User };
