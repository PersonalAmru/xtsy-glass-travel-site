
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'https://esm.sh/resend@2.0.0'
import { newsletterSchema, escapeHtml, sanitizeArray } from '../_shared/newsletterValidation.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createOptimizedClient } from '../_shared/supabaseClient.ts'
import { getCacheHeaders } from '../_shared/cacheHeaders.ts'
import { PerformanceMonitor } from '../_shared/performanceMonitor.ts'

serve(async (req) => {
  const monitor = new PerformanceMonitor('newsletter-signup');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createOptimizedClient({ useServiceRole: true });

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const rawData = await req.json();
    
    // CRITICAL SECURITY: Validate input data
    const validationResult = newsletterSchema.safeParse(rawData);
    if (!validationResult.success) {
      monitor.complete(400);
      return new Response(
        JSON.stringify({ error: 'Invalid input data', details: validationResult.error.issues }),
        { status: 400, headers: { ...corsHeaders, ...getCacheHeaders('newsletter-signup'), 'Content-Type': 'application/json' } }
      );
    }

    const { email, fullName, interests } = validationResult.data;

    // CRITICAL SECURITY: Check rate limits
    const { data: rateLimitAllowed, error: rateLimitError } = await supabase.rpc(
      'check_newsletter_rate_limit',
      {
        p_email: email,
        p_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''
      }
    );

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    }

    if (rateLimitAllowed === false) {
      monitor.complete(429);
      return new Response(
        JSON.stringify({ error: 'Too many signup attempts. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, ...getCacheHeaders('newsletter-signup'), 'Content-Type': 'application/json' } }
      );
    }

    // Save to database
    const { data: savedData, error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        full_name: fullName,
        interests,
        subscribed_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save subscription');
    }

    console.log(`Newsletter signup saved: ${escapeHtml(fullName)} (${email}) - Interests: ${interests.length}`);

    // SECURITY: Sanitize data for email templates to prevent XSS
    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeInterests = sanitizeArray(interests);

    // Send notification emails to admin team
    const adminEmails = ['pk@xtsy.one', 'amru@xtsy.one', 'admin@xtsy.one'];
    
    const adminEmailPromises = adminEmails.map(adminEmail => 
      resend.emails.send({
        from: 'XTSY Newsletter <noreply@xtsy.one>',
        to: [adminEmail],
        subject: 'New Newsletter Subscription - XTSY',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Newsletter Subscription</h2>
            <p>A new subscriber has joined the XTSY newsletter:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Email:</strong> ${safeEmail}</p>
              <p><strong>Interests:</strong> ${safeInterests.join(', ')}</p>
              <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              This notification was sent automatically from the XTSY website newsletter signup.
            </p>
          </div>
        `
      })
    );

    // Send welcome email to the subscriber
    const welcomeEmailPromise = resend.emails.send({
      from: 'XTSY Team <noreply@xtsy.one>',
      to: [email],
      subject: 'Welcome to XTSY Newsletter! 🏔️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px;">
            <h1 style="color: #d63384;">Welcome to XTSY, ${safeName}!</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Thank you for subscribing to our newsletter! We're excited to have you as part of the XTSY community.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Subscription Details:</h3>
              <p><strong>Interests:</strong> ${safeInterests.join(', ')}</p>
            </div>
            
            <p>You'll receive updates about:</p>
            <ul>
              <li>🏔️ Seasonal offers and special deals</li>
              <li>🌿 Meghalaya travel updates and tips</li>
              <li>🎒 Adventure tour packages</li>
              <li>👥 Group booking opportunities</li>
              <li>🛍️ XTSY merchandise updates</li>
              <li>🌏 XTSY Asia expansion news</li>
            </ul>
            
            <div style="background-color: #d63384; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0;"><strong>Ready to explore Shillong?</strong></p>
              <p style="margin: 5px 0 0 0;">Contact us at <strong>+91 88373 17070</strong> for bookings!</p>
            </div>
            
            <p>Follow us on social media for daily updates:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://www.instagram.com/xtsy.one" style="margin: 0 10px; color: #d63384; text-decoration: none;">📸 Instagram</a>
              <a href="https://www.youtube.com/@XTSY_Shillong" style="margin: 0 10px; color: #d63384; text-decoration: none;">📹 YouTube</a>
              <a href="https://www.linkedin.com/company/xtsy" style="margin: 0 10px; color: #d63384; text-decoration: none;">💼 LinkedIn</a>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p>© 2024 XTSY Travellers Hostel & XTSY Luxury | Live the Shillong Vibe</p>
            <p>Diengiong, New Shillong Township, Meghalaya - 793018</p>
          </div>
        </div>
      `
    });

    // Wait for all emails to be sent
    await Promise.all([...adminEmailPromises, welcomeEmailPromise]);

    console.log('All notification emails sent successfully');
    monitor.complete(200);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed to newsletter',
        subscriber_id: savedData.id 
      }),
      { headers: { ...corsHeaders, ...getCacheHeaders('newsletter-signup'), 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Newsletter signup error:', error);
    monitor.complete(500, { error: error.message });
    
    return new Response(
      JSON.stringify({ 
        error: 'Unable to process newsletter signup. Please try again later or contact support.',
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, ...getCacheHeaders('newsletter-signup'), 'Content-Type': 'application/json' } }
    );
  }
});
