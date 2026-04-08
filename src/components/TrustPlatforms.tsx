/**
 * TrustPlatforms - Platform trust badges with animated ratings
 * Shows OTA platform logos and ratings for social proof
 */
import { memo } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Platform {
  name: string;
  rating: string;
  scale: string;
  color: string;
  reviewCount?: string;
}

const PLATFORMS: Platform[] = [
  { name: 'Google', rating: '5.0', scale: '/5', color: 'from-blue-500 to-blue-600', reviewCount: '80+' },
  { name: 'Booking.com', rating: '9.8', scale: '/10', color: 'from-blue-700 to-blue-800', reviewCount: '100+' },
  { name: 'Hostelworld', rating: '10', scale: '/10', color: 'from-orange-500 to-orange-600', reviewCount: '20+' },
  { name: 'MakeMyTrip', rating: '4.8', scale: '/5', color: 'from-red-500 to-red-600', reviewCount: '50+' },
  { name: 'Agoda', rating: '9.6', scale: '/10', color: 'from-purple-500 to-purple-600', reviewCount: '30+' },
  { name: 'Airbnb', rating: '4.9', scale: '/5', color: 'from-rose-500 to-rose-600', reviewCount: '15+' },
];

const PlatformBadge = memo(({ platform }: { platform: Platform }) => (
  <div className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md min-w-[130px]">
    <span className="text-sm font-semibold text-foreground">{platform.name}</span>
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
      <span className={cn("text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent", platform.color)}>
        {platform.rating}
      </span>
      <span className="text-xs text-muted-foreground">{platform.scale}</span>
    </div>
    {platform.reviewCount && (
      <span className="text-[10px] text-muted-foreground">{platform.reviewCount} reviews</span>
    )}
  </div>
));
PlatformBadge.displayName = 'PlatformBadge';

const TrustPlatforms = memo(() => (
  <section className="py-10 md:py-14 bg-gradient-to-b from-background to-muted/20">
    <div className="container mx-auto px-4 max-w-5xl text-center">
      <p className="text-sm text-muted-foreground mb-6 font-medium">
        Trusted by thousands of travellers worldwide
      </p>
      
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {PLATFORMS.map(p => (
          <PlatformBadge key={p.name} platform={p} />
        ))}
      </div>
      
      <p className="mt-6 text-xs text-muted-foreground">
        <a
          href="https://g.co/kgs/XTSY"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          Help us grow better by sharing a review <ExternalLink className="h-3 w-3" />
        </a>
      </p>
    </div>
  </section>
));

TrustPlatforms.displayName = 'TrustPlatforms';
export default TrustPlatforms;
