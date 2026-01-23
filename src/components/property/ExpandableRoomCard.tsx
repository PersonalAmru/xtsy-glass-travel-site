/**
 * ExpandableRoomCard - Room card with expandable availability calendar
 * Smoothly expands/collapses on click to show mini calendar with availability
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoomType } from '@/data/roomInventory';
import UnifiedImage from '@/components/UnifiedImage';
import { MiniCalendar } from '@/components/ui/mini-calendar';
import { useRoomAvailability } from '@/hooks/useRoomAvailability';

interface ExpandableRoomCardProps {
  room: RoomType;
  onDateSelect?: (date: Date) => void;
}

export const ExpandableRoomCard: React.FC<ExpandableRoomCardProps> = ({
  room,
  onDateSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Fetch availability when expanded
  const { availability, loading, error } = useRoomAvailability(
    room.name,
    isExpanded, // Only fetch when expanded
    room.id
  );

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  }, [onDateSelect]);

  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl bg-white/5 border border-white/10 overflow-hidden",
        "transition-colors duration-200",
        isExpanded && "border-primary/30 bg-white/[0.07]"
      )}
    >
      {/* Card Header - Clickable to toggle */}
      <motion.button
        layout="position"
        onClick={toggleExpand}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors"
      >
        {/* Room Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
          <UnifiedImage
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Room Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{room.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/60">
              <Users className="w-3 h-3" />
              {room.kind === 'dorm' ? '1 bed' : `${room.capacity} guests`}
            </span>
          </div>
        </div>

        {/* Price & Expand Icon */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-bold text-white">₹{room.discountedPrice.toLocaleString()}</p>
            <p className="text-xs text-white/40">/{room.kind === 'dorm' ? 'bed' : 'night'}</p>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/50"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.button>

      {/* Expandable Calendar Section */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.2, delay: 0.1 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.1 }
              }
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              {/* Divider */}
              <div className="h-px bg-white/10 mb-4" />

              {/* Calendar Label */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/70">
                  Select a date to check availability
                </span>
                {loading && (
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Loading...
                  </span>
                )}
              </div>

              {/* Error State */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Mini Calendar */}
              <MiniCalendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                availability={availability}
              />

              {/* Selected Date Info */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
                >
                  <p className="text-sm text-primary font-medium">
                    {new Intl.DateTimeFormat('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }).format(selectedDate)}
                  </p>
                  {availability[selectedDate.toISOString().split('T')[0]] && (
                    <p className="text-xs text-white/60 mt-1">
                      {availability[selectedDate.toISOString().split('T')[0]].available} of {availability[selectedDate.toISOString().split('T')[0]].total} available
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExpandableRoomCard;
