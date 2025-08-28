import React, { useEffect, useRef } from 'react';

/**
 * Custom hook to prevent image flickering during updates
 * Uses image preloading and caching strategies
 */
export const useImageFlickerPrevention = (images: string[]) => {
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  
  useEffect(() => {
    // Preload all images
    images.forEach(src => {
      if (!imageCache.current.has(src)) {
        const img = new Image();
        img.src = src;
        imageCache.current.set(src, img);
      }
    });
  }, [images]);

  return imageCache.current;
};

/**
 * Optimize image loading with lazy loading and intersection observer
 */
export const useOptimizedImageLoading = (src: string) => {
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, [src]);

  return imgRef;
};

/**
 * Image preloader utility for critical images
 */
export const preloadImages = (imageSources: string[]) => {
  return Promise.all(
    imageSources.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    })
  );
};

/**
 * Memoize image components to prevent unnecessary re-renders
 */
export const createMemoizedImageComponent = (
  ImageComponent: React.ComponentType<any>,
  dependencies: any[]
) => {
  return React.memo(ImageComponent, (prevProps, nextProps) => {
    return dependencies.every((dep, index) => 
      prevProps[dep] === nextProps[dep]
    );
  });
};