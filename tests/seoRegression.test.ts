/**
 * SEO REGRESSION TESTS
 * --------------------
 * These tests are the safety net that prevents stale prices, fake review
 * schema on informational pages, or hreflang spam from sneaking back into
 * the build.
 *
 * If any of these tests fail, DO NOT merge — fix the offending file first.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');
// '₹450' was removed from this list on 30 Oct 2026. It used to be a stale dorm rate, but it is
// now a live approved figure — the Experience by XTSY decoration GST (₹2,500 + ₹450) — and it also
// occurs legitimately in Guwahati–Shillong bus fares and third-party homestay ranges. A bare
// amount cannot tell those apart from a stale room rate, so matching on it only produced noise.
// Room rates are guarded properly below, by comparing the live sources against each other.
const STALE_PRICE_TOKENS = ['₹269', '₹2,099', '₹8,500', '499 - ₹4,999', '450 - ₹8,500'];
const CANONICAL_PRICE_RANGE = '₹399 - ₹5,999';

function readSrcFiles(): { file: string; content: string }[] {
  const out: { file: string; content: string }[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', 'dist', '__tests__', 'test'].includes(entry.name)) continue;
        walk(p);
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        // Skip the rate canonical file itself
        if (p.endsWith('rateSanityCheck.ts')) continue;
        out.push({ file: path.relative(ROOT, p), content: fs.readFileSync(p, 'utf-8') });
      }
    }
  };
  walk(path.join(ROOT, 'src'));
  return out;
}

describe('SEO regression: stale prices', () => {
  const files = readSrcFiles();
  // Files with legitimate non-room price references (menu items, vehicle
  // rentals, third-party hostel comparison ranges, total trip budgets).
  const ALLOWED_NON_ROOM_PRICES = new Set([
    'src/data/tabBistroMenu.ts',
    'src/data/seoPagesExpansion.ts',   // Honda Dio scooter at ₹450/day
    'src/data/seoPillarPages.ts',      // Competitor hostel comparison ranges
    'src/data/seoPages.ts',            // ₹8,500 trip budget total
    'src/pages/destinations/BlogBudgetTrip.tsx', // Budget range narrative
    'src/pages/HotelsInShillong.tsx',  // Hotel category description ranges
  ]);

  for (const token of STALE_PRICE_TOKENS) {
    it(`no source file contains stale price token "${token}"`, () => {
      const offenders = files
        .filter(f => f.content.includes(token))
        .filter(f => !ALLOWED_NON_ROOM_PRICES.has(f.file.replace(/\\/g, '/')))
        .map(f => f.file);
      expect(offenders, `Stale price "${token}" found in: ${offenders.join(', ')}`).toEqual([]);
    });
  }
});

// Until 30 Oct 2026 the two describes here read index.html, src/pages/seo/ProgrammaticSEOPage.tsx
// and scripts/prerender.ts. index.html no longer exists — the site is server-rendered through
// src/server.ts — and the other two are unreferenced dead files: programmatic pages now render
// via src/routes/$slug.tsx -> ProgrammaticV2, with JSON-LD from src/lib/seo/programmaticSeo.ts.
// So the assertions guarded nothing, and the readFileSync on index.html threw at collection time,
// which took the whole file down. Rewritten against the code that actually serves the site.
describe('SEO regression: programmatic JSON-LD', () => {
  it('never attaches aggregateRating to a programmatic page', async () => {
    const { ALL_SEO_PAGES }: any = await import('../src/data/seoPages');
    const { schemaFor }: any = await import('../src/lib/seo/programmaticSeo');
    // A rating belongs to the property, not to a guide about a waterfall. Google treats
    // self-serving ratings on non-property pages as a structured-data violation.
    const offenders = ALL_SEO_PAGES
      .filter((p: any) => JSON.stringify(schemaFor(p)).includes('aggregateRating'))
      .map((p: any) => p.slug);
    expect(offenders).toEqual([]);
  });

  it('publishes one consistent, non-stale priceRange across every programmatic page', async () => {
    const { ALL_SEO_PAGES }: any = await import('../src/data/seoPages');
    const { schemaFor }: any = await import('../src/lib/seo/programmaticSeo');
    // schemaFor() returns a single @context wrapper whose '@graph' holds the real nodes, so the
    // priceRange lives one level down. Reading it off the wrapper found nothing and the
    // greater-than-zero guard below is what caught that, which is the reason it is here.
    const found = new Set<string>();
    for (const page of ALL_SEO_PAGES) {
      for (const wrapper of schemaFor(page)) {
        for (const node of ((wrapper as any)['@graph'] ?? [wrapper]) as any[]) {
          const range = node?.priceRange;
          if (typeof range === 'string' && range.includes('₹') && range.includes('-')) found.add(range);
        }
      }
    }
    // Guards against a vacuous pass if the Hostel schema branch ever stops emitting a range.
    expect(found.size).toBeGreaterThan(0);
    expect([...found]).toEqual([CANONICAL_PRICE_RANGE]);
  });

  it('agrees with the site-wide Hostel schema', async () => {
    const mod: any = await import('../src/data/siteSchemas');
    const ranges = JSON.stringify(mod).match(/₹[\d,]+ - ₹[\d,]+/g) ?? [];
    expect(ranges).toContain(CANONICAL_PRICE_RANGE);
  });
});

// The old assertion here was a magic number: "≤ 250 slugs". It was written when the catalogue
// had just been pruned to 250, and PER_CATEGORY_CAP has since been retuned to land nearer ~500,
// so the number no longer described the policy it was meant to protect — it would simply have
// failed on the next page anyone added. These assertions check the invariant instead: no cluster
// may exceed its own cap, and the total cannot exceed what the caps allow. Adding a page inside
// the caps is fine; a cluster quietly dominating the sitemap is not.
describe('SEO regression: page volume', () => {
  it('no category exceeds its own PER_CATEGORY_CAP', async () => {
    const mod: any = await import('../src/data/seoPages');
    const filter: any = await import('../src/data/seoQualityFilter');
    const counts = new Map<string, number>();
    for (const page of mod.ALL_SEO_PAGES) {
      if (filter.ALWAYS_KEEP_SLUGS.has(page.slug)) continue;
      counts.set(page.category, (counts.get(page.category) ?? 0) + 1);
    }
    const over = [...counts].filter(([cat, n]) => n > (filter.PER_CATEGORY_CAP[cat] ?? 50))
      .map(([cat, n]) => `${cat}=${n}/${filter.PER_CATEGORY_CAP[cat] ?? 50}`);
    expect(over).toEqual([]);
  });

  it('the catalogue stays within the budget the caps describe, and is not empty', async () => {
    const mod: any = await import('../src/data/seoPages');
    const filter: any = await import('../src/data/seoQualityFilter');
    const budget = Object.values(filter.PER_CATEGORY_CAP as Record<string, number>)
      .reduce((a, b) => a + b, 0) + filter.ALWAYS_KEEP_SLUGS.size;
    expect(mod.ALL_SEO_PAGES.length).toBeGreaterThan(150);
    expect(mod.ALL_SEO_PAGES.length).toBeLessThanOrEqual(budget);
  });

  it('every retained page belongs to a high-quality category', async () => {
    const mod: any = await import('../src/data/seoPages');
    const filter: any = await import('../src/data/seoQualityFilter');
    const offenders = mod.ALL_SEO_PAGES.filter(
      (p: any) =>
        !filter.HIGH_QUALITY_CATEGORIES.has(p.category) &&
        !filter.ALWAYS_KEEP_SLUGS.has(p.slug),
    );
    expect(offenders.map((o: any) => o.slug)).toEqual([]);
  });
});

describe('SEO regression: rateSanityCheck integrity', () => {
  it('exposes the canonical Shillong rates', async () => {
    const mod: any = await import('../src/utils/rateSanityCheck');
    // Owner-approved rates. The old 4999 / 329 figures here contradicted the live table.
    expect(mod.SHILLONG_CANONICAL_RATES['xtsy-270']).toBe(5999);
    expect(mod.SHILLONG_CANONICAL_RATES['king-double-room']).toBe(2399);
    expect(mod.SHILLONG_CANONICAL_RATES['8-bed-mixed-dorm']).toBe(399);
    expect(mod.SHILLONG_CANONICAL_RATES['6-bed-mixed-dorm']).toBe(499);
    expect(mod.SHILLONG_CANONICAL_RATES['4-bed-female-only-dorm']).toBe(599);
  });
});


describe('SEO regression: budget hostel canonical migration', () => {
  it('uses the budget wording and canonical route for the hostel hub', async () => {
    const { stayHubCopy } = await import('../src/data/stayHub');
    const copy = stayHubCopy('budget');
    expect(copy.path).toBe('/budget-hostels-shillong');
    expect(copy.h1.toLowerCase()).toContain('budget');
    expect(copy.keywords.toLowerCase()).not.toContain('cheap');
  });

  it('redirects legacy hostel slugs to the canonical budget hub', async () => {
    const { RECOVERY_REDIRECTS } = await import('../src/data/seoAffectedSlugs');
    expect(RECOVERY_REDIRECTS['cheap-hostel-shillong']).toBe('/budget-hostels-shillong');
    expect(RECOVERY_REDIRECTS['cheap-hostel-in-shillong']).toBe('/budget-hostel-in-shillong');
    expect(RECOVERY_REDIRECTS['cheap-hostels-shillong']).toBe('/budget-hostels-shillong');
    expect(RECOVERY_REDIRECTS['budget-hostel-shillong']).toBe('/budget-hostels-shillong');
    expect(RECOVERY_REDIRECTS['remote-work-stay-shillong']).toBe('/work-from-home');
  });

  it('does not publish a singular budget-hostel duplicate page', async () => {
    const { ALL_SEO_PAGES } = await import('../src/data/seoPages');
    expect(ALL_SEO_PAGES.some(page => page.slug === 'budget-hostel-shillong')).toBe(false);
  });


  it('maps click-positive legacy GSC URLs to relevant canonical destinations', async () => {
    const { RECOVERY_REDIRECTS } = await import('../src/data/seoAffectedSlugs');
    expect(RECOVERY_REDIRECTS['monthly-stay-mizoram']).toBe('/destinations/mizoram');
    expect(RECOVERY_REDIRECTS['remote-work-stay-nongjrong']).toBe('/destinations/meghalaya/shillong/nongjrong-sunrise-viewpoint');
    expect(RECOVERY_REDIRECTS['remote-work-stay-dawki']).toBe('/destinations/meghalaya/dawki');
    expect(RECOVERY_REDIRECTS['bike-tour-package-nagaland']).toBe('/expeditions/motorbike/guwahati-to-kohima');
    expect(RECOVERY_REDIRECTS['school-tour-mizoram']).toBe('/group-bookings-meghalaya');
    expect(RECOVERY_REDIRECTS['self-drive-itinerary-shillong']).toBe('/xtsy-rentals');
    expect(RECOVERY_REDIRECTS['family-tour-tawang']).toBe('/destinations/arunachal-pradesh/tawang');
    expect(RECOVERY_REDIRECTS['photography-tour-tripura']).toBe('/destinations/tripura');
  });


  it('migrates generated cheap-intent URLs to budget slugs and preserves 301s', async () => {
    const { generateIntentStaySlugs } = await import('../scripts/generate-seo-slugs');
    const slugs = generateIntentStaySlugs();
    expect(slugs).toContain('budget-hostel-in-shillong');
    expect(slugs).not.toContain('cheap-hostel-in-shillong');
    expect(slugs).toContain('budget-stay-in-shillong');
    expect(slugs).not.toContain('cheap-budget-stay-in-shillong');
    const { RECOVERY_REDIRECTS } = await import('../src/data/seoAffectedSlugs');
    expect(RECOVERY_REDIRECTS['cheap-hostel-in-shillong']).toBe('/budget-hostel-in-shillong');
    expect(RECOVERY_REDIRECTS['cheap-hotel-in-gangtok']).toBe('/budget-hotel-in-gangtok');
    expect(RECOVERY_REDIRECTS['cheap-car-rental-shillong']).toBe('/budget-car-rental-shillong');
  });


  it('renders generated budget-intent pages with the right city and stay labels', async () => {
    const { buildIntentStayPage } = await import('../src/data/seoPageFactory');
    const page = buildIntentStayPage('budget-hostel-in-shillong');
    expect(page.slug).toBe('budget-hostel-in-shillong');
    expect(page.title).toContain('Budget-friendly Hostel in Shillong');
    expect(page.h1).toBe('Budget-friendly Hostel in Shillong');
    expect(page.category).toBe('hostels');
  });

  it('registers public static pages and data-driven expedition routes for sitemap generation', async () => {
    const { STATIC_ROUTES } = await import('../src/utils/seoSlugRegistry');
    for (const route of ['/contact', '/guides', '/catering-shillong', '/meghalaya-festivals', '/partner-stays', '/backpacking-india', '/places-to-visit-in-meghalaya', '/travel-guide/guwahati-to-shillong-transport', '/travel-guide/how-to-reach-meghalaya', '/travel-guide/meghalaya-for-international-tourists', '/budget-hostels-shillong']) {
      expect(STATIC_ROUTES).toContain(route);
    }
    expect(STATIC_ROUTES).toContain('/expeditions/motorbike/guwahati-to-shillong');
    expect(STATIC_ROUTES).toContain('/expeditions/4x4/guwahati-to-shillong');
  });

  it('publishes only the canonical budget hub in static sitemap data', () => {
    const sitemap = fs.readFileSync(path.join(ROOT, 'public/sitemap-static.xml'), 'utf-8');
    expect(sitemap).toContain('https://xtsy.one/budget-hostels-shillong');
    expect(sitemap).not.toContain('https://xtsy.one/cheap-hostels-shillong');
  });

  it('does not advertise retired dining URLs in the sitemap', () => {
    const sitemap = fs.readFileSync(path.join(ROOT, 'public/sitemap-dining.xml'), 'utf-8');
    expect(sitemap).not.toContain('https://xtsy.one/barbeque-restaurant-shillong');
    expect(sitemap).not.toContain('https://xtsy.one/live-music-restaurant-shillong');
  });

  it('does not ship the shared rooftop café coming-soon claim', () => {
    const sharedBlock = fs.readFileSync(path.join(ROOT, 'src/components/seo/StayEatExplore.tsx'), 'utf-8');
    const diningPages = fs.readFileSync(path.join(ROOT, 'src/data/seoPagesDiningExpansion.ts'), 'utf-8');
    expect(sharedBlock.toLowerCase()).not.toContain('coming soon');
    expect(diningPages.toLowerCase()).not.toContain('coming soon');
  });
});
