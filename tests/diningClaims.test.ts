/**
 * Dining claim guard.
 *
 * TAB Bistro's pages are served to Google as Restaurant JSON-LD, and their
 * quickAnswer text is what AI crawlers and featured snippets lift verbatim. So a
 * dish named on one of these pages is, in effect, a menu published under the
 * restaurant's name.
 *
 * Before 30 Oct 2026 roughly a hundred of them advertised food the kitchen has
 * never served — wood-fired pizza, momos, sizzlers, tom yum, thali — and one
 * page described Jadoh, doh khlieh and tungrymbai as TAB Bistro's own, which
 * inverts a deliberate decision not to compete with local Khasi eateries.
 * Nothing caught it because nothing was checking.
 *
 * This checks the restaurant pages against src/data/tabBistroMenu.ts.
 */
import { describe, it, expect } from 'vitest';

/** Phrases that may not appear on a restaurant page: none is on the menu. */
const NOT_ON_THE_MENU: [RegExp, string][] = [
  [/\bpizza\b/i, 'no pizza — the kitchen has no pizza oven'],
  [/\bmomos?\b/i, 'no momos'],
  [/\bsizzlers?\b/i, 'no sizzlers'],
  [/\bthalis?\b/i, 'no thali'],
  [/\btom (yum|kha)\b/i, 'no Thai soups'],
  [/\bthai\b/i, 'no Thai dishes'],
  [/khasi (food|dish|plate|special|cuisine)/i, 'Khasi dishes are deliberately not served'],
  [/\bjadoh\b|\bdoh khlieh\b|\btungrymbai\b/i, 'Khasi dishes are deliberately not served'],
  [/\bfish (curry|fry|and chips|& chips)\b/i, 'no fish — prawns are the only seafood'],
  [/\bidli\b|\bvada\b|\buttapam\b/i, 'not on the South Indian section'],
  [/\bfilter coffee\b/i, 'espresso and cappuccino only'],
  [/\bcold brew\b/i, 'no cold brew'],
  [/\bbruschetta\b|\bgarlic bread\b/i, 'not on the pasta section'],
  [/\bwood-fired\b/i, 'nothing is wood-fired'],
];

/**
 * City-guide pages describe OTHER restaurants in Shillong by name and
 * speciality — momo specialists, Khasi food stalls, cafes with live music.
 * Saying the city has Khasi food stalls is true and useful; the rule being
 * enforced here is that TAB BISTRO must not claim those dishes as its own, so
 * these two are exempt. Anything else that mentions them is making the claim
 * in its own voice.
 */
const CITY_GUIDES = new Set(['top-restaurants-in-shillong', 'famous-restaurants-in-shillong']);

async function restaurantPages() {
  const { ALL_SEO_PAGES }: any = await import('../src/data/seoPages');
  return ALL_SEO_PAGES.filter(
    (p: any) => (p.category === 'restaurants' || p.schemaType === 'Restaurant') && !CITY_GUIDES.has(p.slug),
  );
}

describe('dining pages never advertise food TAB Bistro does not serve', () => {
  it('has restaurant pages to check (guards against a vacuous pass)', async () => {
    expect((await restaurantPages()).length).toBeGreaterThan(10);
  });

  for (const [pattern, why] of NOT_ON_THE_MENU) {
    it(`no restaurant page mentions ${pattern.source} (${why})`, async () => {
      const offenders: string[] = [];
      for (const page of await restaurantPages()) {
        const text = JSON.stringify([
          page.title, page.metaDescription, page.h1, page.intro,
          page.sections, page.faqs, page.quickAnswer, page.keywords,
        ]);
        if (pattern.test(text)) offenders.push(page.slug);
      }
      expect(offenders).toEqual([]);
    });
  }

  it('the retired dining pages are gone from the registry and redirect instead', async () => {
    const { RETIRED_DINING_SLUGS }: any = await import('../src/data/seoPagesDiningExpansion');
    const { RECOVERY_REDIRECTS }: any = await import('../src/data/seoAffectedSlugs');
    const { ALL_SEO_PAGES }: any = await import('../src/data/seoPages');
    const live = new Set(ALL_SEO_PAGES.map((p: any) => p.slug));
    const retired = [...RETIRED_DINING_SLUGS] as string[];
    expect(retired.length).toBeGreaterThan(50);
    // Still indexable — the whole point was to withdraw them.
    expect(retired.filter((s) => live.has(s))).toEqual([]);
    // Dropped from the registry with no target would render a real 404.
    expect(retired.filter((s) => !RECOVERY_REDIRECTS[s])).toEqual([]);
  });

  it('restaurant pages quote the Bistro hours from the single source of truth', async () => {
    const { BISTRO_BREAKFAST }: any = await import('../src/data/tabBistroHours');
    const stale = ['9 AM', '9:00 AM', '11:45 AM', '4:30 PM', '16:30'];
    const offenders: string[] = [];
    for (const page of await restaurantPages()) {
      const text = JSON.stringify([page.metaDescription, page.intro, page.sections, page.faqs, page.quickAnswer]);
      if (stale.some((t) => text.includes(t))) offenders.push(page.slug);
    }
    expect(BISTRO_BREAKFAST.label).toBe('8:45 AM – 12 PM');
    expect(offenders).toEqual([]);
  });
});
