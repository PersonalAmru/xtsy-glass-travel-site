/**
 * GuestStepper - Modern +/- stepper for guest selection
 * Premium UI with haptic feedback and animations
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuestStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function GuestStepper({ 
  value, 
  onChange, 
  min = 1, 
  max = 20,
  className 
}: GuestStepperProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDecrement = useCallback(() => {
    if (value > min) {
      setIsAnimating(true);
      onChange(value - 1);
      setTimeout(() => setIsAnimating(false), 150);
    }
  }, [value, min, onChange]);

  const handleIncrement = useCallback(() => {
    if (value < max) {
      setIsAnimating(true);
      onChange(value + 1);
      setTimeout(() => setIsAnimating(false), 150);
    }
  }, [value, max, onChange]);

  return (
    <div className={cn(
      "flex items-center justify-between",
      "bg-white/5 border border-white/10 rounded-xl h-12 px-3",
      className
    )}>
      {/* Icon */}
      <Users className="w-4 h-4 text-white/40" />
      
      {/* Stepper Controls */}
      <div className="flex items-center gap-4">
        {/* Decrement Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          disabled={value <= min}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all",
            value > min
              ? "bg-white/10 hover:bg-white/20 text-white active:bg-white/30"
              : "bg-white/5 text-white/20 cursor-not-allowed"
          )}
          aria-label="Decrease guests"
        >
          <Minus className="w-4 h-4" />
        </motion.button>

        {/* Value Display */}
        <div className="min-w-[2.5rem] text-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              initial={{ opacity: 0, y: isAnimating ? -10 : 0, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="text-lg font-bold text-white tabular-nums"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Increment Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          disabled={value >= max}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all",
            value < max
              ? "bg-white/10 hover:bg-white/20 text-white active:bg-white/30"
              : "bg-white/5 text-white/20 cursor-not-allowed"
          )}
          aria-label="Increase guests"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}

export default GuestStepper;
