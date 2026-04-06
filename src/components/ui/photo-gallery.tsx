import { useState, useEffect, forwardRef, Ref } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

type Direction = 'left' | 'right';

interface PhotoItem {
  src: string;
  alt: string;
  label?: string;
  slug?: string;
}

interface PhotoGalleryProps {
  images: PhotoItem[];
  animationDelay?: number;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  cta?: React.ReactNode;
  onPhotoClick?: (index: number) => void;
  className?: string;
}

function getRandomNumberInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const MotionImg = motion(
  forwardRef(function MotionImg(
    props: React.ImgHTMLAttributes<HTMLImageElement>,
    ref: Ref<HTMLImageElement>
  ) {
    return <img ref={ref} {...props} />;
  })
);

const Photo = ({
  src,
  alt,
  className,
  direction = 'right',
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
}) => {
  const [rotation, setRotation] = useState(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    setRotation(getRandomNumberInRange(1, 4) * (direction === 'left' ? -1 : 1));
  }, [direction]);

  const handleMouse = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      style={{ rotate: rotation }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      className={cn('rounded-xl overflow-hidden border-2 border-white/10 shadow-xl', className)}
    >
      <div
        onMouseMove={handleMouse}
        onMouseLeave={resetMouse}
        className="relative w-full h-full"
      >
        <MotionImg
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </motion.div>
  );
};

export const PhotoGallery = ({
  images,
  animationDelay = 0.5,
  title,
  subtitle,
  cta,
  onPhotoClick,
  className = '',
}: PhotoGalleryProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setIsVisible(true), animationDelay * 1000);
    const t2 = setTimeout(() => setIsLoaded(true), (animationDelay + 0.4) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [animationDelay]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  // Positions: 5 photos spread horizontally
  const positions = [
    { x: '-320px', xSm: '-140px', y: '15px', zIndex: 50, direction: 'left' as Direction },
    { x: '-160px', xSm: '-70px', y: '32px', zIndex: 40, direction: 'left' as Direction },
    { x: '0px', xSm: '0px', y: '8px', zIndex: 30, direction: 'right' as Direction },
    { x: '160px', xSm: '70px', y: '22px', zIndex: 20, direction: 'right' as Direction },
    { x: '320px', xSm: '140px', y: '44px', zIndex: 10, direction: 'left' as Direction },
  ];

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const photos = images.slice(0, 5).map((img, i) => ({
    ...img,
    ...positions[i],
    order: i,
  }));

  const photoVariants = {
    hidden: () => ({ x: 0, y: 0, rotate: 0, scale: 1 }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  };

  const cardSize = isMobile ? 100 : 180;

  return (
    <section className={cn('relative w-full bg-background py-12 md:py-20 overflow-hidden', className)}>
      {/* Title area */}
      <div className="text-center mb-4 px-4">
        {title}
        {subtitle}
      </div>

      {/* Photo spread */}
      <div
        className={cn(
          'relative mx-auto flex items-center justify-center transition-opacity duration-500',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{ height: isMobile ? '200px' : '320px' }}
      >
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          style={{ width: 0, height: 0 }}
        >
          {[...photos].reverse().map((photo) => {
            const customVal = {
              x: isMobile ? photo.xSm : photo.x,
              y: photo.y,
              order: photo.order,
            };
            return (
              <motion.div
                key={photo.order}
                custom={customVal}
                variants={photoVariants}
                className="absolute cursor-pointer"
                style={{
                  width: cardSize,
                  height: cardSize,
                  left: -cardSize / 2,
                  top: -cardSize / 2,
                  zIndex: photo.zIndex,
                }}
                onClick={() => onPhotoClick?.(photo.order)}
              >
                <Photo
                  src={photo.src}
                  alt={photo.alt}
                  direction={photo.direction}
                  className="w-full h-full"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* CTA area */}
      <div className="text-center mt-6 px-4">
        {cta}
      </div>
    </section>
  );
};
