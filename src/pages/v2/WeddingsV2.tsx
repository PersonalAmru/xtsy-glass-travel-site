/**
 * /destination-wedding-shillong — intimate weddings at XTSY (redesign).
 */
import { Helmet } from 'react-helmet-async';
import SEOHead from '@/components/SEOHead';
import { IMG, first } from '@/data/v2Images';
import { PageShell, PageHero, Btn, Section, H2, FeatureCards, PriceCards, FaqList, PAD } from '@/components/v2/blocks';
import { EnquiryForm } from '@/components/v2/EnquiryForm';
import { Photo, waLink } from '@/components/v2/primitives';

const FAQS = [
  { q: 'Can I have a destination wedding in Shillong?', a: 'Yes! Shillong is emerging as a top destination wedding location in India. XTSY offers intimate wedding packages with mountain backdrops, forest dining by TAB Bistro, guest accommodation, and event coordination for up to 100 guests.' },
  { q: 'How much does a destination wedding in Meghalaya cost?', a: 'A destination wedding at XTSY Shillong starts from ₹3-5 lakhs for an intimate gathering of 30-50 guests, including venue, accommodation, catering, and basic decor. Custom packages are available for larger events. Compared to Goa or Rajasthan, a Meghalaya destination wedding typically costs 30-40% less for a comparable experience.' },
  { q: 'What is the best time for a destination wedding in Meghalaya?', a: 'October to April is the ideal season for a Meghalaya destination wedding — clear skies, golden light, and pleasant 15-22°C weather perfect for open-air ceremonies and photography. We recommend avoiding the June-September monsoon for outdoor events, though our covered spaces can host year-round.' },
  { q: 'How many guests can XTSY host for a wedding?', a: 'XTSY specialises in intimate weddings of 20-100 guests. With on-site dorms, private rooms, and Experience by XTSY for the couple, most of your guests can stay on-property — making it a true multi-day wedding experience rather than a single-day event.' },
  { q: 'Does XTSY offer event catering in Shillong?', a: 'Yes. TAB Bistro by XTSY provides full-service catering for weddings, corporate events, birthday parties, and private gatherings. Multi-cuisine menu including Indian, Continental, Chinese, and Northeast specialties.' },
  { q: 'Can we combine the wedding with a honeymoon in Meghalaya?', a: "Absolutely. Many couples extend their stay into a honeymoon, exploring Dawki's crystal-clear Umngot River, the living root bridges of Cherrapunji, and Mawlynnong — Asia's cleanest village. XTSY can arrange a curated post-wedding tour for the couple through trusted travel partners." },
];

const STEPS = [
  { t: 'Pick your dates', d: 'Aim for October–April for clear skies and golden light. Lock dates 3–6 months ahead for the best Experience by XTSY and room availability.' },
  { t: 'Choose your guest count', d: 'Our sweet spot is 20–100 guests. Tell us the number and we map the right ceremony space and on-site accommodation mix.' },
  { t: 'Build your menu with TAB Bistro', d: 'Indian, Continental, Chinese and Khasi specialties — customisable for veg, Jain and dietary needs, as plated dinners or live counters.' },
  { t: 'Add décor, music & shoots', d: 'Floral and light décor, sound, and pre-wedding shoots across Experience by XTSY, the mountain terrace and the pine-forest trail.' },
  { t: 'Leave the logistics to us', d: 'Airport transfers from Guwahati, guest check-in, day-of coordination, and an optional post-wedding honeymoon tour to Dawki and Cherrapunji.' },
];

