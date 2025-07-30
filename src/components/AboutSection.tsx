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

  const trendingFeatures = [
    { icon: Camera, text: "360° Glass Suite Views", trend: "📈 Trending" },
    { icon: Smartphone, text: "Digital Check-in", trend: "🔥 Hot" },
    { icon: Headphones, text: "Silent Disco Nights", trend: "✨ New" },
    { icon: Globe, text: "Cultural Exchange Program", trend: "🌟 Popular" }
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