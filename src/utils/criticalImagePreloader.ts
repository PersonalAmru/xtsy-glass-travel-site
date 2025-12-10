/**
 * Critical Image Preloader - Ensures instant loading of above-the-fold images
 * Uses production-compatible paths (not /src/ paths which don't work in builds)
 */

// Critical images that MUST load instantly (above the fold)
// These paths work in both dev and production
const CRITICAL_IMAGES = [
  '/xtsy-favicon.png',
  '/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png',
  '/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png'
];

// High-priority images that should load very quickly
const HIGH_PRIORITY_IMAGES = [
  '/lovable-uploads/0ef988f7-b7f3-4d1f-80e3-fc2a04acd9cb.png'
];

/**
 * Preload critical images immediately with highest priority
 */
export const preloadCriticalImages = () => {
  // Skip if running on server or document not ready
  if (typeof document === 'undefined') return;

  CRITICAL_IMAGES.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
  });
  
  // Preload high-priority images with slightly lower priority
  HIGH_PRIORITY_IMAGES.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

/**
 * Force immediate image loading using Image() objects
 * This ensures images are in browser cache before React renders
 */
export const forceLoadCriticalImages = (): Promise<void[]> => {
  const loadPromises = CRITICAL_IMAGES.map(src => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        // Don't log warnings for missing images - they're optional
        resolve();
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
 * Initialize aggressive image caching (simplified - no invalid meta tags)
 */
export const enableAggressiveImageCaching = () => {
  // Skip if running on server
  if (typeof document === 'undefined') return;
  
  // Note: Cache-Control should be set via server headers, not meta tags
  // This function is kept for compatibility but does nothing harmful
};

/**
 * Initialize all critical image optimizations
 */
export const initializeCriticalImageLoading = async () => {
  // Skip if running on server
  if (typeof document === 'undefined') return;

  // Step 1: Add preload links immediately
  preloadCriticalImages();
  
  // Step 2: Enable aggressive caching (no-op now)
  enableAggressiveImageCaching();
  
  // Step 3: Force load critical images before render (non-blocking)
  try {
    await forceLoadCriticalImages();
  } catch {
    // Silently continue - image preloading is an optimization, not critical
  }
};
