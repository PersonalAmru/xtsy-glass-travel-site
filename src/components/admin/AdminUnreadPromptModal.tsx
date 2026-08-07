/**
 * Admin Unread Prompt Modal
 * Shows ONCE per admin session if there are unread bookings or guest messages.
 * Uses sessionStorage so it doesn't re-trigger on page navigations.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, MessageSquare, X, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const SESSION_KEY = 'xtsy_admin_unread_prompt_shown';

interface UnreadCounts {
  pendingBookings: number;
  unreadMessages: number;
  unreadNotifications: number;
}

export const AdminUnreadPromptModal = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<UnreadCounts | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show once per browser session
    if (sessionStorage.getItem(SESSION_KEY) === 'true') return;

    let cancelled = false;

    const fetchUnread = async () => {
      try {
        const [bookingsRes, messagesRes, notifsRes] = await Promise.all([
          supabase
            .from('bookings')
            .select('id', { count: 'exact', head: true })
            .eq('booking_status', 'pending'),
          supabase
            .from('booking_messages')
            .select('id', { count: 'exact', head: true })
            .eq('sender_type', 'guest')
            .eq('is_read', false),
          supabase
            .from('admin_notifications')
            .select('id', { count: 'exact', head: true })
            .eq('is_read', false),
        ]);

        if (cancelled) return;

        const c: UnreadCounts = {
          pendingBookings: bookingsRes.count ?? 0,
          unreadMessages: messagesRes.count ?? 0,
          unreadNotifications: notifsRes.count ?? 0,
        };

        const hasAnything =
          c.pendingBookings > 0 || c.unreadMessages > 0 || c.unreadNotifications > 0;

        if (hasAnything) {
          setCounts(c);
          // Small delay so it doesn't feel jarring at login
          setTimeout(() => setOpen(true), 600);
        } else {
          // Nothing pending → mark shown so we don't repeatedly query
          sessionStorage.setItem(SESSION_KEY, 'true');
        }
      } catch (err) {
        console.error('[AdminUnreadPromptModal] Failed to fetch unread:', err);
      }
    };

    fetchUnread();
    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setOpen(false);
  };

  const goTo = (path: string) => {
    dismiss();
    navigate(path);
  };

  if (!counts) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-labelledby="unread-prompt-title"
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-md rounded-3xl overflow-hidden',
              'bg-gradient-to-b from-[hsl(160,32%,15%)] via-[hsl(160,35%,12%)] to-[hsl(160,38%,8%)]',
              'border border-white/10 shadow-2xl'
            )}
          >
            {/* Close */}
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="px-6 pt-8 pb-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', damping: 14 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <Bell className="w-8 h-8 text-white" />
              </motion.div>
              <h2
                id="unread-prompt-title"
                className="text-2xl font-bold text-white mb-1"
              >
                You have pending items
              </h2>
              <p className="text-sm text-white/60">
                Welcome back. Here's what needs your attention.
              </p>
            </div>

            {/* Counts */}
            <div className="px-6 pb-2 space-y-2">
              {counts.pendingBookings > 0 && (
                <button
                  onClick={() => goTo('/admin/bookings')}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 transition-colors text-left group"
                >
                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-base">
                      {counts.pendingBookings} pending booking
                      {counts.pendingBookings !== 1 && 's'}
                    </p>
                    <p className="text-xs text-white/60">Awaiting your approval</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                </button>
              )}

              {counts.unreadMessages > 0 && (
                <button
                  onClick={() => goTo('/admin/chats')}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 transition-colors text-left group"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-base">
                      {counts.unreadMessages} unread message
                      {counts.unreadMessages !== 1 && 's'}
                    </p>
                    <p className="text-xs text-white/60">Guests are waiting for a reply</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                </button>
              )}

              {counts.unreadNotifications > 0 &&
                counts.pendingBookings === 0 &&
                counts.unreadMessages === 0 && (
                  <div className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-base">
                        {counts.unreadNotifications} new notification
                        {counts.unreadNotifications !== 1 && 's'}
                      </p>
                      <p className="text-xs text-white/60">
                        Tap the bell to review
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5">
              <button
                onClick={dismiss}
                className="w-full h-11 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Remind me later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminUnreadPromptModal;
