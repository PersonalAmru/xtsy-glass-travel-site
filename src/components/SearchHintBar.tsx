/**
 * SearchHintBar - Interactive search console with typewriter hints
 * When idle: shows rotating typewriter hints
 * When focused (no query): shows source-aware contextual suggestions
 * When typing: matching results appear below
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  title: string;
  description: string;
  icon: string;
  path: string;
  keywords: string[];
  /** Tags for source-based relevance: 'budget','luxury','adventure','female','couples','work','pets','explore' */
  tags?: string[];
}

const SEARCH_INDEX: SearchResult[] = [
  // Rooms & Booking
  { title: '8-Bed Mixed Dorm', description: 'Bestseller · From ₹269/night', icon: '🛏️', path: '/search?location=shillong', keywords: ['dorm', 'dormitory', 'bed', 'mixed', 'cheap', 'budget', '269', 'hostel', 'backpacker', 'bestseller', '8 bed'], tags: ['budget', 'explore'] },
  { title: '6-Bed Mixed Dorm', description: 'Recommended · From ₹419/night', icon: '🛏️', path: '/search?location=shillong', keywords: ['dorm', '6 bed', 'mixed', 'recommended', '419'], tags: ['budget', 'explore'] },
  { title: '6-Bed Female Dorm', description: 'Women only · From ₹369/night', icon: '👩', path: '/search?location=shillong', keywords: ['female', 'women', 'girls', 'dorm', '6 bed', '369', 'ladies'], tags: ['female', 'budget'] },
  { title: '4-Bed Mixed Dorm', description: 'Solo traveller pick · From ₹529/night', icon: '🎒', path: '/search?location=shillong', keywords: ['dorm', '4 bed', 'solo', '529', 'mixed'], tags: ['budget', 'explore'] },
  { title: '4-Bed Female Dorm', description: 'Women only · From ₹419/night', icon: '👩', path: '/search?location=shillong', keywords: ['female', 'women', '4 bed', '419', 'ladies'], tags: ['female', 'budget'] },
  { title: 'King Double Room', description: 'Couple favourite · From ₹2,099/night', icon: '👫', path: '/search?location=shillong', keywords: ['king', 'double', 'couple', 'private', 'room', '2099', 'luxury'], tags: ['couples', 'luxury'] },
  { title: 'XTSY 270° Panorama Glass Ensuite', description: 'Ultra luxury · From ₹7,489/night', icon: '✨', path: '/xtsy-270', keywords: ['270', 'panorama', 'glass', 'luxury', 'premium', 'ensuite', '7489', 'view', 'mountain'], tags: ['luxury'] },
  // Properties
  { title: 'XTSY Travellers Hostel', description: 'Biggest hostel in North East India', icon: '🏠', path: '/', keywords: ['hostel', 'travellers', 'backpacker', 'shillong', 'budget', 'stay'], tags: ['explore', 'budget'] },
  { title: 'XTSY Experience', description: 'Premium glass ensuite in Shillong', icon: '💎', path: '/xtsy-270', keywords: ['luxury', 'premium', 'glass', 'panorama', 'high-end', 'experience'], tags: ['luxury'] },
  // Destinations
  { title: 'Meghalaya', description: 'Abode of clouds · Shillong, Cherrapunji & more', icon: '🏔️', path: '/tours', keywords: ['meghalaya', 'shillong', 'cherrapunji', 'clouds', 'northeast', 'north east'], tags: ['explore', 'adventure'] },
  { title: 'North East India', description: 'Explore 8 sister states', icon: '🌿', path: '/travel', keywords: ['north east', 'northeast', 'india', 'assam', 'nagaland', 'manipur', 'mizoram', 'tripura', 'arunachal', 'sikkim'], tags: ['explore', 'adventure'] },
  // Pages
  { title: 'Gallery', description: 'Photos & videos of XTSY', icon: '📸', path: '/gallery', keywords: ['gallery', 'photos', 'images', 'pictures', 'videos'], tags: ['explore'] },
  { title: 'Pet-Friendly Stays', description: 'Travel with your furry friend', icon: '🐾', path: '/pet-friendly', keywords: ['pet', 'dog', 'cat', 'animal', 'friendly', 'furry'], tags: ['pets'] },
  { title: 'Female Travellers', description: 'Safe stays for women solo travellers', icon: '👩‍💼', path: '/female-travellers', keywords: ['female', 'women', 'solo', 'girl', 'safe', 'ladies'], tags: ['female'] },
  { title: 'Work From XTSY', description: 'Remote work-friendly hostel', icon: '💻', path: '/work-from-home', keywords: ['work', 'remote', 'laptop', 'wifi', 'digital nomad', 'workation', 'coworking'], tags: ['work'] },
  { title: 'XTSY Rentals', description: 'Bike & car rentals in Shillong', icon: '🏍️', path: '/xtsy-rentals', keywords: ['rental', 'bike', 'car', 'scooty', 'ride', 'transport'], tags: ['adventure', 'explore'] },
  { title: 'XTSY vs Zostel', description: 'Honest comparison', icon: '⚔️', path: '/xtsy-vs-zostel', keywords: ['zostel', 'compare', 'comparison', 'vs', 'versus', 'alternative'], tags: ['explore'] },
  { title: 'About XTSY', description: 'Our story & mission', icon: '📖', path: '/about', keywords: ['about', 'story', 'team', 'mission', 'who'], tags: ['explore'] },
  // Booking & Policies
  { title: 'Book Now', description: 'Reserve your stay at XTSY', icon: '📅', path: '/book', keywords: ['book', 'reserve', 'booking', 'availability', 'check'], tags: ['budget', 'luxury', 'couples'] },
  { title: 'Tour Packages', description: 'Curated adventure tours', icon: '🗺️', path: '/travel', keywords: ['tour', 'package', 'adventure', 'trek', 'trip', 'itinerary', 'group'], tags: ['adventure', 'explore'] },
  { title: 'Pricing & Cancellation Policy', description: 'Transparent policies', icon: '📋', path: '/pricing-cancellation-policy', keywords: ['pricing', 'cancel', 'refund', 'policy', 'cancellation'], tags: [] },
  { title: 'Privacy Policy', description: 'Your data, your rights', icon: '🔒', path: '/privacy-policy', keywords: ['privacy', 'data', 'gdpr', 'policy'], tags: [] },
];

