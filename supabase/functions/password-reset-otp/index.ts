/**
 * Password Reset OTP Edge Function
 * Generates and sends OTP for password reset (2-min expiry)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface RequestBody {
  action: 'request' | 'verify' | 'reset';
  email?: string;
  otp?: string;
  newPassword?: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const body: RequestBody = await req.json();
    const { action, email, otp, newPassword } = body;

    if (action === 'request') {
      // Request OTP
      if (!email) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate OTP using database function
      const { data: otpResult, error: otpError } = await supabase.rpc(
        'generate_password_reset_otp',
        { p_email: email.toLowerCase().trim() }
      );

      if (otpError) {
        console.error('OTP generation error:', otpError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to generate OTP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If OTP was generated, send email
      if (otpResult?.otp) {
        // In production, integrate with email service (Resend, SendGrid, etc.)
        // For now, we'll use Supabase's built-in email or log it
        console.log(`OTP for ${email}: ${otpResult.otp} (expires: ${otpResult.expires_at})`);
        
        // Try to send via Supabase's inbuilt (if configured)
        // or use external email service
        const emailBody = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #f97316; font-size: 28px; margin: 0;">XTSY</h1>
              <p style="color: #6b7280; margin-top: 8px;">Password Reset</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 16px; padding: 32px; text-align: center;">
              <p style="color: #ffffff; font-size: 16px; margin: 0 0 24px 0;">
                Your verification code is:
              </p>
              <div style="background: #f97316; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <span style="font-family: monospace; font-size: 32px; font-weight: bold; color: white; letter-spacing: 8px;">
                  ${otpResult.otp}
                </span>
              </div>
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                This code expires in <strong style="color: #f97316;">2 minutes</strong>
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 32px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        `;

        // Use Supabase's admin API to send email if possible
        // This requires proper email configuration in Supabase dashboard
        try {
          await fetch(`${supabaseUrl}/auth/v1/admin/send-email`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({
              email: email.toLowerCase().trim(),
              type: 'recovery',
              data: { otp: otpResult.otp }
            })
          });
        } catch (emailErr) {
          console.log('Email send via Supabase failed, OTP still valid:', emailErr);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'If the email exists, an OTP has been sent',
          expiresIn: 120 // 2 minutes in seconds
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'verify') {
      // Verify OTP
      if (!email || !otp) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email and OTP are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: verifyResult, error: verifyError } = await supabase.rpc(
        'verify_password_reset_otp',
        { p_email: email.toLowerCase().trim(), p_otp: otp }
      );

      if (verifyError) {
        console.error('OTP verification error:', verifyError);
        return new Response(
          JSON.stringify({ success: false, error: 'Verification failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!verifyResult?.success) {
        return new Response(
          JSON.stringify({ success: false, error: verifyResult?.error || 'Invalid or expired OTP' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: true,
          userId: verifyResult.user_id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'reset') {
      // Reset password after OTP verification
      if (!email || !otp || !newPassword) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email, OTP, and new password are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (newPassword.length < 6) {
        return new Response(
          JSON.stringify({ success: false, error: 'Password must be at least 6 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify OTP first
      const { data: verifyResult, error: verifyError } = await supabase.rpc(
        'verify_password_reset_otp',
        { p_email: email.toLowerCase().trim(), p_otp: otp }
      );

      if (verifyError || !verifyResult?.success) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid or expired OTP' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update user password using admin API
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        verifyResult.user_id,
        { password: newPassword }
      );

      if (updateError) {
        console.error('Password update error:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update password' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Password updated successfully'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Password reset OTP error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
