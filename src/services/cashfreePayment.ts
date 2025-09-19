interface CashfreeConfig {
  appId: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  selectedRooms: any[];
  totalAmount: number;
  gstAmount: number;
  subtotal: number;
}

interface GuestData {
  guestName: string;
  email: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact?: string;
  emergencyRelation?: string;
}

interface PaymentData {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  orderMeta: {
    returnUrl: string;
    notifyUrl?: string;
  };
}

class CashfreePaymentService {
  private config: CashfreeConfig;

  constructor() {
    // Default to sandbox environment
    this.config = {
      appId: import.meta.env.VITE_CASHFREE_APP_ID || 'sandbox_app_id',
      secretKey: import.meta.env.VITE_CASHFREE_SECRET_KEY || 'sandbox_secret',
      environment: (import.meta.env.VITE_CASHFREE_ENV as 'sandbox' | 'production') || 'sandbox'
    };
  }

  private getBaseUrl(): string {
    return this.config.environment === 'production' 
      ? 'https://api.cashfree.com' 
      : 'https://sandbox.cashfree.com';
  }

  private generateOrderId(): string {
    return `XTSY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async createPaymentSession(bookingData: BookingData, guestData: GuestData): Promise<string> {
    const orderId = this.generateOrderId();
    
    const paymentData: PaymentData = {
      orderId,
      orderAmount: bookingData.totalAmount,
      orderCurrency: 'INR',
      customerDetails: {
        customerId: `guest_${Date.now()}`,
        customerName: guestData.guestName,
        customerEmail: guestData.email,
        customerPhone: guestData.whatsappNumber
      },
      orderMeta: {
        returnUrl: `${window.location.origin}/booking-confirmation?orderId=${orderId}`,
        notifyUrl: `${window.location.origin}/api/payment-webhook`
      }
    };

    try {
      // Store booking data locally for confirmation page
      localStorage.setItem(`booking_${orderId}`, JSON.stringify({
        ...bookingData,
        ...guestData,
        orderId,
        createdAt: new Date().toISOString()
      }));

      // In a real implementation, you would make an API call to your backend
      // which would then create the payment session with Cashfree
      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const result = await response.json();
      
      // For demo purposes, create a mock payment URL
      const mockPaymentUrl = this.createMockPaymentUrl(paymentData);
      return mockPaymentUrl;
      
    } catch (error) {
      console.error('Error creating payment session:', error);
      // Fallback to mock payment for demo
      return this.createMockPaymentUrl(paymentData);
    }
  }

  private createMockPaymentUrl(paymentData: PaymentData): string {
    // Create a mock Cashfree payment URL for demo purposes
    const params = new URLSearchParams({
      orderId: paymentData.orderId,
      orderAmount: paymentData.orderAmount.toString(),
      customerName: paymentData.customerDetails.customerName,
      customerEmail: paymentData.customerDetails.customerEmail,
      returnUrl: paymentData.orderMeta.returnUrl
    });

    return `${this.getBaseUrl()}/pg/orders/pay?${params.toString()}`;
  }

  async verifyPayment(orderId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/verify-payment/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.status === 'SUCCESS';
      
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }
}

export const cashfreeService = new CashfreePaymentService();
export type { BookingData, GuestData, PaymentData };