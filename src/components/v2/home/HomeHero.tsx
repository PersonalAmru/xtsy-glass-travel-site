/**
 * Homepage hero (v2): photographic headline, live booking search, the
 * "Plan a trip with AI" assistant (embedded) and the pet-friendly promo.
 */
import { useEffect, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { Link, useNavigate } from '@/lib/router-compat';
import { formatLocalDateString } from '@/lib/date-utils';
import { useComponentTracking } from '@/hooks/useComponentTracking';
import { Button } from '@/components/ui/button';
import TripChat from '../TripChat';
import { HERO_IMAGE } from '@/data/v2Images';
import { responsive } from '../primitives';

const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return formatLocalDateString(d);
};

function PeekingCat() {
  return (
    <svg className="xt-peek pointer-events-none absolute -bottom-1.5 -right-2" width="150" height="150" viewBox="0 0 150 150" role="img" aria-label="A cat peeking in from the side">
      <path d="M150 150 L150 70 Q118 58 96 72 Q70 88 70 118 Q70 150 100 150 Z" fill="#E8A55A" />
      <path d="M78 84 L70 42 L102 68 Z" fill="#E8A55A" /><path d="M81 78 L77 54 L95 69 Z" fill="#F4C9C0" />
      <path d="M124 64 L136 26 L150 58 Z" fill="#E8A55A" /><path d="M129 60 L136 38 L145 58 Z" fill="#F4C9C0" />
      <path d="M86 86 Q92 82 98 86 M112 80 Q120 76 128 80" stroke="#C47F3A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="xt-blink">
        <ellipse cx="96" cy="102" rx="7.5" ry="9" fill="#1F2230" /><ellipse cx="124" cy="98" rx="7.5" ry="9" fill="#1F2230" />
        <circle cx="98.5" cy="98.5" r="2.6" fill="#FFFFFF" /><circle cx="126.5" cy="94.5" r="2.6" fill="#FFFFFF" />
      </g>
      <path d="M107 112 L113 112 L110 116 Z" fill="#E07A8B" />
      <path d="M110 116 Q106 122 100 120 M110 116 Q114 122 120 119" stroke="#1F2230" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M88 114 L66 110 M88 119 L66 122 M132 110 L150 104 M132 115 L150 114" stroke="#8A5A2B" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="84" cy="146" rx="16" ry="10" fill="#E8A55A" />
      <path d="M76 142 v6 M84 141 v7 M92 142 v6" stroke="#C47F3A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function HomeHero() {
  const navigate = useNavigate();
  const { trackCTA } = useComponentTracking({ section: 'hero_v2' });
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [error, setError] = useState('');
  const [today, setToday] = useState('');

  // Dates are filled after hydration so server and browser render the same HTML.
  useEffect(() => {
    const t = formatLocalDateString(new Date());
    setToday(t);
    setCheckIn(t);
    setCheckOut(addDays(t, 1));
  }, []);

  const search = (e: FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setError('Pick a check-out date after your check-in date.');
      return;
    }
    setError('');
    const g = Math.max(1, parseInt(guests, 10) || 1);
    trackCTA('check_availability', { location: 'shillong', guests: g });
    try {
      sessionStorage.setItem('xtsy_search_params', JSON.stringify({ location: 'shillong', checkIn, checkOut, guests: g }));
    } catch { /* storage may be blocked */ }
    navigate(`/book/select?${new URLSearchParams({ location: 'shillong', checkIn, checkOut, guests: String(g) }).toString()}`);
  };

  const hero = responsive(HERO_IMAGE.src);
  const goPlanner = (e: ReactMouseEvent) => {
    e.preventDefault();
    trackCTA('plan_trip_ai', {});
    document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById('trip-chat-input-embedded')?.focus({ preventScroll: true }), 500);
  };

  const inputCls = 'h-12 w-full rounded border border-xt-line bg-background px-3 text-base text-foreground focus:border-primary focus:outline-none';

  return (
    <>
      <section className="relative isolate flex h-[640px] flex-col justify-end overflow-hidden bg-xt-ink px-5 py-12 text-xt-paper sm:h-[max(600px,68vh)] sm:px-8 lg:px-14">
        <img src={hero?.src ?? HERO_IMAGE.src} srcSet={hero?.srcSet} sizes="100vw" width={hero?.w} height={hero?.h} alt={HERO_IMAGE.alt} className="absolute inset-0 -z-20 h-full w-full object-cover" style={{ objectPosition: HERO_IMAGE.position }} fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-xt-ink via-xt-ink/60 to-xt-ink/20" />
        <div className="max-w-5xl">
          <p className="xt-eyebrow mb-4 text-sm uppercase text-[#F2B8C2]!">Best hostel in Shillong · New Shillong Township</p>
          {/* Fixed two-line box: the headline never changes the hero's height while the font loads (no layout shift). */}
          <h1 className="xt-display m-0 h-[2em] text-6xl leading-none sm:text-8xl lg:text-9xl">XTSY Travellers Hostel</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">Dorms from ₹399 · King Double ₹2,200 · Panorama stay only ₹5,399 or with breakfast for two ₹5,799 per night.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/book" className="xt-btn flex h-14 items-center rounded-full bg-xt-crimson px-7 text-[16px] font-extrabold text-white hover:text-white">Book a stay</Link>
            <a href="#planner" onClick={goPlanner} className="xt-btn flex h-14 items-center gap-2.5 rounded-full bg-xt-paper pl-4 pr-6 text-[16px] font-extrabold text-xt-ink hover:text-xt-ink">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#A12444" aria-hidden="true"><path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z" /><circle cx="19.5" cy="18.5" r="1.8" /></svg>
              Plan a trip with AI
            </a>
            <Link to="/tours" className="xt-btn flex h-14 items-center rounded-full border-[1.5px] border-xt-paper px-7 text-[16px] font-extrabold text-xt-paper hover:text-xt-paper">Explore Northeast India</Link>
          </div>
        </div>
      </section>
      <section className="border-b border-xt-line bg-xt-paper px-5 py-8 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2"><h2 className="xt-display m-0 text-3xl text-xt-ink">Find your stay</h2><p className="m-0 text-sm text-xt-mute">Check-in 11 AM · Check-out strictly 10 AM</p></div>
          <form onSubmit={search} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <label className="flex flex-col gap-1 text-sm font-bold text-xt-ink">Check-in<input type="date" required value={checkIn} min={today || undefined} onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1)); }} className={inputCls} /></label>
            <label className="flex flex-col gap-1 text-sm font-bold text-xt-ink">Check-out<input type="date" required value={checkOut} min={checkIn || undefined} onChange={(e) => setCheckOut(e.target.value)} className={inputCls} /></label>
            <label className="flex flex-col gap-1 text-sm font-bold text-xt-ink">Guests<select value={guests} onChange={(e) => setGuests(e.target.value)} className={inputCls}>{Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}</select></label>
            <Button type="submit" className="h-12">Check availability</Button>
            {error && <p role="alert" className="text-sm text-destructive sm:col-span-2 lg:col-span-4">{error}</p>}
          </form>
          <p className="mt-3 text-sm text-xt-mute">More than 20 guests? <Link to="/group-bookings-meghalaya" className="font-bold text-primary underline">Group bookings</Link></p>
        </div>
      </section>
      <section id="planner" className="grid scroll-mt-28 gap-6 bg-xt-sand px-5 py-12 sm:px-8 lg:grid-cols-12 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <p className="xt-eyebrow m-0 text-[15px]">Your trip, planned in seconds</p>
          <h2 className="xt-display m-0 text-[48px] leading-[0.92] text-xt-ink sm:text-[64px]">Plan a trip with AI</h2>
          <p className="m-0 text-[16px] leading-relaxed text-xt-mute">Tell the XTSY trip assistant where you want to go in Meghalaya or anywhere in Northeast India. It plans day by day with real drive times, keeps far-off places like Wari Chora or Tawang realistic, and books your Shillong nights at XTSY.</p>
          <Link to="/pet-friendly" className="xt-lift relative mt-2 flex flex-col gap-2 overflow-hidden rounded-[22px] bg-xt-cream py-5 pl-[22px] pr-[140px] text-xt-ink hover:text-xt-ink">
            <span className="xt-eyebrow text-[13px]">India’s first pet-friendly travellers hostel</span>
            <span className="xt-display text-[28px] leading-none">Cats &amp; birds most welcome</span>
            <span className="text-[14px] leading-normal text-xt-mute">Dogs too, depending on breed and size. Please contact the XTSY desk about any additional charges.</span>
            <span className="text-[14px] font-extrabold">Plan a stay with your pet →</span>
            <PeekingCat />
          </Link>
        </div>
        <TripChat className="lg:col-span-8" />
      </section>
    </>
  );
}
