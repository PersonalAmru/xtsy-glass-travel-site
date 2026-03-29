import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead, { getSEOConfig } from "@/components/SEOHead";
import SEOContent from "@/components/SEOContent";
import { Link } from "react-router-dom";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";

const destinations = [
  {
    id: "living-root-bridges",
    title: "Living Root Bridges, Nongriat",
    description: "The Double Decker Living Root Bridge is a UNESCO World Heritage nominee grown over centuries by Khasi tribes from rubber tree roots. The 3,500-step trek through lush jungle to Nongriat village is a rite of passage for every Meghalaya traveller. Swimming in the natural rock pools below the bridge is an unforgettable experience.",
    distance: "80 km from Shillong",
    bestTime: "October – March",
    rating: "4.9",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/destinations/living-root-bridge.jpg",
    keywords: "living root bridge Meghalaya, double decker bridge Nongriat, UNESCO Meghalaya",
    tourLink: "/travel",
  },
  {
    id: "nohkalikai-falls",
    title: "Nohkalikai Falls, Cherrapunji",
    description: "India's tallest plunge waterfall at 1,115 feet drops into a stunning turquoise pool surrounded by dramatic cliffs. Located near Cherrapunji (Sohra), the wettest place on earth, the falls are most spectacular during monsoon. The viewpoint offers one of the most photographed panoramas in Northeast India.",
    distance: "56 km from Shillong",
    bestTime: "June – September (peak flow)",
    rating: "4.8",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/destinations/nohkalikai-falls.jpg",
    keywords: "Nohkalikai Falls, tallest waterfall India, Cherrapunji waterfall",
    tourLink: "/travel",
  },
  {
    id: "dawki-umngot-river",
    title: "Dawki & Umngot River",
    description: "The Umngot River in Dawki has the clearest water in Asia — so transparent that boats appear to float in mid-air. Located on the India-Bangladesh border, Dawki is a gateway to surreal beauty. Boating on the crystal-clear river, especially between November and March, is a bucket-list experience.",
    distance: "96 km from Shillong",
    bestTime: "November – March",
    rating: "4.9",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/destinations/dawki-river.jpg",
    keywords: "Dawki river, clearest river India, Umngot river boat ride, Dawki Meghalaya",
    tourLink: "/travel",
  },
  {
    id: "mawlynnong",
    title: "Mawlynnong — Asia's Cleanest Village",
    description: "Awarded 'Asia's Cleanest Village' by Discover India magazine, Mawlynnong is a living example of community sustainability. Bamboo dustbins, stone pathways, and flower-filled gardens create a postcard-perfect village. The sky walk platform offers stunning views of the Bangladesh plains.",
    distance: "92 km from Shillong",
    bestTime: "October – May",
    rating: "4.7",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/destinations/mawlynnong.jpg",
    keywords: "Mawlynnong village, cleanest village Asia, Meghalaya clean village",
    tourLink: "/travel",
  },
  {
    id: "laitlum-canyons",
    title: "Laitlum Canyons",
    description: "Known as 'The End of Hills' in Khasi language, Laitlum offers some of the most dramatic canyon views in India. Standing at the edge, you watch clouds roll through vast valleys dotted with tiny tribal hamlets. The 45-minute drive from Shillong makes it the perfect half-day excursion.",
    distance: "23 km from Shillong",
    bestTime: "October – April",
    rating: "4.8",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/destinations/laitlum.jpg",
    keywords: "Laitlum Canyons, end of hills, Shillong viewpoint, canyon trek Meghalaya",
    tourLink: "/travel",
  },
  {
    id: "mawsmai-cave",
    title: "Mawsmai Cave, Cherrapunji",
    description: "This 150-metre limestone cave in Cherrapunji is filled with ancient stalactites and stalagmites formed over millions of years. Narrow passages, dripping water, and dim natural light create a thrilling underground adventure. It's one of the most accessible caves in Meghalaya and family-friendly.",
    distance: "58 km from Shillong",
    bestTime: "Year-round",
    rating: "4.5",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/destinations/mawsmai-cave.jpg",
    keywords: "Mawsmai Cave, Cherrapunji cave, caving Meghalaya, limestone cave India",
    tourLink: "/travel",
  },
  {
    id: "umiam-lake",
    title: "Umiam Lake (Barapani)",
    description: "This sprawling reservoir surrounded by pine-covered hills is the first landmark you see driving from Guwahati to Shillong. Perfect for sunset photography, kayaking, and lakeside picnics. The Orchid Lake Resort side offers panoramic views of the emerald green water stretching to the horizon.",
    distance: "15 km from Shillong",
    bestTime: "Year-round",
    rating: "4.6",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/destinations/umiam-lake.jpg",
    keywords: "Umiam Lake, Barapani, Shillong lake, kayaking Meghalaya",
    tourLink: "/travel",
  },
  {
    id: "elephant-falls",
    title: "Elephant Falls, Shillong",
    description: "Located just 12 km from Shillong city, this beautiful three-tier waterfall is the most accessible attraction in Meghalaya. Named after an elephant-shaped rock (destroyed in the 1897 earthquake), it's surrounded by lush ferns and moss. The steps lead you to each tier for unique perspectives.",
    distance: "12 km from Shillong",
    bestTime: "Year-round",
    rating: "4.4",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/destinations/elephant-falls.jpg",
    keywords: "Elephant Falls Shillong, waterfall near Shillong, easy trek Meghalaya",
    tourLink: "/travel",
  },
  {
    id: "mawphlang-sacred-forest",
    title: "Mawphlang Sacred Forest",
    description: "Protected by the Khasi people for over 800 years, not a single leaf or stone has been removed from this sacred grove. Ancient monoliths, rare medicinal plants, and an eerie stillness make this a deeply spiritual experience. Guided walks reveal the cultural significance of every tree and stone.",
    distance: "25 km from Shillong",
    bestTime: "October – April",
    rating: "4.7",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/destinations/sacred-forest.jpg",
    keywords: "Mawphlang sacred forest, sacred grove Meghalaya, ancient forest Shillong",
    tourLink: "/travel",
  },
  {
    id: "cherrapunji",
    title: "Cherrapunji (Sohra) — Wettest Place on Earth",
    description: "Cherrapunji (locally known as Sohra) holds the world record for most rainfall in a calendar month. Beyond the rain, it offers Seven Sisters Falls, Nohsngithiang Falls, Eco Park with canyon views, and access to Nongriat's living root bridges. A 2–3 day stay is ideal to explore all attractions.",
    distance: "54 km from Shillong",
    bestTime: "October – May (dry), June–Sep (rain experience)",
    rating: "4.8",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/destinations/cherrapunji.jpg",
    keywords: "Cherrapunji, Sohra, wettest place earth, Seven Sisters Falls, Meghalaya tourism",
    tourLink: "/travel",
  },
];

