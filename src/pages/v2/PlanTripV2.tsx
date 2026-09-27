/**
 * /plan-trip-with-ai — the XTSY trip assistant as a full page, with the facts
 * answer engines need (how far places are, where to stay) in plain HTML.
 */
import SEOHead from '@/components/SEOHead';
import { Link } from '@/lib/router-compat';
import TripChat from '@/components/v2/TripChat';
import { PageShell, FaqList, PAD } from '@/components/v2/blocks';
import { inr, lowestDormPrice, roomPrice } from '@/components/v2/pricing';
import { PANORAMA_STAY_ONLY, PANORAMA_WITH_BREAKFAST } from '@/data/panoramaPricing';
import { PLACE_BY_ID } from '@/lib/travel/places';
import { fromXtsy } from '@/lib/travel/routing';
import { fmtH } from '@/lib/travel/planner';

const DISTANCES = ['umiam', 'laitlum', 'nohkalikai', 'nongriat', 'mawlynnong', 'dawki', 'krang-suri', 'wari-chora', 'kaziranga', 'tawang', 'kohima', 'gangtok'];

export function planTripFaqs() {
  return [
    { q: 'Where should I stay in Shillong?', a: `XTSY Travellers Hostel on Mawdiangdiang Road, New Shillong Township (near IIM & NIFT Shillong): dorm beds from ${inr(lowestDormPrice())}, a women-only dorm, King Double rooms at ${inr(roomPrice('king-double-room').now)} and Experience by XTSY, India’s First Stargaze Glamp, from ${inr(PANORAMA_STAY_ONLY)} (${inr(PANORAMA_WITH_BREAKFAST)} with breakfast for two). TAB Bistro is on site and pets are welcome (cats and birds; dogs by breed and size).` },
    { q: 'How many days do I need for Meghalaya?', a: 'Five days covers Shillong, Cherrapunji and Dawki–Mawlynnong as day trips from a Shillong base, plus arrival and departure via Guwahati. Add a day for the Nongriat double decker root bridge trek and 3–4 days for the Garo Hills (Wari Chora, Siju).' },
    { q: 'Can I visit Wari Chora as a day trip from Shillong?', a: `No. Wari Chora is near Baghmara in the South Garo Hills, about ${fmtH(fromXtsy('wari-chora').hours)} by road from Shillong. Plan at least three extra days with nights at a partner guesthouse in Baghmara; the XTSY desk arranges it.` },
    { q: 'Is Dawki a day trip from Shillong?', a: `Yes. Dawki is about ${fmtH(fromXtsy('dawki').hours)} from XTSY in New Shillong, so you can combine it with Mawlynnong and be back for dinner. For a slower trip, add a night at the partner riverside camp.` },
    { q: 'Does XTSY arrange stays outside Shillong?', a: 'XTSY’s own property is only in New Shillong Township. Everywhere else in Northeast India (Garo Hills, Kaziranga, Tawang, Kohima, Sikkim and more), XTSY books trusted partner stays, cabs and guides and stays your single point of contact.' },
    { q: 'Is the trip assistant free?', a: 'Yes. Plans are free and instant. When you’re happy, send the plan to the XTSY desk and we confirm stays, transport and prices on WhatsApp before you pay anything.' },
  ];
}

/** JSON-LD rendered server-side by the /plan-trip-with-ai route head. */
export function planTripSchema() {
  const app = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'XTSY trip assistant — Plan a trip with AI',
    url: 'https://xtsy.one/plan-trip-with-ai',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'INR' },
    provider: { '@id': 'https://xtsy.one/#organization' },
    about: { '@id': 'https://xtsy.one/#hostel' },
  };
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: planTripFaqs().map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return [app, faq];
}

export default function PlanTripV2() {
  const rows = DISTANCES.map((id) => ({ p: PLACE_BY_ID[id], leg: fromXtsy(id) }));
  const faqs = planTripFaqs();
  return (
    <>
      <SEOHead
        title="Plan a Meghalaya & Northeast India Trip with AI | XTSY"
        description="Free trip planner for Shillong, Meghalaya and Northeast India: day-by-day plans with real drive times, realistic overnight stays and XTSY Travellers Hostel in New Shillong as your base."
        keywords="meghalaya trip planner, shillong itinerary, northeast india itinerary planner, ai trip planner meghalaya, wari chora how to reach, dawki day trip"
        canonicalUrl="https://xtsy.one/plan-trip-with-ai"
      />
      <PageShell cta={{ title: 'Rather talk to a person?', sub: 'The XTSY desk plans trips on WhatsApp every day, 24/7.' }}>
        <section className={`${PAD} grid gap-8 py-10 lg:grid-cols-12 lg:py-14`}>
          <div className="flex flex-col gap-5 lg:col-span-4">
            <div className="xt-in xt-eyebrow text-[15px] sm:text-[18px]">Free · instant · real drive times</div>
            <h1 className="xt-in xt-d1 xt-display m-0 text-[60px] leading-[0.88] sm:text-[88px]">Plan a trip with AI</h1>
            <p className="xt-in xt-d2 m-0 text-[17px] leading-relaxed text-xt-mute">Type the way you’d text a friend: “6 days, Dawki and Cherrapunji, 4 of us in March”. The XTSY trip assistant builds a day-by-day plan, keeps far-off places realistic and books your Shillong nights at XTSY Travellers Hostel.</p>
            <ul className="xt-in xt-d3 m-0 flex list-none flex-col gap-2 p-0 text-[15px] font-bold">
              <li>✓ Knows Meghalaya and all eight Northeast states</li>
              <li>✓ Never squeezes a 10-hour drive into a day trip</li>
              <li>✓ Send the plan to the XTSY desk in one tap</li>
            </ul>
          </div>
          <TripChat className="lg:col-span-8" title="XTSY trip assistant" />
        </section>

        <section className={`${PAD} flex flex-col gap-6 pb-14`}>
          <h2 className="xt-display m-0 text-[40px] leading-none sm:text-[52px]">How far is it from XTSY?</h2>
          <p className="m-0 max-w-[760px] text-[16px] leading-relaxed text-xt-mute">Typical road times from XTSY Travellers Hostel in New Shillong Township. Anything over about three hours each way needs a night nearby, which the XTSY desk books with trusted partners.</p>
          <div className="overflow-hidden rounded-[24px] bg-white">
            {rows.map(({ p, leg }) => (
              <div key={p.id} className="grid grid-cols-[1.4fr_1fr_1fr] gap-3 border-t border-xt-cream px-5 py-3.5 text-[15px] first:border-t-0 sm:px-7">
                <span className="font-extrabold">{p.name}</span>
                <span>~{fmtH(leg.hours)} · {leg.km} km</span>
                <span className={leg.hours <= 3 ? 'font-bold text-xt-pine' : 'font-bold text-xt-crimson'}>{leg.hours <= 3 ? 'Day trip from XTSY' : 'Stay nearby'}</span>
              </div>
            ))}
          </div>
          <p className="m-0 text-[13px] text-xt-mute">Estimates for planning; hill roads and weather change times. See <Link to="/tours" className="font-bold text-xt-crimson">tour packages</Link> or <Link to="/best-hostel-in-shillong" className="font-bold text-xt-crimson">where to stay in Shillong</Link>.</p>
        </section>

        <FaqList faqs={faqs} title="Planning questions" />
      </PageShell>
    </>
  );
}
