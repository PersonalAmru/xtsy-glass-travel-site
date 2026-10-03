/**
 * /best-hostel-in-shillong and /cheap-hostels-shillong — the Shillong stay hubs.
 * JSON-LD is rendered by the route head (server-side); this page shows the same
 * facts, prices (live inventory) and FAQs.
 */
import { useState } from 'react';
import { Link } from '@/lib/router-compat';
import { COVERS, IMG, first } from '@/data/v2Images';
import { ROOM_IMAGES } from '@/config/roomTypes';
import { inr } from '@/components/v2/pricing';
import { rooms, stayHubCopy, stayHubFaqs, type StayHubVariant } from '@/data/stayHub';
import { fromXtsy } from '@/lib/travel/routing';
import { openTripChat } from '@/components/v2/tripChatEvents';
import { XTSY_MAPS_URL } from '@/data/siteSchemas';
import { PageShell, Breadcrumbs, PAD } from '@/components/v2/blocks';
import { Photo, waLink } from '@/components/v2/primitives';

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[18px] bg-white">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 bg-transparent px-6 py-5 text-left text-[16px] font-extrabold text-xt-ink">
        <span>{q}</span><span aria-hidden="true" className="text-xt-crimson">{open ? '−' : '+'}</span>
      </button>
      <p className={open ? 'm-0 px-6 pb-5 text-[15px] leading-relaxed text-xt-mute' : 'sr-only'}>{a}</p>
    </div>
  );
}

// Card photo = the first photo of each room's own set (see ROOM_IMAGES ordering).
const ROOM_IMG: Record<string, string> = {
  '8-bed-mixed-dorm': first(ROOM_IMAGES['8-bed-mixed-dorm'] ?? IMG.mixedDorm),
  '6-bed-mixed-dorm': first(IMG.mixedDorm),
  '4-bed-female-only-dorm': COVERS.women,
  'king-double-room': first(IMG.king),
  'xtsy-270': first(IMG.suite),
};

