
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
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the Supabase storage URL with Arunachal Pradesh image as default
  const imageSource = src || 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg';

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsLoading(true);
          observer.disconnect();
        }
      },
      { 
        threshold, 
        rootMargin: '100px' // Increased root margin for better preloading
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, priority]);

  // Preload the image when it comes into view
  useEffect(() => {
    if (!isInView || isLoaded || hasError) return;

    const img = new Image();
    img.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
      onLoad?.();
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };
    img.src = imageSource;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isInView, imageSource, isLoaded, hasError, onLoad, onError]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

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
      {!isInView ? (
        renderPlaceholder()
      ) : (
        <>
          {/* Loading placeholder with improved animation */}
          {(isLoading || !isLoaded) && !hasError && (
            <div className="absolute inset-0 z-10">
              <div 
                className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 animate-pulse"
                style={{
                  backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0.05) 100%)',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
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
            src={hasError ? fallback : imageSource}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 ease-out",
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "low"}
            decoding={priority ? "sync" : "async"}
            sizes={sizes}
            crossOrigin="anonymous"
            style={{
              filter: isLoaded ? 'none' : 'blur(5px)',
              transform: isLoaded ? 'scale(1)' : 'scale(1.05)'
            }}
          />
        </>
      )}
    </div>
  );
};

export default OptimizedLazyImage;
