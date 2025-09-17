import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarWithAvailability } from '@/components/CalendarWithAvailability';
import { useRoomAvailability } from '@/hooks/useRoomAvailability';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard, User, Mail, Phone, Calendar, Users, IndianRupee } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

// Declare global Cashfree SDK
declare global {
  interface Window {
    Cashfree: any;
  }
}

interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  roomTypeId: string;
  quantity: number;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Get initial values from URL params
  const initialRoomType = searchParams.get('roomType') || '';
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialGuests = parseInt(searchParams.get('guests') || '1');

  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>(() => {
    if (initialCheckIn && initialCheckOut) {
      return {
        from: new Date(initialCheckIn),
        to: new Date(initialCheckOut)
      };
    }
    return undefined;
  });

  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    roomTypeId: initialRoomType,
    quantity: 1,
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCashfreeLoaded, setIsCashfreeLoaded] = useState(false);

  const { roomTypes, isRoomAvailable } = useRoomAvailability();
  const selectedRoomType = roomTypes.find(rt => rt.id === formData.roomTypeId);

  // Load Cashfree SDK
  const loadCashfreeSDK = () => {
    if (window.Cashfree || isCashfreeLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js';
      script.onload = () => {
        setIsCashfreeLoaded(true);
        resolve(true);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Calculate pricing
  const calculateTotal = () => {
    if (!selectedRoomType || !selectedDates?.from || !selectedDates?.to) return 0;
    
    const nights = Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = selectedRoomType.base_price * nights * (formData.quantity || 1);
    const taxes = Math.round(subtotal * 0.12); // 12% GST
    return subtotal + taxes;
  };

  const totalAmount = calculateTotal();

  // Handle form submission and payment
  const handleBooking = async () => {
    if (!selectedDates?.from || !selectedDates?.to || !formData.roomTypeId || 
        !formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and select dates.",
        variant: "destructive"
      });
      return;
    }

    // Validate availability one more time
    const checkInStr = selectedDates.from.toISOString().split('T')[0];
    const checkOutStr = selectedDates.to.toISOString().split('T')[0];
    
    if (!isRoomAvailable(checkInStr, checkOutStr, formData.quantity || 1)) {
      toast({
        title: "Room Unavailable",
        description: "The selected room is no longer available. Please choose different dates.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Load Cashfree SDK
      await loadCashfreeSDK();

      // Create payment order
      const { data: orderData, error } = await supabase.functions.invoke('cashfree-create-order', {
        body: {
          room_type_id: formData.roomTypeId,
          check_in: checkInStr,
          check_out: checkOutStr,
          quantity: formData.quantity || 1,
          amount: totalAmount,
          customer_email: formData.customerEmail,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment order');
      }

      if (!orderData) {
        throw new Error('No order data received');
      }

      console.log('Payment order created:', orderData);

      // Initialize Cashfree payment
      const cashfree = window.Cashfree({
        mode: 'sandbox' // Change to 'production' for live environment
      });

      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        returnUrl: `${window.location.origin}/booking-success?order_id=${orderData.order_id}`,
        onSuccess: (data: any) => {
          console.log('Payment successful:', data);
          toast({
            title: "Payment Successful!",
            description: "Your booking has been confirmed. Redirecting...",
          });
          
          // Redirect to success page
          navigate(`/booking-success?order_id=${orderData.order_id}&payment_id=${data.paymentDetails?.paymentId}`);
        },
        onFailure: (data: any) => {
          console.error('Payment failed:', data);
          toast({
            title: "Payment Failed",
            description: data.paymentDetails?.paymentMessage || "Payment was not completed. Please try again.",
            variant: "destructive"
          });
          setIsProcessing(false);
        },
        onCancel: () => {
          console.log('Payment cancelled by user');
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment. Your room is still available.",
            variant: "destructive"
          });
          setIsProcessing(false);
        }
      };

      // Launch Cashfree checkout
      cashfree.checkout(checkoutOptions);

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Guest Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  placeholder="Enter your full name"
                  value={formData.customerName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.customerEmail || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  placeholder="Enter your phone number"
                  value={formData.customerPhone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Room & Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="roomType">Room Type *</Label>
                <Select
                  value={formData.roomTypeId || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, roomTypeId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{room.name}</span>
                          <Badge variant="outline" className="ml-2">
                            ₹{room.base_price}/night
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Number of Rooms</Label>
                <Select
                  value={formData.quantity?.toString() || '1'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, quantity: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Room' : 'Rooms'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRoomType && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{selectedRoomType.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedRoomType.category} • Capacity: {selectedRoomType.capacity}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      ₹{selectedRoomType.base_price}/night
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          {totalAmount > 0 && selectedDates?.from && selectedDates?.to && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Room Rate × {Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                    <span>₹{(selectedRoomType?.base_price || 0) * Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24)) * (formData.quantity || 1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees (12%)</span>
                    <span>₹{Math.round(((selectedRoomType?.base_price || 0) * Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24)) * (formData.quantity || 1)) * 0.12)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleBooking}
                  disabled={isProcessing || !selectedDates?.from || !selectedDates?.to}
                  className="w-full mt-4"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ₹{totalAmount} & Book Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Calendar */}
        <div>
          {formData.roomTypeId && (
            <CalendarWithAvailability
              roomTypeId={formData.roomTypeId}
              selectedDates={selectedDates}
              onDateSelect={setSelectedDates}
              quantity={formData.quantity || 1}
            />
          )}
        </div>
      </div>
    </div>
  );
}