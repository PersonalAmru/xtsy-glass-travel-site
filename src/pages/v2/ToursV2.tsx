/**
 * /tours — XTSY Voyage tour packages (redesign). Signature packages (fixed
 * prices) first, then every tour in the catalogue with filters.
 */
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '@/components/SEOHead';
import { Link, useSearchParams } from '@/lib/router-compat';
import { getAllTours, type TourPackage } from '@/data/travelData';
import { SIGNATURE_PACKAGES, formatPackagePrice } from '@/data/signaturePackages';
import { photoFor } from '@/data/v2TourImages';
import { PageShell, PAD, Section, H2 } from '@/components/v2/blocks';
import { Photo, SpinningMark, waLink } from '@/components/v2/primitives';

const toSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const NE = ['Meghalaya', 'Arunachal Pradesh', 'Assam', 'Nagaland', 'Manipur', 'Tripura', 'Mizoram', 'Sikkim', 'Northeast India'];

const GROUPS: { id: string; label: string; test: (t: TourPackage) => boolean }[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'meghalaya', label: 'Meghalaya', test: (t) => t.location === 'Meghalaya' },
  { id: 'northeast', label: 'Northeast', test: (t) => NE.includes(t.location) && t.location !== 'Meghalaya' },
  { id: 'india', label: 'Across India', test: (t) => !t.international && !NE.includes(t.location) },
  { id: 'international', label: 'International', test: (t) => Boolean(t.international) },
  { id: 'couples', label: 'Couples', test: (t) => /xtsy 270|honeymoon|romantic|couple/i.test(t.title) },
  { id: 'adventure', label: 'Adventure', test: (t) => t.category === 'adventure' },
  { id: 'learn', label: 'Learn & wellness', test: (t) => t.category === 'educational' || /yoga/i.test(t.title) },
];

