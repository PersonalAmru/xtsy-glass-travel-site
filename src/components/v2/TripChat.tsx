/**
 * "Plan a trip with AI" — the XTSY trip assistant chat.
 *
 * Used embedded (home page, /plan-trip-with-ai) and as a site-wide pop-up
 * (ChatLauncher). The conversation is kept in sessionStorage so it survives
 * navigation, and every action button works: send the plan to the XTSY desk
 * (saved as a tour enquiry), WhatsApp it, book the XTSY nights, copy it, or
 * start over.
 */
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from '@/lib/router-compat';
import { cn } from '@/lib/utils';
import { createTourEnquiry } from '@/services/tourBookingService';
import { INITIAL_STATE, WELCOME, respond, type ChatAction, type ChatState, type Reply } from '@/lib/travel/assistant';
import { planToText, type Plan } from '@/lib/travel/planner';
import { waLink } from './primitives';

interface Msg { from: 'you' | 'xtsy'; text: string; plan?: Plan; chips?: string[]; actions?: ChatAction[] }
const KEY = 'xtsy_trip_chat_v1';
export { OPEN_EVENT, openTripChat } from './tripChatEvents';

function load(): { msgs: Msg[]; state: ChatState } | null {
  try { const raw = sessionStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function save(msgs: Msg[], state: ChatState) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ msgs: msgs.slice(-40), state })); } catch { /* storage blocked */ }
}

