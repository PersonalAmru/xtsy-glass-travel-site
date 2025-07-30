// Bundle optimization utilities
export const preloadCriticalResources = () => {
  // Preload critical images
  const criticalImages = [
    '/placeholder.svg',
    // Add other critical images here
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
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