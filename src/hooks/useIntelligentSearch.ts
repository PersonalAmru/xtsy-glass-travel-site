/**
 * useIntelligentSearch — Fuse.js powered fuzzy search hook
 * Searches the centralized XTSY index with synonym expansion and categorized results.
 *
 * v2 (Apr 2026): Added intent-routing layer + 3-tier ranking:
 *   1. High-intent slug matches (e.g. "stay in dawki today" → /stay-in-dawki-today)
 *   2. Property pages (conversion targets)
 *   3. Fuzzy SEO/page results
 */

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import {
  getSearchIndex,
  expandWithSynonyms,
  CATEGORY_ORDER,
  type SearchEntry,
  type SearchCategory,
} from '@/data/searchIndex';

// ---- Intent routing: known SEO slugs we want to surface as the top hit
// Keep this small + curated. Each entry = phrase → exact route.
const INTENT_ROUTES: Array<{ match: RegExp; entry: Omit<SearchEntry, 'id'> }> = [
  {
    match: /\b(stay|hostel|hotel|room)\b.*\bdawki\b.*\b(today|tonight|now)\b/i,
    entry: {
      title: 'Stay in Dawki tonight',
      description: 'Same-day riverside camping at XTSY Adventure Campsite',
      category: 'stays',
      icon: '⛺',
      url: '/xtsy-adventure-campsite-dawki',
      price: '₹699',
      location: 'Dawki, Meghalaya',
      keywords: ['stay dawki today', 'dawki tonight', 'last minute dawki'],
    },
  },
  {
    match: /\b(camp|camping|tent)\b.*\bdawki\b|\bdawki\b.*\b(camp|camping|tent)\b/i,
    entry: {
      title: 'Camping in Dawki — XTSY Adventure Campsite',
      description: 'Riverside tents on Umngot · ₹699 only camping · ₹899 with breakfast',
      category: 'stays',
      icon: '⛺',
      url: '/xtsy-adventure-campsite-dawki',
      price: '₹699',
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
      price: '₹699',
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
      url: '/things-to-do-in-dawki',
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
      price: '₹699',
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

export function useIntelligentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [categorizedResults, setCategorizedResults] = useState<CategorizedResults[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const index = useMemo(() => getSearchIndex(), []);
  const fuse = useMemo(() => new Fuse(index, FUSE_OPTIONS), [index]);

  const search = useCallback(
    (q: string) => {
      if (!q.trim() || q.trim().length < 2) {
        setResults([]);
        setCategorizedResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      // Tier 1: intent-routing layer (high-intent SEO slug matches)
      const intentHits = resolveIntent(q);

      // Tier 2/3: fuzzy search with synonym expansion
      const expanded = expandWithSynonyms(q);
      const fuseResults = fuse.search(expanded, { limit: 20 });
      const fuzzyItems = fuseResults.map((r) => r.item);

      // Property entries (id starts with 'property-' or 'exp-dawki-campsite') = Tier 2
      const propertyItems = fuzzyItems.filter(
        (i) => i.id.startsWith('property-') || i.id === 'exp-dawki-campsite',
      );
      const otherItems = fuzzyItems.filter(
        (i) => !i.id.startsWith('property-') && i.id !== 'exp-dawki-campsite',
      );

      // De-dupe by URL: intent > property > other
      const seen = new Set<string>();
      const items: SearchEntry[] = [];
      [...intentHits, ...propertyItems, ...otherItems].forEach((it) => {
        if (!seen.has(it.url)) {
          seen.add(it.url);
          items.push(it);
        }
      });

      // Group by category
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

      const categorized = CATEGORY_ORDER
        .filter((cat) => grouped[cat].length > 0)
        .map((cat) => ({ category: cat, items: grouped[cat] }));

      setResults(items);
      setCategorizedResults(categorized);
      setIsSearching(false);
    },
    [fuse],
  );

  // Debounced search
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
