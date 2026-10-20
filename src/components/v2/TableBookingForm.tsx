/**
 * TAB Bistro table booking form.
 *
 * Saves a pending table request to the database (so the desk sees it in the admin dashboard)
 * and then opens WhatsApp with the same details. A request is not a confirmed table — the
 * desk replies to confirm availability.
 */
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from '@/lib/router-compat';
import { bookingPageSource } from '@/utils/privacyCompliantWhatsApp';
import { formatLocalDateString, getLocalToday, parseLocalDate } from '@/lib/date-utils';
import { waLink } from './primitives';
import { Btn } from './blocks';
import { Button } from '@/components/ui/button';
import { BISTRO_SLOT_RANGES, BISTRO_HOURS_SENTENCE, isValidBistroRequestTime, type BistroRequestKind } from '@/data/tabBistroHours';

/** Slots follow the two daily service windows in @/data/tabBistroHours (breakfast + evening/dinner; lunch by preorder). */
const SLOTS: { value: string; label: string }[] = (() => {
  const out: { value: string; label: string }[] = [];
  for (const { from, to } of BISTRO_SLOT_RANGES) {
    for (let m = from; m <= to; m += 30) {
      const h = Math.floor(m / 60);
      const mm = String(m % 60).padStart(2, '0');
      out.push({
        value: `${String(h).padStart(2, '0')}:${mm}`,
        label: `${((h + 11) % 12) + 1}:${mm} ${h >= 12 ? 'PM' : 'AM'}`,
      });
    }
  }
  return out;
})();

const MAX_PARTY = 30;

// 16px keeps Safari from zooming the page when a guest taps a field.
const input =
  'h-12 w-full rounded-xl border-[1.5px] border-xt-line bg-white px-3.5 text-[16px] font-medium text-xt-ink focus:border-xt-crimson focus:outline-none';
const labelCls = 'flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute';

const prettyDate = (d: Date) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(d);

const slotLabel = (value: string) => SLOTS.find((s) => s.value === value)?.label ?? value;

