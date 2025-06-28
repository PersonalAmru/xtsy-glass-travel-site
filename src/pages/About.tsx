
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Users, Leaf, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400/10 via-orange-400/15 to-red-400/10">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-24 h-24 bg-gradient-to-r from-yellow-400/15 to-orange-400/15 rounded-full blur-xl animate-pulse"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + i * 0.4}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent font-serif-sans">
            About XTSY
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-seasons">
            Pioneering sustainable tourism in Northeast India, one stay at a time
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-6xl space-y-12">
          
          {/* Our Story */}
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white font-serif-sans">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 font-seasons leading-relaxed">
              <p className="mb-4">
                XTSY (Ecstasy) was born from a passion to showcase the untouched beauty of Shillong and the Northeast region of India. 
                What started as a single travellers hostel has evolved into a hospitality brand committed to providing authentic experiences 
                while preserving the natural and cultural heritage of Meghalaya.
              </p>
              <p className="mb-4">
                Located in the heart of Shillong, the "Scotland of the East," XTSY offers two distinct properties: 
                XTSY Travellers Hostel for budget-conscious adventurers and XTSY Luxury for those seeking premium comfort. 
                Our properties serve as gateways to explore the living root bridges, pristine waterfalls, and vibrant local culture.
              </p>
              <p>
                We believe that travel should be transformative, not just for our guests but for the local communities we serve. 
                Through sustainable practices and community partnerships, we're building bridges between travelers and the rich heritage of Northeast India.
              </p>
            </CardContent>
          </Card>

          {/* Our Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-white font-serif-sans">Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm font-seasons">
                  Committed to eco-friendly practices and preserving Northeast India's natural beauty for future generations.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-white font-serif-sans">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm font-seasons">
                  Supporting local communities through employment, cultural exchange, and responsible tourism practices.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-white font-serif-sans">Hospitality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm font-seasons">
                  Providing warm, authentic experiences that reflect the genuine hospitality of Northeast Indian culture.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-white font-serif-sans">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm font-seasons">
                  Continuously striving to exceed expectations while maintaining the highest standards of service and comfort.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Vision */}
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white font-serif-sans">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 font-seasons leading-relaxed">
              <p className="mb-4">
                To become the leading hostel chain across Northeast India, creating a network of sustainable accommodations 
                that celebrate local culture while providing world-class hospitality. We envision XTSY properties in every major 
                destination across the seven sister states, each one designed to showcase the unique character of its location.
              </p>
              <p className="mb-4">
                Our expansion plans include properties in Gangtok, Tezpur, Imphal, Aizawl, Kohima, Itanagar, and Agartala, 
                creating a comprehensive network for travelers exploring the Northeast. Each new property will maintain our 
                commitment to sustainability, community development, and authentic cultural experiences.
              </p>
              <p>
                Through this network, we aim to facilitate sustainable tourism that benefits local communities, preserves 
                cultural heritage, and promotes the Northeast as a must-visit destination for conscious travelers from around the world.
              </p>
            </CardContent>
          </Card>

          {/* Our Properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white font-serif-sans">XTSY Travellers Hostel</CardTitle>
                <CardDescription className="text-gray-300 font-seasons">Budget-friendly accommodation</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm font-seasons leading-relaxed">
                <p>
                  Our flagship property designed for backpackers and budget travelers. Featuring comfortable dormitories, 
                  common lounges, and all essential amenities. Perfect for solo travelers, groups, and anyone looking to 
                  experience Shillong without breaking the bank. The hostel fosters a community atmosphere where travelers 
                  from around the world connect and share their adventures.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white font-serif-sans">XTSY Luxury</CardTitle>
                <CardDescription className="text-gray-300 font-seasons">Premium hospitality experience</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm font-seasons leading-relaxed">
                <p>
                  Our luxury property offers private rooms with premium amenities, personalized service, and stunning views 
                  of the Shillong landscape. Designed for travelers seeking comfort and privacy while exploring the region. 
                  Features include mountain and river views, premium bedding, and dedicated concierge services to enhance 
                  your Northeast India experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
