import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface UniversalImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  webp?: boolean;
  fallback?: string;
  placeholder?: React.ReactNode;
  threshold?: number;
  sizes?: string;
  srcSet?: string;
  adjacentImages?: string[];
  currentIndex?: number;
  onLoad?: () => void;
  onError?: () => void;
  blur?: boolean;
  preload?: boolean;
}

const UniversalImage: React.FC<UniversalImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  webp = true,
  fallback = '/placeholder.svg',
  placeholder,
  threshold = 0.1,
  sizes,
  srcSet,
  adjacentImages,
  currentIndex,
  onLoad,
  onError,
  blur = true,
  preload = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate WebP and fallback sources
  const getImageSources = (originalSrc: string) => {
    if (!webp) return { webp: '', original: originalSrc };
    
    try {
      const url = new URL(originalSrc, window.location.origin);
      const isSupabaseImage = url.hostname.includes('supabase.co');
      
      if (isSupabaseImage) {
        // For Supabase images, use transform API for WebP
        const webpSrc = `${originalSrc}?format=webp`;
        return { webp: webpSrc, original: originalSrc };
      } else {
        // For local assets, generate WebP version
        const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        return { webp: webpSrc, original: originalSrc };
      }
    } catch {
      return { webp: '', original: originalSrc };
    }
  };

  const { webp: webpSrc, original: originalSrc } = getImageSources(src);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, priority]);

  // Preload adjacent images
  useEffect(() => {
    if (!isLoaded || !adjacentImages || currentIndex === undefined) return;

    const preloadImage = (imageSrc: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageSrc;
      document.head.appendChild(link);
    };

    // Preload next and previous images
    if (currentIndex + 1 < adjacentImages.length) {
      preloadImage(adjacentImages[currentIndex + 1]);
    }
    if (currentIndex - 1 >= 0) {
      preloadImage(adjacentImages[currentIndex - 1]);
    }
  }, [isLoaded, adjacentImages, currentIndex]);

  // Preload critical images immediately
  useEffect(() => {
    if (preload || priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = originalSrc;
      link.fetchPriority = priority ? 'high' : 'low';
      document.head.appendChild(link);
    }
  }, [originalSrc, preload, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsPreloading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    setIsPreloading(false);
    onError?.();
  };

  const renderPlaceholder = () => {
    if (placeholder) return placeholder;
    
    return (
      <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {!isInView ? (
        renderPlaceholder()
      ) : (
        <>
          {/* Loading placeholder with blur effect */}
          {!isLoaded && (
            <div className="absolute inset-0 z-10">
              {blur ? (
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0.1) 100%)',
                    filter: 'blur(10px)'
                  }}
                />
              ) : (
                renderPlaceholder()
              )}
            </div>
          )}

          {/* Actual image with WebP support */}
          {webpSrc && webp ? (
            <picture>
              <source srcSet={webpSrc} type="image/webp" />
              <img
                ref={imgRef}
                src={hasError ? fallback : originalSrc}
                alt={alt}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
                sizes={sizes}
                srcSet={srcSet}
                onLoad={handleLoad}
                onError={handleError}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "low"}
                decoding={priority ? "sync" : "async"}
                crossOrigin="anonymous"
              />
            </picture>
          ) : (
            <img
              ref={imgRef}
              src={hasError ? fallback : originalSrc}
              alt={alt}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              )}
              sizes={sizes}
              srcSet={srcSet}
              onLoad={handleLoad}
              onError={handleError}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "low"}
              decoding={priority ? "sync" : "async"}
              crossOrigin="anonymous"
            />
          )}
        </>
      )}
    </div>
  );
};

export default UniversalImage;