import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, TrendingUp, Shield, LogOut } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import ModernAvailabilityCalendar from '@/components/modern-calendar/ModernAvailabilityCalendar';

// Room capacity mapping - updated with new capacities
const ROOM_CAPACITIES = {
  'signature-270-glass-suite': 1,
  '4-bed-female-only-dorm': 4,
  '4-bed-mixed-female-dorm': 4,
  '6-bed-mixed-female-dorm': 24, // Updated to 24 beds
  '6-bed-mixed-economy-dorm': 6, // Updated to 6 beds  
  '8-bed-mixed-dorm': 8,
  '8-bed-mixed-economy-dorm': 8, // Updated to 8 beds
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

const Admin: React.FC = () => {
  const { user, signIn, signOut, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
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
        room_type: '6-bed-mixed-female-dorm',
        check_in: '2025-09-21',
        check_out: '2025-09-23',
        quantity: 1,
        booking_status: 'confirmed',
        payment_status: 'paid',
        total_amount: 2000,
        created_at: new Date().toISOString()
      }
    ]);
  }, [isAdmin]);

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
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="amru@xtsy.one"
                  className="w-full p-2 border border-border rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full p-2 border border-border rounded-md"
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={signOut} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter(b => b.booking_status === 'confirmed').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Female Dorm</p>
                  <p className="text-2xl font-bold text-purple-600">24 Beds</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Economy Dorms</p>
                  <p className="text-2xl font-bold text-blue-600">14 Beds</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Availability Calendar */}
        <ModernAvailabilityCalendar />
      </div>
    </div>
  );
};

export default Admin;