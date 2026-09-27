import { Link } from '@/lib/router-compat';
import { BedDouble, ArrowRight } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { inr, lowestDormPrice } from '@/components/v2/pricing';

/**
 * ShillongHostelLinkBlock — a keyword-rich internal link block that funnels
 * high-traffic destination pages (Dawki, Nohkalikai, Umiam Lake) to the
 * commercial /best-hostel-in-shillong page with the exact anchor
 * "book a hostel in Shillong".
 */
const ShillongHostelLinkBlock = ({
  nearName,
  source,
}: {
  nearName: string;
  source: string;
}) => {
  const { trackEvent } = useAnalytics();

  return (
    <section
      aria-label="Book a hostel in Shillong"
      className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-foreground">
            <BedDouble className="h-5 w-5 text-primary" /> Need a base? Book a hostel in Shillong
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            XTSY Travellers Hostel is the best-rated, cheapest backpacker base for exploring {nearName}
            {' '}— dorm beds from {inr(lowestDormPrice())}, female-only dorms and private rooms in New Shillong Township.
          </p>
        </div>
        <Link
          to="/best-hostel-in-shillong"
          onClick={() => trackEvent('booking', 'shillong_hostel_link_click', source)}
          className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Book a hostel in Shillong <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default ShillongHostelLinkBlock;
