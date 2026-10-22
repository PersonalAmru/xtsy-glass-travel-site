/**
 * Page-building blocks for inner pages of the 2026 redesign.
 */
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Helmet } from '@/lib/seo/helmet';
import { Link } from '@/lib/router-compat';
import { cn } from '@/lib/utils';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import CtaBand from './CtaBand';
import { Eyebrow, Photo, XtsyMark, waLink } from './primitives';
import { inr, lowestDormPrice } from './pricing';

export const PAD = 'px-4 sm:px-8 lg:px-16';

/** The main action for the sticky phone bar. Wording is kept to a small set across the site:
 *  "Book a stay", "Get a quote", "Book this tour", "Reserve a table". */
export type BarAction = { label: string; to?: string; onClick?: () => void; note?: string };

/**
 * Phone-only booking bar fixed to the bottom of the screen. It appears once the visitor has
 * scrolled past the first screen (the hero already has its own buttons), so it never covers
 * the hero or delays the first paint.
 */
export function MobileBookBar({ label, to, onClick, note }: BarAction) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      data-mobile-book-bar
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-xt-line bg-xt-paper/95 px-4 py-2.5 shadow-[0_-8px_24px_rgba(31,34,48,0.12)] backdrop-blur transition-[transform,visibility] duration-300 md:hidden',
        // invisible (not just moved) while hidden, so the button is out of the tab order and screen readers
        show ? 'visible translate-y-0' : 'pointer-events-none invisible translate-y-full',
      )}
    >
      <div className="flex items-center gap-3">
        {note && <p className="m-0 min-w-0 flex-1 text-[13px] font-bold leading-tight text-xt-ink">{note}</p>}
        <Btn to={to} onClick={onClick} className={cn('h-12 px-6 text-[15px]', !note && 'flex-1')}>{label}</Btn>
      </div>
    </div>
  );
}

/** Header + page + CTA band + footer, all inside the .xt theme. */
export function PageShell({
  children,
  cta,
  bar,
}: {
  children: ReactNode;
  cta?: { title?: string; sub?: string; bookTo?: string; bookLabel?: string } | false;
  /** Sticky phone booking bar; defaults to "Book a stay". Pass false to hide it. */
  bar?: BarAction | false;
}) {
  const action = bar === false ? null : bar ?? { label: 'Book a stay', to: '/book', note: `Dorms from ${inr(lowestDormPrice())} a night, incl. taxes` };
  return (
    <div className={cn('xt min-h-screen', action && 'pb-[72px] md:pb-0')}>
      <SiteHeader />
      <main>{children}</main>
      {cta !== false && <CtaBand {...(cta || {})} />}
      <SiteFooter />
      {action && <MobileBookBar {...action} />}
    </div>
  );
}

type BtnKind = 'primary' | 'dark' | 'outline' | 'light' | 'outline-light';
const BTN: Record<BtnKind, string> = {
  primary: 'bg-xt-crimson text-white hover:text-white',
  dark: 'bg-xt-ink text-xt-paper hover:text-xt-paper',
  outline: 'border-[1.5px] border-xt-ink text-xt-ink hover:text-xt-ink',
  light: 'bg-xt-paper text-xt-ink hover:text-xt-ink',
  'outline-light': 'border-[1.5px] border-current text-inherit',
};

