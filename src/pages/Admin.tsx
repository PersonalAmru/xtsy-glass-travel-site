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
import { supabase } from '@/integrations/supabase/client';

// Room type and inventory interfaces based on booking flow
interface RoomType {
  id: string;
  name: string;
  total_units: number;
  propertyType: string;
  type: 'dorm' | 'private';
  price: number;
  is_active: boolean;
}

interface RoomInventory {
  room_type_id: string;
  date: string;
  available_count: number;
}

// Booking flow room data structure
const BOOKING_FLOW_ROOMS = {
  'xtsy-270': {
    id: 'xtsy-270',
    name: '270° Panorama Glass Ensuite',
    total_units: 1,
    propertyType: 'Luxury',
    type: 'private',
    price: 18000,
    is_active: true
  },
  '4-bed-female-only-dorm': {
    id: '4-bed-female-only-dorm',
    name: '4-Bed Female Only Dormitory',
    total_units: 4,
    propertyType: 'XTSY Travellers Hostel',
    type: 'dorm',
    price: 850,
    is_active: true
  },
  '4-bed-mixed-female-dorm': {
    id: '4-bed-mixed-female-dorm',
    name: '4-Bed Mixed Dormitory',
    total_units: 4,
    propertyType: 'XTSY Travellers Hostel',
    type: 'dorm',
    price: 800,
    is_active: true
  },
  '6-bed-mixed-female-dorm': {
    id: '6-bed-mixed-female-dorm',
    name: '6-Bed Female Only Dormitory',
    total_units: 6, // Updated capacity
    propertyType: 'XTSY Travellers Hostel',
    type: 'dorm',
    price: 750,
    is_active: true
  },
  '6-bed-mixed-dorm': {
    id: '6-bed-mixed-dorm',
    name: '6-Bed Mixed Dormitory',
    total_units: 6,
    propertyType: 'XTSY Travellers Hostel',
    type: 'dorm',
    price: 700,
    is_active: true
  },
  'king-double-room': {
    id: 'king-double-room',
    name: 'King Double Room',
    total_units: 2,
    propertyType: 'XTSY Travellers Hostel',
    type: 'private',
    price: 3500,
    is_active: true
  },
  'king-triple-room': {
    id: 'king-triple-room',
    name: 'King Triple Room',
    total_units: 1,
    propertyType: 'XTSY Travellers Hostel',
    type: 'private',
    price: 4500,
    is_active: true
  },
  '6-bed-mixed-economy-dorm': {
    id: '6-bed-mixed-economy-dorm',
    name: '6-Bed Mixed Economy Dormitory',
    total_units: 6,
    propertyType: 'XTSY Economy',
    type: 'dorm',
    price: 450,
    is_active: true
  },
  '8-bed-mixed-economy-dorm': {
    id: '8-bed-mixed-economy-dorm',
    name: '8-Bed Mixed Economy Dormitory',
    total_units: 8, // Updated capacity
    propertyType: 'XTSY Economy',
    type: 'dorm',
    price: 350,
    is_active: true
  }
} as const;

interface Booking {
  id: string;
  booking_id?: string;
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
  room_selections: Array<{
    room_type_id: string;
    room_type_name: string;
    quantity: number;
  }>;
  total_pax: number;
}

