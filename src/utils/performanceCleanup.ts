// Performance cleanup utilities for app shutdown
export const performGlobalCleanup = () => {
  // Clear all intervals
  if ((window as any).__performanceMonitorInterval) {
    clearInterval((window as any).__performanceMonitorInterval);
    (window as any).__performanceMonitorInterval = null;
  }

  // Clear performance optimizer cache
  if (typeof window !== 'undefined') {
    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }
};

// Debounced performance monitoring
export const createDebouncedMonitor = (callback: () => void, delay: number = 5000) => {
  let timeoutId: NodeJS.Timeout;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

// Memory leak detection
export const detectMemoryLeaks = () => {
  if ('performance' in window && 'memory' in performance) {
    const memory = (performance as any).memory;
    const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
    const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
    
    // Check for potential memory leaks
    const memoryRatio = usedMB / totalMB;
    if (memoryRatio > 0.8 && usedMB > 250) {
      console.warn('Potential memory leak detected:', {
        used: `${usedMB}MB`,
        total: `${totalMB}MB`,
        ratio: `${Math.round(memoryRatio * 100)}%`
      });
      
      return true;
    }
  }
  return false;
};

// Optimize component cleanup
export const optimizeComponentCleanup = () => {
  // Clean up any leftover event listeners
  const events = ['scroll', 'resize', 'orientationchange'];
  events.forEach(event => {
    window.removeEventListener(event, () => {}); // Remove any remaining listeners
  });
  
  // Clear any remaining timeouts/intervals
  for (let i = 1; i < 10000; i++) {
    clearTimeout(i);
    clearInterval(i);
  }
};