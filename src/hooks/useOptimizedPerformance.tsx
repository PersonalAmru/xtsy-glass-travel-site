import { useState, useEffect, useCallback, useRef } from 'react';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';

// Optimized hook for heavy operations with throttling and caching
export const useOptimizedPerformance = () => {
  const [performanceData, setPerformanceData] = useState({
    memory: { used: 0, total: 0, limit: 0 },
    isOptimal: true,
    lastCheck: Date.now()
  });

  const checkPerformance = useCallback(() => {
    const metrics = PerformanceOptimizer.monitorPerformance();
    if (metrics) {
      setPerformanceData({
        memory: {
          used: metrics.usedJSHeapSize,
          total: metrics.totalJSHeapSize,
          limit: metrics.jsHeapSizeLimit
        },
        isOptimal: metrics.usedJSHeapSize < 250,
        lastCheck: metrics.timestamp
      });
    }
  }, []);

  useEffect(() => {
    // Delay initial check to not block render
    const initialCheck = setTimeout(checkPerformance, 5000);
    
    // Set up periodic monitoring
    const interval = setInterval(checkPerformance, 120000); // Every 2 minutes

    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
    };
  }, [checkPerformance]);

  const optimizeImages = useCallback((images: string[]) => {
    // Preload only first 2 images to prevent memory bloat
    const criticalImages = images.slice(0, 2);
    PerformanceOptimizer.preloadResources(criticalImages);
  }, []);

  const throttledImageLoad = useCallback((callback: () => void) => {
    requestIdleCallback(() => callback(), { timeout: 2000 });
  }, []);

  const debouncedSearch = useCallback((callback: () => void) => {
    const timeout = setTimeout(callback, 300);
    return () => clearTimeout(timeout);
  }, []);

  return {
    performanceData,
    optimizeImages,
    throttledImageLoad,
    debouncedSearch,
    cleanupMemory: PerformanceOptimizer.cleanupUnusedComponents
  };
};

// Hook for component-level performance optimization
export const useComponentOptimization = (options?: { eager?: boolean }) => {
  // If eager mode, render immediately without waiting for intersection
  const [isVisible, setIsVisible] = useState(options?.eager ?? false);
  const [shouldRender, setShouldRender] = useState(options?.eager ?? false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // If already rendering (eager mode), skip observer
    if (shouldRender) return;
    
    if (!elementRef.current) return;

    // Use passive observer for better performance
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          if (entry.isIntersecting) {
            // Use RAF to batch state updates
            requestAnimationFrame(() => {
              setShouldRender(true);
              observerRef.current?.disconnect();
            });
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '600px' // Large margin to preload sections well before they scroll into view
      }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [shouldRender]);

  return {
    elementRef,
    isVisible,
    shouldRender
  };
};

// Hook for stable resize handling without layout thrashing
export const useStableResize = (callback: (width: number, height: number) => void, delay = 100) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(window.innerWidth, window.innerHeight);
      }, delay);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, delay]);
};