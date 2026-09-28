/**
 * useIntelligentSearch — Fuse.js powered fuzzy search hook
 * Searches the centralized XTSY index with synonym expansion and categorized results.
 *
 * v3 (2026-07): Fuse.js and the search index are now dynamically imported on the
 * first search call so the homepage bundle no longer pays for them upfront. This
 * shaves ~40 KB gz off the initial JS graph.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  SearchEntry,
  SearchCategory,
} from '@/data/searchIndex';

type FuseType = import('fuse.js').default<SearchEntry>;

// ---- Intent routing: known SEO slugs we want to surface as the top hit
const INTENT_ROUTES: Array<{ match: RegExp; entry: Omit<SearchEntry, 'id'> }> = [
  {
    match: /\b(stay|hostel|hotel|room)\b.*\bdawki\b.*\b(today|tonight|now)\b/i,
    entry: {
      title: 'Stay in Dawki tonight',
      description: 'Same-day riverside camping at XTSY Adventure Campsite',
      category: 'stays',
      icon: '⛺',
      url: '/xtsy-adventure-campsite-dawki',
      price: '₹800',
      location: 'Dawki, Meghalaya',
      keywords: ['stay dawki today', 'dawki tonight', 'last minute dawki'],
    },
  },
  {
    match: /\b(camp|camping|tent)\b.*\bdawki\b|\bdawki\b.*\b(camp|camping|tent)\b/i,
    entry: {
      title: 'Camping in Dawki — XTSY Adventure Campsite',
      description: 'Riverside tents on Umngot · ₹800 only camping · ₹1000 with breakfast',
      category: 'stays',
      icon: '⛺',
      url: '/xtsy-adventure-campsite-dawki',
      price: '₹800',
      location: 'Dawki, Meghalaya',
      keywords: ['camping in dawki', 'dawki camping', 'tent dawki'],
    },
  },
  {
    match: /\bbest\b.*\bcamping\b.*\bdawki\b/i,
    entry: {
      title: 'Best Camping in Dawki',
      description: 'XTSY-rated riverside campsite with verified pricing',
      category: 'stays',
      icon: '🏕️',
      url: '/xtsy-adventure-campsite-dawki',
      price: '₹800',
      location: 'Dawki, Meghalaya',
      keywords: ['best camping dawki'],
    },
  },
  {
    match: /\bthings to do\b.*\bdawki\b/i,
    entry: {
      title: 'Things to do in Dawki',
      description: 'Boat ride, camping, suspension bridge, India–Bangladesh viewpoint',
      category: 'locations',
      icon: '🗺️',
      url: '/dawki-guide',
      location: 'Dawki, Meghalaya',
      keywords: ['things to do dawki', 'dawki itinerary'],
    },
  },
  {
    match: /\b(book|booking)\b.*\bdawki\b/i,
    entry: {
      title: 'Dawki Camping Booking',
      description: 'Book the XTSY Adventure Campsite on WhatsApp',
      category: 'stays',
      icon: '⛺',
      url: '/xtsy-adventure-campsite-dawki',
      price: '₹800',
      location: 'Dawki, Meghalaya',
      keywords: ['dawki booking', 'dawki camping booking'],
    },
  },
];

function resolveIntent(query: string): SearchEntry[] {
  const q = query.trim();
  if (q.length < 3) return [];
  const hits: SearchEntry[] = [];
  INTENT_ROUTES.forEach((r, i) => {
    if (r.match.test(q)) {
      hits.push({ ...r.entry, id: `intent-${i}` });
    }
  });
  return hits;
}

export interface CategorizedResults {
  category: SearchCategory;
  items: SearchEntry[];
}

const FUSE_OPTIONS = {
  keys: [
    { name: 'title' as const, weight: 0.35 },
    { name: 'keywords' as const, weight: 0.3 },
    { name: 'description' as const, weight: 0.15 },
    { name: 'location' as const, weight: 0.1 },
    { name: 'synonyms' as const, weight: 0.1 },
  ],
  threshold: 0.35,
  distance: 120,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
};

// Module-level singletons — resolved lazily, shared across hook instances.
let fusePromise: Promise<{ fuse: FuseType; expand: (q: string) => string; order: readonly SearchCategory[] }> | null = null;
const getFuse = () => {
  if (!fusePromise) {
    fusePromise = Promise.all([
      import('fuse.js'),
      import('@/data/searchIndex'),
    ]).then(([{ default: Fuse }, mod]) => ({
      fuse: new Fuse(mod.getSearchIndex(), FUSE_OPTIONS) as FuseType,
      expand: mod.expandWithSynonyms,
      order: mod.CATEGORY_ORDER,
    }));
  }
  return fusePromise;
};

export function useIntelligentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [categorizedResults, setCategorizedResults] = useState<CategorizedResults[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const search = useCallback(
    async (q: string) => {
      if (!q.trim() || q.trim().length < 2) {
        setResults([]);
        setCategorizedResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      const intentHits = resolveIntent(q);
      const { fuse, expand, order } = await getFuse();
      const expanded = expand(q);
      const fuseResults = fuse.search(expanded, { limit: 20 });
      const fuzzyItems = fuseResults.map((r) => r.item);

      const propertyItems = fuzzyItems.filter(
        (i) => i.id.startsWith('property-') || i.id === 'exp-dawki-campsite',
      );
      const otherItems = fuzzyItems.filter(
        (i) => !i.id.startsWith('property-') && i.id !== 'exp-dawki-campsite',
      );

      const seen = new Set<string>();
      const items: SearchEntry[] = [];
      [...intentHits, ...propertyItems, ...otherItems].forEach((it) => {
        if (!seen.has(it.url)) {
          seen.add(it.url);
          items.push(it);
        }
      });

      const grouped: Record<SearchCategory, SearchEntry[]> = {
        stays: [],
        experiences: [],
        locations: [],
        tours: [],
        pages: [],
      };
      items.forEach((item) => {
        grouped[item.category].push(item);
      });

      const categorized = order
        .filter((cat) => grouped[cat].length > 0)
        .map((cat) => ({ category: cat, items: grouped[cat] }));

      setResults(items);
      setCategorizedResults(categorized);
      setIsSearching(false);
    },
    [],
  );

  const debouncedSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(q), 120);
    },
    [search],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const totalResults = results.length;
  const hasResults = totalResults > 0;
  const isEmptyQuery = !query.trim() || query.trim().length < 2;

  return {
    query,
    setQuery: debouncedSearch,
    results,
    categorizedResults,
    isSearching,
    totalResults,
    hasResults,
    isEmptyQuery,
    clearSearch: () => {
      setQuery('');
      setResults([]);
      setCategorizedResults([]);
    },
  };
}
