
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Globe, Mountain, Coffee, Wifi } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We believe in creating meaningful connections between travelers from around the world."
    },
    {
      icon: Users,
      title: "Gen Z Spirit",
      description: "Our hostel is designed by and for the next generation of conscious travelers."
    },
    {
      icon: Globe,
      title: "Cultural Immersion",
      description: "Experience authentic local culture through our tribal host partnerships."
    },
    {
      icon: Mountain,
      title: "Nature Connection",
      description: "Nestled in the beautiful hills of Shillong, we offer a gateway to nature's wonders."
    }
  ];

  const features = [
    "24/7 Security & Safety",
    "High-Speed Wi-Fi",
    "Community Kitchen",
    "Laundry Services",
    "Local Tours & Activities",
    "Cultural Workshops",
    "Eco-Friendly Practices",
    "Flexible Check-in/out"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col px-3 sm:px-4 pt-14 sm:pt-16 pb-6 sm:pb-8 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90">
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-center h-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-serif-sans bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
              About XTSY
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-seasons leading-relaxed">
              Where Gen Z travelers discover authentic experiences in the heart of Meghalaya
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-serif-sans">Our Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 leading-relaxed font-seasons">
                    XTSY was born from a vision to create a space where young travelers could connect, 
                    explore, and grow together. Founded by passionate Gen Z entrepreneurs, we understand 
                    the modern traveler's need for authentic experiences, sustainable practices, and 
                    meaningful connections.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-serif-sans">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 leading-relaxed font-seasons">
                    To provide budget-friendly accommodation that doesn't compromise on quality, 
                    while fostering cultural exchange and supporting local communities through 
                    our tribal host partnerships and sustainable tourism practices.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/db863c94-a5db-4aa4-afa6-e11364e4b9d7.png"
                alt="XTSY Hostel" 
                className="max-w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif-sans">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-seasons">
              What drives us to create exceptional experiences for every traveler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 font-serif-sans">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-seasons">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif-sans">
              Why Choose XTSY?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-seasons">
              We've thought of everything to make your stay comfortable and memorable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700 font-seasons font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Partnerships Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/0ef988f7-b7f3-4d1f-80e3-fc2a04acd9cb.png"
                alt="Local Culture" 
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif-sans">
                Local Partnerships
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-seasons">
                We work closely with local tribal communities to offer authentic cultural experiences. 
                Our partnerships ensure that tourism benefits local families while preserving traditional 
                ways of life and protecting the natural environment.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-100 text-orange-600">Cultural Tours</Badge>
                  <span className="text-gray-600 font-seasons">Traditional craft workshops</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-600">Local Food</Badge>
                  <span className="text-gray-600 font-seasons">Authentic Khasi cuisine experiences</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-600">Community Impact</Badge>
                  <span className="text-gray-600 font-seasons">Supporting local livelihoods</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif-sans">
            Ready to Experience XTSY?
          </h2>
          <p className="text-xl text-white/90 mb-8 font-seasons">
            Join our community of conscious travelers and create memories that last a lifetime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-300 font-seasons"
            >
              Book Your Stay
            </button>
            <button 
              onClick={() => window.open('https://wa.me/918837317070?text=Hi XTSY! I would like to know more about your hostel and accommodation options.', '_blank')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-colors duration-300 font-seasons"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
