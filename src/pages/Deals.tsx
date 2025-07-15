
import { useEffect } from "react";
import Header from "@/components/Header";
import DealsSection from "@/components/DealsSection";
import Footer from "@/components/Footer";

const Deals = () => {
  useEffect(() => {
    // Scroll to deals section after header when navigating to /deals
    setTimeout(() => {
      const dealsSection = document.getElementById('deals');
      if (dealsSection) {
        const headerHeight = 80; // Adjust based on your header height
        const targetPosition = dealsSection.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20"> {/* Add padding to account for fixed header */}
        <DealsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Deals;
