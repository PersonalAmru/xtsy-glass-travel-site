
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentHandlerProps {
  bookingData: {
    totalAmount: number;
    guestName: string;
    email: string;
    whatsappNumber: string;
    bookingId: string;
  };
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

const PaymentHandler = ({ bookingData, onSuccess, onError }: PaymentHandlerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = () => {
    if (!window.Razorpay) {
      toast({
        title: "Payment Error",
        description: "Payment gateway failed to load. Please try again.",
        variant: "destructive"
      });
      return;
    }

    const options = {
      key: "rzp_live_1234567890", // Replace with actual Razorpay key
      amount: Math.round(bookingData.totalAmount * 0.21 * 100), // 21% advance payment in paise
      currency: "INR",
      name: "XTSY Travellers Hostel",
      description: `Booking ${bookingData.bookingId}`,
      order_id: bookingData.bookingId,
      handler: async (response: any) => {
        try {
          // Payment successful
          toast({
            title: "Payment Successful!",
            description: "Your payment has been processed. Booking confirmation will be sent shortly.",
          });
          
          onSuccess(response);
        } catch (error) {
          console.error('Payment verification failed:', error);
          onError(error);
        }
      },
      prefill: {
        name: bookingData.guestName,
        email: bookingData.email,
        contact: bookingData.whatsappNumber
      },
      theme: {
        color: "#f97316"
      },
      modal: {
        ondismiss: () => {
          toast({
            title: "Payment Cancelled",
            description: "You can complete the payment later from your booking details.",
          });
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return { initiatePayment };
};

export default PaymentHandler;
