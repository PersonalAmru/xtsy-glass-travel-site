import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

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

  // Load mock data when admin logs in
  useEffect(() => {
    if (!isAdmin) return;

    // Mock bookings data
    setBookings([
      {
        id: '1',
        guest_name: 'John Doe',
        email: 'john@example.com',
        whatsapp_number: '+1234567890',
        room_type: 'signature-270-glass-suite',
        check_in: '2025-09-20',
        check_out: '2025-09-22',
        quantity: 1,
        booking_status: 'confirmed',
        payment_status: 'paid',
        total_amount: 5000,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        guest_name: 'Jane Smith',
        email: 'jane@example.com',
        whatsapp_number: '+9876543210',
        room_type: '4-bed-mixed-female-dorm',
        check_in: '2025-09-21',
        check_out: '2025-09-23',
        quantity: 1,
        booking_status: 'confirmed',
        payment_status: 'paid',
        total_amount: 2000,
        created_at: new Date().toISOString()
      }
    ]);

    // Mock blocked dates
    setBlockedDates([]);
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

  // Toggle block date (mock implementation)
  const toggleBlockDate = (roomType: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingBlock = blockedDates.find(
      blocked => blocked.room_type === roomType && blocked.date === dateStr
    );

    if (existingBlock) {
      // Remove block
      setBlockedDates(prev => prev.filter(b => b.id !== existingBlock.id));
      toast.success('Date unblocked successfully');
    } else {
      // Add block
      const newBlock: BlockedDate = {
        id: Date.now().toString(),
        room_type: roomType,
        date: dateStr,
        blocked: true,
        created_at: new Date().toISOString()
      };
      setBlockedDates(prev => [...prev, newBlock]);
      toast.success('Date blocked successfully');
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

  const saveBookingEdit = () => {
    if (!editingBooking) return;

    // Update booking in state
    setBookings(prev => prev.map(booking =>
      booking.id === editingBooking.id
        ? { ...booking, ...editForm }
        : booking
    ));
    
    setEditingBooking(null);
    toast.success('Booking updated successfully');
  };

  // Cancel booking (mock implementation)
  const cancelBooking = (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    toast.success('Booking cancelled successfully');
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
                  placeholder="amru@xtsy.one"
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

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.guest_name}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.room_type}</TableCell>
                  <TableCell>
                    {format(new Date(booking.check_in), 'dd/MM')} - {format(new Date(booking.check_out), 'dd/MM')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.booking_status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.booking_status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{booking.total_amount}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
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
                                onChange={(e) => setEditForm(prev => ({ ...prev, guest_name: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="check_in">Check In</Label>
                              <Input
                                id="check_in"
                                type="date"
                                value={editForm.check_in}
                                onChange={(e) => setEditForm(prev => ({ ...prev, check_in: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="check_out">Check Out</Label>
                              <Input
                                id="check_out"
                                type="date"
                                value={editForm.check_out}
                                onChange={(e) => setEditForm(prev => ({ ...prev, check_out: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="room_type">Room Type</Label>
                              <Select value={editForm.room_type} onValueChange={(value) => setEditForm(prev => ({ ...prev, room_type: value }))}>
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
                          </div>
                          <DialogFooter>
                            <Button onClick={saveBookingEdit}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;