/**
 * Central resolver for uploaded gallery images rehosted on the Lovable CDN.
 *
 * The old codebase referenced a dead Supabase project
 * (oidnydyyjyjfnyadhyzn) and private buckets that cannot be served publicly.
 * All uploaded images now live on the CDN; this module maps the original
 * "bucket/Filename" keys to their public CDN URLs.
 */
import { CDN_IMAGE_MAP } from './cdnImageMap';
import { OPTIMIZED_IMAGES } from './optimizedImages';
import { PEXELS_PHOTOS } from './pexelsPhotos';

const PLACEHOLDER = '/placeholder.svg';

type Opt = { w: number; h: number; srcs: [number, string][] };
const defaultSrc = (o: Opt): string => (o.srcs.find(([w]) => w >= 1280) ?? o.srcs[o.srcs.length - 1])?.[1] ?? '';
/** Look-up by CDN path or by the default WebP path. */
const BY_ANY: Record<string, Opt> = Object.create(null);
for (const [p, o] of Object.entries(OPTIMIZED_IMAGES)) { if (o.srcs.length) { BY_ANY[p] = o; BY_ANY[defaultSrc(o)] = o; } }
// Reviewed Pexels photos (tours, expeditions, destination guides) get the same srcset treatment.
for (const o of Object.values(PEXELS_PHOTOS)) if (o?.srcs?.length) BY_ANY[defaultSrc(o)] = o;

/**
 * The CDN serves the original phone photos (often 2–7 MB). When the optimiser
 * has made WebP versions, hand out the ~1280 px one instead.
 */
const best = (p: string) => (OPTIMIZED_IMAGES[p]?.srcs?.length ? defaultSrc(OPTIMIZED_IMAGES[p]) || p : p);

/** Resolve a single "bucket/Filename" key to its (optimised) URL (falls back to placeholder). */
export function cdn(key: string): string {
  const p = CDN_IMAGE_MAP[key];
  return typeof p === 'string' && p ? best(p) : PLACEHOLDER;
}

/** Resolve many keys; drops any that don't resolve to a real asset. */
export function cdnMany(keys: string[]): string[] {
  return keys.map((k) => CDN_IMAGE_MAP[k]).filter((u): u is string => typeof u === 'string' && Boolean(u)).map(best);
}

/** srcset data for an image URL returned by cdn(), or null if it has no WebP versions. */
export function responsiveImage(src?: string): { src: string; srcSet: string; w: number; h: number } | null {
  const o = src ? BY_ANY[src] : undefined;
  if (!o || !Array.isArray(o.srcs) || !o.srcs.length) return null;
  return { src: defaultSrc(o), srcSet: o.srcs.map(([w, u]) => `${u} ${w}w`).join(', '), w: o.w, h: o.h };
}

/** True when a key resolves to a real uploaded asset. */
export function hasCdn(key: string): boolean {
  return Boolean(CDN_IMAGE_MAP[key]);
}

export { CDN_IMAGE_MAP };

const OURS = /^\/img\/(?:o|px)\/[^\s,]+\.webp$/;
/**
 * AVIF twin of one of our optimised WebP srcsets (every /img/o and /img/px WebP has an .avif
 * next to it — enforced in CI by scripts/audit/check-avif.sh). Null when any entry isn't ours.
 */
export function avifSrcSet(srcSet?: string | null): string | null {
  if (!srcSet) return null;
  const parts = srcSet.split(',').map((p) => p.trim()).filter(Boolean);
  if (!parts.length || !parts.every((p) => OURS.test(p.split(/\s+/)[0]))) return null;
  return parts.map((p) => p.replace(/\.webp(?=\s|$)/, '.avif')).join(', ');
}
export const avifUrl = (src?: string | null): string | null => (src && OURS.test(src) ? src.replace(/\.webp$/, '.avif') : null);
