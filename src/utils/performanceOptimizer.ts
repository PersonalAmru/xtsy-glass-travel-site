// High-performance optimizations for heavy traffic
export class PerformanceOptimizer {
  private static requestCache = new Map<string, { data: any; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Request deduplication and caching
  static async cachedRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    cacheDuration = this.CACHE_DURATION
  ): Promise<T> {
    const cached = this.requestCache.get(key);
    
    if (cached && (Date.now() - cached.timestamp) < cacheDuration) {
      return cached.data;
    }

    try {
      const data = await requestFn();
      this.requestCache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      // If request fails, return cached data if available (stale-while-revalidate)
      if (cached) {
        console.warn(`Request failed for ${key}, returning stale data`);
        return cached.data;
      }
      throw error;
    }
  }

  // Debounce function calls to prevent rapid-fire requests
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle function calls for scroll/resize events
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Preload critical resources
  static preloadResources(resources: string[]) {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (resource.includes('.jpg') || resource.includes('.png') || resource.includes('.webp')) {
        link.as = 'image';
      } else if (resource.includes('.css')) {
        link.as = 'style';
      } else if (resource.includes('.js')) {
        link.as = 'script';
      }
      
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // Memory cleanup for large lists
  static cleanupUnusedComponents() {
    // Force garbage collection if available (Chrome DevTools)
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }

  // Monitor performance metrics
  static monitorPerformance() {
    if ('performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      const metrics = {
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576),
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576),
        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576),
        timestamp: Date.now()
      };

      // Log warning if memory usage is high
      if (metrics.usedJSHeapSize > 100) { // 100MB threshold
        console.warn('High memory usage detected:', metrics);
      }

      return metrics;
    }
    return null;
  }

  // Clear cache periodically to prevent memory leaks
  static startCacheCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.requestCache.entries()) {
        if (now - value.timestamp > this.CACHE_DURATION * 2) {
          this.requestCache.delete(key);
        }
      }
    }, this.CACHE_DURATION);
  }
}

// Initialize performance optimizations
export const initializePerformanceOptimizations = () => {
  // Start cache cleanup
  PerformanceOptimizer.startCacheCleanup();

  // Preload critical resources
  PerformanceOptimizer.preloadResources([
    '/placeholder.svg',
    // Add other critical assets
  ]);

  // Monitor performance every 30 seconds in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      PerformanceOptimizer.monitorPerformance();
    }, 30000);
  }
};