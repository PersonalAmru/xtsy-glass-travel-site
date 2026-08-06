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

// Prefetch route chunks for faster page transitions - delayed to not impact LCP
export const prefetchRouteChunks = () => {
  // Only prefetch after page is fully interactive
  const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 500));
  
  idleCallback(() => {
    // Limit prefetch to most common routes only - reduces network load
    const routeChunks = [
      () => import('../pages/Travel'),
      () => import('../pages/XTSY270'),
    ];
    
    // Stagger prefetch with longer delays to avoid network congestion
    routeChunks.forEach((chunk, index) => {
      setTimeout(() => {
        chunk().catch(() => {}); // Silently fail - this is just prefetch
      }, index * 500); // Increased delay between chunks
    });
  }, { timeout: 5000 }); // Only run when truly idle, with 5s timeout
};

// Service Worker for caching
export const registerServiceWorker = async () => {
  // No-op post-TanStack migration: the old caching SW was replaced by a
  // one-shot kill-switch at /sw.js that the browser's own update polling
  // delivers to returning users. Registering it explicitly would force a
  // reload cycle on fresh visitors.
};