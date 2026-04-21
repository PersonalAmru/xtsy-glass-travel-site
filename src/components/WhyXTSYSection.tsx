/**
 * Why Experience by XTSYs Section
 * Showcases unique value propositions after tour packages
 */

import { 
  Shield, 
  Users, 
  MapPin, 
  Star, 
  Clock, 
  Sparkles,
  Mountain,
  Camera,
  Home,
  Wifi
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Shield,
    title: 'Verified Local Guides',
    description: 'All our guides are vetted locals with deep knowledge of Meghalaya\'s hidden gems',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Home,
    title: 'Stay + Experience',
    description: 'Seamless packages combining premium hostel stays with curated adventures',
    gradient: 'from-primary to-orange-500',
  },
  {
    icon: Users,
    title: 'Small Group Tours',
    description: 'Intimate groups of 4-12 travelers for authentic, personalized experiences',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: MapPin,
    title: 'Offbeat Destinations',
    description: 'Access hidden waterfalls, secret caves, and villages tourists never see',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Camera,
    title: 'Instagram-Worthy',
    description: 'Every location is photographed and curated for unforgettable memories',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Clock,
    title: '24/7 Travel Support',
    description: 'Round-the-clock assistance from booking to checkout and beyond',
    gradient: 'from-blue-500 to-indigo-600',
  },
];

const stats = [
  { value: '3000+', label: 'Happy Travelers', icon: Users },
  { value: '30+', label: 'Tour Packages', icon: MapPin },
  { value: '4.9', label: 'Average Rating', icon: Star },
  { value: '100%', label: 'Verified Reviews', icon: Shield },
];

const WhyXTSYSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Why Choose Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Experience by XTSYs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're not just a hostel — we're your gateway to authentic Northeast India adventures
          </p>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-0 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card 
              key={idx} 
              className="group border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyXTSYSection;
