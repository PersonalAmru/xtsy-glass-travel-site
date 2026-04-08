import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ALL_SEO_PAGES, getPagesByCategory } from '@/data/seoPages';

const categories = [
  { key: 'travel-guides', label: 'Travel Guides' },
  { key: 'destinations', label: 'Destinations' },
  { key: 'hostels', label: 'Hostels' },
  { key: 'hotels', label: 'Hotels' },
  { key: 'homestays', label: 'Homestays' },
  { key: 'tours', label: 'Tour Packages' },
  { key: 'itineraries', label: 'Itineraries' },
  { key: 'activities', label: 'Activities' },
  { key: 'attractions', label: 'Attractions' },
  { key: 'rentals', label: 'Rentals' },
  { key: 'restaurants', label: 'Dining' },
  { key: 'glamping', label: 'Glamping' },
  { key: 'weddings', label: 'Weddings' },
  { key: 'hospitals', label: 'Near Hospitals' },
  { key: 'accommodation', label: 'Accommodation' },
] as const;

const AllPages = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>All Pages — XTSY Travel | Meghalaya Tourism Hub</title>
      <meta name="description" content="Browse all travel guides, destination pages, and resources on XTSY. Your complete directory for Meghalaya tourism." />
      <link rel="canonical" href="https://xtsy.one/all-pages" />
    </Helmet>
    <Header />
    <main className="pt-20 container mx-auto px-4 max-w-5xl py-10">
      <h1 className="text-3xl font-bold text-foreground">All Pages — XTSY Travel Directory</h1>
      <p className="mt-2 text-muted-foreground">{ALL_SEO_PAGES.length}+ travel guides, destination pages, and resources for Meghalaya tourism.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/" className="text-sm text-primary hover:underline">Home</Link>
        <Link to="/tours" className="text-sm text-primary hover:underline">Tours</Link>
        <Link to="/book" className="text-sm text-primary hover:underline">Book Stay</Link>
        <Link to="/gallery" className="text-sm text-primary hover:underline">Gallery</Link>
        <Link to="/about" className="text-sm text-primary hover:underline">About</Link>
      </div>

      {categories.map(({ key, label }) => {
        const pages = getPagesByCategory(key as any);
        if (pages.length === 0) return null;
        return (
          <section key={key} className="mt-8">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">{label} ({pages.length})</h2>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
              {pages.map(p => (
                <li key={p.slug}>
                  <Link to={`/${p.slug}`} className="text-sm text-primary hover:underline">{p.h1}</Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
    <Footer />
  </div>
);

export default AllPages;
