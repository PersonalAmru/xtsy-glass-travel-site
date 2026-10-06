/**
 * /xtsy-270 — Experience by XTSY, India's First Stargaze Glamp (redesign).
 */
import { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { XTSY270_DATA } from '@/data/rooms/xtsy270';
import { SIGNATURE_PACKAGES, formatPackagePrice } from '@/data/signaturePackages';
import { Link } from '@/lib/router-compat';
import B2BBookingForm from '@/components/B2BBookingForm';
import { IMG } from '@/data/v2Images';
import { PageShell, PageHero, Btn, Section, H2, FeatureCards, PriceCards, FaqList, PAD } from '@/components/v2/blocks';
import { Photo, waLink } from '@/components/v2/primitives';
import { inr, roomPrice } from '@/components/v2/pricing';
import { PANORAMA_DECORATION } from '@/data/panoramaPricing';

const STARS = [
  [80, 60, 1.6, 0], [210, 140, 1.2, 1], [330, 40, 2, 2], [470, 110, 1.4, 1], [560, 30, 1.1, 0], [640, 170, 1.7, 2],
  [760, 70, 1.3, 0], [880, 24, 2, 1], [1010, 90, 1.2, 2], [1120, 40, 1.6, 0], [1230, 130, 1.1, 1], [1360, 60, 1.8, 2],
  [40, 300, 1.2, 1], [150, 720, 1.5, 0], [690, 760, 1.3, 2], [1400, 320, 1.4, 0], [720, 420, 1, 2], [610, 620, 1.6, 1],
];

const FEATURES = [
  { t: '270° glass walls', d: 'Mountains, forest and sky on three sides.' },
  { t: 'Stargazing from bed', d: 'Open sky above the bed on clear nights.' },
  { t: 'Queen bed', d: 'Hotel-grade linen and two comfort pillows each.' },
  { t: 'Private en-suite', d: 'Premium fittings, with a view of its own.' },
  { t: 'Air conditioning', d: 'Comfortable in every season.' },
  { t: 'High-speed Wi-Fi', d: 'Fast enough for a morning call, if you must.' },
  { t: 'QLED 4K TV', d: 'Netflix ready for rainy Meghalaya evenings.' },
];

const FAQS = [
  { q: 'Where is Experience by XTSY?', a: 'At XTSY Travellers Hostel on Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya – 793018, near NIFT Shillong and IIM Shillong.' },
  { q: 'How many guests can stay?', a: 'The suite is made for two: one queen bed, up to 2 guests.' },
  { q: 'Can you decorate the suite for an anniversary or proposal?', a: 'Yes. Add the decoration package when you book, ideally 48 hours ahead, and the team will set it up before you arrive.' },
  { q: 'Does the glass suite get hot in the day?', a: 'Daytime sun can warm any glass structure. The suite has climate control, blackout shades and cross ventilation to keep it comfortable.' },
  { q: 'How do I book?', a: 'Experience by XTSY is booked direct only. Reserve on WhatsApp or through the XTSY booking page; the team confirms availability for your date.' },
];

export default function ExperienceByXtsy() {
  const [b2bOpen, setB2bOpen] = useState(false);
  const suite = roomPrice('xtsy-270');
  const now = suite.now || XTSY270_DATA.price;
  const wa = waLink(`Hi XTSY! I'd like to book Experience by XTSY, India's first stargaze glamp. My dates are: `);
  const couples = SIGNATURE_PACKAGES.filter((p) => /honeymoon/i.test(p.slug));


  return (
    <>
      <SEOHead title={XTSY270_DATA.seoTitle} description={XTSY270_DATA.seoDescription} keywords={(XTSY270_DATA as { seoKeywords?: string }).seoKeywords} canonicalUrl={XTSY270_DATA.canonicalUrl} ogType="product" />
      <PageShell bar={{ label: 'Book a stay', to: wa, note: `Experience by XTSY · ${inr(now)} a night, incl. taxes` }} cta={{ title: 'One suite. One night. Yours?', sub: 'Reserve on WhatsApp. Book 48 hours ahead for decoration and concierge.' }}>
        <PageHero
          bg="#1F2438"
          fg="#F4EFE8"
          muted="#C9CFDD"
          eyebrowColor="#E07A8B"
          eyebrow="India’s First Stargaze Glamp · Sleep under the stars"
          title="Experience by XTSY"
          decoration={
            <svg viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
              <g fill="#F4EFE8">
                {STARS.map(([x, y, r, k]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className="xt-twinkle" style={{ animationDuration: `${2.6 + k * 0.9}s`, animationDelay: `${k * 0.8}s`, opacity: 0.7 }} />
                ))}
              </g>
            </svg>
          }
          text={
            <>
              <p className="m-0">A 270° panoramic glass suite in the pine forests of New Shillong, near IIM Shillong. One suite, one couple, one night at a time.</p>
              <div className="mt-6 flex items-end gap-4">
                <span className="font-display text-[64px] leading-[0.9] text-xt-paper sm:text-[72px]">{inr(now)}</span>
                <span className="flex flex-col pb-1.5 text-[15px] text-[#A3ABC2]">
                  <span>per night</span>
                  {suite.was > now && <span>regular <s>{inr(suite.was)}</s></span>}
                </span>
              </div>
            </>
          }
          actions={
            <>
              <Btn to={wa}>Book a stay</Btn>
              <Btn to="#packages" kind="outline-light">See packages</Btn>
            </>
          }
          media={
            <div className="relative flex justify-end">
              <Photo src={IMG.suite[0]} alt="Experience by XTSY, the glass suite" eager tone="slate" sizes="(max-width: 640px) calc(100vw - 48px), 600px" className="aspect-[600/640] w-full max-w-[600px] rounded-[300px]" />
              <div className="xt-float absolute bottom-12 left-2 rounded-2xl bg-xt-paper px-5 py-4 text-[15px] font-extrabold text-xt-ink sm:left-5">Booked direct only · 1 suite a night</div>
            </div>
          }
        />

        <Section>
          <H2>Everything inside the glass</H2>
          <FeatureCards items={FEATURES} />
        </Section>

        <section className={`${PAD} grid gap-6 pb-20 sm:grid-cols-3`}>
          {IMG.suite.slice(1, 7).map((src, i) => (
            <Photo key={src} src={src} alt={`Experience by XTSY photo ${i + 2}`} tone={(['pine', 'night', 'sand'] as const)[i % 3]} className="xt-reveal aspect-[421/320] rounded-3xl" />
          ))}
        </section>

        <Section id="packages" className="bg-xt-cream">
          <H2 eyebrow="Packages">Choose your night</H2>
          <PriceCards
            cards={[
              { t: 'Stay only', price: inr(now), hot: true, text: `One night in the glass suite for two, all inclusive (taxes included, breakfast not included).${suite.was > now ? ` Regular ${inr(suite.was)}.` : ''}`, cta: <Btn to={wa} kind="outline" className="w-full">Reserve</Btn> },
              { t: 'Decoration add-on', price: `+${inr(PANORAMA_DECORATION)}`, text: 'For anniversaries, proposals, honeymoons and birthdays. Book 48 hours ahead.', cta: <Btn to={waLink('Hi XTSY! I want to add the decoration package to my Experience by XTSY stay.')} kind="outline" className="w-full">Add to my stay</Btn> },
            ]}
          />
          <p className="m-0 text-[14px] text-xt-mute">
            Planning a private event or an exclusive booking? <button type="button" onClick={() => setB2bOpen(true)} className="font-extrabold text-xt-crimson underline">Send an enquiry</button>
          </p>
        </Section>

        {couples.length > 0 && (
          <Section>
            <H2 eyebrow="Couple journeys" aside={<Link to="/tours" className="text-[16px] font-extrabold hover:text-xt-crimson">All tour packages →</Link>}>Make it the whole trip</H2>
            <div className="grid gap-6 md:grid-cols-3">
              {couples.map((p) => (
                <Link key={p.slug} to={`/tours/${p.slug}`} className="xt-reveal xt-lift flex flex-col gap-2.5 rounded-3xl border-[1.5px] border-xt-line p-8 text-xt-ink hover:text-xt-ink">
                  <span className="self-start rounded-full bg-xt-blush px-3 py-1.5 text-[13px] font-extrabold text-xt-crimson-dark">{p.duration}</span>
                  <h3 className="m-0 text-[22px] font-extrabold">{p.title}</h3>
                  <p className="m-0 text-[15px] text-xt-mute">{p.shortDescription}</p>
                  <span className="mt-2 text-[20px] font-extrabold">{formatPackagePrice(p.pricePerPerson)} <span className="text-[13px] font-semibold text-xt-mute">/person</span></span>
                </Link>
              ))}
            </div>
          </Section>
        )}

        <FaqList faqs={FAQS} />
      </PageShell>
      <B2BBookingForm isOpen={b2bOpen} onClose={() => setB2bOpen(false)} customTitle="Will it be yours? - Experience by XTSY" customDescription="India's First Stargaze Glamp - Exclusive luxury experience" maxGuests={2} fixedGuests isCoupleFocused />
    </>
  );
}
