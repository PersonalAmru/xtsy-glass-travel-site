import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface FormData {
  guestName: string;
  email: string;
  whatsappNumber: string;
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
          Guest Information *
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
    </div>
  );
};