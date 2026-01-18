import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  CheckCircle2, Calendar, Users, MessageCircle, Lock, 
  X, ArrowRight, Bell, Shield, Sparkles, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface EnquirySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomCount: number;
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
  isAuthenticated
}: EnquirySuccessModalProps) => {
  const navigate = useNavigate();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEE, MMM d');
    } catch {
      return dateStr;
    }
  };

  const handleSignIn = () => {
    onClose();
    navigate('/user/auth');
  };

  const handleClose = () => {
    onClose();
  };

  const firstName = guestName.split(' ')[0];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 999999 }}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-background rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/80 hover:bg-muted transition-colors z-10"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Success header with gradient */}
            <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 px-6 pt-8 pb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-4"
              >
                <h2 className="text-2xl font-bold text-white">Request Received!</h2>
                <p className="text-emerald-100 mt-1">Thank you, {firstName}!</p>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full shadow-lg text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Pending Host Confirmation
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="px-6 pt-8 pb-6 space-y-5">
              {/* Booking summary card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-muted/50 rounded-2xl p-4 border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Stay</span>
                  <span className="text-xs text-muted-foreground">{roomCount} room{roomCount > 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Check-in</span>
                    </div>
                    <p className="font-semibold text-foreground">{formatDate(checkIn)}</p>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-muted-foreground/50" />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Check-out</span>
                    </div>
                    <p className="font-semibold text-foreground">{formatDate(checkOut)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{guests} guest{guests > 1 ? 's' : ''}</span>
                </div>
              </motion.div>

              {/* Chat with host - Locked */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Chat with Host</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                      <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Locked</span>
                    </div>
                  </div>
                  
                  {/* Blurred preview messages */}
                  <div className="space-y-2 select-none pointer-events-none">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">X</span>
                      </div>
                      <div className="flex-1 blur-[3px]">
                        <div className="bg-muted rounded-2xl rounded-tl-none px-3 py-2 max-w-[85%]">
                          <p className="text-sm text-muted-foreground">Hi! Thanks for your booking request. Let me check availability...</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="flex-1 blur-[3px] flex justify-end">
                        <div className="bg-primary/10 rounded-2xl rounded-tr-none px-3 py-2 max-w-[85%]">
                          <p className="text-sm text-muted-foreground">Thanks! Can I get early check-in?</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-end justify-center rounded-2xl bg-gradient-to-t from-background/90 via-background/50 to-transparent">
                    <div className="pb-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Sign in to chat with your host</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sign in prompt or benefits */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {!isAuthenticated ? (
                  <div className="space-y-3">
                    <Button
                      onClick={handleSignIn}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-6 rounded-xl shadow-lg"
                    >
                      <span>Sign in to unlock features</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <MessageCircle className="w-4 h-4 mx-auto text-primary mb-1" />
                        <span className="text-[10px] text-muted-foreground">Chat with Host</span>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Bell className="w-4 h-4 mx-auto text-primary mb-1" />
                        <span className="text-[10px] text-muted-foreground">Get Updates</span>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Sparkles className="w-4 h-4 mx-auto text-primary mb-1" />
                        <span className="text-[10px] text-muted-foreground">Download Invoice</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">You'll receive updates via notifications</span>
                    </div>
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="w-full py-5 rounded-xl font-medium"
                    >
                      Got it!
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Footer note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-center text-muted-foreground"
              >
                Our host typically responds within 2 hours
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
