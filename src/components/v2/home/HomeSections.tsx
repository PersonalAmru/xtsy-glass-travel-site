/**
 * Homepage sections below the hero (v2). All prices come from the booking
 * engine / package catalogue, all photos are real XTSY or XTSY Voyage photos.
 */
import { useState } from 'react';
import { Link } from '@/lib/router-compat';
import { googleReviews } from '@/data/googleReviews';
import { SIGNATURE_PACKAGES, formatPackagePrice } from '@/data/signaturePackages';
import { IMG, COVERS, first } from '@/data/v2Images';
import { Eyebrow, LiveDot, Marquee, Photo, SectionHead, SpinningMark } from '../primitives';
import { inr, lowestDormPrice, roomPrice } from '../pricing';

const PAD = 'px-4 sm:px-8 lg:px-14';

export function LastMinuteBar() {
  return (
    <Link to="/book" className="flex h-[60px] items-center justify-center gap-3 overflow-hidden bg-xt-blush px-4 text-center text-[13px] font-bold leading-snug text-xt-crimson-dark hover:text-xt-crimson sm:h-12 sm:text-[15px]">
      <LiveDot />
      Last-minute stay tonight? See live availability for dorms, private rooms and Experience by XTSY →
    </Link>
  );
}

export function StatsStrip() {
  const stats = [
    { value: '10,786+', label: 'Happy guests' },
    { value: '4.8', label: 'Google rating' },
    { value: '30+', label: 'Tour packages' },
    { value: '24/7', label: 'Travel support' },
  ];
  return (
    <section className={`xt-reveal mx-4 grid grid-cols-2 border-y-[1.5px] border-xt-ink sm:mx-8 lg:mx-14 lg:grid-cols-4`}>
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-1.5 border-r border-xt-line px-5 py-7 last:border-r-0 sm:px-7 sm:py-8">
          <span className="font-display text-[44px] leading-none text-xt-crimson sm:text-[60px]">{s.value}</span>
          <span className="text-[14px] font-bold text-xt-mute sm:text-[15px]">{s.label}</span>
        </div>
      ))}
    </section>
  );
}

export function PromiseMarquee() {
  return (
    <Marquee
      className="mt-16 bg-xt-slate text-xt-paper"
      words={[`Dorms from ${inr(lowestDormPrice())}`, 'Experience by XTSY', 'TAB Bistro', 'Partner stays across the Northeast', 'Workation', 'Pet-friendly', 'Women safe stays', '30+ tours']}
    />
  );
}

const TRENDING = [
  { n: 'Nohkalikai Falls', r: 'Cherrapunji', img: IMG.nohkalikai, to: '/destinations/meghalaya/cherrapunji/nohkalikai-falls' },
  { n: 'Dawki, Umngot River', r: 'East Khasi Hills', img: IMG.dawki, to: '/destinations/meghalaya/dawki/dawki-umngot-river' },
  { n: 'Double Decker Root Bridge', r: 'Nongriat', img: IMG.rootBridge, to: '/destinations/meghalaya/cherrapunji/double-decker-living-root-bridge' },
  { n: 'Laitlum Canyons', r: 'Near Shillong', img: IMG.laitlum, to: '/destinations/meghalaya/shillong/laitlum-canyons' },
  { n: 'Umiam Lake', r: 'Near Shillong', img: IMG.umiam, to: '/destinations/meghalaya/shillong/umiam-lake' },
  { n: 'Krang Suri Falls', r: 'Jaintia Hills', img: IMG.krangSuri, to: '/destinations/meghalaya/jowai/krang-suri-falls' },
];

