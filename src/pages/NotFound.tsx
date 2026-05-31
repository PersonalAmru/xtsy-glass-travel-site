import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, MapPin, Search, RefreshCw, MessageCircle, Phone, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GONE_SLUGS } from "@/data/seoGoneSlugs";
import { useGoneStatus } from "@/hooks/useGoneStatus";
import { meghalayaDestinations, getDestinationImages } from "@/data/meghalayaDestinations";

interface NotFoundProps {
  /** Override the status code (default 404). Pass 410 for permanently removed slugs. */
  statusCode?: 404 | 410;
}

/** Curated, always-live links the on-page search can match against. */
const QUICK_LINKS: { label: string; to: string; keywords: string }[] = [
  { label: "Best Hostel in Shillong", to: "/best-hostel-in-shillong", keywords: "hostel stay backpacker budget dorm shillong" },
  { label: "Hotels in Shillong", to: "/hotels-in-shillong", keywords: "hotel stay rooms shillong" },
  { label: "Homestays in Shillong", to: "/homestays-in-shillong", keywords: "homestay stay shillong" },
  { label: "Luxury Glamping", to: "/luxury-glamping-shillong", keywords: "glamping luxury camp tent shillong" },
  { label: "Meghalaya Tour Packages", to: "/meghalaya-tour-packages", keywords: "tour package trip holiday meghalaya" },
  { label: "Couple Tour Package", to: "/meghalaya-couple-tour-package", keywords: "couple honeymoon romantic tour package" },
  { label: "Shillong Tour Package", to: "/shillong-tour-package", keywords: "shillong tour package trip" },
  { label: "Things to Do in Meghalaya", to: "/things-to-do-in-meghalaya", keywords: "things to do places visit attractions meghalaya" },
  { label: "Best Time to Visit", to: "/best-time-to-visit-meghalaya", keywords: "best time season weather visit meghalaya" },
  { label: "3-Day Itinerary", to: "/3-day-meghalaya-itinerary", keywords: "itinerary 3 day plan trip meghalaya" },
  { label: "TAB Bistro by XTSY", to: "/tab-bistro", keywords: "restaurant food cafe dining tab bistro eat shillong" },
  { label: "Catering & Bulk Orders", to: "/tab-bistro/catering", keywords: "catering bulk order corporate event food" },
  { label: "Browse All Tours", to: "/tours", keywords: "tours trips travel packages" },
  { label: "Gallery", to: "/gallery", keywords: "gallery photos images" },
  { label: "All Pages", to: "/all-pages", keywords: "sitemap all pages directory" },
];

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
 *  - The on-page search + popular-destination links keep users (and crawlers)
 *    moving deeper into the site, preserving internal-linking context.
 */
const NotFound = ({ statusCode }: NotFoundProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.replace(/^\//, "").split("/")[0];
  const baseStatus: 404 | 410 =
    statusCode === 410 || GONE_SLUGS.has(slug) ? 410 : 404;
  // Escalate 404 → 410 when Supabase has the slug flagged as permanently gone.
  const finalStatus = useGoneStatus(location.pathname, baseStatus);
  const isGone = finalStatus === 410;

  const [query, setQuery] = useState("");

  useEffect(() => {
    console.warn(
      `[${finalStatus}] User attempted to access non-existent route:`,
      location.pathname
    );
  }, [location.pathname, finalStatus]);

  // Featured destinations with a known-good hero image for the popular grid.
  const popular = useMemo(
    () =>
      meghalayaDestinations
        .filter((d) => d.featured)
        .slice(0, 6)
        .map((d) => ({
          name: d.name,
          slug: d.slug,
          region: d.region,
          img: getDestinationImages(d.slug, 1)[0]?.src,
        })),
    []
  );

  // Live, client-side filter — never produces a dead link.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const fromLinks = QUICK_LINKS.filter(
      (l) => l.label.toLowerCase().includes(q) || l.keywords.includes(q)
    ).map((l) => ({ label: l.label, to: l.to }));
    const fromDest = meghalayaDestinations
      .filter((d) => d.name.toLowerCase().includes(q))
      .map((d) => ({ label: d.name, to: `/places-to-visit/${d.slug}` }));
    return [...fromLinks, ...fromDest].slice(0, 8);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      navigate(results[0].to);
    } else {
      navigate("/all-pages");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        {/* Prerender + edge-layer hint to return correct HTTP status to crawlers */}
        <meta name="prerender-status-code" content={String(finalStatus)} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <SEOHead
        title={`${isGone ? "Page Removed (410)" : "Page Not Found (404)"} | XTSY Travel`}
        description={
          isGone
            ? "This page has been permanently removed. Browse our hostels, tours and Meghalaya travel guides."
            : "The page you're looking for doesn't exist. Explore XTSY's hostels, tours and Meghalaya travel guides instead."
        }
        canonicalUrl={`https://xtsy.one${location.pathname}`}
        noIndex
      />

      <Header />

      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-7xl md:text-8xl font-bold text-primary mb-2">{finalStatus}</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            {isGone ? "This page has been removed" : "We couldn't find that page"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isGone ? (
              <>The page <code className="px-1 py-0.5 bg-muted rounded text-sm">{location.pathname}</code> is no longer available. Try a search or one of the popular pages below.</>
            ) : (
              <>The page <code className="px-1 py-0.5 bg-muted rounded text-sm">{location.pathname}</code> doesn't exist or has been moved. Search below or pick a destination.</>
            )}
          </p>

          {/* On-page search — filters live, always links to real pages */}
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hostels, tours, destinations…"
              aria-label="Search the site"
              className="pl-10 pr-24 h-12"
            />
            <Button type="submit" size="sm" className="absolute right-1.5 top-1/2 -translate-y-1/2">
              Search
            </Button>
          </form>

          {results.length > 0 && (
            <ul className="max-w-xl mx-auto mb-8 text-left rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
              {results.map((r) => (
                <li key={r.to}>
                  <Link
                    to={r.to}
                    className="flex items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <span>{r.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center mb-10 mt-6">
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
          </div>
        </div>

        {/* Popular destinations grid — internal links preserve SEO context */}
        {popular.length > 0 && (
          <section className="max-w-5xl mx-auto mt-4" aria-labelledby="popular-destinations">
            <h2 id="popular-destinations" className="text-xl font-semibold text-foreground mb-5 text-center">
              Popular destinations in Meghalaya
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {popular.map((d) => (
                <Link
                  key={d.slug}
                  to={`/places-to-visit/${d.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`Visit ${d.name} guide`}
                >
                  {d.img && (
                    <img
                      src={d.img}
                      alt={`${d.name}, ${d.region}`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                    <p className="text-sm font-semibold text-white">{d.name}</p>
                    <p className="text-xs text-white/80">{d.region}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Contact + secondary nav */}
        <div className="max-w-3xl mx-auto text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
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
              <li><Link to="/tab-bistro" className="text-primary hover:underline">TAB Bistro</Link></li>
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
