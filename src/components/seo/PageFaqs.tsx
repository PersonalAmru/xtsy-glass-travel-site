/**
 * Visible FAQs plus FAQPage structured data, for the older (Header/Footer) page layouts.
 *
 * Answers stay in the HTML whether or not the item is open, so crawlers and AI assistants can
 * read them. Pass `schema={false}` when the route already emits its own FAQPage block, so a page
 * never ships two.
 */
import { Helmet } from '@/lib/seo/helmet';

export type Faq = { q: string; a: string };

export default function PageFaqs({
  faqs,
  heading = 'Questions travellers ask',
  schema = true,
}: {
  faqs: Faq[];
  heading?: string;
  schema?: boolean;
}) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="page-faqs" className="mt-12 border-t border-border pt-10">
      {schema && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            })}
          </script>
        </Helmet>
      )}
      <h2 id="page-faqs" className="text-2xl md:text-3xl font-bold text-foreground">{heading}</h2>
      <div className="mt-6 space-y-3">
        {faqs.map((f, i) => (
          <details key={f.q} open={i === 0} className="group rounded-xl border border-border bg-card p-5">
            <summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:content-none">
              <h3 className="inline text-base font-semibold">{f.q}</h3>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
