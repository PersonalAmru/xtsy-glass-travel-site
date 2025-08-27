
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Users, Heart, Globe, Award, Camera, Building2, Star, Shield, Wifi } from "lucide-react";
import { useEffect } from "react";

const AboutSection = () => {
  useEffect(() => {
    // Enhanced SEO meta tags for primary keyword rankings
    document.title = 'XTSY Travellers Hostel & Luxury | India\'s First 270° Glass Ensuite & Biggest Hostel in North East India';
    
    // Update meta description with strategic keyword integration
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover XTSY – India\'s biggest hostel in North East India and highest-rated traveller hostel. Featuring India\'s first 270° stargazing glass suite and premium group accommodations. Powered by xtsyonellp.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Discover XTSY – India\'s biggest hostel in North East India and highest-rated traveller hostel. Featuring India\'s first 270° stargazing glass suite and premium group accommodations. Powered by xtsyonellp.';
      document.head.appendChild(newMetaDescription);
    }

    // Enhanced meta keywords with primary target phrases
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'biggest hostel north east india, biggest hostel shillong meghalaya, highest rated traveller hostel north east, best honeymoon stay india, group travel hostel india, luxury stargazing suite india, 270° glass room shillong, pan india travel brand, xtsyonellp, XTSY Travellers Hostel, XTSY luxury, northeast india accommodation, stargazing glass suite, architectural innovation india, photographer friendly stay india, couple travel india 2025, backpacker hostel northeast india');
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = 'biggest hostel north east india, biggest hostel shillong meghalaya, highest rated traveller hostel north east, best honeymoon stay india, group travel hostel india, luxury stargazing suite india, 270° glass room shillong, pan india travel brand, xtsyonellp, XTSY Travellers Hostel, XTSY luxury, northeast india accommodation, stargazing glass suite, architectural innovation india, photographer friendly stay india, couple travel india 2025, backpacker hostel northeast india';
      document.head.appendChild(newMetaKeywords);
    }

    // Enhanced Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'XTSY | India\'s First 270° Glass Ensuite & Biggest Hostel in North East India');
    } else {
      const newOgTitle = document.createElement('meta');
      newOgTitle.setAttribute('property', 'og:title');
      newOgTitle.content = 'XTSY | India\'s First 270° Glass Ensuite & Biggest Hostel in North East India';
      document.head.appendChild(newOgTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'India\'s most innovative travel brand. Experience XTSY\'s 270° stargazing glass suite, biggest hostel in North East India, and curated pan-India experiences. Powered by xtsyonellp.');
    } else {
      const newOgDescription = document.createElement('meta');
      newOgDescription.setAttribute('property', 'og:description');
      newOgDescription.content = 'India\'s most innovative travel brand. Experience XTSY\'s 270° stargazing glass suite, biggest hostel in North East India, and curated pan-India experiences. Powered by xtsyonellp.';
      document.head.appendChild(newOgDescription);
    }
    
    // Enhanced structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "XTSY Travellers Hostel & Luxury",
      "description": "India's biggest hostel in North East India featuring the first 270° stargazing glass suite and highest-rated traveller experience",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Shillong",
        "addressRegion": "Meghalaya", 
        "addressCountry": "India"
      },
      "brand": {
        "@type": "Brand",
        "name": "XTSY",
        "description": "Powered by xtsyonellp"
      },
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "270° Panoramic Glass Suite"
        },
        {
          "@type": "LocationFeatureSpecification", 
          "name": "50+ Guest Capacity"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Biggest Hostel in North East India"
        }
      ],
      "priceRange": "₹₹",
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

  const coreServices = [
    {
      icon: Building2,
      title: "Biggest Hostel in North East India",
      category: "Scale", 
      description: "Northeast India's largest hostel accommodation facility with 100+ beds across multiple room categories.",
      features: ["100+ Bed Capacity", "Multiple Buildings", "Largest in NE India"]
    },
    {
      icon: Star,
      title: "Highest-Rated Traveller Experience",
      category: "Excellence",
      description: "Northeast's highest-rated traveller hostel with exceptional guest reviews and premium service standards.",
      features: ["5-Star Reviews", "Premium Service", "Guest Excellence"]
    },
    {
      icon: Camera,
      title: "270° Panorama Glass Ensuite",
      category: "Luxury",
      description: "India's first 270° glass room in Shillong offering exclusive panoramic mountain view experience with floor-to-ceiling glass walls.",
      features: ["360° Mountain Views", "Glass Architecture", "Exclusive Experience"]
    },
    {
      icon: Users,
      title: "Comprehensive Dormitories",
      category: "Accommodation",
      description: "Mixed, female-only, and economy dormitory options with premium comfort standards for group travel hostel India.",
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-6">About XTSY Travellers Hostel & Luxury</h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Welcome to <strong className="text-slate-800">XTSY — India's most promising travel and hospitality brand</strong>. 
            Based in <strong className="text-slate-800">Shillong and powered by XTSY ONE LLP</strong>, we're redefining the way the world 
            travels in and across India. <strong className="text-slate-800">XTSY stepping into Global Travel Destinations across Asia and EU shortly</strong>.
          </p>
        </section>

        {/* India's First 270° Panorama Glass Ensuite */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-8">India's First 270° Panorama Glass Ensuite</h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-elegant border border-white/50">
            <p className="text-lg text-slate-600 leading-relaxed text-center max-w-4xl mx-auto">
              Our flagship innovation — the <strong className="text-slate-800">XTSY Luxury Glass Suite</strong> — is India's first 270° panoramic stargazing accommodation. 
              It's not just a room; it's an architectural and experiential revolution, rivaling stays in Iceland, Finland, and the Himalayas. 
              <strong className="text-slate-800">Only 1 exclusive suite available in India for the Night</strong> — making it the 
              <strong className="text-slate-800">best honeymoon stay in India</strong> and a <strong className="text-slate-800">luxury stargazing suite India</strong> 
              has never seen before.
            </p>
          </div>
        </section>

        {/* Biggest & Highest-Rated Hostel in Northeast India */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-8">
            Biggest & Highest-Rated Hostel in Northeast India
          </h2>
          <div className="bg-primary rounded-3xl p-8 text-primary-foreground shadow-xl">
            <p className="text-lg leading-relaxed text-center max-w-4xl mx-auto">
              <strong>XTSY Travellers Hostel in Shillong</strong> is the region's largest, most highly reviewed group hostel, with capacity for 50+ guests — 
              ideal for backpackers, student groups, digital nomads or international travel communities. As the 
              <strong> biggest hostel in North East India</strong> and <strong>biggest hostel in Shillong, Meghalaya</strong>, we're also the 
              <strong> highest-rated traveller hostel in North East</strong> according to guest reviews and the leading 
              <strong> group travel hostel India</strong> depends on for authentic experiences.
            </p>
          </div>
        </section>

        {/* Who We're For */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-8">Who We're For</h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-elegant border border-white/50">
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <li className="p-4 bg-slate-50 rounded-xl">
                <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-slate-800">Married Couples</h3>
                <p className="text-slate-600 text-sm">Best honeymoon stay in India</p>
              </li>
              <li className="p-4 bg-slate-50 rounded-xl">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-slate-800">Backpackers & Solo Travelers</h3>
                <p className="text-slate-600 text-sm">Backpacker hostel Northeast India</p>
              </li>
              <li className="p-4 bg-slate-50 rounded-xl">
                <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-slate-800">Group Travel Organizers</h3>
                <p className="text-slate-600 text-sm">Group travel hostel India</p>
              </li>
              <li className="p-4 bg-slate-50 rounded-xl">
                <Camera className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-slate-800">Photographers & Content Creators</h3>
                <p className="text-slate-600 text-sm">Photographer friendly stay India</p>
              </li>
              <li className="p-4 bg-slate-50 rounded-xl">
                <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-slate-800">Stargazers</h3>
                <p className="text-slate-600 text-sm">270° glass room Shillong</p>
              </li>
              <li className="p-4 bg-slate-50 rounded-xl">
                <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-slate-800">Architecture Lovers</h3>
                <p className="text-slate-600 text-sm">Architectural innovation India</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Built in Shillong. Scaling Across India. Ready for the World. */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-8">
            Built in Shillong. Scaling Across India. Ready for the World.
          </h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-elegant border border-white/50">
            <p className="text-lg text-slate-600 leading-relaxed text-center max-w-4xl mx-auto">
              We started in the green hills of Meghalaya. Today, <strong className="text-slate-800">XTSY operates across 7 states in Northeast India</strong> 
              and is rapidly expanding. We are proudly Indian, and globally ambitious — offering travel that feels personal, local, and unforgettable. 
              As a <strong className="text-slate-800">pan India travel brand</strong> <strong className="text-slate-800">powered by xtsyonellp</strong>, 
              we're setting new standards for hospitality excellence.
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

        {/* Book Direct. Travel Deeper. */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-8">Book Direct. Travel Deeper.</h2>
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-elegant border border-white/50">
            <p className="text-lg text-slate-600 mb-6">
              With XTSY - Book your stay or explore our 7-state travel packages today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/booking" 
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-300"
              >
                Book Your Stay
              </a>
              <span className="text-slate-400 self-center">|</span>
              <a 
                href="/travel" 
                className="inline-flex items-center justify-center px-8 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors duration-300"
              >
                Explore Our Tours
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
