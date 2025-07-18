
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

// DEPRECATED: This component is deprecated in favor of SecurePaymentHandler
// Please use SecurePaymentHandler for all new implementations
const PaymentHandler = ({ bookingData, onSuccess, onError }: PaymentHandlerProps) => {
  const { toast } = useToast();

  const initiatePayment = () => {
    toast({
      title: "Payment System Updated",
      description: "Please use the secure payment system. This component is deprecated.",
      variant: "destructive"
    });
    
    console.warn('PaymentHandler is deprecated. Use SecurePaymentHandler instead.');
    onError(new Error('Payment system deprecated'));
  };

  return { initiatePayment };
};

export default PaymentHandler;
