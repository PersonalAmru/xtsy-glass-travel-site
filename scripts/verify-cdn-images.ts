#!/usr/bin/env bun
/**
 * CDN Image Verification (site-wide)
 *
 * Validates that EVERY CDN-mapped image the app can render resolves to a real
 * asset returning HTTP 200. This covers:
 *   - Room + panorama gallery images (ROOM_IMAGES → xtsy / xtsy-270 buckets)
 *   - Dawki campsite gallery images (xtsy-adventure-campsite bucket)
 *   - Destination / SEO hero images (xtsyvoyage bucket)
 *   - Property gallery, TAB Bistro, logos and any other non-room media
 *     present in the centralised CDN map.
 *
 * Any non-200 (or network error) fails the process so a dead/stale image link
 * fails CI/build instead of shipping broken media.
 *
 * Usage:
 *   bun run scripts/verify-cdn-images.ts
 *   BASE_URL=https://xtsy.one bun run scripts/verify-cdn-images.ts
 */
import { ROOM_IMAGES } from '../src/config/roomTypes';
import { CDN_IMAGE_MAP } from '../src/data/cdnImageMap';

const BASE_URL = (process.env.BASE_URL || 'https://xtsy.one').replace(/\/$/, '');
const CONCURRENCY = 8;

/** Human-friendly category for a CDN map key, based on its bucket prefix. */
function categorize(key: string): string {
  if (key.startsWith('xtsy-270/')) return 'panorama';
  if (key.startsWith('xtsy-adventure-campsite/')) return 'dawki';
  if (key.startsWith('xtsyvoyage/')) return 'seo-hero/destination';
  if (key.startsWith('xtsy/TAB Bistro')) return 'tab-bistro';
  if (/^xtsy\/Property Image/i.test(key)) return 'property-gallery';
  if (key.startsWith('xtsy/')) return 'room';
  return 'other';
}

/** Collect every CDN image URL the app can render, with a descriptive label. */
function collectTargets(): { label: string; url: string }[] {
  const targets = new Map<string, string>(); // url -> label

  // 1) Every room/panorama gallery image actually wired into the UI.
  for (const [roomId, urls] of Object.entries(ROOM_IMAGES)) {
    urls.forEach((url, i) => {
      if (url && url !== '/placeholder.svg') {
        targets.set(url, `room:${roomId}[${i}]`);
      }
    });
  }

  // 2) Every entry in the centralised CDN map — Dawki, SEO heroes/destinations,
  //    property gallery, TAB Bistro, logos and any other non-room media.
  for (const [key, url] of Object.entries(CDN_IMAGE_MAP)) {
    if (url && url !== '/placeholder.svg' && !targets.has(url)) {
      targets.set(url, `${categorize(key)}:${key}`);
    }
  }

  return Array.from(targets.entries()).map(([url, label]) => ({ url, label }));
}

function resolve(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

async function check(target: { label: string; url: string }) {
  const fullUrl = resolve(target.url);
  try {
    let res = await fetch(fullUrl, { method: 'HEAD', redirect: 'manual' });
    // Some CDNs don't support HEAD — fall back to a ranged GET.
    if (res.status === 405 || res.status === 501) {
      res = await fetch(fullUrl, { headers: { Range: 'bytes=0-0' }, redirect: 'manual' });
    }
    const ok = res.status >= 200 && res.status < 300;
    return { ...target, fullUrl, status: res.status, ok };
  } catch (err) {
    return { ...target, fullUrl, status: 0, ok: false, error: (err as Error).message };
  }
}

async function main() {
  const targets = collectTargets();
  console.log(`🔍 Verifying ${targets.length} CDN images (room, panorama, Dawki, SEO/destination, property, dining & misc) against ${BASE_URL}\n`);

  const results: Awaited<ReturnType<typeof check>>[] = [];
  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const batch = targets.slice(i, i + CONCURRENCY);
    results.push(...(await Promise.all(batch.map(check))));
  }

  // Per-category summary for quick diagnosis.
  const byCat = new Map<string, { ok: number; fail: number }>();
  for (const r of results) {
    const cat = r.label.split(':')[0];
    const entry = byCat.get(cat) ?? { ok: 0, fail: 0 };
    if (r.ok) entry.ok++; else entry.fail++;
    byCat.set(cat, entry);
  }

  const failed = results.filter((r) => !r.ok);
  const passed = results.length - failed.length;

  console.log('📊 By category:');
  for (const [cat, { ok, fail }] of [...byCat.entries()].sort()) {
    console.log(`   ${fail ? '❌' : '✅'} ${cat}: ${ok} OK${fail ? `, ${fail} failed` : ''}`);
  }
  console.log(`\n✅ ${passed} OK   ❌ ${failed.length} failed\n`);

  if (failed.length > 0) {
    console.error('❌ FAILED IMAGES:');
    for (const f of failed) {
      console.error(`  [${f.label}] ${f.fullUrl} → ${f.status || 'network error'}${'error' in f && f.error ? ` (${f.error})` : ''}`);
    }
    console.error('\n💥 CDN image verification failed — fix the above before deploying.');
    process.exit(1);
  }

  console.log('🎉 All CDN images return HTTP 200.');
}

main().catch((err) => {
  console.error('💥 Verification crashed:', err);
  process.exit(1);
});
