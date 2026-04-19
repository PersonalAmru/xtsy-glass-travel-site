import { useEffect } from 'react';

// Wave 4 — All console.log gated behind DEV. Production was logging on every
// resource entry which slowed DevTools and leaked perf data.
const isDev = import.meta.env.DEV;

const PerformanceMonitor = () => {
  useEffect(() => {
    if (!isDev) return;
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Page Load Performance:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            totalPageLoad: navEntry.loadEventEnd - navEntry.loadEventStart,
            firstContentfulPaint: navEntry.fetchStart,
          });
        }
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('Largest Contentful Paint:', Math.round(entry.startTime) + 'ms');
        }
      });
    });

    // Note: dropped 'resource' type — was extremely noisy
    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] });

    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const usedMB = Math.round(memInfo.usedJSHeapSize / 1048576);
      if (usedMB > 200) {
        console.log('Memory Usage Alert:', {
          used: usedMB + ' MB',
          total: Math.round(memInfo.totalJSHeapSize / 1048576) + ' MB',
        });
      }
    }

    return () => observer.disconnect();
  }, []);

  return null;
};

export default PerformanceMonitor;
