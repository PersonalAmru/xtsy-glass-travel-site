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
  onImageClick?: (images: string[], currentIndex: number) => void;
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
  onImageChange,
  onImageClick
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

  const handleImageClick = useCallback(() => {
    if (onImageClick && images.length > 0) {
      onImageClick(images, currentIndex);
    }
  }, [onImageClick, images, currentIndex]);

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
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center px-2">
            <TreePine className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-1 sm:mb-2" />
            <p className="text-gray-500 text-xs sm:text-sm">Image unavailable</p>
          </div>
        </div>
      );
    }

    return (
      <img
        src={images[imageIndex]}
        alt={`${alt} - Image ${imageIndex + 1}`}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-300 cursor-pointer ${
          isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        onError={() => handleImageError(imageIndex)}
        onClick={handleImageClick}
        loading={imageIndex === 0 ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        style={{
          willChange: 'transform, opacity',
          minHeight: '100%',
          minWidth: '100%'
        }}
      />
    );
  };

  if (images.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 ${aspectClasses[aspectRatio]} ${className}`} style={{ minHeight: '200px' }}>
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <div className="text-center px-2">
            <TreePine className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs sm:text-sm">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 group ${aspectClasses[aspectRatio]} ${className}`}
      {...swipeHandlers}
      style={{ 
        touchAction: 'pan-y pinch-zoom',
        minHeight: '200px'
      }}
    >
      {/* Image container */}
      <div className="relative w-full h-full min-h-full">
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
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            disabled={isTransitioning}
            className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed touch-target z-20"
            aria-label="Previous image"
            type="button"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            disabled={isTransitioning}
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed touch-target z-20"
            aria-label="Next image"
            type="button"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </button>
        </>
      )}

      {/* Image indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5 sm:space-x-1 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); goToImage(index); }}
              disabled={isTransitioning}
              type="button"
              className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-200 ${
                currentIndex === index 
                  ? 'bg-white scale-110 shadow-md' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter - optimized size */}
      {images.length > 1 && (
        <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 bg-black/50 text-white px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium z-10">
          {currentIndex + 1}/{images.length}
        </div>
      )}

      {/* Touch indicator for mobile - optimized positioning */}
      <div className="md:hidden absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-[10px] sm:text-xs opacity-40 pointer-events-none">
        Swipe for more
      </div>
    </div>
  );
};

export default MobileImageCarousel;
