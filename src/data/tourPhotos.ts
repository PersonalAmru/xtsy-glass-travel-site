/**
 * Reviewed photographs for tour cards, expedition routes and destination guides
 * that have no XTSY / XTSY Voyage photo of their own. Every photo was checked on
 * a contact sheet to show the actual place or activity (see scripts/images/).
 */
import { PEXELS_PHOTOS, type PexelsPhoto } from './pexelsPhotos';
import { IMG } from './v2Images';

const main = (p: PexelsPhoto): string => (p.srcs?.find(([w]) => w >= 1280) ?? p.srcs?.[p.srcs.length - 1])?.[1] ?? '';

/** Couple packages use different photos of the real Experience by XTSY suite. */
const SUITE_TOURS: Record<string, number> = { 'tour-601': 1, 'tour-602': 2, 'tour-603': 3, 'sig-6d-meghalaya-honeymoon-package': 4 };

/**
 * New tours that show an existing reviewed photo of the same place until they get their own
 * (scripts/images/photoTargets.ts lists them for the next Pexels run).
 */
const SHARED_PHOTOS: Record<string, string> = {
  'tour-75': 'tour-71', // Alleppey houseboat
  'tour-76': 'tour-73', // Periyar lake, on the Classic Kerala route
  'tour-66': 'tour-64', // Kullu valley, on the Shimla–Manali route
  'tour-85': 'tour-83', // Kodaikanal lake
  'tour-87': 'tour-84', // Shore Temple, Mahabalipuram
  'tour-91': 'tour-82', // Brihadeeswarar Temple, Thanjavur
  'tour-92': 'tour-81', // Srirangam, on the Pancha Bhoota route
};

/** Photo URL for a target key (e.g. "tour-29", "sig-5n-6d-tawang-tour", "exp-guwahati-to-tawang", "dest-siju-cave"), or ''. */
export function reviewedPhoto(key: string): string {
  const p = PEXELS_PHOTOS[key] ?? PEXELS_PHOTOS[SHARED_PHOTOS[key] ?? ''];
  if (p) return main(p);
  if (key in SUITE_TOURS) return IMG.suite[SUITE_TOURS[key]] ?? IMG.suite[0] ?? '';
  return '';
}

/** Alt text for a reviewed photo (the photographer's own description), if any. */
export const reviewedAlt = (key: string): string | undefined => (PEXELS_PHOTOS[key] ?? PEXELS_PHOTOS[SHARED_PHOTOS[key] ?? ''])?.alt || undefined;

/** Credit for a Pexels photo shown on the page, or null for XTSY's own photos. */
export function photoCredit(key: string): { name: string; url: string; pexelsUrl: string } | null {
  const p = PEXELS_PHOTOS[key] ?? PEXELS_PHOTOS[SHARED_PHOTOS[key] ?? ''];
  return p ? { name: p.photographer, url: p.photographerUrl, pexelsUrl: p.pexelsUrl } : null;
}