export function TableBookingForm({ id = 'table-booking-form' }: { id?: string }) {
  const [today, setToday] = useState('');
  const [kind, setKind] = useState<BistroRequestKind>('table');
  const [lunchTime, setLunchTime] = useState('');
  const [f, setF] = useState({ date: '', time: '', party: '2', name: '', phone: '', email: '', notes: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<{ ref: string; wa: string } | null>(null);

  // The date and time come from the visitor's own device, so they are filled in after the
  // page loads — the server-rendered HTML never carries a device-local value.
  useEffect(() => {
    const t = formatLocalDateString(getLocalToday());
    setToday(t);
    setF((s) => (s.date ? s : { ...s, date: t, time: '19:00' }));
  }, []);

  // On the day itself, drop the slots that have already gone.
  const slots = useMemo(() => {
    if (!today || f.date !== today) return SLOTS;
    const now = new Date();
    const soon = now.getHours() * 60 + now.getMinutes() + 30;
    const open = SLOTS.filter((s) => Number(s.value.slice(0, 2)) * 60 + Number(s.value.slice(3)) > soon);
    return open.length ? open : SLOTS;
  }, [f.date, today]);

  // If the stored time is no longer an offered slot (e.g. 7:00 PM after it has passed,
  // or a future-date pick after switching back to today), move it to the first slot the
  // guest can actually see in the box, so what is shown is what gets sent.
  useEffect(() => {
    if (f.time && !slots.some((s) => s.value === f.time)) {
      setF((s) => ({ ...s, time: slots[0]?.value ?? '' }));
    }
  }, [slots, f.time]);

  const lunch = kind === 'lunch-preorder';
  const requestedTime = lunch ? lunchTime : f.time;
  const requestedTimeLabel = lunch ? `Requested lunch time: ${requestedTime} (subject to confirmation)` : `Time: ${slotLabel(requestedTime)}`;

  const message = (ref?: string) => {
    const d = parseLocalDate(f.date);
    return [
      lunch ? 'Namaste TAB Bistro Team! I’d like to preorder lunch. Please confirm availability, my order and the price on WhatsApp.' : 'Namaste TAB Bistro Team! I’d like to book a table.',
      d ? `Date: ${prettyDate(d)}` : '',
      requestedTimeLabel,
      `Guests: ${f.party}`,
      `Name: ${f.name.trim()}`,
      `Phone: ${f.phone.trim()}`,
      f.email.trim() ? `Email: ${f.email.trim()}` : '',
      f.notes.trim() ? `${lunch ? 'Lunch order / requirements' : 'Notes'}: ${f.notes.trim()}` : '',
      lunch ? 'Lunch is preorder only; this is not a confirmed order or table reservation.' : '',
      ref ? `Enquiry ID: ${ref}` : '',
      `Page: ${bookingPageSource()}`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const name = f.name.trim();
    const phone = f.phone.trim();
    const email = f.email.trim();
    const party = Math.floor(Number(f.party));

    if (name.length < 2) return setError('Please tell us your name.');
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) return setError('Please enter a valid email address.');
    if (phone.replace(/\D/g, '').length < 8) return setError('Please enter a valid WhatsApp number.');
    if (!f.date || (today && f.date < today)) return setError('Please choose today or a later date.');
    if (!isValidBistroRequestTime(kind, requestedTime, slots.map((s) => s.value)))
      return setError(lunch ? 'Please enter your requested lunch time.' : 'Please pick one of the available times shown.');
    if (lunch && !f.notes.trim()) return setError('Please tell us what you would like to preorder for lunch.');
    if (!Number.isFinite(party) || party < 1 || party > MAX_PARTY)
      return setError(`Party size must be between 1 and ${MAX_PARTY}. For bigger groups, plan an event with our catering team.`);

    const ci = parseLocalDate(f.date);
    if (!ci) return setError('Please choose a valid date.');
    // The desk stores table requests as a single day, so the stored "checkout" is the next morning.
    const checkOut = formatLocalDateString(new Date(ci.getFullYear(), ci.getMonth(), ci.getDate() + 1));

    setBusy(true);
    try {
      const { data, error: saveError } = await supabase.rpc('create_enquiry', {
        p_guest_name: name,
        p_email: email,
        p_phone: phone,
        p_check_in: f.date,
        p_check_out: checkOut,
        p_room_type: 'table-reservation',
        p_room_name: lunch ? `TAB Bistro — lunch preorder for ${party}` : `TAB Bistro — table for ${party}`,
        p_quantity: party,
        p_nights: 1,
        p_rate_per_night: 0,
        p_subtotal: 0,
        p_gst_rate: 0,
        p_gst_amount: 0,
        p_total_amount: 0,
        p_special_requests: [
          `${lunch ? 'Lunch preorder only' : 'Table'}: ${f.date} | ${requestedTimeLabel}`,
          `Guests: ${party}`,
          f.notes.trim(),
          lunch ? 'Pending WhatsApp confirmation of availability, order and price. Not a table reservation.' : '',
          `Page: ${bookingPageSource()}`,
        ]
          .filter(Boolean)
          .join(' | ')
          .slice(0, 2000),
      });
      if (saveError) throw saveError;
      const ref = data?.[0]?.enquiry_id;
      if (!ref) throw new Error('Could not save your table request.');
      const wa = waLink(message(ref));
      setSaved({ ref, wa });
      if (lunch) window.location.assign(wa);
      else window.open(wa, '_blank', 'noopener');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your request. Please WhatsApp us instead.');
      setSaved({ ref: '', wa: waLink(message()) });
    } finally {
      setBusy(false);
    }
  };

  if (saved) {
    const first = f.name.trim().split(' ')[0] || 'friend';
    return (
      <div id={id} className="xt-reveal flex scroll-mt-28 flex-col gap-4 rounded-[28px] bg-white p-7 text-xt-ink sm:p-10">
        <h2 className="xt-display m-0 text-[40px] leading-none sm:text-[48px]">{saved.ref ? (lunch ? 'Lunch preorder requested' : 'Table request sent') : 'Send your request on WhatsApp'}</h2>
        <p className="m-0 text-[17px] leading-relaxed">
          {saved.ref ? (
            <>
              Thanks {first}! Your request is saved as <strong>{saved.ref}</strong>.{' '}
            </>
          ) : (
            'Your request could not be saved online. '
          )}
          {lunch ? 'Send the pre-filled WhatsApp message so the team can confirm availability, your lunch order and the price.' : 'Send the pre-filled WhatsApp message and the desk will confirm your table.'}
        </p>
        <Btn to={saved.wa}>Send on WhatsApp</Btn>
        <p className="m-0 text-[13px] text-xt-mute">
          {lunch ? 'Lunch is preorder only and is confirmed only when the team replies.' : 'A table is confirmed once the desk replies.'} {BISTRO_HOURS_SENTENCE}
        </p>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={submit}
      className="xt-reveal grid scroll-mt-28 gap-4 rounded-[28px] bg-white p-7 text-xt-ink sm:grid-cols-2 sm:p-10"
    >
      <h2 className="xt-display m-0 text-[40px] leading-none sm:col-span-2 sm:text-[48px]">Book a table</h2>
      <label className={`${labelCls} sm:col-span-2`}>
        REQUEST TYPE
        <select value={kind} onChange={(e) => setKind(e.target.value === 'lunch-preorder' ? 'lunch-preorder' : 'table')} className={input}>
          <option value="table">Table — breakfast or evening &amp; dinner</option>
          <option value="lunch-preorder">Lunch — preorder only</option>
        </select>
      </label>
      <label className={labelCls}>
        DATE
        <input
          required
          type="date"
          value={f.date}
          min={today || undefined}
          onChange={(e) => setF({ ...f, date: e.target.value })}
          className={input}
        />
      </label>
      <label className={labelCls}>
        {lunch ? 'REQUESTED LUNCH TIME' : 'TIME'}
        {lunch ? <input required type="time" value={lunchTime} onChange={(e) => setLunchTime(e.target.value)} className={input} /> : <select required value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} className={input}>
          {slots.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>}
      </label>
      <label className={labelCls}>
        GUESTS
        <input
          required
          type="number"
          min={1}
          max={MAX_PARTY}
          value={f.party}
          onChange={(e) => setF({ ...f, party: e.target.value })}
          className={input}
        />
      </label>
      <label className={labelCls}>
        NAME
        <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} autoComplete="name" />
      </label>
      <label className={labelCls}>
        WHATSAPP NUMBER
        <input
          required
          type="tel"
          value={f.phone}
          onChange={(e) => setF({ ...f, phone: e.target.value })}
          className={input}
          autoComplete="tel"
          placeholder="+91 …"
        />
      </label>
      <label className={labelCls}>
        EMAIL
        <input
          required
          type="email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          className={input}
          autoComplete="email"
        />
      </label>
      <label className={`${labelCls} sm:col-span-2`}>
        {lunch ? 'LUNCH ORDER / REQUIREMENTS' : 'ANYTHING ELSE? (OCCASION, HIGH CHAIR, WINDOW TABLE)'}
        <textarea required={lunch} rows={3} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className={`${input} h-auto py-3`} />
      </label>
      <Button
        type="submit"
        disabled={busy}
        className="xt-btn h-14 rounded-full bg-xt-crimson text-[16px] font-extrabold text-primary-foreground disabled:opacity-60 sm:col-span-2"
      >
        {busy ? 'Sending…' : lunch ? 'Send lunch preorder on WhatsApp' : 'Request a table'}
      </Button>
      {error && (
        <p role="alert" className="m-0 text-[14px] font-bold text-xt-crimson sm:col-span-2">
          {error}
        </p>
      )}
      <p className="m-0 text-[13px] text-xt-mute sm:col-span-2">
        {lunch ? 'Lunch is preorder only — availability, your order and the price must be confirmed on WhatsApp. No payment now.' : 'No payment now — we hold your request and confirm on WhatsApp.'} {BISTRO_HOURS_SENTENCE} For more than{' '}
        {MAX_PARTY} guests, <Link to="/tab-bistro/catering" className="font-extrabold text-xt-crimson">plan an event</Link>.
      </p>
    </form>
  );
}