/** Link-styled button. External (http/wa.me/tel/mailto/#) targets render as <a>. */
export function Btn({ to, kind = 'primary', children, className, onClick }: { to?: string; kind?: BtnKind; children: ReactNode; className?: string; onClick?: () => void }) {
  const cls = cn('xt-btn inline-flex h-14 items-center justify-center gap-2 rounded-full px-7 text-[16px] font-extrabold', BTN[kind], className);
  if (!to) return <button type="button" onClick={onClick} className={cls}>{children}</button>;
  if (/^(https?:|tel:|mailto:|#)/.test(to)) {
    const ext = /^https?:/.test(to);
    return <a href={to} onClick={onClick} className={cls} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
  }
  return <Link to={to} onClick={onClick} className={cls}>{children}</Link>;
}

export const WaBtn = ({ text, children = 'Book on WhatsApp', kind = 'primary' as BtnKind }: { text?: string; children?: ReactNode; kind?: BtnKind }) => (
  <Btn to={waLink(text)} kind={kind}>{children}</Btn>
);

export function PageHero({
  eyebrow,
  title,
  text,
  actions,
  media,
  bg = '#EFE6DA',
  fg = '#1F2230',
  muted = '#4F566A',
  eyebrowColor,
  decoration,
  size = 'lg',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
  bg?: string;
  fg?: string;
  muted?: string;
  eyebrowColor?: string;
  decoration?: ReactNode;
  size?: 'lg' | 'md';
}) {
  return (
    <section className={cn('relative grid items-center gap-12 overflow-hidden py-14 sm:py-20 lg:gap-14 lg:py-[88px]', media && 'lg:grid-cols-2', PAD)} style={{ background: bg, color: fg }}>
      {decoration}
      <div className="relative flex flex-col gap-6">
        {eyebrow && <div className="xt-in xt-eyebrow text-[15px] sm:text-[18px]" style={eyebrowColor ? { color: eyebrowColor } : undefined}>{eyebrow}</div>}
        <h1 className={cn('xt-in xt-d1 xt-display m-0 leading-[0.86]', size === 'lg' ? 'text-[68px] sm:text-[104px] lg:text-[136px]' : 'text-[56px] sm:text-[84px] lg:text-[104px]')}>{title}</h1>
        {/* A plain-text intro is a real paragraph straight under the H1: the short answer search and AI engines quote. */}
        {text && (typeof text === 'string'
          ? <p data-quick-answer className="xt-in xt-d2 m-0 max-w-[560px] text-[17px] leading-relaxed sm:text-[20px]" style={{ color: muted }}>{text}</p>
          : <div className="xt-in xt-d2 m-0 max-w-[560px] text-[17px] leading-relaxed sm:text-[20px]" style={{ color: muted }}>{text}</div>)}
        {actions && <div className="xt-in xt-d3 flex flex-wrap gap-3">{actions}</div>}
      </div>
      {media && <div className="xt-in xt-d2 relative">{media}</div>}
    </section>
  );
}

export function Section({ children, className, style, id }: { children: ReactNode; className?: string; style?: CSSProperties; id?: string }) {
  return <section id={id} className={cn(PAD, 'flex flex-col gap-10 py-16 sm:py-20 lg:py-24', className)} style={style}>{children}</section>;
}

export function H2({ eyebrow, children, light, aside }: { eyebrow?: ReactNode; children: ReactNode; light?: boolean; aside?: ReactNode }) {
  return (
    <div className="xt-reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-[900px] flex-col gap-2.5">
        {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
        <h2 className="xt-display m-0 text-[44px] leading-[0.95] sm:text-[60px] lg:text-[72px]">{children}</h2>
      </div>
      {aside}
    </div>
  );
}

export function FeatureCards({ items, cols = 4 }: { items: { t: string; d?: string }[]; cols?: 2 | 3 | 4 }) {
  const grid = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[cols];
  return (
    <div className={cn('grid gap-5', grid)}>
      {items.map((f) => (
        <div key={f.t} className="xt-reveal xt-lift flex min-h-[150px] flex-col gap-3 rounded-[20px] bg-white p-7">
          <XtsyMark size={26} />
          <h3 className="m-0 text-[19px] font-extrabold">{f.t}</h3>
          {f.d && <p className="m-0 text-[15px] leading-normal text-xt-mute">{f.d}</p>}
        </div>
      ))}
    </div>
  );
}

export function CheckPanel({ title, items, bg = '#FFFFFF', color = '#A12444', icon = 'check' }: { title: string; items: string[]; bg?: string; color?: string; icon?: 'check' | 'shield' | 'heart' }) {
  const path = {
    check: 'M5 12l5 5 9-10',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M8.5 12l2.5 2.5 4.5-5',
    heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  }[icon];
  return (
    <div className="xt-reveal flex flex-col gap-5 rounded-[28px] p-8 sm:p-12" style={{ background: bg }}>
      <div className="xt-eyebrow text-[16px] sm:text-[18px]" style={{ color }}>{title}</div>
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {items.map((s) => (
          <li key={s} className="flex items-center gap-3.5 text-[17px] font-bold sm:text-[18px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0"><path d={path} /></svg>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PhotoRow({ photos }: { photos: { src?: string; alt: string; tone?: 'sand' | 'slate' | 'crimson' | 'pine' | 'night' }[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {photos.map((p) => (
        <Photo key={p.alt} src={p.src} alt={p.alt} tone={p.tone} className="xt-reveal aspect-[421/320] rounded-3xl" />
      ))}
    </div>
  );
}

export function StatRow({ stats }: { stats: { v: string; l: string }[] }) {
  return (
    <div className="xt-reveal grid grid-cols-2 border-y-[1.5px] border-xt-ink lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.l} className="flex flex-col gap-1.5 border-r border-xt-line px-5 py-7 last:border-r-0 sm:px-7 sm:py-8">
          <span className="font-display text-[40px] leading-none text-xt-crimson sm:text-[56px]">{s.v}</span>
          <span className="text-[14px] font-bold text-xt-mute sm:text-[15px]">{s.l}</span>
        </div>
      ))}
    </div>
  );
}

export interface PriceCard {
  t: string;
  price: string;
  per?: string;
  text?: string;
  inc?: string[];
  hot?: boolean;
  badge?: string;
  cta: ReactNode;
}

export function PriceCards({ cards }: { cards: PriceCard[] }) {
  return (
    <div className={cn('grid items-stretch gap-6', cards.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
      {cards.map((p) => (
        <div key={p.t} className={cn('xt-reveal xt-lift relative flex flex-col gap-4 rounded-[28px] p-8 sm:p-10', p.hot ? 'bg-xt-ink text-xt-paper' : 'bg-white')}>
          {p.badge && <span className="absolute right-6 top-6 rounded-full bg-xt-crimson px-3 py-1.5 text-[12px] font-extrabold tracking-wider text-white">{p.badge}</span>}
          <h3 className="m-0 text-[22px] font-extrabold">{p.t}</h3>
          <span className="font-display text-[56px] leading-[0.9] sm:text-[64px]">{p.price}</span>
          {p.per && <span className={cn('text-[15px]', p.hot ? 'text-[#A3ABC2]' : 'text-xt-mute')}>{p.per}</span>}
          {p.text && <p className={cn('m-0 text-[15px] leading-normal', p.hot ? 'text-xt-fog' : 'text-xt-mute')}>{p.text}</p>}
          {p.inc && (
            <ul className={cn('m-0 flex list-none flex-col gap-2.5 border-t p-0 pt-4', p.hot ? 'border-[#383D52]' : 'border-xt-line')}>
              {p.inc.map((i) => (
                <li key={i} className="flex gap-2.5 text-[15px]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.hot ? '#E07A8B' : '#A12444'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0"><path d="M5 12l5 5 9-10" /></svg>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto pt-2">{p.cta}</div>
        </div>
      ))}
    </div>
  );
}

/** Accordion FAQ with FAQPage structured data. */
export function FaqList({ faqs, schema = true, title = 'Good to know' }: { faqs: { q: string; a: string }[]; schema?: boolean; title?: ReactNode }) {
  const [open, setOpen] = useState(0);
  return (
    <section className={cn(PAD, 'grid gap-8 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20')}>
      {schema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          })}</script>
        </Helmet>
      )}
      <h2 className="xt-reveal xt-display m-0 text-[48px] leading-[0.95] sm:text-[64px] lg:col-span-4">{title}</h2>
      <div className="flex flex-col gap-2.5 lg:col-span-8">
        {faqs.map((f, i) => (
          <div key={f.q} className="xt-reveal overflow-hidden rounded-[18px] bg-white">
            <h3 className="m-0 text-[17px]">
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 bg-transparent px-6 py-5 text-left text-[17px] font-extrabold text-xt-ink">
                <span>{f.q}</span>
                <span aria-hidden="true" className="text-[26px] font-normal text-xt-crimson">{open === i ? '−' : '+'}</span>
              </button>
            </h3>
            {/* Closed answers stay in the HTML (visually hidden) so crawlers and AI assistants can read them. */}
            <p className={open === i ? 'm-0 px-6 pb-5 text-[16px] leading-relaxed text-xt-mute' : 'sr-only'}>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SplitFeature({ media, children, reverse, className, style }: { media: ReactNode; children: ReactNode; reverse?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <section className={cn(PAD, 'grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24', className)} style={style}>
      <div className={cn('xt-reveal', reverse && 'lg:order-2')}>{media}</div>
      <div className="xt-reveal flex flex-col gap-5">{children}</div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className={cn(PAD, 'pt-5 text-[13px] font-bold text-xt-mute')}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1.5">
            {it.to ? <Link to={it.to} className="inline-block py-2 hover:text-xt-crimson">{it.label}</Link> : <span aria-current="page" className="text-xt-ink">{it.label}</span>}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