export function Trending() {
  return (
    <section className={`${PAD} flex flex-col gap-8 pb-10 pt-20 lg:pt-[88px]`}>
      <SectionHead eyebrow="Trending now" title="Where travellers are heading" aside={<Link to="/destinations" className="text-[16px] font-extrabold hover:text-xt-crimson">All destinations →</Link>} />
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {TRENDING.map((t) => (
          <Link key={t.n} to={t.to} className="xt-reveal xt-lift flex w-[62vw] shrink-0 snap-start flex-col gap-2.5 rounded-[20px] text-xt-ink hover:text-xt-ink sm:w-auto">
            <Photo afterLoad src={t.img} alt={t.n} className="aspect-[208/280] rounded-[20px]" tone="pine" sizes="(max-width: 639px) 62vw, (max-width: 1023px) 33vw, 16vw" />
            <span className="px-1 text-[17px] font-extrabold">{t.n}</span>
            <span className="px-1 text-[13px] text-xt-mute">{t.r}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Stays() {
  const suite = roomPrice('xtsy-270');
  const stays = [
    { title: 'Dorm beds', price: `from ${inr(lowestDormPrice())}`, text: '6 and 8-bed mixed dorms with curtains, lockers and charging points.', img: first(IMG.mixedDorm), to: '/book', tone: 'sand' as const },
    { title: 'Female Dorm', price: inr(roomPrice('4-bed-female-only-dorm').now), text: '4-bed women-only dorm with female staff on call.', img: first(IMG.femaleDorm), to: '/female-travellers', tone: 'crimson' as const },
    { title: 'King Double', price: inr(roomPrice('king-double-room').now), text: 'A private room for two, with a view of the pines.', img: first(IMG.king), to: '/book', tone: 'pine' as const },
    { title: 'Experience by XTSY', price: `from ${inr(suite.now)}`, text: 'Stay only ₹5,399 or with breakfast for two ₹5,799 nightly. Decoration +₹2,500 per stay.', img: first(IMG.suite), to: '/xtsy-270', tone: 'night' as const },
  ];
  return (
    <section className={`${PAD} flex flex-col gap-8 py-12`}>
      <SectionHead
        eyebrow={<span className="flex items-center gap-2.5"><LiveDot />Available stays now</span>}
        title="Pick your bed in the pines"
        aside={<Link to="/book" className="text-[16px] font-extrabold hover:text-xt-crimson">See all rooms →</Link>}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stays.map((s) => (
          <Link key={s.title} to={s.to} className="xt-reveal xt-lift flex flex-col gap-3 rounded-[20px] pb-2 text-xt-ink hover:text-xt-ink">
            <Photo afterLoad src={s.img} alt={s.title} tone={s.tone} className="aspect-[314/236] rounded-[20px]" sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 23vw">
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[12px] font-extrabold text-xt-ink">
                <span className="h-[7px] w-[7px] rounded-full bg-xt-leaf" />Live availability
              </span>
            </Photo>
            <div className="flex items-baseline justify-between gap-2 px-1">
              <h3 className="m-0 text-[19px] font-extrabold">{s.title}</h3>
              <span className="whitespace-nowrap text-[15px] font-extrabold text-xt-crimson">{s.price}</span>
            </div>
            <p className="m-0 px-1 text-[15px] leading-normal text-xt-mute">{s.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CampsiteBanner() {
  return (
    <section className={`${PAD} pb-20 pt-10`}>
      <Link to="/xtsy-adventure-campsite-dawki" className="xt-reveal xt-lift grid overflow-hidden rounded-[32px] bg-xt-pine text-[#EAF0EA] hover:text-[#EAF0EA] lg:grid-cols-2">
        <Photo afterLoad src={first(IMG.campsite)} alt="Tents beside the Umngot river at the Dawki partner campsite" tone="slate" className="aspect-[664/440] lg:aspect-auto lg:min-h-[440px]" />
        <div className="flex flex-col justify-center gap-4 p-7 sm:p-[52px]">
          <span className="xt-eyebrow text-[15px] text-[#F2B8C2]! sm:text-[18px]">New · Dawki riverside camping, via a trusted partner</span>
          <h2 className="xt-display m-0 text-[44px] leading-[0.95] sm:text-[64px]">Sleep beside the clearest river.</h2>
          <p className="m-0 text-[16px] leading-relaxed text-[#C8D6CC] sm:text-[17px]">
            Pre-pitched riverside tents on the Umngot, welcome chai and bonfire nights, a 2-minute walk from the India–Bangladesh border viewpoint. Run by our partner camp; XTSY books it and sorts your ride from New Shillong.
          </p>
          <div className="flex flex-wrap items-end gap-7">
            <span className="flex flex-col"><span className="font-display text-[44px] leading-none">₹1,000</span><span className="text-[13px] text-[#C8D6CC]">camping + breakfast</span></span>
            <span className="flex flex-col"><span className="font-display text-[44px] leading-none">₹800</span><span className="text-[13px] text-[#C8D6CC]">camping only</span></span>
            <span className="ml-auto text-[15px] font-extrabold">Book a tent →</span>
          </div>
        </div>
      </Link>
    </section>
  );
}

const STATES = [
  { n: 'Meghalaya', blurb: 'XTSY’s home state', to: '/destinations/meghalaya', bg: '#2F4A3F', fg: '#EAF0EA' },
  { n: 'Assam', blurb: 'Partner stays & tours', to: '/destinations/assam', bg: '#FFFFFF', fg: '#1F2230' },
  { n: 'Arunachal', blurb: 'Partner stays & tours', to: '/destinations/arunachal-pradesh', bg: '#EFE6DA', fg: '#1F2230' },
  { n: 'Nagaland', blurb: 'Partner stays & tours', to: '/destinations/nagaland', bg: '#2E3548', fg: '#F4EFE8' },
  { n: 'Manipur', blurb: 'Partner stays & tours', to: '/destinations/manipur', bg: '#F3E3E6', fg: '#1F2230' },
];

export function StateExplorer() {
  return (
    <section className={`${PAD} flex flex-col gap-8 pb-20`}>
      <SectionHead eyebrow="Destination explorer" title="Explore the Northeast by state" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {STATES.map((s) => (
          <Link key={s.n} to={s.to} className="xt-reveal xt-lift flex min-h-[180px] flex-col gap-2.5 rounded-3xl p-6 sm:min-h-[200px] sm:p-7" style={{ background: s.bg, color: s.fg }}>
            <span className="font-display text-[32px] leading-none sm:text-[38px]">{s.n}</span>
            <span className="text-[15px] font-bold opacity-85">{s.blurb}</span>
            <span className="mt-auto text-[15px] font-extrabold">Explore →</span>
          </Link>
        ))}
      </div>
      <p className="m-0 text-[14px] text-xt-mute">XTSY’s own property is only in New Shillong Township. Everywhere else, XTSY arranges stays, transport and travel help through trusted travel partners.</p>
    </section>
  );
}

export function PrimeRail() {
  const suite = roomPrice('xtsy-270');
  const prime = [
    { t: 'Experience by XTSY', cat: 'INDIA’S FIRST STARGAZE GLAMP', d: 'A 270° panoramic glass suite for couples, proposals and anniversaries.', price: inr(suite.now), note: `per night · was ${inr(suite.was)}`, img: IMG.suite[1] ?? first(IMG.suite), to: '/xtsy-270', tone: 'night' as const },
    { t: 'Pet Friendly Stays', cat: 'PET TRAVEL', d: 'Cats and birds most welcome; dogs depending on breed and size.', price: 'Ask the desk', note: 'about any extra charges', img: COVERS.pet, to: '/pet-friendly', tone: 'pine' as const },
    { t: 'Group Trips', cat: 'GROUPS OF 6–60', d: 'Whole-dorm stays, colleges, families and company offsites, with transport and TAB Bistro meals.', price: 'Per-person rates', note: 'quote in ~1 hour', img: COVERS.groups, to: '/group-bookings-meghalaya', tone: 'sand' as const },
    { t: 'Female Travellers', cat: 'WOMEN SAFETY', d: 'Women-only dorm, secure lockers and female staff on call.', price: inr(roomPrice('4-bed-female-only-dorm').now), note: 'per bed / night', img: COVERS.women, to: '/female-travellers', tone: 'crimson' as const },
    { t: 'Work From Home', cat: 'DIGITAL NOMAD', d: 'Fibre Wi-Fi, a desk with a view and TAB Bistro downstairs.', price: 'Weekly plans', note: 'ask the desk', img: COVERS.workation, to: '/work-from-home', tone: 'slate' as const },
    { t: 'XTSY Rentals', cat: 'VEHICLE RENTAL', d: 'Cars and Royal Enfields, booked through trusted rental partners.', price: '₹1,300', note: 'per day onwards', img: IMG.bumla, to: '/xtsy-rentals', tone: 'crimson' as const },
  ];
  const doubled = prime.concat(prime);
  return (
    <section className="flex flex-col gap-9 overflow-hidden bg-xt-ink py-20 text-xt-paper lg:py-[88px]">
      <div className={`${PAD} xt-reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between`}>
        <div className="flex flex-col gap-2.5">
          <Eyebrow light>Premium experiences</Eyebrow>
          <h2 className="xt-display m-0 text-[56px] leading-[0.95] sm:text-[76px]">XTSY Prime</h2>
        </div>
        <p className="m-0 max-w-[460px] text-[16px] leading-relaxed text-xt-fog">What sets us apart, from India’s First Stargaze Glamp to stays where pets are family. Hover to pause.</p>
      </div>
      <div className="overflow-hidden">
        <div className="xt-rail flex w-max gap-5 pl-4 sm:pl-8 lg:pl-14">
          {doubled.map((p, i) => (
            <Link key={`${p.t}-${i}`} to={p.to} aria-hidden={i >= prime.length ? true : undefined} tabIndex={i >= prime.length ? -1 : undefined} className="xt-lift flex w-[300px] flex-col overflow-hidden rounded-3xl bg-[#2A2F42] text-xt-paper hover:text-xt-paper sm:w-[340px]">
              <Photo afterLoad src={p.img} alt={p.t} tone={p.tone} className="h-[200px] sm:h-[220px]" sizes="300px" />
              <div className="flex flex-col gap-2 p-[22px]">
                <span className="text-[12px] font-extrabold tracking-wider text-xt-rose">{p.cat}</span>
                <span className="text-[21px] font-extrabold">{p.t}</span>
                <span className="text-[14px] leading-normal text-xt-fog">{p.d}</span>
                <span className="mt-1.5 text-[18px] font-extrabold">{p.price} <span className="text-[13px] font-semibold text-[#A3ABC2]">{p.note}</span></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GlampFeature() {
  const suite = roomPrice('xtsy-270');
  return (
    <section className={`relative grid items-center gap-12 overflow-hidden bg-xt-night pb-24 pt-4 text-xt-paper lg:grid-cols-2 lg:gap-16 ${PAD}`}>
      <Photo afterLoad src={IMG.suite[2] ?? first(IMG.suite)} alt="Experience by XTSY, the 270° panoramic glass suite" tone="slate" className="xt-reveal aspect-[632/520] rounded-[28px]" />
      <div className="xt-reveal flex flex-col gap-5">
        <Eyebrow light>India’s First Stargaze Glamp</Eyebrow>
        <h2 className="xt-display m-0 text-[60px] leading-[0.92] sm:text-[84px]">Experience by XTSY</h2>
        <p className="m-0 text-[17px] leading-relaxed text-xt-fog sm:text-[18px]">A 270° panoramic glass suite in the pines of New Shillong. Sleep under the stars from your bed. One suite, one couple a night, booked direct only.</p>
        <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-3 p-0 text-[16px] font-semibold sm:grid-cols-2">
          <li>270° glass walls</li><li>Queen bed, hotel-grade linen</li><li>Private en-suite</li><li>4K QLED TV with Netflix</li>
        </ul>
        <div className="mt-2 flex flex-wrap items-center gap-6">
          <div className="flex flex-col">
            <span className="font-display text-[52px] leading-none">{inr(suite.now)}<span className="text-[20px] text-xt-fog">/night</span></span>
            {suite.was > suite.now && <span className="text-[14px] text-[#A3ABC2]"><s>{inr(suite.was)}</s> regular rate</span>}
          </div>
          <Link to="/xtsy-270" className="xt-btn flex h-14 items-center rounded-full bg-xt-crimson px-7 text-[16px] font-extrabold text-white hover:text-white">Explore the glamp</Link>
        </div>
      </div>
    </section>
  );
}

export function BistroFeature() {
  return (
    <section className={`${PAD} grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-24`}>
      <div className="xt-reveal flex flex-col gap-5">
        <Eyebrow>TAB Bistro by XTSY</Eyebrow>
        <h2 className="xt-display m-0 text-[56px] leading-[0.92] sm:text-[84px]">Forest dining under the pines.</h2>
        <p className="m-0 text-[17px] leading-relaxed text-xt-mute sm:text-[18px]">All-day breakfast, wood-fired pizzas, tandoor, wok and Thai plates, next door to your bed. Open 9 AM to 10:30 PM daily.</p>
        <div className="flex flex-wrap gap-2">
          {['North Indian', 'Indo-Chinese', 'Thai', 'Continental', 'Italian', 'Northeast Indian'].map((c) => (
            <span key={c} className="rounded-full border-[1.5px] border-xt-stone px-3.5 py-2 text-[14px] font-bold">{c}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/tab-bistro" className="xt-btn flex h-[52px] items-center rounded-full bg-xt-ink px-6 text-[15px] font-extrabold text-xt-paper hover:text-xt-paper">View the menu</Link>
          <Link to="/tab-bistro/catering" className="xt-btn flex h-[52px] items-center rounded-full border-[1.5px] border-xt-ink px-6 text-[15px] font-extrabold text-xt-ink hover:text-xt-ink">Catering &amp; events</Link>
        </div>
      </div>
      <div className="xt-reveal relative">
        <Photo afterLoad src={first(IMG.bistro)} alt="TAB Bistro by XTSY" tone="pine" className="aspect-[632/500] rounded-[28px]" />
        <div className="xt-float absolute -left-2 bottom-10 rounded-2xl bg-white px-5 py-4 text-[15px] font-extrabold shadow-lg sm:-left-6">Open daily · 9 AM – 10:30 PM</div>
      </div>
    </section>
  );
}

export function ToursRow() {
  const picks = ['4n-5d-shillong-meghalaya-tour', '6d-meghalaya-honeymoon-package', '5n-6d-tawang-tour']
    .map((s) => SIGNATURE_PACKAGES.find((p) => p.slug === s))
    .filter((p): p is (typeof SIGNATURE_PACKAGES)[number] => Boolean(p));
  const photos: Record<string, string> = {
    '4n-5d-shillong-meghalaya-tour': IMG.dawki,
    '6d-meghalaya-honeymoon-package': IMG.laitlum,
    '5n-6d-tawang-tour': IMG.arunachal,
  };
  return (
    <section className={`${PAD} flex flex-col gap-10 bg-xt-cream py-20 lg:py-24`}>
      <SectionHead eyebrow="XTSY Voyage · 30+ packages" title="Go further than the hostel" aside={<Link to="/tours" className="text-[16px] font-extrabold hover:text-xt-crimson">All tour packages →</Link>} />
      <div className="grid gap-6 md:grid-cols-3">
        {picks.map((p) => (
          <Link key={p.slug} to={`/tours/${p.slug}`} className="xt-reveal xt-lift flex flex-col overflow-hidden rounded-3xl bg-white text-xt-ink hover:text-xt-ink">
            <Photo afterLoad src={photos[p.slug]} alt={p.title} tone="pine" className="aspect-[426/250]" sizes="(max-width: 767px) 92vw, 31vw" />
            <div className="flex flex-col gap-2.5 p-6">
              <span className="self-start rounded-full bg-xt-sand px-3 py-1.5 text-[13px] font-extrabold">{p.duration}</span>
              <h3 className="m-0 text-[21px] font-extrabold leading-tight">{p.title}</h3>
              <p className="m-0 text-[15px] text-xt-mute">{p.shortDescription}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[18px] font-extrabold">{formatPackagePrice(p.pricePerPerson)} <span className="text-[13px] font-semibold text-xt-mute">/person{p.minGroup ? ` · min ${p.minGroup}` : ''}</span></span>
                <span className="text-[15px] font-extrabold text-xt-crimson">Itinerary →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function TonightDeals() {
  const suite = roomPrice('xtsy-270');
  const deals = [
    { n: 'Dorm bed tonight', price: `from ${inr(lowestDormPrice())}`, was: '', img: first(IMG.mixedDorm), tone: 'sand' as const },
    { n: 'Female dorm tonight', price: inr(roomPrice('4-bed-female-only-dorm').now), was: '', img: first(IMG.femaleDorm), tone: 'crimson' as const },
    { n: 'Experience by XTSY', price: inr(suite.now), was: suite.was > suite.now ? `was ${inr(suite.was)}` : '', img: first(IMG.suite), tone: 'night' as const },
  ];
  return (
    <section className={`${PAD} flex flex-col gap-7 pb-10 pt-20`}>
      <SectionHead
        eyebrow={<span className="flex items-center gap-2.5"><LiveDot />Tonight’s rates</span>}
        title="Booking for tonight?"
        aside={<span className="max-w-[420px] text-[14px] leading-normal text-xt-mute">Tap Book to see what’s actually free tonight in our booking engine.</span>}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((d) => (
          <div key={d.n} className="xt-reveal xt-lift flex items-center gap-4 rounded-[22px] bg-white p-5">
            <Photo afterLoad src={d.img} alt={d.n} tone={d.tone} className="h-24 w-24 shrink-0 rounded-2xl" sizes="96px" />
            <div className="flex min-w-0 flex-grow flex-col gap-1">
              <span className="text-[17px] font-extrabold">{d.n}</span>
              <span className="text-[20px] font-extrabold text-xt-crimson">{d.price} <span className="text-[13px] font-semibold text-xt-mute">{d.was}</span></span>
            </div>
            <Link to="/book" className="xt-btn flex h-[44px] shrink-0 items-center rounded-full bg-xt-crimson px-4 text-[14px] font-extrabold text-white hover:text-white">Book</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ExpeditionsBanner() {
  return (
    <section className={`${PAD} pb-20 pt-12`}>
      <Link to="/expeditions" className="xt-reveal xt-lift relative flex flex-col gap-8 overflow-hidden rounded-[32px] bg-xt-slate p-8 text-xt-paper hover:text-xt-paper sm:p-14 lg:flex-row lg:items-center lg:justify-between">
        <SpinningMark fill="#F4EFE8" className="-right-16 -top-20 h-[360px] w-[360px] opacity-[0.08]" />
        <div className="relative flex max-w-[720px] flex-col gap-3.5">
          <Eyebrow light>Expeditions · motorbike &amp; 4x4</Eyebrow>
          <h2 className="xt-display m-0 text-[48px] leading-[0.95] sm:text-[64px]">Ride the Northeast.</h2>
          <p className="m-0 text-[16px] leading-relaxed text-xt-fog sm:text-[17px]">Guwahati to Shillong, Tawang via Assam, Kohima via Assam, and the Meghalaya loop through Dawki, Mawlynnong and Cherrapunji. Stays and vehicles on the road come from trusted travel partners.</p>
        </div>
        <span className="xt-btn relative flex h-14 items-center self-start whitespace-nowrap rounded-full bg-xt-crimson px-7 text-[16px] font-extrabold text-white lg:self-auto">See the routes</span>
      </Link>
    </section>
  );
}

export function Reviews() {
  const wanted = ['Amal Dixit', 'Amandeep Kaur', 'AnnaLee Serrao'];
  const picked = wanted
    .map((n) => googleReviews.find((r) => r.name === n))
    .filter((r): r is (typeof googleReviews)[number] => Boolean(r && r.rating === 5));
  return (
    <section className={`${PAD} grid gap-5 pb-20 md:grid-cols-2 lg:grid-cols-4`}>
      <div className="xt-reveal flex flex-col gap-3.5">
        <Eyebrow>Guest reviews</Eyebrow>
        <h2 className="xt-display m-0 text-[48px] leading-[0.95] sm:text-[60px]">4.8 on Google from 161 reviews</h2>
        <span className="text-[15px] font-bold text-xt-mute">9.4 on Booking.com</span>
      </div>
      {picked.map((r) => (
        <figure key={r.name} className="xt-reveal xt-lift m-0 flex flex-col gap-3.5 rounded-3xl bg-white p-7">
          <div aria-label="5 out of 5 stars" className="text-[18px] tracking-[3px] text-xt-crimson">★★★★★</div>
          <blockquote className="m-0 line-clamp-6 text-[16px] leading-normal">{r.comment}</blockquote>
          <figcaption className="mt-auto text-[14px] font-bold text-xt-mute">{r.name} · Google</figcaption>
        </figure>
      ))}
    </section>
  );
}

export const HOME_FAQS: [string, string][] = [
  ['What is the best time to visit Shillong, Meghalaya?', 'October to May brings clear skies and pleasant weather. June to September is monsoon, when Cherrapunji’s waterfalls are at full force. XTSY is open all year.'],
  ['How do I reach Shillong from Guwahati?', 'Shillong is about 100 km from Guwahati Airport (GAU), roughly 2.5–3 hours by road via NH6. Shared taxis leave ISBT Guwahati regularly, and XTSY can arrange airport transfers.'],
  ['Where exactly is XTSY?', 'Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya – 793018, near NIFT Shillong, IIM Shillong, NEIGRIHMS, NEIAH and Martin Luther Christian University. It’s a calm, green part of Shillong, away from the city centre.'],
  ['Can I bring my pet?', 'Yes. Cats and birds are most welcome; dogs depending on breed and size. Please contact the XTSY desk about any additional charges.'],
  ['Does XTSY have stays in other towns?', 'XTSY’s own property is only in New Shillong Township. In other places, XTSY arranges stays, transport and travel help through trusted travel partners.'],
  ['Does XTSY offer Meghalaya tour packages?', 'Yes. 30+ curated packages including living root bridge treks, Dawki river trips, caving and multi-day Meghalaya and Northeast itineraries.'],
];

export function HomeFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section className={`${PAD} grid gap-8 pb-20 lg:grid-cols-12 lg:gap-10`}>
      <h2 className="xt-reveal xt-display m-0 text-[48px] leading-[0.95] sm:text-[64px] lg:col-span-4">Good to know</h2>
      <div className="flex flex-col gap-2.5 lg:col-span-8">
        {HOME_FAQS.map(([q, a], i) => (
          <div key={q} className="xt-reveal overflow-hidden rounded-[18px] bg-white">
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 bg-transparent px-6 py-5 text-left text-[17px] font-extrabold text-xt-ink">
              <span>{q}</span><span aria-hidden="true" className="text-[26px] font-normal text-xt-crimson">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="m-0 px-6 pb-5 text-[16px] leading-relaxed text-xt-mute">{a}</p>}
          </div>
        ))}
        <Link to="/faq" className="mt-2 text-[15px] font-extrabold text-xt-crimson">All FAQs →</Link>
      </div>
    </section>
  );
}

const SEO_COLS = [
  { t: 'Stays in Shillong', links: [['Best hostel in Shillong', '/best-hostel-in-shillong'], ['Cheap hostels in Shillong', '/cheap-hostels-shillong'], ['Hotels in Shillong', '/hotels-in-shillong'], ['Homestays in Shillong', '/homestays-in-shillong'], ['Hostel near me', '/hostel-near-me'], ['Luxury glamping in Shillong', '/luxury-glamping-shillong']] },
  { t: 'Top guides', links: [['Best time to visit Meghalaya', '/best-time-to-visit-meghalaya'], ['Meghalaya waterfalls', '/meghalaya-waterfalls'], ['Meghalaya caves', '/meghalaya-caves'], ['Meghalaya viewpoints', '/meghalaya-viewpoints'], ['Things to do in Meghalaya', '/things-to-do-in-meghalaya'], ['Hidden places in Meghalaya', '/hidden-places-in-meghalaya']] },
  { t: 'Plan the trip', links: [['How to reach Meghalaya', '/travel-guide/how-to-reach-meghalaya'], ['Guwahati to Shillong transport', '/travel-guide/guwahati-to-shillong-transport'], ['Meghalaya for international tourists', '/travel-guide/meghalaya-for-international-tourists'], ['3-day Meghalaya itinerary', '/3-day-meghalaya-itinerary'], ['5-day Meghalaya itinerary', '/5-day-meghalaya-itinerary'], ['Budget trip to Meghalaya', '/budget-trip-to-meghalaya']] },
  { t: 'Eat & more', links: [['Restaurant in Shillong', '/restaurant-in-shillong'], ['TAB Bistro menu', '/tab-bistro'], ['Catering in Shillong', '/catering-shillong'], ['Destination wedding in Shillong', '/destination-wedding-shillong'], ['Group bookings', '/group-bookings-meghalaya'], ['Backpacking India', '/backpacking-india']] },
] as const;

export function SeoLinks() {
  return (
    <section className="xt-reveal mx-4 mb-16 grid gap-7 rounded-[28px] border-[1.5px] border-xt-line p-7 sm:mx-8 sm:grid-cols-2 sm:p-10 lg:mx-14 lg:grid-cols-4">
      {SEO_COLS.map((col) => (
        <nav key={col.t} aria-label={col.t} className="flex flex-col gap-2.5">
          <span className="font-display text-[18px] tracking-[0.18em] text-xt-crimson">{col.t}</span>
          {col.links.map(([label, to]) => (
            <Link key={to} to={to} className="text-[14px] font-semibold text-xt-ink hover:text-xt-crimson">{label}</Link>
          ))}
        </nav>
      ))}
    </section>
  );
}
