// Performance enhancement utilities for 0.2s target loading

// Lazy loading with intersection observer
export const setupLazyLoading = () => {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
  }
};

// Preload critical resources
export const preloadCriticalAssets = () => {
  const criticalImages = [
    '/src/assets/xtsy-brand-logo.png',
    '/src/assets/meghalaya-hero.jpg',
    '/src/assets/xtsy-logo.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
};

// Optimize fonts
export const optimizeFonts = () => {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Enable compression hints
export const enableCompression = () => {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Encoding';
  meta.content = 'gzip, deflate, br';
  document.head.appendChild(meta);
};

// Route prefetching for critical pages
export const prefetchRoutes = () => {
  const criticalRoutes = ['/travel', '/xtsy-270', '/gallery'];
  
  criticalRoutes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
};

// Initialize all performance optimizations
export const initializePerformanceEnhancements = () => {
  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupLazyLoading();
      preloadCriticalAssets();
      optimizeFonts();
      enableCompression();
      prefetchRoutes();
    });
  } else {
    setupLazyLoading();
    preloadCriticalAssets();
    optimizeFonts();
    enableCompression();
    prefetchRoutes();
  }
};