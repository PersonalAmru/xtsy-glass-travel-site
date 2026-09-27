/**
 * /work-from-home — Workation (redesign). Plan prices are the same as the
 * previous page (₹5,400 / ₹22,999 / ₹64,999).
 */
import SEOHead from '@/components/SEOHead';
import { COVERS } from '@/data/v2Images';
import { PageShell, PageHero, Btn, Section, H2, PriceCards, StatRow, FaqList, PAD } from '@/components/v2/blocks';
import { Photo, LiveDot, waLink } from '@/components/v2/primitives';

const PLANS = [
  { t: 'Weekly', total: 5400, nights: 7, inc: ['7 nights stay', 'Unlimited Wi-Fi', 'Co-working access', 'Breakfast included'] },
  { t: 'Monthly', total: 22999, nights: 30, hot: true, inc: ['30 nights stay', 'Unlimited Wi-Fi', 'Common workspace', 'Breakfast included', 'Laundry service'] },
  { t: 'Quarterly', total: 64999, nights: 90, inc: ['90 nights stay', 'Unlimited Wi-Fi', 'Common workspace', 'Breakfast included', 'Priority support', 'Storage space'] },
];
const rupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const FAQS = [
  { q: 'What internet speeds do you get?', a: '100+ Mbps fibre with a backup line and UPS for power cuts, so calls don’t drop.' },
  { q: 'How’s the weather for working?', a: 'Around 15–25°C most of the year. Monsoon (June–September) brings heavy rain, but the workspaces are covered and powered.' },
  { q: 'Does food delivery work there?', a: 'Swiggy and Zomato deliver, and TAB Bistro by XTSY is on site for meals and coffee.' },
  { q: 'Can I explore on weekends?', a: 'Yes. The XTSY desk plans weekend trips to Cherrapunji, Dawki and Mawlynnong, and your things stay safe at the hostel.' },
];

export default function WorkationV2() {
  const wa = (plan?: string) => waLink(`Hi XTSY! I'm interested in the ${plan ?? ''} workation plan. My dates: `);
  return (
    <>
      <SEOHead
        title="Work From Shillong — Remote Work & Digital Nomad Hostel | XTSY"
        description="Work remotely from XTSY in New Shillong Township: 100+ Mbps fibre, co-working desks, weekly and monthly plans with breakfast."
        keywords="workation Shillong, work from Shillong, digital nomad hostel Meghalaya, co-working space Shillong, remote work India, work from mountain"
        canonicalUrl="https://xtsy.one/work-from-home"
      />
      <PageShell cta={{ title: 'Your next sprint, from Shillong.', sub: 'Tell us your dates on WhatsApp and we’ll hold a desk and a bed for you.' }}>
        <PageHero
          bg="#E4E7EE"
          eyebrow={<span className="flex items-center gap-2.5"><LiveDot />Workation · online at 100+ Mbps</span>}
          title="Work from the pines."
          text="Fibre Wi-Fi with backup power, a real workspace and breakfast every morning. Shillong stays around 15–25°C most of the year, so the only thing running hot is your laptop."
          actions={<><Btn to="#plans">See plans</Btn><Btn to={wa()} kind="outline">Ask about dates</Btn></>}
          media={<Photo src={COVERS.workation} alt="XTSY Travellers Hostel, New Shillong Township" eager tone="slate" className="aspect-[628/560] rounded-[32px]" />}
        />

        <section className={`${PAD} pt-16`}>
          <StatRow stats={[{ v: '100+ Mbps', l: 'Fibre, with backup' }, { v: '24/7', l: 'Power backup' }, { v: '15–25°C', l: 'Most of the year' }, { v: '4.8', l: 'Google rating' }]} />
        </section>

        <Section id="plans">
          <H2 eyebrow="Plans">Stay a week. Or a season.</H2>
          <PriceCards
            cards={PLANS.map((p) => ({
              t: p.t,
              price: rupee(p.total),
              per: `${p.nights} nights · ${rupee(Math.round(p.total / p.nights))} a day`,
              inc: p.inc,
              hot: p.hot,
              badge: p.hot ? 'MOST POPULAR' : undefined,
              cta: <Btn to={wa(p.t.toLowerCase())} kind={p.hot ? 'primary' : 'outline'} className="w-full">Book {p.t}</Btn>,
            }))}
          />
        </Section>

        <section className={`${PAD} grid gap-6 pb-16 md:grid-cols-2`}>
          {[
            { t: 'The workspace', bg: '#EFE6DA', items: ['Dedicated co-working', 'Private meeting rooms', 'Ergonomic workstations', 'Mountain-view desks', 'Quiet and team zones', 'Printing and scanning'] },
            { t: 'Life around work', bg: '#E4E7EE', items: ['Coffee and tea all day', 'Weekly networking nights', 'Daily housekeeping', 'Laundry service', 'Secure lockers', 'Flexible check-in and out'] },
          ].map((b) => (
            <div key={b.t} className="xt-reveal flex flex-col gap-5 rounded-[28px] p-8 sm:p-10" style={{ background: b.bg }}>
              <h2 className="xt-display m-0 text-[40px] leading-none sm:text-[48px]">{b.t}</h2>
              <ul className="m-0 grid list-none grid-cols-1 gap-x-5 gap-y-3 p-0 sm:grid-cols-2">
                {b.items.map((x) => <li key={x} className="text-[16px] font-bold">{x}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <FaqList faqs={FAQS} />
      </PageShell>
    </>
  );
}
