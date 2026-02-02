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

// XTSY Brand Logo URL (hosted)
const XTSY_LOGO_URL = 'https://xtsy-one.lovable.app/xtsy-invoice-logo.jpg';

// Company Details
const COMPANY = {
  name: 'XTSY Travellers Hostel',
  address: 'Diengiong',
  area: 'New Shillong Township',
  district: 'East Khasi Hills',
  state: 'Meghalaya',
  pincode: '793018',
  country: 'India',
  phone: '+918837317070',
  email: 'admin@xtsy.one',
  gstin: '17QSKPK1714H1ZE',
  upi: '9863627070@okbizaxis',
  hsnCode: '996311', // HSN/SAC for accommodation services
};

// Convert number to words (Indian system)
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  num %= 100;
  const ten = Math.floor(num / 10);
  const one = num % 10;
  
  let result = '';
  
  if (crore > 0) {
    result += (crore < 20 ? ones[crore] : tens[Math.floor(crore / 10)] + ' ' + ones[crore % 10]) + ' Crore ';
  }
  if (lakh > 0) {
    result += (lakh < 20 ? ones[lakh] : tens[Math.floor(lakh / 10)] + ' ' + ones[lakh % 10]) + ' Lakh ';
  }
  if (thousand > 0) {
    result += (thousand < 20 ? ones[thousand] : tens[Math.floor(thousand / 10)] + ' ' + ones[thousand % 10]) + ' Thousand ';
  }
  if (hundred > 0) {
    result += ones[hundred] + ' Hundred ';
  }
  if (ten > 0 || one > 0) {
    if (result !== '') result += 'and ';
    if (ten < 2) {
      result += ones[ten * 10 + one];
    } else {
      result += tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
  }
  
  return result.trim();
}

