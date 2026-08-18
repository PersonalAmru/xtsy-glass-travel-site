/**
 * Last-Minute Mode Banner — Triggered when user searches for today/tonight
 * Shows urgency-driven availability with real-time room counts
 */
import { memo, useEffect, useState } from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import { getBookableRooms, getSimulatedAvailability, isMayPricingActive } from '@/data/roomInventory';
import { formatLocalDateString } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

interface LastMinuteBannerProps {
  className?: string;
}

const LastMinuteBanner = memo(({ className }: LastMinuteBannerProps) => {
  const rooms = getBookableRooms();
  const today = formatLocalDateString(new Date());
  const lowestPrice = Math.min(...rooms.map(r => r.discountedPrice));

  // Show per-room scarcity total — capped realistically.
  // getSimulatedAvailability is time-of-day based, so the SSR (UTC) and client
  // (local) values can differ. Render the capped value first and refine after
  // mount to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [totalAvailable, setTotalAvailable] = useState(5);
  useEffect(() => {
    setMounted(true);
    setTotalAvailable(
      Math.min(5, rooms.reduce((sum, r) => sum + getSimulatedAvailability(r.id), 0))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showPriceHike = !isMayPricingActive();

  return (
    <div className={cn(
      'bg-gradient-to-r from-orange-500/15 via-red-500/10 to-orange-500/15 border border-orange-500/30 rounded-xl p-4 md:p-5',
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-orange-500/20 rounded-lg shrink-0">
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
            🔥 Available Today in Shillong
          </h3>
          <p className="text-sm text-slate-700 mt-1">
            <span suppressHydrationWarning>{totalAvailable}</span> beds available tonight · Starting from <span className="text-orange-600 font-semibold">₹{lowestPrice}/night</span>
          </p>
          {showPriceHike && (
            <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
              ⏰ April rates ending soon — prices increase from May 1
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-3">
            {rooms.slice(0, 3).map(room => {
              const avail = mounted ? getSimulatedAvailability(room.id) : 1;
              return (
                <span key={room.id} suppressHydrationWarning className="text-xs bg-white/80 border border-orange-200 rounded-full px-3 py-1 text-slate-700">
                  {room.shortName} · ₹{room.discountedPrice} · {avail} left
                </span>
              );
            })}
          </div>
          <Link
            to={`/book?checkIn=${today}&checkOut=${formatLocalDateString(new Date(Date.now() + 86400000))}&guests=1`}
            className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors"
          >
            Book Now for Tonight <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
});

LastMinuteBanner.displayName = 'LastMinuteBanner';
export default LastMinuteBanner;
