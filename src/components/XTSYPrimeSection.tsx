import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FocusRail, FocusRailItem } from "@/components/ui/focus-rail";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Mountain, PawPrint, Trophy, Heart, Laptop, Car, ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pushToDataLayer } from "@/utils/dataLayerService";

// XTSY Prime images (from existing pages)
import xtsy270Image from "@/assets/double-decker-bridge-new.jpg"; // Placeholder - will use actual 270 image
import petFriendlyHero from "@/assets/pet-friendly-hero.jpg";
import xtsyVsZostelHero from "@/assets/xtsy-vs-zostel-hero-new.jpg";
import femaleTravellersHero from "@/assets/female-travellers-hero.jpg";

// XTSY Prime offerings data - using imported images or verified Supabase URLs
const xtsyPrimeOfferings = [
  {
    id: "xtsy-270",
    title: "XTSY 270° Panorama Glass Suite",
    shortTitle: "XTSY 270°",
    description: "India's first panoramic glass house with 270° mountain views. Wake up to sunrises over the Himalayas in this architectural masterpiece.",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/270/IMG_9956.jpg",
    icon: Mountain,
    price: "₹7,999",
    priceNote: "weekday / ₹9,999 weekend",
    features: [
      "Floor-to-ceiling glass walls",
      "270° panoramic mountain views",
      "Queen bed ensuite accommodation",
      "Private bathroom with premium amenities",
      "Perfect for couples & proposals",
      "Sunrise & stargazing experience"
    ],
    category: "Luxury Stay",
    rating: 4.9,
    path: "/xtsy-270",
  },
  {
    id: "pet-friendly",
    title: "Pet Friendly Stays",
    shortTitle: "Pet Friendly",
    description: "India's first pet-friendly travellers hostel. Your furry companions are welcome here with dedicated pet amenities and care support.",
    image: petFriendlyHero,
    icon: PawPrint,
    price: "No Extra Charge",
    priceNote: "for pets",
    features: [
      "Pet-friendly accommodation",
      "Dedicated pet play areas",
      "Pet care essentials available",
      "Domestic & international pet travel support",
      "Nearby vet assistance",
      "Pet-safe environment"
    ],
    category: "Pet Travel",
    rating: 4.8,
    path: "/pet-friendly",
  },
  {
    id: "xtsy-vs-zostel",
    title: "XTSY vs Zostel",
    shortTitle: "Why XTSY?",
    description: "Zostel is a vibe, but your whole journey is a vibe with XTSY. We support large groups, families, educational tours, and cross-border adventures.",
    image: xtsyVsZostelHero,
    icon: Trophy,
    price: "Compare",
    priceNote: "and discover the difference",
    features: [
      "Large groups (6+ travelers) welcome",
      "Solo, couples, families supported",
      "32+ IIT/IIM educational tours",
      "8+ corporate tour experiences",
      "Cross-border country tours",
      "NEITA 2025 Award Nominated"
    ],
    category: "Comparison",
    rating: 5.0,
    path: "/xtsy-vs-zostel",
  },
  {
    id: "female-travellers",
    title: "Female Travellers",
    shortTitle: "Female Travellers",
    description: "Safe, empowering travel experiences for women. Women-only dormitories, secure spaces, and a supportive community.",
    image: femaleTravellersHero,
    icon: Heart,
    price: "₹599",
    priceNote: "per bed/night",
    features: [
      "Women-only dormitory rooms",
      "Secure lockers with keys",
      "Well-lit corridors & areas",
      "Female hygiene products available",
      "Private bathroom facilities",
      "Travel safety guidance"
    ],
    category: "Women Safety",
    rating: 4.9,
    path: "/female-travellers",
  },
  {
    id: "work-from-home",
    title: "Work From Home",
    shortTitle: "Remote Work",
    description: "Work remotely from the Himalayas. High-speed internet, co-working spaces, and mountain views for digital nomads.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    icon: Laptop,
    price: "₹5,400",
    priceNote: "per week",
    features: [
      "High-speed WiFi (100+ Mbps)",
      "Dedicated co-working space",
      "Ergonomic workstations",
      "Mountain view work desks",
      "Weekly & monthly packages",
      "Community of remote workers"
    ],
    category: "Digital Nomad",
    rating: 4.7,
    path: "/work-from-home",
  },
  {
    id: "xtsy-rentals",
    title: "XTSY Rentals",
    shortTitle: "Vehicle Rentals",
    description: "Explore Northeast India at your own pace. Premium cars and bikes for every adventure - from city drives to mountain expeditions.",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/Thar.jpg",
    icon: Car,
    price: "₹1,300",
    priceNote: "per day onwards",
    features: [
      "9 premium cars available",
      "4 Royal Enfield bikes",
      "Fully insured vehicles",
      "24/7 roadside support",
      "Flexible rental periods",
      "GPS & navigation included"
    ],
    category: "Vehicle Rental",
    rating: 4.8,
    path: "/xtsy-rentals",
  },
];

