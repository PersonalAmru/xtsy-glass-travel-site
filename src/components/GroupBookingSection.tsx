
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Users, MessageSquare, User, Mail, MapPin } from "lucide-react";

const GroupBookingSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    fromCity: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    requirements: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Group Booking Inquiry

Name: ${formData.name}
Email: ${formData.email}
From City: ${formData.fromCity}
Check-in Date: ${formData.checkIn}
Check-out Date: ${formData.checkOut}
Number of Guests: ${formData.guests}
Additional Requirements: ${formData.requirements}

Looking forward to your response.

Best regards`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918837317070?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get tomorrow's date for minimum checkout
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-900/90 relative overflow-hidden">
      {/* Enhanced background animations */}
      <div className="absolute inset-0">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute w-28 h-28 bg-gradient-to-r from-white/5 to-gray-300/5 rounded-full blur-xl animate-pulse"
            style={{
              left: `${5 + i * 14}%`,
              bottom: `${10 + i * 12}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${3.5 + i * 0.4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif-sans">
            Group & Entire Property Booking
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-seasons">
            Planning for a group trip or looking for the entire property for your special events? Let us know your requirements and we'll get back to you!
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-bold flex items-center gap-2 font-seasons">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="bg-white/95 border-gray-300/60 text-black h-12 font-seasons"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-bold flex items-center gap-2 font-seasons">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  className="bg-white/95 border-gray-300/60 text-black h-12 font-seasons"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromCity" className="text-white font-bold flex items-center gap-2 font-seasons">
                  <MapPin className="h-4 w-4" />
                  From City
                </Label>
                <Input
                  id="fromCity"
                  name="fromCity"
                  type="text"
                  value={formData.fromCity}
                  onChange={handleInputChange}
                  required
                  placeholder="Which city are you traveling from?"
                  className="bg-white/95 border-gray-300/60 text-black h-12 font-seasons"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="checkIn" className="text-white font-bold flex items-center gap-2 font-seasons">
                  <Calendar className="h-4 w-4" />
                  Check-in Date
                </Label>
                <Input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  value={formData.checkIn}
                  min={today}
                  onChange={handleInputChange}
                  required
                  className="bg-white/95 border-gray-300/60 text-black h-12 font-seasons"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOut" className="text-white font-bold flex items-center gap-2 font-seasons">
                  <Calendar className="h-4 w-4" />
                  Check-out Date
                </Label>
                <Input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  value={formData.checkOut}
                  min={formData.checkIn ? (new Date(new Date(formData.checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]) : tomorrowStr}
                  onChange={handleInputChange}
                  required
                  className="bg-white/95 border-gray-300/60 text-black h-12 font-seasons"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests" className="text-white font-bold flex items-center gap-2 font-seasons">
                <Users className="h-4 w-4" />
                Number of Guests
              </Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max="100"
                value={formData.guests}
                onChange={handleInputChange}
                required
                placeholder="Enter number of guests"
                className="bg-white/95 border-gray-300/60 text-black h-12 font-seasons"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-white font-bold flex items-center gap-2 font-seasons">
                <MessageSquare className="h-4 w-4" />
                Additional Requirements
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="Tell us about any special requirements, event details, dietary preferences, accessibility needs, or other concerns..."
                rows={4}
                className="bg-white/95 border-gray-300/60 text-black resize-none font-seasons"
              />
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="bg-white hover:bg-gray-200 text-black font-bold px-12 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl font-seasons"
              >
                Get a Custom Quote
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GroupBookingSection;
