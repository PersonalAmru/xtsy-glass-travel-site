
import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageLightboxProps {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
  alt?: string;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  images,
  initialIndex,
  onClose,
  alt = 'Room image'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  // Reset current index when modal opens with new images
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToNext = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsLoading(true);
    }
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsLoading(true);
    }
  }, [images.length]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-200"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-200"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Main image */}
      <div className="relative flex items-center justify-center w-full h-full max-w-[90vw] max-h-[85vh] mx-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        <img
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className={cn(
            "max-w-full max-h-[85vh] object-contain rounded-lg transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleImageLoad}
          draggable={false}
        />
      </div>

      {/* Image indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsLoading(true);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                currentIndex === index 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
