/**
 * Admin Guest Chats - Real-time chat management with all guests
 */

import { useState, useEffect, useCallback } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { BookingChat } from '@/components/chat/BookingChat';
import { cn } from '@/lib/utils';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import {
  MessageSquare,
  Search,
  RefreshCw,
  User,
  Calendar,
  Circle,
} from 'lucide-react';

interface ChatThread {
  booking_id: string;
  booking_ref: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  booking_status: string;
}

export default function AdminGuestChats() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const fetchChatThreads = useCallback(async () => {
    setLoading(true);
    try {
      // Get all bookings with messages
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, booking_id, guest_name, email, check_in, check_out, booking_status')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Get message counts and last messages for each booking
      const threadPromises = (bookings || []).map(async (booking) => {
        const { data: messages } = await supabase
          .from('booking_messages')
          .select('message, created_at, is_read, sender_type')
          .eq('booking_id', booking.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const { count } = await supabase
          .from('booking_messages')
          .select('*', { count: 'exact', head: true })
          .eq('booking_id', booking.id)
          .eq('sender_type', 'guest')
          .eq('is_read', false);

        const lastMessage = messages?.[0];

        return {
          booking_id: booking.id,
          booking_ref: booking.booking_id,
          guest_name: booking.guest_name,
          guest_email: booking.email,
          check_in: booking.check_in,
          check_out: booking.check_out,
          last_message: lastMessage?.message || '',
          last_message_at: lastMessage?.created_at || booking.check_in,
          unread_count: count || 0,
          booking_status: booking.booking_status,
        };
      });

      const threadData = await Promise.all(threadPromises);
      
      // Sort by last message date
      threadData.sort((a, b) => 
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );

      setThreads(threadData);
    } catch (error) {
      console.error('Error fetching chat threads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChatThreads();
  }, [fetchChatThreads]);

  // Real-time subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel('admin-chats')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'booking_messages',
      }, () => {
        fetchChatThreads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchChatThreads]);

  const filteredThreads = threads.filter((thread) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      thread.guest_name.toLowerCase().includes(searchLower) ||
      thread.guest_email.toLowerCase().includes(searchLower) ||
      thread.booking_ref.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-600';
      case 'pending':
        return 'bg-amber-500/20 text-amber-600';
      case 'no_show':
        return 'bg-red-500/20 text-red-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Guest Chats
            </h1>
            <p className="text-sm text-muted-foreground">Real-time communication with guests</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchChatThreads} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        </header>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by guest name, email, or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Chat Threads */}
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-2">
            {filteredThreads.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {search ? 'No chats found matching your search' : 'No chat threads yet'}
                </p>
              </Card>
            ) : (
              filteredThreads.map((thread) => (
                <Card
                  key={thread.booking_id}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-muted/50',
                    thread.unread_count > 0 && 'border-primary/50 bg-primary/5'
                  )}
                  onClick={() => {
                    setSelectedThread(thread);
                    setChatOpen(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                        {thread.unread_count > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary-foreground">
                              {thread.unread_count}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold truncate">{thread.guest_name}</p>
                            <Badge variant="outline" className="text-[10px] px-1.5">
                              {thread.booking_ref}
                            </Badge>
                          </div>
                          <Badge className={cn('text-[10px]', getStatusColor(thread.booking_status))}>
                            {thread.booking_status}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {thread.guest_email}
                        </p>

                        {thread.last_message && (
                          <p className="text-sm mt-2 line-clamp-1">
                            {thread.last_message}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(parseISO(thread.check_in), 'MMM d')} - {format(parseISO(thread.check_out), 'MMM d')}
                          </span>
                          {thread.last_message && (
                            <span className="flex items-center gap-1">
                              <Circle className="w-1.5 h-1.5 fill-current" />
                              {formatDistanceToNow(parseISO(thread.last_message_at), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Chat Modal */}
        {selectedThread && (
          <BookingChat
            bookingId={selectedThread.booking_id}
            guestName={selectedThread.guest_name}
            isOpen={chatOpen}
            onClose={() => {
              setChatOpen(false);
              setSelectedThread(null);
              fetchChatThreads(); // Refresh to update unread counts
            }}
            isAdmin={true}
          />
        )}
      </div>
    </UnifiedAdminLayout>
  );
}
