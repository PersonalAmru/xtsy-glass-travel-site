/**
 * /tours/$slug — tour package detail (redesign). Same data, schema, booking
 * modal and permit advisory as before; only the presentation changed.
 */
import { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation, Link } from '@/lib/router-compat';
import NotFound from '@/pages/NotFound';
import SEOHead from '@/components/SEOHead';
import TourBookingModal from '@/components/TourBookingModal';
import TourPermitAdvisory from '@/components/TourPermitAdvisory';
import { getAllTours, mergeItinerary, type TourPackage } from '@/data/travelData';
import { getSignaturePackageBySlug, signaturePackageToTourPackage } from '@/data/signaturePackages';
import { useApp } from '@/contexts/AppContext';
import { photoFor } from '@/data/v2TourImages';
import { PageShell, Breadcrumbs, PAD } from '@/components/v2/blocks';
import { Photo, waLink } from '@/components/v2/primitives';

const toSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
type Tab = 'overview' | 'itinerary' | 'inclusions' | 'faqs';

export default function TourDetailV2() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { currency, formatPrice } = useApp();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');

  const tour = useMemo(() => {
    const navState = location.state as { tour?: TourPackage } | null | undefined;
    if (navState?.tour) return navState.tour;
    const found = getAllTours().find((t) => toSlug(t.title) === slug);
    if (found) return mergeItinerary(found);
    const sig = slug ? getSignaturePackageBySlug(slug) : undefined;
    return sig ? signaturePackageToTourPackage(sig) : null;
  }, [slug, location.state]);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!tour) return <NotFound />;

  const photo = photoFor(tour.title, tour.location);
  const schemaImages = tour.images?.length ? [tour.image, ...tour.images] : [tour.image];
  const basePrice = parseInt(tour.price.replace(/[^\d]/g, ''));
  const displayPrice = (tour.fixedPrice || currency.code === 'INR') ? tour.price : formatPrice(Math.round(basePrice * 1.10));

  const inclusions = tour.inclusions ?? [
    'Accommodation on twin/triple sharing',
    'All meals (breakfast, lunch, dinner)',
    'Private transportation throughout',
    'Local expert guide',
    'All entry fees and permits',
    'Welcome drink on arrival',
  ];
  const exclusions = tour.exclusions ?? [
    'Flights/train tickets to & from destination',
    'Personal expenses & tips',
    'Travel insurance',
    'Anything not mentioned in inclusions',
  ];
  const faqs = tour.faqs ?? [
    { q: "What's the best time to do this tour?", a: `The best season for this tour is ${tour.bestSeason}. Weather is ideal and all activities are accessible.` },
    { q: 'Is this tour suitable for beginners?', a: `This tour is rated as "${tour.difficulty}". ${tour.difficulty === 'Easy' ? 'Perfect for first-time adventurers.' : tour.difficulty === 'Moderate' ? 'Some fitness level recommended.' : 'Prior trekking experience recommended.'}` },
    { q: 'What about group sizes?', a: tour.groupSize ? `Groups are kept small at ${tour.groupSize} for a personalized experience.` : 'We keep groups small (4-12 people) for the best experience.' },
    { q: 'Can I customize this itinerary?', a: 'Yes! We offer private tours with customizable itineraries. Contact us on WhatsApp to discuss.' },
  ];

  const tourUrl = `https://xtsy.one/tours/${slug}`;
  const numericPrice = parseInt(tour.price.replace(/[^\d]/g, '')) || undefined;
  const tourSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    image: schemaImages,
    url: tourUrl,
    touristType: tour.category,
    ...(tour.itinerary?.length
      ? { itinerary: { '@type': 'ItemList', numberOfItems: tour.itinerary.length, itemListElement: tour.itinerary.map((day, i) => ({ '@type': 'ListItem', position: i + 1, name: day.title })) } }
      : {}),
    provider: { '@type': 'TravelAgency', name: 'XTSY Travel', url: 'https://xtsy.one/tours' },
    ...(numericPrice ? { offers: { '@type': 'Offer', price: numericPrice, priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: tourUrl } } : {}),
  };
  const tourBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Tours', item: 'https://xtsy.one/tours' },
      { '@type': 'ListItem', position: 3, name: tour.title, item: tourUrl },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const answerBlock = `${tour.title} is a ${tour.duration} ${tour.category} tour in ${tour.location} priced from ${displayPrice} per person. It is rated ${tour.difficulty} difficulty, runs best in ${tour.bestSeason}${tour.groupSize ? `, with group sizes of ${tour.groupSize}` : ''}. Booking direct with XTSY includes transport, permits and a local expert guide.`;
  const quickFacts = [
    { label: 'Price (per person)', value: displayPrice },
    { label: 'Duration', value: tour.duration },
    { label: 'Location', value: tour.location },
    { label: 'Difficulty', value: tour.difficulty },
    { label: 'Best season', value: tour.bestSeason },
    ...(tour.groupSize ? [{ label: 'Group size', value: tour.groupSize }] : []),
    { label: 'Category', value: String(tour.category) },
    { label: 'Booking', value: 'Direct with XTSY — no OTA commission' },
  ];
  const enquire = waLink(`Hi! I'm interested in "${tour.title}" (${tour.duration}). Can you share more details?`);
  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'faqs', label: 'FAQs' },
  ];

  return (
    <>
      <SEOHead
        structuredDataOnly
        title={`${tour.title} — ${tour.duration} from ${displayPrice} | XTSY Travel`}
        description={`${tour.description}`.slice(0, 155)}
        keywords={`${tour.title}, ${tour.location} tour, ${tour.category} tour, ${tour.duration} Meghalaya package, XTSY Travel`}
        canonicalUrl={tourUrl}
        structuredData={[tourSchema, tourBreadcrumb, faqSchema]}
      />
      <PageShell cta={{ title: 'Want it your way?', sub: 'Every itinerary can change. Tell a travel expert your dates and pace on WhatsApp.', bookTo: '/plan-trip-with-ai', bookLabel: 'Build a trip with AI' }}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tours', to: '/tours' }, { label: tour.title }]} />

        <section className={`${PAD} grid items-end gap-8 py-10 lg:grid-cols-12 lg:py-14`}>
          <div className="flex flex-col gap-5 lg:col-span-7">
            <div className="xt-in flex flex-wrap gap-2">
              <span className="rounded-full bg-xt-slate px-3.5 py-1.5 text-[13px] font-extrabold capitalize text-xt-paper">{tour.category}</span>
              <span className="rounded-full bg-xt-sand px-3.5 py-1.5 text-[13px] font-extrabold">{tour.difficulty}</span>
              {tour.exclusive && <span className="rounded-full bg-xt-crimson px-3.5 py-1.5 text-[13px] font-extrabold text-white">XTSY Exclusive</span>}
            </div>
            <h1 className="xt-in xt-d1 xt-display m-0 text-[52px] leading-[0.9] sm:text-[80px]">{tour.title}</h1>
            <div className="xt-in xt-d2 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-bold text-xt-mute">
              <span>★ {tour.rating}</span>
              <span>{tour.location}</span>
              <span>{tour.duration}</span>
              {tour.groupSize && <span>{tour.groupSize}</span>}
              <span>Best: {tour.bestSeason}</span>
            </div>
          </div>
          <Photo src={photo} alt={tour.title} eager tone="pine" className="xt-in xt-d2 aspect-[560/380] rounded-[28px] lg:col-span-5" />
        </section>

        <section className={`${PAD} grid gap-10 pb-16 lg:grid-cols-12`}>
          <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
            <section aria-label="Quick answer" className="xt-reveal rounded-3xl bg-xt-blush p-6">
              <h2 className="xt-eyebrow m-0 mb-2 text-[14px]">In short</h2>
              <p className="m-0 text-[16px] leading-relaxed">{answerBlock}</p>
            </section>

            <section aria-labelledby="tour-facts-heading" className="xt-reveal overflow-hidden rounded-3xl bg-white">
              <h2 id="tour-facts-heading" className="xt-display m-0 px-6 pt-6 text-[32px] leading-none">{tour.title} at a glance</h2>
              <dl className="m-0 mt-4">
                {quickFacts.map((f) => (
                  <div key={f.label} className="grid grid-cols-2 gap-4 border-t border-xt-cream px-6 py-3 text-[15px]">
                    <dt className="font-bold text-xt-mute">{f.label}</dt>
                    <dd className="m-0 font-extrabold">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <TourPermitAdvisory location={tour.location} title={tour.title} />

            <div>
              <div role="tablist" aria-label="Tour details" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
                {tabs.map((t) => (
                  <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`xt-chip h-11 shrink-0 rounded-full border-[1.5px] px-5 text-[15px] font-extrabold ${tab === t.id ? 'border-xt-slate bg-xt-slate text-xt-paper' : 'border-xt-stone text-xt-ink'}`}>{t.label}</button>
                ))}
              </div>

              <div role="tabpanel" className="mt-6">
                {tab === 'overview' && (
                  <div className="flex flex-col gap-5">
                    <p className="m-0 text-[17px] leading-relaxed text-xt-mute">{tour.description}</p>
                    <h3 className="m-0 text-[20px] font-extrabold">Tour highlights</h3>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {tour.highlights.map((h) => <div key={h} className="rounded-2xl bg-white px-4 py-3 text-[15px] font-semibold">✓ {h}</div>)}
                    </div>
                  </div>
                )}

                {tab === 'itinerary' && (tour.itinerary && tour.itinerary.length > 0 ? (
                  <ol className="m-0 flex list-none flex-col gap-4 p-0">
                    {tour.itinerary.map((day, i) => (
                      <li key={i} className="relative rounded-3xl bg-white p-6 pl-20">
                        <span className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-xt-crimson font-display text-[20px] text-white">{i + 1}</span>
                        <div className="flex flex-wrap items-center gap-2 text-[13px] font-extrabold text-xt-mute">
                          <span>{day.day}</span>{day.route && <span>· {day.route}</span>}
                        </div>
                        <h4 className="m-0 mt-1 text-[18px] font-extrabold">{day.title}</h4>
                        <ul className="m-0 mt-2 flex list-disc flex-col gap-1 pl-5 text-[15px] text-xt-mute">
                          {day.activities.map((act, j) => <li key={j}>{act}</li>)}
                        </ul>
                        {day.overnight && <p className="m-0 mt-2 text-[14px] font-bold text-xt-crimson">Overnight: {day.overnight}</p>}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="flex flex-col items-start gap-3 rounded-3xl bg-white p-8">
                    <p className="m-0 text-[16px] text-xt-mute">Detailed day-by-day itinerary available on request.</p>
                    <a href={waLink(`Hi! I'd like the detailed itinerary for "${tour.title}"`)} target="_blank" rel="noopener noreferrer" className="xt-btn flex h-12 items-center rounded-full border-[1.5px] border-xt-ink px-6 text-[15px] font-extrabold text-xt-ink hover:text-xt-ink">Request itinerary</a>
                  </div>
                ))}

                {tab === 'inclusions' && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl bg-white p-6">
                      <h3 className="m-0 mb-3 text-[18px] font-extrabold">What’s included</h3>
                      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px]">{inclusions.map((x) => <li key={x}>✓ {x}</li>)}</ul>
                    </div>
                    <div className="rounded-3xl bg-xt-cream p-6">
                      <h3 className="m-0 mb-3 text-[18px] font-extrabold">Not included</h3>
                      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-xt-mute">{exclusions.map((x) => <li key={x}>✕ {x}</li>)}</ul>
                    </div>
                  </div>
                )}

                {tab === 'faqs' && (
                  <div className="flex flex-col gap-3">
                    {faqs.map((f) => (
                      <details key={f.q} className="group rounded-2xl bg-white">
                        <summary className="cursor-pointer list-none px-6 py-4 text-[16px] font-extrabold">{f.q}</summary>
                        <p className="m-0 px-6 pb-5 text-[15px] leading-relaxed text-xt-mute">{f.a}</p>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="m-0 text-[13px] text-xt-mute">XTSY’s own stay is in New Shillong Township. Stays, vehicles and guides elsewhere on this tour are arranged through trusted travel partners, with XTSY as your single point of contact. <Link to="/tours" className="font-bold text-xt-crimson">All tours</Link></p>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-4 rounded-[28px] bg-xt-ink p-7 text-xt-paper">
              <span className="text-[13px] font-bold text-xt-fog">Starting from</span>
              <span className="font-display text-[52px] leading-none">{displayPrice}<span className="ml-1 font-sans text-[14px] font-semibold text-xt-fog">/person</span></span>
              <div className="flex flex-col gap-1.5 text-[14px] text-xt-fog">
                <span>{tour.duration}</span><span>{tour.location}</span><span>Best: {tour.bestSeason}</span>{tour.groupSize && <span>{tour.groupSize}</span>}
              </div>
              <button type="button" onClick={() => setIsBookingOpen(true)} className="xt-btn h-14 rounded-full bg-xt-crimson text-[16px] font-extrabold text-white">Book now</button>
              <a href={enquire} target="_blank" rel="noopener noreferrer" className="xt-btn flex h-12 items-center justify-center rounded-full border-[1.5px] border-xt-paper text-[15px] font-extrabold text-xt-paper hover:text-xt-paper">Enquire on WhatsApp</a>
              <ul className="m-0 flex list-none flex-col gap-1.5 border-t border-[#383D52] p-0 pt-4 text-[13px] text-xt-fog">
                {['Instant confirmation', 'One date change allowed · booking amount non-refundable', 'Best price guarantee'].map((s) => <li key={s}>✓ {s}</li>)}
              </ul>
            </div>
          </aside>
        </section>
      </PageShell>
      <TourBookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} tourPackage={tour} />
    </>
  );
}
