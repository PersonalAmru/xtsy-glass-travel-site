/**
 * /partner-stays — for homestays and guest houses that want to host XTSY guests outside New
 * Shillong. Applications go through the shared create_enquiry function with room type
 * 'partner-stay-application' so they land in the desk's one pending queue (AGENTS.md). Terms
 * such as rates and commission are agreed one to one, so none are published here.
 */
import { useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatLocalDateString, getLocalToday } from '@/lib/date-utils';
import { bookingPageSource } from '@/utils/privacyCompliantWhatsApp';
import { PageShell, Breadcrumbs, PAD } from '@/components/v2/blocks';
import { waLink } from '@/components/v2/primitives';

const OFFER = [
  { t: 'Guests from XTSY', d: 'Travellers on XTSY tours and the weekly Saturday Meghalaya group trip, plus guests who ask the XTSY desk for a stay outside Shillong.' },
  { t: 'One point of contact', d: 'The XTSY desk handles the booking, the guest\'s questions and the trip leader, and shares arrival details with you ahead of time.' },
  { t: 'Listed on xtsy.one', d: 'Approved partners can be shown on xtsy.one as an XTSY partner stay, with your own photos and description.' },
];

const LOOKING_FOR = [
  'A homestay, guest house, lodge or campsite in Meghalaya or elsewhere in the Northeast (we are starting with Sohra, Tyrna, Dawki, Shnongpdeng and Mawlynnong)',
  'Clean linen and towels, hot water, and a clean bathroom for every room',
  'Home-cooked breakfast, and dinner on request',
  'A host or caretaker who answers the phone and is reachable on WhatsApp',
  'A good guest rating where you are already listed (Google, Airbnb or booking sites)',
  'All licences your local authority requires for hosting guests',
];

