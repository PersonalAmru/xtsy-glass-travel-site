/**
 * SEOFooterLinks - Internal linking hub for homepage SEO crawl architecture
 * Links to all major pillar pages, destination clusters, and guides
 */
import { memo } from 'react';
import { Link } from '@/lib/router-compat';
import { Compass } from 'lucide-react';

interface LinkGroup {
  title: string;
  links: { label: string; to: string }[];
}

const LINK_GROUPS: LinkGroup[] = [
  {
    title: 'Travel Guides',
    links: [
      { label: 'Meghalaya Travel Guide', to: '/meghalaya-travel-guide' },
      { label: 'Places to Visit in Meghalaya', to: '/places-to-visit-meghalaya' },
      { label: 'Things to Do in Meghalaya', to: '/things-to-do-in-meghalaya' },
      { label: 'Shillong Travel Guide', to: '/shillong-travel-guide' },
      { label: 'Cherrapunjee Travel Guide', to: '/cherrapunji-travel-guide' },
    ],
  },
  {
    title: 'Top Destinations',
    links: [
      { label: 'Waterfalls in Meghalaya', to: '/meghalaya-waterfalls' },
      { label: 'Caves in Meghalaya', to: '/meghalaya-caves-guide' },
      { label: 'Trekking in Meghalaya', to: '/trekking-in-meghalaya' },
      { label: 'Dawki & Umngot River', to: '/dawki-umngot-river-guide' },
      { label: 'Camping in Meghalaya', to: '/camping-in-meghalaya' },
    ],
  },
  {
    title: 'Itineraries',
    links: [
      { label: '3-Day Meghalaya Itinerary', to: '/meghalaya-3-day-itinerary' },
      { label: '5-Day Meghalaya Itinerary', to: '/5-day-meghalaya-itinerary' },
      { label: '7-Day Meghalaya Itinerary', to: '/7-day-meghalaya-itinerary' },
      { label: 'Meghalaya Tour Packages', to: '/meghalaya-tour-packages' },
      { label: 'Budget Trip Meghalaya', to: '/budget-trip-meghalaya' },
    ],
  },
  {
    title: 'XTSY Stays',
    links: [
      { label: 'Best Hostel in Shillong', to: '/best-hostel-in-shillong' },
      { label: 'Hotels in Shillong', to: '/hotels-in-shillong' },
      { label: 'Homestays in Shillong', to: '/homestays-in-shillong' },
      { label: 'Hostels in Meghalaya', to: '/hostels-in-meghalaya' },
      { label: 'Luxury Glamping Shillong', to: '/luxury-glamping-shillong' },
    ],
  },
];

const SEOFooterLinks = memo(() => (
  <section className="py-10 bg-muted/30 border-t border-border/50">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="flex items-center gap-2 mb-6">
        <Compass className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Explore More</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {LINK_GROUPS.map(group => (
          <div key={group.title}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {group.title}
            </h4>
            <ul className="space-y-1.5">
              {group.links.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
));

SEOFooterLinks.displayName = 'SEOFooterLinks';
export default SEOFooterLinks;
