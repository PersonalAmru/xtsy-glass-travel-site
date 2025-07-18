
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SecurePaymentHandlerProps {
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

const SecurePaymentHandler = ({ bookingData, onSuccess, onError }: SecurePaymentHandlerProps) => {
  const { toast } = useToast();

  const initiateSecurePayment = async () => {
    try {
      // Create secure payment order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('secure-payment', {
        body: {
          action: 'create_order',
          data: {
            amount: Math.round(bookingData.totalAmount * 0.21), // 21% advance payment
            bookingId: bookingData.bookingId,
            currency: 'INR'
          }
        }
      });

      if (orderError || !orderData?.success) {
        throw new Error(orderData?.error || 'Failed to create payment order');
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => openRazorpayCheckout(orderData);
        script.onerror = () => {
          toast({
            title: "Payment Error",
            description: "Failed to load payment gateway. Please check your internet connection.",
            variant: "destructive"
          });
        };
        document.head.appendChild(script);
      } else {
        openRazorpayCheckout(orderData);
      }

      function openRazorpayCheckout(orderData: any) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "XTSY Travellers Hostel",
          description: `Booking ${bookingData.bookingId}`,
          order_id: orderData.orderId,
          handler: async (response: any) => {
            try {
              // Verify payment on server
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke('secure-payment', {
                body: {
                  action: 'verify_payment',
                  data: {
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    bookingId: bookingData.bookingId,
                    amount: orderData.amount / 100 // Convert back from paise
                  }
                }
              });

              if (verifyError || !verifyData?.success) {
                throw new Error(verifyData?.error || 'Payment verification failed');
              }

              toast({
                title: "Payment Successful!",
                description: "Your payment has been verified and booking confirmed.",
              });
              
              onSuccess(response);
            } catch (error) {
              console.error('Payment verification error:', error);
              toast({
                title: "Payment Verification Failed",
                description: "Payment completed but verification failed. Contact support.",
                variant: "destructive"
              });
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

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }

    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
      onError(error);
    }
  };

  return { initiateSecurePayment };
};

export default SecurePaymentHandler;
