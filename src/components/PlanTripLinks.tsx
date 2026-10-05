import { destinationPath } from '@/data/neTaxonomy';
import { Link } from '@/lib/router-compat';
import { MapPin, BedDouble, CalendarCheck } from 'lucide-react';
import { getDestinationBySlug } from '@/data/meghalayaDestinations';
import { useAnalytics } from '@/hooks/useAnalytics';

/**
 * PlanTripLinks — the internal-linking bridge from blog/planning pages to the
 * matching destination pages and the booking funnel.
 *
 * SEO: closes the "planning content → destination → booking" crawl gap. Every
 * planning page now links to the exact `/places-to-visit/:slug` pages it talks
 * about plus the `/book` entry point with keyword-rich anchors.
 *
 * Analytics: the booking CTA fires the SAME funnel stage names used by the
 * destination pages (`destination_to_booking` → `availability_check`) so blog
 * traffic flows into the admin traffic-to-bookings funnel report identically.
 */
export interface PlanTripLinksProps {
  /** Canonical destination slugs this article is about (rendered as internal links). */
  slugs: string[];
  /** Keyword-rich booking anchor tuned to the page intent. */
  bookingAnchor?: string;
  /** Optional section heading override. */
  heading?: string;
  /** Source page identifier for funnel attribution. */
  source: string;
}

const PlanTripLinks = ({ slugs, bookingAnchor, heading, source }: PlanTripLinksProps) => {
  const { trackConversion, trackEvent } = useAnalytics();

  const destinations = slugs
    .map((slug) => getDestinationBySlug(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map((d) => ({ slug: d.slug, name: d.name, region: d.region }));

  const anchor =
    bookingAnchor ?? 'Book your Shillong base — dorm beds from ₹399, private rooms & glamping';

  const handleBookingClick = () => {
    trackConversion('destination_to_booking', 'availability_check', 2, {
      metadata: { source, entry: 'plan_trip_links' },
    });
    trackEvent('booking', 'plan_trip_cta_click', source);
  };

  return (
    <section
      aria-label="Plan your Meghalaya trip"
      className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-6 md:p-8"
    >
      <h2 className="text-xl md:text-2xl font-bold text-foreground">
        {heading ?? 'Plan Your Trip — Destinations & Where to Stay'}
      </h2>

      {destinations.length > 0 && (
        <>
          <p className="mt-2 text-muted-foreground">
            Explore the places mentioned in this guide, then book a base to see them all:
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link
                  to={destinationPath(d.slug)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  {d.name}
                  <span className="text-muted-foreground">· {d.region}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-6 flex flex-col gap-4 rounded-xl bg-background/60 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base md:text-lg font-bold text-foreground">
            <BedDouble className="h-5 w-5 text-primary" /> Stay with XTSY in Shillong
          </h3>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{anchor}.</p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            to="/book"
            onClick={handleBookingClick}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <CalendarCheck className="h-4 w-4" /> Book Hostel Online
          </Link>
          <Link
            to="/places-to-visit-in-meghalaya"
            className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted"
          >
            All Places to Visit
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PlanTripLinks;
