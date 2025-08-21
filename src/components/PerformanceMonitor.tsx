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
          
          if (entry.entryType === 'resource' && entry.name.includes('image')) {
            console.log('Image Load Performance:', {
              name: entry.name.split('/').pop(),
              duration: Math.round(entry.duration),
              size: (entry as any).transferSize || 'cached',
            });
          }
          
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('Largest Contentful Paint:', Math.round(entry.startTime) + 'ms');
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'resource', 'largest-contentful-paint'] });

      // Cleanup
      return () => observer.disconnect();
    }

    // Memory usage monitoring with throttling (only log if memory is high)
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const usedMB = Math.round(memInfo.usedJSHeapSize / 1048576);
      
      // Only log if memory usage is concerning (>200MB)
      if (usedMB > 200) {
        console.log('Memory Usage Alert:', {
          used: usedMB + ' MB',
          total: Math.round(memInfo.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) + ' MB'
        });
      }
    }
  }, []);

  return null;
};

export default PerformanceMonitor;