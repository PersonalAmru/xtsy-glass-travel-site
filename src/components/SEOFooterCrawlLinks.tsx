/**
 * Crawl-depth optimization component — ensures all pillar and key pages
 * are reachable within 2-3 clicks from the homepage via the footer.
 * Renders as a structured internal link block for SEO crawlers.
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';

interface LinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const LINK_GROUPS: LinkGroup[] = [
  {
    title: 'Meghalaya Travel Guides',
    links: [
      { label: 'Meghalaya Travel Guide', href: '/meghalaya-travel-guide' },
      { label: 'Places to Visit in Meghalaya', href: '/things-to-do-in-meghalaya' },
      { label: 'Things to Do in Meghalaya', href: '/things-to-do-in-meghalaya' },
      { label: 'Best Time to Visit', href: '/best-time-to-visit-meghalaya' },
      { label: 'Budget Trip to Meghalaya', href: '/budget-trip-meghalaya' },
      { label: '3-Day Itinerary', href: '/meghalaya-3-day-itinerary' },
      { label: '5-Day Itinerary', href: '/meghalaya-5-day-itinerary' },
      { label: 'Hidden Places in Meghalaya', href: '/hidden-places-meghalaya' },
    ],
  },
  {
    title: 'Top Destinations',
    links: [
      { label: 'Nohkalikai Falls', href: '/places-to-visit/nohkalikai-falls-meghalaya' },
      { label: 'Krang Suri Falls', href: '/places-to-visit/krang-suri-falls-meghalaya' },
      { label: 'Dawki Umngot River', href: '/places-to-visit/dawki-umngot-river' },
      { label: 'Mawlynnong Village', href: '/places-to-visit/mawlynnong-village-meghalaya' },
      { label: 'Living Root Bridges', href: '/places-to-visit/living-root-bridges-meghalaya' },
      { label: 'Laitlum Canyons', href: '/places-to-visit/laitlum-canyons-shillong' },
      { label: 'Meghalaya Waterfalls', href: '/meghalaya-waterfalls' },
      { label: 'Meghalaya Caves', href: '/meghalaya-caves' },
    ],
  },
  {
    title: 'Stay in Shillong',
    links: [
      { label: 'Best Hostel in Shillong', href: '/best-hostel-in-shillong' },
      { label: 'Hotels in Shillong', href: '/hotels-in-shillong' },
      { label: 'Homestays in Shillong', href: '/homestays-in-shillong' },
      { label: 'Luxury Glamping', href: '/luxury-glamping-shillong' },
      { label: 'Destination Wedding', href: '/destination-wedding-shillong' },
      { label: 'XTSY 270° Glasshouse', href: '/xtsy-270' },
      { label: 'TAB Bistro Restaurant', href: '/tab-bistro' },
      { label: 'XTSY vs Zostel', href: '/xtsy-vs-zostel' },
    ],
  },
  {
    title: 'Tour Packages',
    links: [
      { label: 'Meghalaya Tour Packages', href: '/meghalaya-tour-packages' },
      { label: 'Shillong Tour Package', href: '/shillong-tour-package' },
      { label: 'Couple Tour Package', href: '/meghalaya-couple-tour-package' },
      { label: 'All Tours', href: '/tours' },
      { label: 'XTSY Rentals', href: '/xtsy-rentals' },
      { label: 'Female Travellers', href: '/female-travellers' },
      { label: 'Pet-Friendly Travel', href: '/pet-friendly' },
      { label: 'All Pages Directory', href: '/all-pages' },
    ],
  },
];

const SEOFooterCrawlLinks = memo(() => {
  return (
    <nav aria-label="Site navigation" className="border-t border-border/20 pt-8 mt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {LINK_GROUPS.map((group) => (
          <div key={group.title}>
            <h4 className="text-sm font-semibold text-foreground/80 mb-3">{group.title}</h4>
            <ul className="space-y-1.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
});

SEOFooterCrawlLinks.displayName = 'SEOFooterCrawlLinks';

export default SEOFooterCrawlLinks;
