
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, MessageSquare, User, Mail, MapPin, Building } from "lucide-react";

const B2BBookingForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    designation: "",
    fromCity: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    bookingType: "",
    requirements: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      bookingType: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const guestCount = parseInt(formData.guests);
    if (guestCount < 26) {
      alert("B2B Corporate bookings require a minimum of 26 guests and maximum 60 guests");
      return;
    }

    if (guestCount > 60) {
      alert("B2B Corporate bookings are limited to maximum 60 guests");
      return;
    }

    const estimatedCost = guestCount * 750;

    const message = `🏢 B2B Corporate Booking Inquiry

👤 Full Name: ${formData.fullName}
📧 Email: ${formData.email}
🏢 Company Name: ${formData.companyName}
💼 Designation: ${formData.designation}
🏙️ From City: ${formData.fromCity}
📅 Check-in Date: ${formData.checkIn}
📅 Check-out Date: ${formData.checkOut}
👥 Number of Guests: ${formData.guests}
🏷️ Booking Type: ${formData.bookingType}
💰 Estimated Stay Cost: ₹${estimatedCost.toLocaleString()}
📝 Additional Requirements: ${formData.requirements}

Looking forward to your response.

Best regards`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918837317070?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Calculate estimated cost
  const guestCount = parseInt(formData.guests) || 0;
  const estimatedCost = guestCount >= 26 ? guestCount * 750 : 0;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get tomorrow's date for minimum checkout
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center mb-3 sm:mb-4 md:mb-6 font-serif-sans">
        🏢 B2B Corporate Booking
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="fullName" className="text-white font-bold flex items-center gap-2 font-seasons text-xs sm:text-sm md:text-base">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              👤 Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
              className="bg-white/95 border-gray-300/60 text-black h-8 sm:h-10 md:h-12 font-seasons text-xs sm:text-sm md:text-base"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="email" className="text-white font-bold flex items-center gap-2 font-seasons text-xs sm:text-sm md:text-base">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              📧 Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              className="bg-white/95 border-gray-300/60 text-black h-8 sm:h-10 md:h-12 font-seasons text-xs sm:text-sm md:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="companyName" className="text-white font-bold flex items-center gap-2 font-seasons text-xs sm:text-sm md:text-base">
              <Building className="h-3 w-3 sm:h-4 sm:w-4" />
              🏢 Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              placeholder="Enter your company name"
              className="bg-white/95 border-gray-300/60 text-black h-8 sm:h-10 md:h-12 font-seasons text-xs sm:text-sm md:text-base"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="designation" className="text-white font-bold flex items-center gap-2 font-seasons text-xs sm:text-sm md:text-base">
              💼 Designation
            </Label>
            <Input
              id="designation"
              name="designation"
              type="text"
              value={formData.designation}
              onChange={handleInputChange}
              required
              placeholder="Your designation"
              className="bg-white/95 border-gray-300/60 text-black h-8 sm:h-10 md:h-12 font-seasons text-xs sm:text-sm md:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="fromCity" className="text-white font-bold flex items-center gap-2 font-seasons text-xs sm:text-sm md:text-base">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              🏙️ From City
            </Label>
            <Input
              id="fromCity"
              name="fromCity"
              type="text"
              value={formData.fromCity}
              onChange={handleInputChange}
              required
              placeholder="Which city are you traveling from?"
              className="bg-white/95 border-gray-300/60 text-black h-8 sm:h-10 md:h-12 font-seasons text-xs sm:text-sm md:text-base"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label className="text-white font-bold flex items-center gap-2 font-seasons text-xs sm:text-sm md:text-base">
              🏷️ Booking Type
            </Label>
            <Select onValueChange={handleSelectChange} required>
              <SelectTrigger className="bg-white/95 border-gray-300/60 text-black h-8 sm:h-10 md:h-12 font-seasons text-xs sm:text-sm md:text-base">
                <SelectValue placeholder="Select booking type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">🧑‍💼 Individual/Agent</SelectItem>
                <SelectItem value="company">🏢 Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="checkIn" className="text-white font-bold flex items-center gap-2 font-seasons text-xs sm:text-sm md:text-base">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              📅 Check-in Date
            </Label>
            <Input
              id="checkIn"
              name="checkIn"
              type="date"
              value={formData.checkIn}
              min={today}
              onChange={handleInputChange}
              required
              className="bg-white/95 border-gray-300/60 text-black h-8 sm:h-10 md:h-12 font-seasons text-xs sm:text-sm md:text-base"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="checkOut" className="text-white font-bold flex items-center gap-2 font-seasons text-xs sm:text-sm md:text-base">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              📅 Check-out Date
            </Label>
            <Input
              id="checkOut"
              name="checkOut"
              type="date"
              value={formData.checkOut}
              min={formData.checkIn ? (new Date(new Date(formData.checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]) : tomorrowStr}
              onChange={handleInputChange}
              required
              className="bg-white/95 border-gray-300/60 text-black h-8 sm:h-10 md:h-12 font-seasons text-xs sm:text-sm md:text-base"
            />
          </div>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="guests" className="text-white font-bold flex items-center gap-2 font-seasons text-xs sm:text-sm md:text-base">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            👥 Number of Guests (Min 26, Max 60)
          </Label>
          <Input
            id="guests"
            name="guests"
            type="number"
            min="26"
            max="60"
            value={formData.guests}
            onChange={handleInputChange}
            required
            placeholder="Enter number of guests (26-60)"
            className="bg-white/95 border-gray-300/60 text-black h-8 sm:h-10 md:h-12 font-seasons text-xs sm:text-sm md:text-base"
          />
          {guestCount >= 26 && guestCount <= 60 && (
            <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-2 sm:p-3 mt-2">
              <p className="text-blue-100 font-bold text-xs sm:text-sm md:text-base">
                💰 Estimated Stay Cost: ₹{estimatedCost.toLocaleString()}
              </p>
              <p className="text-blue-200 text-xs sm:text-sm">
                ✨ (₹750 per guest average - excludes additional services)
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="requirements" className="text-white font-bold flex items-center gap-2 font-seasons text-xs sm:text-sm md:text-base">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            📝 Additional Requirements
          </Label>
          <Textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            placeholder="Tell us about any special requirements, event details, dietary preferences, accessibility needs, breakfast/dinner/BBQ/bonfire services, or other concerns..."
            rows={3}
            className="bg-white/95 border-gray-300/60 text-black resize-none font-seasons text-xs sm:text-sm md:text-base"
          />
        </div>

        <div className="text-center">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-white hover:bg-gray-200 text-black font-bold px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl font-seasons"
          >
            💼 Get Corporate Quote
          </Button>
        </div>
      </form>
    </div>
  );
};

export default B2BBookingForm;
