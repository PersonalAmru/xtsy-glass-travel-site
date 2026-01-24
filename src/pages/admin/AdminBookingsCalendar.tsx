/**
 * Admin Bookings Calendar - Smart calendar with booking status
 * Shows check-in, stay-over, check-out, no-show status
 * Manages enquiries (XTH-ENQ) and triggers invoice (XTH-INV) on approval
 */

import { useState, useEffect, useCallback } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookingChat } from '@/components/chat/BookingChat';
import { DenyBookingDialog } from '@/components/admin/DenyBookingDialog';
import { getEnquiries, approveEnquiry, rejectEnquiry, Enquiry } from '@/services/enquiryService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, parseISO, differenceInHours } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Clock,
  LogIn,
  LogOut,
  Moon,
  AlertTriangle,
  Check,
  X,
  MessageSquare,
  RefreshCw,
  FileText,
  Send,
} from 'lucide-react';

interface Booking {
  id: string;
  booking_id: string;
  guest_name: string;
  email: string;
  room_type: string;
  check_in: string;
  check_out: string;
  booking_status: string;
  approved_at: string | null;
  no_show_marked_at: string | null;
  quantity: number;
  total_amount: number;
}

type BookingStatus = 'check_in' | 'stay_over' | 'check_out' | 'no_show';

interface DayBooking {
  booking: Booking;
  status: BookingStatus;
}