function generateInvoiceHTML(data: InvoiceData): string {
  const invoiceDate = new Date();
  const formattedInvoiceDate = invoiceDate.toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
  
  // Calculate CGST and SGST (split GST equally)
  const cgstAmount = data.gstAmount / 2;
  const sgstAmount = data.gstAmount / 2;
  const gstPercent = (data.gstRate * 100).toFixed(0);
  const halfGstPercent = (Number(gstPercent) / 2).toFixed(1);
  
  // Total in words
  const totalInWords = `Indian Rupee ${numberToWords(Math.round(data.totalAmount))} Only`;
  
  // Item description
  const itemDescription = data.roomName;
  const qtyDisplay = `${data.quantity * data.nights}.00`;
  const rateDisplay = data.ratePerNight.toFixed(2);
  const amountBeforeTax = data.subtotal;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice ${data.bookingId} - XTSY Travellers Hostel</title>
  <link rel="icon" href="/xtsy-favicon.png" type="image/png">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, Helvetica, sans-serif;
      background: #f5f5f5;
      color: #333;
      line-height: 1.4;
      padding: 20px;
      font-size: 12px;
    }
    .invoice {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 30px 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #c41e3a;
    }
    .logo-section {
      display: flex;
      align-items: center;
    }
    .logo-img {
      height: 80px;
      width: auto;
    }
    .company-details {
      text-align: left;
      margin-left: 15px;
    }
    .company-name {
      font-size: 18px;
      font-weight: bold;
      color: #c41e3a;
      margin-bottom: 2px;
    }
    .company-address {
      font-size: 11px;
      color: #555;
      line-height: 1.4;
    }
    .company-contact {
      font-size: 11px;
      color: #555;
      margin-top: 3px;
    }
    .gstin {
      font-size: 11px;
      font-weight: bold;
      color: #333;
      margin-top: 3px;
    }
    
    /* Tax Invoice Title */
    .invoice-title {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #c41e3a;
      margin: 15px 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    /* Bill To and Invoice Info */
    .info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 11px;
    }
    .bill-to {
      flex: 1;
    }
    .bill-to-label {
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .bill-to-name {
      font-size: 13px;
      font-weight: bold;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-info-row {
      margin-bottom: 3px;
    }
    .invoice-info-label {
      color: #666;
    }
    .invoice-info-value {
      font-weight: bold;
      color: #333;
    }
    
    /* Items Table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      font-size: 11px;
    }
    .items-table th {
      background: #f8f8f8;
      border: 1px solid #ddd;
      padding: 8px 6px;
      text-align: center;
      font-weight: bold;
      color: #333;
    }
    .items-table td {
      border: 1px solid #ddd;
      padding: 8px 6px;
      text-align: center;
    }
    .items-table td.left {
      text-align: left;
    }
    .items-table td.right {
      text-align: right;
    }
    
    /* Totals Section */
    .totals-section {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
    .thanks-message {
      font-style: italic;
      color: #666;
      font-size: 12px;
    }
    .totals {
      width: 250px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 11px;
    }
    .totals-row.total {
      font-weight: bold;
      font-size: 13px;
      border-top: 1px solid #ddd;
      padding-top: 8px;
      margin-top: 5px;
    }
    .totals-row.payment {
      color: #666;
    }
    .totals-row.balance {
      font-weight: bold;
      font-size: 14px;
      color: #c41e3a;
    }
    
    /* Total in Words */
    .total-words {
      margin-top: 15px;
      font-size: 11px;
      font-style: italic;
      color: #333;
    }
    
    /* Payment Info */
    .payment-info {
      margin-top: 15px;
      padding: 10px;
      background: #f8f8f8;
      border-radius: 4px;
      font-size: 11px;
    }
    .payment-info strong {
      color: #c41e3a;
    }
    
    /* Terms */
    .terms {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
    }
    .terms-title {
      font-weight: bold;
      font-size: 11px;
      color: #333;
      margin-bottom: 5px;
    }
    .terms-list {
      font-size: 10px;
      color: #666;
      list-style: none;
    }
    .terms-list li {
      margin-bottom: 2px;
    }
    .terms-list li::before {
      content: "• ";
      color: #c41e3a;
    }
    
    /* Footer */
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 10px;
      color: #888;
    }
    .footer .eco {
      color: #2e7d32;
      margin-bottom: 5px;
    }
    .footer .system {
      font-style: italic;
    }
    .footer .brand {
      margin-top: 10px;
      font-weight: bold;
      color: #c41e3a;
      font-size: 14px;
    }
    
    @media print {
      body { 
        background: white;
        padding: 0;
      }
      .invoice {
        box-shadow: none;
        padding: 20px;
      }
    }
    @media (max-width: 600px) {
      .invoice { padding: 15px; }
      .header { flex-direction: column; gap: 15px; }
      .info-section { flex-direction: column; gap: 15px; }
      .invoice-info { text-align: left; }
      .totals-section { flex-direction: column; gap: 15px; }
      .totals { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <div class="logo-section">
        <img src="${XTSY_LOGO_URL}" alt="XTSY Travellers Hostel" class="logo-img">
        <div class="company-details">
          <div class="company-name">${COMPANY.name}</div>
          <div class="company-address">
            ${COMPANY.address}<br>
            ${COMPANY.area}<br>
            ${COMPANY.district} ${COMPANY.state} ${COMPANY.pincode}<br>
            ${COMPANY.country}
          </div>
          <div class="company-contact">${COMPANY.phone}<br>${COMPANY.email}</div>
          <div class="gstin">GSTIN: ${COMPANY.gstin}</div>
        </div>
      </div>
    </div>
    
    <!-- Tax Invoice Title -->
    <div class="invoice-title">TAX INVOICE</div>
    
    <!-- Bill To and Invoice Info -->
    <div class="info-section">
      <div class="bill-to">
        <div class="bill-to-label">Bill To:</div>
        <div class="bill-to-name">${data.guestName}</div>
        ${data.guestAddress ? `<div>${data.guestAddress}</div>` : ''}
        ${data.guestCity || data.guestState ? `<div>${[data.guestCity, data.guestState].filter(Boolean).join(', ')}</div>` : ''}
        ${data.guestPincode ? `<div>PIN: ${data.guestPincode}</div>` : ''}
        <div>${data.guestPhone}</div>
        <div>${data.guestEmail}</div>
      </div>
      <div class="invoice-info">
        <div class="invoice-info-row">
          <span class="invoice-info-label">Invoice#:</span>
          <span class="invoice-info-value">${data.bookingId}</span>
        </div>
        <div class="invoice-info-row">
          <span class="invoice-info-label">Invoice Date:</span>
          <span class="invoice-info-value">${formattedInvoiceDate}</span>
        </div>
        <div class="invoice-info-row">
          <span class="invoice-info-label">Terms:</span>
          <span class="invoice-info-value">Due on Receipt</span>
        </div>
        <div class="invoice-info-row">
          <span class="invoice-info-label">Due Date:</span>
          <span class="invoice-info-value">${formattedInvoiceDate}</span>
        </div>
        <div class="invoice-info-row">
          <span class="invoice-info-label">Place Of Supply:</span>
          <span class="invoice-info-value">Meghalaya (17)</span>
        </div>
      </div>
    </div>
    
    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 30px;">#</th>
          <th style="width: 150px;">Item</th>
          <th>Description</th>
          <th style="width: 60px;">HSN/SAC</th>
          <th style="width: 50px;">Qty</th>
          <th style="width: 60px;">Rate</th>
          <th style="width: 60px;">CGST</th>
          <th style="width: 60px;">SGST</th>
          <th style="width: 80px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td class="left">${itemDescription}</td>
          <td class="left">${itemDescription}</td>
          <td>${COMPANY.hsnCode}</td>
          <td>${qtyDisplay}</td>
          <td class="right">${rateDisplay}</td>
          <td class="right">${cgstAmount.toFixed(2)}</td>
          <td class="right">${sgstAmount.toFixed(2)}</td>
          <td class="right">${amountBeforeTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>
    
    <!-- Totals Section -->
    <div class="totals-section">
      <div class="thanks-message">Thanks for choosing XTSY!</div>
      <div class="totals">
        <div class="totals-row">
          <span>Sub Total:</span>
          <span>${amountBeforeTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="totals-row total">
          <span>Total:</span>
          <span>Rs.${data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="totals-row payment">
          <span>Payment Made:</span>
          <span>(-) 0.00</span>
        </div>
        <div class="totals-row balance">
          <span>Balance Due:</span>
          <span>Rs.${data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
    
    <!-- Total in Words -->
    <div class="total-words">
      <strong>Total In Words:</strong> ${totalInWords}
    </div>
    
    <!-- Payment Info -->
    <div class="payment-info">
      Kindly make payments via <strong>UPI</strong> to <strong>${COMPANY.upi}</strong>
    </div>
    
    <!-- Terms & Conditions -->
    <div class="terms">
      <div class="terms-title">Terms & Conditions</div>
      <ul class="terms-list">
        <li>10% Booking amount is not refundable</li>
        <li>Balance payment should be made before check-in.</li>
        <li>We are not responsible for lost/stolen items.</li>
      </ul>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="eco">🌿 Save Paper. Support Sustainable Tourism.</div>
      <div class="system">This is system generated e-invoice.</div>
      <div class="brand">XTSY</div>
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
        p_message_to_host: null,
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

        // Send system welcome message in chat
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
