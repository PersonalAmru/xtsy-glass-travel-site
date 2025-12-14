// Bundle optimization utilities
// Enhanced bundle optimization utilities for fast page transitions

export const preloadCriticalResources = () => {
  // Critical above-the-fold images
  const criticalImages = [
    '/src/assets/xtsy-brand-logo.png',
    '/src/assets/meghalaya-hero.jpg',
    '/src/assets/xtsy-logo.png',
    '/src/assets/xtsy-color-logo.png',
    '/placeholder.svg',
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });

  // Preload critical CSS
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.as = 'style';
  criticalCSS.href = '/src/styles/tailwind.css';
  criticalCSS.fetchPriority = 'high';
  document.head.appendChild(criticalCSS);
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

// Prefetch route chunks for faster page transitions
export const prefetchRouteChunks = () => {
  // Use requestIdleCallback for non-blocking prefetch
  const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
  
  idleCallback(() => {
    // Prefetch common routes as modulepreload for faster execution
    const routeChunks = [
      () => import('../pages/Travel'),
      () => import('../pages/Gallery'),
      () => import('../pages/XTSY270'),
      () => import('../pages/About'),
    ];
    
    // Stagger prefetch to avoid network congestion
    routeChunks.forEach((chunk, index) => {
      setTimeout(() => {
        chunk().catch(() => {}); // Silently fail - this is just prefetch
      }, index * 200);
    });
  });
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