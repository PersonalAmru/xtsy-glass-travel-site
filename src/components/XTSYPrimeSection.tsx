import React, { useState, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { FocusRail, FocusRailItem } from "@/components/ui/focus-rail";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mountain, PawPrint, Trophy, Heart, Laptop, Car, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pushToDataLayer } from "@/utils/dataLayerService";

// Use URL references instead of eager imports to reduce chunk size
const imgUrl = (path: string) => new URL(`../assets/${path}`, import.meta.url).href;

// Lazy load the modal since it's rarely shown
const XTSYPrimeModal = lazy(() => import("@/components/XTSYPrimeModal"));

// XTSY Prime offerings data - using imported images or verified Supabase URLs
const xtsyPrimeOfferings = [
  {
    id: "xtsy-270",
    title: "XTSY Experience",
    shortTitle: "XTSY Experience",
    description: "India's first panoramic glass house with 270° mountain views. Wake up to sunrises over the Himalayas in this architectural masterpiece.",
    image: imgUrl("xtsy-270-stargazing.jpeg"),
    icon: Mountain,
    price: "₹4,999",
    originalPrice: "₹11,999",
    priceNote: "per night (incl. taxes)",
    features: [
      "Floor-to-ceiling glass walls",
      "270° panoramic mountain views",
      "Queen bed ensuite accommodation",
      "Private bathroom with premium amenities",
      "Perfect for couples & proposals",
      "Sunrise & stargazing experience"
    ],
    category: "Xperiential + Romantic Getaway",
    rating: 4.9,
    path: "/xtsy-270",
  },
  {
    id: "pet-friendly",
    title: "Pet Friendly Stays",
    shortTitle: "Pet Friendly",
    description: "India's first pet-friendly travellers hostel. Your furry companions are welcome here with dedicated pet amenities and care support.",
    image: imgUrl("pet-friendly-hero.jpg"),
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
    image: imgUrl("xtsy-vs-zostel-hero-new.jpg"),
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
    image: imgUrl("female-travellers-hero.jpg"),
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
      originalPrice: (offering as any).originalPrice,
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

      {/* Lazy-loaded modal */}
      {isModalOpen && selectedOffering && (
        <Suspense fallback={null}>
          <XTSYPrimeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            offering={selectedOffering}
          />
        </Suspense>
      )}
    </section>
  );
};

export default XTSYPrimeSection;
