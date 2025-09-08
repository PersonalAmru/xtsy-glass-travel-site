import { useEffect } from 'react';
import { SecurityMiddleware, SecurityConfig } from '../utils/securityHeadersMiddleware';

interface SecurityHeadersProps {
  config?: SecurityConfig;
}

export const SecurityHeaders = ({ config = {} }: SecurityHeadersProps) => {
  useEffect(() => {
    // Apply comprehensive security headers
    const middleware = new SecurityMiddleware(config);
    middleware.applyClientSideHeaders();

    // Cleanup function
    return () => {
      middleware.cleanup();
    };
  }, [config]);

  return null; // This component doesn't render anything visible
};

export default SecurityHeaders;