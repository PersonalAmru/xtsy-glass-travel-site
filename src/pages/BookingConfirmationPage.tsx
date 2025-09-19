import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Download, ArrowLeft } from 'lucide-react';
import { cashfreeService } from '@/services/cashfreePayment';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BookingDetails {
  orderId: string;
  guestName: string;
  email: string;
  whatsappNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  selectedRooms: any[];
  totalAmount: number;
  createdAt: string;
}

const BookingConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const { toast } = useToast();

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      setPaymentStatus('failed');
      return;
    }

    // Load booking details from localStorage
    const bookingData = localStorage.getItem(`booking_${orderId}`);
    if (bookingData) {
      setBookingDetails(JSON.parse(bookingData));
    }

    // Verify payment status
    verifyPayment(orderId);
  }, [orderId]);

  const verifyPayment = async (orderId: string) => {
    try {
      const isVerified = await cashfreeService.verifyPayment(orderId);
      setPaymentStatus(isVerified ? 'success' : 'failed');
      
      if (isVerified) {
        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed. You will receive a confirmation email shortly.",
        });
      } else {
        toast({
          title: "Payment Verification Failed",
          description: "Please contact our support team for assistance.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('failed');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadBookingConfirmation = () => {
    if (!bookingDetails) return;
    
    const confirmationText = `
XTSY Travellers Hostel - Booking Confirmation

Order ID: ${bookingDetails.orderId}
Guest Name: ${bookingDetails.guestName}
Email: ${bookingDetails.email}
Phone: ${bookingDetails.whatsappNumber}

Check-in: ${formatDate(bookingDetails.checkIn)}
Check-out: ${formatDate(bookingDetails.checkOut)}
Nights: ${bookingDetails.nights}
Guests: ${bookingDetails.guests}

Rooms:
${bookingDetails.selectedRooms.map(room => 
  `- ${room.name}: ${room.selection.rooms || room.selection.guests} x ${bookingDetails.nights} nights`
).join('\n')}

Total Amount: ₹${bookingDetails.totalAmount}
Payment Status: ${paymentStatus === 'success' ? 'Confirmed' : 'Pending'}

Thank you for choosing XTSY Travellers Hostel!
`;

    const blob = new Blob([confirmationText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-confirmation-${bookingDetails.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {paymentStatus === 'verifying' && (
                  <Clock className="h-16 w-16 text-yellow-500 animate-spin" />
                )}
                {paymentStatus === 'success' && (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                )}
                {paymentStatus === 'failed' && (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              
              <CardTitle className="text-2xl">
                {paymentStatus === 'verifying' && 'Verifying Payment...'}
                {paymentStatus === 'success' && 'Booking Confirmed!'}
                {paymentStatus === 'failed' && 'Payment Failed'}
              </CardTitle>
              
              <CardDescription>
                {paymentStatus === 'verifying' && 'Please wait while we verify your payment'}
                {paymentStatus === 'success' && 'Your booking has been successfully confirmed'}
                {paymentStatus === 'failed' && 'There was an issue with your payment'}
              </CardDescription>
            </CardHeader>

            {bookingDetails && (
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Order ID:</span>
                  <Badge variant="secondary">{bookingDetails.orderId}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Guest Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {bookingDetails.guestName}</p>
                      <p><span className="font-medium">Email:</span> {bookingDetails.email}</p>
                      <p><span className="font-medium">Phone:</span> {bookingDetails.whatsappNumber}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Stay Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Check-in:</span> {formatDate(bookingDetails.checkIn)}</p>
                      <p><span className="font-medium">Check-out:</span> {formatDate(bookingDetails.checkOut)}</p>
                      <p><span className="font-medium">Nights:</span> {bookingDetails.nights}</p>
                      <p><span className="font-medium">Guests:</span> {bookingDetails.guests}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Room Selection</h3>
                  <div className="space-y-2">
                    {bookingDetails.selectedRooms.map((room, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{room.name}</span>
                        <span className="text-sm text-gray-600">
                          {room.selection.rooms || room.selection.guests} × {bookingDetails.nights} nights
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{bookingDetails.totalAmount}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {paymentStatus === 'success' && (
                    <Button onClick={downloadBookingConfirmation} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Confirmation
                    </Button>
                  )}
                  
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/">Return to Home</Link>
                  </Button>
                </div>

                {paymentStatus === 'failed' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">What to do next?</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Contact our support team at +91 88373 17070</li>
                      <li>• Email us at support@xtsy.one with your order ID</li>
                      <li>• Try booking again with a different payment method</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;