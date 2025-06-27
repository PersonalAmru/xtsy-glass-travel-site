
import { Car, Clock, ShoppingBag, Shirt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ServicesSection = () => {
  const services = [
    {
      icon: Car,
      title: "Free Taxi",
      description: "Complimentary taxi service for groups of 4 or more guests",
      details: "Enjoy hassle-free transportation to and from major attractions",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Clock,
      title: "24/7 Travel Assistance",
      description: "Round-the-clock support for all your travel needs",
      details: "Our dedicated team is always available to help you",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: ShoppingBag,
      title: "In-House Convenience Store",
      description: "Everything you need right at your fingertips",
      details: "Snacks, drinks, toiletries, and travel essentials available 24/7",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shirt,
      title: "Laundry Services",
      description: "Professional laundry and dry cleaning services",
      details: "Keep your clothes fresh during your extended stay",
      gradient: "from-orange-500 to-red-500"
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
                <div className={`mx-auto w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl relative`}>
                  {/* 3D Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-2xl blur-md opacity-60 scale-110`}></div>
                  <div className={`absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl`}></div>
                  <service.icon className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
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
