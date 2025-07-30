import { useState, useEffect } from 'react';

interface UseImagePreloaderReturn {
  preloadedImages: Set<string>;
  preloadImage: (src: string) => void;
  preloadAdjacentImages: (images: string[], currentIndex: number) => void;
}

export const useImagePreloader = (): UseImagePreloaderReturn => {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  const preloadImage = (src: string) => {
    if (preloadedImages.has(src)) return;

    const img = new Image();
    img.onload = () => {
      setPreloadedImages(prev => new Set(prev).add(src));
    };
    img.onerror = () => {
      console.warn(`Failed to preload image: ${src}`);
    };
    img.src = src;
  };

  const preloadAdjacentImages = (images: string[], currentIndex: number) => {
    // Preload next image
    if (currentIndex + 1 < images.length) {
      preloadImage(images[currentIndex + 1]);
    }
    // Preload previous image
    if (currentIndex - 1 >= 0) {
      preloadImage(images[currentIndex - 1]);
    }
    // Preload current image if not already
    if (images[currentIndex]) {
      preloadImage(images[currentIndex]);
    }
  };

  return {
    preloadedImages,
    preloadImage,
    preloadAdjacentImages
  };
};