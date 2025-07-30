import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Users, Heart, Shield, Award, Zap, Coffee, Wifi, Camera, Leaf, Globe, TrendingUp, Star, Instagram, Smartphone, Headphones } from "lucide-react";

const AboutSection = () => {
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

  const highlights = [
    {
      number: "10k+",
      label: "Gen Z Travelers",
      description: "Young explorers who chose us",
      gradient: "from-pink-500 to-purple-600"
    },
    {
      number: "4.9★",
      label: "Rating",
      description: "From fellow wanderers",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      number: "24/7",
      label: "Vibe Check",
      description: "Always good energy here",
      gradient: "from-green-400 to-blue-500"
    },
    {
      number: "100%",
      label: "Authentic",
      description: "Real experiences, no cap",
      gradient: "from-red-400 to-pink-500"
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

  const trendingFeatures = [
    { icon: Camera, text: "360° Glass Suite Views", trend: "📈 Trending" },
    { icon: Smartphone, text: "Smart Check-in 2026", trend: "🔥 Coming Soon" },
    { icon: Headphones, text: "Silent Disco Nights", trend: "✨ New" },
    { icon: Globe, text: "Tech-Based Experience", trend: "🚀 Future" }
  ];

  return (
    <section id="about" className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Dynamic background animations */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-16 h-16 sm:w-24 sm:h-24 rounded-full blur-xl animate-pulse ${
              i % 4 === 0 ? 'bg-gradient-to-r from-pink-300/30 to-purple-300/30' :
              i % 4 === 1 ? 'bg-gradient-to-r from-blue-300/30 to-cyan-300/30' :
              i % 4 === 2 ? 'bg-gradient-to-r from-green-300/30 to-emerald-300/30' :
              'bg-gradient-to-r from-yellow-300/30 to-orange-300/30'
            }`}
            style={{
              left: `${5 + i * 12}%`,
              top: `${10 + (i * 8) % 60}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${2 + i * 0.2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            #1 Gen Z Choice in India
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-6">
            About XTSY ✨
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Where Gen Z vibes meet authentic travel experiences. We're not just a hostel - 
            we're your base camp for exploring India's hidden gems, making lifelong connections, 
            and creating content that'll make your feed pop! 🔥
          </p>
        </div>

        {/* Trending Features Ticker */}
        <div className="mb-12 overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
          <div className="flex items-center py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
            <Zap className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold">What's Trending at XTSY</span>
          </div>
          <div className="flex animate-scroll space-x-8 py-4 px-4">
            {[...trendingFeatures, ...trendingFeatures].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 min-w-fit">
                <feature.icon className="w-5 h-5 text-purple-600" />
                <span className="text-gray-800 font-medium">{feature.text}</span>
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs">
                  {feature.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-16">
          {/* Our Story - Gen Z Style */}
          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Our Story 📖
                  </h3>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                  Born from a vision to create India's most Gen Z-friendly hostel experience 🚀 
                  We saw young travelers struggling to find authentic, affordable, and Instagram-worthy 
                  stays that actually understood their vibe.
                </p>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                  So we built XTSY - where sustainability meets style, where WiFi is faster than your thoughts, 
                  and where every corner is designed for those perfect shots that'll make your friends jealous! 📸
                </p>
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl">
                  <p className="text-purple-800 font-medium text-center">
                    "No fake vibes, just real experiences" - That's our motto! ✨
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info - Modern Style */}
          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Stay Connected 📱
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">📍 Location</p>
                      <p className="text-gray-600 text-sm">Shillong, Meghalaya, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">📱 WhatsApp</p>
                      <p className="text-gray-600 text-sm">+91 88373 17070</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">🕐 Available</p>
                      <p className="text-gray-600 text-sm">24/7 Support (We never sleep!)</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Follow our journey:</p>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gen Z Features Grid */}
        <div className="mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Why Gen Z Loves Us 💜
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {genZFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-md border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group overflow-hidden">
                <CardContent className="p-6 text-center relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="text-3xl mb-3">{feature.emoji}</div>
                  <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2 text-lg">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech-Based Hostel 2026 Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 animate-pulse">
              <Zap className="w-5 h-5" />
              🚀 Revolutionary Announcement
            </div>
            <h3 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
              India's First Tech-Based Hostel 🤖
            </h3>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
              By 2026, XTSY will transform into India's first fully tech-integrated hostel experience. 
              We're revolutionizing how young travelers interact with accommodation through cutting-edge technology! 
            </p>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl inline-block text-lg font-semibold shadow-2xl hover-scale">
              Coming 2026: The Future of Travel ✨
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {techFeatures.map((feature, index) => (
              <Card key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group overflow-hidden animate-fade-in">
                <CardContent className="p-8 text-center relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {feature.status}
                    </span>
                  </div>

                  <div className="text-4xl mb-4 group-hover:animate-bounce">{feature.emoji}</div>
                  
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h4 className="font-bold text-gray-800 mb-3 text-xl">
                    {feature.title}
                  </h4>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Tech Progress Bar */}
                  <div className="mt-6">
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-1000 ${
                          index === 0 ? 'w-3/4' : index === 1 ? 'w-1/2' : 'w-1/4'
                        }`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {index === 0 ? '75% Complete' : index === 1 ? '50% Complete' : '25% Complete'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Vision Statement */}
          <div className="mt-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;charset=utf-8,%3csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cg fill=%27none%27 fill-rule=%27evenodd%27%3e%3cg fill=%27%23ffffff%27 fill-opacity=%270.1%27%3e%3cpath d=%27m30 30c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z%27/%3e%3c/g%3e%3c/g%3e%3c/svg%3e')]"></div>
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-6">🚀</div>
              <h4 className="text-3xl font-bold mb-6">
                The Future is Smart, Sustainable & Social
              </h4>
              <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
                Imagine checking in with facial recognition, controlling your room with voice commands, 
                getting personalized travel recommendations from AI, and connecting with fellow travelers 
                through our smart social platform. This isn't science fiction - this is XTSY 2026! 
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
                  <div className="text-2xl mb-2">🧠</div>
                  <h5 className="font-semibold mb-2">AI-Powered</h5>
                  <p className="text-sm opacity-80">Smart recommendations and assistance</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
                  <div className="text-2xl mb-2">🌿</div>
                  <h5 className="font-semibold mb-2">Eco-Smart</h5>
                  <p className="text-sm opacity-80">Sustainable tech solutions</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
                  <div className="text-2xl mb-2">🌐</div>
                  <h5 className="font-semibold mb-2">Connected</h5>
                  <p className="text-sm opacity-80">Global community platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 sm:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              The Numbers Don't Lie! 📊
            </h3>
            <p className="text-lg opacity-90">
              See why we're the go-to choice for young travelers worldwide
            </p>
        </div>

        {/* Competitive Advantage Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
              <Award className="w-5 h-5" />
              🏆 Why We're Different
            </div>
            <h3 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Beyond Traditional Hostel Chains 🚀
            </h3>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
              While Zostel, The Hosteller, goSTOPS, Moustache Hostels, and Madpackers offer standardized experiences, 
              XTSY delivers something revolutionary - India's first tech-integrated, culturally immersive, 
              and truly personalized hostel experience in the heart of Northeast India.
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Traditional Chains */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-400 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-700">Traditional Hostel Chains</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-gray-600">•</span>
                    </div>
                    <p className="text-gray-600">Standardized experiences across all locations</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-gray-600">•</span>
                    </div>
                    <p className="text-gray-600">Limited local cultural integration</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-gray-600">•</span>
                    </div>
                    <p className="text-gray-600">Basic technology and amenities</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-gray-600">•</span>
                    </div>
                    <p className="text-gray-600">Generic accommodation options</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-200 rounded-xl">
                  <p className="text-sm text-gray-600 text-center">
                    <strong>Zostel, The Hosteller, goSTOPS, Moustache Hostels, Madpackers</strong> - 
                    Good for basic stays but lack uniqueness
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* XTSY Advantage */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    XTSY Revolutionary Experience
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-white">✓</span>
                    </div>
                    <p className="text-gray-700"><strong>Tech-Integrated:</strong> India's first smart hostel with AI & IoT by 2026</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-white">✓</span>
                    </div>
                    <p className="text-gray-700"><strong>Cultural Immersion:</strong> Deep Northeast India authentic experiences</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-white">✓</span>
                    </div>
                    <p className="text-gray-700"><strong>Instagram-Worthy:</strong> 270° Glass Suite & picture-perfect locations</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-white">✓</span>
                    </div>
                    <p className="text-gray-700"><strong>Gen Z Focused:</strong> Purpose-built for young, tech-savvy travelers</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white">
                  <p className="text-sm text-center font-medium">
                    🏆 <strong>XTSY Travellers Hostel</strong> - 
                    The future of travel accommodation in India
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🌍</div>
                <h5 className="font-bold text-gray-800 mb-2">Unique Location</h5>
                <p className="text-gray-600 text-sm">
                  Unlike chain hostels in touristy cities, we're in authentic Shillong - 
                  the gateway to unexplored Northeast India
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🤖</div>
                <h5 className="font-bold text-gray-800 mb-2">Tech Innovation</h5>
                <p className="text-gray-600 text-sm">
                  While others offer basic stays, we're pioneering AI-powered, 
                  IoT-connected smart accommodation experiences
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h5 className="font-bold text-gray-800 mb-2">Personalized Service</h5>
                <p className="text-gray-600 text-sm">
                  No cookie-cutter approach - every guest gets tailored 
                  recommendations and authentic local experiences
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">💎</div>
                <h5 className="font-bold text-gray-800 mb-2">Premium Value</h5>
                <p className="text-gray-600 text-sm">
                  Luxury glass suites to budget dorms - better value 
                  than overpriced chain alternatives
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose XTSY Over Competitors */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 sm:p-12 text-white">
            <div className="text-center mb-8">
              <h4 className="text-3xl font-bold mb-4">
                Why Smart Travelers Choose XTSY Over Chain Hostels 💡
              </h4>
              <p className="text-lg opacity-90 max-w-4xl mx-auto">
                When comparing XTSY with popular chains like Zostel, The Hosteller, goSTOPS, 
                Moustache Hostels, and Madpackers, the difference is clear - we offer what they can't.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h5 className="text-xl font-bold mb-3">Innovation Leader</h5>
                <p className="text-sm opacity-90">
                  While chain hostels stick to basics, we're revolutionizing hospitality 
                  with cutting-edge technology and forward-thinking amenities.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h5 className="text-xl font-bold mb-3">Authentic Culture</h5>
                <p className="text-sm opacity-90">
                  Experience real Northeast India culture, not sanitized tourist versions 
                  offered by standardized hostel chains.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h5 className="text-xl font-bold mb-3">Exclusive Location</h5>
                <p className="text-sm opacity-90">
                  Biggest hostel in Shillong with exclusive access to hidden gems 
                  that mainstream chains simply can't match.
                </p>
              </div>
            </div>

            <div className="text-center mt-10">
              <p className="text-lg font-semibold mb-4">
                Choose Experience Over Generic 🌟
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                  <span className="text-sm">#NotYourTypicalHostel</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                  <span className="text-sm">#BeyondChainExperience</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                  <span className="text-sm">#XTSYDifference</span>
                </div>
              </div>
            </div>
          </div>
        </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${highlight.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
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
          
          <div className="text-center mt-12">
            <p className="text-xl font-semibold mb-4">
              Ready to join the community? 🎉
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                <span className="text-sm font-medium">#XTSYVibes</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                <span className="text-sm font-medium">#GenZTravel</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                <span className="text-sm font-medium">#LiveTheShillongVibe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {/* Custom CSS for animations */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default AboutSection;