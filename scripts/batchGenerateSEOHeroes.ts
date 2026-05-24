/**
 * Phase C — Batch generate-seo-hero runs for top commercial slugs.
 *
 * Picks the highest-commercial-intent pages from ALL_SEO_PAGES and POSTs them
 * to the generate-seo-hero edge function. Top tier uses Lovable AI
 * (useAI=true) for premium hero quality; the long tail uses Pexels (free).
 *
 * Usage:
 *   bunx tsx scripts/batchGenerateSEOHeroes.ts            # top 50 with AI
 *   bunx tsx scripts/batchGenerateSEOHeroes.ts --limit 100 --pexels
 *   bunx tsx scripts/batchGenerateSEOHeroes.ts --force    # overwrite cache
 */
import { ALL_SEO_PAGES } from '../src/data/seoPages';
import type { SEOPageData, SEOPageCategory } from '../src/data/seoPages';

const FN_URL = 'https://oidnydyyjyjfnyadhyzn.supabase.co/functions/v1/generate-seo-hero';
const ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZG55ZHl5anlqZm55YWRoeXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDEwNTUsImV4cCI6MjA2NjA3NzA1NX0.olHw9wNl8VNv-nM6heYMDpJJTARy9RxF30tvBfNLZNc';

// Commercial-intent ranking — higher = more revenue per impression.
const CATEGORY_PRIORITY: Partial<Record<SEOPageCategory, number>> = {
  hostels: 100,
  homestays: 95,
  glamping: 92,
  accommodation: 88,
  tours: 85,
  itineraries: 70,
  destinations: 60,
  attractions: 50,
  restaurants: 45,
  'group-tours': 65,
  corporate: 62,
  workation: 55,
  'themed-trips': 50,
  'road-bike-trips': 48,
  seasonal: 40,
};

const args = process.argv.slice(2);
const limitArg = args.indexOf('--limit');
const LIMIT = limitArg >= 0 ? parseInt(args[limitArg + 1], 10) : 50;
const USE_AI = !args.includes('--pexels');
const FORCE = args.includes('--force');

function rank(p: SEOPageData): number {
  return CATEGORY_PRIORITY[p.category] ?? 10;
}

const ranked = [...ALL_SEO_PAGES]
  .sort((a, b) => rank(b) - rank(a))
  .slice(0, LIMIT);

console.log(`Phase C — batching ${ranked.length} slugs (useAI=${USE_AI}, force=${FORCE})`);

async function callOne(p: SEOPageData): Promise<{ slug: string; ok: boolean; source?: string; error?: string }> {
  try {
    const res = await fetch(FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` },
      body: JSON.stringify({
        slug: p.slug,
        title: p.title,
        metaDescription: p.metaDescription,
        category: p.category,
        h1: p.h1 ?? p.title,
        useAI: USE_AI,
        force: FORCE,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { slug: p.slug, ok: false, error: data.error || `HTTP ${res.status}` };
    return { slug: p.slug, ok: true, source: data.source };
  } catch (e) {
    return { slug: p.slug, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

const CONCURRENCY = USE_AI ? 2 : 5; // AI rate limits — keep low
const results: Awaited<ReturnType<typeof callOne>>[] = [];
let cursor = 0;

async function worker(id: number) {
  while (cursor < ranked.length) {
    const i = cursor++;
    const p = ranked[i];
    const t0 = Date.now();
    const r = await callOne(p);
    const ms = Date.now() - t0;
    const tag = r.ok ? `✓ ${r.source}` : `✗ ${r.error}`;
    console.log(`[${i + 1}/${ranked.length}] w${id} ${p.slug.padEnd(50)} ${tag} (${ms}ms)`);
    results.push(r);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));

const ok = results.filter((r) => r.ok).length;
const fail = results.length - ok;
const bySource: Record<string, number> = {};
for (const r of results) if (r.ok && r.source) bySource[r.source] = (bySource[r.source] ?? 0) + 1;

console.log('\n──────── Phase C Summary ────────');
console.log(`OK:     ${ok}/${results.length}`);
console.log(`Fail:   ${fail}`);
console.log(`Source:`, bySource);
if (fail > 0) {
  console.log('\nFailures:');
  for (const r of results.filter((x) => !x.ok)) console.log(`  - ${r.slug}: ${r.error}`);
  process.exit(1);
}
