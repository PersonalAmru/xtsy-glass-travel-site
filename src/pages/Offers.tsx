import React, { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Heart, User, Users, Building2, GraduationCap, Map, Sparkles,
  ArrowRight, Moon, UtensilsCrossed, Home, Bike, BadgePercent, CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

interface OfferCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  offers: { text: string; detail?: string }[];
  conditions: string[];
  cta: string;
  ctaLink: string;
}

const offers: OfferCard[] = [
  {
    id: "female",
    title: "For Her — Solo Female Traveller",
    subtitle: "Safe. Curated. Rewarding.",
    icon: Sparkles,
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    iconBg: "bg-rose-500/20 text-rose-400",
    offers: [
      { text: "Book 2 Nights, Get 1 Night FREE", detail: "Stay longer, pay less" },
      { text: "25% OFF on Food & Dining", detail: "TAB Bistro in-house meals" },
    ],
    conditions: ["Min 2-night booking", "Valid on direct bookings only"],
    cta: "Book Now",
    ctaLink: "/book",
  },
  {
    id: "male",
    title: "For Him — Solo Male Traveller",
    subtitle: "Explore more. Spend smart.",
    icon: User,
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    iconBg: "bg-blue-500/20 text-blue-400",
    offers: [
      { text: "25% OFF on Food & Dining", detail: "TAB Bistro in-house meals" },
      { text: "25% OFF on any XTSY Stay", detail: "From current listed price" },
    ],
    conditions: ["Min 2-night booking", "Choose one offer per booking"],
    cta: "Book Now",
    ctaLink: "/book",
  },
  {
    id: "couple",
    title: "Couple Getaway",
    subtitle: "Romance meets adventure.",
    icon: Heart,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconBg: "bg-amber-500/20 text-amber-400",
    offers: [
      { text: "15% OFF on Stay", detail: "All XTSY properties" },
      { text: "15% OFF on Travel Packages", detail: "XTSY curated tours" },
    ],
    conditions: ["Valid for couple bookings", "Combinable with XTSY 270"],
    cta: "Plan Your Escape",
    ctaLink: "/xtsy-270",
  },
  {
    id: "group",
    title: "Group of 4–6 Travellers",
    subtitle: "More friends. More savings.",
    icon: Users,
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    offers: [
      { text: "20% OFF on Food & Dining", detail: "Group meals at TAB Bistro" },
    ],
    conditions: ["Min 3-night booking", "Group of 4–6 guests required"],
    cta: "Book for Group",
    ctaLink: "/book",
  },
  {
    id: "b2b",
    title: "Tour Operator — B2B",
    subtitle: "GST-registered partners welcome.",
    icon: Building2,
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    iconBg: "bg-violet-500/20 text-violet-400",
    offers: [
      { text: "20% OFF on Stay + Food", detail: "For bookings > 3 nights" },
      { text: "10% OFF on Stay + Food", detail: "For bookings ≤ 3 nights" },
    ],
    conditions: ["Valid GST registration required", "B2B invoice provided"],
    cta: "Partner With Us",
    ctaLink: "/book",
  },
  {
    id: "institution",
    title: "Institution / Excursion",
    subtitle: "Schools, colleges & corporate groups.",
    icon: GraduationCap,
    gradient: "from-cyan-500/20 via-sky-500/10 to-transparent",
    iconBg: "bg-cyan-500/20 text-cyan-400",
    offers: [
      { text: "Flat 15% OFF on Stay + Food", detail: "All XTSY properties" },
    ],
    conditions: ["Institution letterhead required", "Min 10 guests recommended"],
    cta: "Enquire Now",
    ctaLink: "/book",
  },
  {
    id: "tour-package",
    title: "XTSY Exclusive Tour Packages",
    subtitle: "Curated NE India experiences.",
    icon: Map,
    gradient: "from-orange-500/20 via-red-500/10 to-transparent",
    iconBg: "bg-orange-500/20 text-orange-400",
    offers: [
      { text: "Flat 10% OFF on Tour Packages", detail: "All XTSY exclusive packages" },
    ],
    conditions: ["Valid on /travel page packages", "Cannot combine with other offers"],
    cta: "Explore Packages",
    ctaLink: "/travel",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const OfferCardComponent = memo(({ offer }: { offer: OfferCard }) => {
  const Icon = offer.icon;
  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl border border-white/[0.06] bg-card/80 overflow-hidden hover:border-primary/30 transition-colors duration-300"
    >
      {/* Gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-60 pointer-events-none`} />

      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className={`p-3 rounded-xl ${offer.iconBg} shrink-0`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground leading-tight">{offer.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{offer.subtitle}</p>
          </div>
        </div>

        {/* Offers */}
        <div className="space-y-3 mb-5 flex-1">
          {offer.offers.map((o, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/[0.03] rounded-xl p-3">
              <BadgePercent className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">{o.text}</p>
                {o.detail && <p className="text-xs text-muted-foreground mt-0.5">{o.detail}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Conditions */}
        <div className="space-y-1.5 mb-5">
          {offer.conditions.map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/70 shrink-0" />
              {c}
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          to={offer.ctaLink}
          className="mt-auto inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm py-3 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
        >
          {offer.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
});

OfferCardComponent.displayName = "OfferCardComponent";

const Offers = () => {
  return (
    <>
      <Helmet>
        <title>Exclusive Offers & Discounts | XTSY — Premium Stays in Northeast India</title>
        <meta name="description" content="Unlock exclusive XTSY offers — solo traveller deals, couple getaways, group discounts, B2B tour operator rates, and more across Northeast India." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-20 pb-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-4">
                <Sparkles className="h-4 w-4" /> Exclusive Offers
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Deals That Match<br className="hidden sm:block" /> Your Travel Style
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
                Whether you're a solo explorer, a couple, a group, or a tour operator — 
                there's an XTSY offer crafted just for you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Offer Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {offers.map((offer) => (
              <OfferCardComponent key={offer.id} offer={offer} />
            ))}
          </motion.div>
        </section>

        {/* Terms note */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
          <div className="rounded-2xl border border-white/[0.06] bg-card/60 p-6 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              All offers are valid on direct bookings via XTSY only. Offers cannot be combined unless explicitly stated. 
              Management reserves the right to modify or withdraw offers without prior notice. 
              B2B and institutional offers require valid documentation. Prices are inclusive of applicable taxes unless stated otherwise.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Offers;
