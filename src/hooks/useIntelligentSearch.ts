/**
 * useIntelligentSearch — Fuse.js powered fuzzy search hook
 * Searches the centralized XTSY index with synonym expansion and categorized results
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

      // Expand query with synonyms for better recall
      const expanded = expandWithSynonyms(q);
      const fuseResults = fuse.search(expanded, { limit: 20 });
      const items = fuseResults.map((r) => r.item);

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
