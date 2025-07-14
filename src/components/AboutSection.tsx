
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Users, Heart, Shield, Award } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Heart,
      title: "Passionate Hospitality",
      description: "We love what we do and it shows in every guest interaction"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "24/7 security and CCTV monitoring for your peace of mind"
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Connect with fellow travelers from around the world"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence in budget accommodation"
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-r from-orange-300/20 to-red-300/20 rounded-full blur-xl animate-pulse"
            style={{
              left: `${10 + i * 18}%`,
              top: `${15 + i * 15}%`,
              animationDelay: `${i * 1}s`,
              animationDuration: `${3 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-serif-sans">
            🏠 About XTSY
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-seasons leading-relaxed">
            Your home away from home in the heart of Shillong. We're passionate about providing 
            comfortable, affordable accommodation with a warm, welcoming atmosphere.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* About Text */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 font-serif-sans">
                  Our Story 📖
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-seasons mb-4">
                  Founded with a vision to create the perfect blend of comfort and affordability, 
                  XTSY has become Shillong's premier destination for travelers seeking authentic 
                  experiences and genuine hospitality.
                </p>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-seasons">
                  From our humble beginnings to becoming a trusted name in accommodation, 
                  we've always focused on what matters most - making every guest feel at home 
                  while exploring the beautiful landscapes of Meghalaya.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 font-serif-sans">
                  Get In Touch 📞
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">📍 Location</p>
                      <p className="text-gray-600 text-sm font-seasons">Shillong, Meghalaya, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">📱 WhatsApp</p>
                      <p className="text-gray-600 text-sm font-seasons">+91 88373 17070</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">🕐 Available</p>
                      <p className="text-gray-600 text-sm font-seasons">24/7 Support</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base font-serif-sans">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm font-seasons">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