export default function StayHubV2({ variant }: { variant: StayHubVariant }) {
  const c = stayHubCopy(variant);
  const faqs = stayHubFaqs(variant);
  const list = rooms();
  const distances = [
    { t: 'Police Bazaar, central Shillong', v: '~30 min by road' },
    { t: 'IIM Shillong · NIFT Shillong · NEIGRIHMS', v: 'a few minutes away' },
    { t: 'Laitlum Canyons', v: `~${fromXtsy('laitlum').hours} h` },
    { t: 'Umiam Lake', v: `~${fromXtsy('umiam').hours} h` },
    { t: 'Cherrapunji (Nohkalikai Falls)', v: `~${fromXtsy('nohkalikai').hours} h · day trip` },
    { t: 'Dawki & Mawlynnong', v: `~${fromXtsy('dawki').hours} h · day trip` },
    { t: 'Guwahati airport / station', v: '~3–3.5 h' },
  ];

  return (
    <PageShell cta={{ title: 'Your bed in the pines is waiting.', sub: 'Live availability for dorms, private rooms and Experience by XTSY — book direct for the base rate.', bookTo: '/book', bookLabel: 'Check availability' }}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: c.h1 }]} />
      <section className={`${PAD} grid items-center gap-8 py-8 lg:grid-cols-12 lg:py-12`}>
        <div className="flex flex-col gap-5 lg:col-span-7">
          <div className="xt-eyebrow text-[14px]">{c.eyebrow}</div>
          <h1 className="xt-display m-0 text-[56px] leading-[0.9] sm:text-[88px]">{c.h1}</h1>
          <div data-quick-answer className="rounded-[22px] bg-xt-blush p-5">
            <h2 className="xt-eyebrow m-0 mb-2 text-[13px]">Quick answer</h2>
            <p className="m-0 text-[16px] leading-relaxed">{c.quick}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/book" className="xt-btn flex h-12 items-center rounded-full bg-xt-crimson px-6 text-[15px] font-extrabold text-white hover:text-white">Check live availability</Link>
            <a href={waLink('Hi XTSY! I want to book a bed in Shillong. Dates: … Guests: …')} target="_blank" rel="noopener noreferrer" className="xt-btn flex h-12 items-center rounded-full border-[1.5px] border-xt-ink px-6 text-[15px] font-extrabold text-xt-ink hover:text-xt-ink">Book on WhatsApp</a>
          </div>
        </div>
        <Photo src={COVERS.home} alt="XTSY Travellers Hostel among the pines of New Shillong Township" eager tone="pine" sizes="(max-width: 1024px) 100vw, 40vw" className="aspect-[4/5] rounded-[28px] sm:aspect-[5/4] lg:col-span-5" />
      </section>

      <section className={`${PAD} flex flex-col gap-5 pb-14`}>
        <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">Rooms and today’s direct prices</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {list.map((r) => (
            <Link key={r.id} to={r.id === 'xtsy-270' ? '/xtsy-270' : '/book'} className="xt-lift flex flex-col overflow-hidden rounded-3xl bg-white text-xt-ink hover:text-xt-ink">
              <Photo src={ROOM_IMG[r.id]} alt={r.id === '8-bed-mixed-dorm' ? 'Bunks with curtains in an XTSY mixed dorm' : r.name} tone="sand" sizes="(max-width: 640px) 100vw, 20vw" className="aspect-[4/3]" />
              <div className="flex flex-col gap-1.5 p-5">
                <span className="text-[16px] font-extrabold">{r.name}</span>
                <span className="text-[20px] font-extrabold text-xt-crimson">{inr(r.price)}<span className="text-[12px] font-semibold text-xt-mute"> / night</span></span>
                <span className="text-[13px] leading-snug text-xt-mute">{r.note}</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="m-0 text-[13px] text-xt-mute">Prices come from our booking engine and can change with dates; check-in 11 AM, check-out strictly 10 AM.</p>
      </section>

      <section className={`${PAD} grid gap-8 pb-14 lg:grid-cols-2`}>
        <div className="flex flex-col gap-4">
          <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">Why guests pick XTSY</h2>
          <ul className="m-0 grid list-none gap-2.5 p-0 sm:grid-cols-2">
            {['4.7★ on Google (237 reviews)', 'NEITA 2025 nominee — Best Budget-Friendly Accommodation', 'Women-only dorm with female staff on call', 'Privacy curtain, locker and charging point at every bunk', 'TAB Bistro restaurant downstairs (9 AM – 10:30 PM)', 'Pet-friendly: cats & birds; dogs by breed and size', 'Fast Wi-Fi and desks for remote work', 'Travel desk for Cherrapunji, Dawki and all of Northeast India'].map((x) => (
              <li key={x} className="rounded-2xl bg-white px-4 py-3 text-[15px] font-semibold">✓ {x}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">Where it is</h2>
          <p className="m-0 text-[15px] leading-relaxed text-xt-mute">Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya 793018 — in the pines near IIM and NIFT Shillong, not in Police Bazaar. Quieter nights, easy parking and faster starts for waterfall days.</p>
          <dl className="m-0 overflow-hidden rounded-[22px] bg-white">
            {distances.map((d) => (
              <div key={d.t} className="grid grid-cols-[60%_40%] gap-3 border-t border-xt-cream px-5 py-3 text-[14px] first:border-t-0">
                <dt className="font-bold">{d.t}</dt><dd className="m-0 text-xt-mute">{d.v}</dd>
              </div>
            ))}
          </dl>
          <a href={XTSY_MAPS_URL} target="_blank" rel="noopener noreferrer" className="self-start py-2 text-[14px] font-bold text-xt-crimson">Open in Google Maps →</a>
        </div>
      </section>

      <section className={`${PAD} grid gap-8 pb-14 lg:grid-cols-12`}>
        <div className="flex flex-col gap-4 lg:col-span-5">
          <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">How to choose a hostel in Shillong</h2>
          <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-[15px] leading-relaxed text-xt-mute">
            <li><strong className="text-xt-ink">Location for your trip:</strong> central Shillong for nightlife on foot; New Shillong for quiet, space and quicker waterfall starts.</li>
            <li><strong className="text-xt-ink">Safety:</strong> look for a women-only dorm, lockers and 24/7 arrival support.</li>
            <li><strong className="text-xt-ink">Food:</strong> an on-site kitchen or restaurant saves money and late-night hunting.</li>
            <li><strong className="text-xt-ink">Price you actually pay:</strong> compare the direct rate — OTAs add their commission.</li>
            <li><strong className="text-xt-ink">Trip help:</strong> a travel desk that knows real drive times saves whole days.</li>
          </ol>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-7">
          <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">Questions travellers ask</h2>
          {faqs.map((f) => <Faq key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      <section className={`${PAD} flex flex-col items-start gap-4 bg-xt-ink py-12 text-xt-paper`}>
        <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">Shillong first. Then all of Northeast India.</h2>
        <p className="m-0 max-w-[760px] text-[16px] leading-relaxed text-xt-fog">Use XTSY as your base for Cherrapunji, Dawki and the root bridges — then go further to Kaziranga, Tawang, Kohima or Sikkim with our desk and trusted partners arranging stays and transport.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => openTripChat('Plan 5 days in Meghalaya staying at XTSY')} className="xt-btn h-12 rounded-full bg-xt-crimson px-6 text-[15px] font-extrabold text-white">✦ Plan a trip with AI</button>
          <Link to="/tours" className="xt-btn flex h-12 items-center rounded-full border-[1.5px] border-xt-paper px-6 text-[15px] font-extrabold text-xt-paper hover:text-xt-paper">Tour packages</Link>
          <Link to={variant === 'cheap' ? '/best-hostel-in-shillong' : '/cheap-hostels-shillong'} className="xt-btn flex h-12 items-center rounded-full border-[1.5px] border-xt-paper/50 px-6 text-[15px] font-extrabold text-xt-paper hover:text-xt-paper">{variant === 'cheap' ? 'Hostels in Shillong guide' : 'Cheapest beds in Shillong'}</Link>
          <Link to="/female-travellers" className="xt-btn flex h-12 items-center rounded-full border-[1.5px] border-xt-paper/50 px-6 text-[15px] font-extrabold text-xt-paper hover:text-xt-paper">Women-safe stays</Link>
        </div>
      </section>
    </PageShell>
  );
}
