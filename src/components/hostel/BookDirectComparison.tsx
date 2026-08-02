import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, MessageCircle, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Row {
  feature: string;
  direct: string;
  ota: string;
  directWins: boolean;
}

const rows: Row[] = [
  { feature: 'Price per dorm bed', direct: 'From ₹369 — base rate', ota: '₹430–₹450 after 15–18% commission', directWins: true },
  { feature: 'Commission added to your rate', direct: 'None', ota: '15–18% built into the price', directWins: true },
  { feature: 'Cancellation', direct: 'Free up to 48 hrs, one free date change', ota: 'OTA policy — often non-refundable rates', directWins: true },
  { feature: 'Prepayment', direct: 'Most dorms pay on arrival', ota: 'Card hold or full prepayment', directWins: true },
  { feature: 'Confirmation', direct: 'Instant WhatsApp + GST invoice', ota: 'Email voucher only', directWins: true },
  { feature: 'Room / bed preference', direct: 'Request bunk, dorm or floor directly', ota: 'Assigned at check-in', directWins: true },
  { feature: 'Long-stay & group discounts', direct: '3+ nights, 6+ guests, monthly nomad rate', ota: 'Rarely available', directWins: true },
  { feature: 'Extras', direct: 'TAB Bistro breakfast discount, luggage storage, late checkout on request', ota: 'Not included', directWins: true },
  { feature: 'Who to contact for a change', direct: 'Us, on WhatsApp, instantly', ota: 'OTA support queue', directWins: true },
];

/**
 * Deal-intent conversion block: "Book direct vs Hostelworld / OTAs".
 * Shared by every hostel booking landing page.
 */
const BookDirectComparison = memo(({ className = '' }: { className?: string }) => (
  <section className={`py-14 px-4 ${className}`} aria-labelledby="book-direct-vs-ota">
    <div className="container mx-auto max-w-4xl">
      <h2 id="book-direct-vs-ota" className="text-2xl sm:text-3xl font-bold text-center font-playfair text-foreground">
        Book Direct vs Hostelworld &amp; Other OTAs
      </h2>
      <p className="mt-3 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        Hostelworld, Booking.com and Agoda charge us a 15–18% commission on every reservation — and that
        commission is priced into the bed you see. Booking direct at XTSY removes it and gives you a more
        flexible stay on top.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border/60">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left py-3 px-4 font-semibold text-foreground">What you get</th>
              <th className="text-left py-3 px-4 font-semibold text-primary">Book direct at XTSY</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Hostelworld / OTAs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.feature} className="border-t border-border/50 align-top">
                <td className="py-3 px-4 text-foreground font-medium">{r.feature}</td>
                <td className="py-3 px-4 text-foreground">
                  <span className="inline-flex gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {r.direct}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <span className="inline-flex gap-2">
                    <X className="w-4 h-4 text-destructive/70 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {r.ota}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl bg-primary/10 border border-primary/20 p-5 text-center">
        <p className="text-sm text-foreground font-medium flex items-center justify-center gap-2">
          <IndianRupee className="w-4 h-4 text-primary" aria-hidden="true" />
          Found a cheaper rate on an OTA? Send us the screenshot — we match or beat it.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/book">Book Direct &amp; Save</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://wa.me/918837317070?text=Hi%20XTSY%2C%20I%20found%20a%20cheaper%20rate%20on%20an%20OTA%20%E2%80%94%20can%20you%20match%20it%3F"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" /> Ask for a price match
            </a>
          </Button>
        </div>
      </div>
    </div>
  </section>
));

BookDirectComparison.displayName = 'BookDirectComparison';
export default BookDirectComparison;
