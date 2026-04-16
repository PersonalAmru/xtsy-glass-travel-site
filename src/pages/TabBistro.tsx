import { memo } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TabBistroHero from "@/components/tab-bistro/TabBistroHero";
import TabBistroMenu from "@/components/tab-bistro/TabBistroMenu";
import TabBistroDining from "@/components/tab-bistro/TabBistroDining";
import TabBistroCatering from "@/components/tab-bistro/TabBistroCatering";
import TabBistroCTA from "@/components/tab-bistro/TabBistroCTA";

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'TAB Bistro by XTSY',
  description: 'Multi-cuisine forest dining restaurant in Shillong offering Indian, Continental, Chinese, and Northeast cuisine. Wedding catering & event services.',
  url: 'https://xtsy.one/tab-bistro',
  telephone: '+918837317070',
  servesCuisine: ['Indian', 'Continental', 'Chinese', 'Northeast Indian'],
  priceRange: '₹₹',
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
      title="TAB Bistro — Best Restaurant in Shillong | Multi-Cuisine Dining & Catering"
      description="TAB Bistro by XTSY — best restaurant in Shillong for multi-cuisine dining, forest BBQ, wedding catering, and private events. Indian, Continental, Chinese & Northeast cuisine."
      keywords="restaurant in Shillong, best restaurant Shillong, cafe Shillong, dining Shillong, wedding catering Shillong, event catering Meghalaya, multi-cuisine Shillong, forest dining, TAB Bistro"
      canonicalUrl="https://xtsy.one/tab-bistro"
    />
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(restaurantSchema)}</script>
    </Helmet>
    <Header />
    <TabBistroHero />

    <main className="max-w-5xl mx-auto px-4 sm:px-8 pb-20 space-y-20">
      <TabBistroMenu />
      <TabBistroDining />
      <TabBistroCatering />
      <TabBistroCTA />
    </main>

    <Footer />
  </div>
));

TabBistro.displayName = "TabBistro";
export default TabBistro;
