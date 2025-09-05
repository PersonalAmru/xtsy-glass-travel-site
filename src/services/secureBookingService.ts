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
   * Retrieves all bookings for the authenticated user using ultra-secure function
   */
  static async getUserBookings(): Promise<{ success: boolean; bookings?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('get_user_bookings_secure');

      if (error) {
        console.error('Secure booking retrieval error:', error);
        return { success: false, error: error.message || 'Failed to retrieve bookings' };
      }

      return { success: true, bookings: data || [] };
    } catch (error) {
      console.error('Secure booking service error:', error);
      return { success: false, error: 'Network error while retrieving bookings' };
    }
  }

  /**
   * Retrieves a single booking for the authenticated user using ultra-secure function
   */
  static async getSingleBooking(bookingId: string): Promise<{ success: boolean; booking?: any; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('get_single_booking_secure', {
        booking_id_param: bookingId
      });

      if (error) {
        console.error('Secure single booking retrieval error:', error);
        return { success: false, error: error.message || 'Failed to retrieve booking' };
      }

      // The function returns an array, so get the first item
      const booking = data && data.length > 0 ? data[0] : null;

      if (!booking) {
        return { success: false, error: 'Booking not found or access denied' };
      }

      return { success: true, booking };
    } catch (error) {
      console.error('Secure booking service error:', error);
      return { success: false, error: 'Network error while retrieving booking' };
    }
  }

  /**
   * Verifies a booking exists and belongs to the authenticated user (deprecated - use getSingleBooking)
   * @deprecated Use getSingleBooking instead for better security
   */
  static async verifyBooking(bookingId: string, email: string): Promise<{ success: boolean; booking?: any; error?: string }> {
    console.warn('verifyBooking is deprecated. Use getSingleBooking for better security.');
    
    try {
      // Use the new secure function instead of the old edge function
      const result = await this.getSingleBooking(bookingId);
      
      if (!result.success) {
        return result;
      }

      // Additional email verification for backward compatibility
      if (result.booking && result.booking.email && result.booking.email.toLowerCase() !== email.toLowerCase()) {
        return { success: false, error: 'Email mismatch - access denied' };
      }

      return result;
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

    // Enhanced validation with comprehensive security checks
    if (!data.email || typeof data.email !== 'string') {
      errors.push('Email is required');
    } else {
      // Enhanced email validation
      const emailPattern = /^[A-Za-z0-9]([A-Za-z0-9._%-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/;
      if (!emailPattern.test(data.email)) {
        errors.push('Invalid email format');
      }
      
      // Check for suspicious email patterns
      if (data.email.match(/(test|fake|spam|bot|admin|root)/i) && !data.email.match(/@(gmail|yahoo|outlook|hotmail)/i)) {
        errors.push('Email address not allowed');
      }
    }

    if (!data.guestName || typeof data.guestName !== 'string' || data.guestName.trim().length < 2) {
      errors.push('Guest name is required (minimum 2 characters)');
    } else if (data.guestName.length > 100) {
      errors.push('Guest name is too long (maximum 100 characters)');
    } else if (data.guestName.match(/[<>"'&%;()\\+]/)) {
      errors.push('Guest name contains invalid characters');
    }

    if (!data.whatsappNumber || typeof data.whatsappNumber !== 'string') {
      errors.push('WhatsApp number is required');
    } else {
      const phonePattern = /^\+?[1-9]\d{7,14}$/;
      if (!phonePattern.test(data.whatsappNumber.replace(/[^0-9+]/g, ''))) {
        errors.push('Invalid WhatsApp number format');
      }
    }

    // Enhanced date validation
    if (!data.checkIn || !data.checkOut) {
      errors.push('Check-in and check-out dates are required');
    } else {
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        errors.push('Check-in date cannot be in the past');
      }

      if (checkOut <= checkIn) {
        errors.push('Check-out date must be after check-in date');
      }

      const daysDiff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 365) {
        errors.push('Booking duration cannot exceed 365 days');
      }
    }

    // Enhanced guest validation
    if (!data.guests || typeof data.guests !== 'number' || data.guests < 1) {
      errors.push('At least 1 guest is required');
    } else if (data.guests > 20) {
      errors.push('Maximum 20 guests allowed per booking');
    }

    // Enhanced amount validation
    if (!data.totalAmount || typeof data.totalAmount !== 'number' || data.totalAmount <= 0) {
      errors.push('Invalid booking amount');
    } else if (data.totalAmount > 10000000) { // 1 crore limit
      errors.push('Booking amount exceeds maximum limit');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}