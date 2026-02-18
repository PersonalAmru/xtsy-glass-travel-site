/**
 * SearchHintBar - Animated search console with rotating hints
 * Displays clickable search suggestions with typewriter effect
 */

import { useState, useEffect, useCallback } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchHint {
  text: string;
  icon?: string;
  action: 'navigate' | 'scroll' | 'search';
  path?: string;
  target?: string;
}

const HINTS: SearchHint[] = [
  { text: 'Book dorm from ₹269/night', icon: '🛏️', action: 'scroll', target: '#rooms-section' },
  { text: 'Explore Meghalaya packages', icon: '🏔️', action: 'navigate', path: '/search?location=shillong' },
  { text: 'Search North East India', icon: '🌿', action: 'navigate', path: '/search?location=shillong' },
  { text: 'Premium stays in Shillong', icon: '✨', action: 'navigate', path: '/search?location=shillong' },
  { text: 'Group bookings & tours', icon: '👥', action: 'scroll', target: '#group-booking-section' },
  { text: 'Adventure packages from ₹4,999', icon: '🎒', action: 'navigate', path: '/tours' },
];

interface SearchHintBarProps {
  onHintClick: (hint: SearchHint) => void;
}

export function SearchHintBar({ onHintClick }: SearchHintBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const currentHint = HINTS[currentIndex];

  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return;
    
    const fullText = currentHint.text;
    if (displayText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      // Pause at full text, then clear and move to next
      const pause = setTimeout(() => {
        setIsTyping(false);
        setTimeout(() => {
          setDisplayText('');
          setCurrentIndex((prev) => (prev + 1) % HINTS.length);
          setIsTyping(true);
        }, 300);
      }, 2500);
      return () => clearTimeout(pause);
    }
  }, [displayText, isTyping, currentHint.text]);

  return (
    <button
      onClick={() => onHintClick(currentHint)}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={cn(
        'group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-6',
        'bg-white/[0.06] backdrop-blur-xl border border-white/[0.12]',
        'hover:bg-white/[0.1] hover:border-primary/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]',
        'transition-all duration-500 cursor-pointer',
        'active:scale-[0.98]'
      )}
      aria-label={`Search: ${currentHint.text}`}
    >
      {/* Animated search icon */}
      <div className="relative flex-shrink-0">
        <Search className={cn(
          'w-4 h-4 transition-all duration-300',
          isFocused ? 'text-primary scale-110' : 'text-white/50'
        )} />
        <div className={cn(
          'absolute -inset-1 bg-primary/20 rounded-full blur-sm transition-opacity duration-300',
          isFocused ? 'opacity-100' : 'opacity-0'
        )} />
      </div>

      {/* Text container with typewriter */}
      <span className="text-sm font-medium min-w-[180px] sm:min-w-[220px] text-left">
        <span className="text-white/40 mr-0.5">{currentHint.icon} </span>
        <span className={cn(
          'text-white/70 transition-colors duration-300',
          isFocused && 'text-white/90'
        )}>
          {displayText}
        </span>
        <span className={cn(
          'inline-block w-[2px] h-4 ml-0.5 align-middle rounded-full',
          'bg-primary/70 animate-pulse'
        )} />
      </span>

      {/* Subtle glow on hover */}
      <Sparkles className={cn(
        'w-3.5 h-3.5 flex-shrink-0 transition-all duration-300',
        isFocused ? 'text-primary/80 scale-110' : 'text-white/20'
      )} />
    </button>
  );
}