const Destinations = () => {
  const seo = getSEOConfig('destinations');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonicalUrl="https://xtsy.one/destinations"
      />
      <SEOContent page="destinations" />
      <Header />

      <main className="pt-4 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Breadcrumbs items={[{ label: "Destinations" }]} />

          {/* Hero Section */}
          <section className="text-center mb-12 mt-6">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <MapPin className="w-3 h-3 mr-1" />
              Meghalaya Travel Guide
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Top 10 Places to Visit in Meghalaya
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              From living root bridges to the clearest rivers in Asia — your complete guide to exploring the Abode of Clouds. All destinations accessible from{" "}
              <Link to="/" className="text-primary hover:underline">XTSY Shillong</Link>.
            </p>
          </section>

          {/* How to Reach */}
          <section className="mb-12 p-6 rounded-xl border border-border/50 bg-card/50">
            <h2 className="text-xl font-bold text-foreground mb-3">How to Reach Shillong</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-1">✈️ By Air</p>
                <p>Fly to Guwahati (GAU). Shillong is 2.5 hours by road. XTSY arranges airport transfers.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">🚂 By Train</p>
                <p>Guwahati Railway Station is the nearest major railhead. Shared taxis to Shillong run hourly.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">🚌 By Road</p>
                <p>ISBT Guwahati has buses every 30 mins. NH6 offers scenic views through Ri-Bhoi district.</p>
              </div>
            </div>
          </section>

          {/* Destinations Grid */}
          <div className="space-y-8">
            {destinations.map((dest, index) => (
              <article
                key={dest.id}
                id={dest.id}
                className="group border border-border/50 rounded-xl overflow-hidden bg-card/50 hover:border-primary/30 transition-all"
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs text-primary font-semibold tracking-wider">
                        #{index + 1}
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground mt-1">
                        {dest.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-yellow-500 flex-shrink-0">
                      <Star className="w-4 h-4 fill-current" />
                      {dest.rating}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
                    {dest.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {dest.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      Best: {dest.bestTime}
                    </span>
                    <Link
                      to={dest.tourLink}
                      className="ml-auto flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      Book a tour <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <section className="mt-16 text-center p-8 rounded-xl border border-primary/20 bg-primary/5">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Stay at XTSY & Explore All Destinations
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              XTSY Travellers Hostel in Shillong is your base camp for all Meghalaya adventures. Dorms from ₹450, private rooms from ₹2,500.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/booking">Book Your Stay</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/travel">View Tour Packages</Link>
              </Button>
            </div>
          </section>

          {/* NAP Section for Local SEO */}
          <section className="mt-12 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">XTSY Travellers Hostel</p>
            <p>Laitumkhrah, Shillong, Meghalaya 793003, India</p>
            <p>
              Phone: <a href="tel:+918837317070" className="text-primary">+91 8837317070</a> |
              Email: <a href="mailto:admin@xtsy.one" className="text-primary">admin@xtsy.one</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Destinations;
