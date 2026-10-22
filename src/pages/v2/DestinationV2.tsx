/**
 * /places-to-visit/$slug and /destinations/$state/$city/$attraction —
 * Meghalaya attraction guide (redesign). Same data, 404/410 handling,
 * schema, FAQs, booking CTAs and analytics as before.
 */
import type { ReactNode } from 'react';
import { photoCredit } from '@/data/tourPhotos';
import { Helmet } from '@/lib/seo/helmet';
import { useParams, Link } from '@/lib/router-compat';
import NotFound from '@/pages/NotFound';
import { GONE_SLUGS } from '@/data/seoGoneSlugs';
import { useGoneStatus } from '@/hooks/useGoneStatus';
import DestinationGallery from '@/components/destinations/DestinationGallery';
import StayEatExplore from '@/components/seo/StayEatExplore';
import ShillongHostelLinkBlock from '@/components/ShillongHostelLinkBlock';
import { useAnalytics } from '@/hooks/useAnalytics';
import { getDestinationGeo } from '@/data/destinationGeo';
import { getDestinationBySlug, getDestinationImages, meghalayaDestinations, type MeghalayaDestination } from '@/data/meghalayaDestinations';
import { destinationPath, getCitySlugForDestination, getCityBySlug } from '@/data/neTaxonomy';
import { inr, lowestDormPrice } from '@/components/v2/pricing';
import { PageShell, Breadcrumbs, PAD } from '@/components/v2/blocks';
import { Photo } from '@/components/v2/primitives';

const SHILLONG_HOSTEL_LINK_SLUGS = new Set(['dawki-umngot-river', 'nohkalikai-falls', 'umiam-lake']);
/** Older copy hard-codes the 2025 dorm rate; show the live one from the booking engine. */
const livePrice = (text: string) => text.replace(/₹399\b/g, inr(lowestDormPrice()));

function BookingCTA({ destination, placement }: { destination: MeghalayaDestination; placement: 'top' | 'bottom' }) {
  const { trackConversion, trackEvent } = useAnalytics();
  const anchor = livePrice(destination.bookingAnchor ?? `Book a bed in Shillong from ₹399 — your base near ${destination.name}`);
  const handleClick = (step: 'availability_check' | 'book_now') => {
    trackConversion('destination_to_booking', step, step === 'availability_check' ? 2 : 3, {
      metadata: { destination_slug: destination.slug, destination_name: destination.name, placement },
    });
    trackEvent('booking', 'destination_cta_click', destination.slug, undefined, { step, placement });
  };
  return (
    <section aria-label={`Book your stay near ${destination.name}`} className="xt-reveal flex flex-col gap-4 rounded-[24px] bg-xt-slate p-7 text-xt-paper md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-[20px] font-extrabold">Stay nearby: XTSY Travellers Hostel, New Shillong</h2>
        <p className="m-0 max-w-2xl text-[15px] leading-relaxed text-xt-fog">{anchor}. Dorm beds, private rooms and Experience by XTSY — a well-rated base for exploring {destination.name} and the rest of {destination.region}. For nights away, we book trusted partner stays and transport.</p>
      </div>
      <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
        <Link to="/book" onClick={() => handleClick('availability_check')} className="xt-btn flex h-12 items-center justify-center rounded-full bg-xt-crimson px-6 text-[15px] font-extrabold text-white hover:text-white">Book hostel online</Link>
        <Link to="/best-hostel-in-shillong" onClick={() => handleClick('book_now')} className="xt-btn flex h-12 items-center justify-center rounded-full border-[1.5px] border-xt-paper px-6 text-[15px] font-extrabold text-xt-paper hover:text-xt-paper">View hostel &amp; rooms</Link>
      </div>
    </section>
  );
}

