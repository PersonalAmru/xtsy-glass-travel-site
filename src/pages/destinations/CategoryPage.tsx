import { Link, useLocation } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationCard from '@/components/destinations/DestinationCard';
import {
  destinationCategories,
  getDestinationsByCategory,
  getDestinationImages,
} from '@/data/meghalayaDestinations';

const CategoryPage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/|\/$/g, '');
  const category = destinationCategories.find(c => c.slug === slug);

  if (!category) {
    return <NotFound />;
  }

  const destinations = getDestinationsByCategory(category.category);
  const singular = category.category; // e.g. "waterfall"
  const lcName = category.name.toLowerCase(); // e.g. "waterfalls"
  const names = destinations.map(d => d.name);
  const ogImage = destinations[0] ? getDestinationImages(destinations[0].slug, 1)[0]?.src : undefined;

  const pageTitle = `Best ${category.name} in Meghalaya — Travel Guide 2026`;
  const canonical = `https://xtsy.one/${category.slug}`;

  // Visible FAQs backed by FAQPage schema (answers must be on-page for the rich result).
  const faqs: { q: string; a: string }[] = [
    {
      q: `How many ${lcName} are there to visit in Meghalaya?`,
      a: `This guide covers ${destinations.length} of the most popular ${lcName} in Meghalaya${names.length ? `, including ${names.slice(0, 4).join(', ')}` : ''}. There are many more across the Khasi, Jaintia and Garo Hills, but these are the most rewarding and accessible for first-time visitors.`,
    },
    {
      q: `What is the best time to visit ${lcName} in Meghalaya?`,
      a: `For full water flow and dramatic, mist-filled landscapes, visit during and just after the monsoon (June to September). For clear skies, comfortable trekking and the best views, plan your trip between October and March.`,
    },
    {
      q: `Where should I stay to explore Meghalaya's ${lcName}?`,
      a: `Shillong is the ideal base — most ${lcName} are within a day trip. XTSY Travellers Hostel offers dorms from ₹329/night, a luxury 270° glass suite, and curated Meghalaya tours that cover the region's top ${lcName} and viewpoints.`,
    },
    {
      q: `Can I cover Meghalaya's top ${lcName} on a tour package?`,
      a: `Yes. XTSY's curated Meghalaya tour packages bundle transport, a local guide and the best ${lcName}, waterfalls, living root bridges and viewpoints into a single trip — booking direct saves up to 30% versus marketplace prices.`,
    },
    ...(category.extraFaqs ?? []),
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Things to Do in Meghalaya', item: 'https://xtsy.one/things-to-do-in-meghalaya' },
      { '@type': 'ListItem', position: 3, name: `Meghalaya ${category.name}`, item: canonical },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${category.name} in Meghalaya`,
    description: category.description,
    itemListElement: destinations.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.name,
      url: `https://xtsy.one/places-to-visit/${d.slug}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={category.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={category.description} />
        <meta property="og:url" content={canonical} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 max-w-5xl py-12">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Things to Do', href: '/things-to-do-in-meghalaya' },
            { label: `Meghalaya ${category.name}` },
          ]} />
          <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">Best {category.name} in Meghalaya</h1>
          <p className="mt-4 text-muted-foreground max-w-3xl leading-relaxed">{category.description}</p>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
            Meghalaya — the wettest place on Earth — is home to some of India's most spectacular {lcName}. Below are {destinations.length} of the
            best {lcName} to add to your itinerary, each with a complete travel guide covering how to reach, the best time to visit, entry details and
            insider tips. Most are an easy day trip from Shillong, where {' '}
            <Link to="/best-hostel-in-shillong" className="text-primary hover:underline">XTSY Travellers Hostel</Link> makes a comfortable, affordable base.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(dest => (
              <DestinationCard key={dest.slug} destination={dest} />
            ))}
          </div>

          {/* Editorial deep-dive — depth content for high-volume category terms */}
          {category.seoContent && category.seoContent.length > 0 && (
            <section className="mt-14 space-y-8">
              {category.seoContent.map(({ heading, body }) => (
                <article key={heading}>
                  <h2 className="text-2xl font-bold text-foreground">{heading}</h2>
                  <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">{body}</p>
                </article>
              ))}
            </section>
          )}


          {/* FAQ — visible Q&A backed by FAQPage schema */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-foreground">Meghalaya {category.name} — Frequently Asked Questions</h2>
            <div className="mt-4 space-y-5">
              {faqs.map(({ q, a }, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 bg-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Explore Meghalaya with XTSY</h2>
            <p className="mt-2 text-muted-foreground">Book curated tour packages covering the best {lcName} in Meghalaya.</p>
            <Link to="/meghalaya-tour-packages" className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">View Tour Packages</Link>
          </section>

          {/* Internal Links */}
          <nav className="border-t border-border pt-8 mt-12">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Guides</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/meghalaya-waterfalls" className="text-sm text-primary hover:underline">Waterfalls in Meghalaya</Link>
              <Link to="/meghalaya-viewpoints" className="text-sm text-primary hover:underline">Viewpoints in Meghalaya</Link>
              <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">Things to Do in Meghalaya</Link>
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">Meghalaya Tour Packages</Link>
              <Link to="/best-time-to-visit-meghalaya" className="text-sm text-primary hover:underline">Best Time to Visit</Link>
              <Link to="/meghalaya-travel-guide" className="text-sm text-primary hover:underline">Meghalaya Travel Guide</Link>
              <Link to="/best-hostel-in-shillong" className="text-sm text-primary hover:underline">Best Hostel in Shillong</Link>
              <Link to="/tours" className="text-sm text-primary hover:underline">Northeast India Tours</Link>
              <Link to="/meghalaya-photo-gallery" className="text-sm text-primary hover:underline">Photo Gallery</Link>
            </div>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
