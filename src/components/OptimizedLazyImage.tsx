
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: React.ReactNode;
  threshold?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedLazyImage: React.FC<OptimizedLazyImageProps> = ({
  src,
  alt,
  className,
  fallback = '/placeholder.svg',
  placeholder,
  threshold = 0.1,
  priority = false,
  sizes,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the provided src or Supabase storage URL as fallback
  const imageSource = src || 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg';

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold, 
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, priority]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setImageUrl(imageSource);
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      setHasError(true);
      setImageUrl(fallback);
      onError?.();
    };
    
    img.src = imageSource;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isInView, imageSource, fallback, onLoad, onError]);

  const renderPlaceholder = () => {
    if (placeholder) return placeholder;
    
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto mb-2 animate-bounce"></div>
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {!isInView || !imageUrl ? (
        renderPlaceholder()
      ) : (
        <>
          {/* Loading state */}
          {!isLoaded && (
            <div className="absolute inset-0 z-10">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}

          {/* Error state */}
          {hasError && (
            <div className="absolute inset-0 z-10 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">⚠️</div>
                <div className="text-gray-500 text-xs">Image unavailable</div>
              </div>
            </div>
          )}

          {/* Actual image */}
          <img
            ref={imgRef}
            src={imageUrl}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "low"}
            decoding={priority ? "sync" : "async"}
            sizes={sizes}
            crossOrigin="anonymous"
          />
        </>
      )}
    </div>
  );
};

export default OptimizedLazyImage;
