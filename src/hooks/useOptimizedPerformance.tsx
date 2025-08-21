import { useState, useEffect, useCallback, useRef } from 'react';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';
import { detectMemoryLeaks, createDebouncedMonitor } from '@/utils/performanceCleanup';

// Optimized hook for heavy operations with throttling and caching
export const useOptimizedPerformance = () => {
  const [performanceData, setPerformanceData] = useState({
    memory: { used: 0, total: 0, limit: 0 },
    isOptimal: true,
    lastCheck: Date.now()
  });

  const debouncedMonitor = useRef(
    createDebouncedMonitor(() => {
      const metrics = PerformanceOptimizer.monitorPerformance();
      if (metrics) {
        setPerformanceData({
          memory: {
            used: metrics.usedJSHeapSize,
            total: metrics.totalJSHeapSize,
            limit: metrics.jsHeapSizeLimit
          },
          isOptimal: metrics.usedJSHeapSize < 250, // 250MB threshold
          lastCheck: metrics.timestamp
        });
      }
    }, 10000) // Check every 10 seconds max
  );

  useEffect(() => {
    // Initial check
    debouncedMonitor.current();
    
    // Set up periodic monitoring
    const interval = setInterval(() => {
      debouncedMonitor.current();
      
      // Check for memory leaks
      if (detectMemoryLeaks()) {
        PerformanceOptimizer.cleanupUnusedComponents();
      }
    }, 60000); // Every minute

    return () => {
      clearInterval(interval);
    };
  }, []);

  const optimizeImages = useCallback((images: string[]) => {
    // Preload only critical images to prevent memory bloat
    const criticalImages = images.slice(0, 3); // Only first 3 images
    PerformanceOptimizer.preloadResources(criticalImages);
  }, []);

  const throttledImageLoad = useCallback(
    PerformanceOptimizer.throttle((callback: () => void) => {
      callback();
    }, 1000), // Throttle image loads to max 1 per second
    []
  );

  const debouncedSearch = useCallback(
    PerformanceOptimizer.debounce((callback: () => void) => {
      callback();
    }, 300), // Debounce search operations
    []
  );

  return {
    performanceData,
    optimizeImages,
    throttledImageLoad,
    debouncedSearch,
    cleanupMemory: PerformanceOptimizer.cleanupUnusedComponents
  };
};

// Hook for component-level performance optimization
export const useComponentOptimization = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          if (entry.isIntersecting) {
            setShouldRender(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Start loading 100px before entering viewport
      }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    elementRef,
    isVisible,
    shouldRender
  };
};