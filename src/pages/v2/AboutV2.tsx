/**
 * /about — About XTSY (redesign). Keeps the Organization + Hostel JSON-LD.
 */
import { Helmet } from 'react-helmet-async';
import SEOHead, { getSEOConfig } from '@/components/SEOHead';
import { Link } from '@/lib/router-compat';
import neitaCertificate from '@/assets/neita-award-certificate.jpeg';
import { COVERS } from '@/data/v2Images';
import { PageShell, PageHero, Section, H2, StatRow, SplitFeature, PAD, Btn, FaqList } from '@/components/v2/blocks';
import { Photo, Eyebrow, XtsyMark, SpinningMark } from '@/components/v2/primitives';
import { inr, lowestDormPrice } from '@/components/v2/pricing';

const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Mawdiangdiang Road, New Shillong Township',
  addressLocality: 'Shillong',
  addressRegion: 'Meghalaya',
  postalCode: '793018',
  addressCountry: 'IN',
};

const ABOUT_FAQS = [
  { q: 'Where is XTSY Travellers Hostel?', a: 'On Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya 793018 — near NIFT Shillong, IIM Shillong, NEIGRIHMS, NEIAH and Martin Luther Christian University. It is not in Police Bazar or central Shillong.' },
  { q: 'What is Experience by XTSY?', a: "India's first stargaze glamp: a 270° panoramic glass suite at the same New Shillong Township property. It is booked directly with XTSY, from ₹5,399 a night (₹5,799 with breakfast for two)." },
  { q: 'Does XTSY have properties outside Shillong?', a: "XTSY's own property is only in New Shillong Township. Elsewhere in Meghalaya and Northeast India, XTSY arranges stays, transport and travel help through trusted travel partners." },
  { q: 'How highly rated is XTSY?', a: 'XTSY Travellers Hostel is rated 4.8★ from 161 Google reviews and has hosted 10,786+ guests. TAB Bistro by XTSY has its own Google profile.' },
];

