import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Guest details validation schema
export const guestDetailsSchema = z.object({
  guestName: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters, spaces, dots, hyphens, and apostrophes"),
  
  email: z.string()
    .trim()
    .email("Invalid email format")
    .max(254, "Email must be less than 254 characters")
    .toLowerCase()
    .refine(
      (email) => !email.includes('..'),
      "Email cannot contain consecutive dots"
    )
    .refine(
      (email) => !/[<>"'&%;()\\+]/.test(email),
      "Email contains invalid characters"
    ),
  
  whatsappNumber: z.string()
    .trim()
    .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number format")
    .min(8, "Phone number too short")
    .max(15, "Phone number too long"),
  
  address: z.string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters")
    .refine(
      (addr) => /[a-zA-Z]/.test(addr),
      "Address must contain at least some letters"
    )
    .transform((addr) => sanitizeInput(addr, 200)),
  
  city: z.string()
    .trim()
    .min(2, "City name must be at least 2 characters")
    .max(100, "City name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s.'-]+$/, "City contains invalid characters")
    .transform((city) => sanitizeInput(city, 100)),
  
  state: z.string()
    .trim()
    .min(2, "State name must be at least 2 characters")
    .max(100, "State name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s.'-]+$/, "State contains invalid characters")
    .transform((state) => sanitizeInput(state, 100)),
  
  pincode: z.string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode format (must be 6 digits, not starting with 0)")
    .length(6, "Pincode must be exactly 6 digits"),
  
  emergencyContact: z.string()
    .optional()
    .default("")
    .transform((val) => val.trim())
    .refine(
      (val) => val === "" || /^\+?[1-9]\d{7,14}$/.test(val),
      "Invalid emergency contact format"
    ),
  
  specialRequests: z.string()
    .optional()
    .default("")
    .transform((val) => sanitizeInput(val.trim(), 1000))
    .refine(
      (val) => val.length <= 1000,
      "Special requests must be less than 1000 characters"
    )
});

// Room selection validation schema
const roomSelectionSchema = z.object({
  id: z.string().min(1, "Room ID is required"),
  name: z.string().min(1, "Room name is required"),
  price: z.number().int().min(0, "Price must be non-negative"),
  type: z.string().min(1, "Room type is required"),
  selection: z.object({
    guests: z.number().int().min(0, "Guest count must be non-negative").max(50, "Too many guests per room"),
    rooms: z.number().int().min(1, "Must book at least 1 room").max(20, "Too many rooms in single booking")
  })
});

// Booking data validation schema
export const bookingDataSchema = z.object({
  checkIn: z.string()
    .datetime({ message: "Invalid check-in date format" })
    .refine(
      (date) => {
        const checkInDate = new Date(date);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        return checkInDate >= yesterday;
      },
      "Check-in date cannot be in the past"
    ),
  
  checkOut: z.string()
    .datetime({ message: "Invalid check-out date format" }),
  
  guests: z.number()
    .int("Guest count must be an integer")
    .min(1, "At least 1 guest is required")
    .max(100, "Maximum 100 guests per booking"),
  
  nights: z.number()
    .int("Number of nights must be an integer")
    .min(1, "Minimum 1 night required")
    .max(365, "Maximum 365 nights allowed"),
  
  selectedRooms: z.array(roomSelectionSchema)
    .min(1, "At least one room must be selected")
    .max(10, "Maximum 10 different room types per booking"),
  
  totalAmount: z.number()
    .int("Total amount must be an integer")
    .min(100, "Minimum booking amount is ₹100")
    .max(10000000, "Maximum booking amount is ₹1,00,00,000")
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
    const nightsDiff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nightsDiff === data.nights;
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

// Utility function to sanitize input and remove potentially dangerous characters
export function sanitizeInput(input: string, maxLength: number = 100): string {
  return input
    .replace(/[<>"'&%;()\\]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .slice(0, maxLength);
}

// Validation error formatter
export function formatValidationError(error: z.ZodError): string {
  const firstError = error.errors[0];
  if (firstError) {
    return `${firstError.path.join('.')}: ${firstError.message}`;
  }
  return "Invalid input data";
}
