import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Users, Heart, Globe, Award, Camera } from "lucide-react";

const AboutSection = () => {
  const coreServices = [
    { icon: Camera, text: "270° Panorama Glass Ensuite", trend: "Premium" },
    { icon: Users, text: "Dormitory Accommodations", trend: "Budget" },
    { icon: Globe, text: "Northeast India Tours", trend: "Specialty" }
  ];

  const highlights = [
    { number: "★★★★★", label: "Excellence Rating" },
    { number: "24/7", label: "Support" },
    { number: "100%", label: "Safety" }
  ];

  return (
    <section id="about" className="py-16 sm:py-20 px-3 sm:px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-subtle opacity-40"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-elegant">
            <Award className="w-4 h-4" />
            Premium Hospitality Excellence
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            About XTSY Hostel
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong className="text-foreground">India's Premier Hostel Experience</strong> in Shillong, Meghalaya. 
            Featuring our exclusive <strong className="text-foreground">270° Panorama Glass Ensuite</strong>, 
            comprehensive dormitory facilities, and expertly curated 
            <strong className="text-foreground"> Meghalaya tour packages</strong>.
          </p>
        </div>

        {/* Core Services */}
        <div className="mb-12 overflow-hidden bg-card rounded-2xl shadow-soft border border-border">
          <div className="flex items-center py-4 px-6 bg-primary">
            <Award className="w-5 h-5 text-primary-foreground mr-3" />
            <span className="text-primary-foreground font-semibold">Core Services</span>
          </div>
          <div className="flex overflow-x-auto space-x-4 py-6 px-6 scrollbar-hide">
            {coreServices.map((service, index) => (
              <div key={index} className="flex items-center space-x-3 min-w-fit bg-secondary px-4 py-3 rounded-xl border border-border">
                <service.icon className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium whitespace-nowrap">{service.text}</span>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  {service.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-16">
          {/* Our Story */}
          <div className="space-y-6">
            <Card className="bg-card border border-border shadow-elegant overflow-hidden group hover:shadow-soft transition-shadow duration-300">
              <div className="h-1 bg-primary"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Our Story
                  </h2>
                </div>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4">
                  Founded with a vision to revolutionize hospitality in Northeast India, XTSY has established 
                  itself as the premier destination for travelers seeking authentic experiences combined with 
                  modern comfort and innovative technology.
                </p>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4">
                  We focus on delivering exceptional service, featuring our exclusive 270° Panorama Glass Ensuite, 
                  comprehensive dormitory accommodations, and expertly curated tour packages.
                </p>
                <div className="bg-secondary border-l-4 border-primary p-4 rounded-r-xl">
                  <p className="text-foreground font-medium">
                    Excellence in hospitality, authenticity in experience, and innovation in service delivery.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-card border border-border shadow-elegant overflow-hidden group hover:shadow-soft transition-shadow duration-300">
              <div className="h-1 bg-primary"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Contact Information
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-xl hover:bg-accent transition-colors duration-200">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Location</p>
                      <p className="text-muted-foreground text-sm">Shillong, Meghalaya, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-xl hover:bg-accent transition-colors duration-200">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">WhatsApp</p>
                      <p className="text-muted-foreground text-sm">+91 88373 17070</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-xl hover:bg-accent transition-colors duration-200">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Availability</p>
                      <p className="text-muted-foreground text-sm">24/7 Professional Support</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Business Excellence */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">
            Our Services
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Dormitory */}
            <Card className="bg-card border border-border shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-4 text-xl">
                  Dormitory Accommodations
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Comprehensive dormitory facilities featuring mixed, female-only, and economy options. 
                  Safe, comfortable, and budget-friendly accommodation for all types of travelers.
                </p>
                <div className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                  <strong>Features:</strong> 6-bed & 8-bed dorms, premium amenities, 24/7 security
                </div>
              </CardContent>
            </Card>

            {/* Tours */}
            <Card className="bg-card border border-border shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-4 text-xl">
                  Northeast India Tours
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Expertly designed tour packages showcasing Northeast India's hidden gems, cultural heritage, 
                  and natural wonders. From living root bridges to pristine waterfalls.
                </p>
                <div className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                  <strong>Specialties:</strong> Meghalaya tours, cultural immersion, adventure packages
                </div>
              </CardContent>
            </Card>

            {/* Premium Suite */}
            <Card className="bg-card border border-border shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-4 text-xl">
                  270° Panorama Glass Ensuite
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Shillong's first and only 270° Panorama Glass Ensuite offering unparalleled mountain views 
                  and luxury accommodation. This exclusive premium suite.
                </p>
                <div className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                  <strong>Features:</strong> Panoramic views, luxury amenities, exclusive experience
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Highlights */}
        <div className="bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Excellence
            </h2>
            <p className="text-lg opacity-90">
              Delivering outstanding service and experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                  {highlight.number}
                </div>
                <div className="text-lg font-semibold">
                  {highlight.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </section>
  );
};

export default AboutSection;