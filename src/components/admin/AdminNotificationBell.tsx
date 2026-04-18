import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, MessageSquare, Calendar, CreditCard, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'new_booking' | 'new_message' | 'booking_update' | 'payment_received';
  title: string;
  message: string;
  booking_id: string | null;
  metadata: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

interface AdminNotificationBellProps {
  onNotificationClick?: (notification: Notification) => void;
}

const notificationIcons = {
  new_booking: Calendar,
  new_message: MessageSquare,
  booking_update: Bell,
  payment_received: CreditCard,
};

const notificationColors = {
  new_booking: 'bg-emerald-500',
  new_message: 'bg-blue-500',
  booking_update: 'bg-amber-500',
  payment_received: 'bg-purple-500',
};

export const AdminNotificationBell: React.FC<AdminNotificationBellProps> = ({
  onNotificationClick,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  useEffect(() => {
    let isMounted = true;
    
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }
        
        if (isMounted && data) {
          // Safely transform data with default values
          const safeNotifications = data.map((n) => ({
            id: n.id || '',
            type: (n.type as Notification['type']) || 'booking_update',
            title: n.title || 'Notification',
            message: n.message || '',
            booking_id: n.booking_id,
            metadata: (n.metadata as Record<string, any>) || {},
            is_read: n.is_read ?? false,
            created_at: n.created_at || new Date().toISOString(),
          }));
          setNotifications(safeNotifications);
          setUnreadCount(safeNotifications.filter((n) => !n.is_read).length);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_notifications',
        },
        (payload) => {
          try {
            const n = payload.new;
            const newNotif: Notification = {
              id: n.id || '',
              type: (n.type as Notification['type']) || 'booking_update',
              title: n.title || 'Notification',
              message: n.message || '',
              booking_id: n.booking_id,
              metadata: (n.metadata as Record<string, any>) || {},
              is_read: n.is_read ?? false,
              created_at: n.created_at || new Date().toISOString(),
            };
            
            if (isMounted) {
              setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
              setUnreadCount((prev) => prev + 1);
              
              // Browser notification
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(newNotif.title, {
                  body: newNotif.message,
                  icon: '/xtsy-favicon.png',
                  tag: newNotif.id,
                });
              }
            }
          } catch (err) {
            console.error('Failed to process new notification:', err);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('admin_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from('admin_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .in('id', unreadIds);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    onNotificationClick?.(notification);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        className={cn(
          "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          "bg-white/10 hover:bg-white/20 text-white",
          unreadCount > 0 && "ring-2 ring-red-500/40"
        )}
      >
        <Bell className={cn("w-5 h-5", unreadCount > 0 && "animate-[wiggle_1.2s_ease-in-out_infinite]")} />
        {unreadCount > 0 && (
          <>
            {/* Persistent pulse ring to draw attention */}
            <motion.span
              className="absolute inset-0 rounded-full bg-red-500/30"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full",
                "bg-red-500 text-white text-xs font-bold flex items-center justify-center",
                "shadow-lg shadow-red-500/50 z-10"
              )}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - higher z-index to ensure it's above other elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20"
              style={{ zIndex: 9998 }}
              onClick={() => setIsOpen(false)}
            />
            {/* Dropdown panel - solid background, very high z-index */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 max-h-[70vh] overflow-hidden rounded-xl shadow-2xl border border-slate-700"
              style={{ 
                zIndex: 9999, 
                backgroundColor: 'hsl(160, 35%, 12%)',
                isolation: 'isolate'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-white font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="w-10 h-10 text-white/20 mb-3" />
                    <p className="text-white/50 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = notificationIcons[notification.type] || Bell;
                    const colorClass = notificationColors[notification.type] || 'bg-slate-500';
                    
                    // Safe date parsing
                    let timeAgo = 'Just now';
                    try {
                      const createdDate = new Date(notification.created_at);
                      if (!isNaN(createdDate.getTime())) {
                        timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
                      }
                    } catch {
                      // Use default "Just now"
                    }
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(notification);
                        }}
                        className={cn(
                          "flex gap-3 p-4 border-b border-white/5 cursor-pointer transition-colors",
                          notification.is_read
                            ? "bg-transparent hover:bg-white/5"
                            : "bg-white/5 hover:bg-white/10"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", colorClass)}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-sm font-medium truncate",
                              notification.is_read ? "text-white/70" : "text-white"
                            )}>
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-white/50 truncate mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-white/30 mt-1">
                            {timeAgo}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotificationBell;
