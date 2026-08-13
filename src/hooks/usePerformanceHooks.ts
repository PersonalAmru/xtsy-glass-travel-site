/**
 * Performance optimization hooks for React components
 * Provides memoization, debouncing, and virtualization utilities
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * Debounce hook - delays callback execution until after wait ms
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook - limits callback execution to once per interval
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRan = useRef(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit
): [React.RefObject<HTMLElement>, boolean] {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
        rootMargin: '100px',
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return [elementRef as React.RefObject<HTMLElement>, isVisible];
}

/**
 * Stable callback hook - maintains reference identity across renders
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
    []
  );
}

/**
 * Previous value hook - tracks the previous value of a state
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Media query hook - optimized for performance
 */
export function useOptimizedMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    
    // Fallback for older browsers
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
}

/**
 * Reduced motion preference hook
 */
export function usePrefersReducedMotion(): boolean {
  return useOptimizedMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Idle callback hook - runs callback when browser is idle
 */
export function useIdleCallback(callback: () => void, timeout = 1000): void {
  useEffect(() => {
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(callback, { timeout });
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(callback, 50);
      return () => clearTimeout(id);
    }
  }, [callback, timeout]);
}

/**
 * RAF-based animation hook for smooth updates
 */
export function useAnimationFrame(callback: (deltaTime: number) => void, isActive = true): void {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isActive) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback, isActive]);
}

/**
 * Memoized array hook - only recalculates when dependencies change
 */
export function useMemoizedArray<T>(
  factory: () => T[],
  deps: React.DependencyList
): T[] {
  return useMemo(factory, deps);
}

/**
 * Network status hook
 */
export function useNetworkStatus(): { isOnline: boolean; isSlowConnection: boolean } {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection speed
    const connection = (navigator as any).connection;
    if (connection) {
      const checkSpeed = () => {
        setIsSlowConnection(
          connection.effectiveType === '2g' || 
          connection.effectiveType === 'slow-2g' ||
          connection.saveData === true
        );
      };
      checkSpeed();
      connection.addEventListener('change', checkSpeed);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', checkSpeed);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isSlowConnection };
}

/**
 * Mounted state hook - prevents state updates after unmount
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}
