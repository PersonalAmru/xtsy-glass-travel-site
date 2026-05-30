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
import TabBistroReviews from "@/components/tab-bistro/TabBistroReviews";
import TabBistroFAQ from "@/components/tab-bistro/TabBistroFAQ";
import TabBistroFaqHub from "@/components/tab-bistro/TabBistroFaqHub";
import TabBistroCTA from "@/components/tab-bistro/TabBistroCTA";
import { useRestaurantReviews } from "@/hooks/useRestaurantReviews";
import { buildRestaurantSchema, buildMenuSchema } from "@/data/tabBistroSchema";

const TabBistro = memo(() => {
  const { reviews, stats, submitReview, refetch } = useRestaurantReviews();

  const restaurantSchema = buildRestaurantSchema({
    ratingValue: stats.average || undefined,
    reviewCount: stats.count || undefined,
    reviews: reviews.map((r) => ({
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      date: r.isoDate.slice(0, 10),
    })),
  });

  const menuSchema = buildMenuSchema();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TAB Bistro Shillong — Multi-Cuisine Restaurant, Catering & Café"
        description="TAB Bistro by XTSY — best multi-cuisine restaurant in Shillong. North Indian, Chinese, Thai, Continental, Italian & seafood, breakfast, rooftop café, wedding catering & bulk orders. Open 9 AM–10:30 PM."
        keywords="restaurant in shillong, best restaurant shillong, multi cuisine restaurant shillong, food in shillong, food delivery shillong, online food order shillong, chinese food shillong, north indian restaurant shillong, thai food shillong, continental food shillong, italian restaurant shillong, pizza in shillong, breakfast places in shillong, rooftop restaurants in shillong, rooftop cafe in shillong, cafe shillong, dining shillong, wedding catering shillong, event catering shillong, corporate catering shillong, bulk food order shillong, party order shillong, forest dining, TAB Bistro"
        canonicalUrl="https://xtsy.one/tab-bistro"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(restaurantSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(menuSchema)}</script>
      </Helmet>
      <Header />
      <TabBistroHero />

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pb-20 space-y-20">
        <TabBistroMenu />
        <TabBistroSpecials />
        <TabBistroBreakfast />
        <TabBistroDining />
        <TabBistroCatering />
        <TabBistroReviews
          reviews={reviews}
          stats={stats}
          submitReview={submitReview}
          onSubmitted={refetch}
        />
        <TabBistroFAQ />
        <TabBistroFaqHub />
        <TabBistroCTA />
      </main>

      <Footer />
    </div>
  );
});

TabBistro.displayName = "TabBistro";
export default TabBistro;