const PLACEHOLDER_HINTS = [
  { text: 'Book dorm from ₹269/night', icon: '🛏️' },
  { text: 'Explore Meghalaya', icon: '🏔️' },
  { text: 'Search North East India', icon: '🌿' },
  { text: 'XTSY 270° Glass Ensuite', icon: '✨' },
  { text: 'Adventure packages & tours', icon: '🎒' },
  { text: 'Pet-friendly stays', icon: '🐾' },
];

/**
 * Detect visitor intent from UTM params, referrer, and current page
 */
function detectVisitorIntent(): string[] {
  const params = new URLSearchParams(window.location.search);
  const utmSource = (params.get('utm_source') || '').toLowerCase();
  const utmMedium = (params.get('utm_medium') || '').toLowerCase();
  const utmCampaign = (params.get('utm_campaign') || '').toLowerCase();
  const utmContent = (params.get('utm_content') || '').toLowerCase();
  const referrer = document.referrer.toLowerCase();
  const path = window.location.pathname.toLowerCase();

  const tags = new Set<string>();

  // UTM campaign signals
  const allUtm = `${utmSource} ${utmMedium} ${utmCampaign} ${utmContent}`;
  if (/budget|cheap|dorm|hostel|backpack/i.test(allUtm)) tags.add('budget');
  if (/luxury|premium|glass|270|ensuite|couple/i.test(allUtm)) tags.add('luxury');
  if (/adventure|trek|tour|package|explore/i.test(allUtm)) tags.add('adventure');
  if (/female|women|girl|solo.?female/i.test(allUtm)) tags.add('female');
  if (/couple|honeymoon|romantic/i.test(allUtm)) tags.add('couples');
  if (/work|remote|nomad|cowork/i.test(allUtm)) tags.add('work');
  if (/pet|dog|animal/i.test(allUtm)) tags.add('pets');

  // Referrer signals
  if (/hostelworld|booking\.com|agoda|makemytrip|goibibo/i.test(referrer)) tags.add('budget');
  if (/tripadvisor|lonelyplanet/i.test(referrer)) tags.add('explore');
  if (/instagram|youtube|facebook|tiktok/i.test(referrer)) tags.add('explore');
  if (/google|bing|duckduckgo/i.test(referrer)) tags.add('explore');

  // Current page context
  if (/female/i.test(path)) tags.add('female');
  if (/270|luxury|premium/i.test(path)) tags.add('luxury');
  if (/travel|tour|adventure/i.test(path)) tags.add('adventure');
  if (/pet/i.test(path)) tags.add('pets');
  if (/work|remote/i.test(path)) tags.add('work');
  if (/rental/i.test(path)) tags.add('adventure');

  // Default fallback
  if (tags.size === 0) tags.add('explore');

  return Array.from(tags);
}

export function SearchHintBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter state for placeholder
  const [hintIndex, setHintIndex] = useState(0);
  const [hintText, setHintText] = useState('');
  const [isTypingHint, setIsTypingHint] = useState(true);

  // Compute contextual suggestions based on traffic source
  const contextualSuggestions = useMemo(() => {
    const intentTags = detectVisitorIntent();
    const scored = SEARCH_INDEX.map((item) => {
      let score = 0;
      for (const tag of intentTags) {
        if (item.tags?.includes(tag)) score += 2;
      }
      return { item, score };
    })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s) => s.item);
    return scored;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  // Typewriter effect for placeholder when not active
  useEffect(() => {
    if (isActive) return;

    const hint = PLACEHOLDER_HINTS[hintIndex];
    if (isTypingHint) {
      if (hintText.length < hint.text.length) {
        const t = setTimeout(() => setHintText(hint.text.slice(0, hintText.length + 1)), 45);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setIsTypingHint(false), 2500);
        return () => clearTimeout(t);
      }
    } else {
      const t = setTimeout(() => {
        setHintText('');
        setHintIndex((p) => (p + 1) % PLACEHOLDER_HINTS.length);
        setIsTypingHint(true);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isActive, hintText, isTypingHint, hintIndex]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }
    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/);
    const scored = SEARCH_INDEX.map((item) => {
      let score = 0;
      const haystack = [item.title, item.description, ...item.keywords].join(' ').toLowerCase();
      for (const term of terms) {
        if (haystack.includes(term)) score += 1;
        if (item.title.toLowerCase().includes(term)) score += 2;
        if (item.keywords.some((k) => k.includes(term))) score += 1;
      }
      return { item, score };
    })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((s) => s.item);
    setResults(scored);
    setSelectedIndex(-1);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setIsActive(false);
      setQuery('');
      navigate(result.path);
    },
    [navigate]
  );

  // Determine what to show in dropdown
  const displayResults = query.trim() ? results : (isActive ? contextualSuggestions : []);
  const showDropdown = isActive && displayResults.length > 0;
  const isContextual = isActive && !query.trim() && contextualSuggestions.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => Math.min(p + 1, displayResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => Math.max(p - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && displayResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(displayResults[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsActive(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block mb-6 w-full max-w-md mx-auto">
      {/* Search Input */}
      <div
        className={cn(
          'relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl',
          'bg-white/[0.12] backdrop-blur-xl border transition-all duration-500',
          isActive
            ? 'border-primary/50 bg-white/[0.16] shadow-[0_0_40px_rgba(249,115,22,0.18)] ring-1 ring-primary/30'
            : 'border-white/[0.2] hover:border-white/30 hover:bg-white/[0.15]',
          showDropdown && 'rounded-b-none border-b-white/[0.06]'
        )}
      >
        <Search
          className={cn(
            'w-4 h-4 flex-shrink-0 transition-colors duration-300',
            isActive ? 'text-primary' : 'text-white/60'
          )}
        />

        <div className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsActive(true)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-white placeholder-transparent outline-none caret-primary"
            placeholder="Search XTSY..."
            aria-label="Search XTSY"
            autoComplete="off"
          />
          {/* Custom animated placeholder */}
          {!query && !isActive && (
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <span className="text-sm text-primary/90 font-medium truncate">
                {PLACEHOLDER_HINTS[hintIndex].icon} {hintText}
              </span>
              <span className="inline-block w-[2px] h-4 ml-0.5 bg-primary animate-pulse rounded-full" />
            </div>
          )}
          {!query && isActive && (
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <span className="text-sm text-white/50">Search rooms, places, pages...</span>
            </div>
          )}
        </div>

        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>
        )}

        {!isActive && (
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-primary/40" />
        )}
      </div>

      {/* Results Dropdown */}
      {showDropdown && (
        <div
          className={cn(
            'absolute z-50 w-full rounded-b-2xl overflow-hidden',
            'bg-background/95 backdrop-blur-xl border border-t-0 border-white/[0.12]',
            'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]',
            'animate-in fade-in slide-in-from-top-1 duration-200'
          )}
        >
          {/* Contextual header */}
          {isContextual && (
            <div className="px-4 pt-2.5 pb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary/70" />
              <span className="text-[11px] font-medium text-primary/70 uppercase tracking-wider">Suggested for you</span>
            </div>
          )}
          {displayResults.map((result, i) => (
            <button
              key={result.path + result.title}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150',
                'hover:bg-white/[0.06]',
                selectedIndex === i && 'bg-white/[0.08]'
              )}
            >
              <span className="text-lg flex-shrink-0 w-8 text-center">{result.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground/90 truncate">{result.title}</div>
                <div className="text-xs text-muted-foreground truncate">{result.description}</div>
              </div>
              <ArrowRight
                className={cn(
                  'w-3.5 h-3.5 flex-shrink-0 transition-all duration-200',
                  selectedIndex === i ? 'text-primary opacity-100 translate-x-0' : 'text-muted-foreground opacity-0 -translate-x-1'
                )}
              />
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isActive && query.trim() && results.length === 0 && (
        <div
          className={cn(
            'absolute z-50 w-full rounded-b-2xl overflow-hidden',
            'bg-background/95 backdrop-blur-xl border border-t-0 border-white/[0.12]',
            'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]',
            'px-4 py-6 text-center'
          )}
        >
          <p className="text-sm text-muted-foreground">No results for "{query}"</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Try "dorm", "meghalaya", or "luxury"</p>
        </div>
      )}
    </div>
  );
}