function TourCard({ to, title, duration, badge, text, price, img, enquire }: { to: string; title: string; duration: string; badge?: string; text: string; price: string; img: string; enquire: string }) {
  return (
    <article className="xt-reveal xt-lift flex flex-col overflow-hidden rounded-3xl bg-white">
      <Link to={to} aria-label={title}><Photo src={img} alt={title} tone="pine" className="aspect-[421/220]" /></Link>
      <div className="flex flex-grow flex-col gap-2.5 p-6">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-xt-sand px-3 py-1.5 text-[13px] font-extrabold">{duration}</span>
          {badge && <span className="rounded-full bg-xt-blush px-3 py-1.5 text-[13px] font-extrabold text-xt-crimson-dark">{badge}</span>}
        </div>
        <h2 className="m-0 text-[20px] font-extrabold leading-tight"><Link to={to} className="text-xt-ink hover:text-xt-crimson">{title}</Link></h2>
        <p className="m-0 line-clamp-3 text-[15px] leading-normal text-xt-mute">{text}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2.5">
          <span className="text-[19px] font-extrabold">{price} <span className="text-[13px] font-semibold text-xt-mute">/person</span></span>
          <div className="flex gap-2">
            <Link to={to} className="xt-btn flex h-11 items-center rounded-full border-[1.5px] border-xt-ink px-4 text-[14px] font-extrabold text-xt-ink hover:text-xt-ink">Itinerary</Link>
            <a href={enquire} target="_blank" rel="noopener noreferrer" className="xt-btn flex h-11 items-center rounded-full bg-xt-crimson px-4 text-[14px] font-extrabold text-white hover:text-white">Enquire</a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ToursV2() {
  const [params, setParams] = useSearchParams();
  const [group, setGroup] = useState(params.get('group') || 'all');
  const tours = useMemo(() => getAllTours(), []);
  const current = GROUPS.find((g) => g.id === group) ?? GROUPS[0];
  const list = tours.filter(current.test);
  const pick = (id: string) => {
    setGroup(id);
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete('group'); else next.set('group', id);
    setParams(next, { replace: true });
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'XTSY Voyage tour packages',
    itemListElement: SIGNATURE_PACKAGES.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://xtsy.one/tours/${p.slug}`, name: p.title })),
  };

  return (
    <>
      <SEOHead
        title="Northeast India Tour Packages 2026 — Meghalaya, Arunachal & More | XTSY"
        description="Meghalaya, Arunachal, Assam, Nagaland and Sikkim tour packages from XTSY Voyage. Trips start at XTSY in New Shillong Township; stays and transport elsewhere come from trusted travel partners."
        keywords="meghalaya tour packages, northeast india tour packages, shillong tour package, tawang tour, kaziranga tour, xtsy voyage"
        canonicalUrl="https://xtsy.one/tours"
      />
      <Helmet><script type="application/ld+json">{JSON.stringify(itemList)}</script></Helmet>
      <PageShell cta={{ title: 'Not sure which trip fits?', sub: 'Tell a travel expert your dates and budget on WhatsApp. We’ll shape a plan around you — or try the AI trip builder.', bookTo: '/plan-trip-with-ai', bookLabel: 'Build a trip with AI' }}>
        <section className={`${PAD} relative grid items-end gap-8 overflow-hidden py-14 lg:grid-cols-2 lg:gap-14 lg:py-[72px]`}>
          <SpinningMark className="-right-24 -top-36 h-[520px] w-[520px] opacity-[0.07]" />
          <div className="relative flex flex-col gap-5">
            <div className="xt-in xt-eyebrow text-[15px] sm:text-[18px]">XTSY Voyage · {tours.length}+ journeys across the Northeast and beyond</div>
            <h1 className="xt-in xt-d1 xt-display m-0 text-[72px] leading-[0.86] sm:text-[132px]">Tour packages</h1>
          </div>
          <p className="xt-in xt-d2 relative m-0 text-[17px] leading-relaxed text-xt-mute sm:text-[20px]">Root bridges, caves, Dawki’s clear river, Tawang’s monasteries and a three-country ride. Planned by the team that lives here, with 24/7 support on the road. Every Meghalaya trip can start from our own hostel in New Shillong Township; stays, cabs and guides further out come from trusted travel partners we’ve vetted.</p>
        </section>

        <Section className="bg-xt-cream">
          <H2 eyebrow="Fixed-price signature packages">Northeast signatures</H2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SIGNATURE_PACKAGES.map((p) => (
              <TourCard
                key={p.slug}
                to={`/tours/${p.slug}`}
                title={p.title}
                duration={p.duration}
                badge={p.minGroup ? `Min ${p.minGroup} guests` : p.region}
                text={p.shortDescription}
                price={formatPackagePrice(p.pricePerPerson)}
                img={photoFor(p.title, p.highlights.join(' '), p.region)}
                enquire={waLink(`Hi XTSY! I'm interested in the ${p.title}. Dates: … Travellers: …`)}
              />
            ))}
          </div>
        </Section>

        <Section>
          <H2 eyebrow="Every journey">All tour packages</H2>
          <div role="group" aria-label="Filter tours" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {GROUPS.map((g) => {
              const n = tours.filter(g.test).length;
              if (!n) return null;
              return (
                <button key={g.id} type="button" aria-pressed={g.id === group} onClick={() => pick(g.id)} className={`xt-chip h-11 shrink-0 rounded-full border-[1.5px] px-5 text-[15px] font-bold ${g.id === group ? 'border-xt-slate bg-xt-slate text-xt-paper' : 'border-xt-stone text-xt-ink'}`}>
                  {g.label} · {n}
                </button>
              );
            })}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <TourCard
                key={t.id}
                to={`/tours/${toSlug(t.title)}`}
                title={t.title}
                duration={t.duration}
                badge={t.international ? `${t.location} · partner-run` : t.location}
                text={t.description}
                price={t.price}
                img={photoFor(t.title, t.location)}
                enquire={waLink(`Hi XTSY! I'm interested in ${t.title}. Dates: … Travellers: …`)}
              />
            ))}
          </div>
          <p className="m-0 text-[14px] text-xt-mute">XTSY’s own property is only in New Shillong Township. On tours, stays, vehicles and local guides outside New Shillong are arranged through trusted travel partners, with XTSY as your single point of contact.</p>
        </Section>
      </PageShell>
    </>
  );
}
