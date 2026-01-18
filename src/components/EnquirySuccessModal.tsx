import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  CheckCircle2, Calendar, Users, MessageCircle, Lock, 
  X, ArrowRight, Bell, Shield, Sparkles, Clock, Home,
  Download, CreditCard, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface EnquirySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomCount: number;
  roomType?: string;
  totalAmount?: number;
  isAuthenticated: boolean;
}

const EnquirySuccessModal = ({ 
  isOpen, 
  onClose, 
  guestName,
  checkIn,
  checkOut,
  guests,
  roomCount,
  roomType,
  totalAmount,
  isAuthenticated
}: EnquirySuccessModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEE, MMM d');
    } catch {
      return dateStr;
    }
  };

  const getNights = () => {
    try {
      return differenceInDays(parseISO(checkOut), parseISO(checkIn));
    } catch {
      return 1;
    }
  };

  const handleSignIn = () => {
    onClose();
    navigate('/auth', { state: { from: '/profile' } });
  };

  const handleViewProfile = () => {
    onClose();
    navigate('/profile');
  };

  const handleGoHome = () => {
    onClose();
    navigate('/');
  };

  const firstName = guestName.split(' ')[0];
  const nights = getNights();

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          style={{ zIndex: 999999 }}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={handleGoHome}
          />

          {/* Modal - Airbnb-inspired design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative w-full max-w-[420px] bg-background rounded-[28px] shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleGoHome}
              className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-10 backdrop-blur-sm"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Success header - Gradient celebration */}
            <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 px-5 pt-8 pb-14">
              {/* Animated confetti dots */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 100, opacity: [0, 1, 0] }}
                    transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, repeatDelay: 3 }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ 
                      left: `${15 + i * 15}%`, 
                      backgroundColor: ['#fff', '#ffd700', '#ff6b6b', '#4ecdc4', '#a855f7', '#f472b6'][i],
                      opacity: 0.6
                    }}
                  />
                ))}
              </div>
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl relative"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-white/30"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-4"
              >
                <h2 className="text-2xl font-bold text-white">Request Sent!</h2>
                <p className="text-emerald-100/90 mt-1 text-sm">Thank you, {firstName}! 🎉</p>
              </motion.div>

              {/* Status badge - floating */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-full shadow-lg text-sm font-semibold">
                  <Clock className="w-4 h-4" />
                  Awaiting Host Confirmation
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="px-5 pt-8 pb-5 space-y-4">
              {/* Booking summary card - Premium style */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-muted/60 to-muted/30 rounded-2xl p-4 border border-border/50"
              >
                {/* Property header */}
                <div className="flex items-start gap-3 mb-4 pb-4 border-b border-border/30">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm leading-tight">XTSY Traveller's Hostel</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{roomType || 'Premium Stay'}</p>
                    <p className="text-xs text-muted-foreground">Shillong, Meghalaya</p>
                  </div>
                </div>
                
                {/* Date grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-background/60 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[11px] uppercase tracking-wide font-medium">Check-in</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm">{formatDate(checkIn)}</p>
                  </div>
                  
                  <div className="bg-background/60 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[11px] uppercase tracking-wide font-medium">Check-out</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm">{formatDate(checkOut)}</p>
                  </div>
                </div>

                {/* Stay details row */}
                <div className="flex items-center justify-between text-sm bg-background/40 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{nights}</span> night{nights > 1 ? 's' : ''}
                    </span>
                    <span className="text-border">•</span>
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{guests}</span> guest{guests > 1 ? 's' : ''}
                    </span>
                    <span className="text-border">•</span>
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{roomCount}</span> room{roomCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {totalAmount && (
                  <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Total</span>
                    <span className="text-lg font-bold text-foreground">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </motion.div>

              {/* Chat preview - Locked */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative overflow-hidden"
              >
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl p-4 border border-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground text-sm">Chat with Host</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/20 rounded-full">
                      <Lock className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] font-semibold text-amber-500 uppercase">Locked</span>
                    </div>
                  </div>
                  
                  {/* Blurred messages */}
                  <div className="space-y-2 blur-[2px] opacity-60 select-none pointer-events-none">
                    <div className="flex gap-2">
                      <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 max-w-[75%]">
                        <p className="text-xs text-muted-foreground">Hi! Thank you for your request...</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-primary/20 rounded-xl rounded-tr-sm px-3 py-2 max-w-[75%]">
                        <p className="text-xs text-muted-foreground">Can I request early check-in?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end justify-center rounded-2xl pb-3">
                  <p className="text-xs text-muted-foreground">Sign in to chat with your host</p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
              >
                {!isAuthenticated ? (
                  <>
                    <Button
                      onClick={handleSignIn}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold h-12 rounded-xl shadow-lg shadow-primary/20"
                    >
                      <span>Sign in to unlock features</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        { icon: MessageCircle, label: 'Host Chat' },
                        { icon: Bell, label: 'Updates' },
                        { icon: Download, label: 'Invoice' },
                        { icon: CreditCard, label: 'Pay Online' },
                      ].map((feature) => (
                        <div
                          key={feature.label}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-muted/50 text-muted-foreground"
                        >
                          <feature.icon className="w-3 h-3" />
                          <span className="text-[10px] font-medium">{feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleViewProfile}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold h-12 rounded-xl"
                    >
                      <span>View My Bookings</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <div className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-xl">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-500">You'll be notified when host confirms</span>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleGoHome}
                  variant="ghost"
                  className="w-full h-10 text-muted-foreground hover:text-foreground"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </motion.div>

              {/* Footer note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-[11px] text-center text-muted-foreground pt-2"
              >
                Our host typically confirms within <span className="font-medium text-foreground">2-4 hours</span>
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default EnquirySuccessModal;
