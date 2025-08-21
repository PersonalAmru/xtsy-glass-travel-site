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

// Shared intersection observer instance for better performance
class SharedIntersectionObserver {
  private static observer: IntersectionObserver | null = null;
  private static callbacks = new Map<Element, () => void>();

  static getInstance(options: IntersectionObserverInit = {}): IntersectionObserver {
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
        threshold: 0.1,
        rootMargin: '50px',
        ...options
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

  static cleanup() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.callbacks.clear();
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
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : '');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const handleIntersection = () => {
      setIsInView(true);
      setCurrentSrc(src);
    };

    SharedIntersectionObserver.observe(containerRef.current, handleIntersection);

    return () => {
      if (containerRef.current) {
        SharedIntersectionObserver.unobserve(containerRef.current);
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

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        SharedIntersectionObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const defaultPlaceholder = (
    <div className={cn("animate-pulse bg-muted rounded", className)}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 bg-muted-foreground/20 rounded" />
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      {(isInView || priority) && currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
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
      
      {(!isInView || !isLoaded || (hasError && !fallback)) && (
        <div className={cn("absolute inset-0", className)}>
          {placeholder || defaultPlaceholder}
        </div>
      )}
    </div>
  );
};

export default UnifiedImage;

// Cleanup function to be called on app unmount
export const cleanupUnifiedImage = () => {
  SharedIntersectionObserver.cleanup();
};