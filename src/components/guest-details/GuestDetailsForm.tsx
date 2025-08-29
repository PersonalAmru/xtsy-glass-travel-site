import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, MapPin, AlertTriangle } from "lucide-react";

interface FormData {
  guestName: string;
  email: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyRelation: string;
}

interface GuestDetailsFormProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

export const GuestDetailsForm = ({ formData, onInputChange }: GuestDetailsFormProps) => {
  return (
    <div className="space-y-6">
      {/* Primary Guest Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-orange-500" />
          Primary Guest Information *
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="guestName">Full Name *</Label>
            <Input 
              id="guestName" 
              value={formData.guestName} 
              onChange={e => onInputChange("guestName", e.target.value)} 
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email} 
              onChange={e => onInputChange("email", e.target.value)} 
            />
          </div>
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
            <Input 
              id="whatsappNumber" 
              value={formData.whatsappNumber} 
              onChange={e => onInputChange("whatsappNumber", e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-500" />
          Address Information *
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Full Address *</Label>
            <Input 
              id="address" 
              value={formData.address} 
              onChange={e => onInputChange("address", e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input 
                id="city" 
                value={formData.city} 
                onChange={e => onInputChange("city", e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input 
                id="state" 
                value={formData.state} 
                onChange={e => onInputChange("state", e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input 
                id="pincode" 
                value={formData.pincode} 
                onChange={e => onInputChange("pincode", e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact (Optional) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Emergency Contact (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
            <Input 
              id="emergencyContact" 
              value={formData.emergencyContact} 
              onChange={e => onInputChange("emergencyContact", e.target.value)} 
            />
          </div>
          <div>
            <Label htmlFor="emergencyRelation">Relationship</Label>
            <Input 
              id="emergencyRelation" 
              value={formData.emergencyRelation} 
              onChange={e => onInputChange("emergencyRelation", e.target.value)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};