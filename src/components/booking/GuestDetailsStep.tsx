/**
 * GuestDetailsStep - Extracted from SimplifiedBookingFlow for code splitting
 * Step 2 of 2-step booking flow
 */

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface GuestDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  specialRequests: string;
}

interface GuestDetailsStepProps {
  guestDetails: GuestDetails;
  onChange: (field: keyof GuestDetails, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  total: number;
}

const inputClass = "h-12 pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10 rounded-xl";
const labelClass = "text-sm font-medium text-white/80";

const GuestDetailsStep: React.FC<GuestDetailsStepProps> = memo(({
  guestDetails,
  onChange,
  onSubmit,
  isSubmitting,
  total,
}) => {
  const [errors, setErrors] = useState<Partial<GuestDetails>>({});

  const validate = () => {
    const newErrors: Partial<GuestDetails> = {};
    if (!guestDetails.name.trim()) newErrors.name = 'Name is required';
    if (!guestDetails.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestDetails.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!guestDetails.phone.trim() || !/^[6-9]\d{9}$/.test(guestDetails.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Valid 10-digit phone number required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)] px-4 pb-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 py-4"
      >
        {/* Name */}
        <div>
          <Label htmlFor="name" className={labelClass}>
            Full Name <span className="text-red-400">*</span>
          </Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="name"
              value={guestDetails.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={cn(inputClass, errors.name && "border-red-400/50")}
            />
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className={labelClass}>
            Email Address <span className="text-red-400">*</span>
          </Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="email"
              type="email"
              value={guestDetails.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="your@email.com"
              className={cn(inputClass, errors.email && "border-red-400/50")}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className={labelClass}>
            WhatsApp Number <span className="text-red-400">*</span>
          </Label>
          <div className="relative mt-1.5">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="phone"
              type="tel"
              value={guestDetails.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="9876543210"
              className={cn(inputClass, errors.phone && "border-red-400/50")}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className={labelClass}>
            Address <span className="text-white/40">(Optional)</span>
          </Label>
          <div className="relative mt-1.5">
            <Home className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
            <Textarea
              id="address"
              value={guestDetails.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Street address"
              className="pl-11 min-h-[60px] bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10 rounded-xl"
            />
          </div>
        </div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="city" className={labelClass}>City</Label>
            <Input
              id="city"
              value={guestDetails.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="City"
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10 rounded-xl mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="state" className={labelClass}>State</Label>
            <Input
              id="state"
              value={guestDetails.state}
              onChange={(e) => onChange('state', e.target.value)}
              placeholder="State"
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10 rounded-xl mt-1.5"
            />
          </div>
        </div>

        {/* Pincode */}
        <div>
          <Label htmlFor="pincode" className={labelClass}>Pincode</Label>
          <Input
            id="pincode"
            value={guestDetails.pincode}
            onChange={(e) => onChange('pincode', e.target.value)}
            placeholder="000000"
            maxLength={6}
            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10 rounded-xl mt-1.5"
          />
        </div>

        {/* Special Requests */}
        <div>
          <Label htmlFor="specialRequests" className={labelClass}>
            Special Requests <span className="text-white/40">(Optional)</span>
          </Label>
          <Textarea
            id="specialRequests"
            value={guestDetails.specialRequests}
            onChange={(e) => onChange('specialRequests', e.target.value)}
            placeholder="Any special requirements..."
            className="min-h-[80px] bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10 rounded-xl mt-1.5"
          />
        </div>
      </motion.div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-[hsl(220,20%,12%)] via-[hsl(220,20%,12%)] to-transparent pt-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2",
            isSubmitting 
              ? "bg-white/50 text-[hsl(220,20%,15%)]/50 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-orange-500 text-white shadow-xl shadow-primary/25"
          )}
        >
          {isSubmitting ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Confirming...
            </>
          ) : (
            <>
              Confirm Booking • ₹{total.toLocaleString()}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
});

GuestDetailsStep.displayName = 'GuestDetailsStep';

export default GuestDetailsStep;
