import { useState, useMemo, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import SEOHead from "@/components/SEOHead";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TourBookingModal from "@/components/TourBookingModal";
import { getAllTours, mergeItinerary } from "@/data/travelData";
import type { TourPackage } from "@/data/travelData";
import { getSignaturePackageBySlug, signaturePackageToTourPackage } from "@/data/signaturePackages";
import { useApp } from "@/contexts/AppContext";
import {
  Clock, MapPin, Users, Star, Calendar, ChevronLeft, CheckCircle2,
  XCircle, MessageCircle, ChevronRight, Mountain, Sparkles,
} from "lucide-react";

const toSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const TourDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currency, formatPrice } = useApp();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Try to get tour from navigation state first, then fallback to lookup
  const tour = useMemo(() => {
    if (location.state?.tour) return location.state.tour as TourPackage;
    const allTours = getAllTours();
    const found = allTours.find(t => toSlug(t.title) === slug);
    if (found) return mergeItinerary(found);
    const sig = slug ? getSignaturePackageBySlug(slug) : undefined;
    return sig ? signaturePackageToTourPackage(sig) : null;
  }, [slug, location.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!tour) {
    // Unknown tour slug → proper 404 (NotFound emits prerender-status-code
    // 404 + noindex) instead of a soft-404 200 page.
    return <NotFound />;
  }

  const images = tour.images?.length ? [tour.image, ...tour.images] : [tour.image];
  const basePrice = parseInt(tour.price.replace(/[^\d]/g, ''));
  const displayPrice = (tour.fixedPrice || currency.code === 'INR') ? tour.price : formatPrice(Math.round(basePrice * 1.10));

  // Default inclusions/exclusions if not defined
  const inclusions = [
    "Accommodation on twin/triple sharing",
    "All meals (breakfast, lunch, dinner)",
    "Private transportation throughout",
    "Local expert guide",
    "All entry fees and permits",
    "Welcome drink on arrival",
  ];

  const exclusions = [
    "Flights/train tickets to & from destination",
    "Personal expenses & tips",
    "Travel insurance",
    "Anything not mentioned in inclusions",
  ];

  const faqs = [
    { q: "What's the best time to do this tour?", a: `The best season for this tour is ${tour.bestSeason}. Weather is ideal and all activities are accessible.` },
    { q: "Is this tour suitable for beginners?", a: `This tour is rated as "${tour.difficulty}". ${tour.difficulty === 'Easy' ? 'Perfect for first-time adventurers.' : tour.difficulty === 'Moderate' ? 'Some fitness level recommended.' : 'Prior trekking experience recommended.'}` },
    { q: "What about group sizes?", a: tour.groupSize ? `Groups are kept small at ${tour.groupSize} for a personalized experience.` : "We keep groups small (4-12 people) for the best experience." },
    { q: "Can I customize this itinerary?", a: "Yes! We offer private tours with customizable itineraries. Contact us on WhatsApp to discuss." },
  ];

  const tourUrl = `https://xtsy.one/tours/${slug}`;
  const numericPrice = parseInt(tour.price.replace(/[^\d]/g, '')) || undefined;

  // TouristTrip schema (with Offer) for tour rich results, plus breadcrumb.
  // No aggregateRating is emitted because there is no per-tour review count —
  // fabricating one would violate review/rich-result integrity guidelines.
  const tourSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    image: images,
    url: tourUrl,
    touristType: tour.category,
    ...(tour.itinerary?.length
      ? {
          itinerary: {
            '@type': 'ItemList',
            numberOfItems: tour.itinerary.length,
            itemListElement: tour.itinerary.map((day, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: day.title,
            })),
          },
        }
      : {}),
    provider: {
      '@type': 'TravelAgency',
      name: 'XTSY Travel',
      url: 'https://xtsy.one/tours',
    },
    ...(numericPrice
      ? {
          offers: {
            '@type': 'Offer',
            price: numericPrice,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: tourUrl,
          },
        }
      : {}),
  };

  const tourBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Tours', item: 'https://xtsy.one/tours' },
      { '@type': 'ListItem', position: 3, name: tour.title, item: tourUrl },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={`${tour.title} — XTSY Travel | ${tour.location}`}
        description={tour.description}
        keywords={`${tour.title}, ${tour.location} tour, ${tour.category} tour, XTSY Travel`}
        canonicalUrl={tourUrl}
        structuredData={[tourSchema, tourBreadcrumb]}
      />
      <Header />

      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/tours" className="hover:text-white transition-colors">Tours</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white truncate max-w-[200px]">{tour.title}</span>
          </nav>
        </div>

        {/* Hero Banner */}
        <section className="relative h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={tour.title}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {/* Image navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-6' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => navigate("/tours")}
            className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 -mt-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Title area */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-emerald-600/90 text-white border-0 capitalize">{tour.category}</Badge>
                  <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                    {tour.difficulty}
                  </Badge>
                  {tour.exclusive && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                      ⭐ XTSY Exclusive
                    </Badge>
                  )}
                </div>

                <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                  {tour.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-white font-semibold">{tour.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{tour.duration}</span>
                  </div>
                  {tour.groupSize && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{tour.groupSize}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Best: {tour.bestSeason}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="mb-10">
                <TabsList className="bg-card/50 border border-border/30 w-full justify-start overflow-x-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="faqs">FAQs</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="mt-6">
                  <p className="text-muted-foreground leading-relaxed mb-6">{tour.description}</p>

                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    Tour Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {tour.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-card/30 rounded-lg px-3 py-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/80">{h}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Itinerary */}
                <TabsContent value="itinerary" className="mt-6">
                  {tour.itinerary && tour.itinerary.length > 0 ? (
                    <div className="space-y-4">
                      {tour.itinerary.map((day, i) => (
                        <div key={i} className="relative pl-8 pb-4">
                          {/* Timeline line */}
                          {i < tour.itinerary!.length - 1 && (
                            <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-emerald-500/20" />
                          )}
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">{i + 1}</span>
                          </div>

                          <div className="bg-card/30 border border-border/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
                                {day.day}
                              </Badge>
                              {day.route && (
                                <span className="text-xs text-muted-foreground">{day.route}</span>
                              )}
                            </div>
                            <h4 className="font-semibold text-white text-sm mb-2">{day.title}</h4>
                            <ul className="space-y-1.5">
                              {day.activities.map((act, j) => (
                                <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                  {act}
                                </li>
                              ))}
                            </ul>
                            {day.overnight && (
                              <p className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                                <Mountain className="h-3 w-3" />
                                Overnight: {day.overnight}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-card/30 rounded-xl">
                      <p className="text-muted-foreground mb-2">Detailed day-by-day itinerary available on request.</p>
                      <Button variant="outline" size="sm" onClick={() => {
                        window.open(`https://wa.me/918787389783?text=Hi! I'd like the detailed itinerary for "${tour.title}"`, "_blank");
                      }}>
                        <MessageCircle className="h-4 w-4 mr-1.5" />
                        Request Itinerary
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Inclusions */}
                <TabsContent value="inclusions" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> What's Included
                      </h3>
                      <ul className="space-y-2">
                        {inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-400" /> What's Not Included
                      </h3>
                      <ul className="space-y-2">
                        {exclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* FAQs */}
                <TabsContent value="faqs" className="mt-6">
                  <div className="space-y-3">
                    {faqs.map((faq, i) => (
                      <details key={i} className="group bg-card/30 border border-border/30 rounded-xl overflow-hidden">
                        <summary className="cursor-pointer p-4 text-sm font-medium text-white hover:text-emerald-400 transition-colors list-none flex items-center justify-between">
                          {faq.q}
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                        </summary>
                        <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                      </details>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sticky booking widget */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-20 bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl p-5">
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-emerald-400">{displayPrice}</span>
                    <span className="text-sm text-muted-foreground">/person</span>
                  </div>
                </div>

                <div className="space-y-3 mb-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <span>Best: {tour.bestSeason}</span>
                  </div>
                  {tour.groupSize && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-500" />
                      <span>{tour.groupSize}</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-500/25 mb-3"
                >
                  Book Now
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    window.open(`https://wa.me/918787389783?text=Hi! I'm interested in "${tour.title}" (${tour.duration}). Can you share more details?`, "_blank");
                  }}
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enquire on WhatsApp
                </Button>

                {/* Trust signals */}
                <div className="mt-5 pt-4 border-t border-border/30 space-y-2">
                  {["Instant confirmation", "Free cancellation up to 48hrs", "Best price guarantee"].map(signal => (
                    <div key={signal} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <TourBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tourPackage={tour}
      />
    </div>
  );
};

export default TourDetail;
