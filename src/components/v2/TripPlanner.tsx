/**
 * "Build a trip with AI" planner — updates the itinerary instantly on every tap,
 * sends it to the XTSY desk (saved to tour_enquiries) or straight to WhatsApp.
 */
import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from '@/lib/router-compat';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createTourEnquiry } from '@/services/tourBookingService';
import {
  buildTripPlan, planToText, DAY_OPTIONS, STYLE_OPTIONS, PLACE_OPTIONS, EXPERIENCE_OPTIONS,
  DEFAULT_PLANNER_INPUT, type PlannerInput,
} from '@/lib/tripPlanner';
import { LiveDot, waLink } from './primitives';

type ListKey = 'styles' | 'places' | 'experiences';

function Chip({ active, onClick, children, big }: { active: boolean; onClick: () => void; children: ReactNode; big?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'xt-chip border-[1.5px] font-bold',
        big ? 'flex h-14 flex-col items-center justify-center gap-0.5 rounded-[14px]' : 'h-10 rounded-full px-4 text-[14px]',
        active ? 'border-xt-crimson bg-xt-crimson text-white' : 'border-[#454B62] bg-transparent text-[#E4D9C8] hover:border-xt-rose',
      )}
    >
      {children}
    </button>
  );
}

export default function TripPlanner({ className }: { className?: string }) {
  const [input, setInput] = useState<PlannerInput>(DEFAULT_PLANNER_INPUT);
  const [showSend, setShowSend] = useState(false);
  const [lead, setLead] = useState({ name: '', phone: '', email: '', dates: '', travellers: '2' });
  const [sending, setSending] = useState(false);
  const [sentRef, setSentRef] = useState<string | null>(null);

  const plan = useMemo(() => buildTripPlan(input), [input]);
  const planText = useMemo(() => planToText(input, plan), [input, plan]);

  const toggle = (key: ListKey, v: string) =>
    setInput((cur) => {
      const list = cur[key] as string[];
      return { ...cur, [key]: list.includes(v) ? list.filter((x) => x !== v) : [...list, v] } as PlannerInput;
    });

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!lead.name.trim() || !lead.phone.trim() || !lead.email.trim()) {
      toast.error('Please add your name, WhatsApp number and email');
      return;
    }
    setSending(true);
    const travellers = Math.max(1, parseInt(lead.travellers, 10) || 1);
    const res = await createTourEnquiry({
      packageTitle: 'Custom trip (AI trip builder)',
      packageDuration: `${input.days} days`,
      packageDifficulty: 'custom',
      packageCategory: 'custom',
      packageLocation: input.places.map((p) => PLACE_OPTIONS.find((o) => o.v === p)?.label ?? p).join(', ') || 'Meghalaya',
      travellers,
      preferredDate: lead.dates.trim() || 'Flexible',
      groupType: travellers > 1 ? 'group' : 'solo',
      perPersonPrice: 0,
      totalAmount: 0,
      guestName: lead.name.trim(),
      email: lead.email.trim(),
      whatsappNumber: lead.phone.trim(),
      specialRequests: `${planText}\nStyles: ${input.styles.join(', ')}\nExperiences: ${input.experiences.join(', ')}`,
    });
    setSending(false);
    if (res.success) {
      setSentRef(res.enquiryId ?? 'sent');
      toast.success('Plan sent. The XTSY desk will reply on WhatsApp.');
    } else {
      toast.error('Could not send online — opening WhatsApp with your plan instead.');
      window.location.href = waLink(`Hi XTSY! Please help me book this trip:\n${planText}`);
    }
  };

  return (
    <div id="planner" className={cn('relative scroll-mt-28 rounded-[32px] bg-xt-ink p-5 text-xt-paper shadow-[0_40px_80px_-40px_rgba(31,34,48,0.7)] sm:p-8', className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 font-display text-[16px] tracking-[0.2em] text-xt-rose">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" /><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z" /></svg>
            Trip builder
          </div>
          <h2 className="xt-display m-0 text-[40px] leading-[0.95] sm:text-[52px]">Build a trip with AI</h2>
        </div>
        <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[#2A2F42] px-3.5 py-2 text-[13px] font-bold">
          <LiveDot /> Updates as you tap
        </span>
      </div>

      <fieldset className="mt-5 flex flex-col gap-2.5">
        <legend className="mb-2.5 text-[13px] font-extrabold tracking-wider text-[#A3ABC2]">HOW MANY DAYS?</legend>
        <div className="grid grid-cols-4 gap-2">
          {DAY_OPTIONS.map((o) => (
            <Chip key={o.v} big active={input.days === o.v} onClick={() => setInput((c) => ({ ...c, days: o.v }))}>
              <span className="text-[15px] font-extrabold sm:text-[16px]">{o.label}</span>
              <span className="hidden text-[11px] opacity-80 sm:block">{o.desc}</span>
            </Chip>
          ))}
        </div>
      </fieldset>

      {([
        ['YOUR TRAVEL STYLE', 'styles', STYLE_OPTIONS],
        ['WHERE DO YOU WANT TO GO?', 'places', PLACE_OPTIONS],
        ['EXPERIENCES', 'experiences', EXPERIENCE_OPTIONS],
      ] as const).map(([label, key, opts]) => (
        <fieldset key={key} className="mt-5">
          <legend className="mb-2.5 text-[13px] font-extrabold tracking-wider text-[#A3ABC2]">{label}</legend>
          <div className="flex flex-wrap gap-2">
            {opts.map((o) => (
              <Chip key={o.v} active={(input[key] as string[]).includes(o.v)} onClick={() => toggle(key, o.v)}>
                {o.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="mt-6 flex flex-col gap-3.5 rounded-[22px] bg-xt-sand p-4 text-xt-ink sm:p-5" aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="xt-display m-0 text-[28px] leading-none sm:text-[32px]">Your {input.days}-day Meghalaya plan</h3>
          <span className="text-[13px] font-extrabold text-xt-mute">~{plan.driveTotal} h driving · base: XTSY, New Shillong</span>
        </div>
        {plan.warning && (
          <div className="rounded-[14px] bg-xt-blush px-3.5 py-3 text-[14px] font-bold leading-snug text-xt-crimson-dark">{plan.warning}</div>
        )}
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {plan.days.map((d, i) => (
            <li
              key={`${input.days}-${d.n}-${d.title}`}
              className="xt-pop grid grid-cols-[56px_minmax(0,1fr)] gap-3.5 rounded-2xl bg-white px-3.5 py-3 sm:grid-cols-[64px_minmax(0,1fr)]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex flex-col items-center justify-center rounded-xl font-display leading-none text-white" style={{ background: d.tint }}>
                <span className="text-[11px] tracking-[0.2em]">DAY</span>
                <span className="text-[28px]">{d.n}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-extrabold">{d.title}</span>
                <span className="text-[14px] leading-snug text-xt-mute">{d.stops.join(' · ')}</span>
                <span className="text-[12px] font-bold text-xt-crimson-dark">{d.meta}</span>
              </div>
            </li>
          ))}
        </ol>

        {sentRef ? (
          <div className="rounded-2xl bg-white p-4 text-[15px] font-bold">
            Sent to the XTSY desk{sentRef !== 'sent' ? ` (ref ${sentRef})` : ''}. We’ll reply on WhatsApp to confirm stays, cabs and prices.
          </div>
        ) : showSend ? (
          <form onSubmit={send} className="grid gap-2.5 rounded-2xl bg-white p-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-[12px] font-extrabold tracking-wide text-xt-mute">NAME
              <input required value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} className="h-11 rounded-xl border-[1.5px] border-xt-line px-3 text-[15px] font-medium text-xt-ink" autoComplete="name" />
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-extrabold tracking-wide text-xt-mute">WHATSAPP NUMBER
              <input required type="tel" inputMode="tel" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} className="h-11 rounded-xl border-[1.5px] border-xt-line px-3 text-[15px] font-medium text-xt-ink" autoComplete="tel" />
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-extrabold tracking-wide text-xt-mute">EMAIL
              <input required type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} className="h-11 rounded-xl border-[1.5px] border-xt-line px-3 text-[15px] font-medium text-xt-ink" autoComplete="email" />
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex flex-col gap-1 text-[12px] font-extrabold tracking-wide text-xt-mute">DATES
                <input value={lead.dates} placeholder="e.g. 12–16 Nov" onChange={(e) => setLead({ ...lead, dates: e.target.value })} className="h-11 rounded-xl border-[1.5px] border-xt-line px-3 text-[15px] font-medium text-xt-ink" />
              </label>
              <label className="flex flex-col gap-1 text-[12px] font-extrabold tracking-wide text-xt-mute">TRAVELLERS
                <input type="number" min={1} max={60} value={lead.travellers} onChange={(e) => setLead({ ...lead, travellers: e.target.value })} className="h-11 rounded-xl border-[1.5px] border-xt-line px-3 text-[15px] font-medium text-xt-ink" />
              </label>
            </div>
            <button type="submit" disabled={sending} className="xt-btn h-12 rounded-[14px] bg-xt-crimson text-[15px] font-extrabold text-white disabled:opacity-60 sm:col-span-2">
              {sending ? 'Sending…' : 'Send plan to the XTSY desk'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button type="button" onClick={() => setShowSend(true)} className="xt-btn flex h-[52px] flex-1 items-center justify-center rounded-[14px] bg-xt-crimson text-[15px] font-extrabold text-white">
              Get this plan confirmed
            </button>
            <a href={waLink(`Hi XTSY! Please help me book this trip:\n${planText}`)} className="xt-btn flex h-[52px] items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-xt-ink px-5 text-[15px] font-extrabold text-xt-ink hover:text-xt-ink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 12z" /></svg>
              WhatsApp
            </a>
            <Link to="/book" className="xt-btn flex h-[52px] items-center justify-center rounded-[14px] border-[1.5px] border-xt-ink px-5 text-[15px] font-extrabold text-xt-ink hover:text-xt-ink">
              Book the stay
            </Link>
          </div>
        )}
        <span className="text-[12px] text-xt-mute">Drive times are estimates and change with weather and season. Our travel desk confirms every plan before you pay.</span>
      </div>
    </div>
  );
}