/** Minimal formatting: **bold**, paragraphs and line breaks. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i} className="m-0 [&+&]:mt-2.5">
          {para.split('\n').map((line, j) => (
            <span key={j}>
              {j > 0 && <br />}
              {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) => (part.startsWith('**') ? <strong key={k}>{part.slice(2, -2)}</strong> : <span key={k}>{part}</span>))}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <ol className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
      {plan.days.map((d) => (
        <li key={d.n} className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 rounded-2xl bg-white p-3 text-xt-ink">
          <div className={cn('flex flex-col items-center justify-center rounded-xl font-display leading-none text-white', d.atXtsy ? 'bg-xt-crimson' : d.overnight === '—' ? 'bg-xt-steel' : 'bg-xt-pine')}>
            <span className="text-[10px] tracking-[0.2em]">DAY</span>
            <span className="text-[24px]">{d.n}</span>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[15px] font-extrabold leading-snug">{d.title}</span>
            <span className="text-[13px] leading-snug text-xt-mute">{d.stops.join(' · ')}</span>
            <span className="flex flex-wrap gap-1.5 pt-0.5 text-[11px] font-bold">
              {d.driveHours > 0 && <span className="rounded-full bg-xt-sand px-2 py-0.5">~{d.driveHours} h on the road</span>}
              {d.overnight !== '—' && (
                <span className={cn('rounded-full px-2 py-0.5', d.atXtsy ? 'bg-xt-blush text-xt-crimson-dark' : 'bg-[#E4EEE8] text-xt-pine')}>
                  Night: {d.atXtsy ? 'XTSY, New Shillong' : d.overnight.replace(' (booked by XTSY)', '')}
                </span>
              )}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function TripChat({ variant = 'embedded', className, onClose, initialPrompt, title }: { variant?: 'embedded' | 'panel'; className?: string; onClose?: () => void; initialPrompt?: string; title?: ReactNode }) {
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [state, setState] = useState<ChatState>(INITIAL_STATE);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sendFor, setSendFor] = useState<Plan | null>(null);
  const [lead, setLead] = useState({ name: '', phone: '', email: '', dates: '' });
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const saved = load();
    if (saved?.msgs?.length) { setMsgs(saved.msgs); setState({ ...INITIAL_STATE, ...saved.state }); }
    else setMsgs([{ from: 'xtsy', ...WELCOME }]);
  }, []);
  useEffect(() => { if (msgs.length) save(msgs, state); }, [msgs, state]);
  useEffect(() => { const el = listRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }, [msgs, typing, sendFor]);

  const lastPlan = [...msgs].reverse().find((m) => m.plan)?.plan;

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setInput('');
    setSendFor(null);
    setMsgs((m) => [...m, { from: 'you', text: q }]);
    setTyping(true);
    window.setTimeout(() => {
      let reply: Reply;
      let next = state;
      try { const r = respond(q, state); reply = r.reply; next = r.state; } catch { reply = { text: 'Sorry, something went wrong on my side. Please try again, or message the XTSY desk on WhatsApp.', chips: [], actions: ['whatsapp'] }; }
      setState(next);
      setMsgs((m) => [...m, { from: 'xtsy', ...reply }]);
      setTyping(false);
    }, 420);
  };

  useEffect(() => {
    if (initialPrompt && !started.current && msgs.length) { started.current = true; ask(initialPrompt); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, msgs.length]);

  const chipAction = (chip: string) => {
    if (/^check live availability$/i.test(chip)) return navigate('/book');
    if (/pet-friendly stays page/i.test(chip)) return navigate('/pet-friendly');
    if (/group bookings page/i.test(chip)) return navigate('/group-bookings-meghalaya');
    if (/workation plans/i.test(chip)) return navigate('/work-from-home');
    if (/see the menu/i.test(chip)) return navigate('/tab-bistro');
    if (/talk to the desk on whatsapp/i.test(chip)) return void window.open(waLink('Hi XTSY! I have a question about my trip.'), '_blank', 'noopener');
    ask(chip);
  };

  const doAction = async (a: ChatAction, plan?: Plan) => {
    const p = plan ?? lastPlan;
    if (a === 'reset') { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } setState(INITIAL_STATE); setMsgs([{ from: 'xtsy', ...WELCOME }]); setSendFor(null); return; }
    if (a === 'whatsapp') { window.open(waLink(p ? `Hi XTSY! Please help me book this trip:\n${planToText(p)}` : 'Hi XTSY! Please help me plan a trip.'), '_blank', 'noopener'); return; }
    if (a === 'book') {
      const guests = String(p?.input.travellers ?? 2);
      navigate(`/book/select?${new URLSearchParams({ location: 'shillong', guests }).toString()}`);
      return;
    }
    if (a === 'copy' && p) {
      try { await navigator.clipboard.writeText(planToText(p)); toast.success('Plan copied'); } catch { toast.error('Could not copy — select the text instead.'); }
      return;
    }
    if (a === 'send' && p) setSendFor(p);
  };

  const submitLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!sendFor) return;
    setSending(true);
    const text = planToText(sendFor);
    const res = await createTourEnquiry({
      packageTitle: `Custom trip (AI trip assistant): ${sendFor.input.days} days`,
      packageDuration: `${sendFor.input.days} days`,
      packageDifficulty: 'custom',
      packageCategory: 'custom',
      packageLocation: [...new Set(sendFor.days.map((d) => d.title))].slice(1, 4).join(', ') || 'Meghalaya',
      travellers: sendFor.input.travellers,
      preferredDate: lead.dates.trim() || 'Flexible',
      groupType: sendFor.input.travellers > 1 ? 'group' : 'solo',
      perPersonPrice: 0,
      totalAmount: 0,
      guestName: lead.name.trim(),
      email: lead.email.trim(),
      whatsappNumber: lead.phone.trim(),
      specialRequests: text.slice(0, 1900),
    });
    setSending(false);
    if (res.success) {
      setSendFor(null);
      setMsgs((m) => [...m, { from: 'xtsy', text: `Sent to the XTSY desk${res.enquiryId ? ` (ref **${res.enquiryId}**)` : ''}. We’ll reply on WhatsApp to confirm stays, cabs and prices — usually within an hour.`, chips: ['Where should I stay in Shillong?', 'Check-in time?'] }]);
    } else {
      toast.error('Could not send online — opening WhatsApp with your plan instead.');
      window.open(waLink(`Hi XTSY! Please help me book this trip:\n${text}`), '_blank', 'noopener');
    }
  };

  const field = 'h-11 w-full rounded-xl border-[1.5px] border-xt-line bg-white px-3 text-[15px] font-medium text-xt-ink focus:border-xt-crimson focus:outline-none';
  const panel = variant === 'panel';

  return (
    <section aria-label="XTSY trip assistant" className={cn('flex min-h-0 flex-col overflow-hidden bg-xt-ink text-xt-paper', panel ? 'h-full' : 'h-[640px] max-h-[82vh] rounded-[28px] shadow-[0_40px_80px_-40px_rgba(31,34,48,0.7)]', className)}>
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-xt-crimson" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" /><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z" /></svg>
          </span>
          <div className="min-w-0">
            <div className="truncate font-display text-[22px] leading-none tracking-wide">{title ?? 'Plan a trip with AI'}</div>
            <div className="mt-1 text-[12px] font-semibold text-xt-fog">Shillong · Meghalaya · Northeast India — real drive times</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => doAction('reset')} className="h-9 rounded-full px-3 text-[12px] font-bold text-xt-fog hover:bg-white/10">Start over</button>
          {onClose && (
            <button type="button" aria-label="Close trip assistant" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          )}
        </div>
      </header>

      <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={cn('flex flex-col gap-2', m.from === 'you' ? 'items-end' : 'items-start')}>
            <div className={cn('max-w-[92%] rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed', m.from === 'you' ? 'rounded-br-md bg-xt-crimson text-white' : 'rounded-bl-md bg-[#2A2F42] text-xt-paper')}>
              <Rich text={m.text} />
              {m.plan && <PlanCard plan={m.plan} />}
            </div>
            {m.from === 'xtsy' && i === msgs.length - 1 && !typing && (
              <>
                {!!m.actions?.length && (
                  <div className="flex max-w-full flex-wrap gap-2">
                    {m.actions.includes('send') && <button type="button" onClick={() => doAction('send', m.plan)} className="xt-btn h-10 rounded-full bg-xt-crimson px-4 text-[13px] font-extrabold text-white">Get this plan confirmed</button>}
                    {m.actions.includes('whatsapp') && <button type="button" onClick={() => doAction('whatsapp', m.plan)} className="h-10 rounded-full bg-[#25D366] px-4 text-[13px] font-extrabold text-[#0B3B1F]">WhatsApp the desk</button>}
                    {m.actions.includes('book') && <button type="button" onClick={() => doAction('book', m.plan)} className="h-10 rounded-full border-[1.5px] border-xt-paper/60 px-4 text-[13px] font-extrabold">Book XTSY nights</button>}
                    {m.actions.includes('copy') && <button type="button" onClick={() => doAction('copy', m.plan)} className="h-10 rounded-full border-[1.5px] border-xt-paper/30 px-4 text-[13px] font-bold text-xt-fog">Copy plan</button>}
                  </div>
                )}
                {!!m.chips?.length && (
                  <div className="flex max-w-full flex-wrap gap-2">
                    {m.chips.map((c) => (
                      <button key={c} type="button" onClick={() => chipAction(c)} className="xt-chip h-9 rounded-full border-[1.5px] border-[#454B61] bg-transparent px-3.5 text-[13px] font-bold text-xt-paper hover:border-xt-rose">{c}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-md bg-[#2A2F42] px-4 py-3" aria-label="Planning">
            {[0, 1, 2].map((d) => <span key={d} className="xt-typing h-2 w-2 rounded-full bg-xt-rose" style={{ animationDelay: `${d * 0.15}s` }} />)}
          </div>
        )}
        {sendFor && (
          <form onSubmit={submitLead} className="grid gap-2.5 rounded-2xl bg-white p-4 text-xt-ink sm:grid-cols-2">
            <p className="m-0 text-[14px] font-bold sm:col-span-2">Send this {sendFor.input.days}-day plan to the XTSY desk. We’ll confirm stays, cabs and prices on WhatsApp.</p>
            <label className="flex flex-col gap-1 text-[11px] font-extrabold tracking-wide text-xt-mute">NAME<input required value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} className={field} autoComplete="name" /></label>
            <label className="flex flex-col gap-1 text-[11px] font-extrabold tracking-wide text-xt-mute">WHATSAPP<input required type="tel" inputMode="tel" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} className={field} autoComplete="tel" /></label>
            <label className="flex flex-col gap-1 text-[11px] font-extrabold tracking-wide text-xt-mute">EMAIL<input required type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} className={field} autoComplete="email" /></label>
            <label className="flex flex-col gap-1 text-[11px] font-extrabold tracking-wide text-xt-mute">DATES<input value={lead.dates} placeholder="e.g. 12–16 Dec" onChange={(e) => setLead({ ...lead, dates: e.target.value })} className={field} /></label>
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" disabled={sending} className="xt-btn h-11 flex-1 rounded-full bg-xt-crimson text-[14px] font-extrabold text-white disabled:opacity-60">{sending ? 'Sending…' : 'Send to the XTSY desk'}</button>
              <button type="button" onClick={() => setSendFor(null)} className="h-11 rounded-full border-[1.5px] border-xt-line px-4 text-[14px] font-bold">Cancel</button>
            </div>
          </form>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2 border-t border-white/10 p-3 sm:p-4">
        <label htmlFor={`trip-chat-input-${variant}`} className="sr-only">Ask the XTSY trip assistant</label>
        <input
          id={`trip-chat-input-${variant}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 6 days, Dawki + Cherrapunji, 2 of us in March"
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-full border-[1.5px] border-[#454B61] bg-[#23283A] px-4 text-[15px] text-xt-paper placeholder:text-[#8D94AA] focus:border-xt-rose focus:outline-none"
        />
        <button type="submit" disabled={!input.trim() || typing} aria-label="Send" className="xt-btn flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-xt-crimson text-white disabled:opacity-50">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </form>
      <p className="m-0 px-5 pb-3 text-[11px] text-[#8D94AA]">
        Drive times are estimates; the XTSY desk confirms every plan before you pay. XTSY’s own stay is in New Shillong Township — elsewhere we book trusted partners. <Link to="/plan-trip-with-ai" className="font-bold text-xt-fog underline">How it works</Link>
      </p>
    </section>
  );
}
