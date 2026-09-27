/**
 * Homepage hero (v2): headline, live booking search, "Build a trip with AI"
 * button, pet-friendly promo with a peeking cat, and the trip planner.
 */
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@/lib/router-compat';
import { formatLocalDateString } from '@/lib/date-utils';
import { useComponentTracking } from '@/hooks/useComponentTracking';
import { IMG } from '@/data/v2Images';
import { Button } from '@/components/ui/button';
import TripPlanner from '../TripPlanner';

const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return formatLocalDateString(d);
};

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

  const inputCls = 'h-12 w-full rounded border border-xt-line bg-background px-3 text-base text-foreground focus:border-primary focus:outline-none';

  return (
    <>
      <section className="relative isolate flex min-h-[65vh] flex-col justify-end overflow-hidden bg-xt-ink px-5 py-12 text-xt-paper sm:px-8 lg:min-h-[68vh] lg:px-14">
        <img src={IMG.property[0]} alt="XTSY Travellers Hostel in New Shillong Township, Shillong" className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-xt-ink/70" />
        <div className="max-w-5xl">
          <p className="xt-eyebrow mb-4 text-sm uppercase">New Shillong Township · Meghalaya</p>
          <h1 className="xt-display m-0 text-6xl leading-none sm:text-8xl lg:text-9xl">XTSY Travellers Hostel</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">Dorms from ₹399 · King Double ₹2,200 · Panorama stay only ₹5,399 or with breakfast for two ₹5,799 per night.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/book">Book a stay</Link></Button><Button asChild variant="outline" size="lg"><Link to="/expeditions">Explore Northeast India</Link></Button></div>
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
      <TripPlanner className="mx-auto max-w-6xl px-5 py-8" />
    </>
  );
}
