/**
 * Homepage hero (v2): headline, live booking search, "Build a trip with AI"
 * button, pet-friendly promo with a peeking cat, and the trip planner.
 */
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@/lib/router-compat';
import { formatLocalDateString } from '@/lib/date-utils';
import { useComponentTracking } from '@/hooks/useComponentTracking';
import { SpinningMark } from '../primitives';
import TripPlanner from '../TripPlanner';

const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return formatLocalDateString(d);
};

function PeekingCat() {
  return (
    <svg className="xt-peek pointer-events-none absolute -bottom-1.5 -right-2" width="150" height="150" viewBox="0 0 150 150" role="img" aria-label="A cute cat peeking in from the side">
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

  const goPlanner = () => {
    trackCTA('build_trip_ai', {});
    document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const inputCls = 'h-[46px] w-full rounded-xl border-[1.5px] border-xt-line bg-white px-2.5 text-[14px] text-xt-ink focus:border-xt-crimson focus:outline-none';

  return (
    <section className="relative grid gap-10 overflow-hidden px-4 pb-16 pt-10 sm:px-8 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-12 lg:px-14 lg:pb-[72px] lg:pt-14">
      <SpinningMark className="-bottom-44 -left-40 h-[620px] w-[620px] opacity-[0.06]" />
      <div className="relative flex flex-col gap-6 lg:pt-6">
        <div className="xt-in xt-eyebrow text-[14px] sm:text-[17px]">XTSY Travellers Hostel · New Shillong Township</div>
        <h1 className="xt-display m-0 text-[88px] leading-[0.86] sm:text-[112px] lg:text-[128px]">
          <span className="xt-in xt-d1 block">Travel.</span>
          <span className="xt-in xt-d2 block">Sleep.</span>
          <span className="xt-in xt-d3 block text-xt-crimson">Binge.</span>
        </h1>
        <p className="xt-in xt-d4 m-0 text-[17px] leading-relaxed text-xt-mute sm:text-[19px]">
          Affordable dorms, private stays and Experience by XTSY, India’s First Stargaze Glamp, in the pines near IIM and NIFT Shillong. Tell our planner what you love and get a day-by-day Meghalaya trip in seconds.
        </p>

        <form onSubmit={search} className="xt-in xt-d4 flex flex-col gap-3 rounded-[22px] bg-white p-4 shadow-[0_20px_40px_-28px_rgba(31,34,48,0.5)] sm:p-[18px]">
          <div className="xt-eyebrow text-[15px]">Book a stay</div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">CHECK-IN
              <input type="date" required value={checkIn} min={today || undefined} onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1)); }} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">CHECK-OUT
              <input type="date" required value={checkOut} min={checkIn || undefined} onChange={(e) => setCheckOut(e.target.value)} className={inputCls} />
            </label>
            <label className="col-span-2 flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute sm:col-span-1">GUESTS
              <select value={guests} onChange={(e) => setGuests(e.target.value)} className={inputCls}>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </label>
          </div>
          {error && <p role="alert" className="m-0 text-[13px] font-bold text-xt-crimson">{error}</p>}
          <button type="submit" className="xt-btn h-[50px] rounded-[14px] bg-xt-ink text-[15px] font-extrabold text-xt-paper">
            Check live availability
          </button>
          <p className="m-0 text-[12px] text-xt-mute">
            More than 20 guests? <Link to="/group-bookings-meghalaya" className="font-bold text-xt-crimson underline">Group bookings</Link>
          </p>
        </form>

        <div className="xt-in xt-d4 flex flex-wrap gap-x-5 gap-y-1 text-[14px] font-bold text-xt-mute">
          <span>★ 4.8 Google (161)</span><span>9.4 Booking.com</span><span>NEITA 2025</span>
        </div>

        <button type="button" onClick={goPlanner} className="xt-in xt-d4 xt-ai-btn relative flex h-14 items-center gap-3 self-start overflow-hidden rounded-full bg-xt-ink pl-[18px] pr-6 text-[16px] font-extrabold text-xt-paper">
          <span aria-hidden="true" className="xt-shine absolute left-0 top-0 h-14 w-[60px] bg-white/20" />
          <svg className="xt-twinkle" width="22" height="22" viewBox="0 0 24 24" fill="#E07A8B" aria-hidden="true"><path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z" /><circle cx="19.5" cy="18.5" r="1.8" /></svg>
          <span className="relative">Build a trip with AI</span>
          <span className="relative rounded-full bg-xt-crimson px-2.5 py-1 text-[11px] tracking-wider">FREE · 10 SEC</span>
        </button>

        <Link to="/pet-friendly" className="xt-in xt-d4 xt-lift relative flex flex-col gap-2 overflow-hidden rounded-[22px] bg-xt-cream py-5 pl-[22px] pr-[140px] text-xt-ink hover:text-xt-ink">
          <span className="xt-eyebrow text-[14px]">India’s first pet-friendly travellers hostel</span>
          <span className="xt-display text-[28px] leading-none sm:text-[30px]">Cats &amp; birds most welcome</span>
          <span className="text-[14px] leading-normal text-xt-mute">Dogs too, depending on breed and size. Please contact the XTSY desk about any additional charges.</span>
          <span className="text-[14px] font-extrabold">Plan a stay with your pet →</span>
          <PeekingCat />
        </Link>
      </div>

      <TripPlanner className="xt-in xt-d2 self-start" />
    </section>
  );
}
