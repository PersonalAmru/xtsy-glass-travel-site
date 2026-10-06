import { Link } from '@/lib/router-compat';
import type { SEOPageCategory } from '@/data/seoPages';

interface ClusterLink {
  slug: string;
  label: string;
}

const PILLAR_CLUSTERS: Record<string, { pillar: ClusterLink; children: ClusterLink[] }> = {
  hostels: {
    pillar: { slug: 'best-hostel-in-shillong', label: 'Best Hostel in Shillong' },
    children: [
      { slug: 'backpacker-hostel-shillong', label: 'Backpacker Hostel' },
      { slug: 'cheap-hostels-shillong', label: 'Budget-Friendly Hostels' },
      { slug: 'solo-travel-hostel-shillong', label: 'Solo Travel Hostel' },
      { slug: 'couples-hostel-shillong', label: 'Couples Hostel' },
      { slug: 'group-stay-shillong', label: 'Group Stay' },
    ],
  },
  tours: {
    pillar: { slug: 'meghalaya-tour-packages', label: 'Meghalaya Tour Packages' },
    children: [
      { slug: 'cherrapunji-tour-package', label: 'Cherrapunji Tour' },
      { slug: 'dawki-tour-package', label: 'Dawki Tour' },
      { slug: 'nongjrong-tour-package', label: 'Nongjrong Trek' },
      { slug: 'shillong-tour-package', label: 'Shillong Tour' },
    ],
  },
  'travel-guides': {
    pillar: { slug: 'things-to-do-in-meghalaya', label: 'Things to Do in Meghalaya' },
    children: [
      { slug: 'cherrapunji-travel-guide', label: 'Cherrapunji Guide' },
      { slug: 'dawki-travel-guide', label: 'Dawki Guide' },
      { slug: 'how-to-reach-shillong', label: 'How to Reach Shillong' },
      { slug: 'meghalaya-monsoon-travel-guide', label: 'Monsoon Travel' },
    ],
  },
  itineraries: {
    pillar: { slug: 'meghalaya-3-day-itinerary', label: '3-Day Meghalaya Itinerary' },
    children: [
      { slug: '2-day-shillong-itinerary', label: '2-Day Shillong' },
      { slug: '5-day-meghalaya-itinerary', label: '5-Day Meghalaya' },
      { slug: '7-day-meghalaya-itinerary', label: '7-Day Meghalaya' },
      { slug: '10-day-meghalaya-itinerary', label: '10-Day Meghalaya' },
    ],
  },
  destinations: {
    pillar: { slug: 'things-to-do-in-meghalaya', label: 'Explore Meghalaya' },
    children: [
      { slug: 'nohkalikai-falls-guide', label: 'Nohkalikai Falls' },
      { slug: 'living-root-bridges-meghalaya', label: 'Living Root Bridges' },
      { slug: 'dawki-river-guide', label: 'Dawki River' },
      { slug: 'mawlynnong-cleanest-village', label: 'Mawlynnong Village' },
    ],
  },
};

const TopicalClusterNav = ({ category, currentSlug }: { category: SEOPageCategory; currentSlug: string }) => {
  const cluster = PILLAR_CLUSTERS[category];
  if (!cluster) return null;

  return (
    <nav className="mt-10 border border-border rounded-xl p-5 bg-muted/20" aria-label="Topic cluster navigation">
      <h3 className="text-sm font-semibold text-foreground mb-3">📚 Explore This Topic</h3>
      <div className="space-y-1.5">
        <Link
          to={`/${cluster.pillar.slug}`}
          className={`block text-sm px-3 py-1.5 rounded-md transition-colors ${
            cluster.pillar.slug === currentSlug
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
          }`}
        >
          ★ {cluster.pillar.label} (Pillar Guide)
        </Link>
        {cluster.children.map(child => (
          <Link
            key={child.slug}
            to={`/${child.slug}`}
            className={`block text-sm px-3 py-1.5 rounded-md ml-3 transition-colors ${
              child.slug === currentSlug
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
            }`}
          >
            → {child.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default TopicalClusterNav;
