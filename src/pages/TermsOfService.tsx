import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

/**
 * Terms of Service page for XTSY
 * Comprehensive terms covering accommodation bookings and user agreements
 */
export const TermsOfService: React.FC = () => {
  const lastUpdated = "September 29, 2026";
  const effectiveDate = "September 29, 2026";
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground mb-2">Last Updated: {lastUpdated}</p>
          <p className="text-muted-foreground mb-8">Effective Date: {effectiveDate}</p>
          
          <div className="prose prose-lg max-w-none space-y-8 text-foreground/90">
            
            {/* Agreement */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Agreement to Terms</h2>
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you 
                ("User", "you", or "your") and XTSY Ventures Private Limited ("XTSY", "Company", "we", "our", or "us") governing your 
                access to and use of the xtsy.one website and all related services, including accommodation 
                bookings, travel packages, and any other services we offer.
              </p>
              <p className="mt-4">
                By accessing our website, creating an account, or making a booking, you acknowledge that 
                you have read, understood, and agree to be bound by these Terms. If you do not agree to 
                these Terms, you must not use our services.
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                <p className="font-semibold text-foreground">
                  ⚠️ PLEASE READ THESE TERMS CAREFULLY. THEY CONTAIN IMPORTANT INFORMATION ABOUT YOUR 
                  RIGHTS AND OBLIGATIONS, INCLUDING LIMITATIONS OF LIABILITY AND DISPUTE RESOLUTION.
                </p>
              </div>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Eligibility</h2>
              <p>To use our services, you must:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited from using our services under applicable law</li>
                <li>Provide accurate and complete information when creating an account or making bookings</li>
              </ul>
              <p className="mt-4">
                If you are booking on behalf of others, you represent that you have the authority to 
                bind them to these Terms and that all guests will comply with these Terms.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Account Registration</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">3.1 Account Creation</h3>
              <p>
                You may create an account using email/password, phone number (OTP), or third-party 
                authentication services (Google). By using third-party authentication, you authorize 
                us to access certain account information as described in our Privacy Policy.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">3.2 Account Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must notify us immediately of any unauthorized access to your account</li>
                <li>You are liable for all activities that occur under your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">3.3 Account Termination</h3>
              <p>
                You may delete your account at any time by contacting us. We may suspend or terminate 
                your account for violation of these Terms, fraudulent activity, or at our discretion 
                with reasonable notice.
              </p>
            </section>

            {/* Booking Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Booking Terms</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">4.1 Reservations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All bookings are subject to availability</li>
                <li>A booking is confirmed only after payment is successfully processed</li>
                <li>Room assignments are at our discretion unless a specific room is booked</li>
                <li>Standard check-in is 11:00 AM and check-out is strictly 10:00 AM.</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">4.2 Pricing & GST</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All prices are displayed in Indian Rupees (INR) unless otherwise stated</li>
                <li>Prices are subject to applicable GST as per current Indian tax laws</li>
                <li><strong>Accommodation up to ₹7,500/night:</strong> 5% GST (CGST 2.5% + SGST 2.5%)</li>
                <li><strong>Accommodation above ₹7,500/night:</strong> 18% GST (CGST 9% + SGST 9%)</li>
                <li><strong>Tourism, Travel & Restaurant Services:</strong> 18% GST (CGST 9% + SGST 9%)</li>
                <li>We reserve the right to modify pricing at any time; confirmed bookings are not affected</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">4.3 Payment</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment is processed through secure third-party payment providers</li>
                <li>We accept major credit/debit cards, UPI, and net banking</li>
                <li>Advance payment is required at the time of booking</li>
                <li>All advance payments are strictly non-refundable</li>
                <li>You authorize us to charge your payment method for the booking amount</li>
              </ul>
            </section>

            {/* Cancellation Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Cancellation and Refund Policy</h2>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <p className="font-semibold text-red-600 dark:text-red-400">
                  ⚠️ STRICT NO-REFUND POLICY: All advance payments are non-refundable. 
                  Cancellations are not accepted once payment is made.
                </p>
              </div>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">5.1 Guest Cancellations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cancellations are <strong>not accepted</strong> once an advance payment is made</li>
                <li>No refunds will be issued under any circumstances for guest-initiated cancellations</li>
                <li>No-shows are treated as cancellations with no refund</li>
                <li>This applies to all room types, packages, and promotional bookings</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">5.2 Booking Modifications</h3>
              <p>Instead of cancellation, you may request a modification:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Date modification allowed within 90 days from original check-in</li>
                <li>Only one modification permitted per booking</li>
                <li>Request must be made at least 48 hours before original check-in</li>
                <li>Subject to availability and any rate difference</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">5.3 Property-Initiated Cancellations</h3>
              <p>
                In rare cases where XTSY must cancel a confirmed booking (maintenance, safety, 
                overbooking errors), we will offer:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Free date modification, OR</li>
                <li>Alternate equivalent accommodation, OR</li>
                <li>Full refund (only if accommodation cannot be provided)</li>
              </ul>
              
              <p className="mt-4">
                For detailed pricing, GST information, and complete cancellation terms, please see our{' '}
                <a href="/pricing-cancellation-policy" className="text-primary hover:underline font-medium">
                  Pricing & Cancellation Policies
                </a> page.
              </p>
            </section>

            {/* Guest Conduct */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Guest Conduct and House Rules</h2>
              <p>By staying at our properties, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Treat staff and other guests with respect</li>
                <li>Not engage in illegal activities on the premises</li>
                <li>Not damage property or furnishings</li>
                <li>Keep noise levels reasonable, especially during quiet hours (10 PM - 7 AM)</li>
                <li>Not bring unauthorized guests or exceed room capacity</li>
                <li>Follow all posted house rules and staff instructions</li>
                <li>Not smoke in non-smoking areas</li>
                <li>Declare pets in advance (pet-friendly rooms only)</li>
              </ul>
              <p className="mt-4">
                <strong>Violation of these rules may result in immediate eviction without refund and 
                may incur additional charges for damages.</strong>
              </p>
            </section>

            {/* Liability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Limitation of Liability</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">7.1 Personal Property</h3>
              <p>
                We are not responsible for loss, theft, or damage to your personal belongings. 
                We recommend using in-room safes where available and obtaining travel insurance.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">7.2 Service Limitations</h3>
              <p>
                To the maximum extent permitted by law, we shall not be liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages exceeding the total amount paid for your booking</li>
                <li>Events beyond our reasonable control (force majeure)</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">7.3 Third-Party Services</h3>
              <p>
                We are not responsible for third-party services or products you may purchase or 
                access through our website or during your stay.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Intellectual Property</h2>
              <p>
                All content on our website, including text, images, logos, and software, is owned by 
                or licensed to XTSY Ventures Private Limited and protected by intellectual property laws. XTSY is a trademark of XTSY Ventures Private Limited. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Copy, modify, or distribute our content without written permission</li>
                <li>Use our trademarks or branding without authorization</li>
                <li>Scrape, crawl, or extract data from our website for commercial purposes</li>
                <li>Reverse engineer or decompile any software used on our platform</li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Use our services for any illegal purpose</li>
                <li>Impersonate another person or entity</li>
                <li>Provide false or misleading information</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services</li>
                <li>Use automated systems to access our website without permission</li>
                <li>Engage in fraudulent bookings or payment activities</li>
                <li>Harass, threaten, or abuse staff or other guests</li>
              </ul>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless XTSY, its officers, directors, employees, 
                and agents from any claims, damages, losses, or expenses (including legal fees) 
                arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your violation of these Terms</li>
                <li>Your use of our services</li>
                <li>Your violation of any third-party rights</li>
                <li>Your conduct during your stay at our properties</li>
              </ul>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Dispute Resolution</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">11.1 Informal Resolution</h3>
              <p>
                We encourage you to contact us first to resolve any disputes informally. Most concerns 
                can be resolved quickly through our customer support team.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">11.2 Arbitration</h3>
              <p>
                If informal resolution fails, disputes shall be resolved through binding arbitration 
                in accordance with the Arbitration and Conciliation Act, 1996. The arbitration shall 
                be conducted in Shillong, Meghalaya, in English.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">11.3 Governing Law</h3>
              <p>
                These Terms are governed by the laws of India. The courts of Shillong, Meghalaya 
                shall have exclusive jurisdiction for matters not subject to arbitration.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material 
                changes via email or through a prominent notice on our website. Continued use of our 
                services after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">13. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision 
                shall be limited or eliminated to the minimum extent necessary, and the remaining 
                provisions shall remain in full force and effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">14. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and any booking confirmations, constitute 
                the entire agreement between you and XTSY regarding your use of our services.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">15. Contact Us</h2>
              <p>For questions about these Terms, contact us:</p>
              <div className="bg-muted p-6 rounded-lg mt-4 space-y-3">
                <p><strong>Email:</strong> <a href="mailto:admin@xtsy.one" className="text-primary hover:underline">admin@xtsy.one</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
