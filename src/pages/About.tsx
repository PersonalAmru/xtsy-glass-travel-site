import { useEffect } from "react";
import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import AboutXTSYSection from "@/components/AboutXTSYSection";
import ExploreNortheastSection from "@/components/ExploreNortheastSection";
import Footer from "@/components/Footer";
import SEOContent from "@/components/SEOContent";
import SEOHead from "@/components/SEOHead";

const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About XTSY — India's Fastest-Growing Travel & Hospitality Brand"
        description="Learn about XTSY Travellers Hostel & Luxury in Shillong, Meghalaya. NEITA 2025 nominated, 270° Glass Suite, Northeast India's biggest hostel. Powered by XTSY One LLP."
        keywords="XTSY about, XTSY hostel, Shillong hostel, Northeast India travel, NEITA 2025"
        canonicalUrl="https://xtsy.one/about"
      />
      <SEOContent page="about" />
      <Header />
      <main>
        <AboutSection />
        <AboutXTSYSection />
        <ExploreNortheastSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
