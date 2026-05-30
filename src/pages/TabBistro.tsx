import { memo } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TabBistroHero from "@/components/tab-bistro/TabBistroHero";
import TabBistroMenu from "@/components/tab-bistro/TabBistroMenu";
import TabBistroBreakfast from "@/components/tab-bistro/TabBistroBreakfast";
import TabBistroSpecials from "@/components/tab-bistro/TabBistroSpecials";
import TabBistroDining from "@/components/tab-bistro/TabBistroDining";
import TabBistroCatering from "@/components/tab-bistro/TabBistroCatering";
import TabBistroFAQ from "@/components/tab-bistro/TabBistroFAQ";
import TabBistroCTA from "@/components/tab-bistro/TabBistroCTA";

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'TAB Bistro by XTSY',
  description: 'Multi-cuisine forest dining restaurant in Shillong offering Indian, Continental, Chinese, and Northeast cuisine. Wedding catering & event services.',
  url: 'https://xtsy.one/tab-bistro',
  telephone: '+918837317070',
  servesCuisine: ['Indian', 'Continental', 'Chinese', 'Northeast Indian', 'Breakfast', 'Cafe'],
  priceRange: '₹₹',
  acceptsReservations: 'True',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Shillong',
    addressRegion: 'Meghalaya',
    addressCountry: 'IN',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '08:00', closes: '22:00' },
  ],
  hasMenu: 'https://xtsy.one/tab-bistro',
};

const TabBistro = memo(() => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="TAB Bistro — Breakfast, Rooftop Dining & Catering Shillong"
      description="TAB Bistro by XTSY — breakfast places in Shillong, rooftop café & multi-cuisine dining in the pine forests. Forest BBQ, wedding catering & events. Open 8 AM daily."
      keywords="breakfast places in shillong, rooftop restaurants in shillong, rooftop cafe in shillong, cafe shillong, best restaurant shillong, restaurant in shillong, dining shillong, wedding catering shillong, forest dining, TAB Bistro"
      canonicalUrl="https://xtsy.one/tab-bistro"
    />
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(restaurantSchema)}</script>
    </Helmet>
    <Header />
    <TabBistroHero />

    <main className="max-w-5xl mx-auto px-4 sm:px-8 pb-20 space-y-20">
      <TabBistroMenu />
      <TabBistroSpecials />
      <TabBistroBreakfast />
      <TabBistroDining />
      <TabBistroCatering />
      <TabBistroFAQ />
      <TabBistroCTA />
    </main>

    <Footer />
  </div>
));

TabBistro.displayName = "TabBistro";
export default TabBistro;
