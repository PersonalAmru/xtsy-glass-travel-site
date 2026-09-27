/**
 * /xtsy-adventure-campsite-dawki — Dawki riverside camping (redesign).
 * The camp is run by a trusted partner; XTSY books it and handles transfers.
 */
import { Helmet } from 'react-helmet-async';
import SEOHead from '@/components/SEOHead';
import { DAWKI_CAMPING_IMAGES } from '@/data/properties';
import { PageShell, PageHero, Btn, Section, H2, PriceCards, FaqList, PAD } from '@/components/v2/blocks';
import { Photo, waLink } from '@/components/v2/primitives';

const FAQS = [
  { q: 'Where is the campsite?', a: 'On the banks of the Umngot River at Dawki, Meghalaya — about 85 km (around 3 hours by road) from XTSY in New Shillong Township.' },
  { q: 'Who runs the campsite?', a: 'A trusted partner camp on the Umngot. The XTSY desk books your tent, arranges your transfer from New Shillong and stays your contact throughout. The partner’s house rules are shared before you pay.' },
  { q: 'What’s included in the ₹1,000 Camping + Breakfast plan?', a: 'A pre-pitched tent, sleeping mat, hot breakfast, welcome chai and one hour of bonfire. Washrooms are shared and located just outside the campsite.' },
  { q: 'Is dinner available?', a: 'Yes, a hot dinner can be arranged at extra cost. Please pre-order on WhatsApp (+91 88373 17070).' },
  { q: 'Are bonfires and water activities free?', a: 'Bonfires beyond the included hour, boat rides, kayaking and cliff swims are chargeable and weather-dependent.' },
  { q: 'How do I get to Dawki?', a: 'Shared sumos run from Shillong, or book a private cab. The XTSY desk can arrange your transfer from New Shillong Township.' },
];

export default function CampsiteV2() {
  const wa = waLink('Hi XTSY! I want to book Dawki riverside camping. Date: … Guests: … Plan: camping + breakfast / only camping');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Campground',
    name: 'Dawki riverside camping — booked via XTSY',
    description: 'Riverside tents on the Umngot River in Dawki, Meghalaya, run by a trusted partner and booked through XTSY. Camping + breakfast ₹1,000 per person per night.',
    url: 'https://xtsy.one/xtsy-adventure-campsite-dawki',
    telephone: '+918837317070',
    image: DAWKI_CAMPING_IMAGES.slice(0, 5).map((p) => `https://xtsy.one${p}`),
    address: { '@type': 'PostalAddress', addressLocality: 'Dawki', addressRegion: 'Meghalaya', postalCode: '793109', addressCountry: 'IN' },
    geo: { '@type': 'GeoCoordinates', latitude: 25.1858, longitude: 92.0223 },
    priceRange: '₹800 - ₹1,000',
  };
  return (
    <>
      <SEOHead
        title="Dawki Riverside Camping from ₹800 — Booked via XTSY"
        description="Camp on the clear Umngot river in Dawki, Meghalaya. Camping + breakfast ₹1,000, only camping ₹800 per person per night, at a trusted partner camp booked through XTSY."
        keywords="dawki camping, umngot river camping, dawki tent stay, riverside camping meghalaya, xtsy adventure campsite"
        canonicalUrl="https://xtsy.one/xtsy-adventure-campsite-dawki"
      />
      <Helmet><script type="application/ld+json">{JSON.stringify(ld)}</script></Helmet>
      <PageShell cta={{ title: 'Pitch up by the Umngot.', sub: 'Tell us your date and group size on WhatsApp. We’ll book the tent and your ride from New Shillong.', bookTo: '/book/campsite', bookLabel: 'Book online' }}>
        <PageHero
          bg="#2F4A3F"
          fg="#EAF0EA"
          muted="#C8D6CC"
          eyebrowColor="#F2B8C2"
          eyebrow="Dawki riverside camping · arranged by XTSY with a trusted partner"
          title="Sleep beside the clearest river."
          text="Pre-pitched tents on the banks of the Umngot, welcome chai, bonfire nights under a starlit sky, and a 2-minute walk to the India–Bangladesh border viewpoint. The camp is run by our trusted partner; the XTSY desk books it, arranges your transfer from New Shillong and stays your contact throughout."
          actions={<><Btn to={wa}>Book a tent on WhatsApp</Btn><Btn to="#packages" kind="outline-light">See packages</Btn></>}
          media={<Photo src={DAWKI_CAMPING_IMAGES[3] ?? DAWKI_CAMPING_IMAGES[0]} alt="The Dawki partner campsite by the Umngot" eager tone="slate" className="aspect-[628/560] rounded-[32px]" />}
        />

        <Section id="packages">
          <H2 eyebrow="Per person, per night · GST inclusive">Pick your night</H2>
          <PriceCards
            cards={[
              { t: 'Camping + breakfast', price: '₹1,000', text: 'Tent pitch · hot Indian breakfast · welcome chai · 1 hour of bonfire', hot: true, badge: 'MOST BOOKED', cta: <Btn to="/book/campsite" className="w-full">Book this</Btn> },
              { t: 'Only camping', price: '₹800', text: 'Tent pitch · welcome chai · shared washrooms just outside the site', cta: <Btn to="/book/campsite" kind="outline" className="w-full">Book this</Btn> },
            ]}
          />
          <div className="xt-reveal flex flex-col gap-3 rounded-3xl bg-xt-cream p-7">
            <span className="text-[15px] font-extrabold">Add-ons, billed on arrival</span>
            <div className="flex flex-wrap gap-2">
              {['Extended bonfire', 'Kayaking', 'Boating', 'Cliff swims', 'Hot Indian dinner'].map((a) => <span key={a} className="rounded-full bg-white px-4 py-2 text-[14px] font-bold">+ {a}</span>)}
            </div>
          </div>
        </Section>

        <section className={`${PAD} grid gap-6 pb-16 sm:grid-cols-3`}>
          {DAWKI_CAMPING_IMAGES.slice(0, 6).map((src, i) => (
            <Photo key={src} src={src} alt={`Dawki partner campsite photo ${i + 1}`} tone={(['pine', 'slate', 'sand'] as const)[i % 3]} className="xt-reveal aspect-[421/300] rounded-3xl" />
          ))}
        </section>

        <FaqList faqs={FAQS} />
      </PageShell>
    </>
  );
}
