/**
 * RoomSelectionCard - Room card with quantity selector (+/-) for property detail page
 * Manages room selection state for direct booking from property page
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Minus, Plus, ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoomType } from '@/data/roomInventory';
import UnifiedImage from '@/components/UnifiedImage';

interface RoomSelectionCardProps {
  room: RoomType;
  quantity: number;
  onQuantityChange: (roomId: string, quantity: number) => void;
  maxQuantity?: number;
}

export const RoomSelectionCard = ({
  room,
  quantity,
  onQuantityChange,
  maxQuantity = 10,
}: RoomSelectionCardProps) => {
  const isSelected = quantity > 0;
  const isDorm = room.kind === 'dorm';
  const effectiveMax = isDorm ? Math.min(room.capacity, maxQuantity) : Math.min(room.totalUnits, maxQuantity);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < effectiveMax) {
      onQuantityChange(room.id, quantity + 1);
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
        isSelected 
          ? "border-primary/40 bg-white/[0.08]" 
          : "border-white/10 hover:border-white/20"
      )}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Room Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
          <UnifiedImage
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Room Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-sm">{room.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/60">
              <Users className="w-3 h-3" />
              {isDorm ? '1 bed' : `${room.capacity} guests`}
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg font-bold text-white">₹{room.discountedPrice.toLocaleString()}</span>
            <span className="text-xs text-white/40 ml-1">/{isDorm ? 'bed' : 'night'}</span>
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
