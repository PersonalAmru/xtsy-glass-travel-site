import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import UnifiedImage from '@/components/UnifiedImage';

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const navigate = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;
    if (direction === 'prev') {
      setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1);
    } else {
      setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
        {images.map((image, index) => (
          <figure
            key={index}
            className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <figcaption className="sr-only">{image.alt}</figcaption>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white z-50"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
            className="absolute left-4 text-white/80 hover:text-white z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <img
            src={images[lightboxIndex].src}
            alt={images[lightboxIndex].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); navigate('next'); }}
            className="absolute right-4 text-white/80 hover:text-white z-50"
            aria-label="Next image"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <p className="absolute bottom-4 text-white/60 text-sm text-center">
            {images[lightboxIndex].alt} — {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
};

export default DestinationGallery;
