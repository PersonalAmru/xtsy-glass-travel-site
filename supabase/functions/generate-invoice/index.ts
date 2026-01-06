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
  specialRequests?: string;
  userId?: string;
}

// XTSY Brand Logo URL
const XTSY_LOGO_URL = 'https://xtsy.lovable.app/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png';

function generateInvoiceHTML(data: InvoiceData): string {
  const now = new Date();
  const formattedCheckIn = new Date(data.checkIn).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedCheckOut = new Date(data.checkOut).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedDate = now.toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });
  const invoiceTimestamp = `${formattedDate} at ${formattedTime}`;

  const gstPercent = (data.gstRate * 100).toFixed(0);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.bookingId} - XTSY Travellers Hostel</title>
  <link rel="icon" href="/xtsy-favicon.png" type="image/png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; 
      background: #0f1419; 
      color: #1e293b;
      line-height: 1.6;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .invoice { 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }
    
    /* Header with Logo */
    .header { 
      background: linear-gradient(135deg, #0f1419 0%, #1a202c 50%, #2d3748 100%);
      color: white; 
      padding: 48px;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 60%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.03), transparent);
      transform: rotate(-12deg);
    }
    .header-content { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      position: relative;
      z-index: 1;
    }
    .logo-section { display: flex; align-items: center; gap: 16px; }
    .logo-img {
      height: 64px;
      width: auto;
      filter: brightness(0) invert(1);
    }
    .invoice-meta { text-align: right; }
    .invoice-label { 
      font-size: 11px; 
      font-weight: 600;
      text-transform: uppercase; 
      letter-spacing: 0.15em;
      opacity: 0.6;
      margin-bottom: 4px;
    }
    .invoice-number { 
      font-size: 24px; 
      font-weight: 800; 
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    .invoice-timestamp { 
      font-size: 13px; 
      opacity: 0.7;
      margin-bottom: 16px;
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fbbf24;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .body { padding: 48px; }
    
    .section { margin-bottom: 40px; }
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .section-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #0f1419, #1a202c);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
    }
    .section-title { 
      font-size: 13px; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 0.1em;
      color: #64748b; 
    }
    
    .guest-info { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 32px;
      background: #f8fafc;
      border-radius: 16px;
      padding: 24px;
    }
    .info-block {}
    .info-label { 
      font-size: 11px; 
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .info-block h3 { 
      font-size: 18px; 
      font-weight: 700; 
      color: #0f172a;
      margin-bottom: 4px;
    }
    .info-block p { color: #64748b; font-size: 14px; }
    
    .booking-details {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border-radius: 16px;
      padding: 28px;
      border: 1px solid #e2e8f0;
    }
    .detail-row { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { 
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
    }
    .detail-value { 
      font-weight: 700;
      font-size: 15px;
      color: #0f172a;
    }
    .detail-value.highlight {
      color: #0f1419;
      font-size: 16px;
    }
    
    .pricing-table { 
      width: 100%; 
      border-collapse: collapse;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .pricing-table th { 
      text-align: left; 
      padding: 16px 20px;
      background: #0f1419;
      color: white;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
    }
    .pricing-table th:last-child { text-align: right; }
    .pricing-table td { 
      padding: 20px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
    }
    .pricing-table td:last-child { 
      text-align: right; 
      font-weight: 700;
      font-size: 15px;
    }
    .pricing-table tbody tr:last-child td { border-bottom: none; }
    
    .totals { 
      margin-top: 24px;
      background: #f8fafc;
      border-radius: 16px;
      padding: 24px;
    }
    .total-row { 
      display: flex; 
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
    }
    .total-label { 
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
    }
    .total-value { 
      font-weight: 700;
      font-size: 15px;
      color: #0f172a;
    }
    .grand-total {
      background: linear-gradient(135deg, #0f1419 0%, #1a202c 100%);
      color: white;
      padding: 20px 24px;
      border-radius: 12px;
      margin-top: 16px;
    }
    .grand-total .total-label,
    .grand-total .total-value { 
      color: white; 
      font-size: 18px;
      font-weight: 700;
    }
    
    .system-note {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 32px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .system-note-icon {
      width: 20px;
      height: 20px;
      color: #f59e0b;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .system-note-text {
      font-size: 13px;
      color: #92400e;
      line-height: 1.5;
    }
    .system-note-text strong {
      font-weight: 600;
    }
    
    .footer {
      background: #f8fafc;
      padding: 40px 48px;
      border-top: 1px solid #e2e8f0;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-brand { 
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .footer-logo {
      height: 32px;
      width: auto;
    }
    .footer-info {
      text-align: right;
    }
    .footer-text { 
      color: #64748b; 
      font-size: 13px; 
      margin-bottom: 4px;
    }
    .footer-contact { 
      color: #0f172a; 
      font-weight: 600; 
      font-size: 14px;
    }
    
    .watermark {
      text-align: center;
      padding: 24px;
      color: #94a3b8;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }
    
    @media print {
      body { 
        background: white; 
        padding: 0;
      }
      .invoice { 
        box-shadow: none;
        border-radius: 0;
      }
    }
    @media (max-width: 600px) {
      body { padding: 16px; }
      .header { padding: 32px 24px; }
      .header-content { flex-direction: column; gap: 24px; }
      .invoice-meta { text-align: left; }
      .body { padding: 32px 24px; }
      .guest-info { grid-template-columns: 1fr; gap: 24px; }
      .footer { padding: 32px 24px; }
      .footer-content { flex-direction: column; gap: 20px; text-align: center; }
      .footer-info { text-align: center; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="header-content">
        <div class="logo-section">
          <img src="${XTSY_LOGO_URL}" alt="XTSY Travellers Hostel" class="logo-img">
        </div>
        <div class="invoice-meta">
          <div class="invoice-label">Proforma Invoice</div>
          <div class="invoice-number">${data.bookingId}</div>
          <div class="invoice-timestamp">Generated: ${invoiceTimestamp}</div>
          <div class="status-badge">
            <span class="status-dot"></span>
            Pending Approval
          </div>
        </div>
      </div>
    </div>
    
    <div class="body">
      <div class="section">
        <div class="section-header">
          <div class="section-icon">👤</div>
          <div class="section-title">Guest Information</div>
        </div>
        <div class="guest-info">
          <div class="info-block">
            <div class="info-label">Guest Name</div>
            <h3>${data.guestName}</h3>
            <p>${data.guestEmail}</p>
            <p>${data.guestPhone}</p>
          </div>
          <div class="info-block">
            <div class="info-label">Billing Address</div>
            ${data.guestAddress ? `<p>${data.guestAddress}</p>` : '<p>—</p>'}
            ${data.guestCity ? `<p>${data.guestCity}${data.guestState ? `, ${data.guestState}` : ''}</p>` : ''}
            ${data.guestPincode ? `<p>PIN: ${data.guestPincode}</p>` : ''}
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">
          <div class="section-icon">📅</div>
          <div class="section-title">Reservation Details</div>
        </div>
        <div class="booking-details">
          <div class="detail-row">
            <span class="detail-label">Check-in Date</span>
            <span class="detail-value highlight">${formattedCheckIn}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-out Date</span>
            <span class="detail-value highlight">${formattedCheckOut}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration of Stay</span>
            <span class="detail-value">${data.nights} Night${data.nights > 1 ? 's' : ''}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Accommodation</span>
            <span class="detail-value">${data.roomName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Quantity</span>
            <span class="detail-value">${data.quantity} ${data.roomType === 'dorm' ? 'Bed' : 'Room'}${data.quantity > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">
          <div class="section-icon">💰</div>
          <div class="section-title">Pricing Summary</div>
        </div>
        <table class="pricing-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty × Nights</th>
              <th>Rate/Night</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${data.roomName}</strong><br><span style="color: #64748b; font-size: 12px;">${data.roomType === 'dorm' ? 'Dormitory Bed' : 'Private Room'}</span></td>
              <td>${data.quantity} × ${data.nights}</td>
              <td>₹${data.ratePerNight.toLocaleString('en-IN')}</td>
              <td>₹${data.subtotal.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span class="total-label">Subtotal</span>
            <span class="total-value">₹${data.subtotal.toLocaleString('en-IN')}</span>
          </div>
          ${Number(gstPercent) > 0 ? `
          <div class="total-row">
            <span class="total-label">GST (${gstPercent}%)</span>
            <span class="total-value">₹${data.gstAmount.toLocaleString('en-IN')}</span>
          </div>
          ` : ''}
          <div class="total-row grand-total">
            <span class="total-label">Total Payable</span>
            <span class="total-value">₹${data.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        <div class="system-note">
          <svg class="system-note-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div class="system-note-text">
            <strong>Pending Confirmation:</strong> This is a proforma invoice. Your booking is awaiting host approval. 
            Once approved, you will receive a confirmation notification and this invoice will be updated.
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <img src="${XTSY_LOGO_URL}" alt="XTSY" class="footer-logo">
        </div>
        <div class="footer-info">
          <p class="footer-text">Thank you for choosing XTSY!</p>
          <p class="footer-contact">hello@xtsyhostels.com | +91 9876543210</p>
        </div>
      </div>
    </div>
    
    <div class="watermark">
      System Generated Invoice • No Signature Required
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
        p_message_to_host: null, // No longer required
        p_address: data.guestAddress || null,
        p_city: data.guestCity || null,
        p_state: data.guestState || null,
        p_pincode: data.guestPincode || null,
        p_special_requests: data.specialRequests || null,
        p_user_id: data.userId || null,
      });

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message);
      }

      const dbResult = result as { success: boolean; bookingId?: string; bookingUUID?: string; error?: string };
      
      if (!dbResult.success) {
        throw new Error(dbResult.error || 'Failed to create booking');
      }

      // Update the invoice with generated HTML
      await supabase
        .from('booking_invoices')
        .update({ html_content: html })
        .eq('booking_id', dbResult.bookingId);

      // Create admin notification for new booking (pending approval)
      if (dbResult.bookingUUID) {
        await supabase.from('admin_notifications').insert({
          type: 'new_booking',
          title: '🔔 New Booking Request',
          message: `${data.guestName} has requested ${data.roomName} for ${new Date(data.checkIn).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} - ${new Date(data.checkOut).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}. Total: ₹${data.totalAmount.toLocaleString('en-IN')}. Awaiting your approval.`,
          booking_id: dbResult.bookingUUID,
          metadata: {
            guest_name: data.guestName,
            guest_email: data.guestEmail,
            guest_phone: data.guestPhone,
            room_name: data.roomName,
            check_in: data.checkIn,
            check_out: data.checkOut,
            total_amount: data.totalAmount,
            booking_id: dbResult.bookingId,
            status: 'pending',
          },
        });

        // Send system welcome message in chat (XTSY Pings) - pending status
        const checkInFormatted = new Date(data.checkIn).toLocaleDateString('en-IN', { 
          weekday: 'short', month: 'short', day: 'numeric' 
        });
        await supabase.from('booking_messages').insert({
          booking_id: dbResult.bookingUUID,
          sender_type: 'admin',
          sender_name: 'XTSY Host',
          message: `👋 Hi ${data.guestName.split(' ')[0]}! We've received your booking request for ${data.roomName} on ${checkInFormatted}. ⏳ Pending confirmation from host. Feel free to drop us a message if you have any questions!`,
        });
      }

      console.log('Invoice generated for booking:', dbResult.bookingId, 'User ID:', data.userId);

      return new Response(JSON.stringify({
        success: true,
        bookingId: dbResult.bookingId,
        bookingUUID: dbResult.bookingUUID,
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