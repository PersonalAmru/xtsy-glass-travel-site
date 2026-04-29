import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Search, RefreshCw, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GONE_SLUGS } from "@/data/seoGoneSlugs";

interface NotFoundProps {
  /** Override the status code (default 404). Pass 410 for permanently removed slugs. */
  statusCode?: 404 | 410;
}

/**
 * Proper 404/410 page.
 *
 * Why this matters for SEO:
 *  - SPAs that render an empty <NotFound /> with HTTP 200 cause Google to
 *    treat them as "Soft 404" — wasting crawl budget and harming indexing.
 *  - We can't change the HTTP status from React (the dev server already sent
 *    200), but Lovable's prerender + the Vercel/CF edge layers respect
 *    `<meta name="prerender-status-code" content="404">` and serve the right
 *    status to crawlers.
 *  - Pages in GONE_SLUGS return 410 (Gone) so Google removes them faster.
 */
const NotFound = ({ statusCode }: NotFoundProps) => {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, '').split('/')[0];
  const isGone = statusCode === 410 || GONE_SLUGS.has(slug);
  const finalStatus = isGone ? 410 : (statusCode ?? 404);

  useEffect(() => {
    console.warn(
      `[${finalStatus}] User attempted to access non-existent route:`,
      location.pathname
    );
  }, [location.pathname, finalStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        {/* Prerender + edge-layer hint to return correct HTTP status to crawlers */}
        <meta name="prerender-status-code" content={String(finalStatus)} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <SEOHead
        title={`${isGone ? 'Page Removed (410)' : 'Page Not Found (404)'} | XTSY Travel`}
        description={
          isGone
            ? "This page has been permanently removed. Browse our hostels, tours and Meghalaya travel guides."
            : "The page you're looking for doesn't exist. Explore XTSY's hostels, tours and Meghalaya travel guides instead."
        }
        canonicalUrl={`https://xtsy.one${location.pathname}`}
        noIndex
      />

      {/* Site chrome stays — header + logo + footer */}
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-xl">
          <p className="text-7xl md:text-8xl font-bold text-primary mb-2">{finalStatus}</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            {isGone ? "This page has been removed" : "We couldn't find that page"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isGone ? (
              <>The page <code className="px-1 py-0.5 bg-muted rounded text-sm">{location.pathname}</code> is no longer available. Try one of the popular pages below.</>
            ) : (
              <>The page <code className="px-1 py-0.5 bg-muted rounded text-sm">{location.pathname}</code> doesn't exist or has been moved. Let's get you back on track.</>
            )}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center mb-6">
            {!isGone && (
              <Button onClick={() => window.location.reload()} size="lg" variant="secondary">
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            )}
            <Button asChild size="lg">
              <Link to="/" aria-label="Go to homepage">
                <Home className="mr-2 h-4 w-4" /> Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/tours" aria-label="Browse tours">
                <MapPin className="mr-2 h-4 w-4" /> Browse Tours
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/all-pages" aria-label="See all pages">
                <Search className="mr-2 h-4 w-4" /> All Pages
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Button asChild variant="outline" size="sm">
              <a href="https://wa.me/918837317070" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="tel:+918837317070" aria-label="Call XTSY">
                <Phone className="mr-2 h-4 w-4" /> Call +91 88373 17070
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/book" aria-label="Book direct">
                Book Direct
              </Link>
            </Button>
          </div>

          <nav aria-label="Popular pages" className="text-sm">
            <p className="text-muted-foreground mb-2">Or try these popular pages:</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
              <li><Link to="/best-hostel-in-shillong" className="text-primary hover:underline">Best Hostel Shillong</Link></li>
              <li><Link to="/meghalaya-tour-packages" className="text-primary hover:underline">Meghalaya Tours</Link></li>
              <li><Link to="/things-to-do-in-meghalaya" className="text-primary hover:underline">Things to Do</Link></li>
              <li><Link to="/gallery" className="text-primary hover:underline">Gallery</Link></li>
              <li><Link to="/about" className="text-primary hover:underline">About</Link></li>
            </ul>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
