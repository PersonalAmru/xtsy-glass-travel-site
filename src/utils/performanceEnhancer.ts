// Performance enhancement utilities — production-safe, non-blocking
// IMPORTANT: Do NOT preload /src/* paths (dev-only) or prefetch routes
// that don't have static asset URLs. Vite emits hashed /assets/* in prod.

// Lazy loading with intersection observer (for legacy lazy images)
export const setupLazyLoading = () => {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if (!('IntersectionObserver' in window)) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });

  images.forEach((img) => imageObserver.observe(img));
};

// Optimize fonts — global font-display swap
export const optimizeFonts = () => {
  const style = document.createElement('style');
  style.textContent = `@font-face{font-display:swap}`;
  document.head.appendChild(style);
};

// Initialize all performance optimizations (safe, no broken preloads)
export const initializePerformanceEnhancements = () => {
  const run = () => {
    setupLazyLoading();
    optimizeFonts();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
};