export default function AboutV2() {
  const seo = getSEOConfig('about');
  const brands = [
    { t: 'XTSY Travellers Hostel', d: 'Dorms and private rooms in New Shillong Township.', to: '/book', bg: '#A12444', fg: '#FFFFFF', mark: '#F4EFE8' },
    { t: 'Experience by XTSY', d: 'India’s First Stargaze Glamp.', to: '/xtsy-270', bg: '#1F2438', fg: '#F4EFE8', mark: '#BD2E30' },
    { t: 'TAB Bistro by XTSY', d: 'Forest dining, 9 AM to 10:30 PM.', to: '/tab-bistro', bg: '#2F4A3F', fg: '#EAF0EA', mark: '#F2B8C2' },
    { t: 'XTSY Voyage', d: 'Tours, rentals and travel films, with trusted partners.', to: '/tours', bg: '#FFFFFF', fg: '#1F2230', mark: '#A12444' },
  ];
  const tiers = [
    { n: '1', t: 'Experience by XTSY', d: 'India’s First Stargaze Glamp, a 270° panoramic glass suite for couples.' },
    { n: '2', t: 'Private rooms', d: 'King Double rooms with a view of the pines.' },
    { n: '3', t: 'Female-only dorm', d: 'A 4-bed women-only dorm with lockers and curtains.' },
    { n: '4', t: 'Mixed dorms', d: `6 and 8-bed dorms from ${inr(lowestDormPrice())} a night.` },
  ];
  return (
    <>
      <SEOHead structuredDataOnly title={seo.title} description={seo.description} keywords={seo.keywords} canonicalUrl="https://xtsy.one/about" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'XTSY Travellers Hostel', url: 'https://xtsy.one', telephone: '+918837317070', email: 'admin@xtsy.one', address: ADDRESS, sameAs: ['https://www.instagram.com/xtsyhostel', 'https://www.youtube.com/@xtsyhostel'] })}</script>
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'Hostel', name: 'XTSY Travellers Hostel', url: 'https://xtsy.one/about', telephone: '+918837317070', address: ADDRESS, petsAllowed: true })}</script>
      </Helmet>
      <PageShell>
        <PageHero
          eyebrow="About XTSY"
          title="Where innovation meets exploration."
          size="md"
          decoration={<SpinningMark className="-right-40 -top-32 h-[620px] w-[620px] opacity-[0.06]" />}
          text="XTSY is one home in the pines of New Shillong, with food and journeys that reach across the Northeast through trusted travel partners. We want Indian travel to feel personal, well designed and worth talking about."
          media={<Photo src={COVERS.about} alt="XTSY Travellers Hostel, New Shillong Township" eager tone="pine" className="aspect-[628/520] rounded-[32px]" />}
        />

        <section className={`${PAD} pt-16`}>
          <StatRow stats={[{ v: '10,786+', l: 'Happy guests' }, { v: '4.8', l: 'Google rating (161)' }, { v: '9.4', l: 'Booking.com' }, { v: '30+', l: 'Tour packages' }]} />
        </section>

        <Section>
          <H2 eyebrow="The XTSY family">One address, many ways in</H2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((b) => (
              <Link key={b.t} to={b.to} className="xt-reveal xt-lift flex min-h-[220px] flex-col gap-3 rounded-3xl p-7" style={{ background: b.bg, color: b.fg }}>
                <XtsyMark size={34} fill={b.mark} />
                <span className="text-[21px] font-extrabold">{b.t}</span>
                <span className="text-[15px] leading-normal opacity-85">{b.d}</span>
                <span className="mt-auto text-[15px] font-extrabold">Explore →</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section className="bg-xt-cream">
          <H2 eyebrow="All at one address">Four ways to stay</H2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t) => (
              <div key={t.n} className="xt-reveal flex flex-col gap-3 rounded-3xl bg-white p-7">
                <span className="font-display text-[56px] leading-none text-xt-crimson">{t.n}</span>
                <span className="text-[19px] font-extrabold">{t.t}</span>
                <span className="text-[15px] leading-normal text-xt-mute">{t.d}</span>
              </div>
            ))}
          </div>
        </Section>

        <SplitFeature media={<img src={neitaCertificate} alt="NEITA 2025 nomination certificate" loading="lazy" className="w-full rounded-[28px] bg-white object-contain p-4" />}>
          <Eyebrow>Recognition</Eyebrow>
          <h2 className="xt-display m-0 text-[44px] leading-[0.95] sm:text-[60px]">Nominated at NEITA 2025</h2>
          <p className="m-0 text-[17px] leading-relaxed text-xt-mute">XTSY Traveller’s Hostel was nominated as Best Budget-Friendly Accommodation in the Service Excellence Award at the Northeast India Tourism Awards 2025, an initiative of the Emerging North-East Eco Forum (ENEEF), held on 11 October 2025 in Guwahati.</p>
        </SplitFeature>

        <section className={`${PAD} pb-8`}>
          <div className="xt-reveal grid gap-8 rounded-[32px] bg-xt-slate p-8 text-xt-paper sm:p-12 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Eyebrow light>Location & how to reach</Eyebrow>
              <h2 className="xt-display m-0 text-[40px] leading-none sm:text-[52px]">XTSY Travellers Hostel</h2>
              <address className="text-[16px] not-italic leading-relaxed text-xt-fog">
                Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya – 793018, India
                <br />Near NIFT Shillong, IIM Shillong, NEIGRIHMS, NEIAH and Martin Luther Christian University
                <br />+91 88373 17070 · admin@xtsy.one · Reception 24/7
              </address>
              <p className="m-0 text-[14px] text-[#9EA6B8]">This is XTSY’s only property. Everywhere else, XTSY arranges stays, transport and travel help through trusted travel partners.</p>
            </div>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[15px] leading-relaxed text-xt-fog">
              <li><strong className="text-xt-paper">By air:</strong> Fly to Guwahati (GAU), about 100 km / 2.5–3 hours by road. Shillong Airport (Umroi) also has limited flights. We arrange airport transfers.</li>
              <li><strong className="text-xt-paper">By train:</strong> Guwahati Railway Station, then shared taxis to Shillong from ISBT.</li>
              <li><strong className="text-xt-paper">By road:</strong> NH6 from Guwahati through the Ri-Bhoi pine forests.</li>
              <li className="pt-2"><Btn to="/contact" kind="light">Contact the desk</Btn></li>
            </ul>
          </div>
        </section>
        <FaqList title="About XTSY, answered" faqs={ABOUT_FAQS} />
      </PageShell>
    </>
  );
}
