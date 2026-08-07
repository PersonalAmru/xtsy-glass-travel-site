/**
 * Hook to require user authentication
 * Redirects to auth page if not logged in
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from '@/lib/router-compat';
import { useUserAuth } from '@/contexts/UserAuthContext';

interface UseRequireAuthOptions {
  redirectTo?: string;
  onUnauthenticated?: () => void;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = '/auth' } = options;
  const { user, isInitialized, isLoading } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isInitialized && !isLoading && !user) {
      // Store current location to redirect back after auth
      navigate(redirectTo, { 
        state: { from: location.pathname },
        replace: true 
      });
      
      if (options.onUnauthenticated) {
        options.onUnauthenticated();
      }
    }
  }, [user, isInitialized, isLoading, navigate, redirectTo, location.pathname, options]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized || isLoading,
  };
}

/**
 * Hook to check if user is authenticated without redirecting
 * Useful for guest mode - allows browsing but flags auth status
 */
export function useOptionalAuth() {
  const { user, isInitialized, isLoading } = useUserAuth();
  
  return {
    user,
    isAuthenticated: !!user,
    isGuest: isInitialized && !user,
    isLoading: !isInitialized || isLoading,
  };
}