export default function DestinationV2() {
  const params = useParams<{ slug?: string; attraction?: string }>();
  const slug = params.attraction ?? params.slug;
  const destination = slug ? getDestinationBySlug(slug) : null;
  const runtimeStatus = useGoneStatus(`/places-to-visit/${slug ?? ''}`, slug && GONE_SLUGS.has(slug) ? 410 : 404);

  if ((slug && GONE_SLUGS.has(slug)) || runtimeStatus === 410) return <NotFound statusCode={410} />;
  if (!destination) return <NotFound />;

  const images = getDestinationImages(destination.slug, 6);
  const realImages = images.filter((i) => !i.src.endsWith('placeholder.svg'));
  const destCredit = photoCredit(`dest-${destination.slug}`);
  const nearby = destination.nearbyAttractions.map((name) => meghalayaDestinations.find((d) => d.name === name)).filter(Boolean) as MeghalayaDestination[];
  const showShillongHostelLink = SHILLONG_HOSTEL_LINK_SLUGS.has(destination.slug);

  const topThings = destination.thingsToDo.slice(0, 3).join(', ');
  const faqs: { q: string; a: string }[] = [
    { q: `What is the best time to visit ${destination.name}?`, a: destination.bestTimeToVisit },
    { q: `How do I reach ${destination.name} from Shillong?`, a: destination.howToReach },
    { q: `What are the top things to do at ${destination.name}?`, a: `Popular things to do at ${destination.name} include ${topThings}. ${destination.shortDescription}` },
    ...(destination.extraFaqs ?? []),
    { q: `Where can I stay near ${destination.name}?`, a: `XTSY Travellers Hostel in New Shillong Township is an affordable base for exploring ${destination.name} and the rest of ${destination.region}, with dorms from ${inr(lowestDormPrice())}/night and curated Meghalaya tours that cover the region's top sights. Outside New Shillong, XTSY arranges stays and transport through trusted travel partners.` },
  ].map((f) => ({ q: f.q, a: livePrice(f.a) }));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  const categoryLink =
    destination.category === 'waterfall'
      ? { to: '/meghalaya-waterfalls', label: 'Waterfalls in Meghalaya' }
      : destination.category === 'viewpoint' || destination.category === 'peak'
      ? { to: '/meghalaya-viewpoints', label: 'Viewpoints in Meghalaya' }
      : { to: '/things-to-do-in-meghalaya', label: 'Things to Do in Meghalaya' };

  const citySlug = getCitySlugForDestination(destination);
  const city = getCityBySlug('meghalaya', citySlug);
  const geo = getDestinationGeo(destination.slug);
  const url = `https://xtsy.one${destinationPath(destination.slug)}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${url}#attraction`,
    name: destination.name,
    description: destination.shortDescription,
    url,
    touristType: [destination.category],
    isAccessibleForFree: true,
    publicAccess: true,
    geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lng}`,
    address: { '@type': 'PostalAddress', addressLocality: destination.region, addressRegion: 'Meghalaya', addressCountry: 'IN' },
    containedInPlace: { '@type': 'Place', name: `${destination.region}, Meghalaya` },
    image: images.map((img) => ({ '@type': 'ImageObject', url: img.src, name: img.alt })),
    datePublished: '2024-01-15',
    dateModified: '2026-06-25',
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://xtsy.one/destinations' },
      { '@type': 'ListItem', position: 3, name: 'Meghalaya', item: 'https://xtsy.one/destinations/meghalaya' },
      { '@type': 'ListItem', position: 4, name: city?.name ?? 'Meghalaya', item: `https://xtsy.one/destinations/meghalaya/${citySlug}` },
      { '@type': 'ListItem', position: 5, name: destination.name, item: url },
    ],
  };

  const lastUpdated = 'June 2026';
  const titleModifiers = destination.name.length > 20 ? 'Meghalaya Travel Guide' : 'Meghalaya — How to Reach, Timings & Photos';
  const pageTitle = destination.seoTitle ?? `${destination.name}, ${titleModifiers}`;
  const rawDescription = destination.seoDescription ?? `${destination.name}, Meghalaya: ${destination.shortDescription} Best time to visit, how to reach, timings & travel tips — updated ${lastUpdated}.`;
  const pageDescription = rawDescription.length > 160 ? `${rawDescription.slice(0, 157).replace(/\s+\S*$/, '')}…` : rawDescription;
  const pageKeywords = destination.seoKeywords ?? `${destination.name}, ${destination.name} Meghalaya, places to visit ${destination.region}, ${destination.category} Meghalaya`;

  const facts = [
    { k: 'REGION', v: destination.region.replace(' & Sohra', ''), s: 'Meghalaya' },
    { k: 'TYPE', v: destination.category, s: 'Attraction' },
    { k: 'BEST TIME', v: destination.bestTimeToVisit.split(/[.;(]/)[0].slice(0, 26), s: 'See details below' },
    { k: 'BASE', v: 'New Shillong', s: 'Stay at XTSY' },
  ];

  const H2 = ({ children }: { children: ReactNode }) => <h2 className="xt-display m-0 text-[40px] leading-none sm:text-[52px]">{children}</h2>;

  return (
    <>
      <Helmet>
        {!destination.planningLinks && <>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={images[0]?.src} />
        </>}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <PageShell cta={{ title: 'Explore from the pines.', sub: `Stay at XTSY and our travel desk will line up a ${destination.region} day with a local driver.`, bookTo: '/book', bookLabel: 'Book a stay' }}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Things to do', to: '/things-to-do-in-meghalaya' }, { label: destination.name }]} />
        <section className="relative mt-4 overflow-hidden bg-xt-pine text-[#EAF0EA]">
          <div className={`${PAD} relative grid items-end gap-8 py-14 lg:grid-cols-12 lg:py-20`}>
            <div className="relative flex flex-col gap-4 lg:col-span-7">
              <Link to={categoryLink.to} className="xt-in text-[15px] font-bold text-[#EAF0EA] hover:text-white">← {categoryLink.label}</Link>
              <h1 className="xt-in xt-d1 xt-display m-0 text-[60px] leading-[0.88] sm:text-[104px] lg:text-[124px]">{destination.name}</h1>
              <p className="xt-in xt-d2 m-0 max-w-[640px] font-serif text-[19px] leading-relaxed text-[#C8D6CC] sm:text-[22px]">{destination.heroTagline ?? destination.shortDescription}</p>
            </div>
            <div className="lg:col-span-5">
              <Photo src={realImages[0]?.src} alt={realImages[0]?.alt ?? destination.name} eager tone="pine" className="xt-in xt-d2 aspect-[520/420] rounded-[28px]" />
              {destCredit && realImages.length > 0 && <p className="m-0 mt-1.5 text-[12px] text-[#C8D6CC]">Photo: <a href={destCredit.url} target="_blank" rel="noopener noreferrer nofollow" className="underline">{destCredit.name}</a> on <a href={destCredit.pexelsUrl} target="_blank" rel="noopener noreferrer nofollow" className="underline">Pexels</a></p>}
            </div>
          </div>
        </section>

        <section className={`${PAD} relative -mt-8`}>
          <div className="xt-reveal grid grid-cols-2 overflow-hidden rounded-[24px] bg-white shadow-[0_24px_48px_-30px_rgba(31,34,48,0.5)] lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.k} className="flex flex-col gap-1.5 border-b border-r border-xt-line p-6">
                <span className="text-[12px] font-extrabold tracking-wider text-xt-mute">{f.k}</span>
                <span className="font-display text-[26px] capitalize leading-none text-xt-crimson sm:text-[32px]">{f.v}</span>
                <span className="text-[13px] text-xt-mute">{f.s}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${PAD} grid gap-12 py-16 lg:grid-cols-12`}>
          <article className="flex min-w-0 flex-col gap-10 lg:col-span-8">
            <section className="xt-reveal flex flex-col gap-3">
              <H2>Overview</H2>
              <p className="m-0 whitespace-pre-line font-serif text-[18px] leading-[1.7] sm:text-[20px]">{destination.description}</p>
            </section>
            <BookingCTA destination={destination} placement="top" />
            {showShillongHostelLink && <ShillongHostelLinkBlock nearName={destination.name} source={`destination_${destination.slug}`} />}
            {destination.deepDive?.map((b) => (
              <section key={b.heading} className="xt-reveal flex flex-col gap-3">
                <H2>{b.heading}</H2>
                <p className="m-0 whitespace-pre-line font-serif text-[18px] leading-[1.7] sm:text-[20px]">{livePrice(b.body)}</p>
              </section>
            ))}
            {realImages.length > 0 && (
              <section className="flex flex-col gap-4">
                <H2>Photo gallery</H2>
                <DestinationGallery images={images} destinationName={destination.name} />
              </section>
            )}
            <section className="xt-reveal flex flex-col gap-3">
              <H2>Best time to visit</H2>
              <p className="m-0 font-serif text-[18px] leading-[1.7]">{destination.bestTimeToVisit}</p>
            </section>
            <section className="xt-reveal flex flex-col gap-4">
              <H2>Things to do</H2>
              <ul className="m-0 grid list-none gap-2.5 p-0 sm:grid-cols-2">
                {destination.thingsToDo.map((t) => <li key={t} className="rounded-2xl bg-white px-4 py-3 text-[15px] font-semibold">✓ {t}</li>)}
              </ul>
            </section>
            <section className="xt-reveal flex flex-col gap-3">
              <H2>How to reach</H2>
              <p className="m-0 font-serif text-[18px] leading-[1.7]">{destination.howToReach}</p>
            </section>
            <section className="xt-reveal flex flex-col gap-4">
              <H2>Tips before you go</H2>
              <ul className="m-0 flex list-disc flex-col gap-2 pl-5 font-serif text-[18px] leading-[1.6]">
                {destination.travelTips.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </section>
            {destination.planningLinks && (
              <nav aria-label={`${destination.name} trip planning`} className="flex flex-col gap-5 border-t border-xt-line pt-8">
                <H2>Plan your {destination.name} visit</H2>
                <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2">
                  {destination.planningLinks.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="inline-flex min-h-12 items-center text-[16px] font-extrabold text-xt-crimson underline underline-offset-4">{link.label} →</Link>
                      <p className="m-0 text-[15px] leading-relaxed text-xt-mute">{link.context}</p>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </article>

          <aside className="flex flex-col gap-4 lg:col-span-4">
            <div className="xt-reveal sticky top-28 flex flex-col gap-4">
              <div className="flex flex-col gap-3 rounded-[24px] bg-xt-slate p-7 text-xt-paper">
                <h3 className="m-0 text-[20px] font-extrabold">See it on a tour</h3>
                <p className="m-0 text-[15px] leading-relaxed text-xt-fog">{destination.name} features on our Meghalaya packages, planned by the team that lives here.</p>
                <Link to="/meghalaya-tour-packages" className="xt-btn flex h-12 items-center justify-center rounded-full bg-xt-crimson text-[15px] font-extrabold text-white hover:text-white">Browse tours</Link>
              </div>
              <div className="flex flex-col gap-3 rounded-[24px] bg-white p-7">
                <h3 className="m-0 text-[20px] font-extrabold">Stay nearby</h3>
                <p className="m-0 text-[15px] leading-relaxed text-xt-mute">Base yourself at XTSY in New Shillong (dorm beds from {inr(lowestDormPrice())}). For nights away, we book trusted partner stays and transport.</p>
                <Link to="/book" className="xt-btn flex h-12 items-center justify-center rounded-full border-[1.5px] border-xt-ink text-[15px] font-extrabold text-xt-ink hover:text-xt-ink">Book direct</Link>
              </div>
            </div>
          </aside>
        </section>

        {nearby.length > 0 && (
          <section className={`${PAD} flex flex-col gap-6 pb-14`}>
            <H2>Nearby</H2>
            <div className="grid gap-6 md:grid-cols-3">
              {nearby.map((n) => {
                const img = getDestinationImages(n.slug, 1)[0];
                return (
                  <Link key={n.slug} to={destinationPath(n.slug)} className="xt-reveal xt-lift flex flex-col gap-3 rounded-[22px] text-xt-ink hover:text-xt-ink">
                    <Photo src={img && !img.src.endsWith('placeholder.svg') ? img.src : ''} alt={n.name} tone="slate" className="aspect-[421/260] rounded-[22px]" />
                    <span className="px-1 text-[20px] font-extrabold">{n.name}</span>
                    <span className="px-1 text-[15px] text-xt-mute">{n.shortDescription}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className={`${PAD} grid gap-10 pb-14 lg:grid-cols-12`}>
          <div className="lg:col-span-4"><H2>{destination.name} — FAQs</H2></div>
          <div className="flex flex-col gap-3 lg:col-span-8">
            {faqs.map(({ q, a }) => (
              <div key={q} className="xt-reveal rounded-[18px] bg-white p-6">
                <h3 className="m-0 text-[17px] font-extrabold">{q}</h3>
                <p className="m-0 mt-2 text-[15px] leading-relaxed text-xt-mute">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${PAD} flex flex-col gap-10 pb-10`}>
          <BookingCTA destination={destination} placement="bottom" />
          <StayEatExplore context={destination.name} />
          {!destination.planningLinks && <nav aria-label="Related guides" className="flex flex-col gap-4 border-t border-xt-line pt-8">
            <h2 className="m-0 text-[18px] font-extrabold">Related guides</h2>
            <div className="flex flex-wrap gap-2">
              {[
                categoryLink,
                { to: '/things-to-do-in-meghalaya', label: 'Things to Do in Meghalaya' },
                { to: '/meghalaya-tour-packages', label: 'Meghalaya Tour Packages' },
                { to: '/shillong-tour-package', label: 'Shillong Tour Package' },
                { to: '/best-time-to-visit-meghalaya', label: 'Best Time to Visit' },
                { to: '/meghalaya-travel-guide', label: 'Meghalaya Travel Guide' },
                { to: '/best-hostel-in-shillong', label: 'Best Hostel in Shillong' },
                { to: '/tours', label: 'Northeast India Tours' },
                { to: '/meghalaya-photo-gallery', label: 'Photo Gallery' },
              ].filter((l, i, arr) => arr.findIndex((x) => x.to === l.to) === i).map((l) => (
                <Link key={l.to} to={l.to} className="rounded-full border-[1.5px] border-xt-stone px-4 py-2 text-[14px] font-bold text-xt-ink hover:text-xt-crimson">{l.label}</Link>
              ))}
            </div>
          </nav>}
        </section>
      </PageShell>
    </>
  );
}
