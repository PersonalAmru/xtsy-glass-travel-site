/**
 * Shared lead form for groups, weddings, rentals and expeditions.
 * Saves to tour_enquiries (admin is notified); falls back to WhatsApp.
 */
import { useState, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';
import { createTourEnquiry } from '@/services/tourBookingService';
import { waLink } from './primitives';

export function EnquiryForm({
  id = 'enquire',
  title = 'Get a quote',
  packageTitle,
  category,
  location = 'Meghalaya',
  typeLabel = 'TRIP TYPE',
  types,
  defaultTravellers = 10,
  travellersLabel = 'GROUP SIZE',
  note,
}: {
  id?: string;
  title?: ReactNode;
  packageTitle: string;
  category: string;
  location?: string;
  typeLabel?: string;
  types?: string[];
  defaultTravellers?: number;
  travellersLabel?: string;
  note?: ReactNode;
}) {
  const [f, setF] = useState({ name: '', phone: '', email: '', type: types?.[0] ?? '', travellers: String(defaultTravellers), dates: '', notes: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const input = 'h-12 w-full rounded-xl border-[1.5px] border-xt-line bg-white px-3.5 text-[15px] font-medium text-xt-ink focus:border-xt-crimson focus:outline-none';
  const label = 'flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const travellers = Math.max(1, Number(f.travellers) || 1);
    const summary = `${packageTitle}${f.type ? ` — ${f.type}` : ''}`;
    const res = await createTourEnquiry({
      packageTitle: summary,
      packageDuration: 'Custom',
      packageDifficulty: 'custom',
      packageCategory: category,
      packageLocation: location,
      travellers,
      preferredDate: f.dates.trim() || 'Flexible',
      groupType: travellers > 1 ? 'group' : 'solo',
      perPersonPrice: 0,
      totalAmount: 0,
      guestName: f.name.trim(),
      email: f.email.trim(),
      whatsappNumber: f.phone.trim(),
      specialRequests: f.notes.trim() || undefined,
    });
    setBusy(false);
    if (res.success) {
      setDone(true);
      toast.success('Thanks! The XTSY desk will reply on WhatsApp shortly.');
    } else {
      toast.error('Could not send online — opening WhatsApp instead.');
      window.location.href = waLink(`Hi XTSY! ${summary}. ${travellers} people, dates: ${f.dates || 'flexible'}. ${f.notes}`);
    }
  };

  return (
    <form id={id} onSubmit={submit} className="xt-reveal grid scroll-mt-28 gap-4 rounded-[28px] bg-white p-7 text-xt-ink sm:grid-cols-2 sm:p-10">
      <h2 className="xt-display m-0 text-[40px] leading-none sm:col-span-2 sm:text-[48px]">{title}</h2>
      {done ? (
        <p className="m-0 text-[16px] font-bold sm:col-span-2">Thanks, {f.name.split(' ')[0] || 'friend'}! Your enquiry is in. We’ll reply on WhatsApp with a quote.</p>
      ) : (
        <>
          <label className={label}>NAME<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} autoComplete="name" /></label>
          <label className={label}>WHATSAPP<input required type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={input} autoComplete="tel" /></label>
          <label className={label}>EMAIL<input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={input} autoComplete="email" /></label>
          {types ? (
            <label className={label}>{typeLabel}
              <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} className={input}>
                {types.map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
          ) : (
            <label className={label}>DATES<input value={f.dates} onChange={(e) => setF({ ...f, dates: e.target.value })} placeholder="e.g. 12–15 Dec" className={input} /></label>
          )}
          <label className={label}>{travellersLabel}<input type="number" min={1} value={f.travellers} onChange={(e) => setF({ ...f, travellers: e.target.value })} className={input} /></label>
          {types && <label className={label}>DATES<input value={f.dates} onChange={(e) => setF({ ...f, dates: e.target.value })} placeholder="e.g. 12–15 Dec" className={input} /></label>}
          <label className={`${label} sm:col-span-2`}>ANYTHING ELSE<textarea rows={3} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className={`${input} h-auto py-3`} /></label>
          <button type="submit" disabled={busy} className="xt-btn h-14 rounded-full bg-xt-crimson text-[16px] font-extrabold text-white disabled:opacity-60 sm:col-span-2">{busy ? 'Sending…' : 'Send enquiry'}</button>
          {note && <p className="m-0 text-[13px] text-xt-mute sm:col-span-2">{note}</p>}
        </>
      )}
    </form>
  );
}
