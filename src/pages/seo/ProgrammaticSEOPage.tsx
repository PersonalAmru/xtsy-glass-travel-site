import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { findSEOPage, getRelatedPages, type SEOPageData, type SchemaType } from '@/data/seoPages';
import { Check, MapPin, Phone, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const categoryLabels: Record<string, string> = {
  hostels: 'Hostels', hotels: 'Hotels', homestays: 'Homestays', glamping: 'Glamping',
  accommodation: 'Accommodation', rentals: 'Rentals', tours: 'Tour Packages',
  'travel-guides': 'Travel Guides', destinations: 'Destinations', attractions: 'Attractions',
  itineraries: 'Itineraries', activities: 'Activities', hospitals: 'Near Hospitals',
  restaurants: 'Dining', weddings: 'Weddings & Events', transport: 'Transport',
  'competitor-capture': 'Hostel Comparison', 'food-dining': 'Food & Dining',
  seasonal: 'Seasonal Guides', events: 'Events', 'travel-agency': 'Travel Agency',
};

const buildSchema = (page: SEOPageData) => {
  const base: any = {
    '@context': 'https://schema.org',
    '@type': page.schemaType,
    name: page.h1,
    description: page.metaDescription,
    url: `https://xtsy.one/${page.slug}`,
  };

  if (['Hostel', 'Hotel', 'LodgingBusiness'].includes(page.schemaType)) {
    Object.assign(base, {
      address: { '@type': 'PostalAddress', streetAddress: 'Mawdiangdiang Road', addressLocality: 'Shillong', addressRegion: 'Meghalaya', postalCode: '793018', addressCountry: 'IN' },
      telephone: '+91-8787537633',
      priceRange: '₹499 - ₹4,999',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '320', bestRating: '5' },
    });
  }

  if (page.schemaType === 'TouristTrip') {
    Object.assign(base, { touristType: 'Adventure', provider: { '@type': 'TravelAgency', name: 'XTSY', url: 'https://xtsy.one' } });
  }

  if (page.schemaType === 'TouristAttraction') {
    Object.assign(base, { isAccessibleForFree: true, address: { '@type': 'PostalAddress', addressRegion: 'Meghalaya', addressCountry: 'IN' } });
  }

  return base;
};

const buildFAQSchema = (faqs: SEOPageData['faqs']) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question', name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

const FAQItem = ({ faq }: { faq: { question: string; answer: string } }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left">
        <span className="font-medium text-foreground text-sm">{faq.question}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</div>}
    </div>
  );
};

const ProgrammaticSEOPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? findSEOPage(slug) : undefined;

  if (!page) return <Navigate to="/404" replace />;

  const related = getRelatedPages(page.slug);
  const categoryLabel = categoryLabels[page.category] || page.category;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.metaDescription} />
        <meta name="keywords" content={page.keywords.join(', ')} />
        <link rel="canonical" href={`https://xtsy.one/${page.slug}`} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:url" content={`https://xtsy.one/${page.slug}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(buildSchema(page))}</script>
        {page.faqs.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(buildFAQSchema(page.faqs))}</script>
        )}
      </Helmet>

      <Header />

      <main className="pt-20">
        <div className="container mx-auto px-4 max-w-4xl py-10">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: categoryLabel, href: `/things-to-do-in-meghalaya` },
            { label: page.h1 },
          ]} />

          <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground leading-tight">{page.h1}</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{page.intro}</p>

          {/* CTA Banner */}
          <div className="mt-8 bg-primary/10 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-foreground">Ready to explore?</p>
              <p className="text-sm text-muted-foreground">Book your stay at XTSY Travellers Hostel — rated 4.8★ on Google</p>
            </div>
            <a
              href={page.ctaLink}
              target={page.ctaLink.startsWith('http') ? '_blank' : undefined}
              rel={page.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              {page.ctaText}
            </a>
          </div>

          {/* Content Sections */}
          <div className="mt-10 space-y-8">
            {page.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-bold text-foreground mb-3">{section.heading}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                {section.listItems && (
                  <ul className="mt-3 space-y-2">
                    {section.listItems.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* FAQ Section */}
          {page.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => (
                  <FAQItem key={i} faq={faq} />
                ))}
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Plan Your Meghalaya Trip with XTSY</h2>
            <p className="mt-2 text-muted-foreground">Stay at Shillong's #1 rated hostel. Dorms from ₹499, private rooms from ₹1,499.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a href={page.ctaLink} target={page.ctaLink.startsWith('http') ? '_blank' : undefined} rel={page.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                {page.ctaText}
              </a>
              <a href="https://wa.me/918787537633?text=Hi, I need help planning my Meghalaya trip" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors">
                Chat on WhatsApp
              </a>
            </div>
          </section>

          {/* Related Pages */}
          {related.length > 0 && (
            <nav className="mt-10 border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Related Pages</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {related.map(rp => (
                  <Link key={rp.slug} to={`/${rp.slug}`} className="text-sm text-primary hover:underline">
                    {rp.h1}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {/* Category Explore */}
          <nav className="mt-8 border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Explore More</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/best-hostel-in-shillong" className="text-sm text-primary hover:underline">Best Hostel in Shillong</Link>
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">Meghalaya Tour Packages</Link>
              <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">Things to Do in Meghalaya</Link>
              <Link to="/tours" className="text-sm text-primary hover:underline">Tour Packages</Link>
              <Link to="/gallery" className="text-sm text-primary hover:underline">Photo Gallery</Link>
              <Link to="/book" className="text-sm text-primary hover:underline">Book Your Stay</Link>
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProgrammaticSEOPage;
