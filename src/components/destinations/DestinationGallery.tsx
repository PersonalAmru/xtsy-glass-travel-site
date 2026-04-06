import { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useValidatedImages } from '@/hooks/useValidatedImages';

interface GalleryImage {
  src: string;
  alt: string;
}

interface DestinationGalleryProps {
  images: GalleryImage[];
  destinationName: string;
  className?: string;
}

const DestinationGallery = ({ images, destinationName, className = '' }: DestinationGalleryProps) => {
  const { validImages, loading } = useValidatedImages(images);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const navigate = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;
    if (direction === 'prev') {
      setLightboxIndex(lightboxIndex === 0 ? validImages.length - 1 : lightboxIndex - 1);
    } else {
      setLightboxIndex(lightboxIndex === validImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  // Determine grid columns based on image count
  const gridClass = useMemo(() => {
    const count = validImages.length;
    if (count === 0) return '';
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    return 'grid-cols-2 md:grid-cols-3';
  }, [validImages.length]);

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
        {Array.from({ length: Math.min(images.length, 6) }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-lg" shimmer />
        ))}
      </div>
    );
  }

  if (validImages.length === 0) return null;

  return (
    <>
      <div className={`grid ${gridClass} gap-3 ${className}`}>
        {validImages.map((image, index) => (
          <figure
            key={image.src}
            className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <figcaption className="sr-only">{image.alt}</figcaption>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </figure>
        ))}
      </div>

      {lightboxIndex !== null && (
        <LightboxOverlay
          images={validImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigate}
        />
      )}
    </>
  );
};

const LightboxOverlay = ({ images, index, onClose, onNavigate }: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (dir: 'prev' | 'next') => void;
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white z-50" aria-label="Close lightbox">
        <X className="h-8 w-8" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }} className="absolute left-4 text-white/80 hover:text-white z-50" aria-label="Previous image">
        <ChevronLeft className="h-10 w-10" />
      </button>
      <img
        src={images[index].src}
        alt={images[index].alt}
        className="max-w-[90vw] max-h-[85vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button onClick={(e) => { e.stopPropagation(); onNavigate('next'); }} className="absolute right-4 text-white/80 hover:text-white z-50" aria-label="Next image">
        <ChevronRight className="h-10 w-10" />
      </button>
      <p className="absolute bottom-4 text-white/60 text-sm text-center">
        {images[index].alt} — {index + 1} / {images.length}
      </p>
    </div>
  );
};

export default DestinationGallery;
