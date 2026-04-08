import { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, MapPin } from 'lucide-react';
import { EXPLORER_CATEGORIES, type ExplorerCategory } from '@/data/seoLinkingWheel';

const CategoryCard = memo(({ cat, isOpen, onToggle }: { cat: ExplorerCategory; isOpen: boolean; onToggle: () => void }) => (
  <div className="border border-border rounded-xl overflow-hidden bg-card transition-shadow hover:shadow-md">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left"
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">{cat.icon}</span>
        <div>
          <span className="font-semibold text-foreground text-sm">{cat.label}</span>
          <span className="ml-2 text-xs text-muted-foreground">({cat.destinations.length} places)</span>
        </div>
      </div>
      {isOpen
        ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
        : <ChevronRight className="h-4 w-4 text-muted-foreground" />
      }
    </button>
    {isOpen && (
      <div className="px-4 pb-4 border-t border-border pt-3">
        <ul className="space-y-1.5">
          {cat.destinations.map(d => (
            <li key={d.slug}>
              <Link
                to={`/${d.slug}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
              >
                <MapPin className="h-3 w-3 flex-shrink-0" />
                {d.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to={`/${cat.pillarSlug}`}
          className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
        >
          View complete guide →
        </Link>
      </div>
    )}
  </div>
));
CategoryCard.displayName = 'CategoryCard';

const DestinationExplorer = memo(() => {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenId(prev => prev === id ? null : id);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Explore Meghalaya Destinations
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Discover waterfalls, caves, villages, and adventure experiences across the Abode of Clouds
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPLORER_CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              isOpen={openId === cat.id}
              onToggle={() => handleToggle(cat.id)}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/all-pages"
            className="text-sm text-primary hover:underline font-medium"
          >
            Browse all {300}+ destination pages →
          </Link>
        </div>
      </div>
    </section>
  );
});

DestinationExplorer.displayName = 'DestinationExplorer';

export default DestinationExplorer;
