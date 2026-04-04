import { memo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TabBistroHero from "@/components/tab-bistro/TabBistroHero";
import TabBistroMenu from "@/components/tab-bistro/TabBistroMenu";
import TabBistroDining from "@/components/tab-bistro/TabBistroDining";
import TabBistroCatering from "@/components/tab-bistro/TabBistroCatering";
import TabBistroCTA from "@/components/tab-bistro/TabBistroCTA";

const TabBistro = memo(() => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="TAB Bistro by XTSY — Multi-Cuisine Forest Dining in Shillong"
      description="Multi-cuisine forest dining experience offering global flavours, handcrafted beverages, desserts, and curated culinary experiences in Shillong. Wedding catering & events."
      keywords="restaurant Shillong, multi-cuisine dining, wedding catering Meghalaya, TAB Bistro, XTSY dining, forest dining"
      canonicalUrl="https://xtsy.one/tab-bistro"
    />
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
