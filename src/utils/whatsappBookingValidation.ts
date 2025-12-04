import { z } from 'zod';

// Base schema without refinements (for individual field validation)
const baseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name should only contain letters, spaces, and basic punctuation'),
  
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(
      /^(\+91[\-\s]?)?[6-9]\d{9}$/,
      'Please enter a valid Indian phone number (e.g., +91 9876543210)'
    ),
  
  city: z
    .string()
    .trim()
    .max(100, 'City must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]*$/, 'City should only contain letters')
    .optional()
    .or(z.literal('')),
  
  pincode: z
    .string()
    .trim()
    .regex(/^([1-9][0-9]{5})?$/, 'Please enter a valid 6-digit pincode')
    .optional()
    .or(z.literal('')),
  
  checkIn: z
    .string()
    .min(1, 'Check-in date is required')
    .refine((date) => {
      const checkInDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return checkInDate >= today;
    }, 'Check-in date cannot be in the past'),
  
  checkOut: z
    .string()
    .min(1, 'Check-out date is required'),
  
  guests: z
    .number()
    .min(1, 'At least 1 guest is required')
    .max(100, 'Maximum 100 guests allowed'),
  
  specialRequests: z
    .string()
    .trim()
    .max(1000, 'Special requests must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

// Full validation schema with date cross-validation
export const whatsappBookingSchema = baseSchema.refine((data) => {
  if (data.checkIn && data.checkOut) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
  }
  return true;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOut'],
});

export type WhatsAppBookingFormData = z.infer<typeof whatsappBookingSchema>;

// Helper to validate individual fields
export const validateField = (field: keyof WhatsAppBookingFormData, value: any, formData?: any) => {
  try {
    if (field === 'checkOut' && formData?.checkIn) {
      // Special validation for checkOut that depends on checkIn
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(value);
      if (!value) return 'Check-out date is required';
      if (checkOut <= checkIn) return 'Check-out date must be after check-in date';
      return null;
    }
    
    // Use the base schema shape for individual field validation
    const fieldSchema = baseSchema.shape[field as keyof typeof baseSchema.shape];
    if (fieldSchema) {
      fieldSchema.parse(value);
    }
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid value';
    }
    return null;
  }
};

// Validate entire form
export const validateWhatsAppBooking = (data: any) => {
  const result = whatsappBookingSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path[0] as string;
    if (path && !errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return { success: false, data: null, errors };
};
