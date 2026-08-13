/**
 * BookingDetailModal - Comprehensive booking view with chat, details, and actions
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Bed,
  IndianRupee,
  Clock,
  MessageSquare,
  Check,
  AlertTriangle,
  Send,
  Building2,
  CheckCheck,
  FileText,
  Users,
  CreditCard,
  Home,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { format, parseISO, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

interface BookingDetails {
  id: string;
  booking_id: string;
  guest_name: string;
  email: string;
  whatsapp_number: string | null;
  room_type: string;
  room_type_id: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  quantity: number;
  subtotal: number;
  taxes: number;
  total_amount: number;
  booking_status: string;
  payment_status: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  emergency_contact: string | null;
  special_requests: string | null;
  source: string | null;
  created_at: string;
  approved_at: string | null;
  no_show_marked_at: string | null;
}

interface Message {
  id: string;
  booking_id: string;
  sender_type: 'guest' | 'admin';
  sender_name: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface BookingDetailModalProps {
  bookingId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (bookingId: string) => Promise<void>;
  onDeny?: (bookingId: string) => void;
  onMarkNoShow?: (bookingId: string) => Promise<void>;
  actionLoading?: boolean;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  bookingId,
  isOpen,
  onClose,
  onApprove,
  onDeny,
  onMarkNoShow,
  actionLoading = false,
}) => {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch booking details
  useEffect(() => {
    if (!bookingId || !isOpen) {
      setBooking(null);
      return;
    }

    const fetchBooking = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (error) throw error;
        setBooking(data as BookingDetails);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, isOpen]);

  // Fetch messages
  useEffect(() => {
    if (!bookingId || !isOpen) return;

    const fetchMessages = async () => {
      setMessagesLoading(true);
      const { data, error } = await supabase
        .from('booking_messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
        const unread = data.filter(m => !m.is_read && m.sender_type === 'guest').length;
        setUnreadCount(unread);
      }
      setMessagesLoading(false);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`booking-detail-messages-${bookingId}`)
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
          setMessages((prev) => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          if (newMsg.sender_type === 'guest') {
            setUnreadCount(c => c + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Mark messages as read when viewing chat
  useEffect(() => {
    if (activeTab !== 'chat' || messages.length === 0) return;

    const unreadMessages = messages.filter(m => !m.is_read && m.sender_type === 'guest');
    if (unreadMessages.length > 0) {
      supabase
        .from('booking_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', unreadMessages.map(m => m.id))
        .then(() => setUnreadCount(0));
    }
  }, [activeTab, messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending || !bookingId) return;

    setIsSending(true);
    const text = newMessage.trim();
    setNewMessage('');

    try {
      const { data, error } = await supabase
        .from('booking_messages')
        .insert({
          booking_id: bookingId,
          sender_type: 'admin',
          sender_name: 'XTSY Host',
          message: text,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data as Message];
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(text);
      toast.error('Failed to send message');
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

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending Approval', className: 'bg-amber-500/20 text-amber-600 border-amber-500/30' },
      confirmed: { label: 'Confirmed', className: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' },
      cancelled: { label: 'Cancelled', className: 'bg-red-500/20 text-red-600 border-red-500/30' },
      no_show: { label: 'No Show', className: 'bg-red-500/20 text-red-600 border-red-500/30' },
      completed: { label: 'Completed', className: 'bg-blue-500/20 text-blue-600 border-blue-500/30' },
    };
    const c = config[status] || { label: status, className: 'bg-muted text-muted-foreground' };
    return <Badge className={cn('border', c.className)}>{c.label}</Badge>;
  };

  const nights = booking ? differenceInDays(parseISO(booking.check_out), parseISO(booking.check_in)) : 0;

  const canMarkNoShow = booking?.booking_status === 'confirmed' && booking?.check_in
    ? new Date() >= parseISO(booking.check_in)
    : false;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !booking ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Booking not found
          </div>
        ) : (
          <>
            {/* Header */}
            <DialogHeader className="p-4 pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {booking.guest_name}
                  </DialogTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="font-mono text-xs">
                      {booking.booking_id}
                    </Badge>
                    {getStatusBadge(booking.booking_status)}
                    {booking.source && (
                      <Badge variant="secondary" className="text-xs">
                        {booking.source}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="mx-4 mt-4 grid grid-cols-3 w-auto">
                <TabsTrigger value="details" className="gap-1.5">
                  <FileText className="w-4 h-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="guest" className="gap-1.5">
                  <User className="w-4 h-4" />
                  Guest Info
                </TabsTrigger>
                <TabsTrigger value="chat" className="gap-1.5 relative">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="flex-1 overflow-auto m-0 p-4 space-y-4">
                {/* Booking Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Booking Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard
                      icon={Calendar}
                      label="Check-in"
                      value={format(parseISO(booking.check_in), 'EEE, MMM d, yyyy')}
                    />
                    <InfoCard
                      icon={Calendar}
                      label="Check-out"
                      value={format(parseISO(booking.check_out), 'EEE, MMM d, yyyy')}
                    />
                    <InfoCard
                      icon={Clock}
                      label="Duration"
                      value={`${nights} night${nights !== 1 ? 's' : ''}`}
                    />
                    <InfoCard
                      icon={Bed}
                      label="Room"
                      value={`${booking.room_type} × ${booking.quantity}`}
                    />
                    <InfoCard
                      icon={Users}
                      label="Guests"
                      value={`${booking.guests} guest${booking.guests !== 1 ? 's' : ''}`}
                    />
                    <InfoCard
                      icon={FileText}
                      label="Booked On"
                      value={format(parseISO(booking.created_at), 'MMM d, yyyy h:mm a')}
                    />
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pricing Breakdown
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{booking.subtotal?.toLocaleString() || '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes & GST</span>
                      <span>₹{booking.taxes?.toLocaleString() || '—'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{booking.total_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.special_requests && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Special Requests</h4>
                      <p className="text-sm bg-muted/50 rounded-lg p-3">{booking.special_requests}</p>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Guest Info Tab */}
              <TabsContent value="guest" className="flex-1 overflow-auto m-0 p-4 space-y-4">
                <div className="grid gap-3">
                  <InfoCard icon={User} label="Name" value={booking.guest_name} />
                  <InfoCard icon={Mail} label="Email" value={booking.email} copyable />
                  {booking.whatsapp_number && (
                    <InfoCard icon={Phone} label="WhatsApp" value={booking.whatsapp_number} copyable />
                  )}
                  {booking.emergency_contact && (
                    <InfoCard icon={Phone} label="Emergency Contact" value={booking.emergency_contact} copyable />
                  )}
                </div>

                {(booking.address || booking.city || booking.state) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Address
                      </h4>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                        {booking.address && <p>{booking.address}</p>}
                        <p>
                          {[booking.city, booking.state, booking.pincode].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Chat Tab */}
              <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
                <ScrollArea className="flex-1 p-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <MessageSquare className="w-10 h-10 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground text-sm">No messages yet</p>
                      <p className="text-muted-foreground/70 text-xs">Start the conversation with your guest</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <ChatBubble key={msg.id} message={msg} isOwn={msg.sender_type === 'admin'} />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Chat Input */}
                <div className="p-3 border-t bg-muted/30">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 h-10 px-3 rounded-lg bg-background border text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      disabled={isSending}
                    />
                    <Button
                      size="icon"
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Footer */}
            <div className="p-4 border-t bg-muted/20 flex flex-wrap items-center gap-2">
              {booking.booking_status === 'pending' && (
                <>
                  {onDeny && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeny(booking.id)}
                      disabled={actionLoading}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Deny
                    </Button>
                  )}
                  {onApprove && (
                    <Button
                      size="sm"
                      onClick={() => onApprove(booking.id)}
                      disabled={actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}
                </>
              )}
              {canMarkNoShow && onMarkNoShow && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onMarkNoShow(booking.id)}
                  disabled={actionLoading}
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Mark No-Show
                </Button>
              )}
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Helper Components
const InfoCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  copyable?: boolean;
}> = ({ icon: Icon, label, value, copyable }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 bg-muted/50 rounded-lg',
        copyable && 'cursor-pointer hover:bg-muted/70 transition-colors'
      )}
      onClick={copyable ? handleCopy : undefined}
    >
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
};

const ChatBubble: React.FC<{ message: Message; isOwn: boolean }> = ({ message, isOwn }) => {
  const time = format(new Date(message.created_at), 'h:mm a');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted rounded-bl-md'
        )}
      >
        {!isOwn && (
          <div className="flex items-center gap-1.5 mb-1">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              {message.sender_name}
            </span>
          </div>
        )}
        <p className="text-sm leading-relaxed">{message.message}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={cn('text-xs', isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
            {time}
          </span>
          {isOwn && (
            message.is_read ? (
              <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/80" />
            ) : (
              <Check className="w-3.5 h-3.5 text-primary-foreground/50" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingDetailModal;
