/**
 * /merch — XTSY travel & work-from-anywhere merch (coming soon; "Notify me").
 * No prices yet: each piece lets the guest ask to be told when it drops.
 */
import { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { MERCH_MOCKUPS } from '@/data/merchMockups';
import { PageShell, PAD } from '@/components/v2/blocks';
import { Marquee, SpinningMark, waLink } from '@/components/v2/primitives';

type Cat = 'travel' | 'wfh';
const PRODUCTS: { id: string; cat: Cat; name: string; detail: string }[] = [
  { id: 'backpack', cat: 'travel', name: 'Trail Laptop Backpack', detail: 'Padded laptop backpack with the X embroidered on the front. Cabin-bag friendly.' },
  { id: 'duffle', cat: 'travel', name: 'Weekender Duffle', detail: 'Two-night duffle for Cherrapunji and Dawki runs, with the X on the side.' },
  { id: 'tote', cat: 'travel', name: 'Canvas Travel Tote', detail: 'Printed Travel.Sleep.Binge tote for markets, beaches and day trips.' },
  { id: 'bottle', cat: 'travel', name: 'Steel Sipper Bottle', detail: 'Stainless steel sipper that keeps chai hot on the long drive to Sohra.' },
  { id: 'tumbler', cat: 'travel', name: 'Insulated Travel Tumbler', detail: 'Vacuum-insulated tumbler with a lid that survives bumpy hill roads.' },
  { id: 'tag', cat: 'travel', name: 'Luggage Tag', detail: 'Red tag with a privacy window. Easy to spot on any bus roof.' },
  { id: 'cap', cat: 'travel', name: 'Embroidered Cap', detail: 'Crimson cap with the X stitched on. Sun at Laitlum, done.' },
  { id: 'hoodie', cat: 'travel', name: 'Pine Hoodie', detail: 'Warm hoodie for Shillong nights and early sunrise drives.' },
  { id: 'umbrella', cat: 'travel', name: 'Monsoon Umbrella', detail: 'For one of the wettest places on Earth. Crimson and slate panels.' },
  { id: 'keychain', cat: 'travel', name: 'X Keychain', detail: 'The XTSY symbol on your keys, from dorm locker to home door.' },
  { id: 'sleeve', cat: 'wfh', name: 'Laptop Sleeve', detail: 'Padded sleeve with a front pocket for the charger.' },
  { id: 'laptopbag', cat: 'wfh', name: 'Embroidered Laptop Bag', detail: 'Shoulder laptop bag for co-working days and client calls.' },
  { id: 'mousepad', cat: 'wfh', name: 'Pine Contour Mouse Pad', detail: 'Mouse pad printed with the hills around New Shillong.' },
  { id: 'notebook', cat: 'wfh', name: 'XTSY Notebook', detail: 'Personalised notebook with an elastic band and ribbon marker.' },
  { id: 'pen', cat: 'wfh', name: 'Pen Trio', detail: 'Three branded pens in crimson, slate and sand.' },
  { id: 'stickers', cat: 'wfh', name: 'Laptop Sticker Pack', detail: 'Die-cut stickers for the lid of a well-travelled laptop.' },
];
const TABS: { id: 'all' | Cat; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'travel', label: 'Travel' },
  { id: 'wfh', label: 'Work from anywhere' },
];

function Mockup({ kind, bg, className }: { kind: string; bg: string; className?: string }) {
  const m = MERCH_MOCKUPS[kind];
  if (!m) return <div className={className} style={{ background: bg }} />;
  return (
    <div className={className} style={{ background: bg }}>
      <svg viewBox="0 0 320 320" width="100%" height="100%" role="img" aria-label={m.label} dangerouslySetInnerHTML={{ __html: m.svg }} />
    </div>
  );
}

