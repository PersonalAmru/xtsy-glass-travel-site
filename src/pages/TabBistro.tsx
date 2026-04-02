import { memo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, Flame, GlassWater, Cake, Heart, Users, 
  PartyPopper, Building2, Star, ChefHat, Salad, Wine,
  Coffee, IceCream, Sparkles, TreePine, Sunset, Globe
} from "lucide-react";

const HERO_IMG = "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/TAB%20Bistro/TAB%20BISTRO.jpeg";
const SECONDARY_IMG = "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/TAB%20Bistro/IMG_9274.jpeg";

const cuisines = [
  { name: "Indian", icon: "🍛" },
  { name: "North Indian", icon: "🫓" },
  { name: "Vegetarian", icon: "🥗" },
  { name: "Chinese", icon: "🥢" },
  { name: "Indo-Chinese", icon: "🍜" },
  { name: "Afghani", icon: "🫔" },
  { name: "Mughlai", icon: "🍗" },
  { name: "Tandoori", icon: "🔥" },
  { name: "BBQ", icon: "🥩" },
  { name: "Continental", icon: "🍝" },
  { name: "Italian", icon: "🍕" },
  { name: "American", icon: "🍔" },
  { name: "Japanese", icon: "🍱" },
  { name: "Korean", icon: "🥘" },
  { name: "Seafood", icon: "🦐" },
];

const desserts = [
  "Traditional Indian Sweets",
  "Signature Dessert Platters",
  "Chocolate Desserts",
  "Ice Creams",
  "Pastries & Cakes",
];

const beverages = [
  { name: "Mocktails", icon: <GlassWater className="w-5 h-5" /> },
  { name: "Fresh Juices", icon: <Salad className="w-5 h-5" /> },
  { name: "Cold Beverages", icon: <IceCream className="w-5 h-5" /> },
  { name: "Coffee", icon: <Coffee className="w-5 h-5" /> },
  { name: "Speciality Teas", icon: <Wine className="w-5 h-5" /> },
];

const diningExperiences = [
  {
    title: "Pine Forest BBQ Nights",
    desc: "Open-fire BBQ dining surrounded by pine forests.",
    icon: <Flame className="w-6 h-6" />,
  },
  {
    title: "Romantic Forest Dinner",
    desc: "Private candlelight dinner in a serene forest setting.",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    title: "Rooftop Dining",
    desc: "Sunset rooftop dining with panoramic views and curated menus.",
    icon: <Sunset className="w-6 h-6" />,
    badge: "Upcoming",
  },
  {
    title: "Traveller's Feast",
    desc: "Multi-cuisine dining experience designed for travellers exploring North East India.",
    icon: <Globe className="w-6 h-6" />,
  },
];

const cateringServices = [
  "Wedding Catering",
  "Destination Wedding Dining",
  "Event Catering",
  "Corporate Catering",
  "Private Parties",
  "Birthday Celebrations",
  "Group Dining",
  "Bulk Food Orders",
];

const weddingOfferings = [
  "Custom Wedding Menus",
  "Live BBQ Stations",
  "Multi-Cuisine Buffet",
  "Dessert Counters",
  "Mocktail Bars",
  "Outdoor Dining Setups",
];

