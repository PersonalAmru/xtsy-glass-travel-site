
import { Car, Clock, ShoppingBag, Shirt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ServicesSection = () => {
  const services = [
    {
      icon: Car,
      title: "Free Taxi",
      description: "Complimentary taxi service for groups of 4 or more guests",
      details: "Enjoy hassle-free transportation to and from major attractions"
    },
    {
      icon: Clock,
      title: "24/7 Travel Assistance",
      description: "Round-the-clock support for all your travel needs",
      details: "Our dedicated team is always available to help you"
    },
    {
      icon: ShoppingBag,
      title: "In-House Convenience Store",
      description: "Everything you need right at your fingertips",
      details: "Snacks, drinks, toiletries, and travel essentials available 24/7"
    },
    {
      icon: Shirt,
      title: "Laundry Services",
      description: "Professional laundry and dry cleaning services",
      details: "Keep your clothes fresh during your extended stay"
    }
  ];

  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            Our Services
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience comfort and convenience with our premium hostel services designed for modern travelers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-300 mb-2">
                  {service.description}
                </CardDescription>
                <p className="text-sm text-gray-400">
                  {service.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
