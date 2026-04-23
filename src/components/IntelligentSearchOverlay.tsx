/**
 * IntelligentSearchOverlay — Full-screen search overlay with categorized results
 * Fuzzy search powered by Fuse.js with keyword highlighting and keyboard navigation
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntelligentSearch } from '@/hooks/useIntelligentSearch';
import { CATEGORY_LABELS, type SearchEntry } from '@/data/searchIndex';
import { logSearchQuery, logSearchClick } from '@/lib/searchAnalytics';

interface IntelligentSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  { label: 'Glass Stargazing Suite', icon: '🌌' },
  { label: 'Hostel Shillong', icon: '🏠' },
  { label: 'Meghalaya Tours', icon: '🏔️' },
  { label: 'Female Dorm', icon: '👩' },
  { label: 'Pet Friendly', icon: '🐾' },
  { label: 'Budget Stay', icon: '💰' },
];

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/30 text-foreground rounded-sm px-0.5">{part}</mark>
    ) : (
      part
    )
  );
}

export default function IntelligentSearchOverlay({ isOpen, onClose }: IntelligentSearchOverlayProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    categorizedResults,
    hasResults,
    isEmptyQuery,
    clearSearch,
  } = useIntelligentSearch();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      // Small delay for portal render
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Flatten results for keyboard nav
  const flatResults = categorizedResults.flatMap((c) => c.items);

  const handleSelect = useCallback(
    (entry: SearchEntry) => {
      // Track search analytics — local + Supabase
      try {
        const searches = JSON.parse(sessionStorage.getItem('xtsy_search_analytics') || '[]');
        searches.push({ query, selected: entry.title, url: entry.url, ts: Date.now() });
        sessionStorage.setItem('xtsy_search_analytics', JSON.stringify(searches.slice(-50)));
      } catch {}
      logSearchClick({ query, source: 'header_overlay', url: entry.url, title: entry.title });

      clearSearch();
      onClose();
      navigate(entry.url);
    },
    [navigate, onClose, clearSearch, query],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => Math.min(p + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => Math.max(p - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && flatResults[selectedIndex]) {
        handleSelect(flatResults[selectedIndex]);
      } else if (query.trim()) {
        // Navigate to search results page
        onClose();
        clearSearch();
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Track every meaningful query (debounced inside logger) + zero-result queries
  useEffect(() => {
    if (isEmptyQuery || query.length < 3) return;
    logSearchQuery({
      query,
      source: 'header_overlay',
      resultCount: flatResults.length,
    });
    if (!hasResults) {
      try {
        const zeroResults = JSON.parse(sessionStorage.getItem('xtsy_zero_results') || '[]');
        if (!zeroResults.includes(query.trim().toLowerCase())) {
          zeroResults.push(query.trim().toLowerCase());
          sessionStorage.setItem('xtsy_zero_results', JSON.stringify(zeroResults.slice(-30)));
        }
      } catch {}
    }
  }, [query, isEmptyQuery, hasResults, flatResults.length]);

  const handleTrendingClick = (label: string) => {
    setQuery(label);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-background/98 backdrop-blur-xl"
      role="dialog"
      aria-label="Search XTSY"
    >
      {/* Header / Search Input */}
      <div className="flex-shrink-0 border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 h-16 sm:h-20">
            <Search className="w-5 h-5 text-primary flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search stays, experiences, tours, locations..."
              className="flex-1 bg-transparent text-lg sm:text-xl text-foreground placeholder:text-muted-foreground/60 outline-none caret-primary"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {query && (
              <button
                onClick={() => { clearSearch(); inputRef.current?.focus(); }}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm font-medium text-muted-foreground"
            >
              ESC
            </button>
          </div>
        </div>
      </div>

      {/* Results Body */}
      <div ref={resultsContainerRef} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Trending / Empty State */}
          {isEmptyQuery && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => handleTrendingClick(t.label)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary border border-border/50 hover:border-primary/30 transition-all text-sm font-medium text-foreground/80"
                  >
                    <span>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary/60" />
                <span className="text-xs text-muted-foreground">
                  Try: "glass stay", "hostel shillong", "stargazing india", "adventure tours"
                </span>
              </div>
            </div>
          )}

          {/* Categorized Results */}
          {!isEmptyQuery && hasResults && (
            <div className="space-y-6">
              {categorizedResults.map((group) => (
                <div key={group.category}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                      {CATEGORY_LABELS[group.category]}
                    </span>
                    <span className="text-xs text-muted-foreground">({group.items.length})</span>
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const flatIdx = flatResults.indexOf(item);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          className={cn(
                            'w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-150',
                            'hover:bg-muted/80',
                            selectedIndex === flatIdx && 'bg-primary/10 ring-1 ring-primary/20',
                          )}
                        >
                          <span className="text-xl flex-shrink-0 w-10 text-center">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground truncate">
                              {highlightMatch(item.title, query)}
                            </div>
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                              {highlightMatch(item.description, query)}
                            </div>
                            {item.price && (
                              <span className="inline-block mt-1 text-xs font-semibold text-primary">
                                {item.price}
                              </span>
                            )}
                          </div>
                          <ArrowRight
                            className={cn(
                              'w-4 h-4 flex-shrink-0 transition-all duration-200',
                              selectedIndex === flatIdx ? 'text-primary opacity-100' : 'text-muted-foreground opacity-0',
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* View all results link */}
              {query.trim() && (
                <button
                  onClick={() => {
                    onClose();
                    clearSearch();
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm transition-colors"
                >
                  <Search className="w-4 h-4" />
                  View all results for "{query}"
                </button>
              )}
            </div>
          )}

          {/* No Results */}
          {!isEmptyQuery && !hasResults && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-foreground font-medium mb-1">No results for "{query}"</p>
              <p className="text-sm text-muted-foreground mb-6">
                Try different keywords like "glass stay", "hostel", or "meghalaya"
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {TRENDING_SEARCHES.slice(0, 4).map((t) => (
                  <button
                    key={t.label}
                    onClick={() => handleTrendingClick(t.label)}
                    className="px-3 py-1.5 rounded-full bg-muted text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="flex-shrink-0 border-t border-border/50 px-4 py-2.5 hidden sm:block">
        <div className="max-w-3xl mx-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">↵</kbd> Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">esc</kbd> Close
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
