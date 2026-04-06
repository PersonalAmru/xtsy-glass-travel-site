'use client';

import React, { useEffect, useState, useCallback } from 'react';

type ArcGalleryHeroProps = {
  images: { src: string; alt: string; label?: string; slug?: string }[];
  startAngle?: number;
  endAngle?: number;
  radiusLg?: number;
  radiusMd?: number;
  radiusSm?: number;
  cardSizeLg?: number;
  cardSizeMd?: number;
  cardSizeSm?: number;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  cta?: React.ReactNode;
  onCardClick?: (index: number) => void;
};

export const ArcGalleryHero: React.FC<ArcGalleryHeroProps> = ({
  images,
  startAngle = 20,
  endAngle = 160,
  radiusLg = 480,
  radiusMd = 360,
  radiusSm = 260,
  cardSizeLg = 120,
  cardSizeMd = 100,
  cardSizeSm = 80,
  className = '',
  title,
  subtitle,
  cta,
  onCardClick,
}) => {
  const [dimensions, setDimensions] = useState({
    radius: radiusLg,
    cardSize: cardSizeLg,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({ radius: radiusSm, cardSize: cardSizeSm });
      } else if (width < 1024) {
        setDimensions({ radius: radiusMd, cardSize: cardSizeMd });
      } else {
        setDimensions({ radius: radiusLg, cardSize: cardSizeLg });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  // Track which images failed to load
  const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());

  const handleImageError = useCallback((index: number) => {
    setFailedIndexes(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  // Filter to only valid images for arc positioning
  const validEntries = images
    .map((img, i) => ({ img, originalIndex: i }))
    .filter(({ originalIndex }) => !failedIndexes.has(originalIndex));

  const count = Math.max(validEntries.length, 2);
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <section
      className={`relative w-full bg-background overflow-x-clip ${className}`}
      style={{ minHeight: `${dimensions.radius * 2 + dimensions.cardSize + 200}px` }}
    >
      {/* Arc container */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: dimensions.radius * 2,
          height: dimensions.radius * 2,
          bottom: dimensions.cardSize < 100 ? '40%' : '35%',
        }}
      >
        {/* Pivot at bottom center */}
        <div
          className="absolute"
          style={{
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
          }}
        >
          {validEntries.map(({ img, originalIndex }, i) => {
            const angle = startAngle + step * i;
            const angleRad = (angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * dimensions.radius;
            const y = Math.sin(angleRad) * dimensions.radius;

            return (
              <div
                key={originalIndex}
                className="absolute"
                style={{
                  width: dimensions.cardSize,
                  height: dimensions.cardSize,
                  left: x - dimensions.cardSize / 2,
                  bottom: y - dimensions.cardSize / 2,
                  transform: `rotate(${-(90 - angle)}deg)`,
                  animation: `arc-card-appear 0.6s ease-out ${i * 0.08}s both`,
                }}
              >
                <div
                  className="w-full h-full rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-10 group relative"
                  onClick={() => onCardClick?.(originalIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onCardClick?.(originalIndex);
                    }
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => handleImageError(originalIndex)}
                  />
                  {img.label && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                      <span className="text-white text-[10px] sm:text-xs font-medium leading-tight truncate">
                        {img.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content overlay */}
      <div
        className="absolute left-1/2 w-full px-4"
        style={{
          bottom: '8%',
          transform: 'translateX(-50%)',
          animation: 'arc-fade-in-up 0.8s ease-out 0.5s both',
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          {title}
          {subtitle}
          {cta}
        </div>
      </div>

      <style>{`
        @keyframes arc-card-appear {
          from {
            opacity: 0;
            transform: rotate(${0}deg) scale(0.5);
          }
          to {
            opacity: 1;
          }
        }
        @keyframes arc-fade-in-up {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </section>
  );
};
