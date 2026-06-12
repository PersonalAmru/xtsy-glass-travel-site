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

// Preload critical resources.
// NOTE: The real LCP image (hero brand symbol) is preloaded with a stable
// /lovable-uploads/ path via index.html + criticalImagePreloader. The previous
// list here pointed at `/src/assets/*` paths which only resolve in dev and 404
// in the production build (Vite hashes asset filenames), and `meghalaya-hero.jpg`
// is not rendered above the fold at all — so these were wasted/broken preloads
// competing with the genuine LCP fetch. Intentionally a no-op now.
export const preloadCriticalAssets = () => {
  /* no-op — see note above */
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

// Compression is a server/CDN concern — never inject Content-Encoding as a meta tag
// (it's a response header; injecting it client-side fails Lighthouse and confuses crawlers).
export const enableCompression = () => {
  // No-op. Compression is enforced at the Cloudflare/Lovable edge.
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