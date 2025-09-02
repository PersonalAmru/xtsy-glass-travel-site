import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { openWhatsAppDirectly, generateXTSY270Message, PRIVACY_NOTICE } from '@/utils/privacyCompliantWhatsApp';

interface XTSY270ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const XTSY270Modal: React.FC<XTSY270ModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    state: '',
    mobile: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const validateForm = () => {
    if (!formData.state || !formData.mobile || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    // Basic mobile validation (10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create WhatsApp message using privacy-compliant utility
      const message = generateXTSY270Message({
        state: formData.state,
        mobile: formData.mobile,
        email: formData.email
      });

      // Open WhatsApp directly - no logging, EU compliant
      openWhatsAppDirectly(message);

      // Close modal and reset form
      onClose();
      setFormData({ state: '', mobile: '', email: '' });
      
    } catch (error) {
      console.error("Form submission failed:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Reserve XTSY 270° Glass Suite
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Only 1 exclusive suite available per night in India
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="state" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Current State (in India)
            </Label>
            <Select 
              value={formData.state} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mobile" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Mobile Number
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              maxLength={10}
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email ID
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Reserve Now via WhatsApp'}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 text-center">{PRIVACY_NOTICE}</p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default XTSY270Modal;