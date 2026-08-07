/**
 * TrendingDestinations - Horizontal scroll carousel of popular destinations
 * Meghalaya + Northeast + International + XTSY 270 Romantic Escape
 */
import { memo, useRef, useState, useCallback } from 'react';
import { Link } from '@/lib/router-compat';
import { ChevronLeft, ChevronRight, TrendingUp, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDestinationImageUrl, knownImageIndices } from '@/data/meghalayaDestinations';

// XTSY 270 asset import
import xtsy270Stargazing from '@/assets/xtsy-270-stargazing.jpeg';

// Northeast & International asset imports
import assamTeaGardensImg from '@/assets/assam-tea-gardens-premium.jpg';
import arunachalTribalImg from '@/assets/arunachal-tribal-premium.jpg';
import pellingKanchenjungaImg from '@/assets/pelling-kanchenjunga.jpg';
import tawangMonasteryImg from '@/assets/tawang-monastery-mountains.jpg';
import nagalandHornbillImg from '@/assets/nagaland-hornbill-premium.jpg';

interface TrendingDestination {
  name: string;
  /** Full route path the card links to (e.g. "/places-to-visit/dawki-umngot-river"). */
  href: string;
  /** Image key in knownImageIndices (Meghalaya destinations). Optional when imageOverride is set. */
  imageKey?: string;
  tagline: string;
  category: string;
  location: string;
  imageOverride?: string; // direct image URL or imported asset
}

