import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Building2, Check, CheckCheck, X } from 'lucide-react';
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
  guestName: string;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export const BookingChat: React.FC<BookingChatProps> = ({
  bookingId,
  guestName,
  isOpen,
  onClose,
  isAdmin = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase.from('booking_messages').insert({
      booking_id: bookingId,
      sender_type: isAdmin ? 'admin' : 'guest',
      sender_name: isAdmin ? 'XTSY Host' : guestName,
      message: messageText,
    });

    if (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText);
    }
    
    setIsSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "w-full sm:max-w-lg h-[85vh] sm:h-[600px] sm:rounded-2xl overflow-hidden flex flex-col",
            "bg-gradient-to-b from-[hsl(160,35%,20%)] to-[hsl(160,40%,15%)]",
            "shadow-2xl border border-white/10"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div>
              <h3 className="text-white font-semibold text-lg">Booking Chat</h3>
              <p className="text-white/50 text-xs font-mono">{bookingId}</p>
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
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Send className="w-7 h-7 text-white/40" />
                </div>
                <p className="text-white/60">No messages yet</p>
                <p className="text-white/40 text-sm mt-1">
                  Start the conversation with your host
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

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className={cn(
                  "flex-1 h-12 px-4 rounded-xl",
                  "bg-white/10 text-white placeholder:text-white/40",
                  "border border-white/10 focus:border-white/30 focus:outline-none",
                  "transition-colors"
                )}
                disabled={isSending}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!newMessage.trim() || isSending}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  newMessage.trim()
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-white/40"
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
