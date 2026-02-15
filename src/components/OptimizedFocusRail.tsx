/**
 * OptimizedFocusRail - Performance-optimized carousel
 * Key optimizations:
 * - Uses CSS transitions instead of framer-motion for background
 * - Memoizes card rendering
 * - Reduces DOM updates
 * - Lazy loads non-visible cards
 */
"use client";

import * as React from "react";
import { motion, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, Clock, Mountain, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
  href?: string;
  meta?: string;
  duration?: string;
  difficulty?: string;
  price?: string;
  rating?: number;
  highlights?: string[];
  category?: string;
  onClick?: () => void;
};

interface OptimizedFocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  onItemClick?: (item: FocusRailItem) => void;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

// Memoized card component to prevent re-renders
const FocusCard = React.memo(({ 
  item, 
  offset, 
  isCenter, 
  isMobile,
  onClick 
}: { 
  item: FocusRailItem; 
  offset: number; 
  isCenter: boolean; 
  isMobile: boolean;
  onClick: () => void;
}) => {
  const dist = Math.abs(offset);
  const xOffset = offset * (isMobile ? 200 : 320);
  const zOffset = -dist * (isMobile ? 120 : 180);
  const scale = isCenter ? 1 : 0.85;
  const rotateY = offset * -20;
  const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
  
  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'adventure': return 'bg-orange-500 text-white';
      case 'cultural': return 'bg-purple-500 text-white';
      case 'leisure': return 'bg-sky-500 text-white';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <motion.div
      className={cn(
        "absolute w-[280px] h-[380px] md:w-[380px] md:h-[480px] rounded-2xl overflow-hidden shadow-2xl",
        isCenter ? "z-30 ring-2 ring-primary/50 cursor-pointer" : "z-10 cursor-pointer"
      )}
      initial={false}
      animate={{
        x: xOffset,
        scale,
        opacity,
      }}
      style={{
        filter: isCenter ? 'none' : `brightness(0.5)`,
      }}
      whileHover={isCenter ? { scale: 1.02 } : undefined}
      transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
      onClick={onClick}
    >
      {/* Image with loading skeleton */}
      <div className="absolute inset-0 bg-muted animate-pulse" />
      <img
        src={item.imageSrc}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        loading={isCenter ? "eager" : "lazy"}
        decoding="async"
        onLoad={(e) => {
          (e.target as HTMLImageElement).style.opacity = '1';
        }}
        style={{ opacity: 0 }}
      />

      {item.category && (
        <div className="absolute top-4 left-4 z-20">
          <Badge className={cn("text-xs font-semibold capitalize", getCategoryColor(item.category))}>
            {item.category}
          </Badge>
        </div>
      )}

      {item.rating && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-semibold">{item.rating}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
        <h3 className="text-lg md:text-xl font-bold text-white mb-1 line-clamp-2">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-white/80 text-xs md:text-sm line-clamp-2 mb-3">
            {item.description}
          </p>
        )}

        {(item.duration || item.difficulty) && (
          <div className="flex items-center gap-3 mb-3 text-white/70 text-xs">
            {item.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {item.duration}
              </span>
            )}
            {item.difficulty && (
              <span className="flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5" />
                {item.difficulty}
              </span>
            )}
          </div>
        )}

        {item.highlights && item.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.highlights.slice(0, 2).map((highlight, idx) => (
              <span
                key={idx}
                className="bg-white/10 backdrop-blur-sm text-white/90 text-[10px] md:text-xs px-2 py-0.5 rounded-full border border-white/20"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {item.price && (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white/60 text-xs">Starting from</span>
              <p className="text-xl md:text-2xl font-bold text-primary">
                {item.price}
              </p>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-colors">
              Explore
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
});

FocusCard.displayName = 'FocusCard';

export function OptimizedFocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
  onItemClick,
}: OptimizedFocusRailProps) {
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const lastWheelTime = React.useRef(0);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  // Check mobile once on mount
  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 20) {
        delta > 0 ? handleNext() : handlePrev();
        lastWheelTime.current = now;
      }
    },
    [handleNext, handlePrev]
  );

  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = setInterval(handleNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const onDragEnd = (_: any, { offset, velocity }: PanInfo) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -10000) handleNext();
    else if (swipe > 10000) handlePrev();
  };

  const visibleIndices = [-2, -1, 0, 1, 2];

  return (
    <div
      className={cn(
        "relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden select-none outline-none",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
    >
      {/* Optimized background - CSS transition instead of AnimatePresence */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-xl transition-[background-image] duration-500"
          style={{ backgroundImage: `url(${activeItem.imageSrc})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <motion.div
          className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={onDragEnd}
        >
          {visibleIndices.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = items[index];

            if (!loop && (absIndex < 0 || absIndex >= count)) return null;

            return (
              <FocusCard
                key={`${item.id}-${offset}`}
                item={item}
                offset={offset}
                isCenter={offset === 0}
                isMobile={isMobile}
                onClick={() => {
                  if (offset !== 0) {
                    setActive((p) => p + offset);
                  } else if (onItemClick) {
                    onItemClick(item);
                  } else if (item.onClick) {
                    item.onClick();
                  }
                }}
              />
            );
          })}
        </motion.div>

        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 md:px-6 mt-12 md:mt-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="p-3 bg-muted/80 hover:bg-muted backdrop-blur-sm text-foreground rounded-full transition-colors border border-border"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-muted-foreground text-sm font-medium min-w-[3.5rem] text-center">
                {activeIndex + 1} / {count}
              </span>
              <button
                onClick={handleNext}
                className="p-3 bg-muted/80 hover:bg-muted backdrop-blur-sm text-foreground rounded-full transition-colors border border-border"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
