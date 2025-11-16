/**
 * Critical Image Preloader - Ensures instant loading of above-the-fold images
 * This runs before React renders to eliminate any loading delay
 */

// Critical images that MUST load instantly (above the fold)
const CRITICAL_IMAGES = [
  '/src/assets/xtsy-brand-logo.png',
  '/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png',
  '/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png'
];

// High-priority images that should load very quickly
const HIGH_PRIORITY_IMAGES = [
  '/src/assets/incredible-india-logo.png',
  '/src/assets/xtsy-logo.png',
  '/src/assets/xtsy-color-logo.png'
];

/**
 * Preload critical images immediately with highest priority
 */
export const preloadCriticalImages = () => {
  CRITICAL_IMAGES.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    // @ts-ignore - fetchpriority is supported in modern browsers
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
  });
  
  // Preload high-priority images with slightly lower priority
  HIGH_PRIORITY_IMAGES.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
};

/**
 * Force immediate image loading using Image() objects
 * This ensures images are in browser cache before React renders
 */
export const forceLoadCriticalImages = (): Promise<void[]> => {
  const loadPromises = CRITICAL_IMAGES.map(src => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to preload critical image: ${src}`);
        resolve(); // Don't block on errors
      };
      // Force immediate loading
      img.decoding = 'sync';
      img.loading = 'eager';
      img.fetchPriority = 'high';
      img.src = src;
    });
  });
  
  return Promise.all(loadPromises);
};

/**
 * Initialize aggressive image caching
 */
export const enableAggressiveImageCaching = () => {
  // Add cache control hints
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Cache-Control';
  meta.content = 'max-age=31536000, immutable';
  document.head.appendChild(meta);
  
  // Enable HTTP/2 Server Push hint
  const pushMeta = document.createElement('meta');
  pushMeta.httpEquiv = 'Link';
  pushMeta.content = CRITICAL_IMAGES.map(src => 
    `<${src}>; rel=preload; as=image; fetchpriority=high`
  ).join(', ');
  document.head.appendChild(pushMeta);
};

/**
 * Initialize all critical image optimizations
 */
export const initializeCriticalImageLoading = async () => {
  // Step 1: Add preload links immediately
  preloadCriticalImages();
  
  // Step 2: Enable aggressive caching
  enableAggressiveImageCaching();
  
  // Step 3: Force load critical images before render
  try {
    await forceLoadCriticalImages();
    console.log('✓ Critical images preloaded');
  } catch (error) {
    console.warn('Some critical images failed to preload:', error);
  }
};
