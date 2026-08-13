import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { buildImgVariants, buildCarouselVariants, buildGalleryVariants, buildHeroVariants, isSupabaseStorageUrl } from '@/utils/img';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  variant?: 'default' | 'carousel' | 'gallery' | 'hero';
  placeholder?: React.ReactNode;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
}

/**
 * High-performance optimized image component with responsive variants
 * Automatically generates srcSet and sizes for Supabase Storage images
 * Uses blur thumbnail placeholders and lazy loading for optimal egress
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  variant = 'default',
  placeholder,
  fallback = '/placeholder.svg',
  onLoad,
  onError,
  loading = 'lazy'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : '');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive variants based on image type
  const variants = React.useMemo(() => {
    if (!isSupabaseStorageUrl(src)) {
      return { src, srcSet: '', sizes: '', thumb: fallback };
    }

    switch (variant) {
      case 'carousel':
        return buildCarouselVariants(src);
      case 'gallery':
        return buildGalleryVariants(src);
      case 'hero':
        return buildHeroVariants(src);
      default:
        return buildImgVariants(src);
    }
  }, [src, variant, fallback]);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(src);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority, src]);

  // Handle image load
  const handleLoad = React.useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Handle image error with fallback
  const handleError = React.useCallback(() => {
    if (!hasError && fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
      setHasError(true);
    } else {
      setHasError(true);
      onError?.();
    }
  }, [hasError, fallback, currentSrc, onError]);

  // Default blur placeholder for Supabase images
  const defaultPlaceholder = isSupabaseStorageUrl(src) ? (
    <img
      src={variants.thumb}
      alt={alt ? `Loading ${alt}` : 'Loading image'}
      className={cn("w-full h-full object-cover blur-xs transition-opacity duration-300", className)}
      loading="eager"
    />
  ) : (
    <div className={cn("bg-gray-100 flex items-center justify-center", className)}>
      <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
    </div>
  );

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Main image */}
      {(isInView || priority) && currentSrc && (
        <img
          ref={imgRef}
          src={variants.src}
          srcSet={variants.srcSet}
          sizes={variants.sizes}
          alt={alt}
          className={cn(
            "transition-opacity duration-300 w-full h-full object-cover",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : loading}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      )}
      
      {/* Placeholder/Loading state */}
      {(!isLoaded || (hasError && !fallback)) && (
        <div className={cn("absolute inset-0", className)}>
          {placeholder || defaultPlaceholder}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;