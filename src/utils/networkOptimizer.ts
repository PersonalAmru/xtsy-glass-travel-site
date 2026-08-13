// Network optimization utilities for faster loading

// Enable resource hints for critical domains
export const enableResourceHints = () => {
  const hints = [
    { rel: 'dns-prefetch', href: 'https://wa.me' },
    { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://wa.me' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Service worker registration removed in the TanStack Start migration.
// /sw.js is now a kill-switch that unregisters the old SW for returning users;
// the browser's automatic SW update polling delivers it — no register call needed.
export const registerOptimizedServiceWorker = async () => {
  /* intentionally a no-op */
};

// Optimize bundle loading with module preloading - disabled to reduce network contention
// Module preloading can compete with LCP image loading
export const preloadCriticalModules = () => {
  // Intentionally empty - modules are loaded on-demand for better LCP
  // The router handles code splitting efficiently
};

// Network-aware loading
export const enableNetworkAwareLoading = () => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    
    if (connection) {
      // Adjust loading strategy based on connection
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Disable non-critical features for slow connections
        document.documentElement.classList.add('slow-connection');
      } else if (connection.effectiveType === '4g') {
        // Enable all features for fast connections
        document.documentElement.classList.add('fast-connection');
      }
    }
  }
};

// Initialize network optimizations
export const initializeNetworkOptimizations = () => {
  enableResourceHints();
  registerOptimizedServiceWorker();
  preloadCriticalModules();
  enableNetworkAwareLoading();
};