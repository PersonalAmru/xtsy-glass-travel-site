
import { MapPin, Users, Calendar, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Deals = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col px-3 sm:px-4 pt-14 sm:pt-16 pb-6 sm:pb-8 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-r from-orange-400/30 to-yellow-400/30 rounded-full blur-xl animate-pulse"
              style={{
                left: `${5 + i * 12}%`,
                top: `${10 + i * 15}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${4 + i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-120px)]">
          {/* Hero Content */}
          <div className="text-center flex-1 flex flex-col justify-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-serif-sans bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
              Free Taxi to XTSY
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-seasons leading-relaxed mb-12 drop-shadow-lg">
              Complimentary pickup service from major Shillong locations for groups of 4 or more guests
            </p>

            {/* Hero Taxi Image */}
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/0ef988f7-b7f3-4d1f-80e3-fc2a04acd9cb.png"
                alt="Taxi Service" 
                className="max-w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 brightness-110"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Free Taxi Offer Section */}
      <section className="py-16 px-4 relative bg-gradient-to-br from-slate-100 via-white to-slate-100">
        <div className="container mx-auto max-w-6xl">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-yellow-50/95 to-orange-50/95 border-2 border-yellow-400/50 shadow-2xl overflow-hidden relative">
            <CardHeader className="pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <MapPin className="h-12 w-12 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-serif-sans">
                    Free Taxi to XTSY
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-lg font-seasons font-semibold">
                    Complimentary pickup service for groups of 4 or more
                  </CardDescription>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-4 py-2 text-lg">
                  FREE SERVICE
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Pickup Points Map Section */}
              <div className="bg-yellow-100/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-300/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 font-serif-sans">
                  <MapPin className="h-6 w-6 text-yellow-600" />
                  Pickup Points in Shillong
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Police Bazaar",
                    "Golf Links", 
                    "Polo Market",
                    "Civil Hospital/Barik Point",
                    "Other major points in Shillong"
                  ].map((point, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-yellow-400/30 shadow-sm">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-gray-800 font-seasons font-semibold">{point}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-yellow-200/60 rounded-xl border border-yellow-400/40">
                  <p className="text-gray-800 font-seasons text-center font-semibold">
                    <strong>🚕 Free taxi service connects all major Shillong locations to XTSY Travellers Hostel inside the pines! 🌲</strong>
                  </p>
                </div>
              </div>

              {/* Eligibility Section */}
              <div className="bg-green-100/80 border border-green-400/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 font-serif-sans">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Eligibility Requirements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-gray-800 font-bold font-seasons">Minimum Booking</p>
                      <p className="text-gray-700 font-seasons font-semibold">4 people</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-gray-800 font-bold font-seasons">Minimum Stay</p>
                      <p className="text-gray-700 font-seasons font-semibold">2 nights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center pt-4">
                <Button 
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-seasons"
                  onClick={() => window.open('https://wa.me/918837317070?text=Hi XTSY! I am interested in your Free Taxi service for my group booking. Please provide more details.', '_blank')}
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Book Free Taxi Service
                </Button>
                <p className="text-gray-600 text-sm mt-3 font-seasons font-semibold">
                  Click to chat with us on WhatsApp for instant booking
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Deals;
