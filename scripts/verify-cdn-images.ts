#!/usr/bin/env bun
/**
 * CDN Image Verification (room + panorama)
 *
 * Validates that every CDN-mapped room and panorama image URL referenced by the
 * app resolves to a real asset returning HTTP 200. Run before build/deploy so a
 * dead/stale image link fails CI instead of shipping broken room imagery.
 *
 * Usage:
 *   bun run scripts/verify-cdn-images.ts
 *   BASE_URL=https://xtsy.one bun run scripts/verify-cdn-images.ts
 *
 * BASE_URL defaults to the published app origin. Lovable CDN assets are served
 * from the app origin under /__l5e/assets-v1/...
 */
import { ROOM_IMAGES } from '../src/config/roomTypes';
import { CDN_IMAGE_MAP } from '../src/data/cdnImageMap';

const BASE_URL = (process.env.BASE_URL || 'https://xtsy.one').replace(/\/$/, '');
const CONCURRENCY = 8;

/** Collect the room + panorama image URLs the app actually renders. */
function collectTargets(): { label: string; url: string }[] {
  const targets = new Map<string, string>(); // url -> label

  // 1) Every room/panorama gallery image wired into the UI via ROOM_IMAGES.
  for (const [roomId, urls] of Object.entries(ROOM_IMAGES)) {
    urls.forEach((url, i) => {
      if (url && url !== '/placeholder.svg') {
        targets.set(url, `room:${roomId}[${i}]`);
      }
    });
  }

  // 2) Every panorama (xtsy-270 bucket) entry from the CDN map, even if not yet
  //    surfaced in a gallery, so missing panorama uploads are caught too.
  for (const [key, url] of Object.entries(CDN_IMAGE_MAP)) {
    if (key.startsWith('xtsy-270/') && !targets.has(url)) {
      targets.set(url, `panorama:${key}`);
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
  console.log(`🔍 Verifying ${targets.length} CDN room + panorama images against ${BASE_URL}\n`);

  const results: Awaited<ReturnType<typeof check>>[] = [];
  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const batch = targets.slice(i, i + CONCURRENCY);
    results.push(...(await Promise.all(batch.map(check))));
  }

  const failed = results.filter((r) => !r.ok);
  const passed = results.length - failed.length;

  console.log(`✅ ${passed} OK   ❌ ${failed.length} failed\n`);

  if (failed.length > 0) {
    console.error('❌ FAILED IMAGES:');
    for (const f of failed) {
      console.error(`  [${f.label}] ${f.fullUrl} → ${f.status || 'network error'}${'error' in f && f.error ? ` (${f.error})` : ''}`);
    }
    console.error('\n💥 CDN image verification failed — fix the above before deploying.');
    process.exit(1);
  }

  console.log('🎉 All CDN room + panorama images return HTTP 200.');
}

main().catch((err) => {
  console.error('💥 Verification crashed:', err);
  process.exit(1);
});