const Admin: React.FC = () => {
  const { user, signIn, signOut, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [roomInventory, setRoomInventory] = useState<RoomInventory[]>([]);
  const [loginForm, setLoginForm] = useState<LoginFormData>({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState<EditBookingData>({
    guest_name: '',
    check_in: '',
    check_out: '',
    room_selections: [],
    total_pax: 0
  });
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedBlockData, setSelectedBlockData] = useState<{
    roomType: string;
    date: Date;
    currentAvailable: number;
    totalCapacity: number;
  } | null>(null);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

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

  // Load data when admin logs in
  useEffect(() => {
    if (!isAdmin) return;

    const loadData = async () => {
      try {
        console.log('Loading admin data, user role:', user?.role);
        
        // Load room types
        const { data: roomTypesData, error: roomTypesError } = await supabase
          .from('room_types')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (roomTypesError) {
          console.error('Error loading room types:', roomTypesError);
          toast.error('Failed to load room types: ' + roomTypesError.message);
          
          // Fallback mock data if database access fails
          setRoomTypes(Object.values(BOOKING_FLOW_ROOMS));
        } else {
          // Transform database data to match our interface
          const transformedRoomTypes = (roomTypesData || []).map(room => ({
            id: room.id,
            name: room.name,
            total_units: room.total_units || 0,
            propertyType: room.category || 'Unknown',
            type: (room.kind === 'private' ? 'private' : 'dorm') as 'dorm' | 'private',
            price: room.base_price || 0,
            is_active: room.is_active
          }));
          setRoomTypes(transformedRoomTypes);
        }

        // Load room inventory for next 30 days
        const startDate = format(new Date(), 'yyyy-MM-dd');
        const endDate = format(addDays(new Date(), 30), 'yyyy-MM-dd');
        
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('room_inventory')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate);

        if (inventoryError) {
          console.error('Error loading inventory:', inventoryError);
          toast.error('Failed to load inventory: ' + inventoryError.message);
          
          // Create fallback inventory data
          const fallbackInventory: RoomInventory[] = [];
          const fallbackRoomTypes = Object.values(BOOKING_FLOW_ROOMS);
          
          for (let i = 0; i < 30; i++) {
            const date = format(addDays(new Date(), i), 'yyyy-MM-dd');
            fallbackRoomTypes.forEach(roomType => {
              fallbackInventory.push({
                room_type_id: roomType.id,
                date: date,
                available_count: roomType.total_units
              });
            });
          }
          setRoomInventory(fallbackInventory);
        } else {
          setRoomInventory(inventoryData || []);
        }

        // Load real bookings from database - include previous 90 days
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_id,
            guest_name,
            email,
            whatsapp_number,
            room_type,
            check_in,
            check_out,
            quantity,
            booking_status,
            payment_status,
            total_amount,
            created_at
          `)
          .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (bookingsError) {
          console.error('Error loading bookings:', bookingsError);
          // Use mock data as fallback
          setBookings([
            {
              id: '1',
              booking_id: 'XTSY-20250919-0001',
              guest_name: 'John Doe',
              email: 'john@example.com',
              whatsapp_number: '+91 9876543210',
              room_type: '6-bed-mixed-female-dorm',
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
              booking_id: 'XTSY-20250919-0002',
              guest_name: 'Jane Smith',
              email: 'jane@example.com',
              whatsapp_number: '+91 9123456789',
              room_type: '6-bed-mixed-economy-dorm',
              check_in: '2025-09-21',
              check_out: '2025-09-23',
              quantity: 1,
              booking_status: 'confirmed',
              payment_status: 'paid',
              total_amount: 2000,
              created_at: new Date().toISOString()
            }
          ]);
        } else {
          setBookings(bookingsData || []);
        }

        // Load blocked dates from database
        const { data: blockedDatesData, error: blockedError } = await supabase
          .from('blocked_dates')
          .select('*')
          .eq('blocked', true)
          .order('date');

        if (blockedError) {
          console.error('Error loading blocked dates:', blockedError);
          setBlockedDates([]);
        } else {
          setBlockedDates(blockedDatesData || []);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast.error('Failed to load admin data');
      }
    };

    loadData();

    // Set up real-time subscriptions for live updates
    const bookingsSubscription = supabase
      .channel('bookings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        loadData(); // Refresh data when bookings change
      })
      .subscribe();

    const blockedDatesSubscription = supabase
      .channel('blocked-dates-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blocked_dates' }, () => {
        loadData(); // Refresh data when blocked dates change
      })
      .subscribe();

    // Cleanup subscriptions on component unmount
    return () => {
      bookingsSubscription.unsubscribe();
      blockedDatesSubscription.unsubscribe();
    };
  }, [isAdmin, user?.role]);

  // Calculate availability for a specific room type and date
  const calculateAvailability = (roomTypeId: string, date: Date): { available: number; total: number; isBlocked: boolean } => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    const capacity = roomType?.total_units || 0;

    // Check if date is blocked
    const isBlocked = blockedDates.some(
      blocked => blocked.room_type === roomTypeId && blocked.date === dateStr && blocked.blocked
    );

    if (isBlocked) {
      return { available: 0, total: capacity, isBlocked: true };
    }

    // Get available count from room inventory
    const inventoryRecord = roomInventory.find(
      inv => inv.room_type_id === roomTypeId && inv.date === dateStr
    );

    if (inventoryRecord) {
      return {
        available: inventoryRecord.available_count,
        total: capacity,
        isBlocked: false
      };
    }

    // If no inventory record, assume full availability
    return {
      available: capacity,
      total: capacity,
      isBlocked: false
    };
  };

  // Handle block confirmation modal
  const handleBlockClick = (roomType: string, date: Date) => {
    const { available, total, isBlocked } = calculateAvailability(roomType, date);
    setSelectedBlockData({
      roomType,
      date,
      currentAvailable: available,
      totalCapacity: total
    });
    setBlockModalOpen(true);
  };

  const handleBlockConfirm = async (blockType: 'full' | 'partial', partialCount?: number) => {
    if (!selectedBlockData) return;
    
    if (blockType === 'full') {
      await toggleBlockDate(selectedBlockData.roomType, selectedBlockData.date);
    } else if (blockType === 'partial' && partialCount !== undefined) {
      // Handle partial blocking by updating room inventory
      const dateStr = format(selectedBlockData.date, 'yyyy-MM-dd');
      const newAvailableCount = Math.max(0, selectedBlockData.currentAvailable - partialCount);
      
      try {
        const { error } = await supabase
          .from('room_inventory')
          .upsert({
            room_type_id: selectedBlockData.roomType,
            date: dateStr,
            available_count: newAvailableCount
          });

        if (error) {
          toast.error('Failed to block partial beds: ' + error.message);
          return;
        }

        // Update local state
        setRoomInventory(prev => prev.map(inv => 
          inv.room_type_id === selectedBlockData.roomType && inv.date === dateStr
            ? { ...inv, available_count: newAvailableCount }
            : inv
        ));
        
        toast.success(`Blocked ${partialCount} beds for ${selectedBlockData.roomType} on ${format(selectedBlockData.date, 'MMM dd, yyyy')}`);
      } catch (error) {
        console.error('Error blocking partial beds:', error);
        toast.error('Failed to block partial beds');
      }
    }
    
    setBlockModalOpen(false);
    setSelectedBlockData(null);
  };

  // Toggle block date with database integration
  const toggleBlockDate = async (roomType: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingBlock = blockedDates.find(
      blocked => blocked.room_type === roomType && blocked.date === dateStr
    );

    try {
      if (existingBlock) {
        // Remove block from database
        const { error } = await supabase
          .from('blocked_dates')
          .delete()
          .eq('room_type', roomType)
          .eq('date', dateStr);

        if (error) {
          toast.error('Failed to unblock date: ' + error.message);
          return;
        }

        // Update local state
        setBlockedDates(prev => prev.filter(b => b.id !== existingBlock.id));
        toast.success(`${roomType} unblocked for ${format(date, 'MMM dd, yyyy')} - now available in booking flow`);
      } else {
        // Add block to database
        const { data, error } = await supabase
          .from('blocked_dates')
          .insert({
            room_type: roomType,
            date: dateStr,
            blocked: true
          })
          .select()
          .single();

        if (error) {
          toast.error('Failed to block date: ' + error.message);
          return;
        }

        // Update local state
        const newBlock: BlockedDate = {
          id: data.id,
          room_type: roomType,
          date: dateStr,
          blocked: true,
          created_at: data.created_at
        };
        setBlockedDates(prev => [...prev, newBlock]);
        toast.success('Date blocked successfully');
      }
    } catch (error) {
      console.error('Error toggling block date:', error);
      toast.error('Failed to update room availability');
    }
  };

  // Edit booking
  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setEditForm({
      guest_name: booking.guest_name,
      check_in: booking.check_in,
      check_out: booking.check_out,
      room_selections: [{
        room_type_id: booking.room_type,
        room_type_name: roomTypes.find(rt => rt.id === booking.room_type)?.name || booking.room_type,
        quantity: booking.quantity || 1
      }],
      total_pax: booking.quantity || 1
    });
  };

  const saveBookingEdit = async () => {
    if (!editingBooking) return;

    try {
      // For now, we'll save the first room selection as the primary booking
      const primaryRoom = editForm.room_selections[0];
      
      const { error } = await supabase
        .from('bookings')
        .update({
          guest_name: editForm.guest_name,
          check_in: editForm.check_in,
          check_out: editForm.check_out,
          room_type: primaryRoom?.room_type_id || editingBooking.room_type,
          quantity: editForm.total_pax
        })
        .eq('id', editingBooking.id);

      if (error) {
        console.error('Error updating booking:', error);
        toast.error('Failed to update booking');
        return;
      }

      // Update booking in local state
      setBookings(prev => prev.map(booking =>
        booking.id === editingBooking.id
          ? { 
              ...booking, 
              guest_name: editForm.guest_name,
              check_in: editForm.check_in,
              check_out: editForm.check_out,
              room_type: primaryRoom?.room_type_id || booking.room_type,
              quantity: editForm.total_pax
            }
          : booking
      ));
      
      setEditingBooking(null);
      toast.success('Booking updated successfully and saved to database');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  // Add new room selection
  const addRoomSelection = () => {
    setEditForm(prev => ({
      ...prev,
      room_selections: [...prev.room_selections, { room_type_id: '', room_type_name: '', quantity: 1 }]
    }));
  };

  // Remove room selection
  const removeRoomSelection = (index: number) => {
    setEditForm(prev => {
      const newSelections = prev.room_selections.filter((_, i) => i !== index);
      const newTotalPax = newSelections.reduce((sum, selection) => sum + selection.quantity, 0);
      return {
        ...prev,
        room_selections: newSelections,
        total_pax: newTotalPax
      };
    });
  };

  // Update room selection
  const updateRoomSelection = (index: number, field: string, value: string | number) => {
    setEditForm(prev => {
      const newSelections = [...prev.room_selections];
      if (field === 'room_type_id') {
        const roomType = roomTypes.find(rt => rt.id === value);
        newSelections[index] = {
          ...newSelections[index],
          room_type_id: value as string,
          room_type_name: roomType?.name || ''
        };
      } else if (field === 'quantity') {
        newSelections[index] = {
          ...newSelections[index],
          quantity: value as number
        };
      }
      const newTotalPax = newSelections.reduce((sum, selection) => sum + selection.quantity, 0);
      return {
        ...prev,
        room_selections: newSelections,
        total_pax: newTotalPax
      };
    });
  };

  // Cancel booking - permanent deletion from database
  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          booking_status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to cancel booking');
        return;
      }

      // Update booking in local state
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, booking_status: 'cancelled' }
          : booking
      ));
      
      toast.success('Booking cancelled successfully and saved to database');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  // Generate 90-day date array
  const generateDateArray = (): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 90; i++) {
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
            <div className="text-2xl font-bold">{roomTypes.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Grid - Organized by Property Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Room Availability by Property (Next 90 Days)
          </CardTitle>
          <CardDescription>
            Click on a cell to block/unblock that date for a room type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Group rooms by property type */}
            {['Luxury', 'XTSY Travellers Hostel', 'XTSY Economy'].map(propertyType => {
              const propertyRooms = roomTypes.filter(room => room.propertyType === propertyType);
              if (propertyRooms.length === 0) return null;
              
              return (
                <div key={propertyType}>
                  <h3 className="text-lg font-semibold mb-4 text-primary">{propertyType}</h3>
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      <div className="grid grid-cols-[200px_repeat(90,1fr)] gap-1 text-xs">
                        {/* Header row */}
                        <div className="font-medium p-2">Room Type</div>
                        {dates.map((date, index) => (
                          <div key={index} className="font-medium p-1 text-center">
                            {format(date, 'dd/MM')}
                          </div>
                        ))}
                        
                        {/* Room availability rows for this property */}
                        {propertyRooms.map(roomType => (
                          <React.Fragment key={roomType.id}>
                            <div className="font-medium p-2 text-xs">
                              <div>{roomType.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {roomType.type === 'dorm' ? 'Beds' : 'Rooms'}: {roomType.total_units} | ₹{roomType.price}
                              </div>
                            </div>
                            {dates.map((date, dateIndex) => {
                              const { available, total, isBlocked } = calculateAvailability(roomType.id, date);
                              return (
                                <button
                                  key={`${roomType.id}-${dateIndex}`}
                                  onClick={() => handleBlockClick(roomType.id, date)}
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
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bookings Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bookings Calendar View
          </CardTitle>
          <CardDescription>Navigate through past and future bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prevMonth = new Date(currentCalendarMonth);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setCurrentCalendarMonth(prevMonth);
                }}
              >
                ← Previous Month
              </Button>
              <h3 className="text-base font-semibold">
                {format(currentCalendarMonth, 'MMMM yyyy')}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextMonth = new Date(currentCalendarMonth);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setCurrentCalendarMonth(nextMonth);
                }}
              >
                Next Month →
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-sm max-w-md">
              {/* Calendar Header */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-1 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {Array.from({ length: 35 }, (_, i) => {
                const startOfMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), 1);
                const startOfCalendar = new Date(startOfMonth);
                startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());
                
                const cellDate = new Date(startOfCalendar);
                cellDate.setDate(cellDate.getDate() + i);
                
                const isCurrentMonth = cellDate.getMonth() === currentCalendarMonth.getMonth();
                const isToday = format(cellDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                const isSelected = selectedCalendarDate && format(cellDate, 'yyyy-MM-dd') === format(selectedCalendarDate, 'yyyy-MM-dd');
                
                // Find bookings for this date
                const dayBookings = bookings.filter(booking => {
                  const checkIn = new Date(booking.check_in);
                  const checkOut = new Date(booking.check_out);
                  return cellDate >= checkIn && cellDate < checkOut;
                });
                
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedCalendarDate(cellDate)}
                    className={`h-8 w-8 text-xs border rounded transition-colors ${
                      isCurrentMonth 
                        ? isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : isToday 
                            ? 'bg-primary/10 border-primary hover:bg-primary/20' 
                            : 'bg-background hover:bg-muted border-border'
                        : 'bg-muted/30 text-muted-foreground border-muted'
                    } ${dayBookings.length > 0 ? 'ring-1 ring-blue-300' : ''}`}
                  >
                    {cellDate.getDate()}
                    {dayBookings.length > 0 && (
                      <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-0.5"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Date Bookings */}
            {selectedCalendarDate && (
              <div className="mt-6 p-4 border rounded-lg">
                <h4 className="text-sm font-semibold mb-3">
                  Bookings for {format(selectedCalendarDate, 'MMMM dd, yyyy')}
                </h4>
                {(() => {
                  const selectedDateBookings = bookings.filter(booking => {
                    const checkIn = new Date(booking.check_in);
                    const checkOut = new Date(booking.check_out);
                    return selectedCalendarDate >= checkIn && selectedCalendarDate < checkOut;
                  });
                  
                  if (selectedDateBookings.length === 0) {
                    return (
                      <p className="text-sm text-muted-foreground">No bookings for this date</p>
                    );
                  }
                  
                  return (
                    <div className="space-y-2">
                      {selectedDateBookings.map((booking, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <div className="text-sm font-medium">{booking.guest_name}</div>
                             <div className="text-xs text-muted-foreground">
                               {booking.room_type} • {booking.quantity} guests
                             </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs px-2 py-1 rounded ${
                              booking.booking_status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : booking.booking_status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.booking_status}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(new Date(booking.check_in), 'MMM dd')} - {format(new Date(booking.check_out), 'MMM dd')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                 })()}
               </div>
             )}

             {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-100 border"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-100 border"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-100 border"></div>
                <span>Cancelled</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings (Last 90 Days)</CardTitle>
          <CardDescription>All booking entries from the past 90 days with calendar view</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp Number</TableHead>
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
                  <TableCell className="font-medium">{booking.booking_id || booking.id}</TableCell>
                  <TableCell className="font-medium">{booking.guest_name}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.whatsapp_number}</TableCell>
                  <TableCell>{booking.room_type}</TableCell>
                  <TableCell>
                    {format(new Date(booking.check_in), 'dd/MM')} - {format(new Date(booking.check_out), 'dd/MM')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.booking_status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.booking_status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{booking.total_amount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBooking(booking)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                              Complete booking information and guest details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div>
                                <Label>Booking ID</Label>
                                <div className="text-sm font-medium">{booking.booking_id || booking.id}</div>
                              </div>
                              <div>
                                <Label htmlFor="guest_name">Full Name</Label>
                                <Input
                                  id="guest_name"
                                  value={editForm.guest_name}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, guest_name: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label>Email</Label>
                                <div className="text-sm font-medium">{booking.email}</div>
                              </div>
                              <div>
                                <Label>WhatsApp Number</Label>
                                <div className="text-sm font-medium">{booking.whatsapp_number}</div>
                              </div>
                              <div>
                                <Label>Total Guests (PAX)</Label>
                                <div className="text-lg font-bold text-primary">{editForm.total_pax}</div>
                              </div>
                            </div>
                            <div className="space-y-4">
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
                            </div>
                          </div>
                          
                          {/* Room Selections Section */}
                          <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                              <Label className="text-base font-semibold">Room Selections</Label>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={addRoomSelection}
                              >
                                Add Room Type
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              {editForm.room_selections.map((selection, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                  <div className="flex-1">
                                    <Label>Room Type</Label>
                                    <Select 
                                      value={selection.room_type_id} 
                                      onValueChange={(value) => updateRoomSelection(index, 'room_type_id', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select room type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {roomTypes.map(type => (
                                          <SelectItem key={type.id} value={type.id}>
                                            {type.name} ({type.propertyType})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="w-24">
                                    <Label>Guests</Label>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={selection.quantity}
                                      onChange={(e) => updateRoomSelection(index, 'quantity', parseInt(e.target.value))}
                                    />
                                  </div>
                                  {editForm.room_selections.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => removeRoomSelection(index)}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>
                              ))}
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

      {/* Block Confirmation Modal */}
      <Dialog open={blockModalOpen} onOpenChange={setBlockModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Block Room Availability</DialogTitle>
            <DialogDescription>
              Choose how to modify availability for {selectedBlockData?.roomType} on{' '}
              {selectedBlockData && format(selectedBlockData.date, 'MMM dd, yyyy')}
            </DialogDescription>
          </DialogHeader>
          {selectedBlockData && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Current Status:</div>
                <div className="text-sm text-muted-foreground">
                  {selectedBlockData.currentAvailable}/{selectedBlockData.totalCapacity} beds available
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => handleBlockConfirm('full')}
                  variant="destructive"
                  className="w-full"
                >
                  Block All Beds (Full Block)
                </Button>
                
                <div className="space-y-2">
                  <Label>Or block specific number of beds:</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6].map(count => (
                      <Button
                        key={count}
                        onClick={() => handleBlockConfirm('partial', count)}
                        variant="outline"
                        size="sm"
                        disabled={count > selectedBlockData.currentAvailable}
                        className="flex-1"
                      >
                        Block {count}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;