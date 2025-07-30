import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Performance observer for monitoring
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Page Load Performance:', {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              totalPageLoad: navEntry.loadEventEnd - navEntry.loadEventStart,
              firstContentfulPaint: navEntry.fetchStart,
            });
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'resource'] });

      // Cleanup
      return () => observer.disconnect();
    }

    // Memory usage monitoring (if available)
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      console.log('Memory Usage:', {
        used: Math.round(memInfo.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memInfo.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) + ' MB'
      });
    }
  }, []);

  return null;
};

export default PerformanceMonitor;