
import { useEffect } from "react";
import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import SEOContent from "@/components/SEOContent";

const About = () => {
  useEffect(() => {
    // Scroll to about section after header when navigating to /about
    setTimeout(() => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const headerHeight = 80; // Adjust based on your header height
        const targetPosition = aboutSection.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOContent page="about" />
      <Header />
      <div className="pt-20"> {/* Add padding to account for fixed header */}
        <AboutSection />
      </div>
      <Footer />
    </div>
  );
};

export default About;
