/**
 * Performance constants and utilities
 * Centralized configuration for performance optimizations
 */

// Image loading priorities
export const IMAGE_PRIORITY = {
  LCP: 'high' as const, // Largest Contentful Paint
  ABOVE_FOLD: 'high' as const,
  BELOW_FOLD: 'low' as const,
  LAZY: 'auto' as const,
};

// Intersection Observer thresholds
export const OBSERVER_CONFIG = {
  LAZY_LOAD: {
    threshold: 0.01,
    rootMargin: '200px 0px',
  },
  ANIMATION: {
    threshold: 0.1,
    rootMargin: '50px 0px',
  },
  VISIBILITY: {
    threshold: 0.5,
    rootMargin: '0px',
  },
};

// Debounce/Throttle timings (ms)
export const TIMING = {
  DEBOUNCE: {
    SEARCH: 300,
    RESIZE: 150,
    SCROLL: 100,
    INPUT: 200,
  },
  THROTTLE: {
    SCROLL: 16, // ~60fps
    RESIZE: 100,
    ANALYTICS: 1000,
  },
  CACHE: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 60 * 60 * 1000, // 1 hour
  },
};

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SPRING: {
    stiffness: 300,
    damping: 30,
    mass: 1,
  },
};

// Chunk loading priorities
export const ROUTE_PRIORITY = {
  CRITICAL: ['/', '/book', '/search'],
  HIGH: ['/properties', '/travel'],
  MEDIUM: ['/about', '/gallery'],
  LOW: ['/admin', '/franchise'],
};

// Performance budgets
export const BUDGETS = {
  JS_BUNDLE_KB: 300,
  CSS_BUNDLE_KB: 50,
  IMAGE_KB: 200,
  LCP_MS: 2500,
  FID_MS: 100,
  CLS: 0.1,
};

/**
 * Schedule a callback during idle time
 */
export function scheduleIdleTask(callback: () => void, timeout = 2000): void {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 50);
  }
}

/**
 * Run callback on next animation frame (for smooth UI updates)
 */
export function scheduleRaf(callback: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}

/**
 * Batch multiple DOM reads to prevent layout thrashing
 */
export function batchDomReads<T>(reads: (() => T)[]): T[] {
  return reads.map(read => read());
}

/**
 * Batch multiple DOM writes after reads
 */
export function batchDomWrites(writes: (() => void)[]): void {
  requestAnimationFrame(() => {
    writes.forEach(write => write());
  });
}

/**
 * Create a simple LRU cache for expensive computations
 */
export function createLRUCache<K, V>(maxSize: number) {
  const cache = new Map<K, V>();
  
  return {
    get(key: K): V | undefined {
      const value = cache.get(key);
      if (value !== undefined) {
        // Move to end (most recently used)
        cache.delete(key);
        cache.set(key, value);
      }
      return value;
    },
    set(key: K, value: V): void {
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= maxSize) {
        // Delete oldest (first) entry
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },
    clear(): void {
      cache.clear();
    },
    size(): number {
      return cache.size;
    },
  };
}

/**
 * Preload a component/module
 */
export function preloadComponent(importFn: () => Promise<any>): void {
  scheduleIdleTask(() => {
    importFn().catch(() => {
      // Silently ignore preload failures
    });
  });
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is low-end (limited resources)
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const connection = (navigator as any).connection;
  if (connection) {
    // Check for slow connection
    if (connection.saveData || 
        connection.effectiveType === '2g' || 
        connection.effectiveType === 'slow-2g') {
      return true;
    }
  }
  
  // Check for limited memory (if available)
  if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) {
    return true;
  }
  
  // Check for limited CPU cores
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    return true;
  }
  
  return false;
}

/**
 * Get optimal image quality based on device capabilities
 */
export function getOptimalImageQuality(): 'high' | 'medium' | 'low' {
  if (isLowEndDevice()) return 'low';
  
  const connection = (navigator as any).connection;
  if (connection) {
    switch (connection.effectiveType) {
      case '4g':
        return 'high';
      case '3g':
        return 'medium';
      default:
        return 'low';
    }
  }
  
  return 'high';
}

/**
 * Measure and log component render time (development only)
 */
export function measureRender(componentName: string): () => void {
  if (import.meta.env.MODE !== 'development') {
    return () => {};
  }
  
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    if (duration > 16) { // Longer than 1 frame
      console.warn(`[Perf] ${componentName} render took ${duration.toFixed(2)}ms`);
    }
  };
}
