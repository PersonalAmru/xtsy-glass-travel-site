import { destinationPath } from '@/data/neTaxonomy';
import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SEOHead } from "@/components/SEOHead";
import SiteHeader from "@/components/v2/SiteHeader";
import SiteFooter from "@/components/v2/SiteFooter";
import { SpinningMark } from "@/components/v2/primitives";
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
      .map((d) => ({ label: d.name, to: destinationPath(d.slug) }));
    return [...fromLinks, ...fromDest].slice(0, 8);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      navigate(results[0].to);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="xt min-h-screen">
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

      <SiteHeader />

      <main>
        <section className="relative overflow-hidden bg-xt-slate px-4 py-20 text-xt-paper sm:px-8 lg:px-16 lg:py-28">
          <SpinningMark fill="#F4EFE8" className="-right-24 -top-24 h-[520px] w-[520px] opacity-[0.07]" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <div className="xt-in xt-eyebrow text-[15px] text-[#F7C9D1]! sm:text-[18px]">{finalStatus} · {isGone ? "removed" : "lost in the clouds"}</div>
            <h1 className="xt-in xt-d1 xt-display m-0 text-[56px] leading-[0.9] sm:text-[96px]">
              {isGone ? "This page has been removed." : "This trail doesn’t go anywhere."}
            </h1>
            <p className="xt-in xt-d2 m-0 text-[17px] leading-relaxed text-xt-fog">
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-[14px]">{location.pathname}</code>{" "}
              {isGone ? "is no longer available." : "moved or never existed."} These will get you back on the road.
            </p>

            <form onSubmit={handleSearch} className="xt-in xt-d3 relative w-full max-w-xl">
              <label htmlFor="nf-search" className="sr-only">Search the site</label>
              <input
                id="nf-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hostels, tours, destinations…"
                className="h-14 w-full rounded-full border-0 bg-white pl-5 pr-32 text-[15px] text-xt-ink"
              />
              <button type="submit" className="absolute right-1.5 top-1.5 h-11 rounded-full bg-xt-crimson px-6 text-[15px] font-extrabold text-white">Search</button>
            </form>

            {results.length > 0 && (
              <ul className="m-0 w-full max-w-xl list-none divide-y divide-xt-line overflow-hidden rounded-2xl bg-white p-0 text-left text-xt-ink">
                {results.map((r) => (
                  <li key={r.to}>
                    <Link to={r.to} className="flex items-center justify-between px-5 py-3 text-[15px] font-bold hover:bg-xt-sand">
                      <span>{r.label}</span><span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="xt-in xt-d3 flex flex-wrap justify-center gap-3">
              <Link to="/" className="xt-btn flex h-12 items-center rounded-full bg-xt-paper px-6 font-extrabold text-xt-ink">Home</Link>
              <Link to="/book" className="xt-btn flex h-12 items-center rounded-full border-[1.5px] border-xt-paper px-6 font-extrabold text-xt-paper">Book a room</Link>
              <Link to="/tours" className="xt-btn flex h-12 items-center rounded-full border-[1.5px] border-xt-paper px-6 font-extrabold text-xt-paper">Tours</Link>
              {!isGone && (
                <button type="button" onClick={() => window.location.reload()} className="xt-btn flex h-12 items-center rounded-full border-[1.5px] border-xt-paper/40 px-6 font-extrabold text-xt-paper">Try again</button>
              )}
            </div>
          </div>
        </section>

        {popular.length > 0 && (
          <section className="px-4 py-16 sm:px-8 lg:px-16" aria-labelledby="popular-destinations">
            <h2 id="popular-destinations" className="xt-display m-0 mb-6 text-[40px] leading-none sm:text-[56px]">Popular in Meghalaya</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {popular.map((d) => (
                <Link
                  key={d.slug}
                  to={destinationPath(d.slug)}
                  className="xt-lift group relative aspect-[4/3] overflow-hidden rounded-3xl bg-xt-pine"
                  aria-label={`Visit ${d.name} guide`}
                >
                  {d.img && <img src={d.img} alt={`${d.name}, ${d.region}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <p className="m-0 text-[16px] font-extrabold text-white">{d.name}</p>
                    <p className="m-0 text-[13px] text-white/80">{d.region}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <nav aria-label="Popular pages" className="px-4 pb-16 text-center sm:px-8 lg:px-16">
          <ul className="m-0 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 p-0 text-[15px] font-bold">
            <li><Link to="/best-hostel-in-shillong" className="text-xt-crimson">Best hostel in Shillong</Link></li>
            <li><Link to="/meghalaya-tour-packages" className="text-xt-crimson">Meghalaya tours</Link></li>
            <li><Link to="/things-to-do-in-meghalaya" className="text-xt-crimson">Things to do</Link></li>
            <li><Link to="/tab-bistro" className="text-xt-crimson">TAB Bistro</Link></li>
            <li><Link to="/contact" className="text-xt-crimson">Contact</Link></li>
          </ul>
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
};

export default NotFound;
