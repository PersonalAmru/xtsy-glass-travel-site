
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Users, MessageSquare } from "lucide-react";

const GroupBookingSection = () => {
  const [formData, setFormData] = useState({
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
    <section className="py-20 px-4 bg-gradient-to-br from-yellow-400/10 via-orange-400/15 to-red-400/10 relative overflow-hidden">
      {/* Enhanced tropical background animations */}
      <div className="absolute inset-0">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute w-28 h-28 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-xl animate-pulse"
            style={{
              left: `${5 + i * 14}%`,
              bottom: `${10 + i * 12}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${3.5 + i * 0.4}s`
            }}
          />
        ))}
        {/* Palm leaf effects */}
        <div className="absolute inset-0 opacity-15">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-full blur-2xl animate-bounce"
              style={{
                right: `${8 + i * 25}%`,
                top: `${15 + i * 20}%`,
                animationDelay: `${i * 1.3}s`,
                animationDuration: `${5.5 + i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-serif-sans">
            Group & Entire Property Booking
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-seasons">
            Planning for a group trip or looking for the entire property for your special events? Let us know your requirements and we'll get back to you!
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="bg-white/95 border-purple-300/60 text-black h-12 font-seasons"
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
                  className="bg-white/95 border-purple-300/60 text-black h-12 font-seasons"
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
                className="bg-white/95 border-purple-300/60 text-black h-12 font-seasons"
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
                className="bg-white/95 border-purple-300/60 text-black resize-none font-seasons"
              />
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-12 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl font-seasons"
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
