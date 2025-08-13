import { supabase } from '@/integrations/supabase/client';

export interface BookingData {
  bookingId: string;
  guestName: string;
  email: string;
  whatsappNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  roomDetails: any[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  discountAmount?: number;
  promoCode?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContact?: string;
  emergencyRelation?: string;
  addOns?: any;
}

export class SecureBookingService {
  /**
   * Creates a booking through the secure edge function
   * This prevents direct database access and ensures proper validation
   */
  static async createBooking(bookingData: BookingData): Promise<{ success: boolean; booking?: any; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('secure-booking-creation', {
        body: {
          action: 'create_booking',
          bookingData
        }
      });

      if (error) {
        console.error('Booking creation error:', error);
        return { success: false, error: error.message || 'Failed to create booking' };
      }

      return { success: true, booking: data.booking };
    } catch (error) {
      console.error('Secure booking service error:', error);
      return { success: false, error: 'Network error while creating booking' };
    }
  }

  /**
   * Verifies a booking exists and belongs to the provided email
   */
  static async verifyBooking(bookingId: string, email: string): Promise<{ success: boolean; booking?: any; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('secure-booking-creation', {
        body: {
          action: 'verify_booking',
          bookingData: { bookingId, email }
        }
      });

      if (error) {
        console.error('Booking verification error:', error);
        return { success: false, error: error.message || 'Failed to verify booking' };
      }

      return { success: true, booking: data.booking };
    } catch (error) {
      console.error('Booking verification error:', error);
      return { success: false, error: 'Network error while verifying booking' };
    }
  }

  /**
   * Generates a unique booking ID
   */
  static generateBookingId(): string {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `XTSY-${dateStr}-${randomNum}`;
  }

  /**
   * Validates booking data before submission
   */
  static validateBookingData(data: Partial<BookingData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.guestName?.trim()) errors.push('Guest name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.whatsappNumber?.trim()) errors.push('WhatsApp number is required');
    if (!data.checkIn) errors.push('Check-in date is required');
    if (!data.checkOut) errors.push('Check-out date is required');
    if (!data.guests || data.guests < 1) errors.push('Number of guests must be at least 1');
    if (!data.roomDetails || data.roomDetails.length === 0) errors.push('At least one room must be selected');

    // Email format validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    // Phone number validation
    if (data.whatsappNumber && !/^[+]?[\d\s\-\(\)]{8,}$/.test(data.whatsappNumber)) {
      errors.push('Invalid phone number format');
    }

    // Date validation
    if (data.checkIn && data.checkOut) {
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        errors.push('Check-in date cannot be in the past');
      }

      if (checkOutDate <= checkInDate) {
        errors.push('Check-out date must be after check-in date');
      }
    }

    return { isValid: errors.length === 0, errors };
  }
}