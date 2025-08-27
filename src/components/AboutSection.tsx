
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Users, Heart, Globe, Award, Camera, Building2, Star, Shield, Wifi } from "lucide-react";
import { useEffect } from "react";

const AboutSection = () => {
  useEffect(() => {
    // Update document head with SEO meta tags
    document.title = "XTSY India | Hostels, Budget & Luxury Stay in Shillong and Across India";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover XTSY – premium hostels, boutique rooms, and curated tours in Shillong, Meghalaya and beyond. Loved by global travelers.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Discover XTSY – premium hostels, boutique rooms, and curated tours in Shillong, Meghalaya and beyond. Loved by global travelers.';
      document.head.appendChild(newMetaDescription);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'hostel India, luxury stay Shillong, budget travel Meghalaya, backpackers, India travel, global tourism');
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = 'hostel India, luxury stay Shillong, budget travel Meghalaya, backpackers, India travel, global tourism';
      document.head.appendChild(newMetaKeywords);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'XTSY | Stay in Shillong & Explore Northeast India');
    } else {
      const newOgTitle = document.createElement('meta');
      newOgTitle.setAttribute('property', 'og:title');
      newOgTitle.content = 'XTSY | Stay in Shillong & Explore Northeast India';
      document.head.appendChild(newOgTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Experience India through XTSY\'s stays and travel packages. Based in Shillong, built for global explorers.');
    } else {
      const newOgDescription = document.createElement('meta');
      newOgDescription.setAttribute('property', 'og:description');
      newOgDescription.content = 'Experience India through XTSY\'s stays and travel packages. Based in Shillong, built for global explorers.';
      document.head.appendChild(newOgDescription);
    }
  }, []);

  const coreServices = [
    {
      icon: Building2,
      title: "Biggest Hostel in Shillong",
      category: "Scale", 
      description: "Northeast India's largest hostel accommodation facility with 100+ beds across multiple room categories.",
      features: ["100+ Bed Capacity", "Multiple Buildings", "Largest in NE India"]
    },
    {
      icon: Star,
      title: "Best Budget Accommodation",
      category: "Value",
      description: "Premium amenities at budget-friendly prices, making luxury accessible to all travelers.",
      features: ["Premium Amenities", "Budget Pricing", "Best Value Proposition"]
    },
    {
      icon: Camera,
      title: "270° Panorama Glass Ensuite",
      category: "Luxury",
      description: "Shillong's exclusive panoramic mountain view experience with floor-to-ceiling glass walls.",
      features: ["360° Mountain Views", "Glass Architecture", "Exclusive Experience"]
    },
    {
      icon: Users,
      title: "Comprehensive Dormitories",
      category: "Accommodation",
      description: "Mixed, female-only, and economy dormitory options with premium comfort standards.",
      features: ["6-Bed & 8-Bed Dorms", "Female-Only Options", "Economy Categories"]
    },
    {
      icon: Shield,
      title: "24/7 Security & Safety",
      category: "Security",
      description: "Round-the-clock security with CCTV monitoring and trained security personnel.",
      features: ["24/7 CCTV", "Trained Security", "Safe Environment"]
    },
    {
      icon: Wifi,
      title: "High-Speed WiFi & Amenities",
      category: "Technology",
      description: "Complimentary high-speed internet, modern facilities, and premium guest amenities.",
      features: ["Free High-Speed WiFi", "Modern Facilities", "Premium Amenities"]
    },
    {
      icon: Globe,
      title: "Northeast India Tours",
      category: "Travel",
      description: "Expertly curated regional exploration packages covering all Northeast states.",
      features: ["All 8 NE States", "Expert Guides", "Cultural Immersion"]
    },
    {
      icon: MapPin,
      title: "Prime Shillong Location",
      category: "Location",
      description: "Strategically located in the heart of Shillong with easy access to major attractions.",
      features: ["City Center Location", "Tourist Attractions Nearby", "Easy Transportation"]
    }
  ];

  const highlights = [{
    number: "★★★★★",
    label: "Excellence Rating"
  }, {
    number: "24/7",
    label: "Support"
  }, {
    number: "100%",
    label: "Travel Assistance"
  }];

  return (
    <main id="about" className="pt-20 py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      
      {/* Background Animation Elements */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-orange-400/3 to-red-400/3 rounded-full blur-xl animate-pulse" 
            style={{
              left: `${20 + i * 15}%`,
              top: `${15 + i * 20}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${5 + i * 0.5}s`
            }} 
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* SEO-Optimized Header Section with Semantic HTML */}
        <section className="text-center mb-12 sm:mb-16 bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-elegant">
            <Award className="w-4 h-4" />
            <span>Premium Hospitality Excellence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-6">About XTSY – Stay & Travel India</h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Welcome to <strong className="text-slate-800">XTSY – India's emerging travel and stay brand</strong>, based in 
            <strong className="text-slate-800"> Shillong, Meghalaya</strong>. We offer curated stays from panoramic luxury suites 
            to budget-friendly hostels across Northeast India and beyond. <strong className="text-slate-800">Top hostel destination 
            for international travelers</strong> seeking authentic experiences in India.
          </p>
        </section>

        {/* Why Global Travelers Choose XTSY */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-8">Why Global Travelers Choose XTSY</h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-elegant border border-white/50">
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <li className="p-6 bg-slate-50 rounded-xl">
                <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Panoramic Luxury Suites in Shillong</h3>
                <p className="text-slate-600 text-sm">Experience <strong>Shillong panoramic views</strong> from our exclusive 270° Glass Ensuite</p>
              </li>
              <li className="p-6 bg-slate-50 rounded-xl">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Curated Backpacker Hostels Across India</h3>
                <p className="text-slate-600 text-sm">Perfect for <strong>India backpacker routes</strong> and budget-conscious travelers</p>
              </li>
              <li className="p-6 bg-slate-50 rounded-xl">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Immersive Cultural Tours in Northeast India</h3>
                <p className="text-slate-600 text-sm">Authentic local experiences <strong>trusted by international guests across EU and UK</strong></p>
              </li>
            </ul>
          </div>
        </section>

        {/* Our Presence Across India */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-8">Our Presence Across India</h2>
          <div className="bg-primary rounded-3xl p-8 text-primary-foreground shadow-xl">
            <p className="text-lg leading-relaxed text-center max-w-4xl mx-auto">
              From the highlands of Meghalaya to the tea gardens of Assam and the tribal trails of Nagaland, 
              <strong> XTSY operates across 7 Northeast states and growing</strong>. Our mission is to connect travelers 
              to authentic, locally hosted experiences. We provide <strong>affordable luxury for digital nomads</strong> 
              and serve as the gateway for those who <strong>stay in Shillong, India</strong> and explore the region.
            </p>
          </div>
        </section>
        
        {/* Core Services Section - Sliding Tags Only */}
        <section className="mb-12 overflow-hidden bg-black rounded-2xl shadow-soft border border-gray-800">
          <header className="flex items-center py-4 px-6 bg-primary">
            <Award className="w-5 h-5 text-primary-foreground mr-3" />
            <h2 className="text-primary-foreground font-semibold">Core Services & Facilities</h2>
          </header>
          <div className="flex space-x-4 py-6 px-6 animate-slide-right-fast">
            {coreServices.map((service, index) => (
              <article 
                key={index} 
                className="flex-none"
              >
                <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group px-4 py-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-slate-800 font-semibold text-sm leading-tight whitespace-nowrap">
                      {service.title}
                    </h3>
                    <span className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium mt-1">
                      {service.category}
                    </span>
                  </div>
                </div>
              </article>
            ))}
            {coreServices.map((service, index) => (
              <article 
                key={`duplicate-${index}`} 
                className="flex-none"
              >
                <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group px-4 py-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-slate-800 font-semibold text-sm leading-tight whitespace-nowrap">
                      {service.title}
                    </h3>
                    <span className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium mt-1">
                      {service.category}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <footer className="px-6 pb-4">
            <p className="text-xs text-gray-400 text-center">← Auto-sliding services showcase →</p>
          </footer>
        </section>

        {/* Story and Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-16">
          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-elegant overflow-hidden group hover:shadow-soft transition-shadow duration-300">
              <div className="h-1 bg-primary"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Our Story
                  </h2>
                </div>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">
                  Founded with a vision to revolutionize hospitality in Northeast India, XTSY has established 
                  itself as the premier destination for travelers seeking authentic experiences.
                </p>
                <div className="bg-slate-50 border-l-4 border-primary p-4 rounded-r-xl">
                  <p className="text-slate-800 font-medium">
                    Excellence in hospitality, authenticity in experience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-elegant overflow-hidden group hover:shadow-soft transition-shadow duration-300">
              <div className="h-1 bg-primary"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Contact Information
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Location</p>
                      <p className="text-slate-600 text-sm">Shillong, Meghalaya, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">WhatsApp</p>
                      <p className="text-slate-600 text-sm">+91 88373 17070</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Availability</p>
                      <p className="text-slate-600 text-sm">24/7 Professional Support</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16 bg-black rounded-3xl p-8 shadow-lg border border-gray-800">
          <header className="flex items-center justify-center py-4 px-6 mb-8">
            <Award className="w-5 h-5 text-white mr-3" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Our Services
            </h2>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-slate-800 mb-4 text-xl">
                  Dormitory Accommodations
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Comprehensive dormitory facilities featuring mixed, female-only, and economy options.
                </p>
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  <strong>Features:</strong> 6-bed & 8-bed dorms, premium amenities
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-slate-800 mb-4 text-xl">
                  Northeast India Tours
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Expertly designed tour packages showcasing Northeast India's hidden gems.
                </p>
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  <strong>Specialties:</strong> Meghalaya tours, cultural immersion
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-slate-800 mb-4 text-xl">
                  270° Panorama Glass Ensuite
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Shillong's first and only 270° Panorama Glass Ensuite offering unparalleled mountain views.
                </p>
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  <strong>Features:</strong> Panoramic views, luxury amenities
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Book Direct. Experience Local. */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-8">Book Direct. Experience Local.</h2>
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-elegant border border-white/50">
            <p className="text-lg text-slate-600 mb-6">
              With XTSY - Book your stay or explore our 7-state travel packages today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/booking" 
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-300"
              >
                Book Now
              </a>
              <span className="text-slate-400 self-center">|</span>
              <a 
                href="/travel" 
                className="inline-flex items-center justify-center px-8 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors duration-300"
              >
                View Tours
              </a>
            </div>
          </div>
        </section>

        {/* Excellence Highlights */}
        <div className="bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground mb-16 shadow-xl">
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

      {/* Custom Styles */}
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          @keyframes slide-right {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-slide-right-fast {
            animation: slide-right 12s linear infinite;
          }
          .animate-slide-right-fast:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </main>
  );
};

export default AboutSection;
