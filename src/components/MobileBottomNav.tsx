import React, { useState, useEffect } from 'react';
import { Home, Compass, CalendarCheck, Sparkles, Phone, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from '@/lib/router-compat';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBookingPulse, setShowBookingPulse] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide nav on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY && currentScrollY > 100;
      
      setIsVisible(!scrollingDown);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Pulse animation trigger for booking CTA
  useEffect(() => {
    const timer = setInterval(() => {
      setShowBookingPulse(true);
      setTimeout(() => setShowBookingPulse(false), 2000);
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/', activeColor: 'text-primary' },
    { icon: Compass, label: 'Explore', path: '/gallery', activeColor: 'text-primary' },
    { icon: CalendarCheck, label: 'Book Now', path: '/booking', isBooking: true },
    { icon: Sparkles, label: 'Travel', path: '/travel', activeColor: 'text-primary' },
    { icon: Phone, label: 'Call', path: 'tel:+918837317070', external: true },
  ];

  const handleBookingClick = () => {
    navigate('/booking');
  };

  // Don't show on booking page or admin pages
  if (location.pathname.startsWith('/booking') || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        >
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl border-t border-border/50" />
          
          {/* Safe area padding for iPhone notch */}
          <div className="relative flex items-end justify-around pb-safe-area-inset-bottom">
            <div className="flex w-full justify-around items-end py-2 px-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                // Special booking button
                if (item.isBooking) {
                  return (
                    <button
                      key={index}
                      onClick={handleBookingClick}
                      aria-label="Book a stay"
                      className="relative flex flex-col items-center justify-center -mt-5"
                    >
                      {/* Pulse ring animation */}
                      <AnimatePresence>
                        {showBookingPulse && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0.8 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-full bg-primary"
                          />
                        )}
                      </AnimatePresence>
                      
                      {/* Main booking button */}
                      <motion.div
                        whileTap={{ scale: 0.92 }}
                        className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center",
                          "bg-gradient-to-br from-primary to-primary/80",
                          "shadow-lg shadow-primary/30",
                          "ring-4 ring-background"
                        )}
                      >
                        <CalendarCheck className="w-6 h-6 text-primary-foreground" />
                      </motion.div>
                      <span className="text-[10px] mt-1.5 font-semibold text-primary">
                        Book
                      </span>
                    </button>
                  );
                }
                
                // External link (phone)
                if (item.external) {
                  return (
                    <a
                      key={index}
                      href={item.path}
                      aria-label={item.label}
                      className="flex flex-col items-center justify-center py-2 px-3 min-w-[56px] touch-target"
                    >
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                      <span className="text-[10px] mt-1 font-medium text-muted-foreground">
                        {item.label}
                      </span>
                    </a>
                  );
                }
                
                // Regular nav item
                return (
                  <Link
                    key={index}
                    to={item.path}
                    aria-label={item.label}
                    className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[56px] touch-target"
                  >
                    <motion.div 
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavDot"
                          className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                      <Icon 
                        className={cn(
                          "w-5 h-5 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )} 
                      />
                    </motion.div>
                    <span 
                      className={cn(
                        "text-[10px] mt-1 font-medium transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Bottom safe area fill */}
          <div className="h-safe-area-inset-bottom bg-background/90" />
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileBottomNav;
