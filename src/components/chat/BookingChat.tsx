import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Building2, Check, CheckCheck, X, Sparkles, Lightbulb, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Message {
  id: string;
  booking_id: string;
  sender_type: 'guest' | 'admin';
  sender_name: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface BookingChatProps {
  bookingId: string;
  guestName?: string;
  checkInDate?: string;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

// AI-powered message suggestions
const AI_SUGGESTIONS = [
  "Hi! I'm excited to stay at XTSY. I'll be arriving around 2 PM.",
  "Could you share parking details and check-in instructions?",
  "Are there any local cafes or restaurants you'd recommend nearby?",
  "I'll be traveling with a friend. Looking forward to our stay!",
  "Can I request an early check-in if available?",
];

export const BookingChat: React.FC<BookingChatProps> = ({
  bookingId,
  guestName = 'Guest',
  checkInDate,
  isOpen,
  onClose,
  isAdmin = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!bookingId || !isOpen) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('booking_messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data as Message[]);
        // Hide suggestions if there are already messages
        if (data && data.length > 0) {
          setShowSuggestions(false);
        }
      }
      setIsLoading(false);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`booking-messages-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'booking_messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          setShowSuggestions(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Mark messages as read
  useEffect(() => {
    if (!isOpen || messages.length === 0) return;

    const unreadMessages = messages.filter(
      (m) => !m.is_read && m.sender_type !== (isAdmin ? 'admin' : 'guest')
    );

    if (unreadMessages.length > 0) {
      supabase
        .from('booking_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', unreadMessages.map((m) => m.id))
        .then(({ error }) => {
          if (error) console.error('Error marking messages read:', error);
        });
    }
  }, [messages, isOpen, isAdmin]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || newMessage.trim();
    if (!text || isSending) return;

    setIsSending(true);
    const originalMessage = newMessage;
    setNewMessage(''); // Clear immediately for better UX
    setShowSuggestions(false);

    try {
      const { data, error } = await supabase.from('booking_messages').insert({
        booking_id: bookingId,
        sender_type: isAdmin ? 'admin' : 'guest',
        sender_name: isAdmin ? 'XTSY Host' : guestName,
        message: text,
      }).select().single();

      if (error) {
        console.error('Error sending message:', error);
        setNewMessage(originalMessage); // Restore on error
        return;
      }

      // Optimistically add message to local state for immediate feedback
      if (data) {
        setMessages(prev => {
          // Check if message already exists (from realtime subscription)
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data as Message];
        });
      }
    } catch (err) {
      console.error('Send message error:', err);
      setNewMessage(originalMessage);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // Format the header title with guest name and check-in date
  const headerTitle = checkInDate 
    ? `${guestName} • ${format(new Date(checkInDate), 'MMM d')}`
    : guestName;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            // Mobile (default): true bottom-sheet, dynamic viewport height for keyboard
            "w-full h-[90dvh] max-h-[90dvh] rounded-t-3xl",
            // Small tablets (sm): a bit narrower, still bottom-anchored
            "sm:h-[85dvh] sm:max-h-[85dvh]",
            // Tablet (md): centered modal, fixed comfortable size
            "md:w-[460px] md:max-w-[92vw] md:h-[78dvh] md:max-h-[680px] md:min-h-[520px] md:rounded-3xl",
            // Desktop (lg): wider for inbox-style admin use
            "lg:w-[520px] lg:h-[75dvh] lg:max-h-[720px] lg:min-h-[560px]",
            // Extra-large screens (xl): admin gets even more breathing room
            "xl:w-[560px] xl:max-h-[760px]",
            // Common styles - Apple-grade glassmorphism
            "overflow-hidden flex flex-col",
            "bg-gradient-to-b from-[hsl(160,32%,15%)] via-[hsl(160,35%,12%)] to-[hsl(160,38%,8%)]",
            "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_10px_25px_-10px_rgba(0,0,0,0.3)]",
            "border border-white/[0.08]",
            // Glassmorphic effect with subtle texture
            "backdrop-blur-2xl backdrop-saturate-150"
          )}
        >
          {/* Header - Apple-grade design, responsive truncation */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10 bg-black/10 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold text-base sm:text-lg flex items-center gap-2 truncate">
                  XTSY Pings
                </h3>
                <p className="text-white/60 text-xs sm:text-sm truncate">{headerTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Send className="w-7 h-7 text-emerald-400" />
                </div>
                <p className="text-white/80 font-medium mb-1">Start the conversation!</p>
                <p className="text-white/50 text-sm">
                  Introduce yourself to your host and share your travel plans
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.sender_type === (isAdmin ? 'admin' : 'guest')}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Suggestions */}
          {showSuggestions && !isAdmin && messages.length === 0 && (
            <div className="px-4 pb-2">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggested messages</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {AI_SUGGESTIONS.slice(0, 3).map((suggestion, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 text-sm text-left transition-colors border border-white/5"
                  >
                    {suggestion.length > 50 ? `${suggestion.slice(0, 50)}...` : suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Input - Clean Apple-grade with proper keyboard handling */}
          <div className="p-4 border-t border-white/[0.08] bg-black/30 backdrop-blur-xl safe-area-inset-bottom">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                  // Scroll input into view on mobile
                  setTimeout(() => {
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 300);
                }}
                placeholder="Type a message..."
                className={cn(
                  "flex-1 h-12 px-4 rounded-2xl text-base",
                  "bg-white/[0.08] text-white placeholder:text-white/40",
                  "border border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.12]",
                  "focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20",
                  "transition-all duration-200"
                )}
                disabled={isSending}
                autoComplete="off"
                autoCorrect="on"
                spellCheck="true"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => sendMessage()}
                disabled={!newMessage.trim() || isSending}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200",
                  newMessage.trim()
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/[0.08] text-white/40"
                )}
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const MessageBubble: React.FC<{ message: Message; isOwn: boolean }> = ({
  message,
  isOwn,
}) => {
  const time = format(new Date(message.created_at), 'h:mm a');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex", isOwn ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isOwn
            ? "bg-emerald-500 text-white rounded-br-md"
            : "bg-white/10 text-white rounded-bl-md"
        )}
      >
        {!isOwn && (
          <div className="flex items-center gap-1.5 mb-1">
            {message.sender_type === 'admin' ? (
              <Building2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <User className="w-3 h-3 text-white/50" />
            )}
            <span className="text-xs font-medium text-white/70">
              {message.sender_name}
            </span>
          </div>
        )}
        <p className="text-sm leading-relaxed">{message.message}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={cn("text-xs", isOwn ? "text-white/60" : "text-white/40")}>
            {time}
          </span>
          {isOwn && (
            message.is_read ? (
              <CheckCheck className="w-3.5 h-3.5 text-white/80" />
            ) : (
              <Check className="w-3.5 h-3.5 text-white/50" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingChat;