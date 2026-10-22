/**
 * Visible FAQ block plus FAQPage markup for one page. Content lives in src/data/pageFaqs.ts.
 * Uses <details> so it works without JavaScript and needs no extra state.
 */
import { PAGE_FAQS } from '@/data/pageFaqs';

export default function PageFaq({ path, className = '' }: { path: string; className?: string }) {
  const faqs = PAGE_FAQS[path];
  if (!faqs?.length) return null;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <section aria-labelledby="page-faq" className={`mx-auto w-full max-w-5xl px-4 py-12 ${className}`}>
      {/* In the body so it is in the server HTML on every page; Google reads JSON-LD anywhere. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <h2 id="page-faq" className="text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
      <div className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white/60">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="cursor-pointer list-none text-[16px] font-semibold marker:hidden">
              <h3 className="m-0 inline text-[16px] font-semibold">{f.q}</h3>
            </summary>
            <p className="mt-2 text-[15px] leading-relaxed opacity-80">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
