
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Users, MessageSquare, User, Mail, MapPin } from "lucide-react";

const GroupBookingForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
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
    
    const guestCount = parseInt(formData.guests);
    if (guestCount < 26) {
      alert("Group bookings require a minimum of 26 guests");
      return;
    }

    const message = `Group Booking Inquiry

Full Name: ${formData.fullName}
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
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
      <h3 className="text-2xl font-bold text-white text-center mb-6 font-serif-sans">
        Group Booking
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white font-bold flex items-center gap-2 font-seasons">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
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
            Number of Guests (Minimum 26)
          </Label>
          <Input
            id="guests"
            name="guests"
            type="number"
            min="26"
            max="200"
            value={formData.guests}
            onChange={handleInputChange}
            required
            placeholder="Enter number of guests (min 26)"
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
            Get Group Quote
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GroupBookingForm;