interface XTSYPrimeSectionProps {
  className?: string;
}

const XTSYPrimeSection: React.FC<XTSYPrimeSectionProps> = ({ className }) => {
  const [selectedOffering, setSelectedOffering] = useState<typeof xtsyPrimeOfferings[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const focusRailItems: FocusRailItem[] = useMemo(() => 
    xtsyPrimeOfferings.map(offering => ({
      id: offering.id,
      title: offering.shortTitle,
      description: offering.description,
      imageSrc: offering.image,
      meta: offering.category,
      price: offering.price,
      rating: offering.rating,
      category: offering.category,
    })),
    []
  );

  const handleOfferingClick = (item: FocusRailItem) => {
    const offering = xtsyPrimeOfferings.find(o => o.id === item.id);
    if (offering) {
      // Push analytics event
      pushToDataLayer({
        event: "xtsy_prime_viewed",
        component: "XTSYPrimeSection",
        funnel_stage: "discovery",
        offering_id: offering.id,
        offering_name: offering.title,
        offering_category: offering.category,
      });

      setSelectedOffering(offering);
      setIsModalOpen(true);
    }
  };

  const handlePropertyNavigate = (propertySlug: string) => {
    setIsModalOpen(false);
    requestAnimationFrame(() => {
      navigate(`/properties/${propertySlug}`);
    });
  };

  return (
    <section className={`relative py-8 md:py-12 bg-gradient-to-b from-background to-muted/30 ${className}`}>
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-amber-500/30">
            <Sparkles className="w-4 h-4" />
            Premium Experiences
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            XTSY <span className="text-primary">Prime</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Exclusive offerings that set us apart. From India's first glass suite to pet-friendly stays.
          </p>
        </motion.div>
      </div>

      {/* Focus Rail Carousel */}
      <FocusRail
        items={focusRailItems}
        autoPlay={true}
        interval={5000}
        loop={true}
        onItemClick={handleOfferingClick}
      />

      {/* Modal for XTSY Prime Offerings */}
      <AnimatePresence>
        {isModalOpen && selectedOffering && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-background border-border">
              {/* Hero Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedOffering.image}
                  alt={selectedOffering.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {selectedOffering.category}
                  </Badge>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <selectedOffering.icon className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                      {selectedOffering.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <DialogDescription className="text-base text-muted-foreground">
                    {selectedOffering.description}
                  </DialogDescription>
                </DialogHeader>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-primary">{selectedOffering.price}</span>
                  <span className="text-muted-foreground">{selectedOffering.priceNote}</span>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-foreground mb-3">What's Included</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedOffering.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                {/* Property Selection */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Book at</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Button
                      size="lg"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-3"
                      onClick={() => handlePropertyNavigate('xtsy-luxury')}
                    >
                      <Building2 className="w-5 h-5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-semibold">XTSY Experience</div>
                        <div className="text-xs opacity-80">Premium Glass Suite</div>
                      </div>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 border-border text-foreground bg-background hover:bg-muted justify-start gap-3"
                      onClick={() => handlePropertyNavigate('xtsy-travellers-hostel')}
                    >
                      <Building2 className="w-5 h-5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-semibold">XTSY Travellers Hostel</div>
                        <div className="text-xs text-muted-foreground">Dorms & Private Rooms</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* View Full Details */}
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full text-primary hover:text-primary/80"
                  onClick={() => {
                    setIsModalOpen(false);
                    requestAnimationFrame(() => {
                      navigate(selectedOffering.path);
                    });
                  }}
                >
                  View Full Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
};

export default XTSYPrimeSection;
