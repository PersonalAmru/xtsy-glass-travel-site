import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { openWhatsAppDirectly, generateXTSY270Message, PRIVACY_NOTICE } from '@/utils/privacyCompliantWhatsApp';
import { saveXTSY270Inquiry } from '@/services/formBookingService';
import { validateXTSY270Inquiry, validateInquiryField } from '@/utils/inquiryValidation';

interface XTSY270ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const XTSY270Modal: React.FC<XTSY270ModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    state: '',
    city: '',
    pincode: '',
    mobile: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const handleBlur = (field: string) => {
    const error = validateInquiryField('xtsy270', field, formData[field as keyof typeof formData]);
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  };

  const validateForm = () => {
    const validation = validateXTSY270Inquiry(formData);
    
    if (!validation.success) {
      setErrors(validation.errors || {});
      const firstError = Object.values(validation.errors || {})[0];
      toast({
        title: "Validation Error",
        description: firstError,
        variant: "destructive"
      });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Save inquiry to database first
      const result = await saveXTSY270Inquiry({
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
        mobile: formData.mobile,
        email: formData.email
      });

      if (!result.success) {
        toast({
          title: "Inquiry Failed",
          description: result.error || "Failed to save inquiry. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Create WhatsApp message using privacy-compliant utility
      const message = generateXTSY270Message({
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
        mobile: formData.mobile,
        email: formData.email
      });

      // Open WhatsApp directly - no logging, EU compliant
      openWhatsAppDirectly(message);

      toast({
        title: "Thank You!",
        description: "Your XTSY 270° inquiry has been saved. Our team will reach out soon!",
      });

      // Close modal and reset form
      onClose();
      setFormData({ state: '', city: '', pincode: '', mobile: '', email: '' });
      setErrors({});
      
    } catch (error) {
      console.error("Form submission failed:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly at +91 88373 17070",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        data-testid="xtsy270-modal"
        className="sm:max-w-md"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(calc(100vw - 32px), 28rem)',
          maxWidth: '28rem',
          boxSizing: 'border-box',
          margin: 0,
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Reserve XTSY 270° Glass Suite
          </DialogTitle>
          <VisuallyHidden>
            <DialogDescription>Submit your inquiry to reserve India's only 270° panorama glass suite</DialogDescription>
          </VisuallyHidden>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="Your city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                onBlur={() => handleBlur('city')}
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.city}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                type="text"
                placeholder="123456"
                value={formData.pincode}
                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                onBlur={() => handleBlur('pincode')}
                maxLength={6}
                className={errors.pincode ? 'border-destructive' : ''}
              />
              {errors.pincode && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.pincode}
                </p>
              )}
            </div>
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
              onBlur={() => handleBlur('mobile')}
              maxLength={10}
              className={errors.mobile ? 'border-destructive' : ''}
            />
            {errors.mobile && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.mobile}
              </p>
            )}
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
              onBlur={() => handleBlur('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.email}
              </p>
            )}
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