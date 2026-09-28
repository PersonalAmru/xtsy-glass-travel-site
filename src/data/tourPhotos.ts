/**
 * Reviewed photographs for tour cards, expedition routes and destination guides
 * that have no XTSY / XTSY Voyage photo of their own. Every photo was checked on
 * a contact sheet to show the actual place or activity (see scripts/images/).
 */
import { PEXELS_PHOTOS, type PexelsPhoto } from './pexelsPhotos';
import { IMG } from './v2Images';

const main = (p: PexelsPhoto) => (p.srcs.find(([w]) => w >= 1280) ?? p.srcs[p.srcs.length - 1])[1];

/** The three Experience by XTSY tours use different photos of the real suite. */
const SUITE_TOURS: Record<string, number> = { 'tour-601': 1, 'tour-602': 2, 'tour-603': 3 };

/** Photo URL for a target key (e.g. "tour-29", "sig-5n-6d-tawang-tour", "exp-guwahati-to-tawang", "dest-siju-cave"), or ''. */
export function reviewedPhoto(key: string): string {
  const p = PEXELS_PHOTOS[key];
  if (p) return main(p);
  if (key in SUITE_TOURS) return IMG.suite[SUITE_TOURS[key]] ?? IMG.suite[0] ?? '';
  return '';
}

/** Alt text for a reviewed photo (the photographer's own description), if any. */
export const reviewedAlt = (key: string): string | undefined => PEXELS_PHOTOS[key]?.alt || undefined;

/** Credit for a Pexels photo shown on the page, or null for XTSY's own photos. */
export function photoCredit(key: string): { name: string; url: string; pexelsUrl: string } | null {
  const p = PEXELS_PHOTOS[key];
  return p ? { name: p.photographer, url: p.photographerUrl, pexelsUrl: p.pexelsUrl } : null;
}
