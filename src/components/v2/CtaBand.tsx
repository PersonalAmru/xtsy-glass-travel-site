import { Link } from '@/lib/router-compat';
import { SpinningMark, WHATSAPP_DISPLAY, waLink } from './primitives';

export default function CtaBand({
  title = 'Your bed in the pines is waiting.',
  sub = 'Book direct and save 20–30% vs OTAs. Our team answers on WhatsApp, 24/7.',
  bookTo = '/book',
  bookLabel = 'Book a stay',
}: {
  title?: string;
  sub?: string;
  bookTo?: string;
  bookLabel?: string;
}) {
  return (
    <section className="xt px-4 pb-16 pt-10 sm:px-8 lg:px-16">
      <div className="xt-reveal relative flex flex-col gap-8 overflow-hidden rounded-[32px] bg-xt-crimson px-6 py-12 text-white sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-14">
        <SpinningMark fill="#FFFFFF" className="-right-24 -top-16 h-[420px] w-[420px] opacity-10" />
        <div className="relative flex max-w-[760px] flex-col gap-3.5">
          <h2 className="xt-display m-0 text-[44px] leading-[0.95] sm:text-[64px]">{title}</h2>
          <p className="m-0 text-[17px] leading-relaxed text-[#F7E4E8] sm:text-[18px]">{sub}</p>
        </div>
        <div className="relative flex shrink-0 flex-col gap-3">
          <a href={waLink()} className="xt-btn flex h-14 items-center justify-center gap-2.5 rounded-full bg-xt-paper px-7 text-[16px] font-extrabold text-xt-ink hover:text-xt-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 12z" /></svg>
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
          <Link to={bookTo} className="xt-btn flex h-14 items-center justify-center rounded-full border-[1.5px] border-white px-7 text-[16px] font-extrabold text-white hover:text-white">
            {bookLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
