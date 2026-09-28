/**
 * SiteHeader (v2) — sand header with announcement strip, main nav, search,
 * sign-in / account, "Book now" and a full-screen mobile menu.
 */
import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useLocation } from '@/lib/router-compat';
import { useUserAuth } from '@/contexts/UserAuthContext';
import xtsyLogo from '@/assets/xtsy-color-logo.webp';
import { cn } from '@/lib/utils';
import { openTripChat } from './tripChatEvents';
import { XtsyMark, WHATSAPP_DISPLAY, waLink } from './primitives';
import { inr, lowestDormPrice } from './pricing';

const IntelligentSearchOverlay = lazy(() => import('@/components/IntelligentSearchOverlay'));

export const MAIN_NAV = [
  { to: '/best-hostel-in-shillong', label: 'Stays' },
  { to: '/xtsy-270', label: 'Experience by XTSY' },
  { to: '/tours', label: 'Tours' },
  { to: '/tab-bistro', label: 'TAB Bistro' },
  { to: '/work-from-home', label: 'Workation' },
  { to: '/things-to-do-in-meghalaya', label: 'Guides' },
  { to: '/merch', label: 'Merch' },
];

const MENU_GROUPS = [
  {
    title: 'Stay',
    links: [
      { to: '/book', label: 'Book a room' },
      { to: '/xtsy-270', label: 'Experience by XTSY' },
      { to: '/xtsy-adventure-campsite-dawki', label: 'Dawki camping (partner)' },
      { to: '/pet-friendly', label: 'Pet-friendly stays' },
      { to: '/female-travellers', label: 'Women safe stays' },
      { to: '/work-from-home', label: 'Workation' },
    ],
  },
  {
    title: 'Travel',
    links: [
      { to: '/tours', label: 'Tour packages' },
      { to: '/expeditions', label: 'Expeditions' },
      { to: '/group-bookings-meghalaya', label: 'Group bookings' },
      { to: '/xtsy-rentals', label: 'Bike & car rentals' },
      { to: '/plan-trip-with-ai', label: 'Plan a trip with AI' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { to: '/destinations', label: 'Destinations' },
      { to: '/things-to-do-in-meghalaya', label: 'Travel guides' },
      { to: '/meghalaya-waterfalls', label: 'Meghalaya waterfalls' },
      { to: '/gallery', label: 'Gallery' },
    ],
  },
  {
    title: 'XTSY',
    links: [
      { to: '/tab-bistro', label: 'TAB Bistro' },
      { to: '/tab-bistro/catering', label: 'Catering' },
      { to: '/destination-wedding-shillong', label: 'Destination weddings' },
      { to: '/merch', label: 'XTSY merch' },
      { to: '/about', label: 'About us' },
      { to: '/faq', label: 'FAQs' },
      { to: '/contact', label: 'Contact' },
    ],
  },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useUserAuth();
  const location = useLocation();
  const path = location?.pathname ?? '/';

  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const accountLabel = user?.displayName || user?.email?.split('@')[0];

  return (
    <div className="xt sticky top-0 z-50">
      <div className="flex h-9 items-center justify-center gap-3 overflow-hidden bg-xt-slate px-4 text-[12px] font-semibold text-xt-paper sm:h-10 sm:text-[14px]">
        <span className="hidden whitespace-nowrap sm:inline">Book direct and save 20–30% vs OTAs</span>
        <span aria-hidden="true" className="hidden opacity-50 sm:inline">·</span>
        <Link to="/book" className="flex h-full items-center whitespace-nowrap text-xt-paper underline-offset-2 hover:underline">Dorm beds from {inr(lowestDormPrice())}/night</Link>
        <span aria-hidden="true" className="hidden opacity-50 lg:inline">·</span>
        <span className="hidden whitespace-nowrap lg:inline">New Shillong Township, near IIM &amp; NIFT Shillong</span>
      </div>
      <header className="flex h-[68px] items-center justify-between gap-4 border-b border-xt-line bg-xt-sand/95 px-4 backdrop-blur sm:h-[84px] sm:px-8 lg:px-14">
        <Link to="/" aria-label="XTSY home" className="flex min-h-[44px] shrink-0 items-center">
          <img src={xtsyLogo} alt="XTSY" width={120} height={28} className="h-6 w-auto sm:h-7" />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 text-[14px] font-bold xl:flex">
          {MAIN_NAV.map((l) => {
            const active = path === l.to || (l.to !== '/' && path.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap border-b-2 py-1.5 transition-colors hover:text-xt-crimson',
                  active ? 'border-xt-crimson text-xt-crimson' : 'border-transparent text-xt-ink',
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full text-xt-ink hover:bg-xt-cream"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          </button>
          <button
            type="button"
            onClick={() => openTripChat()}
            className="xt-btn hidden h-11 items-center gap-2 whitespace-nowrap rounded-full bg-xt-ink pl-2.5 pr-4 text-[14px] font-bold text-xt-paper lg:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-xt-crimson" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z" /></svg>
            </span>
            Plan with AI
          </button>
          <Link
            to={user ? '/profile' : '/auth'}
            className="hidden h-11 items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-xt-ink px-4 text-[14px] font-bold text-xt-ink md:flex lg:hidden 2xl:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
            <span className="max-w-[120px] truncate">{accountLabel || 'Sign in'}</span>
          </Link>
          <Link to="/book" className="xt-btn flex h-[44px] items-center whitespace-nowrap rounded-full bg-xt-crimson px-5 text-[14px] font-bold text-white hover:text-white">
            Book now
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-xt-slate text-xt-paper"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] overflow-y-auto bg-xt-ink text-xt-paper">
          <div className="flex h-[68px] items-center justify-between px-4 sm:h-[84px] sm:px-8 lg:px-14">
            <span className="flex items-center gap-3">
              <XtsyMark size={32} fill="#BD2E30" />
              <span className="font-display text-[30px] tracking-[0.2em]">XTSY</span>
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-xt-paper text-xt-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <div className="grid gap-10 px-4 pb-16 pt-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-14">
            {MENU_GROUPS.map((g) => (
              <div key={g.title} className="flex flex-col gap-3">
                <div className="font-display text-[18px] tracking-[0.2em] text-xt-rose">{g.title}</div>
                {g.links.map((l) => (
                  <Link key={l.to} to={l.to} className="font-display text-[34px] leading-none text-xt-paper hover:text-xt-rose sm:text-[40px]">
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-4 py-8 sm:px-8 lg:px-14">
            <a href={waLink()} className="flex h-12 items-center rounded-full bg-xt-crimson px-6 font-bold text-white hover:text-white">WhatsApp {WHATSAPP_DISPLAY}</a>
            <Link to={user ? '/profile' : '/auth'} className="flex h-12 items-center rounded-full border-[1.5px] border-xt-paper px-6 font-bold text-xt-paper">
              {accountLabel || 'Sign in'}
            </Link>
            <Link to="/install" className="flex h-12 items-center rounded-full border-[1.5px] border-xt-paper/40 px-6 font-bold text-xt-paper">Install the app</Link>
          </div>
        </div>
      )}

      {searchOpen && (
        <Suspense fallback={null}>
          <IntelligentSearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
