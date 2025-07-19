
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, fullName, role } = await req.json();

    if (type === 'new_staff_signup') {
      // In a real implementation, you would send an email to admin@xtsy.one
      // For now, we'll just log it
      console.log(`New staff signup: ${fullName} (${email}) - Role: ${role}`);
      
      // You can integrate with email service like Resend here
      // await sendEmailToAdmin({
      //   to: 'admin@xtsy.one',
      //   subject: 'New Staff Account Created',
      //   html: `New staff member ${fullName} has created an account with role ${role}. Email: ${email}`
      // });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin notification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
