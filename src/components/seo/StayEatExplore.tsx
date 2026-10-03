import { Link } from '@/lib/router-compat';
import { BedDouble, UtensilsCrossed, PartyPopper, Map } from 'lucide-react';

/**
 * StayEatExplore — commercial internal-linking module.
 *
 * Routes link equity from high-traffic informational pages (destinations,
 * itineraries, guides) into the commercial money pages: hostel booking,
 * TAB Bistro dining, catering enquiries, and tour packages.
 *
 * Rendered near the bottom of editorial pages so it reinforces topical
 * relevance while giving readers a clear conversion path.
 */
interface StayEatExploreProps {
  /** Optional place/topic name to personalise the copy (e.g. "Cherrapunji"). */
  context?: string;
  /** Tour package link most relevant to the page. Defaults to Meghalaya packages. */
  tourLink?: string;
  tourLabel?: string;
}

const StayEatExplore = ({
  context,
  tourLink = '/meghalaya-tour-packages',
  tourLabel = 'Meghalaya Tour Packages',
}: StayEatExploreProps) => {
  const place = context ? ` ${context}` : '';

  const cards = [
    {
      icon: BedDouble,
      title: 'Where to Stay',
      desc: `Book a bed, private room, or glamping stay at XTSY — one of the best-rated hostels in Shillong, your base for exploring${place || ' Meghalaya'}.`,
      to: '/best-hostel-in-shillong',
      cta: 'View Hostel & Book',
    },
    {
      icon: UtensilsCrossed,
      title: 'Where to Eat',
      desc: 'Refuel at TAB Bistro by XTSY — multi-cuisine dining, breakfast and café favourites, with a rooftop terrace café coming soon.',
      to: '/tab-bistro',
      cta: 'Explore the Menu',
    },
    {
      icon: PartyPopper,
      title: 'Catering & Events',
      desc: 'Planning a wedding, corporate retreat, or party? TAB Bistro handles event, wedding, and bulk catering across Shillong & Meghalaya.',
      to: '/tab-bistro/catering',
      cta: 'Get a Catering Quote',
    },
    {
      icon: Map,
      title: 'Tours & Experiences',
      desc: `Let XTSY plan your trip with curated${place} tours, road trips, and Northeast India experiences with local expert guides.`,
      to: tourLink,
      cta: tourLabel,
    },
  ];

  return (
    <section
      aria-label="Plan your stay, dining and tours with XTSY"
      className="border-t border-border pt-10"
    >
      <h2 className="text-2xl font-bold text-foreground">
        Plan Your Trip{context ? ` to ${context}` : ''} with XTSY
      </h2>
      <p className="mt-2 text-muted-foreground">
        Everything you need in one place — stay, eat, celebrate, and explore with Shillong's
        homegrown hospitality brand.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              to={c.to}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold text-foreground">{c.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              <span className="mt-3 text-sm font-medium text-primary group-hover:underline">
                {c.cta} →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default StayEatExplore;
