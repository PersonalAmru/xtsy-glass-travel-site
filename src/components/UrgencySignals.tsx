/**
 * Urgency + Social Proof Signals — Reusable components for scarcity/proof cues
 * Display near booking buttons and room cards
 */
import { memo, useState, useEffect, useMemo } from 'react';
import { Eye, Flame, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UrgencyBadgeProps {
  totalUnits: number;
  roomName?: string;
  className?: string;
  variant?: 'inline' | 'floating';
}

/**
 * Shows viewing count + scarcity signal near a room card
 */
export const UrgencyBadge = memo(({ totalUnits, roomName, className, variant = 'inline' }: UrgencyBadgeProps) => {
  const viewingCount = useMemo(() => Math.floor(Math.random() * 5) + 2, []);
  const bookedToday = useMemo(() => Math.floor(Math.random() * 4) + 1, []);
  const isLow = totalUnits <= 4;

  return (
    <div className={cn(
      'flex flex-wrap items-center gap-2 text-[11px]',
      variant === 'floating' && 'absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1.5',
      className
    )}>
      <span className="flex items-center gap-1 text-muted-foreground">
        <Eye className="w-3 h-3" /> {viewingCount} viewing
      </span>
      <span className="flex items-center gap-1 text-muted-foreground">
        <Clock className="w-3 h-3" /> Booked {bookedToday}× today
      </span>
      {isLow && (
        <span className="flex items-center gap-1 text-orange-400 font-medium">
          <Flame className="w-3 h-3" /> Only {totalUnits} left!
        </span>
      )}
    </div>
  );
});

UrgencyBadge.displayName = 'UrgencyBadge';

/**
 * Compact inline signal for tight spaces (e.g., booking summary)
 */
export const ScarcityPill = memo(({ unitsLeft, className }: { unitsLeft: number; className?: string }) => {
  if (unitsLeft > 5) return null;

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
      unitsLeft <= 2 ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400',
      className
    )}>
      <Flame className="w-3 h-3" />
      {unitsLeft <= 1 ? 'Last one!' : `Only ${unitsLeft} left`}
    </span>
  );
});

ScarcityPill.displayName = 'ScarcityPill';

/**
 * Animated live viewer count
 */
export const LiveViewerCount = memo(({ className }: { className?: string }) => {
  const [count, setCount] = useState(() => Math.floor(Math.random() * 8) + 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(2, Math.min(15, prev + change));
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 text-xs text-emerald-400',
      className
    )}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>
      {count} people looking at stays in Shillong
    </span>
  );
});

LiveViewerCount.displayName = 'LiveViewerCount';
