import { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Compass, Droplets, Mountain, Trees, Waves, Footprints } from 'lucide-react';
import { EXPLORER_CATEGORIES, type ExplorerCategory } from '@/data/seoLinkingWheel';

const CATEGORY_CONFIG: Record<string, { gradient: string; icon: React.ReactNode; description: string }> = {
  waterfalls: {
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    icon: <Droplets className="h-6 w-6 text-blue-400" />,
    description: 'Discover the tallest plunge waterfalls in India',
  },
  caves: {
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    icon: <Mountain className="h-6 w-6 text-amber-400" />,
    description: 'Explore the longest cave systems in the subcontinent',
  },
  villages: {
    gradient: 'from-green-500/20 via-emerald-500/10 to-transparent',
    icon: <Trees className="h-6 w-6 text-green-400" />,
    description: 'Experience living root bridges & sacred forests',
  },
  viewpoints: {
    gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
    icon: <Compass className="h-6 w-6 text-purple-400" />,
    description: 'Panoramic views of the Abode of Clouds',
  },
  adventure: {
    gradient: 'from-orange-500/20 via-red-500/10 to-transparent',
    icon: <Footprints className="h-6 w-6 text-orange-400" />,
    description: 'Trek bamboo trails & camp under the stars',
  },
  rivers: {
    gradient: 'from-teal-500/20 via-sky-500/10 to-transparent',
    icon: <Waves className="h-6 w-6 text-teal-400" />,
    description: 'Crystal-clear rivers & serene lakes',
  },
};

const CategoryCard = memo(({ cat, isOpen, onToggle }: { cat: ExplorerCategory; isOpen: boolean; onToggle: () => void }) => {
  const config = CATEGORY_CONFIG[cat.id] || CATEGORY_CONFIG.waterfalls;

  return (
    <div className="group relative rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <button
        onClick={onToggle}
        className="relative w-full flex items-center gap-4 p-5 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base sm:text-lg leading-tight">{cat.label}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">{config.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {cat.destinations.length}
          </span>
          <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {/* Expanded destinations */}
      <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1 border-t border-border/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {cat.destinations.map(d => (
                <Link
                  key={d.slug}
                  to={`/${d.slug}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-200 group/link"
                >
                  <MapPin className="h-3.5 w-3.5 text-primary/60 group-hover/link:text-primary flex-shrink-0" />
                  <span className="truncate">{d.label}</span>
                </Link>
              ))}
            </div>
            <Link
              to={`/${cat.pillarSlug}`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View complete guide
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
CategoryCard.displayName = 'CategoryCard';

const DestinationExplorer = memo(() => {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenId(prev => prev === id ? null : id);
  }, []);

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Compass className="h-4 w-4" />
            Destination Explorer
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Explore Meghalaya Destinations
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Discover waterfalls, caves, villages, and adventure experiences across the Abode of Clouds
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPLORER_CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              isOpen={openId === cat.id}
              onToggle={() => handleToggle(cat.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/all-pages"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            Browse all 300+ destination pages
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
});

DestinationExplorer.displayName = 'DestinationExplorer';

export default DestinationExplorer;
