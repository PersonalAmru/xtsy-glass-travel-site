
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from "@/lib/utils";

interface UnifiedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  placeholder?: React.ReactNode;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
  threshold?: number;
  rootMargin?: string;
}

// Optimized intersection observer for ultra-fast loading
class FastIntersectionObserver {
  private static observer: IntersectionObserver | null = null;
  private static callbacks = new Map<Element, () => void>();

  static getInstance(): IntersectionObserver {
    if (!this.observer) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const callback = this.callbacks.get(entry.target);
            if (callback) {
              callback();
              this.unobserve(entry.target);
            }
          }
        });
      }, {
        threshold: 0,
        rootMargin: '200px' // Aggressive preloading
      });
    }
    return this.observer;
  }

  static observe(element: Element, callback: () => void) {
    this.callbacks.set(element, callback);
    this.getInstance().observe(element);
  }

  static unobserve(element: Element) {
    this.callbacks.delete(element);
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }
}

const UnifiedImage: React.FC<UnifiedImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  placeholder,
  fallback = '/placeholder.svg',
  onLoad,
  onError,
  sizes,
  srcSet,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : '');
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Ultra-fast intersection observer setup
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const handleIntersection = () => {
      setIsInView(true);
      setCurrentSrc(src);
    };

    FastIntersectionObserver.observe(containerRef.current, handleIntersection);

    return () => {
      if (containerRef.current) {
        FastIntersectionObserver.unobserve(containerRef.current);
      }
    };
  }, [priority, src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (!hasError && fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
      setHasError(true);
    } else {
      setHasError(true);
      onError?.();
    }
  }, [hasError, fallback, currentSrc, onError]);

  // Optimized placeholder that renders immediately
  const optimizedPlaceholder = (
    <div className={cn("bg-gray-100 flex items-center justify-center", className)}>
      <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
    </div>
  );

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {(isInView || priority) && currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={cn(
            "transition-opacity duration-150",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
          srcSet={srcSet}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}
      
      {(!isLoaded || (hasError && !fallback)) && (
        <div className={cn("absolute inset-0", className)}>
          {placeholder || optimizedPlaceholder}
        </div>
      )}
    </div>
  );
};

export default UnifiedImage;

export const cleanupUnifiedImage = () => {
  FastIntersectionObserver.observer?.disconnect();
};
