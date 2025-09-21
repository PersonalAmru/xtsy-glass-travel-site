import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppRequest {
  bookingId: string;
  guestName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  rooms: string;
  totalAmount: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, guestName, phone, checkIn, checkOut, rooms, totalAmount }: WhatsAppRequest = await req.json();

    // Format the WhatsApp message
    const message = `🏨 *XTSY Booking Confirmation*

Dear ${guestName},

Thank you for booking with us! 

📋 *Booking Details:*
• Booking ID: ${bookingId}
• Check-in: ${new Date(checkIn).toLocaleDateString('en-IN')}
• Check-out: ${new Date(checkOut).toLocaleDateString('en-IN')}
• Room(s): ${rooms}
• Total Amount: ₹${totalAmount.toLocaleString('en-IN')}

✅ *Status:* We have received your booking request and will get back to you shortly with payment details and confirmation.

📞 For any queries, please contact us at:
• Phone: +91-XXXXXXXXXX
• Email: info@xtsy.one

Thank you for choosing XTSY! 🙏

---
*This is an automated message. Please do not reply to this number.*`;

    // Create WhatsApp URL with the message
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    console.log('WhatsApp URL generated:', whatsappUrl);
    console.log('Message sent to:', phone);

    // For now, we'll just log the message and return success
    // In a production environment, you would integrate with a WhatsApp API service
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'WhatsApp message prepared',
      whatsappUrl: whatsappUrl,
      phoneNumber: phone
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in send-whatsapp-booking function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);