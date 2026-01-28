// Image optimization utilities
export const preloadCriticalImages = () => {
  const criticalImages = [
    '/src/assets/xtsy-brand-logo.png',
    '/src/assets/meghalaya-hero.jpg',
    // Add other critical above-the-fold images
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

// Create WebP versions with fallbacks
export const createOptimizedImageSet = (baseSrc: string) => {
  const webpSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  return {
    webp: webpSrc,
    original: baseSrc
  };
};

// Generate responsive image sizes
export const generateSrcSet = (baseSrc: string, sizes: number[] = [400, 800, 1200]) => {
  return sizes.map(size => {
    const extension = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${extension}`, '');
    return `${baseName}-${size}w.${extension} ${size}w`;
  }).join(', ');
};

// Calculate optimal image dimensions based on viewport
export const calculateOptimalSize = (containerWidth: number, devicePixelRatio = 1) => {
  return Math.ceil(containerWidth * devicePixelRatio);
};

// Image loading performance monitor
export const monitorImagePerformance = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'resource' && entry.name.includes('image')) {
          console.log('Image load performance:', {
            name: entry.name,
            duration: entry.duration,
            size: (entry as any).transferSize,
            cached: (entry as any).transferSize === 0
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    
    return () => observer.disconnect();
  }
  
  return () => {};
};

// Preload images in viewport
export const preloadViewportImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px'
  });

  images.forEach(img => imageObserver.observe(img));
  
  return () => imageObserver.disconnect();
};

// Initialize image optimizations - runs AFTER LCP to avoid contention
export const initializeImageOptimizations = () => {
  // Skip critical images - already handled by criticalImagePreloader
  // preloadCriticalImages(); // Disabled - causes duplicate preloads
  
  // Performance monitoring only in dev and deferred
  if (import.meta.env.DEV) {
    setTimeout(monitorImagePerformance, 3000);
  }
  
  // Defer viewport image preloading
  requestAnimationFrame(() => {
    preloadViewportImages();
  });
};