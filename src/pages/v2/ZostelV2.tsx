/**
 * /xtsy-vs-zostel — comparison page (redesign). Only XTSY-side facts are
 * stated; Zostel details that could not be verified are left generic.
 */
import SEOHead from '@/components/SEOHead';
import { PageShell, PAD } from '@/components/v2/blocks';
import { SpinningMark } from '@/components/v2/primitives';

const ROWS = [
  { f: 'Luxury stay on site', x: 'Experience by XTSY, India’s First Stargaze Glamp', z: 'Varies by property' },
  { f: 'Groups', x: 'Families, colleges and companies, 10–50+', z: 'Varies by property' },
  { f: 'Pet-friendly', x: 'Cats & birds welcome; dogs by breed and size', z: 'Check with the property' },
  { f: 'Custom itineraries', x: 'Built around your dates and pace', z: 'Mostly scheduled trips' },
  { f: 'Operations', x: 'One XTSY team in Shillong; trusted partners elsewhere', z: 'Network of properties' },
  { f: 'On-site restaurant', x: 'TAB Bistro, breakfast 8:45–11:45 AM & dinner 4:30–11 PM', z: 'Varies by property' },
  { f: 'Where XTSY is', x: 'New Shillong Township, Meghalaya (only property)', z: 'Multiple cities' },
];

export default function ZostelV2() {
  return (
    <>
      <SEOHead
        title="XTSY vs Zostel — Northeast India Hostels & Trips Compared | XTSY"
        description="How XTSY compares with Zostel for Northeast India: one team in New Shillong Township, custom trips with trusted partners, groups, pets and Experience by XTSY."
        canonicalUrl="https://xtsy.one/xtsy-vs-zostel"
      />
      <PageShell cta={{ title: 'Book your Northeast trip with XTSY.', sub: 'Custom itineraries, groups of 2 to 50+, and Experience by XTSY for the night that matters.' }}>
        <section className={`${PAD} relative flex flex-col gap-5 overflow-hidden py-16 lg:py-20`}>
          <SpinningMark className="-right-24 -top-36 h-[520px] w-[520px] opacity-[0.07]" />
          <div className="xt-in xt-eyebrow relative text-[15px] sm:text-[18px]">XTSY vs Zostel · for Northeast India</div>
          <h1 className="xt-in xt-d1 xt-display relative m-0 max-w-[1150px] text-[56px] leading-[0.86] sm:text-[112px]">A whole-journey ecosystem, not a chain.</h1>
          <p className="xt-in xt-d2 relative m-0 max-w-[780px] text-[17px] leading-relaxed text-xt-mute sm:text-[20px]">With XTSY your whole journey is one conversation: stays, tours, rentals, food and 24/7 support from one team in New Shillong Township, with trusted travel partners wherever the road goes.</p>
        </section>

        <section className={`${PAD} pb-16`}>
          <div className="xt-reveal grid grid-cols-2 gap-6 rounded-[28px] bg-xt-ink p-8 text-xt-paper sm:p-10 lg:grid-cols-4">
            {[{ v: '4.7', l: 'Google rating (237 reviews)' }, { v: '9.4', l: 'Booking.com rating' }, { v: '50+', l: 'Guests at once' }, { v: 'NEITA 2025', l: 'Nominated, Best Budget-Friendly Accommodation' }].map((s) => (
              <div key={s.l} className="flex flex-col gap-1.5 border-l-2 border-xt-crimson pl-4">
                <span className="font-display text-[36px] leading-none sm:text-[48px]">{s.v}</span>
                <span className="text-[14px] text-xt-fog">{s.l}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${PAD} pb-16`}>
          <div className="xt-reveal overflow-hidden rounded-[28px] bg-white">
            <div className="grid grid-cols-[1.4fr_1.3fr_1fr] gap-3 bg-xt-crimson px-5 py-5 text-[15px] font-extrabold text-white sm:px-8 sm:text-[16px]"><span>Feature</span><span>XTSY</span><span>Zostel</span></div>
            {ROWS.map((r) => (
              <div key={r.f} className="grid grid-cols-[1.4fr_1.3fr_1fr] gap-3 border-t border-xt-cream px-5 py-4 text-[14px] sm:px-8 sm:text-[16px]">
                <span className="font-bold">{r.f}</span>
                <span className="font-extrabold text-[#2F6B4B]">{r.x}</span>
                <span className="text-xt-mute">{r.z}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-xt-mute">Zostel details are general; check with Zostel for specifics. Zostel is a trademark of its owner.</p>
        </section>

        <section className={`${PAD} grid gap-6 pb-10 md:grid-cols-3`}>
          {[
            { t: 'One team, start to finish', d: 'Stay, cabs, guides and food are arranged by the same desk, so nothing gets lost between vendors.', cls: 'bg-xt-crimson text-white' },
            { t: 'Built for groups', d: 'Colleges, companies and families of 10 to 50+, with proper GST invoices.', cls: 'bg-white text-xt-ink' },
            { t: 'Your dates, your pace', d: 'Leave when you want, not when the bus does. Every itinerary can change.', cls: 'bg-xt-slate text-xt-paper' },
          ].map((w) => (
            <div key={w.t} className={`xt-reveal xt-lift flex flex-col gap-3 rounded-[26px] p-9 ${w.cls}`}>
              <h3 className="xt-display m-0 text-[34px] leading-none sm:text-[38px]">{w.t}</h3>
              <p className="m-0 text-[16px] leading-relaxed opacity-90">{w.d}</p>
            </div>
          ))}
        </section>
      </PageShell>
    </>
  );
}
