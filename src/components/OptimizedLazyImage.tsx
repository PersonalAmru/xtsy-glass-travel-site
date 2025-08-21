import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { XTSY270_DATA } from '@/data/rooms/xtsy270';

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: React.ReactNode;
  threshold?: number;
  priority?: boolean;
}

const OptimizedLazyImage: React.FC<OptimizedLazyImageProps> = ({
  src,
  alt,
  className,
  fallback = '/placeholder.svg',
  placeholder,
  threshold = 0.05,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the XTSY 270° Panorama Glass Ensuite images from the navigation page
  const defaultXTSY270Images = XTSY270_DATA.images;
  const primaryXTSY270Image = XTSY270_DATA.image;
  
  // Select appropriate XTSY 270° image or use provided src
  const imageSource = src && src.trim() !== '' ? src : primaryXTSY270Image;

  useEffect(() => {
    // If priority is true, load immediately
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
      { threshold, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {!isInView ? (
        placeholder || (
          <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
            <div className="text-muted-foreground text-xs">Loading...</div>
          </div>
        )
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center z-10">
              <div className="text-muted-foreground text-xs">Loading...</div>
            </div>
          )}
          <img
            ref={imgRef}
            src={hasError ? fallback : imageSource}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            crossOrigin="anonymous"
          />
        </>
      )}
    </div>
  );
};

export default OptimizedLazyImage;
