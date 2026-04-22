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
const STALE_PRICE_TOKENS = ['₹450', '₹269', '₹2,099', '₹8,500', '499 - ₹4,999', '450 - ₹8,500'];
const CANONICAL_PRICE_RANGE = '₹329 - ₹4,999';

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

describe('SEO regression: index.html meta', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');

  it('homepage meta description uses canonical dorm price (₹329)', () => {
    expect(html).toMatch(/dorms from ₹329/i);
    expect(html).not.toMatch(/dorms from ₹450/i);
  });

  it('Hostel JSON-LD priceRange is canonical', () => {
    expect(html).toContain(`"priceRange":"${CANONICAL_PRICE_RANGE}"`);
  });

  it('hreflang has been pruned to canonical alternates only', () => {
    const hreflangCount = (html.match(/rel="alternate" hreflang=/g) || []).length;
    // We expect only en, en-IN, x-default (3 entries)
    expect(hreflangCount).toBeLessThanOrEqual(5);
  });

  it('does not declare unsupported language hreflangs (fr/de/ja/etc)', () => {
    expect(html).not.toMatch(/hreflang="(fr|de|es|ja|ko|zh|ru|ar|pt)"/);
  });
});

describe('SEO regression: schema integrity', () => {
  it('ProgrammaticSEOPage restricts aggregateRating to property routes', () => {
    const src = fs.readFileSync(
      path.join(ROOT, 'src/pages/seo/ProgrammaticSEOPage.tsx'),
      'utf-8',
    );
    // The aggregateRating must be guarded by the isRealProperty check
    expect(src).toMatch(/isRealProperty[\s\S]{0,200}aggregateRating/);
    expect(src).toContain('PROPERTY_ROUTES');
  });

  it('prerender script restricts aggregateRating to property routes', () => {
    const src = fs.readFileSync(path.join(ROOT, 'scripts/prerender.ts'), 'utf-8');
    expect(src).toContain('PROPERTY_ROUTES');
    expect(src).toMatch(/PROPERTY_ROUTES\.has\(page\.slug\)/);
  });

  it('canonical price range is consistent between index.html and ProgrammaticSEOPage', () => {
    const page = fs.readFileSync(
      path.join(ROOT, 'src/pages/seo/ProgrammaticSEOPage.tsx'),
      'utf-8',
    );
    expect(page).toContain('₹329 - ₹4,999');
    expect(page).not.toContain('₹450 - ₹8,500');
  });
});

describe('SEO regression: page volume', () => {
  it('ALL_SEO_PAGES is pruned to ≤ 250 high-quality slugs', async () => {
    const mod: any = await import('../src/data/seoPages');
    expect(mod.ALL_SEO_PAGES.length).toBeGreaterThan(150);
    expect(mod.ALL_SEO_PAGES.length).toBeLessThanOrEqual(250);
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
    expect(mod.SHILLONG_CANONICAL_RATES['xtsy-270']).toBe(4999);
    expect(mod.SHILLONG_CANONICAL_RATES['king-double-room']).toBe(2399);
    expect(mod.SHILLONG_CANONICAL_RATES['8-bed-mixed-dorm']).toBe(329);
  });
});
