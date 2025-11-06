/**
 * Optimized Lazy Loading Utilities
 * Centralized lazy loading configuration for images and components
 */

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  enablePlaceholder?: boolean;
}

const DEFAULT_OPTIONS: LazyLoadOptions = {
  rootMargin: '50px',
  threshold: 0.01,
  enablePlaceholder: true
};

/**
 * Creates an optimized intersection observer for lazy loading
 */
export const createLazyLoadObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: LazyLoadOptions = DEFAULT_OPTIONS
): IntersectionObserver => {
  const observerOptions = {
    root: null,
    rootMargin: options.rootMargin || DEFAULT_OPTIONS.rootMargin,
    threshold: options.threshold || DEFAULT_OPTIONS.threshold
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, observerOptions);
};

/**
 * Lazy load images with native loading attribute and observer fallback
 */
export const optimizeImageLoading = (img: HTMLImageElement, priority: boolean = false) => {
  // Priority images load immediately
  if (priority) {
    img.loading = 'eager';
    img.fetchPriority = 'high';
    return;
  }

  // Use native lazy loading when supported
  if ('loading' in HTMLImageElement.prototype) {
    img.loading = 'lazy';
  } else {
    // Fallback to intersection observer for older browsers
    const observer = createLazyLoadObserver((entry) => {
      const image = entry.target as HTMLImageElement;
      if (image.dataset.src) {
        image.src = image.dataset.src;
        image.removeAttribute('data-src');
      }
      observer.unobserve(image);
    });
    observer.observe(img);
  }
};

/**
 * Preload critical images for above-the-fold content
 */
export const preloadCriticalImages = (imageSources: string[]) => {
  imageSources.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

/**
 * Generate responsive srcset for images
 */
export const generateResponsiveSrcSet = (
  baseSrc: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string => {
  return sizes.map(size => {
    const ext = baseSrc.split('.').pop();
    const nameWithoutExt = baseSrc.replace(`.${ext}`, '');
    return `${nameWithoutExt}-${size}w.${ext} ${size}w`;
  }).join(', ');
};

/**
 * Lazy load component modules using dynamic imports
 */
export const lazyLoadComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn);
};

/**
 * Batch image preloading with progress tracking
 */
export const batchPreloadImages = (
  imageSources: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<void[]> => {
  let loaded = 0;
  const total = imageSources.length;

  return Promise.all(
    imageSources.map((src) => 
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          onProgress?.(loaded, total);
          resolve();
        };
        img.onerror = () => {
          loaded++;
          onProgress?.(loaded, total);
          resolve(); // Resolve even on error to continue
        };
        img.src = src;
      })
    )
  );
};

/**
 * Optimize images based on device pixel ratio
 */
export const getOptimalImageSize = (
  baseWidth: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
): number => {
  return Math.ceil(baseWidth * Math.min(devicePixelRatio, 2)); // Cap at 2x for performance
};

import React from 'react';
