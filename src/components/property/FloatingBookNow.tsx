/**
 * FloatingBookNow - Fixed bottom-right floating CTA button
 * Visible during scroll on property detail page
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingBookNowProps {
  visible: boolean;
  onClick: () => void;
  priceFrom?: number;
}

export const FloatingBookNow = ({ visible, onClick, priceFrom }: FloatingBookNowProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl",
              "bg-gradient-to-r from-primary to-orange-500",
              "hover:from-primary/90 hover:to-orange-500/90",
              "text-white font-semibold text-base",
              "shadow-primary/30"
            )}
          >
            <div className="text-left">
              {priceFrom && (
                <p className="text-[10px] text-white/70 leading-none">From ₹{priceFrom.toLocaleString()}/night</p>
              )}
              <p className="font-bold">Book Now</p>
            </div>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingBookNow;
