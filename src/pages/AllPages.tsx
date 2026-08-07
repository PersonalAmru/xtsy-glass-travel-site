import { memo, useState, useCallback, useMemo } from 'react';
import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DirectoryOfferPopup from '@/components/DirectoryOfferPopup';
import { ALL_SEO_PAGES, getPagesByCategory, type SEOPageData } from '@/data/seoPages';
import { EXPLORER_CATEGORIES } from '@/data/seoLinkingWheel';
import { meghalayaDestinations, getDestinationImageUrl, knownImageIndices, getFirstValidImageIndex } from '@/data/meghalayaDestinations';
import { Search, MapPin, Star, Compass, BookOpen, Route, ChevronRight, Sparkles, Mountain, TreePine, ArrowRight } from 'lucide-react';

// --- Cluster image mapping (first known image for each category) ---
const CLUSTER_IMAGES: Record<string, { slug: string; idx: number }> = {
  waterfalls: { slug: 'nohkalikai-falls', idx: 1 },
  caves: { slug: 'mawsmai-cave', idx: 1 },
  villages: { slug: 'mawlynnong-village', idx: 1 },
  viewpoints: { slug: 'laitlum-canyons', idx: 2 },
  adventure: { slug: 'double-decker-living-root-bridge', idx: 2 },
  rivers: { slug: 'dawki-umngot-river', idx: 2 },
};

const CLUSTER_DESCRIPTIONS: Record<string, string> = {
  waterfalls: 'India\'s tallest plunge waterfall and hidden turquoise pools',
  caves: 'The longest cave systems in India with ancient formations',
  villages: 'Asia\'s cleanest village and living root bridge communities',
  viewpoints: 'Dramatic canyons, peaks, and sunrise viewpoints',
  adventure: 'Root bridge treks, bamboo trails, and river camping',
  rivers: 'Crystal-clear rivers where boats float in mid-air',
};

const FEATURED_GUIDES = [
  { slug: 'meghalaya-travel-guide', title: 'Meghalaya Travel Guide', desc: 'Everything you need for your Meghalaya trip', icon: Compass },
  { slug: 'places-to-visit-meghalaya', title: '80 Places to Visit', desc: 'Complete destination guide with maps & tips', icon: MapPin },
  { slug: 'things-to-do-meghalaya', title: 'Things to Do', desc: 'Activities, experiences & hidden gems', icon: Sparkles },
  { slug: 'shillong-travel-guide', title: 'Shillong Guide', desc: 'Scotland of the East — complete city guide', icon: Mountain },
  { slug: 'cherrapunji-travel-guide', title: 'Cherrapunjee Guide', desc: 'Waterfalls, caves & root bridges', icon: TreePine },
  { slug: 'meghalaya-itinerary', title: 'Meghalaya Itinerary', desc: 'Day-by-day trip planning made easy', icon: Route },
];

const PROGRAMMATIC_GROUPS = [
  {
    label: 'Itineraries',
    icon: '🗓️',
    pages: ['meghalaya-3-day-itinerary', '5-day-meghalaya-itinerary', '7-day-meghalaya-itinerary', '10-day-meghalaya-itinerary', '2-day-shillong-itinerary'],
  },
  {
    label: 'Road Trips',
    icon: '🚗',
    pages: ['shillong-to-dawki-road-trip', 'shillong-to-cherrapunjee-road-trip', 'guwahati-to-shillong-road-trip'],
  },
  {
    label: 'Budget & Planning',
    icon: '💰',
    pages: ['budget-trip-meghalaya', 'backpacking-meghalaya-guide', 'best-time-to-visit-meghalaya'],
  },
  {
    label: 'Stay & Dine',
    icon: '🏠',
    pages: ['best-hostel-in-shillong', 'backpacker-hostel-shillong', 'restaurants-in-shillong', 'best-cafes-shillong', 'hotels-in-shillong', 'homestays-in-shillong'],
  },
];

