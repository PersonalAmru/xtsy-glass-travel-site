/**
 * FloatingBookNow - Fixed bottom-right floating CTA button
 * Visible during scroll on property detail page
 * Uses premium ShinyButton component
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ShinyButton } from '@/components/ui/shiny-button';

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
          <ShinyButton onClick={onClick} size="lg">
            <div className="flex items-center gap-3">
              <div className="text-left">
                {priceFrom && (
                  <p className="text-[10px] opacity-70 leading-none">From ₹{priceFrom.toLocaleString()}/night</p>
                )}
                <p className="font-bold">Book Now</p>
              </div>
              <ChevronRight className="w-5 h-5" />
            </div>
          </ShinyButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingBookNow;
