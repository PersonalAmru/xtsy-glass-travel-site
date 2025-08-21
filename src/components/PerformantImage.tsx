import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface PerformantImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
  adjacentImages?: string[];
  currentIndex?: number;
}

const PerformantImage: React.FC<PerformantImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder,
  onLoad,
  onError,
  sizes,
  srcSet,
  adjacentImages = [],
  currentIndex = 0
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { preloadAdjacentImages } = useImagePreloader();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Preload adjacent images when this image loads
  useEffect(() => {
    if (isLoaded && adjacentImages.length > 0) {
      preloadAdjacentImages(adjacentImages, currentIndex);
    }
  }, [isLoaded, adjacentImages, currentIndex, preloadAdjacentImages]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const defaultPlaceholder = (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading...</div>
    </div>
  );

  return (
    <div 
      ref={containerRef} 
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      {!isIntersecting ? (
        placeholder || defaultPlaceholder
      ) : (
        <>
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}
          
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300 scale-95",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "sync" : "async"}
            sizes={sizes}
            srcSet={srcSet}
            width={width}
            height={height}
          />
          
          {hasError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-gray-500 text-sm">Failed to load image</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PerformantImage;
