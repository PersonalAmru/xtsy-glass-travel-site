import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoiceData {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string;
  guestCity?: string;
  guestState?: string;
  guestPincode?: string;
  checkIn: string;
  checkOut: string;
  roomName: string;
  roomType: string;
  quantity: number;
  nights: number;
  ratePerNight: number;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  messageToHost: string;
  specialRequests?: string;
}

function generateInvoiceHTML(data: InvoiceData): string {
  const formattedCheckIn = new Date(data.checkIn).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedCheckOut = new Date(data.checkOut).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const gstPercent = (data.gstRate * 100).toFixed(0);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.bookingId} - XTSY Hostels</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', system-ui, sans-serif; 
      background: #f8fafc; 
      color: #1e293b;
      line-height: 1.6;
    }
    .invoice { 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    .header { 
      background: linear-gradient(135deg, hsl(160, 35%, 22%) 0%, hsl(160, 40%, 18%) 100%);
      color: white; 
      padding: 40px;
    }
    .header-content { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo { font-size: 32px; font-weight: 800; letter-spacing: -1px; }
    .logo span { color: rgba(255,255,255,0.6); }
    .invoice-meta { text-align: right; }
    .invoice-number { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
    .invoice-date { opacity: 0.8; }
    
    .status-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 8px;
    }
    
    .body { padding: 40px; }
    
    .section { margin-bottom: 32px; }
    .section-title { 
      font-size: 12px; 
      font-weight: 600; 
      text-transform: uppercase; 
      letter-spacing: 0.1em;
      color: #64748b; 
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .guest-info { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .info-block h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .info-block p { color: #64748b; font-size: 14px; }
    
    .booking-details {
      background: #f8fafc;
      border-radius: 12px;
      padding: 24px;
    }
    .detail-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; }
    .detail-value { font-weight: 600; }
    
    .pricing-table { width: 100%; border-collapse: collapse; }
    .pricing-table th { 
      text-align: left; 
      padding: 12px 16px;
      background: #f1f5f9;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
    }
    .pricing-table th:last-child { text-align: right; }
    .pricing-table td { 
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
    }
    .pricing-table td:last-child { text-align: right; font-weight: 600; }
    
    .totals { margin-top: 24px; }
    .total-row { 
      display: flex; 
      justify-content: flex-end; 
      padding: 8px 0;
    }
    .total-label { width: 200px; color: #64748b; }
    .total-value { width: 120px; text-align: right; font-weight: 600; }
    .grand-total {
      background: linear-gradient(135deg, hsl(160, 35%, 22%) 0%, hsl(160, 40%, 18%) 100%);
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
    }
    .grand-total .total-label,
    .grand-total .total-value { color: white; font-size: 18px; }
    
    .message-box {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      border-radius: 0 8px 8px 0;
    }
    .message-box h4 { color: #92400e; margin-bottom: 8px; }
    .message-box p { color: #78350f; font-style: italic; }
    
    .footer {
      background: #f8fafc;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text { color: #64748b; font-size: 14px; margin-bottom: 8px; }
    .footer-contact { color: #1e293b; font-weight: 600; }
    
    @media print {
      body { background: white; }
      .invoice { box-shadow: none; }
    }
    @media (max-width: 600px) {
      .header { padding: 24px; }
      .header-content { flex-direction: column; gap: 16px; }
      .invoice-meta { text-align: left; }
      .body { padding: 24px; }
      .guest-info { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="header-content">
        <div>
          <div class="logo">XTSY<span>hostels</span></div>
          <p style="opacity: 0.8; margin-top: 8px;">Premium Backpacker Experience</p>
        </div>
        <div class="invoice-meta">
          <div class="invoice-number">${data.bookingId}</div>
          <div class="invoice-date">${formattedDate}</div>
          <div class="status-badge">Confirmed</div>
        </div>
      </div>
    </div>
    
    <div class="body">
      <div class="section">
        <div class="section-title">Guest Information</div>
        <div class="guest-info">
          <div class="info-block">
            <h3>${data.guestName}</h3>
            <p>${data.guestEmail}</p>
            <p>${data.guestPhone}</p>
          </div>
          <div class="info-block">
            ${data.guestAddress ? `<p>${data.guestAddress}</p>` : ''}
            ${data.guestCity ? `<p>${data.guestCity}${data.guestState ? `, ${data.guestState}` : ''}</p>` : ''}
            ${data.guestPincode ? `<p>${data.guestPincode}</p>` : ''}
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Booking Details</div>
        <div class="booking-details">
          <div class="detail-row">
            <span class="detail-label">Check-in</span>
            <span class="detail-value">${formattedCheckIn}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-out</span>
            <span class="detail-value">${formattedCheckOut}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration</span>
            <span class="detail-value">${data.nights} Night${data.nights > 1 ? 's' : ''}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Accommodation</span>
            <span class="detail-value">${data.roomName}</span>
          </div>
        </div>
      </div>
      
      ${data.messageToHost ? `
      <div class="section">
        <div class="section-title">Message to Host</div>
        <div class="message-box">
          <h4>From ${data.guestName.split(' ')[0]}</h4>
          <p>"${data.messageToHost}"</p>
        </div>
      </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Pricing Breakdown</div>
        <table class="pricing-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${data.roomName} (${data.roomType})</td>
              <td>${data.quantity} × ${data.nights} night${data.nights > 1 ? 's' : ''}</td>
              <td>₹${data.ratePerNight.toLocaleString('en-IN')}/night</td>
              <td>₹${data.subtotal.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span class="total-label">Subtotal</span>
            <span class="total-value">₹${data.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div class="total-row">
            <span class="total-label">GST (${gstPercent}%)</span>
            <span class="total-value">₹${data.gstAmount.toLocaleString('en-IN')}</span>
          </div>
          <div class="total-row grand-total">
            <span class="total-label">Total Amount</span>
            <span class="total-value">₹${data.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p class="footer-text">Thank you for choosing XTSY Hostels!</p>
      <p class="footer-contact">Questions? Contact us at hello@xtsyhostels.com</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, bookingId, invoiceData } = await req.json();

    if (action === 'generate') {
      // Generate new invoice
      const data = invoiceData as InvoiceData;
      const html = generateInvoiceHTML(data);
      
      // Call the database function to create booking with invoice
      const { data: result, error } = await supabase.rpc('create_booking_with_invoice', {
        p_guest_name: data.guestName,
        p_email: data.guestEmail,
        p_phone: data.guestPhone,
        p_check_in: data.checkIn,
        p_check_out: data.checkOut,
        p_room_name: data.roomName,
        p_room_type: data.roomType,
        p_quantity: data.quantity,
        p_nights: data.nights,
        p_rate_per_night: data.ratePerNight,
        p_subtotal: data.subtotal,
        p_gst_rate: data.gstRate,
        p_gst_amount: data.gstAmount,
        p_total_amount: data.totalAmount,
        p_message_to_host: data.messageToHost,
        p_address: data.guestAddress || null,
        p_city: data.guestCity || null,
        p_state: data.guestState || null,
        p_pincode: data.guestPincode || null,
        p_special_requests: data.specialRequests || null,
      });

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message);
      }

      const dbResult = result as { success: boolean; bookingId?: string; error?: string };
      
      if (!dbResult.success) {
        throw new Error(dbResult.error || 'Failed to create booking');
      }

      // Update the invoice with generated HTML
      await supabase
        .from('booking_invoices')
        .update({ html_content: html })
        .eq('booking_id', dbResult.bookingId);

      // Get the booking's id (UUID) from the booking_id (XTH-INV-XXX)
      const { data: booking } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_id', dbResult.bookingId)
        .single();

      // Insert the initial message to host as a chat message
      if (booking && data.messageToHost) {
        await supabase.from('booking_messages').insert({
          booking_id: booking.id,
          sender_type: 'guest',
          sender_name: data.guestName,
          message: data.messageToHost,
        });

        // Create admin notification for new booking
        await supabase.from('admin_notifications').insert({
          type: 'new_booking',
          title: 'New Booking Request',
          message: `${data.guestName} has made a booking for ${data.roomName} (${data.checkIn} - ${data.checkOut})`,
          booking_id: booking.id,
          metadata: {
            guest_name: data.guestName,
            room_name: data.roomName,
            check_in: data.checkIn,
            check_out: data.checkOut,
            total_amount: data.totalAmount,
          },
        });
      }

      console.log('Invoice generated for booking:', dbResult.bookingId);

      return new Response(JSON.stringify({
        success: true,
        bookingId: dbResult.bookingId,
        bookingUUID: booking?.id,
        html,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get') {
      // Get existing invoice
      const { data: invoice, error } = await supabase
        .from('booking_invoices')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

      if (error) {
        throw new Error('Invoice not found');
      }

      // Regenerate HTML if not stored
      if (!invoice.html_content) {
        const html = generateInvoiceHTML({
          bookingId: invoice.booking_id,
          guestName: invoice.guest_name,
          guestEmail: invoice.guest_email,
          guestPhone: invoice.guest_phone,
          guestAddress: invoice.guest_address,
          guestCity: invoice.guest_city,
          guestState: invoice.guest_state,
          guestPincode: invoice.guest_pincode,
          checkIn: invoice.check_in,
          checkOut: invoice.check_out,
          roomName: invoice.room_name,
          roomType: invoice.room_type,
          quantity: invoice.quantity,
          nights: invoice.nights,
          ratePerNight: invoice.rate_per_night,
          subtotal: invoice.subtotal,
          gstRate: Number(invoice.gst_rate),
          gstAmount: invoice.gst_amount,
          totalAmount: invoice.total_amount,
          messageToHost: '',
        });
        invoice.html_content = html;
      }

      return new Response(JSON.stringify({
        success: true,
        invoice,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Invoice generation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
