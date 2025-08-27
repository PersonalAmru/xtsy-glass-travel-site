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

// Implement service worker for caching
export const registerOptimizedServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Update service worker when new version is available
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, refresh the page
              if (confirm('New version available. Refresh to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
      
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};

// Optimize bundle loading with module preloading
export const preloadCriticalModules = () => {
  const criticalModules = [
    '/src/pages/Index.tsx',
    '/src/components/Header.tsx',
    '/src/components/Footer.tsx',
    '/src/components/BookingSummary.tsx'
  ];

  criticalModules.forEach(module => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = module;
    document.head.appendChild(link);
  });
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