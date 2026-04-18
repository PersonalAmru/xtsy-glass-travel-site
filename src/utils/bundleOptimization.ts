// Bundle optimization utilities
// Enhanced bundle optimization utilities for fast page transitions

export const preloadCriticalResources = () => {
  // NOTE: Do not preload /src/* paths — those only exist in dev. In production,
  // Vite emits hashed filenames under /assets/. Preloading non-existent URLs
  // wastes bandwidth, blocks the network, and slows LCP.
  // Critical images are already preloaded by criticalImagePreloader.ts using
  // the correct production URLs (Supabase CDN).
  const criticalPlaceholder = document.createElement('link');
  criticalPlaceholder.rel = 'preload';
  criticalPlaceholder.as = 'image';
  criticalPlaceholder.href = '/placeholder.svg';
  criticalPlaceholder.fetchPriority = 'low';
  document.head.appendChild(criticalPlaceholder);
};

// Defer non-critical scripts
export const deferNonCriticalScripts = () => {
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach(script => {
    script.setAttribute('defer', '');
  });
};

// Optimize font loading
export const optimizeFontLoading = () => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://fonts.googleapis.com';
  document.head.appendChild(link);

  const link2 = document.createElement('link');
  link2.rel = 'preconnect';
  link2.href = 'https://fonts.gstatic.com';
  link2.crossOrigin = '';
  document.head.appendChild(link2);
};

// Route prefetch — only triggered on real user intent (link hover/visible),
// not blanket prefetched on load. Disabled here to free bandwidth for LCP.
export const prefetchRouteChunks = () => {
  // Intentionally a no-op — prefetching unrequested routes wastes bandwidth
  // on mobile and competes with critical resources. Enable per-link if needed.
};

// Service Worker for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  }
};