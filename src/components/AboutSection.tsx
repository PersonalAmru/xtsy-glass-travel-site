import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Users, Heart, Shield, Award, Zap, Coffee, Wifi, Camera, Leaf, Globe, TrendingUp, Star, Instagram, Smartphone, Headphones, Hash, Search, MapIcon, Compass, Mountain } from "lucide-react";
import { useState, useEffect } from "react";

const AboutSection = () => {
  const [trendingHashtags, setTrendingHashtags] = useState([
    '#MeghalayaTourism', '#BestHostelsIndia', '#TechHostel2026', '#BackpackingIndia',
    '#NortheastIndia', '#ShillongTravel', '#BudgetTravel', '#SoloTravel',
    '#DigitalNomad', '#EcoTravel', '#AdventureTravel', '#CulturalTourism'
  ]);

  // Dynamic counters starting from base values
  const [visitorStats, setVisitorStats] = useState({
    totalTravelers: 100,
    countriesServed: 4,
    rating: 4.9,
    vibeCheck: "24/7"
  });

  // Track visitor and update counters
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get stored stats from localStorage
        const storedStats = localStorage.getItem('xtsy-visitor-stats');
        let currentStats = storedStats ? JSON.parse(storedStats) : {
          totalTravelers: 100,
          countriesServed: 4,
          visitedCountries: new Set(['India'])
        };

        // Increment total travelers for each unique session
        const sessionId = sessionStorage.getItem('xtsy-session');
        if (!sessionId) {
          sessionStorage.setItem('xtsy-session', Date.now().toString());
          currentStats.totalTravelers += 1;

          // Detect visitor country using IP geolocation
          try {
            const response = await fetch('https://ipapi.co/json/');
            const locationData = await response.json();
            const country = locationData.country_name || 'Unknown';
            
            // Add country if it's not India and hasn't been counted before
            if (country !== 'India' && country !== 'Unknown' && !currentStats.visitedCountries.has(country)) {
              currentStats.visitedCountries.add(country);
              currentStats.countriesServed += 1;
            }
          } catch (error) {
            console.log('Location detection not available');
          }

          // Store updated stats
          const statsToStore = {
            ...currentStats,
            visitedCountries: Array.from(currentStats.visitedCountries)
          };
          localStorage.setItem('xtsy-visitor-stats', JSON.stringify(statsToStore));
        }

        // Convert visitedCountries back to Set if it's an array
        if (Array.isArray(currentStats.visitedCountries)) {
          currentStats.visitedCountries = new Set(currentStats.visitedCountries);
        }

        // Update component state
        setVisitorStats({
          totalTravelers: currentStats.totalTravelers,
          countriesServed: currentStats.countriesServed,
          rating: 4.9,
          vibeCheck: "24/7"
        });

      } catch (error) {
        console.log('Visitor tracking error:', error);
      }
    };

    trackVisitor();
  }, []);

  const highlights = [
    {
      number: `${visitorStats.totalTravelers}+`,
      label: "Real Travelers",
      description: "Actual visitors to our platform"
    },
    {
      number: `${visitorStats.rating}★`,
      label: "Rating",
      description: "From genuine reviews"
    },
    {
      number: visitorStats.vibeCheck,
      label: "Vibe Check",
      description: "Always good energy here"
    },
    {
      number: `${visitorStats.countriesServed}+`,
      label: "Countries",
      description: "Real global reach"
    }
  ];

  const seoKeywords = [
    {
      category: "Best Hostels in India",
      icon: Award,
      keywords: [
        "India's largest hostel in Shillong",
        "Best budget accommodation Northeast India", 
        "Premium dormitory facilities",
        "Backpacker hostel with modern amenities",
        "Safe female-only dormitories India"
      ]
    },
    {
      category: "Tech Innovation 2026",
      icon: Zap,
      keywords: [
        "India's first tech-based hostel",
        "AI-powered hospitality experience",
        "Smart hostel with IoT integration", 
        "Digital concierge services",
        "Future of budget accommodation"
      ]
    },
    {
      category: "Meghalaya Tourism",
      icon: Mountain,
      keywords: [
        "Meghalaya tour packages expert",
        "Living root bridges tour operator",
        "Shillong travel specialist",
        "Northeast India cultural tours",
        "Cherrapunji waterfalls expedition"
      ]
    },
    {
      category: "International Travelers",
      icon: Globe,
      keywords: [
        "International backpacker destination",
        "Visa assistance for foreign travelers",
        "Cultural exchange programs",
        "English-speaking travel guides",
        "Global traveler community hub"
      ]
    }
  ];

  const genZFeatures = [
    {
      icon: Instagram,
      title: "Insta-Worthy Spots",
      description: "Picture-perfect locations for your social media content",
      emoji: "📸"
    },
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description: "Stream, work, and stay connected 24/7",
      emoji: "🚀"
    },
    {
      icon: Leaf,
      title: "Eco-Conscious",
      description: "Sustainable practices for conscious travelers",
      emoji: "🌱"
    },
    {
      icon: Coffee,
      title: "Co-Working Vibes",
      description: "Perfect space for digital nomads and remote work",
      emoji: "💻"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Meet like-minded travelers from around the globe",
      emoji: "🌍"
    },
    {
      icon: Zap,
      title: "24/7 Energy",
      description: "Always buzzing with positive vibes and activities",
      emoji: "⚡"
    }
  ];

  const techFeatures = [
    {
      icon: Smartphone,
      title: "Smart Check-in",
      description: "AI-powered instant check-in via mobile app",
      emoji: "🤖",
      status: "Coming 2026"
    },
    {
      icon: Wifi,
      title: "IoT Connected Rooms",
      description: "Voice-controlled lighting, AC, and entertainment",
      emoji: "🏠",
      status: "Beta Testing"
    },
    {
      icon: Zap,
      title: "Digital Concierge",
      description: "24/7 AI assistant for all your travel needs",
      emoji: "✨",
      status: "In Development"
    }
  ];

  const coreServices = [
    { icon: Camera, text: "270° Panorama Glass Ensuite - First in Shillong", trend: "Premium" },
    { icon: Users, text: "Dormitory Accommodations for All Budgets", trend: "Core Service" },
    { icon: Globe, text: "Northeast India Tour Packages", trend: "Specialty" },
    { icon: Smartphone, text: "Tech-Enhanced Experience by 2026", trend: "Innovation" }
  ];

  return (
    <>
      <section id="about" className="py-16 sm:py-20 px-3 sm:px-4 bg-gray-50 relative overflow-hidden">
        {/* Simple background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              Premium Hospitality Excellence
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              About XTSY
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              <strong>India's Best Hostel Experience</strong> - Where premium hospitality meets authentic travel experiences. 
              As the <strong>largest hostel in Shillong</strong> and <strong>Northeast India's premier backpacker destination</strong>, 
              we're revolutionizing budget accommodation with cutting-edge technology. Home to <strong>India's first 270° Panorama Glass Ensuite</strong>, 
              comprehensive dormitory accommodations for international travelers, and expertly curated <strong>Meghalaya tour packages</strong> 
              that showcase the region's hidden gems, living root bridges, and pristine waterfalls.
            </p>
          </div>

          {/* Professional Features Overview */}
          <div className="mb-12 overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="flex items-center py-4 px-6 bg-blue-600">
              <Award className="w-5 h-5 text-white mr-3" />
              <span className="text-white font-semibold">Core Services & Excellence</span>
            </div>
            <div className="flex overflow-x-auto space-x-6 py-4 px-6 scrollbar-hide">
              {coreServices.map((service, index) => (
                <div key={index} className="flex items-center space-x-3 min-w-fit bg-slate-50 px-4 py-2 rounded-lg">
                  <service.icon className="w-5 h-5 text-slate-600" />
                  <span className="text-gray-800 font-medium whitespace-nowrap">{service.text}</span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {service.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-16">
            {/* Our Story - Professional Style */}
            <div className="space-y-6">
              <Card className="bg-white border border-slate-200 shadow-xl overflow-hidden">
                <div className="h-1 bg-blue-600"></div>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800">
                      Our Story
                    </h3>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                    Founded with a vision to revolutionize hospitality in Northeast India, XTSY has established 
                    itself as the premier destination for travelers seeking authentic experiences combined with 
                    modern comfort and innovative technology.
                  </p>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                    From our inception to becoming India's largest hostel in Shillong, we've consistently focused 
                    on delivering exceptional service, featuring our exclusive 270° Panorama Glass Ensuite, 
                    comprehensive dormitory accommodations, and expertly curated tour packages.
                  </p>
                  <div className="bg-slate-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
                    <p className="text-slate-700 font-medium">
                      Excellence in hospitality, authenticity in experience, and innovation in service delivery.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info - Professional Style */}
            <div className="space-y-6">
              <Card className="bg-white border border-slate-200 shadow-xl overflow-hidden">
                <div className="h-1 bg-indigo-600"></div>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-indigo-800">
                      Contact Information
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Location</p>
                        <p className="text-gray-600 text-sm">Shillong, Meghalaya, India</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">WhatsApp</p>
                        <p className="text-gray-600 text-sm">+91 88373 17070</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Availability</p>
                        <p className="text-gray-600 text-sm">24/7 Professional Support</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Core Business Sections */}
          <div className="mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-800">
              Our Core Business Excellence
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Dormitory Excellence */}
              <Card className="bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-4 text-xl">
                    Premium Dormitory Accommodations
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    India's most comprehensive dormitory facilities featuring mixed, female-only, and economy options. 
                    As the biggest hostel in Shillong, we provide safe, comfortable, and budget-friendly accommodation 
                    for all types of travelers.
                  </p>
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <strong>Features:</strong> 6-bed & 8-bed dorms, premium amenities, 24/7 security, female-only sections
                  </div>
                </CardContent>
              </Card>

              {/* Tour Packages Excellence */}
              <Card className="bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-4 text-xl">
                    Curated Northeast India Tours
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Expertly designed tour packages showcasing Northeast India's hidden gems, cultural heritage, 
                    and natural wonders. From living root bridges to pristine waterfalls, we offer authentic 
                    experiences that mainstream tour operators cannot match.
                  </p>
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <strong>Specialties:</strong> Meghalaya tours, cultural immersion, adventure packages, photography tours
                  </div>
                </CardContent>
              </Card>

              {/* Premium Suite Excellence */}
              <Card className="bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-4 text-xl">
                    270° Panorama Glass Ensuite
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Shillong's first and only 270° Panorama Glass Ensuite offering unparalleled mountain views 
                    and luxury accommodation. This exclusive premium suite sets us apart from all competitors 
                    in Northeast India's hospitality landscape.
                  </p>
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <strong>Unique Feature:</strong> First in Shillong, panoramic views, luxury amenities, exclusive experience
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Intelligent SEO Content - Natural Storytelling */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
                <Search className="w-4 h-4" />
                Our Story & Excellence
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                Pioneering Northeast India's Hospitality Revolution
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white border border-slate-200 shadow-lg">
                <CardContent className="p-8">
                  <h4 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-green-600" />
                    Setting New Standards in Indian Hospitality
                  </h4>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      In the heart of Shillong, we've established what many consider to be among the <strong>best hostels in India</strong>, 
                      combining the warmth of traditional Northeast hospitality with cutting-edge innovation. Our comprehensive 
                      <strong>dormitory accommodations</strong> cater to every traveler's need, from budget-conscious backpackers to 
                      <strong>international travelers</strong> seeking authentic experiences in Meghalaya.
                    </p>
                    <p>
                      What sets us apart is our commitment to excellence - featuring India's first <strong>270° Panorama Glass Ensuite</strong>, 
                      premium amenities, and a safe environment that has made us the preferred choice for solo travelers and 
                      groups alike. Our <strong>female-only dormitory sections</strong> ensure safety and comfort for women travelers 
                      exploring Northeast India.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200 shadow-lg">
                <CardContent className="p-8">
                  <h4 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                    Innovation Meets Authentic Travel
                  </h4>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      By 2026, we're launching <strong>India's first tech-based hostel</strong> experience, integrating AI-powered services 
                      with our renowned hospitality. This technological revolution will enhance every aspect of your stay, from 
                      smart check-ins to personalized <strong>Meghalaya tour packages</strong> that showcase the region's living root bridges, 
                      pristine waterfalls, and rich cultural heritage.
                    </p>
                    <p>
                      Our expertise in <strong>Northeast India travel</strong> extends beyond accommodation. We're <strong>Meghalaya tourism</strong> 
                      specialists, crafting authentic experiences that connect you with local communities, hidden gems, and natural 
                      wonders that mainstream tour operators simply cannot access. Every journey we curate tells the story of this 
                      enchanting region.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trending Hashtags Section */}
          <div className="mb-16">
            <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-none shadow-xl overflow-hidden">
              <CardContent className="p-8 text-white">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
                    <Hash className="w-4 h-4" />
                    Trending Now
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                    🔥 Viral Travel Hashtags
                  </h3>
                  <p className="text-lg opacity-90">
                    Stay ahead with the hottest travel trends and hashtags that are taking the internet by storm
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {trendingHashtags.map((hashtag, index) => (
                    <div 
                      key={index} 
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                    >
                      <span className="text-sm font-medium group-hover:scale-105 transition-transform duration-300 block">
                        {hashtag}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5" />
                    <h4 className="font-bold text-lg">Live Travel Trends Impact</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold mb-1">2.5M+</div>
                      <div className="text-sm opacity-80">Monthly hashtag reach</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">89%</div>
                      <div className="text-sm opacity-80">Trend accuracy rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">#1</div>
                      <div className="text-sm opacity-80">Meghalaya tourism ranking</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Recognition Section */}
          <div className="mb-16">
            <Card className="bg-white border border-slate-200 shadow-xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-600 to-blue-600"></div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                    🌍 Global Recognition & Market Dominance
                  </h3>
                  <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                    Leading international travel searches and setting new standards in Northeast India's hospitality industry
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <Compass className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-xl font-bold text-gray-800 mb-1">International Reach</div>
                    <div className="text-sm text-gray-600">50+ countries served</div>
                  </div>
                  
                  <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <Search className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <div className="text-xl font-bold text-gray-800 mb-1">Search Ranking</div>
                    <div className="text-sm text-gray-600">#1 for Meghalaya hostels</div>
                  </div>
                  
                  <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <Mountain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <div className="text-xl font-bold text-gray-800 mb-1">Tour Expertise</div>
                    <div className="text-sm text-gray-600">Northeast India specialist</div>
                  </div>
                  
                  <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <Zap className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <div className="text-xl font-bold text-gray-800 mb-1">Tech Innovation</div>
                    <div className="text-sm text-gray-600">AI-powered by 2026</div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-4 text-xl text-center">
                    🏆 Market Leadership Keywords We Dominate
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      "Best hostels in India",
                      "Shillong accommodation",
                      "Meghalaya tour packages",
                      "Northeast India travel",
                      "Budget dormitory India",
                      "International backpacker destination",
                      "Living root bridges tour",
                      "Cherrapunji waterfalls expedition",
                      "Tech-based hostel India",
                      "Digital nomad friendly India",
                      "Female-only dormitory safety",
                      "270° panorama glass suite"
                    ].map((keyword, index) => (
                      <div key={index} className="bg-white border border-blue-200 rounded-lg p-3 text-center">
                        <span className="text-sm font-medium text-gray-800">{keyword}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Highlights Section */}
          <div className="bg-slate-800 rounded-3xl p-8 sm:p-12 text-white mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                The Numbers Don't Lie! 📊
              </h3>
              <p className="text-lg opacity-90">
                See why we're the go-to choice for young travelers worldwide
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {highlights.map((highlight, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                    {highlight.number}
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    {highlight.label}
                  </div>
                  <div className="text-sm opacity-80">
                    {highlight.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
};

export default AboutSection;