const TabBistro = memo(() => {
  const whatsappBase = "https://wa.me/918837317070?text=";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TAB Bistro by XTSY — Multi-Cuisine Forest Dining in Shillong"
        description="Multi-cuisine forest dining experience offering global flavours, handcrafted beverages, desserts, and curated culinary experiences in Shillong. Wedding catering & events."
        keywords="restaurant Shillong, multi-cuisine dining, wedding catering Meghalaya, TAB Bistro, XTSY dining, forest dining"
        canonicalUrl="https://xtsy.one/tab-bistro"
      />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={HERO_IMG}
          alt="TAB Bistro by XTSY — forest dining in Shillong"
          className="w-full h-auto block"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-4 sm:px-8 max-w-6xl mx-auto">
          <span className="inline-flex items-center gap-2 text-amber-400 font-medium text-sm tracking-widest uppercase mb-3">
            <UtensilsCrossed className="w-4 h-4" /> Forest Dining Experience
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-playfair leading-tight">
            TAB Bistro <span className="text-amber-400">by XTSY</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed">
            A multi-cuisine forest dining experience offering global flavours, handcrafted beverages, desserts, and curated culinary experiences in the pine forests of Shillong.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              onClick={() => window.open(`${whatsappBase}Hi, I'd like to reserve a table at TAB Bistro.`, "_blank")}
            >
              Reserve Table
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => {
                document.getElementById("catering")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Catering & Events
            </Button>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-24">
        {/* Cuisine Highlights */}
        <section>
          <SectionHeader icon={<ChefHat />} title="Global Cuisines" subtitle="From tandoori flame to Japanese finesse — 15 cuisines crafted in the mountains." />
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-8">
            {cuisines.map((c) => (
              <div
                key={c.name}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-amber-500/40 transition-colors"
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs sm:text-sm text-foreground font-medium text-center">{c.name}</span>
              </div>
            ))}
          </div>
        </section>


        {/* Desserts */}
        <section>
          <SectionHeader icon={<Cake />} title="Sweets & Desserts" subtitle="Handcrafted sweets, classic desserts, and rich indulgent treats perfect after a mountain meal." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
            {desserts.map((d) => (
              <div key={d} className="p-4 rounded-xl bg-card border border-border text-center">
                <IceCream className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                <span className="text-sm text-foreground">{d}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Beverages */}
        <section>
          <SectionHeader icon={<GlassWater />} title="Mocktails & Beverages" subtitle="Refreshing handcrafted mocktails and beverages designed to complement the mountain dining experience." />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8">
            {beverages.map((b) => (
              <div key={b.name} className="flex flex-col items-center gap-2 p-5 rounded-xl bg-card border border-border">
                <span className="text-amber-400">{b.icon}</span>
                <span className="text-sm text-foreground font-medium">{b.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Dining Experiences */}
        <section>
          <SectionHeader icon={<TreePine />} title="Dining Experiences" subtitle="Curated culinary moments set against nature." />
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {diningExperiences.map((exp) => (
              <div key={exp.title} className="relative p-6 rounded-2xl bg-card border border-border hover:border-amber-500/40 transition-colors">
                {exp.badge && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                    {exp.badge}
                  </span>
                )}
                <span className="text-amber-400 mb-3 block">{exp.icon}</span>
                <h3 className="text-lg font-semibold text-foreground mb-1">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">{exp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Catering, Weddings & Events */}
        <section id="catering">
          <SectionHeader
            icon={<PartyPopper />}
            title="Catering, Weddings & Events"
            subtitle="TAB Bistro offers large-scale catering and dining services for weddings, celebrations, and corporate gatherings across Shillong and Meghalaya."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {cateringServices.map((s) => (
              <div key={s} className="flex items-center gap-2 p-4 rounded-xl bg-card border border-border">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-foreground">{s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Wedding Dining */}
        <section>
          <SectionHeader icon={<Heart />} title="Wedding Dining by XTSY" subtitle="Create unforgettable wedding feasts with custom menus, live stations, and outdoor setups." />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
            {weddingOfferings.map((w) => (
              <div key={w} className="flex items-center gap-2 p-4 rounded-xl bg-card border border-border">
                <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-foreground">{w}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-900/10 border border-amber-500/20 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 font-playfair">
            Ready to Experience TAB Bistro?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Whether it's a romantic dinner for two or a grand wedding feast — we bring the mountain flavour to every plate.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              onClick={() => window.open(`${whatsappBase}Hi, I'd like to reserve a table at TAB Bistro.`, "_blank")}
            >
              Reserve Table
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              onClick={() => window.open(`${whatsappBase}Hi, I'd like to enquire about wedding catering by TAB Bistro.`, "_blank")}
            >
              Book Wedding Catering
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-accent"
              onClick={() => window.open(`${whatsappBase}Hi, I'd like to plan an event with TAB Bistro catering.`, "_blank")}
            >
              Plan an Event
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-accent"
              onClick={() => window.open(`${whatsappBase}Hi, I'd like to enquire about catering services by TAB Bistro.`, "_blank")}
            >
              Catering Enquiry
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
});

TabBistro.displayName = "TabBistro";

/* Shared section header */
const SectionHeader = memo(({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <div>
    <div className="flex items-center gap-2 text-amber-400 mb-2">
      {icon}
      <span className="text-xs uppercase tracking-widest font-semibold">{title}</span>
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">{title}</h2>
    <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
  </div>
));

SectionHeader.displayName = "SectionHeader";

export default TabBistro;
