/**
 * Tonight's Deals — Urgency-driven deals section with countdown timers
 * Shows discounted rooms with time-limited visual urgency + April price-hike messaging
 */
import { memo, useState, useEffect } from 'react';
import { Clock, Zap, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import { getBookableRooms, type RoomType, getSimulatedAvailability, isMayPricingActive } from '@/data/roomInventory';
import { formatLocalDateString } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

const CountdownTimer = memo(() => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return Math.max(0, Math.floor((endOfDay.getTime() - now.getTime()) / 1000));
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3" />
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

const DealCard = memo(({ room }: { room: RoomType }) => {
  const today = formatLocalDateString(new Date());
  const tomorrow = formatLocalDateString(new Date(Date.now() + 86400000));
  const discount = room.originalPrice > room.discountedPrice
    ? Math.round((1 - room.discountedPrice / room.originalPrice) * 100)
    : 0;
  const availableLeft = getSimulatedAvailability(room.id);

  if (discount <= 0) return null;

  return (
    <div className="bg-gradient-to-br from-card to-card/80 border border-orange-500/20 rounded-xl p-4 relative overflow-hidden min-w-[300px] md:min-w-0">
      {/* Urgency badge */}
      <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
        {discount}% OFF TONIGHT
      </div>

      <div className="flex gap-3">
        <img
          src={room.image}
          alt={room.name}
          className="w-20 h-20 rounded-lg object-cover shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground line-clamp-1">{room.name}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-orange-400">₹{room.discountedPrice}</span>
            <span className="text-xs text-muted-foreground line-through">₹{room.originalPrice}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <CountdownTimer />
            <span className="text-[11px] text-muted-foreground">
              {availableLeft <= 3 ? `Only ${availableLeft} left` : 'Valid today only'}
            </span>
          </div>
          {!isMayPricingActive() && (
            <p className="text-[10px] text-red-400 font-medium mt-1">⏰ Prices go up May 1</p>
          )}
        </div>
      </div>

      <Link
        to={`/book?checkIn=${today}&checkOut=${tomorrow}&guests=1&room=${room.id}`}
        className="mt-3 w-full inline-flex items-center justify-center gap-1 bg-orange-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        <Zap className="w-4 h-4" /> Grab This Deal
      </Link>
    </div>
  );
});

DealCard.displayName = 'DealCard';

const TonightsDeals = memo(() => {
  const rooms = getBookableRooms().filter(r => r.originalPrice > r.discountedPrice);

  if (rooms.length === 0) return null;

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-orange-500/15 rounded-lg">
          <Zap className="w-5 h-5 text-orange-400" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Tonight's Deals in Meghalaya
        </h2>
      </div>
      <p className="text-sm text-slate-600 mb-6 ml-12">
        {isMayPricingActive()
          ? 'Limited-time prices — book before they\'re gone'
          : '🔥 Last chance at April rates — prices increase from May 1'}
      </p>

      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
        {rooms.map(room => (
          <div key={room.id} className="snap-start shrink-0 w-[85vw] md:w-auto">
            <DealCard room={room} />
          </div>
        ))}
      </div>
    </section>
  );
});

TonightsDeals.displayName = 'TonightsDeals';
export default TonightsDeals;