export default function WeddingsV2() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    name: 'XTSY — Destination Wedding & Event Venue Shillong',
    description: 'Intimate destination weddings and events at XTSY Travellers Hostel, New Shillong Township, Meghalaya. Mountain backdrop, forest dining and full-service catering by TAB Bistro.',
    url: 'https://xtsy.one/destination-wedding-shillong',
    telephone: '+918837317070',
    address: { '@type': 'PostalAddress', streetAddress: 'Mawdiangdiang Road, New Shillong Township', addressLocality: 'Shillong', addressRegion: 'Meghalaya', postalCode: '793018', addressCountry: 'IN' },
    amenityFeature: ['Mountain Views', 'In-house Catering', 'Accommodation'].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  };
  return (
    <>
      <SEOHead
        title="Destination Wedding in Shillong — Intimate Mountain Weddings | XTSY"
        description="Plan your destination wedding in Shillong, Meghalaya. Mountain venue, TAB Bistro catering, guest accommodation, and Experience by XTSY for the couple. Intimate weddings for 20-100 guests."
        keywords="destination wedding shillong, wedding venue shillong, meghalaya destination wedding, intimate wedding northeast india"
        canonicalUrl="https://xtsy.one/destination-wedding-shillong"
      />
      <Helmet><script type="application/ld+json">{JSON.stringify(ld)}</script></Helmet>
      <PageShell cta={{ title: 'Say yes in the hills.', sub: 'Share your dates and guest count on WhatsApp and we’ll send a first plan.' }}>
        <PageHero
          bg="#F6E2E6"
          eyebrow="Destination weddings · New Shillong Township"
          title="Say yes in the hills."
          text="Intimate weddings for 20–100 guests with a Khasi Hills backdrop, TAB Bistro catering, on-site guest stays and Experience by XTSY for the couple."
          actions={<><Btn to="#enquire">Plan your wedding</Btn><Btn to={waLink('Hi XTSY! We are planning a wedding in Shillong. Dates: … Guests: …')} kind="outline">WhatsApp us</Btn></>}
          media={<Photo src={IMG.suite[1] ?? first(IMG.suite)} alt="Experience by XTSY, India’s First Stargaze Glamp" eager tone="crimson" className="aspect-[628/520] rounded-[32px]" />}
        />

        <Section>
          <H2 eyebrow="Why XTSY">Everything on one hill</H2>
          <FeatureCards
            cols={3}
            items={[
              { t: 'Mountain venue', d: 'Open-air ceremony with a Khasi Hills backdrop. Pine forests, misty mornings, golden sunsets.' },
              { t: 'TAB Bistro catering', d: 'Indian, Continental, Chinese and Northeast specials, customisable for any dietary need.' },
              { t: 'Guest accommodation', d: 'Dorms, private rooms, and Experience by XTSY for the couple — guests stay on-site.' },
              { t: 'Photo-ready spaces', d: 'Experience by XTSY, the mountain terrace and the forest trail.' },
              { t: 'Event coordination', d: 'Décor, music, lighting, seating and day-of coordination.' },
              { t: 'Intimate setting', d: 'Made for 20–100 guests. Personal and unforgettable — no generic banquet halls.' },
            ]}
          />
        </Section>

        <Section className="bg-xt-cream">
          <H2 eyebrow="Starting points · fully customisable">Wedding packages</H2>
          <PriceCards
            cards={[
              { t: 'Intimate elopement', price: 'From ₹1.5 lakh', per: '2–15 guests', text: 'Just the two of you (and your closest few). Experience by XTSY stay, private ceremony setup, couple photography and a curated dinner.', cta: <Btn to="#enquire" kind="outline" className="w-full">Enquire</Btn> },
              { t: 'Classic mountain wedding', price: 'From ₹3–5 lakh', per: '30–50 guests', text: 'Open-air ceremony, TAB Bistro catering, guest accommodation, décor and day-of coordination.', hot: true, badge: 'MOST POPULAR', cta: <Btn to="#enquire" className="w-full">Enquire</Btn> },
              { t: 'Grand celebration', price: 'Custom quote', per: '50–100 guests', text: 'Multi-day mehendi, sangeet, ceremony and reception across the property, full event production and stays for all guests.', cta: <Btn to="#enquire" kind="outline" className="w-full">Enquire</Btn> },
            ]}
          />
        </Section>

        <section className={`${PAD} grid gap-5 py-16 md:grid-cols-5`}>
          {STEPS.map((s, i) => (
            <div key={s.t} className="xt-reveal flex flex-col gap-2 rounded-3xl bg-white p-6">
              <span className="font-display text-[40px] leading-none text-xt-crimson">0{i + 1}</span>
              <span className="text-[17px] font-extrabold">{s.t}</span>
              <span className="text-[14px] leading-normal text-xt-mute">{s.d}</span>
            </div>
          ))}
        </section>

        <section className={`${PAD} pb-16`}>
          <EnquiryForm
            title="Plan your wedding"
            packageTitle="Destination wedding"
            category="wedding"
            location="New Shillong Township"
            typeLabel="PACKAGE"
            types={['Intimate elopement', 'Classic mountain wedding', 'Grand celebration', 'Not sure yet']}
            defaultTravellers={40}
            travellersLabel="GUESTS"
          />
        </section>

        <FaqList faqs={FAQS} />
      </PageShell>
    </>
  );
}
