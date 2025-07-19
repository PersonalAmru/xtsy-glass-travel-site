import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, IndianRupee, User } from 'lucide-react';
import { toast } from 'sonner';
import { RoomType } from '@/types/database';

interface EnhancedBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: Array<{ roomTypeId: string; quantity: number }>;
  };
}

export const EnhancedBookingModal: React.FC<EnhancedBookingModalProps> = ({
  isOpen,
  onClose,
  initialData
}) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [wantAccount, setWantAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    checkIn: initialData?.checkIn || '',
    checkOut: initialData?.checkOut || '',
    guests: initialData?.guests || 1,
    guestName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    whatsappNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    emergencyRelation: '',
    specialRequests: '',
  });

  // Use mock data for room types since the RPC function doesn't exist
  const { data: roomTypes } = useQuery({
    queryKey: ['room-types'],
    queryFn: async () => {
      try {
        // Return mock data as fallback since get_active_room_types doesn't exist
        const mockRoomTypes: RoomType[] = [
          {
            id: '1',
            name: '4-Bed Mixed Dorm',
            description: 'Shared dormitory with 4 beds',
            capacity: 4,
            base_price: 80000,
            amenities: ['Free WiFi', 'Locker', 'AC'],
            images: [],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: '6-Bed Mixed Dorm',
            description: 'Spacious shared dormitory with 6 beds',
            capacity: 6,
            base_price: 70000,
            amenities: ['Free WiFi', 'Locker', 'AC', 'Common Area'],
            images: [],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Private Room',
            description: 'Comfortable private room for couples',
            capacity: 2,
            base_price: 200000,
            amenities: ['Free WiFi', 'Private Bathroom', 'AC', 'Mountain View'],
            images: [],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        return mockRoomTypes;
      } catch (error) {
        console.error('Room types fetch error:', error);
        return [] as RoomType[];
      }
    },
  });

  const [selectedRooms, setSelectedRooms] = useState<Array<{ roomTypeId: string; quantity: number }>>(
    initialData?.rooms || []
  );

  // Calculate pricing
  const calculateTotal = () => {
    if (!roomTypes || !bookingData.checkIn || !bookingData.checkOut) return { subtotal: 0, gst: 0, total: 0 };

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));

    let subtotal = 0;
    selectedRooms.forEach(room => {
      const roomType = roomTypes.find(rt => rt.id === room.roomTypeId);
      if (roomType) {
        subtotal += roomType.base_price * room.quantity * nights;
      }
    });

    const gst = Math.round(subtotal * 0.12); // 12% GST
    const total = subtotal + gst;

    return { subtotal, gst, total, nights };
  };

  const { subtotal, gst, total, nights } = calculateTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare room details
      const roomDetails = selectedRooms.map(room => {
        const roomType = roomTypes?.find(rt => rt.id === room.roomTypeId);
        return {
          room_type_id: room.roomTypeId,
          room_type_name: roomType?.name,
          quantity: room.quantity,
          rate: roomType?.base_price,
        };
      });

      // Create booking payload that matches the database schema
      const bookingPayload = {
        booking_id: '', // This will be auto-generated by the trigger
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        nights: nights || 1,
        guests: bookingData.guests,
        guest_name: bookingData.guestName,
        email: bookingData.email,
        whatsapp_number: bookingData.whatsappNumber,
        address: bookingData.address || '',
        city: bookingData.city || '',
        state: bookingData.state || '',
        pincode: bookingData.pincode || '',
        emergency_contact: bookingData.emergencyContact || '',
        emergency_relation: bookingData.emergencyRelation || '',
        room_details: roomDetails,
        subtotal: subtotal,
        gst_amount: gst,
        total_amount: total,
        booking_status: 'pending',
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingPayload)
        .select()
        .single();

      if (bookingError) throw bookingError;

      toast.success('Booking created successfully! Redirecting to payment...');
      
      console.log('Booking created:', booking);
      
      onClose();

    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addRoom = (roomTypeId: string) => {
    setSelectedRooms(prev => {
      const existing = prev.find(r => r.roomTypeId === roomTypeId);
      if (existing) {
        return prev.map(r => 
          r.roomTypeId === roomTypeId 
            ? { ...r, quantity: r.quantity + 1 }
            : r
        );
      } else {
        return [...prev, { roomTypeId, quantity: 1 }];
      }
    });
  };

  const removeRoom = (roomTypeId: string) => {
    setSelectedRooms(prev => {
      const existing = prev.find(r => r.roomTypeId === roomTypeId);
      if (existing && existing.quantity > 1) {
        return prev.map(r => 
          r.roomTypeId === roomTypeId 
            ? { ...r, quantity: r.quantity - 1 }
            : r
        );
      } else {
        return prev.filter(r => r.roomTypeId !== roomTypeId);
      }
    });
  };

  const handleAccountCheckChange = (checked: boolean | 'indeterminate') => {
    setWantAccount(checked === true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Complete Your Booking
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Check-in</Label>
                    <Input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Check-out</Label>
                    <Input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Nights</Label>
                    <div className="text-2xl font-bold text-primary">{nights || 0}</div>
                  </div>
                  <div>
                    <Label>Guests</Label>
                    <Input
                      type="number"
                      min="1"
                      value={bookingData.guests}
                      onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Rooms</CardTitle>
                <CardDescription>Choose your accommodation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {roomTypes?.map(room => {
                  const selectedRoom = selectedRooms.find(r => r.roomTypeId === room.id);
                  const quantity = selectedRoom?.quantity || 0;

                  return (
                    <div key={room.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{room.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {room.capacity} guests
                            </span>
                            <span className="flex items-center">
                              <IndianRupee className="h-4 w-4 mr-1" />
                              ₹{(room.base_price / 100).toLocaleString()}/night
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {room.amenities?.map((amenity: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeRoom(room.id)}
                            disabled={quantity === 0}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{quantity}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addRoom(room.id)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName">Full Name *</Label>
                    <Input
                      id="guestName"
                      value={bookingData.guestName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, guestName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                    <Input
                      id="whatsapp"
                      value={bookingData.whatsappNumber}
                      onChange={(e) => setBookingData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      placeholder="+91 XXXXXXXXXX"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={bookingData.emergencyContact}
                      onChange={(e) => setBookingData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={bookingData.address}
                    onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={bookingData.city}
                      onChange={(e) => setBookingData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={bookingData.state}
                      onChange={(e) => setBookingData(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      value={bookingData.pincode}
                      onChange={(e) => setBookingData(prev => ({ ...prev, pincode: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requirements or requests"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Creation Option */}
            {!user && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="create-account"
                      checked={wantAccount}
                      onCheckedChange={handleAccountCheckChange}
                    />
                    <Label htmlFor="create-account" className="text-sm">
                      Create an account to track your bookings and get exclusive deals
                    </Label>
                  </div>
                  {wantAccount && (
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAuthModal(true)}
                      >
                        Create Account
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Pricing Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({nights} nights)</span>
                    <span>₹{(subtotal / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (12%)</span>
                    <span>₹{(gst / 100).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{(total / 100).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || selectedRooms.length === 0 || !bookingData.checkIn || !bookingData.checkOut}
                className="min-w-32"
              >
                {loading ? 'Processing...' : `Pay ₹${(total / 100).toLocaleString()}`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />
    </>
  );
};
