import { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Compass, Droplets, Mountain, Trees, Waves, Footprints, X, ExternalLink } from 'lucide-react';
import { EXPLORER_CATEGORIES, type ExplorerCategory } from '@/data/seoLinkingWheel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CATEGORY_CONFIG: Record<string, {
  gradient: string;
  bgGradient: string;
  icon: React.ReactNode;
  description: string;
  modalDescription: string;
}> = {
  waterfalls: {
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    bgGradient: 'from-blue-950/80 via-cyan-950/40 to-background',
    icon: <Droplets className="h-6 w-6 text-blue-400" />,
    description: 'Discover the tallest plunge waterfalls in India',
    modalDescription: 'Meghalaya is home to some of India\'s most spectacular waterfalls. From the tallest plunge waterfall in India — Nohkalikai Falls (340m) — to the turquoise pools of Krang Suri, explore them all.',
  },
  caves: {
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    bgGradient: 'from-amber-950/80 via-yellow-950/40 to-background',
    icon: <Mountain className="h-6 w-6 text-amber-400" />,
    description: 'Explore the longest cave systems in the subcontinent',
    modalDescription: 'Meghalaya has the longest and deepest cave systems in the Indian subcontinent. Krem Liat Prah stretches over 34 km, while Mawsmai Cave is one of the most accessible limestone caves in Northeast India.',
  },
  villages: {
    gradient: 'from-green-500/20 via-emerald-500/10 to-transparent',
    bgGradient: 'from-green-950/80 via-emerald-950/40 to-background',
    icon: <Trees className="h-6 w-6 text-green-400" />,
    description: 'Experience living root bridges & sacred forests',
    modalDescription: 'Meghalaya\'s Khasi and Jaintia villages preserve centuries-old traditions — from living root bridges grown over generations to sacred groves protected by community law.',
  },
  viewpoints: {
    gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
    bgGradient: 'from-purple-950/80 via-violet-950/40 to-background',
    icon: <Compass className="h-6 w-6 text-purple-400" />,
    description: 'Panoramic views of the Abode of Clouds',
    modalDescription: 'From the dramatic canyons of Laitlum to the sunrise at Nongjrong, Meghalaya offers breathtaking panoramic viewpoints above the clouds.',
  },
  adventure: {
    gradient: 'from-orange-500/20 via-red-500/10 to-transparent',
    bgGradient: 'from-orange-950/80 via-red-950/40 to-background',
    icon: <Footprints className="h-6 w-6 text-orange-400" />,
    description: 'Trek bamboo trails & camp under the stars',
    modalDescription: 'Meghalaya offers world-class adventure — from the legendary Double Decker Root Bridge trek to the thrilling Mawryngkhang bamboo trail and riverside camping at Shnongpdeng.',
  },
  rivers: {
    gradient: 'from-teal-500/20 via-sky-500/10 to-transparent',
    bgGradient: 'from-teal-950/80 via-sky-950/40 to-background',
    icon: <Waves className="h-6 w-6 text-teal-400" />,
    description: 'Crystal-clear rivers & serene lakes',
    modalDescription: 'The Umngot River at Dawki is famous for its crystal-clear water where boats appear to float in mid-air. Umiam Lake and Shnongpdeng offer serene escapes.',
  },
};

const DestinationModalContent = memo(({ cat }: { cat: ExplorerCategory }) => {
  const config = CATEGORY_CONFIG[cat.id] || CATEGORY_CONFIG.waterfalls;

  return (
    <div className="space-y-6">
      {/* Description */}
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
        {config.modalDescription}
      </p>

      {/* Destination grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cat.destinations.map(d => (
          <Link
            key={d.slug}
            to={`/${d.slug}`}
            className="group/card flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm group-hover/card:text-primary transition-colors">
                {d.label}
              </h4>
              <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                View travel guide <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pillar page CTA */}
      <div className="pt-2 border-t border-border/30">
        <Link
          to={`/${cat.pillarSlug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          View complete {cat.label.toLowerCase()} guide
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
});
DestinationModalContent.displayName = 'DestinationModalContent';

const CategoryCard = memo(({ cat, onOpen }: { cat: ExplorerCategory; onOpen: () => void }) => {
  const config = CATEGORY_CONFIG[cat.id] || CATEGORY_CONFIG.waterfalls;

  return (
    <button
      onClick={onOpen}
      className="group relative w-full rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 text-left"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <div className="relative flex items-center gap-4 p-5">
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
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </button>
  );
});
CategoryCard.displayName = 'CategoryCard';

const DestinationExplorer = memo(() => {
  const [openCat, setOpenCat] = useState<ExplorerCategory | null>(null);

  const handleOpen = useCallback((cat: ExplorerCategory) => setOpenCat(cat), []);
  const handleClose = useCallback(() => setOpenCat(null), []);

  const activeConfig = openCat ? (CATEGORY_CONFIG[openCat.id] || CATEGORY_CONFIG.waterfalls) : null;

  return (
    <>
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
                onOpen={() => handleOpen(cat)}
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

      {/* Category modal */}
      <Dialog open={!!openCat} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {openCat && activeConfig && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                    {activeConfig.icon}
                  </div>
                  <DialogTitle className="text-xl font-bold">{openCat.label} in Meghalaya</DialogTitle>
                </div>
              </DialogHeader>
              <DestinationModalContent cat={openCat} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});

DestinationExplorer.displayName = 'DestinationExplorer';

export default DestinationExplorer;
