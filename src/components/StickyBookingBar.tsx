/**
 * Sticky Booking Bar — Persistent CTA for quick booking access
 * Defaults to today's date, visible while scrolling on mobile + desktop
 */
import { memo, useState, useEffect } from 'react';
import { Search, CalendarDays, Users, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatLocalDateString } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

const StickyBookingBar = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [guests, setGuests] = useState(2);

  const today = formatLocalDateString(new Date());
  const tomorrow = formatLocalDateString(new Date(Date.now() + 86400000));

  // Show bar after scrolling past hero (400px)
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide on booking page, admin, etc
  const hiddenPaths = ['/book', '/admin', '/franchise', '/auth', '/profile'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  const handleBook = () => {
    navigate(`/book?location=shillong&checkIn=${today}&checkOut=${tomorrow}&guests=${guests}`);
  };

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-40 transition-all duration-300',
      'md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl md:rounded-2xl',
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
    )}>
      {/* Mobile: simple CTA bar */}
      <div className="md:hidden bg-card/95 backdrop-blur-sm border-t border-border/60 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Tonight in Shillong</p>
            <p className="text-sm font-semibold text-foreground">From ₹269/night</p>
          </div>
          <button
            onClick={handleBook}
            aria-label="Check room availability and book now"
            className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-3 min-h-[48px] rounded-xl hover:bg-primary/90 transition-colors touch-manipulation"
          >
            Check Availability
          </button>
        </div>
      </div>

      {/* Desktop: inline search bar */}
      <div className="hidden md:flex bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl px-4 py-3 items-center gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground border-r border-border/40 pr-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span>Shillong</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground border-r border-border/40 pr-3">
          <CalendarDays className="w-4 h-4 text-primary" />
          <span>Tonight</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pr-3">
          <Users className="w-4 h-4 text-primary" />
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            aria-label="Number of guests"
            className="bg-transparent border-none text-sm text-foreground focus:outline-none cursor-pointer min-h-[44px]"
          >
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleBook}
          aria-label="Search rooms and check availability now"
          className="ml-auto bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 min-h-[48px] rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-1.5 touch-manipulation"
        >
          <Search className="w-4 h-4" aria-hidden="true" /> Check Availability Now
        </button>
      </div>
    </div>
  );
});

StickyBookingBar.displayName = 'StickyBookingBar';
export default StickyBookingBar;
