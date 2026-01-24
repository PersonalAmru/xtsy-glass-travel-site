/**
 * ImageAutoSlider - Infinite auto-scrolling image carousel
 * A hero-ready component with smooth animations and mask gradients
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ImageAutoSliderProps {
  images: string[];
  className?: string;
  height?: string;
  speed?: number; // seconds for full scroll
  showOverlay?: boolean;
}

export const ImageAutoSlider: React.FC<ImageAutoSliderProps> = ({
  images,
  className,
  height = 'h-[50vh] md:h-[60vh]',
  speed = 20,
  showOverlay = true,
}) => {
  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className={cn('relative w-full overflow-hidden', height, className)}>
      {/* Scrolling container with mask */}
      <div 
        className="scroll-container absolute inset-0"
        style={{
          mask: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMask: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        <div 
          className="infinite-scroll flex h-full gap-3"
          style={{
            animation: `scroll-right ${speed}s linear infinite`,
            width: 'max-content',
          }}
        >
          {duplicatedImages.map((image, index) => (
            <div
              key={index}
              className="image-item flex-shrink-0 h-full w-[300px] md:w-[400px] lg:w-[500px] rounded-xl overflow-hidden"
            >
              <img
                src={image}
                alt={`Gallery image ${(index % images.length) + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient overlay for content integration */}
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Keyframes in style tag */}
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          will-change: transform;
        }

        .image-item:hover {
          filter: brightness(1.1);
        }

        @media (prefers-reduced-motion: reduce) {
          .infinite-scroll {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageAutoSlider;
