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
import fs from 'node:fs';
import path from 'node:path';

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
  // Confirmed by the owner 31 Oct 2026: XTSY hosts bonfires and private parties, not live
  // music. The Laitumkhrah cafes do, which is why the city guides are exempt from this.
  [/live (music|band|gig)/i, 'XTSY does not host live music'],
];

/**
 * Guides to eating in Shillong. These survey the CITY and name other places by
 * speciality — the jadoh stalls at Iewduh, the momo counters and street food
 * around Police Bazaar, the cafes in Laitumkhrah. All of that is true, useful
 * to a reader, and must not be scrubbed just to satisfy a keyword filter.
 *
 * The rule being enforced is narrower than "never say the word": TAB BISTRO
 * must not claim these dishes as its own. Any page not on this list is
 * speaking in TAB Bistro's voice, so a mention there is a claim and fails.
 *
 * Hours are checked on every page regardless, because an opening time is
 * always a statement about TAB Bistro.
 */
const CITY_GUIDES = new Set([
  'khasi-food-guide',
  'street-food-police-bazar',
  'best-restaurants-shillong',
  'best-place-to-eat-in-shillong',
  'places-to-eat-in-shillong',
  'good-restaurants-in-shillong',
  'best-food-in-shillong',
  'best-food-places-in-shillong',
  'where-to-eat-in-shillong',
  'top-restaurants-in-shillong',
  'famous-restaurants-in-shillong',
  'restaurants-in-laitumkhrah',
  'restaurants-in-police-bazar-shillong',
  // A ranked guide to twelve Shillong cafes by name, with their prices and hours.
  'cafes-in-shillong',
  // Surveys where vegetarians eat in Shillong. Its "Top Veg Restaurants" list names
  // categories of other venues — pure-veg thali houses, pizza and pasta spots — with
  // TAB Bistro as one entry among them, not as the thing serving thali or pizza.
  'best-veg-restaurants-shillong',
]);

async function allRestaurantPages() {
  const { ALL_SEO_PAGES }: any = await import('../src/data/seoPages');
  return ALL_SEO_PAGES.filter((p: any) => p.category === 'restaurants' || p.schemaType === 'Restaurant');
}

/** Pages speaking in TAB Bistro's own voice. */
async function restaurantPages() {
  return (await allRestaurantPages()).filter((p: any) => !CITY_GUIDES.has(p.slug));
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
    for (const page of await allRestaurantPages()) {
      const text = JSON.stringify([page.metaDescription, page.intro, page.sections, page.faqs, page.quickAnswer]);
      if (stale.some((t) => text.includes(t))) offenders.push(page.slug);
    }
    expect(BISTRO_BREAKFAST.label).toBe('8:45 AM – 12 PM');
    expect(offenders).toEqual([]);
  });
});

/**
 * The SEO registry is not the whole site. The homepage and the /tab-bistro
 * components are hand-written React, so nothing above looks at them — and that
 * is where the worst of it was: the homepage advertised "wood-fired pizzas ...
 * and Thai plates", /tab-bistro targeted the keyword "pizza in shillong", and
 * XTSY Specials carried whole showcase cards for Thai & Pan-Asian, Fish &
 * Chips with Schnitzel, and Seafood & Sizzlers. None of it exists.
 *
 * These files are checked as source text, which is blunt but right for them:
 * they speak only for TAB Bistro, so there is no city-guide case to allow.
 */
const BISTRO_SOURCES = [
  'src/components/v2/home/HomeSections.tsx',
  'src/pages/TabBistro.tsx',
  'src/components/tab-bistro/TabBistroSpecials.tsx',
  'src/components/tab-bistro/TabBistroFAQ.tsx',
  'src/components/tab-bistro/TabBistroFaqHub.tsx',
  'src/components/tab-bistro/TabBistroBreakfast.tsx',
  'src/components/tab-bistro/TabBistroMenu.tsx',
];

describe('the homepage and TAB Bistro components claim only real dishes', () => {
  for (const file of BISTRO_SOURCES) {
    it(`${file} names nothing that is not on the menu`, () => {
      const full = path.resolve(__dirname, '..', file);
      // A missing file must fail loudly rather than silently pass.
      expect(fs.existsSync(full), `${file} not found — update BISTRO_SOURCES`).toBe(true);
      const src = fs.readFileSync(full, 'utf-8');
      const found = NOT_ON_THE_MENU
        .filter(([pattern]) => pattern.test(src))
        .map(([pattern, why]) => `${pattern.source} (${why})`);
      expect(found).toEqual([]);
    });
  }
});
