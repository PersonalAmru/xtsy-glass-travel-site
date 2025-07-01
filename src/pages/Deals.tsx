
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
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-xl animate-pulse"
              style={{
                left: `${5 + i * 12}%`,
                top: `${10 + i * 15}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${4 + i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-serif-sans bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Exclusive Deals & Offers
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-seasons leading-relaxed">
            Discover amazing travel deals designed to make your Shillong adventure unforgettable and affordable
          </p>
        </div>
      </section>

      {/* Free Taxi Offer Section */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-2 border-yellow-400/30 shadow-2xl overflow-hidden relative">
            {/* Background taxi image */}
            <div className="absolute top-4 right-4 opacity-20">
              <img 
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=200&q=80" 
                alt="Yellow Taxi" 
                className="h-32 w-32 object-cover rounded-full"
              />
            </div>
            
            <CardHeader className="pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=80&q=80" 
                    alt="Yellow Taxi" 
                    className="h-12 w-12 object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif-sans">
                    Free Taxi to XTSY
                  </CardTitle>
                  <CardDescription className="text-yellow-200 text-lg font-seasons">
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
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 font-serif-sans">
                  <MapPin className="h-6 w-6 text-yellow-400" />
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
                    <div key={index} className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-white font-seasons font-semibold">{point}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
                  <p className="text-white font-seasons text-center">
                    <strong>🚕 Free taxi service connects all major Shillong locations to XTSY Travellers Hostel inside the pines! 🌲</strong>
                  </p>
                </div>
              </div>

              {/* Eligibility Section */}
              <div className="bg-green-900/20 border border-green-400/30 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 font-serif-sans">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  Eligibility Requirements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-white font-bold font-seasons">Minimum Booking</p>
                      <p className="text-green-200 font-seasons">4 people</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-white font-bold font-seasons">Minimum Stay</p>
                      <p className="text-green-200 font-seasons">2 nights</p>
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
                  <img 
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=40&q=80" 
                    alt="Taxi" 
                    className="h-5 w-5 mr-2 rounded-full object-cover"
                  />
                  Book Free Taxi Service
                </Button>
                <p className="text-gray-300 text-sm mt-3 font-seasons">
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
