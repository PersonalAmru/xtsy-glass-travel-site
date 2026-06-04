/**
 * Central resolver for uploaded gallery images rehosted on the Lovable CDN.
 *
 * The old codebase referenced a dead Supabase project
 * (oidnydyyjyjfnyadhyzn) and private buckets that cannot be served publicly.
 * All uploaded images now live on the CDN; this module maps the original
 * "bucket/Filename" keys to their public CDN URLs.
 */
import { CDN_IMAGE_MAP } from './cdnImageMap';

const PLACEHOLDER = '/placeholder.svg';

/** Resolve a single "bucket/Filename" key to its CDN URL (falls back to placeholder). */
export function cdn(key: string): string {
  return CDN_IMAGE_MAP[key] ?? PLACEHOLDER;
}

/** Resolve many keys; drops any that don't resolve to a real asset. */
export function cdnMany(keys: string[]): string[] {
  return keys.map((k) => CDN_IMAGE_MAP[k]).filter((u): u is string => Boolean(u));
}

/** True when a key resolves to a real uploaded asset. */
export function hasCdn(key: string): boolean {
  return Boolean(CDN_IMAGE_MAP[key]);
}

export { CDN_IMAGE_MAP };