export default function MerchV2() {
  const [tab, setTab] = useState<'all' | Cat>('all');
  const [asked, setAsked] = useState<Record<string, boolean>>({});
  const items = PRODUCTS.filter((p) => tab === 'all' || p.cat === tab);
  const count = (id: 'all' | Cat) => PRODUCTS.filter((p) => id === 'all' || p.cat === id).length;
  const shop = (id: Cat) => {
    setTab(id);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead
        title="XTSY Merch — Travel Gear & Work-from-Anywhere Kit | XTSY"
        description="Travel gear and work-from-anywhere kit designed at XTSY Travellers Hostel in New Shillong Township. Tap Notify me and we’ll message you the day each piece drops."
        keywords="xtsy merch, travel merchandise, backpacker gear india, digital nomad kit, xtsy backpack"
        canonicalUrl="https://xtsy.one/merch"
      />
      <PageShell cta={{ title: 'Stay a while.', sub: 'The best way to get the kit early: stay with us in New Shillong and pick it up at the desk.', bookTo: '/book', bookLabel: 'Book a stay' }}>
        <section className={`${PAD} grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-14 lg:py-16`}>
          <div className="flex flex-col gap-6">
            <div className="xt-in xt-eyebrow text-[15px] sm:text-[18px]">XTSY Merch · India’s &amp; Asia’s most loved travel brand</div>
            <h1 className="xt-in xt-d1 xt-display m-0 text-[64px] leading-[0.9] sm:text-[112px]">Pack light.<br />Work anywhere.</h1>
            <p className="xt-in xt-d2 m-0 max-w-[540px] text-[17px] leading-relaxed text-xt-mute sm:text-[20px]">Travel gear and work-from-anywhere kit, designed at XTSY Travellers Hostel in the pines of New Shillong. Made for the road, and for the stay that turns into a month.</p>
            <div className="xt-in xt-d3 flex flex-wrap gap-3">
              <button type="button" onClick={() => shop('travel')} className="xt-btn h-14 rounded-full bg-xt-crimson px-7 text-[16px] font-extrabold text-white">Shop travel gear</button>
              <button type="button" onClick={() => shop('wfh')} className="xt-btn h-14 rounded-full border-[1.5px] border-xt-ink px-7 text-[16px] font-extrabold text-xt-ink">Shop the WFH kit</button>
            </div>
          </div>
          <div className="relative flex h-[380px] items-center justify-center overflow-hidden rounded-[28px] bg-xt-oat sm:h-[580px]">
            <SpinningMark className="-left-10 -top-8 h-[640px] w-[640px] opacity-[0.07]" />
            <div className="xt-float relative w-[300px] sm:w-[460px]"><Mockup kind="backpack" bg="transparent" className="aspect-square" /></div>
            <div className="absolute bottom-6 left-6 flex items-center gap-2.5 rounded-full bg-white px-4 py-3 text-[14px] font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-xt-crimson" />Trail Laptop Backpack
            </div>
            <div className="absolute right-4 top-4 rounded-xl bg-xt-slate px-3 py-2 font-display text-[13px] tracking-[3px] text-xt-paper sm:right-6 sm:top-6 sm:px-4 sm:py-2.5 sm:text-[18px]">Drop 01 · New Shillong</div>
          </div>
        </section>

        <Marquee words={['Travel', 'Sleep', 'Binge', 'Work', 'Repeat']} className="bg-xt-slate text-xt-paper" markFill="#BD2E30" />

        <section id="shop" className={`${PAD} flex scroll-mt-28 flex-col gap-10 py-16 lg:py-[72px]`}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <h2 className="xt-display m-0 text-[48px] leading-none sm:text-[60px]">The collection</h2>
              <p className="m-0 text-[17px] text-xt-mute">Sixteen pieces for the road and the remote desk. Tap Notify me and we’ll message you the day they drop.</p>
            </div>
            <div role="group" aria-label="Filter products" className="-mx-4 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              {TABS.map((t) => (
                <button key={t.id} type="button" aria-pressed={tab === t.id} onClick={() => setTab(t.id)} className={`xt-chip h-12 shrink-0 rounded-full border-[1.5px] px-5 text-[15px] font-bold ${tab === t.id ? 'border-xt-slate bg-xt-slate text-xt-paper' : 'border-xt-stone text-xt-ink'}`}>
                  {t.label} · {count(t.id)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => {
              const on = !!asked[p.id];
              return (
                <article key={p.id} className="xt-reveal flex flex-col gap-3.5">
                  <Mockup kind={p.id} bg={p.cat === 'travel' ? '#EFE6DA' : '#E4E7EE'} className="xt-lift aspect-square overflow-hidden rounded-[20px]" />
                  <div className="font-display text-[15px] tracking-[3px] text-xt-crimson">{p.cat === 'travel' ? 'Travel' : 'Work from anywhere'}</div>
                  <h3 className="m-0 text-[20px] font-extrabold leading-tight">{p.name}</h3>
                  <p className="m-0 min-h-[46px] text-[15px] leading-normal text-xt-mute">{p.detail}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14px] font-bold text-xt-mute">Price at launch</span>
                    {on ? (
                      <button type="button" onClick={() => setAsked({ ...asked, [p.id]: false })} className="flex h-11 items-center gap-2 rounded-full border-[1.5px] border-xt-slate bg-xt-slate px-4 text-[14px] font-bold text-xt-paper">✓ On the list</button>
                    ) : (
                      <a
                        href={waLink(`Hi XTSY! Please notify me when the ${p.name} drops.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setAsked({ ...asked, [p.id]: true })}
                        className="flex h-11 items-center rounded-full border-[1.5px] border-xt-crimson px-4 text-[14px] font-bold text-xt-crimson hover:text-xt-crimson"
                      >
                        Notify me
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={`${PAD} grid gap-6 pb-20 md:grid-cols-3`}>
          {[
            { t: 'Pick up at the hostel', d: 'Collect your order at XTSY Travellers Hostel or TAB Bistro by XTSY, Mawdiangdiang Road, New Shillong Township.' },
            { t: 'Built for the long stay', d: 'Picked for digital nomads who book a week in the pines and stay a month. Nothing here is just a souvenir.' },
            { t: 'Notify me, not spam', d: 'Tap Notify me on any piece and we will message you once, when it is ready to order.' },
          ].map((c) => (
            <div key={c.t} className="xt-reveal flex flex-col gap-3 rounded-[20px] bg-white p-8">
              <h3 className="m-0 text-[20px] font-extrabold">{c.t}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-xt-mute">{c.d}</p>
            </div>
          ))}
        </section>
      </PageShell>
    </>
  );
}
