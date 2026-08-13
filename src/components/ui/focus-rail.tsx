"use client";

import * as React from "react";
import { motion, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, Clock, Mountain, Star } from "lucide-react";
import { Link } from "react-router-dom";
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
  originalPrice?: string;
  rating?: number;
  highlights?: string[];
  category?: string;
  onClick?: () => void;
};

interface FocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  onItemClick?: (item: FocusRailItem) => void;
  showDetails?: boolean;
}

/**
 * Helper to wrap indices (e.g., -1 becomes length-1)
 */
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

/**
 * Physics Configuration
 * Base spring for spatial movement (x/z)
 */
const BASE_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/**
 * Scale Spring
 * Bouncier spring specifically for the visual "Click/Tap" feedback on the center card
 */
const TAP_SPRING = {
  type: "spring" as const,
  stiffness: 450,
  damping: 18,
  mass: 1,
};

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
  onItemClick,
  showDetails = true,
}: FocusRailProps) {
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const lastWheelTime = React.useRef(0);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  // --- NAVIGATION HANDLERS ---
  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  // --- MOUSE WHEEL / TRACKPAD LOGIC ---
  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;

      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;

      if (Math.abs(delta) > 20) {
        if (delta > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        lastWheelTime.current = now;
      }
    },
    [handleNext, handlePrev]
  );

  // Autoplay logic
  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = setInterval(() => handleNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  // --- SWIPE / DRAG LOGIC ---
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const onDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  const visibleIndices = [-2, -1, 0, 1, 2];

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'adventure':
        return 'bg-orange-500 text-white';
      case 'cultural':
        return 'bg-purple-500 text-white';
      case 'leisure':
        return 'bg-sky-500 text-white';
      case 'educational':
        return 'bg-emerald-500 text-white';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div
      className={cn(
        "relative w-full h-[580px] md:h-[680px] flex items-center justify-center overflow-hidden select-none outline-hidden",
        className
      )}
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
    >
      {/* Background Ambience - reduced blur for performance */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-xl transition-[background-image] duration-500"
          style={{ backgroundImage: `url(${activeItem.imageSrc})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Main Stage */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* DRAGGABLE RAIL CONTAINER */}
        <motion.div
          className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d" }}
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

            const isCenter = offset === 0;
            const dist = Math.abs(offset);

            // Dynamic transforms - reduced for mobile
            const xOffset = offset * (window.innerWidth < 768 ? 200 : 320);
            const zOffset = -dist * (window.innerWidth < 768 ? 120 : 180);
            const scale = isCenter ? 1 : 0.85;
            const rotateY = offset * -20;

            const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
            const blur = isCenter ? 0 : dist * 6;
            const brightness = isCenter ? 1 : 0.5;

            return (
              <motion.div
                key={`${item.id}-${offset}`}
                className={cn(
                  "absolute w-[280px] h-[380px] md:w-[380px] md:h-[480px] rounded-2xl overflow-hidden shadow-2xl",
                  isCenter
                    ? "z-30 ring-2 ring-primary/50 cursor-pointer"
                    : "z-10 pointer-events-auto cursor-pointer"
                )}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale,
                  rotateY,
                  opacity,
                }}
                whileHover={isCenter ? { scale: 1.03 } : {}}
                whileTap={isCenter ? { scale: 0.97 } : {}}
                transition={BASE_SPRING}
                style={{
                  transformStyle: "preserve-3d",
                  filter: isCenter ? 'none' : `brightness(${brightness})`,
                }}
                onClick={() => {
                  if (offset !== 0) {
                    setActive((p) => p + offset);
                  } else if (onItemClick) {
                    onItemClick(item);
                  } else if (item.onClick) {
                    item.onClick();
                  }
                }}
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

                {/* Category Badge */}
                {item.category && (
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className={cn("text-xs font-semibold capitalize", getCategoryColor(item.category))}>
                      {item.category}
                    </Badge>
                  </div>
                )}

                {/* Rating Badge */}
                {item.rating && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-semibold">{item.rating}</span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-white/80 text-xs md:text-sm line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}

                  {/* Duration & Difficulty */}
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

                  {/* Highlights */}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.highlights.slice(0, 2).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="bg-white/10 backdrop-blur-xs text-white/90 text-[10px] md:text-xs px-2 py-0.5 rounded-full border border-white/20"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  {item.price && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white/60 text-xs">Starting from</span>
                        <div className="flex items-baseline gap-2">
                          {item.originalPrice && (
                            <span className="text-white/40 text-sm line-through">{item.originalPrice}</span>
                          )}
                          <p className="text-xl md:text-2xl font-bold text-primary">
                            {item.price}
                          </p>
                        </div>
                      </div>
                      <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-colors">
                        Explore
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Lighting layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info & Controls - positioned below cards with proper spacing */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 md:px-6 mt-12 md:mt-8">
          <div className="flex items-center justify-center">
            {/* Navigation Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="p-3 bg-muted/80 hover:bg-muted backdrop-blur-xs text-foreground rounded-full transition-colors border border-border"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-muted-foreground text-sm font-medium min-w-[3.5rem] text-center">
                {activeIndex + 1} / {count}
              </span>
              <button
                onClick={handleNext}
                className="p-3 bg-muted/80 hover:bg-muted backdrop-blur-xs text-foreground rounded-full transition-colors border border-border"
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
