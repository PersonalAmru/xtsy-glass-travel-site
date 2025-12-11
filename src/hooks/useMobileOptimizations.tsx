import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Centralized mobile optimization hook
 * Detects mobile devices and provides utilities for mobile-specific optimizations
 */
export const useMobileOptimizations = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
        /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    // Detect slow connection
    const checkConnection = () => {
      const connection = (navigator as any).connection || 
        (navigator as any).mozConnection || 
        (navigator as any).webkitConnection;
      
      if (connection) {
        const slowTypes = ['slow-2g', '2g', '3g'];
        setIsSlowConnection(
          slowTypes.includes(connection.effectiveType) || 
          connection.saveData === true
        );
      }
    };

    // Detect reduced motion preference
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    };

    // Detect tab visibility
    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };

    checkMobile();
    checkConnection();
    const cleanupMotion = checkReducedMotion();
    
    window.addEventListener('resize', checkMobile);
    document.addEventListener('visibilitychange', handleVisibility);

    // Apply mobile-specific CSS classes to body
    if (typeof document !== 'undefined') {
      const body = document.body;
      body.classList.toggle('is-mobile', isMobile);
      body.classList.toggle('is-slow-connection', isSlowConnection);
      body.classList.toggle('reduce-motion', isReducedMotion);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('visibilitychange', handleVisibility);
      cleanupMotion?.();
    };
  }, [isMobile, isSlowConnection, isReducedMotion]);

  // Disable animations on mobile
  const shouldDisableAnimations = isMobile || isSlowConnection || isReducedMotion;
  
  // Disable heavy effects on mobile
  const shouldDisableHeavyEffects = isMobile || isSlowConnection;

  return {
    isMobile,
    isSlowConnection,
    isReducedMotion,
    isTabHidden,
    shouldDisableAnimations,
    shouldDisableHeavyEffects,
  };
};

/**
 * Hook to pause intervals when tab is hidden (saves CPU/battery)
 */
export const usePausableInterval = (
  callback: () => void,
  delay: number | null,
  options: { pauseOnHidden?: boolean; pauseOnMobile?: boolean } = {}
) => {
  const { pauseOnHidden = true, pauseOnMobile = false } = options;
  const savedCallback = useRef(callback);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const isMobile = window.innerWidth < 768;
    if (pauseOnMobile && isMobile) return;

    const tick = () => {
      if (pauseOnHidden && document.hidden) return;
      savedCallback.current();
    };

    intervalId.current = setInterval(tick, delay);

    const handleVisibility = () => {
      if (document.hidden && intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      } else if (!document.hidden && !intervalId.current) {
        intervalId.current = setInterval(tick, delay);
      }
    };

    if (pauseOnHidden) {
      document.addEventListener('visibilitychange', handleVisibility);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      if (pauseOnHidden) {
        document.removeEventListener('visibilitychange', handleVisibility);
      }
    };
  }, [delay, pauseOnHidden, pauseOnMobile]);
};

/**
 * Mobile-optimized image quality settings
 */
export const getMobileImageQuality = (isMobile: boolean, isSlowConnection: boolean) => {
  if (isSlowConnection) return 'low';
  if (isMobile) return 'medium';
  return 'high';
};

/**
 * Check if device supports touch
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export default useMobileOptimizations;
