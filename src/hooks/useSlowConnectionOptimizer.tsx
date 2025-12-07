import { useEffect, useState } from 'react';

interface ConnectionInfo {
  isSlowConnection: boolean;
  effectiveType: string;
  saveData: boolean;
  shouldReduceMotion: boolean;
  shouldReduceImages: boolean;
}

/**
 * Hook that detects slow connections and provides optimization flags
 * Reduces data usage and improves performance on 2G/3G networks
 */
export const useSlowConnectionOptimizer = (): ConnectionInfo => {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    isSlowConnection: false,
    effectiveType: '4g',
    saveData: false,
    shouldReduceMotion: false,
    shouldReduceImages: false
  });

  useEffect(() => {
    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (connection) {
        const effectiveType = connection.effectiveType || '4g';
        const saveData = connection.saveData || false;
        const isSlowConnection = ['slow-2g', '2g', '3g'].includes(effectiveType) || saveData;
        
        const info: ConnectionInfo = {
          isSlowConnection,
          effectiveType,
          saveData,
          shouldReduceMotion: isSlowConnection || prefersReducedMotion,
          shouldReduceImages: effectiveType === 'slow-2g' || effectiveType === '2g' || saveData
        };
        
        setConnectionInfo(info);
        
        // Apply global optimizations for slow connections
        if (isSlowConnection) {
          document.documentElement.classList.add('slow-connection');
          document.documentElement.style.setProperty('--animation-duration', '0s');
        } else {
          document.documentElement.classList.remove('slow-connection');
          document.documentElement.style.removeProperty('--animation-duration');
        }
      } else {
        // Fallback: assume decent connection
        setConnectionInfo({
          isSlowConnection: false,
          effectiveType: '4g',
          saveData: false,
          shouldReduceMotion: prefersReducedMotion,
          shouldReduceImages: false
        });
      }
    };

    // Initial check
    updateConnectionInfo();

    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
    }

    // Also respect prefers-reduced-motion changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', updateConnectionInfo);

    return () => {
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
      motionQuery.removeEventListener('change', updateConnectionInfo);
    };
  }, []);

  return connectionInfo;
};

/**
 * Utility to get optimized image quality based on connection
 */
export const getOptimizedImageQuality = (connection: ConnectionInfo): number => {
  if (connection.saveData || connection.effectiveType === 'slow-2g') return 40;
  if (connection.effectiveType === '2g') return 60;
  if (connection.effectiveType === '3g') return 75;
  return 85;
};

/**
 * Check if animations should be disabled
 */
export const shouldDisableAnimations = (): boolean => {
  const connection = (navigator as any).connection;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) return true;
  if (!connection) return false;
  
  return ['slow-2g', '2g'].includes(connection.effectiveType) || connection.saveData;
};
