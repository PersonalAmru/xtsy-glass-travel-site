/**
 * Available Stays Right Now — Real-time availability cards with urgency signals
 * Shows bookable rooms with social proof and scarcity indicators
 */
import { memo, useState, useEffect, useMemo } from 'react';
import { Bed, Users, Clock, TrendingUp, ChevronRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBookableRooms, TAG_LABELS, type RoomType } from '@/data/roomInventory';
import { formatLocalDateString } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

const SOCIAL_PROOF_MESSAGES = [
  'Booked 3 times today',
  'Last booked 10 min ago',
  'Popular this week',
  'Trending now',
  'Booked 5 times today',
];

const AvailabilityCard = memo(({ room, index }: { room: RoomType; index: number }) => {
  const today = formatLocalDateString(new Date());
  const tomorrow = formatLocalDateString(new Date(Date.now() + 86400000));
  const socialProof = SOCIAL_PROOF_MESSAGES[index % SOCIAL_PROOF_MESSAGES.length];
  const viewingCount = useMemo(() => Math.floor(Math.random() * 6) + 2, []);
  const isLow = room.totalUnits <= 4;
  const discount = room.originalPrice > room.discountedPrice
    ? Math.round((1 - room.discountedPrice / room.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 hover:border-primary/40 transition-all group min-w-[280px] md:min-w-0">
      {/* Image */}
      <div className="relative h-36 rounded-lg overflow-hidden mb-3">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </span>
        )}
        {isLow && (
          <span className="absolute top-2 right-2 bg-orange-500/90 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" /> Only {room.totalUnits} left
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="font-semibold text-foreground text-sm line-clamp-1">{room.name}</h3>

      {/* Tags */}
      {room.tags && room.tags.length > 0 && room.tags[0] !== 'sold_out' && (
        <span className="inline-block text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5 mt-1">
          {TAG_LABELS[room.tags[0]]}
        </span>
      )}

      {/* Pricing */}
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-lg font-bold text-foreground">₹{room.discountedPrice}</span>
        {discount > 0 && (
          <span className="text-xs text-muted-foreground line-through">₹{room.originalPrice}</span>
        )}
        <span className="text-xs text-muted-foreground">/ night</span>
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" /> {viewingCount} viewing
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {socialProof}
        </span>
      </div>

      {/* CTA */}
      <Link
        to={`/book?checkIn=${today}&checkOut=${tomorrow}&guests=1&room=${room.id}`}
        className="mt-3 w-full inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground text-sm font-medium py-2 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Book Now <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
});

AvailabilityCard.displayName = 'AvailabilityCard';

const AvailableStaysNow = memo(() => {
  const rooms = getBookableRooms();

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-500/15 rounded-lg">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Available Stays Right Now
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6 ml-12">
        Real-time availability in Shillong · Updated just now
      </p>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
        {rooms.map((room, i) => (
          <div key={room.id} className="snap-start shrink-0 w-[85vw] md:w-auto">
            <AvailabilityCard room={room} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
});

AvailableStaysNow.displayName = 'AvailableStaysNow';
export default AvailableStaysNow;
