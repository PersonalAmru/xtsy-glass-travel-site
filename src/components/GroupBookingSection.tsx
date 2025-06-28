
import { useState } from "react";
import { Users, Calendar, MessageSquare, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const GroupBookingSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    requirements: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format the message for WhatsApp without emojis
    const message = `Group/Entire Property Booking Inquiry

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Check-in Date: ${formData.checkIn}
Check-out Date: ${formData.checkOut}
Number of Guests: ${formData.guests}

Additional Requirements:
${formData.requirements}

Looking forward to your response!`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/918837317070?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-900/60 via-slate-800/60 to-slate-900/60 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-36 h-36 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-xl animate-pulse"
            style={{
              right: `${5 + i * 25}%`,
              bottom: `${10 + i * 20}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${5 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent" style={{ fontFamily: "'Cormorant Garmond', serif" }}>
            Group & Entire Property Booking
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Planning for a group trip or looking for the entire property for your special events? Let us know your requirements and we'll get back to you!
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garmond', serif" }}>
              Get a Custom Quote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>Full Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-white/90 border-teal-300/40 text-black h-12 font-semibold"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>Email Address *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-white/90 border-teal-300/40 text-black h-12 font-semibold"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>Phone Number *</label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="bg-white/90 border-teal-300/40 text-black h-12 font-semibold"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Calendar className="h-4 w-4" />
                    Check-in Date *
                  </label>
                  <Input
                    name="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    min={today}
                    required
                    className="bg-white/90 border-teal-300/40 text-black h-12 font-semibold"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Calendar className="h-4 w-4" />
                    Check-out Date *
                  </label>
                  <Input
                    name="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    min={formData.checkIn || today}
                    required
                    className="bg-white/90 border-teal-300/40 text-black h-12 font-semibold"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Users className="h-4 w-4" />
                    Number of Guests *
                  </label>
                  <Input
                    name="guests"
                    type="number"
                    value={formData.guests}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="bg-white/90 border-teal-300/40 text-black h-12 font-semibold"
                    placeholder="Total guests"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <MessageSquare className="h-4 w-4" />
                  Additional Requirements
                </label>
                <Textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="bg-white/90 border-teal-300/40 text-black min-h-[120px] font-semibold"
                  placeholder="Tell us about any special requirements, meal preferences, transportation needs, or any other details..."
                />
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold text-xl px-12 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Send className="h-6 w-6 mr-3" />
                  Send via WhatsApp
                </Button>
                <p className="text-gray-400 text-sm mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  You'll be redirected to WhatsApp with your details pre-filled
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GroupBookingSection;
