/**
 * PropertySelector — /book/select
 * Bridge page between hero search and the actual booking flow.
 * Lists all active properties for the chosen location with location meta tags.
 */

import { memo, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, ArrowRight, Star, Sparkles } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import UnifiedImage from "@/components/UnifiedImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  getPropertiesByLocation,
  getLocationById,
  PROPERTIES,
} from "@/data/properties";

// Map a property to its booking destination route
function getBookingRouteForProperty(propertyId: string, qs: string): string {
  switch (propertyId) {
    case "xtsy-adventure-campsite-dawki":
      return `/book/campsite?${qs}`;
    case "xtsy-luxury":
      return `/book?${qs}&property=xtsy-experience`;
    case "xtsy-travellers-hostel":
    default:
      return `/book?${qs}&property=xtsy-hostel`;
  }
}

const PropertySelector = memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const locationId = searchParams.get("location") || "shillong";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "1";

  const location = getLocationById(locationId);
  const properties = useMemo(() => getPropertiesByLocation(locationId), [locationId]);

  // Preserve query string for downstream booking routes
  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (checkIn) p.set("checkIn", checkIn);
    if (checkOut) p.set("checkOut", checkOut);
    if (guests) p.set("guests", guests);
    p.set("location", locationId);
    return p.toString();
  }, [checkIn, checkOut, guests, locationId]);

  // Edge case: unknown location
  if (!location) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Location not available</h1>
          <p className="text-muted-foreground mb-6">We don't operate in this destination yet.</p>
          <Button onClick={() => navigate("/")}>Back to home</Button>
        </div>
      </div>
    );
  }

  const seoTitle = `Choose Your Stay in ${location.name} | XTSY`;
  const seoDesc = `Pick from ${properties.length} XTSY ${properties.length === 1 ? "property" : "properties"} in ${location.name}, ${location.state}. Book direct for the best rate.`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        {/* Location meta — required for geo-targeted SEO */}
        <meta name="geo.region" content={`IN-${location.state === "Meghalaya" ? "ML" : ""}`} />
        <meta name="geo.placename" content={`${location.name}, ${location.state}`} />
        <meta property="og:locality" content={location.name} />
        <meta property="og:region" content={location.state} />
        <link rel="canonical" href={`https://xtsy.one/book/select?location=${locationId}`} />
      </Helmet>

      <SEOHead title={seoTitle} description={seoDesc} />

      <Header />

      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Search summary */}
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
              ← Change search
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Stays in <span className="text-primary">{location.name}</span>
            </h1>
            <p className="text-muted-foreground mb-4">
              {properties.length} {properties.length === 1 ? "property" : "properties"} available
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground bg-muted/40 rounded-full px-4 py-2">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {location.name}, {location.state}
              </span>
              {checkIn && checkOut && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {checkIn} → {checkOut}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {guests} {parseInt(guests) === 1 ? "guest" : "guests"}
              </span>
            </div>
          </div>

          {/* Property cards */}
          {properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No properties available in {location.name} for these dates.</p>
              <Button className="mt-4" onClick={() => navigate("/")}>Try another location</Button>
            </div>
          ) : (
            <div className={cn(
              "grid gap-6",
              properties.length === 1 ? "md:grid-cols-1 max-w-2xl mx-auto" : "md:grid-cols-2"
            )}>
              {properties.map((property, idx) => {
                const route = getBookingRouteForProperty(property.id, qs);
                return (
                  <motion.button
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(route)}
                    className={cn(
                      "group text-left",
                      "bg-card border border-border rounded-2xl overflow-hidden",
                      "shadow-sm hover:shadow-xl",
                      "transition-all duration-300"
                    )}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <UnifiedImage
                        src={property.heroImage}
                        alt={`${property.name} in ${location.name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {property.category === "luxury" && (
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-primary/95 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur">
                          <Sparkles className="w-3 h-3" />
                          Premium
                        </div>
                      )}
                      {property.category === "budget" && (
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur">
                          Adventure
                        </div>
                      )}
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-background/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {property.rating}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h2 className="text-lg font-bold leading-tight">{property.name}</h2>
                          <p className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {location.name}, {location.state}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {property.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {property.amenities.slice(0, 3).map((a) => (
                          <span
                            key={a}
                            className="text-[11px] bg-muted/60 text-foreground/80 px-2 py-0.5 rounded-full"
                          >
                            {a}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-end justify-between pt-3 border-t border-border/60">
                        <div>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">From</p>
                          <p className="text-xl font-bold text-foreground">
                            ₹{property.priceRange.min.toLocaleString()}
                            <span className="text-xs font-normal text-muted-foreground ml-1">
                              / {property.category === "budget" ? "person" : "night"}
                            </span>
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
});

PropertySelector.displayName = "PropertySelector";
export default PropertySelector;
