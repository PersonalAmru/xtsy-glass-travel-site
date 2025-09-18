import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, CalendarDays, Users, Settings, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, isWithinInterval } from 'date-fns';

// Room capacity mapping
const ROOM_CAPACITIES = {
  'signature-270-glass-suite': 1,
  '4-bed-female-only-dorm': 4,
  '4-bed-mixed-female-dorm': 4,
  '6-bed-mixed-female-dorm': 30,
  '6-bed-mixed-economy-dorm': 36,
  '8-bed-mixed-dorm': 8,
  '8-bed-mixed-economy-dorm': 64,
  'king-double-room': 2,
  'king-triple-room': 1,
};

const ROOM_TYPES = Object.keys(ROOM_CAPACITIES);

interface Booking {
  id: string;
  guest_name: string;
  email: string;
  whatsapp_number: string;
  room_type: string;
  check_in: string;
  check_out: string;
  quantity: number;
  booking_status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
}

interface BlockedDate {
  id: string;
  room_type: string;
  date: string;
  blocked: boolean;
  created_at: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface EditBookingData {
  guest_name: string;
  check_in: string;
  check_out: string;
  room_type: string;
  quantity: number;
}

const Admin: React.FC = () => {
  const { user, signIn, signOut, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loginForm, setLoginForm] = useState<LoginFormData>({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState<EditBookingData>({
    guest_name: '',
    check_in: '',
    check_out: '',
    room_type: '',
    quantity: 1
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Check if user is admin
  const isAdmin = user?.user_metadata?.role === 'admin';

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      if (error) {
        toast.error('Login failed: ' + error.message);
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (!isAdmin) return;

    const loadData = async () => {
      try {
        // Load bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);

        // Load blocked dates
        const { data: blockedData, error: blockedError } = await supabase
          .from('blocked_dates')
          .select('*')
          .order('date', { ascending: true });

        if (blockedError) throw blockedError;
        setBlockedDates(blockedData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load admin data');
      }
    };

    loadData();
  }, [isAdmin]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!isAdmin) return;

    // Subscribe to bookings changes
    const bookingsChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Bookings change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [payload.new as Booking, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => prev.map(booking => 
              booking.id === payload.new.id ? payload.new as Booking : booking
            ));
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => prev.filter(booking => booking.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to blocked dates changes
    const blockedDatesChannel = supabase
      .channel('blocked-dates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blocked_dates'
        },
        (payload) => {
          console.log('Blocked dates change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setBlockedDates(prev => [...prev, payload.new as BlockedDate]);
          } else if (payload.eventType === 'DELETE') {
            setBlockedDates(prev => prev.filter(blocked => blocked.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(blockedDatesChannel);
    };
  }, [isAdmin]);

  // Calculate availability for a specific room type and date
  const calculateAvailability = (roomType: string, date: Date): { available: number; total: number; isBlocked: boolean } => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const capacity = ROOM_CAPACITIES[roomType as keyof typeof ROOM_CAPACITIES] || 0;

    // Check if date is blocked
    const isBlocked = blockedDates.some(
      blocked => blocked.room_type === roomType && blocked.date === dateStr && blocked.blocked
    );

    if (isBlocked) {
      return { available: 0, total: capacity, isBlocked: true };
    }

    // Calculate occupied units from bookings
    const occupiedUnits = bookings
      .filter(booking => 
        booking.room_type === roomType &&
        booking.booking_status === 'confirmed' &&
        isWithinInterval(date, {
          start: new Date(booking.check_in),
          end: new Date(booking.check_out)
        })
      )
      .reduce((sum, booking) => sum + (booking.quantity || 1), 0);

    return {
      available: Math.max(0, capacity - occupiedUnits),
      total: capacity,
      isBlocked: false
    };
  };

  // Toggle block date
  const toggleBlockDate = async (roomType: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingBlock = blockedDates.find(
      blocked => blocked.room_type === roomType && blocked.date === dateStr
    );

    try {
      if (existingBlock) {
        // Remove block
        const { error } = await supabase
          .from('blocked_dates')
          .delete()
          .eq('id', existingBlock.id);

        if (error) throw error;
        toast.success('Date unblocked successfully');
      } else {
        // Add block
        const { error } = await supabase
          .from('blocked_dates')
          .insert({
            room_type: roomType,
            date: dateStr,
            blocked: true
          });

        if (error) throw error;
        toast.success('Date blocked successfully');
      }
    } catch (error) {
      console.error('Error toggling block:', error);
      toast.error('Failed to toggle date block');
    }
  };

  // Edit booking
  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setEditForm({
      guest_name: booking.guest_name,
      check_in: booking.check_in,
      check_out: booking.check_out,
      room_type: booking.room_type,
      quantity: booking.quantity || 1
    });
  };

  const saveBookingEdit = async () => {
    if (!editingBooking) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          guest_name: editForm.guest_name,
          check_in: editForm.check_in,
          check_out: editForm.check_out,
          room_type: editForm.room_type,
          quantity: editForm.quantity
        })
        .eq('id', editingBooking.id);

      if (error) throw error;
      
      setEditingBooking(null);
      toast.success('Booking updated successfully');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  // Generate 30-day date array
  const generateDateArray = (): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 30; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Login form for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
            <CardDescription>You don't have admin privileges</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={signOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dates = generateDateArray();

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage bookings and room availability</p>
        </div>
        <Button onClick={signOut} variant="outline">
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => b.booking_status === 'confirmed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Dates</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockedDates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Types</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ROOM_TYPES.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Room Availability (Next 30 Days)
          </CardTitle>
          <CardDescription>
            Click on a cell to block/unblock that date for a room type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[200px_repeat(30,1fr)] gap-1 text-xs">
                {/* Header row */}
                <div className="font-medium p-2">Room Type</div>
                {dates.map((date, index) => (
                  <div key={index} className="font-medium p-1 text-center">
                    {format(date, 'dd/MM')}
                  </div>
                ))}
                
                {/* Room availability rows */}
                {ROOM_TYPES.map(roomType => (
                  <React.Fragment key={roomType}>
                    <div className="font-medium p-2 text-xs">
                      {roomType.replace(/-/g, ' ').toUpperCase()}
                    </div>
                    {dates.map((date, dateIndex) => {
                      const { available, total, isBlocked } = calculateAvailability(roomType, date);
                      return (
                        <button
                          key={`${roomType}-${dateIndex}`}
                          onClick={() => toggleBlockDate(roomType, date)}
                          className={`p-1 text-xs rounded border transition-colors ${
                            isBlocked
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : available === 0
                              ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                              : available < total * 0.3
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {isBlocked ? 'Blocked' : `${available}/${total}`}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Manage and edit existing bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.slice(0, 20).map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.guest_name}</TableCell>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {booking.room_type.replace(/-/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(booking.check_in), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{format(new Date(booking.check_out), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{booking.quantity || 1}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={booking.booking_status === 'confirmed' ? 'default' : 'secondary'}
                      >
                        {booking.booking_status}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{booking.total_amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditBooking(booking)}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Booking</DialogTitle>
                              <DialogDescription>
                                Make changes to the booking details
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="guest_name">Guest Name</Label>
                                <Input
                                  id="guest_name"
                                  value={editForm.guest_name}
                                  onChange={(e) => setEditForm(prev => ({
                                    ...prev,
                                    guest_name: e.target.value
                                  }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="check_in">Check In</Label>
                                <Input
                                  id="check_in"
                                  type="date"
                                  value={editForm.check_in}
                                  onChange={(e) => setEditForm(prev => ({
                                    ...prev,
                                    check_in: e.target.value
                                  }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="check_out">Check Out</Label>
                                <Input
                                  id="check_out"
                                  type="date"
                                  value={editForm.check_out}
                                  onChange={(e) => setEditForm(prev => ({
                                    ...prev,
                                    check_out: e.target.value
                                  }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="room_type">Room Type</Label>
                                <Select
                                  value={editForm.room_type}
                                  onValueChange={(value) => setEditForm(prev => ({
                                    ...prev,
                                    room_type: value
                                  }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ROOM_TYPES.map(type => (
                                      <SelectItem key={type} value={type}>
                                        {type.replace(/-/g, ' ').toUpperCase()}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                  id="quantity"
                                  type="number"
                                  min="1"
                                  value={editForm.quantity}
                                  onChange={(e) => setEditForm(prev => ({
                                    ...prev,
                                    quantity: parseInt(e.target.value)
                                  }))}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={saveBookingEdit}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;