import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

interface InstagramPreviewModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
  alt?: string;
}

const InstagramPreviewModal: React.FC<InstagramPreviewModalProps> = ({
  isOpen,
  images,
  initialIndex,
  onClose,
  alt = 'Gallery image',
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setImgLoaded(false);
    }
  }, [isOpen, initialIndex]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goTo(-1);
      if (e.key === 'ArrowRight') goTo(1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, currentIndex, images.length]);

  const goTo = useCallback((dir: number) => {
    setCurrentIndex(prev => (prev + dir + images.length) % images.length);
    setImgLoaded(false);
  }, [images.length]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    setTouchDelta(e.touches[0].clientX - touchStart);
  };

  const onTouchEnd = () => {
    if (Math.abs(touchDelta) > 60) {
      goTo(touchDelta < 0 ? 1 : -1);
    }
    setTouchStart(null);
    setTouchDelta(0);
    setIsSwiping(false);
  };

  if (!isOpen || images.length === 0) return null;

  const modal = (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999 }}
      onClick={(e) => { if (e.target === containerRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        style={{ zIndex: 0 }}
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        style={{ zIndex: 3 }}
        aria-label="Close preview"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium tracking-wide"
          style={{ zIndex: 3 }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Previous */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goTo(-1); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors hidden sm:flex"
          style={{ zIndex: 3 }}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goTo(1); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors hidden sm:flex"
          style={{ zIndex: 3 }}
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Image area — touch-friendly swipe zone */}
      <div
        className="relative flex items-center justify-center w-full h-full px-4 py-16 sm:px-16 sm:py-12"
        style={{ zIndex: 1 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading spinner */}
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg select-none"
          style={{
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease',
            transform: isSwiping ? `translateX(${touchDelta}px)` : 'translateX(0)',
            willChange: 'transform, opacity',
          }}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
            setImgLoaded(true);
          }}
          draggable={false}
        />
      </div>

      {/* Dot indicators — mobile swipe hint */}
      {images.length > 1 && images.length <= 20 && (
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5"
          style={{ zIndex: 3 }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setImgLoaded(false); }}
              className={`rounded-full transition-all duration-200 ${
                i === currentIndex
                  ? 'w-2.5 h-2.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return createPortal(modal, document.body);
};

export default InstagramPreviewModal;
