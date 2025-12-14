import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * Privacy Policy page for XTSY
 * India-focused privacy policy with data protection information
 */
export const PrivacyPolicy: React.FC = () => {
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              XTSY ("we", "our", or "us") is committed to protecting your privacy and personal data. 
              This Privacy Policy explains how we collect, use, process, and protect your information 
              when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
            <h3 className="text-xl font-medium mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and phone number when making bookings</li>
              <li>Address and emergency contact information for accommodation purposes</li>
              <li>Payment information (processed securely by third-party providers)</li>
              <li>Travel preferences and special requirements</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 mt-4">2.2 Analytics Data (Anonymous)</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anonymous visitor analytics to improve our services</li>
              <li>Page views and navigation patterns (no personal identification)</li>
              <li>Device type and browser information for optimization</li>
              <li>Geographic region for localized content delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
            <p>We process your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processing and fulfilling your accommodation bookings</li>
              <li>Providing customer service and support</li>
              <li>Ensuring safety and security during your stay</li>
              <li>Improving our website and services based on anonymous analytics</li>
              <li>Compliance with legal obligations (tax records, safety regulations)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Third Parties</h2>
            <p>We may share your data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment processors (Razorpay) for secure payment processing</li>
              <li>WhatsApp for communication (user-initiated only)</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p className="mt-4">
              <strong>We never sell your personal data to third parties.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we process your data</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at <a href="mailto:hello@xtsy.in" className="text-primary hover:underline">admin@xtsy.one</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p>We retain your personal data for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Booking data: 7 years (for tax and legal compliance)</li>
              <li>Communication records: 3 years</li>
              <li>Payment data: As required by payment processor and local law</li>
              <li>Anonymous analytics: Aggregated and retained indefinitely</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Access controls and authentication</li>
              <li>Regular security assessments</li>
              <li>Staff training on data protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p>For any privacy-related questions or to exercise your rights:</p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> hello@xtsy.in</p>
              <p><strong>Phone:</strong> +91 88373 17070</p>
              <p><strong>Address:</strong> Shillong, Meghalaya, India</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by email or through our website. This policy was last updated 
              on {new Date().toLocaleDateString()}.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default PrivacyPolicy;