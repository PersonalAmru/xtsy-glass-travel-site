
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AdventureCallToAction = () => {
  const navigate = useNavigate();

  const handlePlanAdventure = () => {
    // Navigate to the travel itineraries page/section
    navigate("/#travel-itineraries");
    // Scroll to the travel itineraries section if on the same page
    setTimeout(() => {
      const element = document.getElementById("travel-itineraries");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <section className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-100 via-white to-slate-100 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-xl animate-pulse"
            style={{
              left: `${15 + i * 18}%`,
              top: `${10 + i * 18}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${3.5 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-0">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-serif-sans">
                🌟 Ready for Adventure?
              </h3>
              <p className="text-white/90 text-base sm:text-lg mb-6 font-seasons">
                Contact us to customize your perfect Meghalaya adventure package
              </p>
              <Button 
                onClick={handlePlanAdventure}
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-seasons"
              >
                Plan My Adventure 🗺️
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdventureCallToAction;
