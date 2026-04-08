/**
 * TrendingDestinations - Horizontal scroll carousel of popular Meghalaya destinations
 * Lazy-loaded images, premium card design, links to destination pages
 */
import { memo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingUp, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDestinationImageUrl, knownImageIndices } from '@/data/meghalayaDestinations';

interface TrendingDestination {
  name: string;
  slug: string;
  tagline: string;
  category: string;
}

const TRENDING: TrendingDestination[] = [
  { name: 'Dawki – Umngot River', slug: 'dawki-umngot-river-guide', tagline: 'Crystal-clear waters & glass-bottom boating', category: 'River' },
  { name: 'Cherrapunjee', slug: 'cherrapunjee-travel-guide', tagline: 'Wettest place on Earth & living root bridges', category: 'Heritage' },
  { name: 'Mawlynnong Village', slug: 'mawlynnong-cleanest-village', tagline: 'Asia\'s cleanest village experience', category: 'Village' },
  { name: 'Laitlum Canyons', slug: 'laitlum-canyons-shillong', tagline: 'Dramatic canyon views above the clouds', category: 'Viewpoint' },
  { name: 'Nongriat Root Bridge', slug: 'double-decker-root-bridge', tagline: 'Trek to the iconic double-decker bridge', category: 'Trek' },
  { name: 'Umiam Lake', slug: 'umiam-lake-shillong', tagline: 'Scenic lake surrounded by pine hills', category: 'Lake' },
  { name: 'Nohkalikai Falls', slug: 'nohkalikai-falls-meghalaya', tagline: 'India\'s tallest plunge waterfall at 340m', category: 'Waterfall' },
  { name: 'Krang Suri Falls', slug: 'krang-suri-falls-meghalaya', tagline: 'Turquoise pool hidden in Jaintia Hills', category: 'Waterfall' },
  { name: 'Mawsmai Cave', slug: 'mawsmai-cave-cherrapunji', tagline: 'Walk through ancient limestone formations', category: 'Cave' },
  { name: 'Shnongpdeng', slug: 'shnongpdeng-camping-meghalaya', tagline: 'Riverside camping & cliff jumping', category: 'Adventure' },
];

// Map slug to image — strip the suffix for meghalayaDestinations lookup
const getImage = (slug: string): string => {
  // Try known image indices first
  const shortSlug = slug.replace(/-meghalaya$/, '').replace(/-shillong$/, '').replace(/-cherrapunji$/, '').replace(/-guide$/, '');
  const indices = knownImageIndices[shortSlug];
  if (indices && indices.length > 0) {
    return getDestinationImageUrl(shortSlug, indices[0]);
  }
  // Fallback to Unsplash for destinations without uploaded images
  const fallbacks: Record<string, string> = {
    'dawki-umngot-river-guide': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=75',
    'cherrapunjee-travel-guide': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=75',
  };
  return fallbacks[slug] || getDestinationImageUrl(shortSlug, 1);
};

const DestinationCard = memo(({ dest }: { dest: TrendingDestination }) => (
  <Link
    to={`/${dest.slug}`}
    className="group flex-shrink-0 w-[280px] sm:w-[320px] rounded-2xl overflow-hidden relative bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
  >
    {/* Image */}
    <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
      <img
        src={getImage(dest.slug)}
        alt={dest.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* Category badge */}
      <div className="absolute top-3 left-3">
        <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium border border-white/10">
          {dest.category}
        </span>
      </div>
      
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white leading-tight mb-1">
          {dest.name}
        </h3>
        <p className="text-white/80 text-xs line-clamp-1">{dest.tagline}</p>
      </div>
    </div>
    
    {/* Bottom bar */}
    <div className="flex items-center justify-between px-4 py-3 bg-card">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        Meghalaya
      </div>
      <span className="text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
        Explore <ChevronRight className="h-3 w-3" />
      </span>
    </div>
  </Link>
));
DestinationCard.displayName = 'DestinationCard';

const TrendingDestinations = memo(() => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === 'left' ? -340 : 340;
    el.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  }, [updateScrollState]);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
              <TrendingUp className="h-3.5 w-3.5" />
              Trending Now
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Popular Destinations
            </h2>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-lg">
              Most visited places in Meghalaya by XTSY travellers
            </p>
          </div>
          
          {/* Navigation arrows - desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                canScrollLeft
                  ? "border-border hover:border-primary hover:bg-primary/5 text-foreground"
                  : "border-border/30 text-muted-foreground/30 cursor-not-allowed"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                canScrollRight
                  ? "border-border hover:border-primary hover:bg-primary/5 text-foreground"
                  : "border-border/30 text-muted-foreground/30 cursor-not-allowed"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {TRENDING.map(dest => (
              <div key={dest.slug} style={{ scrollSnapAlign: 'start' }}>
                <DestinationCard dest={dest} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

TrendingDestinations.displayName = 'TrendingDestinations';
export default TrendingDestinations;
