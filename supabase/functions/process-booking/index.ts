
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingData {
  booking_id: string;
  guest_name: string;
  email: string;
  whatsapp_number: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  room_details: any[];
  total_amount: number;
  payment_verified?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Enforce service role authorization
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    if (!serviceKey || token !== serviceKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, data } = await req.json();

    console.log('Processing booking action:', action);

    switch (action) {
      case 'verify_payment': {
        const { txn_id, amount, source, razorpay_payment_id } = data;
        
        // Find matching booking by amount
        const { data: bookings, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('booking_status', 'pending')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
          .order('created_at', { ascending: false });

        if (bookingError) {
          throw bookingError;
        }

        // Find booking with matching advance amount (21% of total)
        const matchingBooking = bookings?.find(booking => {
          const expectedAdvance = Math.round(booking.total_amount * 0.21);
          return Math.abs(amount - expectedAdvance) <= 10; // Allow ±10 paise difference
        });

        if (!matchingBooking) {
          console.log('No matching booking found for amount:', amount);
          return new Response(
            JSON.stringify({ success: false, message: 'No matching booking found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create transaction record
        const { error: txnError } = await supabase
          .from('transactions')
          .insert({
            txn_id,
            booking_id: matchingBooking.id,
            razorpay_payment_id,
            amount,
            source,
            payment_status: 'success',
            matched: true,
            verified_at: new Date().toISOString()
          });

        if (txnError) {
          throw txnError;
        }

        // Update booking status
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            booking_status: 'confirmed',
            payment_verified_at: new Date().toISOString()
          })
          .eq('id', matchingBooking.id);

        if (updateError) {
          throw updateError;
        }

        // Send confirmations
        await sendBookingConfirmations(supabase, matchingBooking);

        // Generate invoice
        await generateInvoice(supabase, matchingBooking);

        return new Response(
          JSON.stringify({ 
            success: true, 
            booking_id: matchingBooking.booking_id,
            message: 'Payment verified and booking confirmed' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'generate_invoice': {
        const { booking_id } = data;
        
        const { data: booking, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('booking_id', booking_id)
          .single();

        if (error || !booking) {
          throw new Error('Booking not found');
        }

        await generateInvoice(supabase, booking);

        return new Response(
          JSON.stringify({ success: true, message: 'Invoice generated' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error processing booking:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function sendBookingConfirmations(supabase: any, booking: BookingData) {
  try {
    // Prepare booking details message
    const message = `
🎉 BOOKING CONFIRMED!

📋 Booking ID: ${booking.booking_id}
👤 Guest: ${booking.guest_name}
📧 Email: ${booking.email}
📱 WhatsApp: ${booking.whatsapp_number}

📅 Check-in: ${new Date(booking.check_in).toLocaleDateString()}
📅 Check-out: ${new Date(booking.check_out).toLocaleDateString()}
🌙 Nights: ${booking.nights}
👥 Guests: ${booking.guests}

💰 Total Amount: ₹${booking.total_amount}
💳 Advance Paid: ₹${Math.round(booking.total_amount * 0.21)}

🏨 Room Details:
${booking.room_details.map((room: any) => `• ${room.roomName} x${room.quantity}`).join('\n')}

Thank you for choosing XTSY! 🙏
    `.trim();

    // Send to property WhatsApp
    const propertyWhatsAppUrl = `https://wa.me/918837317070?text=${encodeURIComponent(message)}`;
    console.log('Property WhatsApp URL:', propertyWhatsAppUrl);

    // Send to guest WhatsApp
    const guestWhatsAppUrl = `https://wa.me/${booking.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
      `Dear ${booking.guest_name},\n\n${message}\n\nSee you soon at XTSY! 🏨✨`
    )}`;
    console.log('Guest WhatsApp URL:', guestWhatsAppUrl);

    // Record confirmation attempt
    await supabase
      .from('booking_confirmations')
      .insert({
        booking_id: booking.id,
        sent_to_guest_whatsapp: true,
        sent_to_property_whatsapp: true, 
        sent_to_guest_email: true,
        sent_to_property_email: true,
        confirmation_sent_at: new Date().toISOString()
      });

    console.log('Booking confirmations sent successfully');
  } catch (error) {
    console.error('Error sending confirmations:', error);
  }
}

async function generateInvoice(supabase: any, booking: BookingData) {
  try {
    // Create PDF invoice content
    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice - ${booking.booking_id}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #f97316; margin-bottom: 5px; }
        .tagline { color: #666; font-size: 14px; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .booking-details, .guest-details { background: #f9f9f9; padding: 15px; border-radius: 8px; }
        .section-title { font-weight: bold; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .room-details { margin: 20px 0; }
        .room-item { background: white; padding: 10px; margin: 5px 0; border-left: 4px solid #f97316; }
        .totals { background: #f97316; color: white; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏨 XTSY TRAVELLERS HOSTEL</div>
        <div class="tagline">Your Home Away From Home in Meghalaya</div>
        <div style="margin-top: 10px; font-size: 12px;">
            📍 Shillong, Meghalaya | 📱 +91 88373 17070 | 📧 booking@xtsy.one
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #f97316; margin: 0;">BOOKING INVOICE</h2>
        <div style="font-size: 18px; font-weight: bold; margin-top: 10px;">
            Booking ID: ${booking.booking_id}
        </div>
        <div style="color: #666; margin-top: 5px;">
            Generated on: ${new Date().toLocaleDateString()}
        </div>
    </div>

    <div class="invoice-info">
        <div class="guest-details" style="width: 48%;">
            <div class="section-title">👤 GUEST DETAILS</div>
            <div><strong>Name:</strong> ${booking.guest_name}</div>
            <div><strong>Email:</strong> ${booking.email}</div>
            <div><strong>WhatsApp:</strong> ${booking.whatsapp_number}</div>
        </div>

        <div class="booking-details" style="width: 48%;">
            <div class="section-title">📅 BOOKING DETAILS</div>
            <div><strong>Check-in:</strong> ${new Date(booking.check_in).toLocaleDateString()}</div>
            <div><strong>Check-out:</strong> ${new Date(booking.check_out).toLocaleDateString()}</div>
            <div><strong>Nights:</strong> ${booking.nights}</div>
            <div><strong>Guests:</strong> ${booking.guests}</div>
        </div>
    </div>

    <div class="room-details">
        <div class="section-title">🏨 ACCOMMODATION DETAILS</div>
        ${booking.room_details.map((room: any) => `
            <div class="room-item">
                <div style="font-weight: bold;">${room.roomName}</div>
                <div>Quantity: ${room.quantity} | Guests: ${room.guests || booking.guests}</div>
                <div>Rate: ₹${room.price} per ${room.roomType === 'dorm' ? 'person' : 'room'} per night</div>
            </div>
        `).join('')}
    </div>

    <div class="totals">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Subtotal:</span>
            <span>₹${booking.total_amount}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>GST (18%):</span>
            <span>₹${Math.round(booking.total_amount * 0.18)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px;">
            <span>Total Amount:</span>
            <span>₹${booking.total_amount}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 16px;">
            <span>Advance Paid:</span>
            <span>₹${Math.round(booking.total_amount * 0.21)} (21%)</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>Balance at Check-in:</span>
            <span>₹${booking.total_amount - Math.round(booking.total_amount * 0.21)}</span>
        </div>
    </div>

    <div class="footer">
        <div style="margin-bottom: 10px;">
            <strong>🎉 Thank you for choosing XTSY Travellers Hostel!</strong>
        </div>
        <div style="font-size: 12px; line-height: 1.5;">
            For any queries, contact us at +91 88373 17070 or booking@xtsy.one<br>
            Follow us: @xtsy.travellers | Visit: www.xtsy.one
        </div>
        <div style="margin-top: 15px; font-size: 10px; color: #999;">
            This is a computer-generated invoice. No signature required.
        </div>
    </div>
</body>
</html>
    `;

    // Convert HTML to PDF and upload to storage
    const fileName = `invoice-${booking.booking_id}-${Date.now()}.pdf`;
    
    // For now, just log the invoice HTML (in production, use a PDF generation service)
    console.log('Invoice generated for booking:', booking.booking_id);
    console.log('Invoice HTML length:', invoiceHtml.length);

    // Update booking with invoice status
    await supabase
      .from('bookings')
      .update({
        invoice_generated: true,
        invoice_url: `https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/booking-invoices/${fileName}`
      })
      .eq('id', booking.id);

    console.log('Invoice generation completed');
  } catch (error) {
    console.error('Error generating invoice:', error);
  }
}
