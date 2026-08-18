import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import AboutXTSYSection from "@/components/AboutXTSYSection";
import ExploreNortheastSection from "@/components/ExploreNortheastSection";
import Footer from "@/components/Footer";

import SEOHead, { getSEOConfig } from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'XTSY Travellers Hostel',
  url: 'https://xtsy.one',
  logo: 'https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png',
  description: 'India\'s biggest hostel in Northeast India. Accommodation, tours, dining, and experiences in Shillong, Meghalaya.',
  telephone: '+918837317070',
  email: 'xtsytravellershostel@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mawkhar, Shillong',
    addressLocality: 'Shillong',
    addressRegion: 'Meghalaya',
    postalCode: '793001',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.instagram.com/xtsytravellershostel',
    'https://www.facebook.com/xtsytravellershostel',
  ],
};

const hostelSchema = {
  '@context': 'https://schema.org',
  '@type': 'Hostel',
  name: 'XTSY Travellers Hostel',
  url: 'https://xtsy.one/about',
  image: 'https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png',
  description: 'India\'s biggest hostel in Shillong, Meghalaya — budget dorms, private rooms, and India\'s first 270° glass suite. NEITA 2025 nominated.',
  telephone: '+918837317070',
  email: 'admin@xtsy.one',
  priceRange: '₹325 - ₹9,999',
  currenciesAccepted: 'INR',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mawdiangdiang Road, New Shillong Township',
    addressLocality: 'Shillong',
    addressRegion: 'Meghalaya',
    postalCode: '793018',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.5788,
    longitude: 91.8933,
  },
  checkinTime: '13:00',
  checkoutTime: '11:00',
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
    { '@type': 'LocationFeatureSpecification', name: '24/7 Reception', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Airport Transfer', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Female-only Dorms', value: true },
  ],
};

const About = () => {
  const seo = getSEOConfig('about');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead structuredDataOnly
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonicalUrl="https://xtsy.one/about"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(hostelSchema)}</script>
      </Helmet>
      
      <Header />
      <main>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs items={[{ label: "About" }]} />
        </div>
        <AboutSection />
        <AboutXTSYSection />

        {/* Location & How to Reach — Local SEO */}
        <section className="py-12 px-4 bg-card/50 border-t border-border/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              Location & How to Reach
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">XTSY Travellers Hostel</p>
                    <p className="text-muted-foreground text-sm">
                      Mawdiangdiang Road, New Shillong Township - 793018, Meghalaya, India
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="tel:+918837317070" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    +91 8837317070 (Booking Desk)
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="mailto:admin@xtsy.one" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    admin@xtsy.one
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p>Check-in: 1:00 PM | Check-out: 11:00 AM</p>
                    <p>Reception: 24/7</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-primary" />
                  How to Reach
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><span className="font-medium text-foreground">✈️ By Air:</span> Fly to Guwahati Airport (GAU). Shillong is 100 km / 2.5 hours by road. We arrange airport transfers.</li>
                  <li><span className="font-medium text-foreground">🚂 By Train:</span> Guwahati Railway Station → shared taxis to Shillong every 30 minutes from ISBT.</li>
                  <li><span className="font-medium text-foreground">🚗 By Road:</span> NH6 from Guwahati. Scenic drive through Ri-Bhoi district pine forests.</li>
                </ul>
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Nearby Landmarks:</span> Police Bazaar (1.5 km), Shillong Cathedral (2 km), Ward's Lake (1.8 km), Don Bosco Museum (3 km)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ExploreNortheastSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
