/**
 * /$slug — the ~530 programmatic SEO pages in the 2026 design.
 *
 * Structure is built for search and answer engines:
 *  1. H1 + answer-first "Quick answer" (speakable) + key facts table
 *  2. The page's own sections and FAQs (same text as the JSON-LD, which the
 *     route head() renders server-side)
 *  3. XTSY-first stay block, "Plan this with AI", and — for travel pages —
 *     a "Go further in Northeast India" block
 *  4. Dense, relevant internal links (hub, wheel, same-category, related)
 */
import { useState } from 'react';
import { useParams, Link, Navigate } from '@/lib/router-compat';
import NotFound from '@/pages/NotFound';
import StayEatExplore from '@/components/seo/StayEatExplore';
import TopicalClusterNav from '@/components/seo/TopicalClusterNav';
import { getRelatedPages, getPagesByCategory } from '@/data/seoPages';
import { RECOVERY_REDIRECTS } from '@/data/seoAffectedSlugs';
import { getWheelLinks } from '@/data/seoLinkingWheel';
import { programmaticModel, goesBeyondShillong, CATEGORY_LABELS, SEO_CONTENT_UPDATED, townOf } from '@/lib/seo/programmaticSeo';
import { openTripChat } from '@/components/v2/tripChatEvents';
import { inr, lowestDormPrice, roomPrice } from '@/components/v2/pricing';
import { PageShell, Breadcrumbs, PAD } from '@/components/v2/blocks';
import { waLink } from '@/components/v2/primitives';

const NE_STATES = [
  { to: '/destinations/meghalaya', t: 'Meghalaya', d: 'Root bridges, Dawki, Cherrapunji — base yourself at XTSY.' },
  { to: '/destinations/assam', t: 'Assam', d: 'Kaziranga rhinos, Majuli island, Brahmaputra sunsets.' },
  { to: '/destinations/arunachal-pradesh', t: 'Arunachal', d: 'Tawang monastery, Sela Pass, Ziro valley.' },
  { to: '/destinations/nagaland', t: 'Nagaland', d: 'Hornbill Festival, Kohima, Dzukou valley.' },
  { to: '/tours?group=northeast', t: 'Sikkim', d: 'Gangtok, Tsomgo lake, Kanchenjunga views.' },
  { to: '/tours', t: 'Beyond', d: 'Bhutan, Nepal and pan-India trips with trusted partners.' },
];

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[18px] bg-white">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 bg-transparent px-6 py-5 text-left text-[16px] font-extrabold text-xt-ink">
        <span>{q}</span><span aria-hidden="true" className="text-xt-crimson">{open ? '−' : '+'}</span>
      </button>
      {/* Answers stay in the DOM (just visually hidden) so crawlers see them. */}
      <p className={open ? 'm-0 px-6 pb-5 text-[15px] leading-relaxed text-xt-mute' : 'sr-only'}>{a}</p>
    </div>
  );
}

