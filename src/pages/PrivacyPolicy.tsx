import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';

/**
 * Privacy Policy page for XTSY
 * Google OAuth compliant privacy policy with comprehensive data protection information
 */
export const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "January 5, 2025";
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Privacy Policy - XTSY</title>
        <meta name="description" content="XTSY Privacy Policy - Learn how we collect, use, and protect your personal information." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>
          
          <div className="prose prose-lg max-w-none space-y-8 text-foreground/90">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
              <p>
                Welcome to XTSY ("Company", "we", "our", or "us"). We are committed to protecting your 
                personal information and your right to privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our website 
                <strong> xtsy.one</strong> and use our accommodation and travel services.
              </p>
              <p className="mt-4">
                By accessing or using our services, you agree to this Privacy Policy. If you do not agree 
                with the terms of this policy, please do not access the site or use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">2.1 Personal Information You Provide</h3>
              <p>We collect personal information that you voluntarily provide when you:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Create an Account:</strong> Name, email address, phone number, password</li>
                <li><strong>Make a Booking:</strong> Full name, contact details, address, emergency contact information</li>
                <li><strong>Process Payments:</strong> Payment card details (processed by secure third-party providers)</li>
                <li><strong>Contact Us:</strong> Any information you provide in communications</li>
                <li><strong>Subscribe to Newsletter:</strong> Email address and communication preferences</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">2.2 Google Sign-In Data Access</h3>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-5 my-4">
                <p className="font-semibold text-foreground mb-3">🔐 Why We Use Google Sign-In</p>
                <p className="text-foreground/80 mb-3">
                  We use Google authentication solely to verify your identity and provide a seamless booking experience. 
                  This eliminates the need to remember another password while ensuring secure access to your account.
                </p>
                <p className="font-medium text-foreground mb-2">What we access:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80">
                  <li><strong>Your name</strong> – to personalize your experience</li>
                  <li><strong>Your email address</strong> – to create your account and send booking confirmations</li>
                  <li><strong>Profile picture</strong> (optional) – to display in your account</li>
                </ul>
                <p className="font-medium text-foreground mt-4 mb-2">What we NEVER access:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80">
                  <li>Your contacts or address book</li>
                  <li>Your files, documents, or Google Drive</li>
                  <li>Your calendar or Gmail</li>
                  <li>Your location history or browsing data</li>
                  <li>Any other Google account data</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">2.3 Phone Authentication</h3>
              <p>When you sign in using Phone OTP, we receive:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Phone Authentication:</strong> Your phone number for verification purposes only</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">2.3 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, navigation patterns (anonymized)</li>
                <li><strong>Location Data:</strong> General geographic region based on IP address</li>
                <li><strong>Cookies:</strong> Session cookies and analytics cookies (see Section 7)</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Your Information</h2>
              <p>We use your personal information for the following purposes:</p>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">3.1 Service Delivery</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and manage your accommodation bookings</li>
                <li>Facilitate check-in/check-out procedures</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send booking confirmations and important updates</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">3.2 Account Management</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and manage your user account</li>
                <li>Authenticate your identity when you sign in</li>
                <li>Maintain your booking history and preferences</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">3.3 Communications</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send transactional emails (booking confirmations, receipts)</li>
                <li>Marketing communications (with your consent)</li>
                <li>Important service announcements and policy updates</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">3.4 Business Operations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Improve our website and services through analytics</li>
                <li>Detect and prevent fraud, abuse, and security incidents</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Legal Basis for Processing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Legal Basis for Processing</h2>
              <p>We process your personal data based on:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Contractual Necessity:</strong> To fulfill bookings and provide services you request</li>
                <li><strong>Consent:</strong> For marketing communications and optional features</li>
                <li><strong>Legitimate Interests:</strong> For fraud prevention, security, and service improvements</li>
                <li><strong>Legal Obligations:</strong> Tax records, regulatory compliance, law enforcement requests</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. How We Share Your Information</h2>
              <p>We may share your information with:</p>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">5.1 Service Providers</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Payment Processors:</strong> Razorpay for secure payment handling</li>
                <li><strong>Authentication Services:</strong> Firebase/Google for account authentication</li>
                <li><strong>Analytics Providers:</strong> To understand website usage (anonymized data)</li>
                <li><strong>Communication Platforms:</strong> WhatsApp for customer support (user-initiated)</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-4 text-foreground">5.2 Legal Requirements</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Government authorities when required by law</li>
                <li>Law enforcement in response to valid legal requests</li>
                <li>Courts or regulators as part of legal proceedings</li>
              </ul>
              
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                <p className="font-semibold text-foreground">
                  ⚠️ We NEVER sell your personal data to third parties for advertising or marketing purposes.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Data Retention</h2>
              <p>We retain your personal data for the following periods:</p>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-foreground font-medium">Data Type</th>
                      <th className="px-4 py-3 text-left text-foreground font-medium">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3">Account Information</td>
                      <td className="px-4 py-3">Until account deletion + 30 days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Booking Records</td>
                      <td className="px-4 py-3">7 years (legal/tax compliance)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Payment Records</td>
                      <td className="px-4 py-3">7 years (financial regulations)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Communication Records</td>
                      <td className="px-4 py-3">3 years</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Analytics Data</td>
                      <td className="px-4 py-3">Anonymized and aggregated indefinitely</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Cookies and Tracking Technologies</h2>
              <p>We use the following types of cookies:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Essential Cookies:</strong> Required for website functionality and authentication</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (anonymized)</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. Disabling essential cookies may 
                affect website functionality.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Your Rights</h2>
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Right to Access:</strong> Request a copy of your personal data we hold
                </li>
                <li>
                  <strong>Right to Rectification:</strong> Correct inaccurate or incomplete information
                </li>
                <li>
                  <strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)
                </li>
                <li>
                  <strong>Right to Restrict Processing:</strong> Limit how we use your data in certain circumstances
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format
                </li>
                <li>
                  <strong>Right to Object:</strong> Object to processing based on legitimate interests or for marketing
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent
                </li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at <a href="mailto:admin@xtsy.one" className="text-primary hover:underline font-medium">admin@xtsy.one</a>.
                We will respond within 30 days.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Data Security</h2>
              <p>We implement industry-standard security measures including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>SSL/TLS encryption for all data transmission</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication for staff</li>
                <li>Secure data centers with physical security</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p className="mt-4">
                While we take extensive measures to protect your data, no method of transmission over 
                the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. International Data Transfers</h2>
              <p>
                Your data may be transferred to and processed in countries outside India, including 
                the United States (where our service providers like Google and Firebase operate). 
                When we transfer data internationally, we ensure appropriate safeguards are in place.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not knowingly 
                collect personal information from children. If we become aware that we have collected 
                data from a child without parental consent, we will take steps to delete that information.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the 
                privacy practices of these external sites. We encourage you to read their privacy policies.
              </p>
            </section>

            {/* Policy Updates */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">13. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material 
                changes by email or through a prominent notice on our website. Your continued use of 
                our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">14. Contact Us</h2>
              <p>For privacy-related questions, concerns, or to exercise your rights, contact us:</p>
              <div className="bg-muted p-6 rounded-lg mt-4 space-y-3">
                <p><strong>Data Protection Contact:</strong> XTSY Privacy Team</p>
                <p><strong>Email:</strong> <a href="mailto:admin@xtsy.one" className="text-primary hover:underline">admin@xtsy.one</a></p>
                <p><strong>Phone:</strong> +91 88373 17070</p>
                <p><strong>Address:</strong> XTSY, Shillong, Meghalaya, India 793001</p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">15. Governing Law</h2>
              <p>
                This Privacy Policy is governed by the laws of India, including the Information Technology 
                Act, 2000 and its amendments. Any disputes shall be subject to the exclusive jurisdiction 
                of the courts in Shillong, Meghalaya.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
