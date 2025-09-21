import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, MapPin, Phone } from "lucide-react";

interface FormData {
  guestName: string;
  email: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  specialRequests: string;
}

interface GuestDetailsFormProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

export const GuestDetailsForm = ({ formData, onInputChange }: GuestDetailsFormProps) => {
  return (
    <div className="space-y-8">
      {/* Primary Guest Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-orange-500" />
          Guest Information *
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="guestName">Full Name *</Label>
            <Input 
              id="guestName" 
              value={formData.guestName} 
              onChange={e => onInputChange("guestName", e.target.value)} 
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email} 
              onChange={e => onInputChange("email", e.target.value)} 
              placeholder="your@email.com"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
            <Input 
              id="whatsappNumber" 
              value={formData.whatsappNumber} 
              onChange={e => onInputChange("whatsappNumber", e.target.value)} 
              placeholder="+91 9876543210"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Address Details *
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Full Address *</Label>
            <Textarea 
              id="address" 
              value={formData.address} 
              onChange={e => onInputChange("address", e.target.value)} 
              placeholder="Enter your complete address"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input 
                id="city" 
                value={formData.city} 
                onChange={e => onInputChange("city", e.target.value)} 
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input 
                id="state" 
                value={formData.state} 
                onChange={e => onInputChange("state", e.target.value)} 
                placeholder="State"
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input 
                id="pincode" 
                value={formData.pincode} 
                onChange={e => onInputChange("pincode", e.target.value)} 
                placeholder="123456"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact & Special Requests */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Phone className="h-5 w-5 text-green-500" />
          Additional Information
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
            <Input 
              id="emergencyContact" 
              value={formData.emergencyContact} 
              onChange={e => onInputChange("emergencyContact", e.target.value)} 
              placeholder="Emergency contact number"
            />
          </div>
          <div>
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea 
              id="specialRequests" 
              value={formData.specialRequests} 
              onChange={e => onInputChange("specialRequests", e.target.value)} 
              placeholder="Any special requirements or requests..."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};