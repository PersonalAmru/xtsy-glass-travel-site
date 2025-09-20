import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, MapPin, Users, Phone, Mail, CreditCard, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  booking_id: string;
  guest_name: string;
  email: string;
  whatsapp_number: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  room_type: string;
  booking_status: string;
  payment_status: string;
  created_at: string;
  address: string;
  city: string;
  state: string;
}

const UserDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'user') {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_user_bookings_secure');
      
      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load your bookings. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setBookings(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load your bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-white/80">Welcome back, {user.user_metadata?.full_name || user.email}</p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8 bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-white/80">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {user.role === 'admin' ? 'Administrator' : 'Guest'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Section */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                My Bookings
              </CardTitle>
              <CardDescription className="text-white/60">
                View and manage your accommodation bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-white/40" />
                  <h3 className="text-lg font-semibold mb-2 text-white">No Bookings Yet</h3>
                  <p className="text-white/60 mb-4">You haven't made any bookings with us yet.</p>
                  <Button onClick={() => window.location.href = '/'} className="bg-primary hover:bg-primary/90">
                    Explore Rooms
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              Booking #{booking.booking_id}
                            </h3>
                            <p className="text-white/60 text-sm">
                              Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-2 lg:mt-0">
                            <Badge className={`${getStatusColor(booking.booking_status)} text-white`}>
                              {booking.booking_status}
                            </Badge>
                            <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-white`}>
                              {booking.payment_status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-white/80">
                            <Calendar className="w-4 h-4 mr-2" />
                            <div>
                              <p className="text-xs text-white/60">Check-in</p>
                              <p className="font-medium">{format(new Date(booking.check_in), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-white/80">
                            <Clock className="w-4 h-4 mr-2" />
                            <div>
                              <p className="text-xs text-white/60">Check-out</p>
                              <p className="font-medium">{format(new Date(booking.check_out), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-white/80">
                            <Users className="w-4 h-4 mr-2" />
                            <div>
                              <p className="text-xs text-white/60">Guests</p>
                              <p className="font-medium">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-white/80">
                            <CreditCard className="w-4 h-4 mr-2" />
                            <div>
                              <p className="text-xs text-white/60">Total Amount</p>
                              <p className="font-medium">₹{booking.total_amount}</p>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-white/20 mb-4" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
                          <div>
                            <p className="text-white/60 mb-1">Room Type</p>
                            <p className="font-medium text-white">{booking.room_type}</p>
                          </div>
                          
                          <div>
                            <p className="text-white/60 mb-1">Guest Name</p>
                            <p className="font-medium text-white">{booking.guest_name}</p>
                          </div>
                          
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            <div>
                              <p className="text-white/60 mb-1">Contact</p>
                              <p className="font-medium text-white">{booking.whatsapp_number}</p>
                            </div>
                          </div>
                          
                          {booking.address && (
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 mt-1" />
                              <div>
                                <p className="text-white/60 mb-1">Address</p>
                                <p className="font-medium text-white">
                                  {booking.address}
                                  {booking.city && `, ${booking.city}`}
                                  {booking.state && `, ${booking.state}`}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;