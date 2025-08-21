import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { useImageOptimization } from '@/hooks/useImageOptimization';
import UniversalImage from './UniversalImage';

interface LazyImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  showIndicators?: boolean;
  showArrows?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  onImageChange?: (index: number) => void;
}

const LazyImageCarousel: React.FC<LazyImageCarouselProps> = ({
  images,
  alt,
  className = '',
  showIndicators = true,
  showArrows = true,
  autoplay = false,
  autoplayInterval = 3000,
  onImageChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  const { preloadImageSet } = useImageOptimization();

  // Preload all carousel images
  useEffect(() => {
    if (images.length > 1) {
      preloadImageSet(images, 2); // Load 2 images concurrently
    }
  }, [images, preloadImageSet]);

  // Swipe gesture support
  const swipeHandlers = useSwipeGestures({
    onSwipeLeft: () => nextImage(),
    onSwipeRight: () => prevImage(),
    threshold: 50
  });

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || images.length <= 1) return;

    const interval = setInterval(() => {
      nextImage();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, images.length, currentIndex]);

  const nextImage = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      const newIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(newIndex);
      onImageChange?.(newIndex);
      setIsTransitioning(false);
    }, 150);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
      onImageChange?.(newIndex);
      setIsTransitioning(false);
    }, 150);
  };

  const goToImage = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      onImageChange?.(index);
      setIsTransitioning(false);
    }, 150);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  if (images.length === 0) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      {...swipeHandlers}
    >
      {/* Main image container */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`absolute inset-0 transition-all duration-500 ${
              index === currentIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <UniversalImage
              src={image}
              alt={`${alt} - Image ${index + 1}`}
              className="w-full h-full"
              priority={index === 0}
              webp={true}
              blur={true}
              adjacentImages={images}
              currentIndex={currentIndex}
              onError={() => handleImageError(index)}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            disabled={isTransitioning}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={nextImage}
            disabled={isTransitioning}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Image indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Mobile swipe hint */}
      {images.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white text-xs bg-black/50 px-3 py-1 rounded-full opacity-80 sm:hidden z-10">
          Swipe for more
        </div>
      )}
    </div>
  );
};

export default LazyImageCarousel;