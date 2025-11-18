import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PetFriendly = () => {
  useEffect(() => {
    document.title = "Pet Friendly Rooms - XTSY Prime";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-background/95">
        <Header />
        
        <main className="flex-1 pt-20 pb-12">
          <div className="responsive-container">
            <div className="text-center space-y-6 py-20">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Pet Friendly Rooms</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Coming soon - Comfortable accommodation for you and your furry friends
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
    </div>
  );
};

export default PetFriendly;
