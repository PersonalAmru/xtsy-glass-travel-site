/**
 * /gallery — real photos only (redesign): rooms, the property, Experience by
 * XTSY, TAB Bistro, the Dawki partner campsite and XTSY Voyage destinations.
 */
import { useEffect, useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { ROOM_IMAGES } from '@/config/roomTypes';
import { CDN_IMAGE_MAP } from '@/data/cdnImages';
import { PageShell, PAD } from '@/components/v2/blocks';
import { SpinningMark } from '@/components/v2/primitives';

type Shot = { src: string; alt: string; cat: string };

function buildShots(): Shot[] {
  const out: Shot[] = [];
  const add = (cat: string, label: string, list: string[]) => list.forEach((src, i) => out.push({ src, cat, alt: `${label} ${i + 1}` }));
  add('suite', 'Experience by XTSY', ROOM_IMAGES['xtsy-270'] ?? []);
  add('rooms', 'King Double room', ROOM_IMAGES['king-double-room'] ?? []);
  add('rooms', '4-bed female-only dorm', ROOM_IMAGES['4-bed-female-only-dorm'] ?? []);
  add('rooms', '6-bed mixed dorm', ROOM_IMAGES['6-bed-mixed-dorm'] ?? []);
  const entries = Object.entries(CDN_IMAGE_MAP);
  add('property', 'XTSY Travellers Hostel', entries.filter(([k]) => k.startsWith('xtsy/Property')).map(([, v]) => v));
  add('bistro', 'TAB Bistro by XTSY', entries.filter(([k]) => k.startsWith('xtsy/TAB Bistro')).map(([, v]) => v));
  add('camp', 'Dawki partner campsite', entries.filter(([k]) => k.startsWith('xtsy-adventure-campsite/')).map(([, v]) => v));
  entries.filter(([k]) => k.startsWith('xtsyvoyage/')).forEach(([k, v]) => out.push({ src: v, cat: 'trips', alt: k.replace('xtsyvoyage/', '').replace(/\.[a-z]+$/i, '') }));
  const seen = new Set<string>();
  return out.filter((s) => (seen.has(s.src) ? false : (seen.add(s.src), true)));
}

const CATS = [
  { id: 'all', label: 'All' },
  { id: 'suite', label: 'Experience by XTSY' },
  { id: 'rooms', label: 'Rooms & dorms' },
  { id: 'property', label: 'The hostel' },
  { id: 'bistro', label: 'TAB Bistro' },
  { id: 'camp', label: 'Dawki camping' },
  { id: 'trips', label: 'XTSY Voyage trips' },
];

export default function GalleryV2() {
  const shots = useMemo(buildShots, []);
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState<number | null>(null);
  const list = cat === 'all' ? shots : shots.filter((s) => s.cat === cat);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % list.length));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + list.length) % list.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, list.length]);

  return (
    <>
      <SEOHead
        structuredDataOnly
        title="XTSY Photo Gallery — Hostel, Experience by XTSY & Meghalaya Photos"
        description="Real photos of XTSY Travellers Hostel in New Shillong Township: Experience by XTSY, dorms, private rooms, TAB Bistro, Dawki camping and XTSY Voyage trips."
        canonicalUrl="https://xtsy.one/gallery"
      />
      <PageShell cta={{ title: 'Like what you see?', sub: 'Book direct and save 20–30% vs OTAs.' }}>
        <section className={`${PAD} relative overflow-hidden bg-xt-cream py-16 lg:py-24`}>
          <SpinningMark className="-right-24 -top-24 h-[520px] w-[520px] opacity-[0.06]" />
          <div className="relative flex max-w-3xl flex-col gap-5">
            <div className="xt-in xt-eyebrow text-[15px] sm:text-[18px]">Gallery · {shots.length} real photos</div>
            <h1 className="xt-in xt-d1 xt-display m-0 text-[64px] leading-[0.86] sm:text-[112px]">See it before you sleep here.</h1>
            <p className="xt-in xt-d2 m-0 text-[17px] leading-relaxed text-xt-mute sm:text-[20px]">Every photo here is ours: the hostel in New Shillong Township, Experience by XTSY, TAB Bistro, and trips run with trusted partners.</p>
          </div>
        </section>
        <section className={`${PAD} flex flex-col gap-6 py-12`}>
          <div role="group" aria-label="Filter photos" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {CATS.map((c) => (
              <button key={c.id} type="button" aria-pressed={c.id === cat} onClick={() => setCat(c.id)} className={`xt-chip h-11 shrink-0 rounded-full border-[1.5px] px-5 text-[15px] font-bold ${c.id === cat ? 'border-xt-slate bg-xt-slate text-xt-paper' : 'border-xt-stone text-xt-ink'}`}>
                {c.label}
              </button>
            ))}
          </div>
          <div id="gallery" className="columns-2 gap-4 sm:columns-3 lg:columns-4">
            {list.map((s, i) => (
              <button key={s.src} type="button" onClick={() => setOpen(i)} className="xt-lift mb-4 block w-full overflow-hidden rounded-2xl bg-xt-cream p-0" aria-label={`Open photo: ${s.alt}`}>
                <img src={s.src} alt={s.alt} loading={i < 8 ? 'eager' : 'lazy'} decoding="async" className="block h-auto w-full" />
              </button>
            ))}
          </div>
        </section>
        {open !== null && list[open] && (
          <div role="dialog" aria-modal="true" aria-label={list[open].alt} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4" onClick={() => setOpen(null)}>
            <img src={list[open].src} alt={list[open].alt} className="max-h-[86vh] max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
            <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xt-ink">✕</button>
            <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + list.length) % list.length); }} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xt-ink">‹</button>
            <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % list.length); }} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xt-ink">›</button>
            <p className="absolute bottom-4 left-0 right-0 m-0 text-center text-[14px] text-white/80">{list[open].alt}</p>
          </div>
        )}
      </PageShell>
    </>
  );
}
