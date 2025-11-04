import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Users, Heart, Globe, Award, Camera, Building2, Star, Shield, Wifi, Sparkles, TrendingUp, CheckCircle2, Target } from "lucide-react";
import { useEffect } from "react";
import neitaAwardCertificate from "@/assets/neita-award-certificate.jpeg";

const AboutSection = () => {
  useEffect(() => {
    // Enhanced SEO meta tags
    document.title = 'About XTSY | India\'s Fastest-Growing Travel & Hospitality Brand | First 270° Glass Suite';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = 'XTSY - India\'s fastest-growing travel & hospitality brand. Home to India\'s first 270° panoramic glass suite and Northeast India\'s biggest & highest-rated hostel. Award-nominated excellence. Powered by XTSY ONE LLP.';
    if (metaDescription) {
      metaDescription.setAttribute('content', descContent);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = descContent;
      document.head.appendChild(newMeta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywordsContent = 'XTSY, travel brand India, 270 glass suite, biggest hostel northeast India, luxury stargazing India, XTSY ONE LLP, Shillong hostel, Northeast tourism, award-nominated hospitality, best honeymoon stay India, backpacker hostel, group travel India';
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywordsContent);
    } else {
      const newKeywords = document.createElement('meta');
      newKeywords.name = 'keywords';
      newKeywords.content = keywordsContent;
      document.head.appendChild(newKeywords);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "XTSY Travellers Hostel & Luxury",
      "description": "India's fastest-growing travel & hospitality brand",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Shillong",
        "addressRegion": "Meghalaya",
        "addressCountry": "India"
      },
      "brand": {
        "@type": "Brand",
        "name": "XTSY",
        "description": "Powered by XTSY ONE LLP"
      },
      "telephone": "+91 88373 17070"
    };
    
    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }, []);

  const accommodationServices = [
    {
      icon: Camera,
      title: "270° Panorama Glass Ensuite",
      description: "India's first panoramic stargazing accommodation"
    },
    {
      icon: Building2,
      title: "Premium Private Rooms",
      description: "Luxury accommodations with modern amenities"
    },
    {
      icon: Users,
      title: "Mixed, Female-Only & Economy Dorms",
      description: "Safe, spacious dormitories for all travelers"
    }
  ];

  const safetyServices = [
    {
      icon: Shield,
      title: "24/7 Surveillance",
      description: "Round-the-clock CCTV monitoring"
    },
    {
      icon: CheckCircle2,
      title: "Professional Staff",
      description: "Trained on-site security team"
    },
    {
      icon: Star,
      title: "High Hygiene Standards",
      description: "Clean, well-maintained facilities"
    }
  ];

  const amenitiesServices = [
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description: "Complimentary internet access"
    },
    {
      icon: Heart,
      title: "Breakfast Options",
      description: "Delicious morning meals"
    },
    {
      icon: Shield,
      title: "Lockers & Utilities",
      description: "Secure storage and services"
    }
  ];

  const tourServices = [
    {
      icon: Globe,
      title: "Meghalaya Adventure Trails",
      description: "Explore the abode of clouds"
    },
    {
      icon: Camera,
      title: "Cultural Experiences",
      description: "Immerse in local traditions"
    },
    {
      icon: MapPin,
      title: "Multi-State NE Circuits",
      description: "Comprehensive Northeast tours"
    }
  ];

  const highlights = [
    {
      number: "50+",
      label: "Guest Capacity"
    },
    {
      number: "7",
      label: "States Coverage"
    },
    {
      number: "24/7",
      label: "Support"
    }
  ];

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
        
        {/* Hero Section */}
        <section className="text-center mb-16 bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-white/50">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <TrendingUp className="w-5 h-5" />
            <span>India's Fastest-Growing Travel & Hospitality Brand</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-6">
            About XTSY Travellers Hostel & Luxury
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            <strong className="text-slate-800">XTSY is where innovation meets exploration.</strong> Based in Shillong and powered by <strong className="text-slate-800">XTSY ONE LLP</strong>, we are redefining how India travels — with experiences that feel personal, architectural, immersive, and unforgettable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Northeast India</span>
            <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Pan-India</span>
            <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Asia & EU Coming Soon</span>
          </div>
        </section>

        {/* India's First 270° Panorama Glass Ensuite */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Architectural Milestone</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              India's First 270° Panorama Glass Ensuite
            </h2>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
            <p className="text-lg sm:text-xl leading-relaxed text-center max-w-4xl mx-auto mb-6">
              Our flagship creation — the <strong className="text-amber-400">XTSY 270° Luxury Glass Suite</strong> — is India's first panoramic stargazing accommodation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-amber-400 mb-2">270°</div>
                <div className="text-sm opacity-90">Uninterrupted Views</div>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-amber-400 mb-2">Only 1</div>
                <div className="text-sm opacity-90">In All of India</div>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-amber-400 mb-2">Luxury</div>
                <div className="text-sm opacity-90">Stargazing Experience</div>
              </div>
            </div>
            <p className="text-center text-sm opacity-90 mt-8 max-w-3xl mx-auto">
              A signature honeymoon and anniversary stay inspired by global sky-glass lodges — an architectural milestone unlike anything else in the country.
            </p>
          </div>
        </section>

        {/* Biggest & Highest-Rated Hostel */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold mb-4">
              <Building2 className="w-4 h-4" />
              <span>Northeast India's #1 Hostel</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800">
              Biggest & Highest-Rated Hostel
            </h2>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
            <p className="text-lg sm:text-xl leading-relaxed text-center max-w-4xl mx-auto mb-8">
              <strong>XTSY Travellers Hostel</strong> is the largest and most highly reviewed group hostel in Northeast India, with capacity for <strong>50+ guests</strong>. A trusted choice for backpackers, digital nomads, student groups, and international communities traveling through Shillong, Meghalaya.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Star className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">Highest-Rated</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">24/7 Security</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">Group-Friendly</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">Clean & Modern</div>
              </div>
            </div>
          </div>
        </section>

        {/* Award-Nominated */}
        <section className="mb-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-white/50">
            <div className="text-center mb-8">
              <Award className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                Award-Nominated Hospitality
              </h2>
            </div>
            <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto mb-8">
              We are honored to be officially nominated at the prestigious <strong className="text-slate-800">Northeast India Tourism Awards [NEITA 2025]</strong>, an initiative by the Emerging North-East Eco Forum (ENEEF). XTSY Traveller&apos;s Hostel has been recognized in two distinguished categories: <strong className="text-amber-600">Best Budget-Friendly Accommodation</strong> and <strong className="text-blue-600">Service Excellence Award</strong>. This nomination reflects our unwavering commitment to providing exceptional hospitality experiences while maintaining affordability and delivering world-class service to travelers exploring the enchanting landscapes of Meghalaya and Northeast India. The awards ceremony is scheduled for October 11th, 2025, at Radisson Blu, Guwahati.
            </p>
            
            {/* Award Certificate Image */}
            <div className="max-w-4xl mx-auto mt-8">
              <img 
                src={neitaAwardCertificate} 
                alt="XTSY NEITA 2025 Award Certificate - Best Budget-Friendly Accommodation and Service Excellence Award" 
                className="w-full h-auto rounded-2xl shadow-2xl border-4 border-amber-100"
              />
              <p className="text-center text-sm text-slate-500 mt-4 italic">
                Northeast India Tourism Awards 2025 - Official Nomination Certificate
              </p>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-8">Who We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 text-center hover:shadow-xl transition-shadow">
              <Heart className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-2 text-sm">Couples & Honeymooners</h3>
              <p className="text-xs text-slate-600">India's most unique romantic stay</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 text-center hover:shadow-xl transition-shadow">
              <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-2 text-sm">Backpackers & Solo Travelers</h3>
              <p className="text-xs text-slate-600">Northeast's favorite hub</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 text-center hover:shadow-xl transition-shadow">
              <Globe className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-2 text-sm">Group Organizers</h3>
              <p className="text-xs text-slate-600">Reliable large-capacity hostel</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 text-center hover:shadow-xl transition-shadow">
              <Camera className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-2 text-sm">Photographers & Creators</h3>
              <p className="text-xs text-slate-600">Highly visual spaces</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 text-center hover:shadow-xl transition-shadow">
              <Star className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-2 text-sm">Stargazers & Nature Lovers</h3>
              <p className="text-xs text-slate-600">270° night-sky experience</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 text-center hover:shadow-xl transition-shadow">
              <Building2 className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-2 text-sm">Architecture Enthusiasts</h3>
              <p className="text-xs text-slate-600">One-of-a-kind concept</p>
            </div>
          </div>
        </section>

        {/* Scaling Story */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Built in Shillong. Scaling Across India.<br />Ready for the World.
            </h2>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
            <p className="text-lg sm:text-xl leading-relaxed text-center max-w-4xl mx-auto mb-8">
              XTSY started in the green hills of Meghalaya with a vision to transform hospitality in the Northeast. Today, we operate across <strong>seven states</strong> and continue building a pan-India ecosystem of stays, experiences, and curated travel services.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">Proudly Local</span>
              <span className="px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">Globally Ambitious</span>
              <span className="px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">Meaningful Journeys</span>
            </div>
          </div>
        </section>
        
        {/* Core Services */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-12">Core Services</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Accommodation */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Accommodation</h3>
              </div>
              <div className="space-y-3">
                {accommodationServices.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <service.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{service.title}</h4>
                      <p className="text-xs text-slate-600">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Security */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Safety & Security</h3>
              </div>
              <div className="space-y-3">
                {safetyServices.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <service.icon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{service.title}</h4>
                      <p className="text-xs text-slate-600">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Amenities */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Modern Amenities</h3>
              </div>
              <div className="space-y-3">
                {amenitiesServices.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <service.icon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{service.title}</h4>
                      <p className="text-xs text-slate-600">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Northeast India Tours */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Northeast India Tours</h3>
              </div>
              <div className="space-y-3">
                {tourServices.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <service.icon className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{service.title}</h4>
                      <p className="text-xs text-slate-600">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Story and Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl">
            <div className="h-1 bg-gradient-to-r from-orange-500 to-red-600"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Our Story</h2>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                XTSY was created to offer travelers more than just a place to sleep. We wanted to build a <strong className="text-slate-800">community-driven space</strong> where comfort meets design and where every stay becomes a memorable experience.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Today, XTSY stands for <strong className="text-slate-800">consistent service, traveler trust, and hospitality excellence</strong>.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Contact Information</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Location</p>
                    <p className="text-slate-600 text-sm">Shillong, Meghalaya, India</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">WhatsApp</p>
                    <p className="text-slate-600 text-sm">+91 88373 17070</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Support</p>
                    <p className="text-slate-600 text-sm">24/7 Availability</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* CTA Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
            <div className="text-center mb-8">
              <Target className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Book Direct. Travel Deeper.
              </h2>
              <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
                Explore our stays, luxury suites, and curated Northeast India tours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Book Your Stay
              </a>
              <a 
                href="/travel" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Tours
              </a>
              <a
                href="https://wa.me/918837317070?text=Hi%20Team%20XTSY%2C%20I%20just%20visited%20your%20site%20and%20would%20like%20to%20know%20more."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

      </div>

    </main>
  );
};

export default AboutSection;
