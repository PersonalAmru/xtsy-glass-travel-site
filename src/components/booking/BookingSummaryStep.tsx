/**
 * BookingSummaryStep - Extracted from SimplifiedBookingFlow for code splitting
 * Step 1 of 2-step booking flow
 */

import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MapPin, Bed, ChevronRight, Shield } from 'lucide-react';
import UnifiedImage from '@/components/UnifiedImage';
import { RoomType } from '@/data/roomInventory';

interface SelectedRoom {
  room: RoomType;
  quantity: number;
}

interface BookingSummaryStepProps {
  checkIn: Date;
  checkOut: Date;
  selectedRooms: SelectedRoom[];
  nights: number;
  propertyName: string;
  subtotal: number;
  gstAmount: number;
  total: number;
  onNext: () => void;
}

const BookingSummaryStep: React.FC<BookingSummaryStepProps> = ({
  checkIn,
  checkOut,
  selectedRooms,
  nights,
  propertyName,
  subtotal,
  gstAmount,
  total,
  onNext,
}) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)] px-4 pb-32">
      {/* Property & Location */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4"
      >
        <div className="flex items-center gap-2 text-white/70">
          <MapPin className="w-4 h-4" />
          <span className="font-medium text-white">{propertyName}</span>
        </div>
        <p className="text-sm text-white/50 mt-1">Shillong, Meghalaya</p>
      </motion.div>

      {/* Date & Nights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Check-in</p>
            <p className="font-semibold text-white">{format(checkIn, 'EEE, MMM d')}</p>
            <p className="text-sm text-white/40">After 12:00 PM</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Check-out</p>
            <p className="font-semibold text-white">{format(checkOut, 'EEE, MMM d')}</p>
            <p className="text-sm text-white/40">Before 10:00 AM</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between">
            <span className="text-white/50">Duration</span>
            <span className="font-medium text-white">{nights} night{nights > 1 ? 's' : ''}</span>
          </div>
        </div>
      </motion.div>

      {/* Selected Rooms */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4"
      >
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Bed className="w-4 h-4 text-primary" />
          Selected Rooms
        </h4>
        <div className="space-y-3">
          {selectedRooms.map(({ room, quantity }) => (
            <div key={room.id} className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                <UnifiedImage
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">{room.name}</p>
                <p className="text-xs text-white/50">
                  {quantity} × {room.kind === 'dorm' ? 'bed' : 'room'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">₹{(room.discountedPrice * quantity * nights).toLocaleString()}</p>
                <p className="text-xs text-white/40">{nights}N</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Price Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4"
      >
        <h4 className="font-semibold text-white mb-3">Price Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">Room charges ({nights} night{nights > 1 ? 's' : ''})</span>
            <span className="text-white">₹{subtotal.toLocaleString()}</span>
          </div>
          {gstAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-white/50">GST (5%)</span>
              <span className="text-white">₹{gstAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-white/10 font-bold text-lg">
            <span className="text-white">Total</span>
            <span className="text-white">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Pay at Hotel Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"
      >
        <Shield className="w-5 h-5 text-emerald-400" />
        <div>
          <p className="font-medium text-emerald-400">Pay at Hotel</p>
          <p className="text-sm text-white/50">No advance payment required</p>
        </div>
      </motion.div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-[hsl(220,20%,12%)] via-[hsl(220,20%,12%)] to-transparent pt-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full h-14 rounded-2xl font-bold text-base bg-white text-[hsl(220,20%,15%)] shadow-xl shadow-black/20 flex items-center justify-center gap-2"
        >
          Continue to Guest Details
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default BookingSummaryStep;
