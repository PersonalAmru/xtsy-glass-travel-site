import { useState, useRef, useCallback } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

interface SwipeHandlers {
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export const useSwipeGestures = (config: SwipeConfig): SwipeHandlers => {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = 50,
    preventDefaultTouchmoveEvent = false
  } = config;

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.targetTouches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
    touchMoveRef.current = null;
  }, []);

  const onTouchMove = useCallback((event: React.TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      event.preventDefault();
    }
    
    const touch = event.targetTouches[0];
    touchMoveRef.current = { x: touch.clientX, y: touch.clientY };
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  }, [preventDefaultTouchmoveEvent]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = Math.abs(touchStart.y - touchEnd.y);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(distanceX) > distanceY && Math.abs(distanceX) > threshold) {
      if (distanceX > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    touchMoveRef.current = null;
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};