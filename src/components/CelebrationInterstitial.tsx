import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

interface CelebrationInterstitialProps {
  isOpen: boolean;
  guestName: string;
  onComplete: () => void;
}

const BRAND_COLORS = ['#10b981', '#14b8a6', '#f59e0b', '#fbbf24', '#a855f7', '#f472b6'];

const CelebrationInterstitial = ({ isOpen, guestName, onComplete }: CelebrationInterstitialProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);

  const firstName = guestName?.split(' ')[0] || 'Guest';

  useEffect(() => {
    if (!isOpen) return;

    // Fire side cannons for 3 seconds
    const end = Date.now() + 3000;

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: BRAND_COLORS,
        zIndex: 1000000,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: BRAND_COLORS,
        zIndex: 1000000,
      });

      frameRef.current = requestAnimationFrame(frame);
    };

    frame();

    // Auto-dismiss after 3 seconds
    timerRef.current = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 999999 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative text-center px-8 py-12 max-w-md"
          >
            {/* Sparkle icon */}
            <motion.div
              initial={{ rotate: -30, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            {/* Main message */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
            >
              We are excited to
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
                host you!
              </span>
            </motion.h1>

            {/* Guest name */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-emerald-200/80"
            >
              Welcome, {firstName} 🎉
            </motion.p>

            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-emerald-400/20 m-auto w-48 h-48 pointer-events-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CelebrationInterstitial;
