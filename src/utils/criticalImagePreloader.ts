/**
 * Critical Image Preloader - Ensures instant loading of above-the-fold images
 * Uses production-compatible paths (not /src/ paths which don't work in builds)
 * 
 * LCP TARGET: < 3.0s - Optimized for fastest paint
 */

// LCP CRITICAL: Hero brand symbol - this is the Largest Contentful Paint element
const LCP_IMAGE = '/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png';

// Secondary critical images (logo, etc.) - limited to essential only
const CRITICAL_IMAGES = [
  '/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png'
];

// Deferred to after LCP
const HIGH_PRIORITY_IMAGES: string[] = [];

// Track if LCP is already loaded to prevent duplicate work
let lcpPreloaded = false;

/**
 * Preload LCP image FIRST with highest priority - runs synchronously
 */
export const preloadLCPImage = () => {
  if (typeof document === 'undefined' || lcpPreloaded) return;
  lcpPreloaded = true;
  
  // Check if already preloaded via HTML <link> tag
  const existing = document.querySelector(`link[href="${LCP_IMAGE}"]`);
  if (existing) return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = LCP_IMAGE;
  link.setAttribute('fetchpriority', 'high');
  link.setAttribute('type', 'image/png');
  // Insert at the very beginning of head for maximum priority
  document.head.insertBefore(link, document.head.firstChild);
};

/**
 * Preload secondary critical images
 */
export const preloadCriticalImages = () => {
  if (typeof document === 'undefined') return;

  // LCP image first
  preloadLCPImage();

  // Then other critical images
  CRITICAL_IMAGES.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
  
  // High-priority images last
  HIGH_PRIORITY_IMAGES.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

/**
 * Force immediate LCP image loading - resolves when LCP image is ready
 */
export const forceLoadLCPImage = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Don't block on error
    img.decoding = 'sync';
    // Use setAttribute for fetchpriority to avoid TS errors
    img.setAttribute('fetchpriority', 'high');
    img.src = LCP_IMAGE;
  });
};

/**
 * Force load all critical images (LCP first, then others)
 */
export const forceLoadCriticalImages = (): Promise<void[]> => {
  // LCP image with highest priority
  const lcpPromise = forceLoadLCPImage();
  
  // Other critical images
  const otherPromises = CRITICAL_IMAGES.map(src => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.decoding = 'async';
      img.src = src;
    });
  });
  
  return Promise.all([lcpPromise, ...otherPromises]);
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
 * Initialize LCP-optimized image loading
 * Priority: LCP image -> Critical images -> High-priority images
 */
export const initializeCriticalImageLoading = async () => {
  if (typeof document === 'undefined') return;

  // Step 1: Preload LCP image immediately (highest priority)
  preloadLCPImage();
  
  // Step 2: Force load LCP image synchronously for fastest paint
  try {
    await forceLoadLCPImage();
  } catch {
    // Continue even if LCP image fails
  }
  
  // Step 3: Preload other critical images (non-blocking)
  preloadCriticalImages();
  
  // Step 4: Enable caching (no-op)
  enableAggressiveImageCaching();
};