export default function AdminBookingsCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [enquiriesLoading, setEnquiriesLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Deny dialog state
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [bookingToDeny, setBookingToDeny] = useState<Booking | null>(null);
  
  // Enquiry reject dialog state
  const [rejectEnquiryDialogOpen, setRejectEnquiryDialogOpen] = useState(false);
  const [enquiryToReject, setEnquiryToReject] = useState<Enquiry | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);
      
      const { data, error } = await supabase.rpc('get_booking_calendar', {
        p_start_date: format(startDate, 'yyyy-MM-dd'),
        p_end_date: format(endDate, 'yyyy-MM-dd'),
      });

      if (error) throw error;
      setBookings((data as unknown as Booking[]) || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('bookings-calendar')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
      }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings]);

  const getBookingStatusForDate = (booking: Booking, date: Date): BookingStatus | null => {
    const checkIn = parseISO(booking.check_in);
    const checkOut = parseISO(booking.check_out);
    
    // Handle no-show status - show no_show for all dates of the booking
    if (booking.booking_status === 'no_show') {
      if (isSameDay(date, checkIn) || isSameDay(date, checkOut) || (date > checkIn && date < checkOut)) {
        return 'no_show';
      }
      return null;
    }
    
    // Handle cancelled - don't show on calendar but include in list
    if (booking.booking_status === 'cancelled') {
      if (isSameDay(date, checkIn)) {
        return 'check_in'; // Will be styled differently based on booking_status
      }
      return null;
    }
    
    // Check-in day
    if (isSameDay(date, checkIn)) {
      return 'check_in';
    }
    
    // Check-out day
    if (isSameDay(date, checkOut)) {
      return 'check_out';
    }
    
    // Stay over (between check-in and check-out, exclusive)
    if (date > checkIn && date < checkOut) {
      return 'stay_over';
    }
    
    return null;
  };

  const getBookingsForDate = (date: Date): DayBooking[] => {
    const dayBookings: DayBooking[] = [];
    
    for (const booking of bookings) {
      const status = getBookingStatusForDate(booking, date);
      if (status) {
        dayBookings.push({ booking, status });
      }
    }
    
    // Sort by status priority: check_in first, then stay_over, then check_out, then no_show
    const statusOrder: Record<BookingStatus, number> = {
      'check_in': 1,
      'stay_over': 2,
      'check_out': 3,
      'no_show': 4,
    };
    
    return dayBookings.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  };

  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case 'check_in':
        return {
          label: 'Check-in Today',
          icon: LogIn,
          color: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
          dotColor: 'bg-emerald-500',
        };
      case 'stay_over':
        return {
          label: 'Stay Over',
          icon: Moon,
          color: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
          dotColor: 'bg-blue-500',
        };
      case 'check_out':
        return {
          label: 'Check-out',
          icon: LogOut,
          color: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
          dotColor: 'bg-amber-500',
        };
      case 'no_show':
        return {
          label: 'No Show',
          icon: AlertTriangle,
          color: 'bg-red-500/20 text-red-600 border-red-500/30',
          dotColor: 'bg-red-500',
        };
    }
  };

  const handleApproveBooking = async (booking: Booking) => {
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('approve_booking_and_block_inventory', {
        p_booking_id: booking.id,
        p_admin_id: user.id,
      });

      if (error) throw error;
      
      const result = data as { success?: boolean; error?: string } | null;
      if (result?.success) {
        toast.success('Booking approved and inventory blocked');
        fetchBookings();
      } else {
        toast.error(result?.error || 'Failed to approve booking');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Failed to approve booking');
    } finally {
      setActionLoading(false);
    }
  };

  const openDenyDialog = (booking: Booking) => {
    setBookingToDeny(booking);
    setDenyDialogOpen(true);
  };

  const handleDenyBooking = async (reason: string) => {
    if (!bookingToDeny) return;
    
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('deny_booking_with_message', {
        p_booking_id: bookingToDeny.id,
        p_admin_id: user.id,
        p_reason: reason,
      });

      if (error) throw error;
      
      const result = data as { success?: boolean; error?: string } | null;
      if (result?.success) {
        toast.success('Booking denied and guest notified');
        fetchBookings();
        setDenyDialogOpen(false);
        setBookingToDeny(null);
      } else {
        toast.error(result?.error || 'Failed to deny booking');
      }
    } catch (error) {
      console.error('Error denying booking:', error);
      toast.error('Failed to deny booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkNoShow = async (booking: Booking) => {
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('mark_booking_no_show', {
        p_booking_id: booking.id,
        p_admin_id: user.id,
      });

      if (error) throw error;
      
      const result = data as { success?: boolean; error?: string } | null;
      if (result?.success) {
        toast.success('Booking marked as no-show');
        fetchBookings();
        setSelectedBooking(null);
      } else {
        toast.error(result?.error || 'Failed to mark no-show');
      }
    } catch (error) {
      console.error('Error marking no-show:', error);
      toast.error('Failed to mark no-show');
    } finally {
      setActionLoading(false);
    }
  };

  const canMarkNoShow = (booking: Booking): boolean => {
    if (booking.booking_status !== 'confirmed') return false;
    const checkIn = parseISO(booking.check_in);
    const hoursSince = differenceInHours(new Date(), checkIn);
    return hoursSince >= 0 && hoursSince <= 48;
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate empty cells for first week
  const firstDayOfMonth = startOfMonth(currentMonth).getDay();
  const emptyCells = Array(firstDayOfMonth).fill(null);

  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Bookings Calendar
            </h1>
            <p className="text-sm text-muted-foreground">Manage bookings, approvals, and guest status</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchBookings} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        </header>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {(['check_in', 'stay_over', 'check_out', 'no_show'] as BookingStatus[]).map((status) => {
            const config = getStatusConfig(status);
            return (
              <div key={status} className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full', config.dotColor)} />
                <span className="text-sm text-muted-foreground">{config.label}</span>
              </div>
            );
          })}
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Prev
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0 md:p-4">
            {/* Week days header */}
            <div className="grid grid-cols-7 border-b border-border">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {emptyCells.map((_, index) => (
                <div key={`empty-${index}`} className="min-h-[80px] md:min-h-[100px] border-b border-r border-border bg-muted/30" />
              ))}
              {days.map((day) => {
                const dayBookings = getBookingsForDate(day);
                const hasBookings = dayBookings.length > 0;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => {
                      if (hasBookings) {
                        setSelectedDate(day);
                      }
                    }}
                    className={cn(
                      'min-h-[80px] md:min-h-[100px] p-1 md:p-2 border-b border-r border-border text-left transition-colors',
                      'hover:bg-muted/50',
                      isToday(day) && 'bg-primary/5',
                      hasBookings && 'cursor-pointer'
                    )}
                  >
                    <div className={cn(
                      'text-sm font-medium mb-1',
                      isToday(day) && 'text-primary'
                    )}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map(({ booking, status }) => {
                        const config = getStatusConfig(status);
                        return (
                          <div
                            key={`${booking.id}-${status}`}
                            className={cn(
                              'text-[10px] md:text-xs px-1 py-0.5 rounded truncate border',
                              config.color
                            )}
                          >
                            <span className="hidden md:inline">{booking.guest_name}</span>
                            <span className="md:hidden">{booking.guest_name.charAt(0)}</span>
                          </div>
                        );
                      })}
                      {dayBookings.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        {bookings.filter(b => b.booking_status === 'pending').length > 0 && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                <Clock className="w-5 h-5" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookings.filter(b => b.booking_status === 'pending').map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div>
                      <p className="font-medium">{booking.guest_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(booking.check_in), 'MMM d')} - {format(parseISO(booking.check_out), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setChatOpen(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDenyDialog(booking)}
                        disabled={actionLoading}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Deny
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveBooking(booking)}
                        disabled={actionLoading}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Day Details Modal */}
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </DialogTitle>
              <DialogDescription>
                All bookings associated with this date
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {selectedDate && getBookingsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No bookings for this date
                  </div>
                )}
                {selectedDate && getBookingsForDate(selectedDate).map(({ booking, status }) => {
                  const config = getStatusConfig(status);
                  const StatusIcon = config.icon;
                  
                  // Get booking status badge config
                  const bookingStatusBadge = {
                    pending: { label: 'Pending Approval', variant: 'secondary' as const },
                    confirmed: { label: 'Confirmed', variant: 'default' as const },
                    cancelled: { label: 'Cancelled', variant: 'destructive' as const },
                    no_show: { label: 'No Show', variant: 'destructive' as const },
                    completed: { label: 'Completed', variant: 'outline' as const },
                  }[booking.booking_status] || { label: booking.booking_status, variant: 'outline' as const };

                  return (
                    <Card key={`${booking.id}-${status}`} className="overflow-hidden">
                      {/* Status Header */}
                      <div className={cn('px-4 py-2 flex items-center justify-between', config.color)}>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <span className="font-medium text-sm">{config.label}</span>
                        </div>
                        <Badge variant={bookingStatusBadge.variant}>{bookingStatusBadge.label}</Badge>
                      </div>
                      
                      <CardContent className="p-4 space-y-4">
                        {/* Guest Info */}
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold flex items-center gap-2 text-lg">
                              <User className="w-4 h-4 text-muted-foreground" />
                              {booking.guest_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{booking.email}</p>
                          </div>
                          <Badge variant="outline" className="font-mono">{booking.booking_id}</Badge>
                        </div>

                        {/* Booking Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm bg-muted/50 rounded-lg p-3">
                          <div>
                            <p className="text-muted-foreground text-xs">Check-in</p>
                            <p className="font-medium">{format(parseISO(booking.check_in), 'MMM d, yyyy')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Check-out</p>
                            <p className="font-medium">{format(parseISO(booking.check_out), 'MMM d, yyyy')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Room</p>
                            <p className="font-medium truncate">{booking.room_type}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Amount</p>
                            <p className="font-medium">₹{booking.total_amount?.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setChatOpen(true);
                              setSelectedDate(null);
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Chat with Guest
                          </Button>
                          
                          {booking.booking_status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openDenyDialog(booking)}
                                disabled={actionLoading}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Deny
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApproveBooking(booking)}
                                disabled={actionLoading}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                            </>
                          )}
                          
                          {canMarkNoShow(booking) && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleMarkNoShow(booking)}
                              disabled={actionLoading}
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Mark No-Show
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Chat Modal */}
        {selectedBooking && (
          <BookingChat
            bookingId={selectedBooking.id}
            guestName={selectedBooking.guest_name}
            isOpen={chatOpen}
            onClose={() => {
              setChatOpen(false);
              setSelectedBooking(null);
            }}
            isAdmin={true}
          />
        )}

        {/* Deny Booking Confirmation Dialog */}
        <DenyBookingDialog
          open={denyDialogOpen}
          onOpenChange={(open) => {
            if (!open && !actionLoading) {
              setDenyDialogOpen(false);
              setBookingToDeny(null);
            } else if (open) {
              setDenyDialogOpen(true);
            }
          }}
          bookingGuestName={bookingToDeny?.guest_name || ''}
          bookingDates={bookingToDeny ? `${format(parseISO(bookingToDeny.check_in), 'MMM d')} - ${format(parseISO(bookingToDeny.check_out), 'MMM d, yyyy')}` : ''}
          onConfirm={handleDenyBooking}
          loading={actionLoading}
        />
      </div>
    </UnifiedAdminLayout>
  );
}
