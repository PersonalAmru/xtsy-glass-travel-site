/**
 * RoomSelectionCard - Room card with quantity selector (+/-) for property detail page
 * Manages room selection state for direct booking from property page
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Minus, Plus, Heart, User, UsersRound, Home, Star, ThumbsUp, Crown, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoomType, TAG_LABELS, TAG_COLORS, RoomTag } from '@/data/roomInventory';
import UnifiedImage from '@/components/UnifiedImage';
import { routeGTMEvent } from '@/utils/gtmEventRouter';

interface RoomSelectionCardProps {
  room: RoomType;
  quantity: number;
  onQuantityChange: (roomId: string, quantity: number) => void;
  maxQuantity?: number;
}

// Icon mapping for tags
const TAG_ICONS: Record<RoomTag, React.ReactNode> = {
  couple_favourite: <Heart className="w-3 h-3" />,
  solo_traveller: <User className="w-3 h-3" />,
  preferred_by_group: <UsersRound className="w-3 h-3" />,
  preferred_by_families: <Home className="w-3 h-3" />,
  best_value: null,
  most_popular: null,
  bestseller: <Star className="w-3 h-3" />,
  recommended: <ThumbsUp className="w-3 h-3" />,
  preferred_by_female: <User className="w-3 h-3" />,
  preferred_by_couple: <Heart className="w-3 h-3" />,
  luxury_couple: <Crown className="w-3 h-3" />,
  sold_out: <Ban className="w-3 h-3" />,
};

export const RoomSelectionCard = ({
  room,
  quantity,
  onQuantityChange,
  maxQuantity = 10,
}: RoomSelectionCardProps) => {
  const isSelected = quantity > 0;
  const isDorm = room.kind === 'dorm';
  const isSoldOut = !room.isBookable;
  const effectiveMax = isSoldOut ? 0 : (isDorm ? Math.min(room.capacity, maxQuantity) : Math.min(room.totalUnits, maxQuantity));

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < effectiveMax) {
      onQuantityChange(room.id, quantity + 1);
      // Fire view_room on first selection
      if (quantity === 0) {
        routeGTMEvent({
          eventName: 'view_room',
          params: {
            room_type: room.id,
            room_name: room.name,
            base_price: room.discountedPrice,
            nights: 1,
            property_name: room.propertyType || 'XTSY',
            page_path: window.location.pathname,
          },
        });
        // Auto-detect luxury room interest
        if (room.id.includes('270') || room.name.toLowerCase().includes('270')) {
          routeGTMEvent({
            eventName: 'luxury_room_interest',
            params: {
              property_name: room.propertyType || 'XTSY Experience',
              room_type: room.id,
              base_price: room.discountedPrice,
              page_path: window.location.pathname,
            },
          });
        }
      }
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 0) {
      onQuantityChange(room.id, quantity - 1);
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl bg-white/5 border overflow-hidden transition-all duration-200",
        isSoldOut
          ? "border-white/5 opacity-60 pointer-events-none"
          : isSelected 
            ? "border-primary/40 bg-white/[0.08]" 
            : "border-white/10 hover:border-white/20"
      )}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Room Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 relative">
          <UnifiedImage
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Room Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-sm">{room.name}</h3>
          
          {/* Tags */}
          {room.tags && room.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {room.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                    TAG_COLORS[tag]?.bg || 'bg-white/10',
                    TAG_COLORS[tag]?.text || 'text-white/70'
                  )}
                >
                  {TAG_ICONS[tag]}
                  {TAG_LABELS[tag]}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/60">
              <Users className="w-3 h-3" />
              {isDorm ? '1 bed' : `${room.capacity} guests`}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {room.originalPrice > room.discountedPrice && (
              <span className="text-sm text-white/40 line-through">₹{room.originalPrice.toLocaleString()}</span>
            )}
            <span className="text-lg font-bold text-white">₹{room.discountedPrice.toLocaleString()}</span>
            <span className="text-xs text-white/40">/{isDorm ? 'bed' : 'night'}</span>
            {!room.isBookable && (
              <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">Sold Out</span>
            )}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDecrement}
            disabled={quantity === 0}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all",
              quantity === 0 
                ? "bg-white/5 text-white/20 cursor-not-allowed" 
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <Minus className="w-4 h-4" />
          </motion.button>
          
          <span className={cn(
            "w-8 text-center text-lg font-bold transition-colors",
            isSelected ? "text-white" : "text-white/40"
          )}>
            {quantity}
          </span>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleIncrement}
            disabled={quantity >= effectiveMax}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all",
              quantity >= effectiveMax 
                ? "bg-white/5 text-white/20 cursor-not-allowed" 
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Selected Summary */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-primary/10 border-t border-primary/20 flex items-center justify-between">
              <span className="text-sm text-white/70">
                {quantity} × {isDorm ? 'bed' : 'room'} selected
              </span>
              <span className="text-sm font-semibold text-primary">
                ₹{(room.discountedPrice * quantity).toLocaleString()}/night
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoomSelectionCard;
