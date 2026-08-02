import { memo } from 'react';
import { hostelDealFaqs, type HostelFaq } from '@/data/hostelBookingFaqs';

interface Props {
  title?: string;
  intro?: string;
  faqs?: HostelFaq[];
  className?: string;
}

/**
 * Renders the shared booking / deal-intent FAQ list.
 * Schema is emitted by each host page's own FAQPage node (which spreads
 * `hostelDealFaqEntities`) so there is never more than one FAQPage per URL.
 */
const HostelDealsFAQ = memo(({
  title = 'Booking & Deals — Frequently Asked Questions',
  intro = 'Everything travellers ask before booking a bed: how far in advance to book, and how to get the cheapest rate.',
  faqs = hostelDealFaqs,
  className = '',
}: Props) => (
  <section className={`py-14 px-4 ${className}`} aria-labelledby="hostel-deals-faq">
    <div className="container mx-auto max-w-3xl">
      <h2 id="hostel-deals-faq" className="text-2xl sm:text-3xl font-bold text-center font-playfair text-foreground">
        {title}
      </h2>
      {intro && <p className="mt-3 text-center text-sm text-muted-foreground">{intro}</p>}
      <div className="mt-8 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group border border-border/50 rounded-lg p-4 bg-background">
            <summary className="font-semibold text-sm cursor-pointer text-foreground list-none flex items-start justify-between gap-3 min-h-[24px]">
              <h3 className="font-semibold text-sm text-foreground m-0">{f.q}</h3>
              <span className="text-primary group-open:rotate-45 transition-transform text-xl leading-none" aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
));

HostelDealsFAQ.displayName = 'HostelDealsFAQ';
export default HostelDealsFAQ;
