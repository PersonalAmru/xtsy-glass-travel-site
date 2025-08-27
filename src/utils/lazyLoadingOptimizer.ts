// Advanced lazy loading optimizer for 0.2s target performance

// Enhanced image lazy loading with progressive enhancement
export const createAdvancedImageObserver = () => {
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          // Progressive image loading
          const originalSrc = img.dataset.src;
          if (originalSrc) {
            // Create a temporary image to preload
            const tempImg = new Image();
            tempImg.onload = () => {
              img.src = originalSrc;
              img.classList.add('loaded');
            };
            tempImg.src = originalSrc;
          }
          
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: '20px',
      threshold: 0.1
    }
  );

  return imageObserver;
};

// Component-level lazy loading for route components
export const createComponentLazyLoader = () => {
  const componentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const componentName = element.dataset.component;
          
          if (componentName) {
            // Trigger component loading
            import(`../pages/${componentName}`).catch(console.warn);
          }
          
          componentObserver.unobserve(element);
        }
      });
    },
    {
      rootMargin: '100px'
    }
  );

  return componentObserver;
};

// Critical CSS inlining for above-the-fold content
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    .hero-section { opacity: 1; transform: translateY(0); }
    .nav-header { backdrop-filter: blur(10px); }
    .booking-summary { position: sticky; top: 1rem; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};

// Viewport-based resource loading prioritization
export const prioritizeViewportResources = () => {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  // Prioritize resources for current viewport
  const aboveFoldElements = document.querySelectorAll('img, video, iframe');
  
  aboveFoldElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < viewportHeight && rect.left < viewportWidth) {
      // Mark as high priority
      element.setAttribute('fetchpriority', 'high');
      element.setAttribute('loading', 'eager');
    }
  });
};

// Initialize advanced lazy loading
export const initializeAdvancedLazyLoading = () => {
  const imageObserver = createAdvancedImageObserver();
  const componentObserver = createComponentLazyLoader();
  
  // Observe all lazy images
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
  
  // Observe component markers
  document.querySelectorAll('[data-component]').forEach(element => {
    componentObserver.observe(element);
  });
  
  // Apply critical optimizations
  inlineCriticalCSS();
  prioritizeViewportResources();
};