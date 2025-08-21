import { useState, useEffect, useCallback } from 'react';

interface ImageOptimizationState {
  preloadedImages: Set<string>;
  isSupportsWebP: boolean;
  devicePixelRatio: number;
  isSlowConnection: boolean;
}

export const useImageOptimization = () => {
  const [state, setState] = useState<ImageOptimizationState>({
    preloadedImages: new Set(),
    isSupportsWebP: false,
    devicePixelRatio: 1,
    isSlowConnection: false
  });

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dataURL = canvas.toDataURL('image/webp');
        setState(prev => ({
          ...prev,
          isSupportsWebP: dataURL.indexOf('data:image/webp') === 0
        }));
      }
    };

    checkWebPSupport();
  }, []);

  // Detect device capabilities
  useEffect(() => {
    setState(prev => ({
      ...prev,
      devicePixelRatio: window.devicePixelRatio || 1
    }));

    // Check connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const isSlowConnection = connection?.effectiveType === 'slow-2g' || 
                               connection?.effectiveType === '2g' ||
                               connection?.saveData;
      
      setState(prev => ({
        ...prev,
        isSlowConnection
      }));
    }
  }, []);

  const preloadImage = useCallback((src: string, priority: 'high' | 'low' = 'low') => {
    if (state.preloadedImages.has(src)) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        setState(prev => ({
          ...prev,
          preloadedImages: new Set(prev.preloadedImages).add(src)
        }));
        resolve();
      };
      
      img.onerror = reject;
      
      // Use fetchPriority if supported
      if ('fetchPriority' in img) {
        (img as any).fetchPriority = priority;
      }
      
      img.src = src;
    });
  }, [state.preloadedImages]);

  const preloadImageSet = useCallback(async (sources: string[], maxConcurrent = 3) => {
    const chunks = [];
    for (let i = 0; i < sources.length; i += maxConcurrent) {
      chunks.push(sources.slice(i, i + maxConcurrent));
    }

    for (const chunk of chunks) {
      try {
        await Promise.all(chunk.map(src => preloadImage(src, 'low')));
      } catch (error) {
        console.warn('Failed to preload image chunk:', error);
      }
    }
  }, [preloadImage]);

  const getOptimalImageSize = useCallback((containerWidth: number) => {
    const { devicePixelRatio, isSlowConnection } = state;
    
    if (isSlowConnection) {
      // Use lower resolution for slow connections
      return Math.ceil(containerWidth * Math.min(devicePixelRatio, 1.5));
    }
    
    return Math.ceil(containerWidth * devicePixelRatio);
  }, [state]);

  const generateSrcSet = useCallback((baseSrc: string, sizes: number[] = [400, 800, 1200]) => {
    if (!baseSrc.includes('supabase.co')) return '';
    
    return sizes.map(size => {
      const url = new URL(baseSrc);
      url.searchParams.set('width', size.toString());
      if (state.isSupportsWebP) {
        url.searchParams.set('format', 'webp');
      }
      return `${url.toString()} ${size}w`;
    }).join(', ');
  }, [state.isSupportsWebP]);

  const getResponsiveSizes = useCallback((breakpoints?: { [key: string]: string }) => {
    const defaultBreakpoints = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    };
    
    const bp = breakpoints || defaultBreakpoints;
    
    return [
      `(max-width: ${bp.sm}) 100vw`,
      `(max-width: ${bp.md}) 50vw`,
      `(max-width: ${bp.lg}) 33vw`,
      '25vw'
    ].join(', ');
  }, []);

  return {
    ...state,
    preloadImage,
    preloadImageSet,
    getOptimalImageSize,
    generateSrcSet,
    getResponsiveSizes
  };
};