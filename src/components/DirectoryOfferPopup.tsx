import { memo, useEffect, useState } from 'react';
import { Link } from '@/lib/router-compat';
import { X, Sparkles, ArrowRight, Star, Clock } from 'lucide-react';
import { getDestinationImageUrl } from '@/data/meghalayaDestinations';

const SESSION_KEY = 'xtsy_dir_offer_dismissed';

// Top-performing pages surfaced inside the offer (image-led, never text-only).
const OFFER_LINKS = [
  { slug: 'meghalaya-travel-guide', label: 'Meghalaya Travel Guide', img: getDestinationImageUrl('mawlynnong-village', 1) },
  { slug: 'places-to-visit-meghalaya', label: '80 Places to Visit', img: getDestinationImageUrl('laitlum-canyons', 2) },
  { slug: 'dawki-umngot-river', label: 'Dawki Crystal River', img: getDestinationImageUrl('dawki-umngot-river', 1) },
];

const DirectoryOfferPopup = memo(() => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ignore */
    }
    t = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Special Meghalaya travel offer"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-border shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={close}
          aria-label="Close offer"
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero */}
        <div className="relative h-40 sm:h-44 overflow-hidden">
          <img
            src={getDestinationImageUrl('nohkalikai-falls', 1)}
            alt="Meghalaya waterfalls"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg">
            <Sparkles className="h-3.5 w-3.5" />
            Limited Season Offer
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 -mt-6 relative">
          <h3 className="text-xl font-bold text-foreground leading-tight">
            Plan Your Meghalaya Trip — Save Up to 20%
          </h3>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-primary fill-primary" /> 4.8 · 161 verified reviews
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Slots filling fast
            </span>
          </div>

          {/* Image link rail */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {OFFER_LINKS.map(l => (
              <Link
                key={l.slug}
                to={`/${l.slug}`}
                onClick={close}
                className="group relative aspect-square rounded-xl overflow-hidden border border-border/50"
              >
                <img
                  src={l.img}
                  alt={l.label}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] font-medium text-white leading-tight line-clamp-2">
                  {l.label}
                </span>
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-5 flex gap-2.5">
            <Link
              to="/book"
              onClick={close}
              className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[48px] px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Claim Offer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/tours"
              onClick={close}
              className="inline-flex items-center justify-center min-h-[48px] px-4 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
            >
              View Tours
            </Link>
          </div>
          <button
            onClick={close}
            className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
});
DirectoryOfferPopup.displayName = 'DirectoryOfferPopup';

export default DirectoryOfferPopup;