const categories = [
  { key: 'travel-guides', label: 'Travel Guides' },
  { key: 'destinations', label: 'Destinations' },
  { key: 'hostels', label: 'Hostels & Budget Stays' },
  { key: 'hotels', label: 'Hotels' },
  { key: 'homestays', label: 'Homestays' },
  { key: 'tours', label: 'Tour Packages' },
  { key: 'group-tours', label: 'Group Tours & Bookings' },
  { key: 'corporate', label: 'Corporate Offsites' },
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

// Visual + offer metadata per directory category.
type CatMeta = { img: string; idx: number; tagline: string; cta: string; ctaTo: string; offer?: string };
const CATEGORY_META: Record<string, CatMeta> = {
  'travel-guides': { img: 'mawlynnong-village', idx: 1, tagline: 'Expert-written guides to plan every detail', cta: 'Read Guides', ctaTo: '/meghalaya-travel-guide' },
  destinations: { img: 'laitlum-canyons', idx: 2, tagline: 'Every waterfall, cave & viewpoint mapped', cta: 'Explore Map', ctaTo: '/places-to-visit-meghalaya' },
  hostels: { img: 'umiam-lake', idx: 1, tagline: 'Award-winning stays from ₹599/night', cta: 'Book a Bed', ctaTo: '/book', offer: 'From ₹599' },
  hotels: { img: 'umiam-lake', idx: 2, tagline: 'Comfortable hotels across Shillong', cta: 'Book Now', ctaTo: '/book' },
  homestays: { img: 'mawlynnong-village', idx: 2, tagline: 'Live with local Khasi families', cta: 'Find a Homestay', ctaTo: '/book' },
  tours: { img: 'dawki-umngot-river', idx: 1, tagline: 'Fixed-price packages from ₹15,500', cta: 'View Packages', ctaTo: '/tours', offer: 'Best Value' },
  'group-tours': { img: 'dawki-umngot-river', idx: 2, tagline: 'Custom trips for groups of 6–60', cta: 'Group Bookings', ctaTo: '/group-bookings-meghalaya', offer: 'Per-person rates' },
  corporate: { img: 'umiam-lake', idx: 1, tagline: 'Offsites & team outings, GST billed', cta: 'Plan Offsite', ctaTo: '/group-bookings-meghalaya' },
  itineraries: { img: 'double-decker-living-root-bridge', idx: 1, tagline: 'Day-by-day plans ready to go', cta: 'Plan Trip', ctaTo: '/meghalaya-itinerary' },
  activities: { img: 'double-decker-living-root-bridge', idx: 1, tagline: 'Treks, caving, boating & more', cta: 'See Activities', ctaTo: '/things-to-do-meghalaya' },
  attractions: { img: 'nohkalikai-falls', idx: 1, tagline: "Meghalaya's most iconic sights", cta: 'Discover', ctaTo: '/places-to-visit-meghalaya' },
  rentals: { img: 'laitlum-canyons', idx: 1, tagline: 'Bikes & cars for your journey', cta: 'Rent Now', ctaTo: '/book' },
  restaurants: { img: 'krang-suri-falls', idx: 1, tagline: 'Café culture & local cuisine', cta: 'View Dining', ctaTo: '/restaurant-in-shillong' },
  glamping: { img: 'umiam-lake', idx: 1, tagline: 'Riverside camps under the stars', cta: 'Book Glamping', ctaTo: '/book', offer: 'New' },
  weddings: { img: 'mawlynnong-village', idx: 1, tagline: 'Dream destination weddings', cta: 'Enquire', ctaTo: '/book' },
  hospitals: { img: 'laitlum-canyons', idx: 2, tagline: 'Stays close to care facilities', cta: 'View Stays', ctaTo: '/book' },
  accommodation: { img: 'umiam-lake', idx: 2, tagline: 'Every place to stay in one list', cta: 'Browse Stays', ctaTo: '/book' },
};

const DirectoryCategoryCard = memo(({ catKey, label, pages }: { catKey: string; label: string; pages: SEOPageData[] }) => {
  const meta = CATEGORY_META[catKey];
  const imgSrc = meta ? getDestinationImageUrl(meta.img, meta.idx) : '/placeholder.svg';
  return (
    <div className="group flex flex-col rounded-3xl overflow-hidden border border-border/50 bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-300">
      {/* Image header */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={imgSrc} alt={label} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        {meta?.offer && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-lg">
            <Sparkles className="h-3 w-3" /> {meta.offer}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{label}</h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">{pages.length}</span>
          </div>
          {meta?.tagline && <p className="mt-0.5 text-xs text-white/85">{meta.tagline}</p>}
        </div>
      </div>

      {/* Page chips — all links stay in HTML for SEO crawl */}
      <div className="flex-1 p-4">
        <div className="flex flex-wrap gap-1.5">
          {pages.map(p => (
            <Link
              key={p.slug}
              to={`/${p.slug}`}
              className="text-xs px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {p.h1}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      {meta && (
        <Link
          to={meta.ctaTo}
          className="flex items-center justify-between gap-2 min-h-[48px] px-4 m-4 mt-0 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {meta.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
});
DirectoryCategoryCard.displayName = 'DirectoryCategoryCard';


// --- Components ---

const DestinationCard = memo(({ dest }: { dest: { slug: string; label: string } }) => {
  // Try to find a matching meghalaya destination for image
  const mdSlug = dest.slug.replace(/-meghalaya$|-shillong$|-cherrapunji$|-garo-hills$/, '');
  const imgIdx = getFirstValidImageIndex(mdSlug);
  const imgSrc = imgIdx ? getDestinationImageUrl(mdSlug, imgIdx) : null;
  const md = meghalayaDestinations.find(d => d.slug === mdSlug);

  return (
    <Link
      to={`/${dest.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[4/3] bg-muted/40 overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={dest.label}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
            <MapPin className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">{dest.label}</h3>
        {md && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{md.shortDescription}</p>}
      </div>
    </Link>
  );
});
DestinationCard.displayName = 'DestinationCard';

const ClusterCard = memo(({ cat, isOpen, onToggle }: {
  cat: typeof EXPLORER_CATEGORIES[0];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const img = CLUSTER_IMAGES[cat.id];
  const imgSrc = img ? getDestinationImageUrl(img.slug, img.idx) : null;
  const desc = CLUSTER_DESCRIPTIONS[cat.id] || '';

  return (
    <div className="flex flex-col">
      <button
        onClick={onToggle}
        className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 text-left ${
          isOpen ? 'border-primary/40 shadow-lg ring-1 ring-primary/20' : 'border-border/50 hover:border-primary/30 hover:shadow-md'
        }`}
        aria-expanded={isOpen}
      >
        <div className="aspect-[16/9] overflow-hidden relative">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={cat.label}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{cat.icon}</span>
              <h3 className="text-lg font-bold text-white">{cat.label}</h3>
            </div>
            <p className="mt-1 text-xs text-white/80">{desc}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                {cat.destinations.length} destinations
              </span>
              <ChevronRight className={`h-3.5 w-3.5 text-white/80 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {cat.destinations.map(d => (
            <DestinationCard key={d.slug} dest={d} />
          ))}
          <Link
            to={`/${cat.pillarSlug}`}
            className="flex items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            View complete guide →
          </Link>
        </div>
      )}
    </div>
  );
});
ClusterCard.displayName = 'ClusterCard';

const GuideCard = memo(({ guide }: { guide: typeof FEATURED_GUIDES[0] }) => {
  const Icon = guide.icon;
  return (
    <Link
      to={`/${guide.slug}`}
      className="group flex items-start gap-4 p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300"
    >
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{guide.title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{guide.desc}</p>
      </div>
    </Link>
  );
});
GuideCard.displayName = 'GuideCard';

// --- Main Page ---

const AllPages = () => {
  const [openCluster, setOpenCluster] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggle = useCallback((id: string) => {
    setOpenCluster(prev => prev === id ? null : id);
  }, []);

  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return ALL_SEO_PAGES.filter(p =>
      p.h1.toLowerCase().includes(q) ||
      p.keywords.some(k => k.toLowerCase().includes(q)) ||
      p.slug.includes(q)
    ).slice(0, 24);
  }, [searchQuery]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Explore Meghalaya' },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Explore Meghalaya — 300+ Travel Guides & Destinations | XTSY</title>
        <meta name="description" content="Discover 300+ curated travel guides, destinations, and experiences in Meghalaya. Waterfalls, caves, treks, villages — your complete Meghalaya travel hub." />
        <link rel="canonical" href="https://xtsy.one/all-pages" />
        <meta property="og:title" content="Explore Meghalaya — 300+ Destinations & Guides" />
        <meta property="og:description" content="Your gateway to Meghalaya's waterfalls, caves, villages, and adventure experiences." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/3" />
          <div className="relative container mx-auto px-4 max-w-6xl py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <Sparkles className="h-3 w-3" />
              {ALL_SEO_PAGES.length}+ curated pages
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
              Explore Meghalaya
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Waterfalls, caves, villages, and adventure — discover every corner of the Abode of Clouds
            </p>

            {/* Search */}
            <div className="mt-8 max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search destinations, guides, stays..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all shadow-xs"
              />
            </div>

            {/* Quick nav pills */}
            <nav className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Quick navigation">
              {[
                { to: '/', label: 'Home' },
                { to: '/tours', label: 'Tours' },
                { to: '/book', label: 'Book Stay' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/meghalaya-travel-guide', label: 'Travel Guide' },
                { to: '/restaurant-in-shillong', label: 'TAB Bistro' },
              ].map(l => (
                <Link key={l.to} to={l.to} className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted/60 text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* Search Results */}
        {filteredPages && (
          <section className="container mx-auto px-4 max-w-6xl pb-12">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {filteredPages.length} result{filteredPages.length !== 1 ? 's' : ''} for "{searchQuery}"
            </h2>
            {filteredPages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPages.map(p => (
                  <Link
                    key={p.slug}
                    to={`/${p.slug}`}
                    className="flex flex-col p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{p.category.replace('-', ' ')}</span>
                    <h3 className="mt-1 font-semibold text-foreground text-sm leading-snug">{p.h1}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.metaDescription}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No pages found. Try a different search term.</p>
            )}
          </section>
        )}

        {/* Destination Clusters */}
        {!filteredPages && (
          <>
            <section className="container mx-auto px-4 max-w-6xl pb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground whitespace-nowrap">Discover by Category</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {EXPLORER_CATEGORIES.map(cat => (
                  <ClusterCard
                    key={cat.id}
                    cat={cat}
                    isOpen={openCluster === cat.id}
                    onToggle={() => handleToggle(cat.id)}
                  />
                ))}
              </div>
            </section>

            {/* Featured Travel Guides */}
            <section className="bg-muted/30 py-14">
              <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center gap-3 mb-8">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">Featured Travel Guides</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FEATURED_GUIDES.map(g => (
                    <GuideCard key={g.slug} guide={g} />
                  ))}
                </div>
              </div>
            </section>

            {/* Programmatic Guides */}
            <section className="container mx-auto px-4 max-w-6xl py-14">
              <div className="flex items-center gap-3 mb-8">
                <Route className="h-5 w-5 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Plan Your Trip</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {PROGRAMMATIC_GROUPS.map(group => (
                  <div key={group.label} className="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm mb-3">
                      <span className="text-lg">{group.icon}</span>
                      {group.label}
                    </h3>
                    <ul className="space-y-2">
                      {group.pages.map(slug => {
                        const page = ALL_SEO_PAGES.find(p => p.slug === slug);
                        return (
                          <li key={slug}>
                            <Link
                              to={`/${slug}`}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                              <ChevronRight className="h-3 w-3 flex-shrink-0" />
                              {page?.h1 || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Trust Banner */}
            <section className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-10">
              <div className="container mx-auto px-4 max-w-4xl text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span className="text-sm font-semibold text-foreground">4.8 ★ Google Rating</span>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-sm text-muted-foreground">320+ Reviews</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                  Every guide is curated by the XTSY travel team — based in Shillong, exploring Meghalaya since 2021.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <Link to="/book" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                    Book Your Stay
                  </Link>
                  <Link to="/tours" className="px-5 py-2.5 border border-primary text-primary rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors">
                    View Tour Packages
                  </Link>
                </div>
              </div>
            </section>

            {/* Full Directory — SEO Crawl Hub (all links remain in HTML) */}
            <section className="container mx-auto px-4 max-w-6xl py-14">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground whitespace-nowrap">Complete Directory</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="text-center text-sm text-muted-foreground max-w-xl mx-auto mb-8">
                Browse every guide, stay & experience by category — tap any card to claim the best season deals.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map(({ key, label }) => {
                  const pages = getPagesByCategory(key as any);
                  if (pages.length === 0) return null;
                  return <DirectoryCategoryCard key={key} catKey={key} label={label} pages={pages} />;
                })}
              </div>
            </section>
          </>
        )}
      </main>

      <DirectoryOfferPopup />
      <Footer />

    </div>
  );
};

export default AllPages;
