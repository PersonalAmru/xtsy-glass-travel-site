import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, TreePine } from 'lucide-react';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';

interface MobileImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'photo';
  showIndicators?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onImageChange?: (index: number) => void;
}

const MobileImageCarousel: React.FC<MobileImageCarouselProps> = ({
  images,
  alt,
  className = '',
  aspectRatio = 'photo',
  showIndicators = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  onImageChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [touchOffset, setTouchOffset] = useState(0);
  
  const { preloadAdjacentImages } = useImagePreloader();

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square', 
    photo: 'aspect-[4/3]'
  };

  const nextImage = useCallback(() => {
    if (isTransitioning || images.length <= 1) return;
    
    setIsTransitioning(true);
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    onImageChange?.(nextIndex);
    
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentIndex, images.length, isTransitioning, onImageChange]);

  const prevImage = useCallback(() => {
    if (isTransitioning || images.length <= 1) return;
    
    setIsTransitioning(true);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    onImageChange?.(prevIndex);
    
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentIndex, images.length, isTransitioning, onImageChange]);

  const goToImage = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    onImageChange?.(index);
    
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentIndex, isTransitioning, onImageChange]);

  // Swipe gestures
  const swipeHandlers = useSwipeGestures({
    onSwipeLeft: nextImage,
    onSwipeRight: prevImage,
    threshold: 30
  });

  // Preload adjacent images
  useEffect(() => {
    if (images.length > 1) {
      preloadAdjacentImages(images, currentIndex);
    }
  }, [currentIndex, images, preloadAdjacentImages]);

  // Auto play
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    
    const interval = setInterval(nextImage, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextImage, images.length]);

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const renderImage = (imageIndex: number, isActive: boolean) => {
    const hasError = imageErrors.has(imageIndex);
    
    if (hasError) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <TreePine className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Image unavailable</p>
          </div>
        </div>
      );
    }

    return (
      <img
        src={images[imageIndex]}
        alt={`${alt} - Image ${imageIndex + 1}`}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        onError={() => handleImageError(imageIndex)}
        loading={imageIndex === 0 ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        style={{
          position: isActive ? 'relative' : 'absolute',
          top: isActive ? 'auto' : 0,
          left: isActive ? 'auto' : 0,
          willChange: 'transform, opacity'
        }}
      />
    );
  };

  if (images.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 ${aspectClasses[aspectRatio]} ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <TreePine className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 group ${aspectClasses[aspectRatio]} ${className}`}
      {...swipeHandlers}
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      {/* Image container */}
      <div className="relative w-full h-full">
        {images.map((_, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full"
            style={{
              zIndex: index === currentIndex ? 2 : 1,
              transform: isTransitioning && index === currentIndex 
                ? `translateX(${touchOffset}px)` 
                : 'translateX(0)',
              transition: isTransitioning ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          >
            {renderImage(index, index === currentIndex)}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            disabled={isTransitioning}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 touch-target z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={nextImage}
            disabled={isTransitioning}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 touch-target z-10"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </>
      )}

      {/* Image indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              disabled={isTransitioning}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                currentIndex === index 
                  ? 'bg-white scale-110 shadow-md' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter - smaller and less intrusive */}
      {images.length > 1 && (
        <div className="absolute top-1 right-1 bg-black/50 text-white px-1.5 py-0.5 rounded text-xs font-medium z-10">
          {currentIndex + 1}/{images.length}
        </div>
      )}

      {/* Touch indicator for mobile - smaller and positioned better */}
      <div className="md:hidden absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-xs opacity-40 pointer-events-none">
        Swipe for more
      </div>
    </div>
  );
};

export default MobileImageCarousel;