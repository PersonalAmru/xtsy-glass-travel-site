import { useEffect } from 'react';
import { applyClientSideSecurityHeaders, SecurityHeadersConfig } from '../utils/productionSecurityHeaders';

interface SecurityHeadersProviderProps {
  children: React.ReactNode;
  config?: SecurityHeadersConfig;
}

/**
 * Security Headers Provider Component
 * Applies client-side security headers via meta tags
 */
export const SecurityHeadersProvider = ({ children, config = {} }: SecurityHeadersProviderProps) => {
  useEffect(() => {
    // Apply security headers on mount
    applyClientSideSecurityHeaders(config);

    // Cleanup function to remove security headers
    return () => {
      if (typeof document !== 'undefined') {
        document.querySelectorAll('meta[data-security-header]').forEach(meta => meta.remove());
      }
    };
  }, [config]);

  return <>{children}</>;
};

export default SecurityHeadersProvider;