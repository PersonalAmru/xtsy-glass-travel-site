/**
 * Password Reset OTP Edge Function
 * Sends OTP via Google SMTP (Gmail App Password)
 * OTP expires in 2 minutes
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const smtpUser = Deno.env.get('GOOGLE_SMTP_USER')!;
const smtpPassword = Deno.env.get('GOOGLE_SMTP_APP_PASSWORD')!;

interface RequestBody {
  action: 'request' | 'verify' | 'reset';
  email?: string;
  otp?: string;
  newPassword?: string;
}

async function sendOTPEmail(toEmail: string, otp: string): Promise<boolean> {
  try {
    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 465,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPassword,
        },
      },
    });

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #f97316; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">XTSY</h1>
            <p style="color: #a1a1aa; font-size: 14px; margin-top: 8px;">Password Reset Request</p>
          </div>
          
          <!-- Main Card -->
          <div style="background: linear-gradient(145deg, #18181b 0%, #1f1f23 100%); border-radius: 20px; padding: 40px 32px; border: 1px solid rgba(249, 115, 22, 0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            <p style="color: #e4e4e7; font-size: 16px; margin: 0 0 28px 0; text-align: center; line-height: 1.6;">
              Enter this verification code to reset your password:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 16px; padding: 24px; margin-bottom: 28px; text-align: center; box-shadow: 0 10px 40px -10px rgba(249, 115, 22, 0.4);">
              <span style="font-family: 'SF Mono', Monaco, 'Courier New', monospace; font-size: 36px; font-weight: 700; color: white; letter-spacing: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                ${otp}
              </span>
            </div>
            
            <!-- Timer Warning -->
            <div style="background: rgba(249, 115, 22, 0.1); border-radius: 12px; padding: 16px; text-align: center; border: 1px solid rgba(249, 115, 22, 0.2);">
              <p style="color: #f97316; font-size: 14px; font-weight: 600; margin: 0;">
                ⏱️ This code expires in 2 minutes
              </p>
            </div>
          </div>
          
          <!-- Security Note -->
          <div style="margin-top: 32px; text-align: center;">
            <p style="color: #71717a; font-size: 12px; line-height: 1.6; margin: 0;">
              If you didn't request this password reset, you can safely ignore this email.<br>
              Your account remains secure.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 40px; text-align: center; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05);">
            <p style="color: #52525b; font-size: 11px; margin: 0;">
              © ${new Date().getFullYear()} XTSY. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await client.send({
      from: smtpUser,
      to: toEmail,
      subject: `${otp} is your XTSY verification code`,
      content: `Your XTSY password reset code is: ${otp}. This code expires in 2 minutes.`,
      html: htmlBody,
    });

    await client.close();
    console.log(`OTP email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
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

      const normalizedEmail = email.toLowerCase().trim();

      // Generate OTP using database function
      const { data: otpResult, error: otpError } = await supabase.rpc(
        'generate_password_reset_otp',
        { p_email: normalizedEmail }
      );

      if (otpError) {
        console.error('OTP generation error:', otpError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to generate OTP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If OTP was generated, send email via Gmail SMTP
      if (otpResult?.otp) {
        console.log(`Generated OTP for ${normalizedEmail}, expires: ${otpResult.expires_at}`);
        
        const emailSent = await sendOTPEmail(normalizedEmail, otpResult.otp);
        
        if (!emailSent) {
          console.error('Failed to send OTP email, but OTP is still valid in database');
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
