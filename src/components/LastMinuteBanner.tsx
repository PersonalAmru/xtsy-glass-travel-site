/**
 * Last-Minute Mode Banner — Triggered when user searches for today/tonight
 * Shows urgency-driven availability with real-time room counts
 */
import { memo, useState, useEffect } from 'react';
import { Flame, Clock, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBookableRooms, type RoomType } from '@/data/roomInventory';
import { formatLocalDateString } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

interface LastMinuteBannerProps {
  className?: string;
}

const LastMinuteBanner = memo(({ className }: LastMinuteBannerProps) => {
  const rooms = getBookableRooms();
  const today = formatLocalDateString(new Date());
  const lowestPrice = Math.min(...rooms.map(r => r.discountedPrice));
  const totalBeds = rooms.reduce((sum, r) => sum + r.totalUnits, 0);

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
          <h3 className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
            🔥 Available Today in Shillong
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {totalBeds}+ beds available tonight · Starting from <span className="text-orange-400 font-semibold">₹{lowestPrice}/night</span>
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            {rooms.slice(0, 3).map(room => (
              <span key={room.id} className="text-xs bg-background/60 border border-border/50 rounded-full px-3 py-1 text-muted-foreground">
                {room.shortName} · ₹{room.discountedPrice}
              </span>
            ))}
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