export default function ProgrammaticV2() {
  const { slug } = useParams<{ slug: string }>();
  const model = slug ? programmaticModel(slug) : null;

  if (!model && slug && RECOVERY_REDIRECTS[slug]) return <Navigate to={RECOVERY_REDIRECTS[slug]} replace />;
  if (!model) return <NotFound />;
  const { page, hero, hub, quickAnswer, facts } = model;
  const bodyLen = (page.intro?.length || 0) + page.sections.reduce((a, s) => a + (s.content?.length || 0), 0);
  if (page.sections.length < 3 || bodyLen < 600) return <NotFound />;

  const label = CATEGORY_LABELS[page.category] ?? 'Guides';
  const town = townOf(page);
  const related = getRelatedPages(page.slug);
  const sameCat = getPagesByCategory(page.category).filter((p) => p.slug !== page.slug).slice(0, 9);
  const wheel = getWheelLinks(page.slug);
  const beyond = goesBeyondShillong(page);
  const updated = new Date(SEO_CONTENT_UPDATED).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <PageShell cta={{ title: town ? `Travelling to ${town}?` : 'Stay with us in the pines.', sub: town ? 'The XTSY desk books trusted partner stays, cabs and guides — and your Shillong nights at XTSY.' : `Dorm beds from ${inr(lowestDormPrice())}, King Double ${inr(roomPrice('king-double-room').now)}, TAB Bistro on site.`, bookTo: '/book', bookLabel: 'Check availability' }}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label, to: hub }, { label: page.h1 }]} />
      <article>
        <header className={`${PAD} grid items-end gap-8 py-8 lg:grid-cols-12 lg:py-12`}>
          <div className="flex flex-col gap-4 lg:col-span-7">
            <div className="xt-eyebrow text-[14px]">{label} · Updated {updated}</div>
            <h1 className="xt-display m-0 text-[44px] leading-[0.92] sm:text-[68px]">{page.h1}</h1>
            <p className="m-0 max-w-[720px] text-[17px] leading-relaxed text-xt-mute">{page.intro}</p>
          </div>
          <div className="relative overflow-hidden rounded-[28px] bg-xt-slate lg:col-span-5">
            <img src={hero.src} srcSet={hero.srcSet} sizes="(max-width: 1024px) 100vw, 40vw" width={hero.w} height={hero.h} alt={hero.alt} fetchPriority="high" decoding="async" className="aspect-[16/11] h-auto w-full object-cover" />
          </div>
        </header>

        <section className={`${PAD} grid gap-6 pb-10 lg:grid-cols-12`}>
          <div data-quick-answer className="rounded-[24px] bg-xt-blush p-6 lg:col-span-7">
            <h2 className="xt-eyebrow m-0 mb-2 text-[14px]">Quick answer</h2>
            <p className="m-0 text-[17px] leading-relaxed text-xt-ink">{quickAnswer}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={waLink(`Hi XTSY! I'm looking at: ${page.h1}`)} target="_blank" rel="noopener noreferrer" className="xt-btn flex h-11 items-center rounded-full bg-xt-crimson px-5 text-[14px] font-extrabold text-white hover:text-white">Ask on WhatsApp</a>
              <button type="button" onClick={() => openTripChat(`Plan a trip: ${page.h1}`)} className="xt-btn flex h-11 items-center gap-2 rounded-full bg-xt-ink px-5 text-[14px] font-extrabold text-xt-paper">✦ Plan this with AI</button>
              <Link to="/book" className="xt-btn flex h-11 items-center rounded-full border-[1.5px] border-xt-ink px-5 text-[14px] font-extrabold text-xt-ink hover:text-xt-ink">Book XTSY</Link>
            </div>
          </div>
          {facts.length > 0 && (
            <dl data-key-facts className="m-0 overflow-hidden rounded-[24px] bg-white lg:col-span-5">
              {facts.map((f) => (
                <div key={f.k} className="grid grid-cols-[40%_60%] gap-3 border-t border-xt-cream px-5 py-3 text-[14px] first:border-t-0">
                  <dt className="font-bold text-xt-mute">{f.k}</dt>
                  <dd className="m-0 font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <div className={`${PAD} grid gap-10 pb-12 lg:grid-cols-12`}>
          <div className="flex min-w-0 flex-col gap-9 lg:col-span-8">
            {page.sections.map((s) => (
              <section key={s.heading} className="flex flex-col gap-3">
                <h2 className="xt-display m-0 text-[32px] leading-none sm:text-[40px]">{s.heading}</h2>
                <p className="m-0 text-[17px] leading-[1.75] text-xt-ink/90">{s.content}</p>
                {s.listItems && s.listItems.length > 0 && (
                  <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                    {s.listItems.map((it) => <li key={it} className="rounded-2xl bg-white px-4 py-3 text-[15px] font-semibold">✓ {it}</li>)}
                  </ul>
                )}
              </section>
            ))}

            {page.faqs.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="xt-display m-0 text-[32px] leading-none sm:text-[40px]">Frequently asked questions</h2>
                {page.faqs.map((f) => <Faq key={f.question} q={f.question} a={f.answer} />)}
              </section>
            )}

            <section aria-label="About the author" className="flex gap-4 rounded-[20px] bg-white p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-xt-crimson font-display text-[20px] text-white" aria-hidden="true">X</span>
              <div className="flex flex-col gap-1 text-[14px] text-xt-mute">
                <span className="font-extrabold text-xt-ink">Written by the XTSY travel team, New Shillong Township</span>
                <span>We run XTSY Travellers Hostel and plan Northeast India trips every day. Prices on this page come from our live booking engine; drive times are checked against our own trips. Last reviewed {updated}.</span>
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-4">
              <div className="flex flex-col gap-3 rounded-[24px] bg-xt-ink p-6 text-xt-paper">
                <span className="xt-eyebrow text-[13px] text-xt-rose!">Where to stay</span>
                <span className="text-[20px] font-extrabold">XTSY Travellers Hostel</span>
                <span className="text-[14px] leading-relaxed text-xt-fog">New Shillong Township, near IIM & NIFT Shillong. Dorms from {inr(lowestDormPrice())}, women-only dorm, King Double {inr(roomPrice('king-double-room').now)}, Experience by XTSY glass suite. TAB Bistro on site.</span>
                <Link to="/book" className="xt-btn flex h-12 items-center justify-center rounded-full bg-xt-crimson text-[15px] font-extrabold text-white hover:text-white">Check availability</Link>
                <Link to="/best-hostel-in-shillong" className="text-center text-[13px] font-bold text-xt-fog underline">Why guests pick XTSY</Link>
              </div>
              <div className="flex flex-col gap-2 rounded-[24px] bg-white p-6">
                <span className="text-[16px] font-extrabold">Plan it in a minute</span>
                <span className="text-[14px] text-xt-mute">Our trip assistant plans day by day with real drive times across Meghalaya and the Northeast.</span>
                <button type="button" onClick={() => openTripChat(`Plan a trip: ${page.h1}`)} className="xt-btn mt-1 h-11 rounded-full bg-xt-ink text-[14px] font-extrabold text-xt-paper">✦ Plan a trip with AI</button>
              </div>
            </div>
          </aside>
        </div>

        {beyond && (
          <section className={`${PAD} flex flex-col gap-5 bg-xt-cream py-12`}>
            <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">Go further in Northeast India</h2>
            <p className="m-0 max-w-[760px] text-[16px] leading-relaxed text-xt-mute">Eight states, living root bridges, rhinos, Himalayan passes and some of India’s warmest hosts. Start in Shillong with XTSY, then let our desk and trusted partners take you further — one team, one WhatsApp, the whole journey.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {NE_STATES.map((s) => (
                <Link key={s.t} to={s.to} className="xt-lift flex flex-col gap-1 rounded-2xl bg-white p-5 text-xt-ink hover:text-xt-crimson">
                  <span className="font-display text-[26px] leading-none">{s.t}</span>
                  <span className="text-[14px] text-xt-mute">{s.d}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <nav aria-label="Related guides" className={`${PAD} flex flex-col gap-8 py-12`}>
          {['destinations', 'attractions', 'itineraries', 'travel-guides'].includes(page.category) && <StayEatExplore context={page.h1} />}
          <TopicalClusterNav category={page.category} currentSlug={page.slug} />
          {[{ t: 'Explore related pages', items: wheel.map((l) => ({ to: `/${l.slug}`, label: l.label })) }, { t: `More ${label.toLowerCase()}`, items: sameCat.map((p) => ({ to: `/${p.slug}`, label: p.h1 })) }, { t: 'Related', items: related.map((p) => ({ to: `/${p.slug}`, label: p.h1 })) }]
            .filter((g) => g.items.length)
            .map((g) => (
              <div key={g.t} className="flex flex-col gap-3">
                <h2 className="m-0 text-[18px] font-extrabold">{g.t}</h2>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((l) => <Link key={l.to} to={l.to} className="rounded-full border-[1.5px] border-xt-stone px-4 py-2 text-[14px] font-bold text-xt-ink hover:text-xt-crimson">{l.label}</Link>)}
                </div>
              </div>
            ))}
          {(page.category === 'group-tours' || page.category === 'corporate') && (
            <Link to="/group-bookings-meghalaya" className="self-start rounded-full bg-xt-crimson px-6 py-3 text-[15px] font-extrabold text-white hover:text-white">Meghalaya group bookings →</Link>
          )}
        </nav>
      </article>
    </PageShell>
  );
}
