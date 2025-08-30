import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sofa } from "lucide-react";

const ServicesSection = () => {
  // Two property tiles (half + half)
  const services = [
    {
      icon: <Sofa className="h-5 w-5" />,
      title: "XTSY Travellers Hostel",
      description:
        "Backpacker-friendly flagship with shared lounge, games room, 24/7 support, laundry (paid) and more.",
      badge: "Preferred",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "XTSY Economy",
      description:
        "Value-first stays for students & groups: tour assistance, group booking discounts and flexible check-in.",
      badge: "Budget",
    },
  ];

  return (
    <section className="pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 safe-area-padding bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-orange-900/20 relative overflow-hidden -mt-1">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/10 to-orange-100/20" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl" />

      <div className="responsive-container relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12 sm:mb-16">
          <div className="glass-card inline-block p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 mb-1 font-playfair">
              Amenities &amp; Services
            </h2>
            {/* Subheading & color bar removed per request */}
          </div>
        </div>

        {/* Fixed 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="glass-card bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/15 hover:shadow-xl transition-all duration-500 flex flex-col group"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-purple-600 group-hover:text-pink-600 transition-colors duration-300">
                    {service.icon}
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-purple-300/50 text-purple-700 bg-white/20 backdrop-blur-sm px-2 py-1 font-medium"
                  >
                    {service.badge}
                  </Badge>
                </div>
                <CardTitle className="font-bold text-gray-900 group-hover:text-purple-900 transition-colors duration-300 text-base sm:text-lg">
                  {service.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-5 pb-5 pt-0">
                <CardDescription className="text-gray-700 group-hover:text-gray-800 transition-colors duration-300 text-sm sm:text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
