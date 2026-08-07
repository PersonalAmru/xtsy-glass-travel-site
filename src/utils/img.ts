/**
 * Responsive image variant helper for Supabase Storage optimization
 * Generates srcSet, sizes, and thumbnail placeholders for optimal egress
 */

export interface ImageVariants {
  src: string;
  srcSet: string;
  sizes: string;
  thumb: string;
}

/**
 * Build responsive image variants from a Supabase Storage URL
 * @param fullUrl - Original Supabase Storage URL
 * @returns ImageVariants with responsive sources
 */
export function buildImgVariants(fullUrl: string): ImageVariants {
  if (!fullUrl || !fullUrl.includes('supabase.co/storage')) {
    // Fallback for non-Supabase URLs
    return {
      src: fullUrl || '/placeholder.svg',
      srcSet: '',
      sizes: '',
      thumb: '/placeholder.svg'
    };
  }

  // Extract base URL and extension
  const lastDotIndex = fullUrl.lastIndexOf('.');
  const baseUrl = fullUrl.substring(0, lastDotIndex);
  const extension = fullUrl.substring(lastDotIndex);
  
  // Generate variant URLs with strict naming scheme
  const thumbUrl = `${baseUrl}_thumb.jpg`; // ~150w, JPEG low quality
  const smUrl = `${baseUrl}_sm.webp`;      // ~400w, WebP q≈70
  const mdUrl = `${baseUrl}_md.webp`;      // ~800w, WebP q≈75
  const originalUrl = fullUrl;             // ~1400w+ original

  // Build responsive srcSet
  const srcSet = [
    `${smUrl} 400w`,
    `${mdUrl} 800w`, 
    `${originalUrl} 1400w`
  ].join(', ');

  // Default responsive sizes for optimal loading
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return {
    src: mdUrl, // Default to medium variant
    srcSet,
    sizes,
    thumb: thumbUrl
  };
}

/**
 * Generate responsive image variants for carousels
 * Optimized for limited preloading (1-2 adjacent images only)
 */
export function buildCarouselVariants(fullUrl: string): ImageVariants {
  const variants = buildImgVariants(fullUrl);
  return {
    ...variants,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
  };
}

/**
 * Generate responsive image variants for gallery grid
 * Optimized for small default tabs with lazy loading
 */
export function buildGalleryVariants(fullUrl: string): ImageVariants {
  const variants = buildImgVariants(fullUrl);
  return {
    ...variants,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  };
}

/**
 * Generate responsive image variants for hero sections
 * Uses larger default size for above-the-fold content
 */
export function buildHeroVariants(fullUrl: string): ImageVariants {
  const variants = buildImgVariants(fullUrl);
  return {
    ...variants,
    src: variants.src, // Keep medium as default
    sizes: "100vw" // Full viewport width for heroes
  };
}

/**
 * Check if image URL is a Supabase Storage URL
 */
export function isSupabaseStorageUrl(url: string): boolean {
  return url && url.includes('supabase.co/storage');
}

/**
 * Extract filename from Supabase Storage URL for optimization scripts
 */
export function extractFilename(url: string): string {
  try {
    const urlParts = url.split('/');
    return decodeURIComponent(urlParts[urlParts.length - 1]);
  } catch {
    return '';
  }
}

/**
 * Generate cache-optimized URL with long TTL headers
 * For use with storage-cache-control.ts script
 */
export function buildCachedUrl(baseUrl: string): string {
  if (!isSupabaseStorageUrl(baseUrl)) {
    return baseUrl;
  }
  
  // Add cache busting parameter for immutable content
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}cache=${Date.now()}`;
}