import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, MessageCircle, Clock, Building2, Globe, ShieldCheck } from 'lucide-react';

/**
 * Contact Us page — required for payment gateway (Cashfree/RBI) onboarding
 * and as the primary support entry point for users.
 *
 * Global brand contact (per project memory):
 *   Phone: +91 8837317070
 *   GSTIN: 17QSKPK1714H1ZE
 */
const Contact: React.FC = () => {
  const phone = '+91 8837317070';
  const phoneTel = '+918837317070';
  const email = 'booking@xtsy.one';
  const supportEmail = 'admin@xtsy.one';
  const whatsappUrl = `https://wa.me/${phoneTel.replace('+', '')}?text=${encodeURIComponent("Hi XTSY! I'd like to get in touch.")}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Contact Us — XTSY | Support, Bookings & Enquiries</title>
        <meta
          name="description"
          content="Contact XTSY for bookings, support, partnerships and tour enquiries. Call +91 8837317070, WhatsApp us, or email booking@xtsy.one. Based in Shillong, Meghalaya."
        />
        <link rel="canonical" href="https://xtsy.one/contact" />
        <meta property="og:title" content="Contact XTSY — Bookings & Support" />
        <meta property="og:description" content="Reach the XTSY team for bookings, tours, partnerships and support." />
        <meta property="og:url" content="https://xtsy.one/contact" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact XTSY',
            url: 'https://xtsy.one/contact',
            mainEntity: {
              '@type': 'Organization',
              name: 'XTSY',
              url: 'https://xtsy.one',
              telephone: phone,
              email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Mawdiangdiang Road, New Shillong Township',
                addressLocality: 'Shillong',
                addressRegion: 'Meghalaya',
                postalCode: '793018',
                addressCountry: 'IN',
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: phone,
                  contactType: 'customer service',
                  areaServed: 'IN',
                  availableLanguage: ['English', 'Hindi'],
                },
                {
                  '@type': 'ContactPoint',
                  telephone: phone,
                  contactType: 'reservations',
                  areaServed: 'IN',
                  availableLanguage: ['English', 'Hindi'],
                },
              ],
            },
          })}
        </script>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">Contact XTSY</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We're here to help with bookings, tour planning, partnerships, billing and anything else. Reach us through your preferred channel — we typically respond within a few hours.
          </p>
        </header>

        {/* Primary contact methods */}
        <section aria-labelledby="reach-us" className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <h2 id="reach-us" className="sr-only">Ways to reach us</h2>

          <a
            href={`tel:${phoneTel}`}
            className="bg-card border border-border rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col"
          >
            <Phone className="h-7 w-7 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Call us</h3>
            <p className="text-slate-600 text-sm mb-2">For instant help with bookings.</p>
            <p className="text-slate-900 font-medium">{phone}</p>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col"
          >
            <MessageCircle className="h-7 w-7 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">WhatsApp</h3>
            <p className="text-slate-600 text-sm mb-2">Chat with the team in real time.</p>
            <p className="text-slate-900 font-medium">{phone}</p>
          </a>

          <a
            href={`mailto:${email}`}
            className="bg-card border border-border rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col"
          >
            <Mail className="h-7 w-7 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
            <p className="text-slate-600 text-sm mb-2">For detailed enquiries & invoices.</p>
            <p className="text-slate-900 font-medium break-all">{email}</p>
          </a>
        </section>

        {/* Business details */}
        <section aria-labelledby="business" className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-xs mb-10">
          <h2 id="business" className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" /> Business details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-slate-900">Registered address</p>
                <p className="text-slate-600 text-sm">
                  XTSY Travellers Hostel<br />
                  Laitumkhrah, Shillong<br />
                  Meghalaya 793018, India
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-slate-900">GSTIN</p>
                <p className="text-slate-600 text-sm">17QSKPK1714H1ZE</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-slate-900">Support hours</p>
                <p className="text-slate-600 text-sm">Monday – Sunday, 8:00 AM – 10:00 PM IST</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Globe className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-slate-900">Website</p>
                <p className="text-slate-600 text-sm">https://xtsy.one</p>
              </div>
            </div>
          </div>
        </section>

        {/* Department-specific emails */}
        <section aria-labelledby="depts" className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-xs mb-10">
          <h2 id="depts" className="text-2xl font-semibold text-slate-900 mb-6">Specific teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900 mb-1">Bookings & reservations</p>
              <a href={`mailto:${email}`} className="text-primary text-sm hover:underline">{email}</a>
            </div>
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900 mb-1">Customer support</p>
              <a href={`mailto:${supportEmail}`} className="text-primary text-sm hover:underline">{supportEmail}</a>
            </div>
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900 mb-1">Billing & invoices</p>
              <a href={`mailto:${supportEmail}`} className="text-primary text-sm hover:underline">{supportEmail}</a>
            </div>
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900 mb-1">Partnerships & press</p>
              <a href={`mailto:${email}`} className="text-primary text-sm hover:underline">{email}</a>
            </div>
          </div>
        </section>

        {/* Policy quick links */}
        <section className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Looking for our policies?</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/terms-of-service" className="text-primary hover:underline text-sm font-medium">Terms of Service</a>
            <span className="text-slate-400">•</span>
            <a href="/privacy-policy" className="text-primary hover:underline text-sm font-medium">Privacy Policy</a>
            <span className="text-slate-400">•</span>
            <a href="/pricing-cancellation-policy" className="text-primary hover:underline text-sm font-medium">Pricing & Cancellation</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
