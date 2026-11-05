import { memo } from "react";
import { Helmet } from '@/lib/seo/helmet';
import SEOHead, { getSEOConfig } from "@/components/SEOHead";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";
import SiteHeader from "@/components/v2/SiteHeader";
import SiteFooter from "@/components/v2/SiteFooter";
import CtaBand from "@/components/v2/CtaBand";
import HomeHero from "@/components/v2/home/HomeHero";
import {
  LastMinuteBar, StatsStrip, PromiseMarquee, Trending, Stays, CampsiteBanner, StateExplorer,
  PrimeRail, GlampFeature, BistroFeature, ToursRow, TonightDeals, ExpeditionsBanner, Reviews,
  HomeFaq, SeoLinks, HOME_FAQS,
} from "@/components/v2/home/HomeSections";

const Index = memo(() => {
  // Track scroll depth milestones (25%, 50%, 75%, 100%)
  useScrollDepthTracking({ pageId: 'homepage' });
  
  const seoConfig = getSEOConfig('home');

  const homeFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <SEOHead structuredDataOnly 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalUrl="https://xtsy.one/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(hostelSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(homeFaqSchema)}</script>
      </Helmet>
      
      <div className="xt min-h-screen">
        <SiteHeader />
        <LastMinuteBar />
        <main>
          <HomeHero />
          <StatsStrip />
          <PromiseMarquee />
          <Trending />
          <Stays />
          <CampsiteBanner />
          <StateExplorer />
          <PrimeRail />
          <GlampFeature />
          <BistroFeature />
          <ToursRow />
          <TonightDeals />
          <ExpeditionsBanner />
          <Reviews />
          <HomeFaq />
          <SeoLinks />
          <CtaBand />
        </main>
        <SiteFooter />
      </div>
    </>
  );
});

Index.displayName = 'Index';

export default Index;
