import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Edit, ExternalLink, Receipt } from 'lucide-react';
import { useScreenSize } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

// --- Supabase client (browser anon) ---
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// --- Types for line items (room total, add-ons, taxes, etc.) ---
export interface BookingSummaryItem {
  label: string;
  amount: number; // in base INR; will be formatted with useApp
}

interface BookingSummaryProps {
  checkIn: string;      // ISO date
  checkOut: string;     // ISO date
  guests: number;
  nights: number;
  onEdit?: () => void;

  // Enriched booking info
  roomType?: string;    // e.g. "Bed in 6-Bed Mixed Dorm"
  roomTypeId?: string;  // e.g. "6-bed-mixed-dorm" (used for payment/inventory)
  quantity?: number;    // units (beds/rooms) for this roomType
  items?: BookingSummaryItem[];  // line items to display
  totalPrice?: number;  // grand total (INR) to pay now or full
  guestName?: string;
  email?: string;
  phone?: string;       // WhatsApp number
}

// ---- util: load Cashfree JS only once ----
const loadCashfree = () =>
  new Promise<void>((resolve, reject) => {
    if ((window as any).Cashfree) return resolve();
    const s = document.createElement('script');
    s.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
    document.head.appendChild(s);
  });

const BookingSummary: React.FC<BookingSummaryProps> = ({
  checkIn,
  checkOut,
  guests,
  nights,
  onEdit,
  roomType = 'XTSY Accommodation',
  roomTypeId,
  quantity = 1,
  items = [],
  totalPrice = 0,
  guestName = '',
  email = '',
  phone = ''
}) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  const { formatPrice } = useApp();
  const { toast } = useToast();
  const [isPaying, setIsPaying] = useState(false);
  const [receipt, setReceipt] = useState<{ orderId: string; amount: number } | null>(null);

  const formatShort = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const whatsappMessage = useMemo(() => {
    const lineItems = items
      .map((it) => `• ${it.label}: ₹${it.amount}`)
      .join('\n');

    const msg =
`Booking Request – Payment Completed ✅

👤 Guest: ${guestName || '-'}
📧 Email: ${email || '-'}
📱 WhatsApp: ${phone || '-'}

🏨 Room Type: ${roomType}
🛏️ Units: ${quantity}
👥 Guests: ${guests}
📅 Check-in: ${new Date(checkIn).toLocaleDateString()}
📅 Check-out: ${new Date(checkOut).toLocaleDateString()}
🌙 Nights: ${nights}

💳 Payment Receipt:
• Order ID: ${receipt?.orderId || '(pending)'}
• Amount Paid: ₹${receipt?.amount ?? totalPrice}

🧾 Pricing:
${lineItems || '• (line items not specified)'}
— — — — — — — — —
Grand Total: ₹${totalPrice}

Kindly confirm my booking. Thank you!`;
    return msg;
  }, [guestName, email, phone, roomType, quantity, guests, checkIn, checkOut, nights, items, totalPrice, receipt]);

  // ---- Handler: pay with Cashfree, then open WhatsApp on success ----
  const handlePayAndWhatsApp = async () => {
    if (!checkIn || !checkOut || !roomTypeId || !totalPrice) {
      toast({
        title: 'Missing details',
        description: 'Please ensure dates, room type and total are set.',
        variant: 'destructive'
      });
      return;
    }

    setIsPaying(true);
    try {
      // 1) Create payment order via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('cashfree-create-order', {
        body: {
          room_type_id: roomTypeId,
          check_in: checkIn,
          check_out: checkOut,
          quantity,
          amount: totalPrice, // in INR
          customer_name: guestName,
          customer_email: email,
          customer_phone: phone
        }
      });

      if (error || !data) {
        toast({
          title: 'Could not start payment',
          description: error?.message || 'Please try again.',
          variant: 'destructive'
        });
        setIsPaying(false);
        return;
      }

      // 2) Load Cashfree SDK if needed
      await loadCashfree();

      // 3) Launch Cashfree checkout
      const cashfree = (window as any).Cashfree({ mode: import.meta.env.PROD ? 'production' : 'sandbox' });
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        returnUrl: `${window.location.origin}/booking-success?order_id=${data.order_id}`,

        onSuccess: () => {
          // store a simple receipt for display
          setReceipt({ orderId: data.order_id, amount: totalPrice });

          // open WhatsApp (property)
          const propertyWhatsApp = `https://wa.me/918837317070?text=${encodeURIComponent(whatsappMessage)}`;
          window.open(propertyWhatsApp, '_blank', 'noopener,noreferrer');

          // optional: open guest WhatsApp confirmation after 1s
          if (phone) {
            const clean = phone.replace(/\D/g, '');
            const guestMsg = `Dear ${guestName || 'Guest'},\n\n${whatsappMessage}\n\nSee you soon at XTSY! 🏨✨`;
            setTimeout(() => {
              window.open(`https://wa.me/${clean}?text=${encodeURIComponent(guestMsg)}`, '_blank', 'noopener,noreferrer');
            }, 1000);
          }

          toast({ title: 'Payment Successful', description: 'Opening WhatsApp…' });
          setIsPaying(false);
        },

        onFailure: (res: any) => {
          toast({
            title: 'Payment Failed',
            description: res?.paymentMessage || 'Please try again.',
            variant: 'destructive'
          });
          setIsPaying(false);
        },

        onCancel: () => {
          toast({
            title: 'Payment Cancelled',
            description: 'No charge made.',
            variant: 'destructive'
          });
          setIsPaying(false);
        }
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: 'Unexpected error',
        description: e?.message || 'Please try again.',
        variant: 'destructive'
      });
      setIsPaying(false);
    }
  };

  return (
    <Card
      className={`transition-all duration-300 backdrop-blur-sm bg-card/95 ${
        isMobile ? 'sticky top-2 mx-2 shadow-md border-border/60' : 'sticky top-4 shadow-sm border-border/50'
      }`}
    >
      <CardHeader className="transition-all duration-300 pb-2 pt-3 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="transition-all duration-300 text-base text-center flex-1">
            Booking Summary
          </CardTitle>
          {onEdit && (
            <Button
              variant="ghost"
              size={isMobile ? 'sm' : 'default'}
              onClick={onEdit}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Edit className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${isMobile ? '' : 'mr-1'}`} />
              {!isMobile && 'Edit'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="transition-all duration-300 pt-0 pb-3 px-3">
        {/* Dates & Guests */}
        <div className={`grid transition-all duration-300 ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-3 gap-2'}`}>
          <div className="flex items-center flex-col text-center">
            <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} mb-1 bg-primary/10 rounded-full flex items-center justify-center`}>
              <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <p className="text-xs font-medium">Check-in</p>
            <p className="text-xs font-medium text-foreground">{formatShort(checkIn)}</p>
          </div>

          <div className="flex items-center flex-col text-center">
            <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} mb-1 bg-primary/10 rounded-full flex items-center justify-center`}>
              <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <p className="text-xs font-medium">Check-out</p>
            <p className="text-xs font-medium text-foreground">{formatShort(checkOut)}</p>
          </div>

          <div className="flex items-center flex-col text-center">
            <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} mb-1 bg-primary/10 rounded-full flex items-center justify-center`}>
              <Users className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <p className="text-xs font-medium">Guests</p>
            <p className="text-xs font-medium text-foreground">{guests}</p>
          </div>
        </div>

        {/* Nights + Room Type */}
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            {nights} night{nights > 1 ? 's' : ''} • {roomType}
          </p>
        </div>

        {/* Optional contact */}
        {(guestName || email || phone) && (
          <div className="mt-3 text-xs text-muted-foreground space-y-1">
            {guestName && <div><span className="font-medium">Guest:</span> {guestName}</div>}
            {email && <div><span className="font-medium">Email:</span> {email}</div>}
            {phone && <div><span className="font-medium">Phone:</span> {phone}</div>}
          </div>
        )}

        {/* Line Items */}
        {items.length > 0 && (
          <div className="mt-3 border-t pt-3 space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{it.label}</span>
                <span className="font-medium">{formatPrice(it.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="mt-3 border-t pt-3 flex justify-between items-center">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-sm font-bold">{formatPrice(totalPrice)}</span>
        </div>

        {/* Payment receipt (after success) */}
        {receipt && (
          <div className="mt-3 border rounded bg-green-50 p-3 text-xs text-green-800">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <Receipt className="w-3 h-3" /> Payment Receipt
            </div>
            <div>Order ID: <span className="font-medium">{receipt.orderId}</span></div>
            <div>Amount Paid: <span className="font-medium">{formatPrice(receipt.amount)}</span></div>
          </div>
        )}

        {/* CTA: Pay → WhatsApp */}
        <div className="mt-4">
          <Button
            onClick={handlePayAndWhatsApp}
            disabled={isPaying}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold flex items-center justify-center gap-2"
            title="Pay securely, then WhatsApp will open automatically"
          >
            <ExternalLink className="w-4 h-4" />
            {isPaying ? 'Processing…' : 'Complete Booking via WhatsApp'}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            WhatsApp opens only after successful payment. We don’t store your chat.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
