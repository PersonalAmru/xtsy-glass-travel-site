import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogSection from "@/components/BlogSection";
import SEOHead, { getSEOConfig } from "@/components/SEOHead";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Discover Meghalaya — Destinations & Travel Stories | XTSY"
        description="Explore Meghalaya's hidden gems: Living Root Bridges, Nohkalikai Falls, Dawki River, Mawlynnong village and more. Travel stories curated by XTSY."
        keywords="Meghalaya destinations, Northeast India travel blog, Living Root Bridges, Shillong, Cherrapunji"
        canonicalUrl="https://xtsy.one/blog"
      />
      <Header />
      <main className="pt-4">
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