export default function PartnerStaysV2() {
  const [f, setF] = useState({ name: '', property: '', town: '', rooms: '2', email: '', phone: '', listing: '', notes: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState('');
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!f.property.trim() || !f.town.trim()) { setError('Please add your property name and town.'); return; }
    setBusy(true);
    try {
      // create_enquiry needs a date range; for an application it records the day it was sent.
      const today = getLocalToday();
      const tomorrow = new Date(today.getTime() + 86400000);
      const { data, error: saveError } = await supabase.rpc('create_enquiry', {
        p_guest_name: f.name,
        p_email: f.email,
        p_phone: f.phone,
        p_check_in: formatLocalDateString(today),
        p_check_out: formatLocalDateString(tomorrow),
        p_room_type: 'partner-stay-application',
        p_room_name: `Partner stay application — ${f.property.trim()} (${f.town.trim()})`,
        p_quantity: Math.min(30, Math.max(1, parseInt(f.rooms, 10) || 1)),
        p_nights: 1,
        p_rate_per_night: 0,
        p_subtotal: 0,
        p_gst_rate: 0,
        p_gst_amount: 0,
        p_total_amount: 0,
        p_special_requests: [
          `Property: ${f.property.trim()}`,
          `Town: ${f.town.trim()}`,
          `Rooms: ${f.rooms}`,
          f.listing.trim() ? `Listing: ${f.listing.trim()}` : '',
          f.notes.trim(),
          `Page: ${bookingPageSource()}`,
        ].filter(Boolean).join(' | ').slice(0, 2000),
      } as never);
      if (saveError) throw saveError;
      const ref = (data as { enquiry_id?: string }[] | null)?.[0]?.enquiry_id;
      setDone(ref || 'received');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your application. Please message us on WhatsApp.');
    } finally {
      setBusy(false);
    }
  };

  const input = 'h-12 w-full rounded-xl border border-xt-line bg-white px-4 text-[15px]';
  return (
    <PageShell
      bar={{ label: 'Ask on WhatsApp', to: waLink('Hi XTSY! I run a homestay and would like to become a partner stay.'), note: 'For homestays and guest houses' }}
      cta={false}
    >
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Partner stays' }]} />
      <section className={`${PAD} flex flex-col gap-5 py-12`}>
        <div className="xt-eyebrow text-[15px]">For homestays and guest houses</div>
        <h1 className="xt-display m-0 max-w-[1000px] text-[52px] leading-[0.9] sm:text-[88px]">Become an XTSY partner stay</h1>
        <p className="m-0 max-w-[780px] text-[17px] leading-relaxed text-xt-mute">
          XTSY runs its own hostel in New Shillong Township. Everywhere else, our guests stay with trusted local hosts.
          If you run a good homestay or guest house in Meghalaya or the wider Northeast, we would like to send you guests.
        </p>
      </section>

      <section className={`${PAD} grid gap-6 pb-14 md:grid-cols-3`}>
        {OFFER.map((o) => (
          <div key={o.t} className="xt-reveal flex flex-col gap-2 rounded-3xl bg-white p-6">
            <h2 className="xt-display m-0 text-[28px] leading-none">{o.t}</h2>
            <p className="m-0 text-[15px] leading-relaxed text-xt-mute">{o.d}</p>
          </div>
        ))}
      </section>

      <section className={`${PAD} grid gap-10 pb-16 lg:grid-cols-2`}>
        <div className="flex flex-col gap-3">
          <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">What we look for</h2>
          <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-xt-mute">
            {LOOKING_FOR.map((l) => <li key={l}>{l}</li>)}
          </ul>
          <p className="m-0 text-[15px] leading-relaxed text-xt-mute">
            After you apply, someone from XTSY calls you and visits before anything is listed. Rates and terms are agreed with each host directly.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6">
          <h2 className="xt-display m-0 text-[32px] leading-none">Apply</h2>
          {done ? (
            <p className="mt-4 text-[16px] leading-relaxed">
              Thank you! Your application{done !== 'received' ? ` (reference ${done})` : ''} has reached the XTSY desk. We will call you within a few days.
            </p>
          ) : (
            <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-[14px] font-bold">Your name<input required minLength={2} value={f.name} onChange={set('name')} className={input} autoComplete="name" /></label>
              <label className="flex flex-col gap-1 text-[14px] font-bold">Property name<input required value={f.property} onChange={set('property')} className={input} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-[14px] font-bold">Town or village<input required value={f.town} onChange={set('town')} className={input} /></label>
                <label className="flex flex-col gap-1 text-[14px] font-bold">Rooms<input required type="number" min={1} max={30} value={f.rooms} onChange={set('rooms')} className={input} /></label>
              </div>
              <label className="flex flex-col gap-1 text-[14px] font-bold">Phone / WhatsApp<input required type="tel" value={f.phone} onChange={set('phone')} className={input} autoComplete="tel" /></label>
              <label className="flex flex-col gap-1 text-[14px] font-bold">Email<input required type="email" value={f.email} onChange={set('email')} className={input} autoComplete="email" /></label>
              <label className="flex flex-col gap-1 text-[14px] font-bold">Google Maps or listing link (optional)<input value={f.listing} onChange={set('listing')} className={input} /></label>
              <label className="flex flex-col gap-1 text-[14px] font-bold">Anything else (optional)<textarea value={f.notes} onChange={set('notes')} rows={3} className="w-full rounded-xl border border-xt-line bg-white px-4 py-3 text-[15px]" /></label>
              {error && <p role="alert" className="m-0 text-[14px] font-bold text-xt-crimson">{error}</p>}
              <button type="submit" disabled={busy} className="xt-btn mt-2 flex h-12 items-center justify-center rounded-full bg-xt-crimson px-6 text-[15px] font-extrabold text-white disabled:opacity-60">
                {busy ? 'Sending…' : 'Send application'}
              </button>
              <p className="m-0 text-[13px] text-xt-mute">We use these details only to contact you about becoming a partner stay.</p>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}
