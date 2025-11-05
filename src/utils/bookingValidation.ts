import { z } from 'zod';

// Guest details validation schema
export const guestDetailsSchema = z.object({
  guestName: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters, spaces, and basic punctuation"),
  
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  
  whatsappNumber: z.string()
    .trim()
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format (use international format)")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  
  address: z.string()
    .trim()
    .min(1, "Address is required")
    .max(500, "Address must be less than 500 characters"),
  
  city: z.string()
    .trim()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  
  state: z.string()
    .trim()
    .min(1, "State is required")
    .max(100, "State must be less than 100 characters"),
  
  pincode: z.string()
    .trim()
    .regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
  
  emergencyContact: z.string()
    .trim()
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid emergency contact format")
    .optional(),
  
  specialRequests: z.string()
    .trim()
    .max(1000, "Special requests must be less than 1000 characters")
    .optional()
});

// Room selection schema
export const roomSelectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().int().positive(),
  type: z.enum(['dorm', 'private']),
  selection: z.object({
    guests: z.number().int().min(1).max(50),
    rooms: z.number().int().min(0).max(10)
  })
});

// Booking data schema
export const bookingDataSchema = z.object({
  checkIn: z.string()
    .refine((date) => {
      const checkInDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return checkInDate >= today;
    }, "Check-in date cannot be in the past"),
  
  checkOut: z.string(),
  
  guests: z.number().int().min(1, "At least 1 guest required").max(50, "Maximum 50 guests allowed"),
  
  nights: z.number().int().min(1, "At least 1 night required"),
  
  selectedRooms: z.array(roomSelectionSchema).min(1, "At least one room must be selected"),
  
  totalAmount: z.number().int().min(100, "Invalid booking amount").max(10000000, "Amount exceeds maximum")
}).refine(
  (data) => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
  },
  {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"]
  }
).refine(
  (data) => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights === data.nights;
  },
  {
    message: "Number of nights doesn't match date range",
    path: ["nights"]
  }
);

// Complete booking request schema
export const bookingRequestSchema = z.object({
  bookingData: bookingDataSchema,
  guestDetails: guestDetailsSchema
});

// Sanitization helper
export function sanitizeInput(input: string, maxLength: number = 100): string {
  return input
    .replace(/[<>"'&%;()\\+]/g, '') // Remove dangerous characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .slice(0, maxLength);
}

// Format validation errors
export function formatValidationError(error: z.ZodError): string {
  const firstError = error.errors[0];
  return `${firstError.path.join('.')}: ${firstError.message}`;
}

export type GuestDetails = z.infer<typeof guestDetailsSchema>;
export type BookingData = z.infer<typeof bookingDataSchema>;
export type BookingRequest = z.infer<typeof bookingRequestSchema>;