// All Meghalaya cards route to /places-to-visit/<slug> (DestinationDetail) which is
// fast, has no thin-content guard, and is guaranteed to render. Northeast/International
// cards route to /travel. XTSY 270 keeps its dedicated route.
const TRENDING: TrendingDestination[] = [
  // Meghalaya — DestinationDetail route
  { name: 'Dawki – Umngot River', href: '/places-to-visit/dawki-umngot-river', imageKey: 'dawki-umngot-river', tagline: 'Crystal-clear waters & glass-bottom boating', category: 'River', location: 'Meghalaya' },
  { name: 'Nohkalikai Falls', href: '/places-to-visit/nohkalikai-falls', imageKey: 'nohkalikai-falls', tagline: "India's tallest plunge waterfall at 340m", category: 'Waterfall', location: 'Meghalaya' },
  { name: 'Mawlynnong Village', href: '/places-to-visit/mawlynnong-village', imageKey: 'mawlynnong-village', tagline: "Asia's cleanest village experience", category: 'Village', location: 'Meghalaya' },
  { name: 'Laitlum Canyons', href: '/places-to-visit/laitlum-canyons', imageKey: 'laitlum-canyons', tagline: 'Dramatic canyon views above the clouds', category: 'Viewpoint', location: 'Meghalaya' },
  { name: 'Nongriat Root Bridge', href: '/places-to-visit/double-decker-living-root-bridge', imageKey: 'double-decker-living-root-bridge', tagline: 'Trek to the iconic double-decker bridge', category: 'Trek', location: 'Meghalaya' },

  // XTSY 270 Romantic Escape
  { name: 'Romantic Meghalaya Escape', href: '/xtsy-270', tagline: '270° glasshouse glamping under the stars', category: 'Romantic', location: 'Shillong', imageOverride: xtsy270Stargazing },

  // More Meghalaya — DestinationDetail route
  { name: 'Umiam Lake', href: '/places-to-visit/umiam-lake', imageKey: 'umiam-lake', tagline: 'Scenic lake surrounded by pine hills', category: 'Lake', location: 'Meghalaya' },
  { name: 'Elephant Falls', href: '/places-to-visit/elephant-falls', imageKey: 'elephant-falls', tagline: 'Three-tiered waterfall near Shillong', category: 'Waterfall', location: 'Meghalaya' },
  { name: 'Krang Suri Falls', href: '/places-to-visit/krang-suri-falls', imageKey: 'krang-suri-falls', tagline: 'Turquoise pool hidden in Jaintia Hills', category: 'Waterfall', location: 'Meghalaya' },
  { name: 'Mawsmai Cave', href: '/places-to-visit/mawsmai-cave', imageKey: 'mawsmai-cave', tagline: 'Walk through ancient limestone formations', category: 'Cave', location: 'Meghalaya' },
  { name: 'Seven Sisters Falls', href: '/places-to-visit/seven-sisters-falls', imageKey: 'seven-sisters-falls', tagline: 'Multiple cascades down dramatic cliffs', category: 'Waterfall', location: 'Meghalaya' },

  // Northeast India
  { name: 'Tawang Monastery', href: '/travel', tagline: "India's largest Buddhist monastery at 10,000 ft", category: 'Spiritual', location: 'Arunachal Pradesh', imageOverride: tawangMonasteryImg },
  { name: 'Assam Tea Heritage', href: '/travel', tagline: 'Kaziranga wildlife & tea garden trails', category: 'Wildlife', location: 'Assam', imageOverride: assamTeaGardensImg },
  { name: 'Pelling & Kanchenjunga', href: '/travel', tagline: 'Sunrise views of the third highest peak', category: 'Mountain', location: 'Sikkim', imageOverride: pellingKanchenjungaImg },
  { name: 'Arunachal Tribal Trail', href: '/travel', tagline: 'Ancient tribal cultures & Ziro Valley', category: 'Cultural', location: 'Arunachal Pradesh', imageOverride: arunachalTribalImg },
  { name: 'Hornbill Festival', href: '/travel', tagline: "Nagaland's Festival of Festivals", category: 'Festival', location: 'Nagaland', imageOverride: nagalandHornbillImg },

  // International
  { name: 'Vietnam Discovery', href: '/travel', tagline: 'Hanoi, Ha Long Bay & Hoi An lanterns', category: 'International', location: 'Vietnam', imageOverride: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&auto=format&fit=crop&q=75' },
  { name: 'Bali Wellness Retreat', href: '/travel', tagline: 'Yoga, rice terraces & temple ceremonies', category: 'International', location: 'Bali, Indonesia', imageOverride: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=75' },
  { name: 'Nepal Himalayan Trek', href: '/travel', tagline: 'Kathmandu, Pokhara & Poon Hill sunrise', category: 'International', location: 'Nepal', imageOverride: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=75' },
  { name: 'Bhutan Mindful Kingdom', href: '/travel', tagline: "Tiger's Nest & Gross National Happiness", category: 'International', location: 'Bhutan', imageOverride: '/__l5e/assets-v1/7f13bec0-f4d9-43e3-9b1b-ed856f31075c/xtsyvoyage-bhutan-mindful-kingdom-journey.jpeg' },
  { name: 'Thailand Escape', href: '/travel', tagline: 'Temples, islands & street food culture', category: 'International', location: 'Thailand', imageOverride: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&auto=format&fit=crop&q=75' },
];

const getImage = (dest: TrendingDestination): string => {
  if (dest.imageOverride) return dest.imageOverride;
  if (dest.imageKey) {
    const indices = knownImageIndices[dest.imageKey];
    if (indices && indices.length > 0) {
      return getDestinationImageUrl(dest.imageKey, indices[0]);
    }
    return getDestinationImageUrl(dest.imageKey, 1);
  }
  return '';
};

const DestinationCard = memo(({ dest }: { dest: TrendingDestination }) => (
  <Link
    to={dest.href}
    className="group flex-shrink-0 w-[280px] sm:w-[320px] rounded-2xl overflow-hidden relative bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
  >
    <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
      <img
        src={getImage(dest)}
        alt={dest.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      <div className="absolute top-3 left-3">
        {/* Wave 2F — removed backdrop-blur (compositor killer on scroll); solid bg + text-shadow */}
        <span
          className="px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium border border-white/10"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
        >
          {dest.category}
        </span>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white leading-tight mb-1">
          {dest.name}
        </h3>
        <p className="text-white/80 text-xs line-clamp-1">{dest.tagline}</p>
      </div>
    </div>
    
    <div className="flex items-center justify-between px-4 py-3 bg-card">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        {dest.location}
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
    <section
      id="popular-destinations"
      aria-label="Popular Destinations"
      className="py-10 md:py-16 bg-background scroll-mt-24"
      style={{ contain: 'layout style', minHeight: '420px' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-end justify-between mb-6 md:mb-8 gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] sm:text-xs font-medium mb-2 sm:mb-3">
              <TrendingUp className="h-3.5 w-3.5" />
              Trending Now
            </div>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground leading-tight">
              Popular Destinations
            </h2>
            <p className="mt-1.5 sm:mt-2 text-muted-foreground text-xs sm:text-sm md:text-base max-w-lg leading-snug">
              Top picks across Meghalaya, Northeast India & beyond
            </p>
          </div>
          
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

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
            style={{ scrollSnapType: 'x mandatory', minHeight: '288px' }}
          >
            {TRENDING.map((dest, i) => (
              <div key={`${dest.href}-${i}`} style={{ scrollSnapAlign: 'start' }}>
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
