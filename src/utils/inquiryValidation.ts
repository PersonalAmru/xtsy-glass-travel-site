import { z } from 'zod';

// XTSY270 Inquiry validation schema
export const xtsy270InquirySchema = z.object({
  state: z.string()
    .min(1, 'State is required')
    .max(50, 'State must be less than 50 characters'),
  city: z.string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'City should only contain letters'),
  pincode: z.string()
    .regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode'),
  mobile: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number starting with 6-9'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
});

// Tour booking inquiry validation schema
export const tourInquirySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name should only contain letters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z.string()
    .regex(/^(\+91[\-\s]?)?[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  city: z.string()
    .max(100, 'City must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  pincode: z.string()
    .regex(/^(\d{6})?$/, 'Please enter a valid 6-digit pincode')
    .optional()
    .or(z.literal('')),
  guests: z.number()
    .min(1, 'At least 1 guest is required')
    .max(50, 'Maximum 50 guests allowed'),
  selectedDate: z.string()
    .min(1, 'Please select a travel date'),
  tourName: z.string()
    .min(1, 'Tour name is required'),
});

export type XTSY270InquiryData = z.infer<typeof xtsy270InquirySchema>;
export type TourInquiryData = z.infer<typeof tourInquirySchema>;

// Validate XTSY270 inquiry
export function validateXTSY270Inquiry(data: Record<string, any>): {
  success: boolean;
  errors?: Record<string, string>;
  data?: XTSY270InquiryData;
} {
  const result = xtsy270InquirySchema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      if (!errors[field]) {
        errors[field] = err.message;
      }
    });
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}

// Validate tour inquiry
export function validateTourInquiry(data: Record<string, any>): {
  success: boolean;
  errors?: Record<string, string>;
  data?: TourInquiryData;
} {
  const result = tourInquirySchema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      if (!errors[field]) {
        errors[field] = err.message;
      }
    });
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}

// Validate individual field
export function validateInquiryField(
  schema: 'xtsy270' | 'tour',
  field: string,
  value: any
): string | null {
  const fieldSchema = schema === 'xtsy270' 
    ? xtsy270InquirySchema.shape[field as keyof typeof xtsy270InquirySchema.shape]
    : tourInquirySchema.shape[field as keyof typeof tourInquirySchema.shape];
  
  if (!fieldSchema) return null;
  
  const result = fieldSchema.safeParse(value);
  if (!result.success) {
    return result.error.errors[0]?.message || 'Invalid value';
  }
  return null;
}
