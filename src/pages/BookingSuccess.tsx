import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Mail, Phone, Home } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Simulate processing time (webhook processing)
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Processing Your Booking...</h1>
          <p className="text-muted-foreground">Please wait while we confirm your reservation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your booking. Your reservation has been successfully confirmed.
          </p>
        </div>

        {orderId && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="font-medium">Order ID:</span>
                  <span className="font-mono text-sm">{orderId}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between">
                    <span className="font-medium">Payment ID:</span>
                    <span className="font-mono text-sm">{paymentId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="text-green-600 font-medium">Confirmed & Paid</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Alert className="mb-6">
          <Mail className="h-4 w-4" />
          <AlertDescription>
            A confirmation email with your booking details has been sent to your email address.
            Please save this for your records.
          </AlertDescription>
        </Alert>

        <Alert className="mb-8">
          <Phone className="h-4 w-4" />
          <AlertDescription>
            You will receive a WhatsApp message with check-in instructions 24 hours before your arrival.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{' '}
            <a href="mailto:info@xtsy.com" className="text-primary hover:underline">
              info@xtsy.com
            </a>
            {' '}or{' '}
            <a href="tel:+919999999999" className="text-primary hover:underline">
              +91 99999 99999
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}