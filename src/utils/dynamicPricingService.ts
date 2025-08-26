import { parseISO, isWeekend, differenceInDays, isSameMonth } from 'date-fns';

interface PricingFactors {
  basePrice: number;
  weekendMultiplier: number;
  peakSeasonMultiplier: number;
  longStayDiscount: number;
  lastMinuteBooking: number;
}

export class DynamicPricingService {
  private static readonly WEEKEND_MULTIPLIER = 1.25; // 25% increase for weekends
  private static readonly PEAK_SEASON_MULTIPLIER = 1.4; // 40% increase for peak season
  private static readonly LONG_STAY_DISCOUNT = 0.9; // 10% discount for 7+ nights
  private static readonly EXTENDED_STAY_DISCOUNT = 0.85; // 15% discount for 14+ nights
  private static readonly LAST_MINUTE_MULTIPLIER = 1.15; // 15% increase for same-day booking

  // Peak season months (October to March - tourist season in Northeast India)
  private static readonly PEAK_MONTHS = [10, 11, 12, 1, 2, 3]; // Oct-Mar

  static calculateDynamicPrice(
    basePrice: number,
    checkInDate: string,
    checkOutDate: string
  ): {
    originalPrice: number;
    adjustedPrice: number;
    priceFactors: string[];
    totalNights: number;
    pricePerNight: number;
  } {
    const checkIn = parseISO(checkInDate);
    const checkOut = parseISO(checkOutDate);
    const nights = differenceInDays(checkOut, checkIn);
    const now = new Date();
    
    let adjustedPrice = basePrice;
    const priceFactors: string[] = [];

    // Weekend premium (if any night falls on weekend)
    let hasWeekendNight = false;
    for (let i = 0; i < nights; i++) {
      const currentNight = new Date(checkIn);
      currentNight.setDate(currentNight.getDate() + i);
      if (isWeekend(currentNight)) {
        hasWeekendNight = true;
        break;
      }
    }

    if (hasWeekendNight) {
      adjustedPrice *= this.WEEKEND_MULTIPLIER;
      priceFactors.push(`Weekend Premium (+${((this.WEEKEND_MULTIPLIER - 1) * 100).toFixed(0)}%)`);
    }

    // Peak season pricing (Oct-Mar)
    const checkInMonth = checkIn.getMonth() + 1; // getMonth() returns 0-11
    if (this.PEAK_MONTHS.includes(checkInMonth)) {
      adjustedPrice *= this.PEAK_SEASON_MULTIPLIER;
      priceFactors.push(`Peak Season (+${((this.PEAK_SEASON_MULTIPLIER - 1) * 100).toFixed(0)}%)`);
    }

    // Length of stay discounts
    if (nights >= 14) {
      adjustedPrice *= this.EXTENDED_STAY_DISCOUNT;
      priceFactors.push(`Extended Stay Discount (-${((1 - this.EXTENDED_STAY_DISCOUNT) * 100).toFixed(0)}%)`);
    } else if (nights >= 7) {
      adjustedPrice *= this.LONG_STAY_DISCOUNT;
      priceFactors.push(`Long Stay Discount (-${((1 - this.LONG_STAY_DISCOUNT) * 100).toFixed(0)}%)`);
    }

    // Last minute booking premium (same day)
    const daysDifference = differenceInDays(checkIn, now);
    if (daysDifference === 0) {
      adjustedPrice *= this.LAST_MINUTE_MULTIPLIER;
      priceFactors.push(`Same Day Booking (+${((this.LAST_MINUTE_MULTIPLIER - 1) * 100).toFixed(0)}%)`);
    }

    // Round to nearest 50
    adjustedPrice = Math.round(adjustedPrice / 50) * 50;

    return {
      originalPrice: basePrice,
      adjustedPrice,
      priceFactors,
      totalNights: nights,
      pricePerNight: Math.round(adjustedPrice / nights)
    };
  }

  static calculateTotalStayCost(
    basePrice: number,
    checkInDate: string,
    checkOutDate: string,
    guests: number = 1,
    rooms: number = 1
  ): {
    baseCost: number;
    adjustedCost: number;
    totalCost: number;
    priceFactors: string[];
    nights: number;
    costBreakdown: {
      baseRate: number;
      adjustedRate: number;
      nights: number;
      guests: number;
      rooms: number;
    };
  } {
    const pricingResult = this.calculateDynamicPrice(basePrice, checkInDate, checkOutDate);
    
    const baseCost = basePrice * pricingResult.totalNights;
    const adjustedCost = pricingResult.adjustedPrice * pricingResult.totalNights;
    const totalCost = adjustedCost * guests * rooms;

    return {
      baseCost,
      adjustedCost,
      totalCost,
      priceFactors: pricingResult.priceFactors,
      nights: pricingResult.totalNights,
      costBreakdown: {
        baseRate: basePrice,
        adjustedRate: pricingResult.pricePerNight,
        nights: pricingResult.totalNights,
        guests,
        rooms
      }
    };
  }

  static getPriceDisplayText(
    originalPrice: number,
    adjustedPrice: number,
    nights: number
  ): {
    display: string;
    savings: string | null;
    isDiscounted: boolean;
    isPremium: boolean;
  } {
    const totalOriginal = originalPrice * nights;
    const totalAdjusted = adjustedPrice * nights;
    
    const isDiscounted = totalAdjusted < totalOriginal;
    const isPremium = totalAdjusted > totalOriginal;
    
    let savings: string | null = null;
    if (isDiscounted) {
      const savingsAmount = totalOriginal - totalAdjusted;
      savings = `Save ₹${savingsAmount.toLocaleString()}`;
    }

    return {
      display: `₹${totalAdjusted.toLocaleString()}`,
      savings,
      isDiscounted,
      isPremium
    };
  }
}