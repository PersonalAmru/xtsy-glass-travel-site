interface PricingTier {
  baseRate: number;
  multiplier: number;
  seasonalAdjustment: number;
}

interface SeasonalPricing {
  peak: PricingTier;
  regular: PricingTier;
  offSeason: PricingTier;
}

export class TourPricingService {
  // Base pricing per day for different categories (based on Thrillophilia + 15%)
  private static categoryBasePricing: Record<string, SeasonalPricing> = {
    adventure: {
      peak: { baseRate: 4200, multiplier: 1.0, seasonalAdjustment: 1.3 },
      regular: { baseRate: 3800, multiplier: 1.0, seasonalAdjustment: 1.15 },
      offSeason: { baseRate: 3200, multiplier: 1.0, seasonalAdjustment: 1.0 }
    },
    cultural: {
      peak: { baseRate: 3500, multiplier: 1.0, seasonalAdjustment: 1.25 },
      regular: { baseRate: 3000, multiplier: 1.0, seasonalAdjustment: 1.1 },
      offSeason: { baseRate: 2500, multiplier: 1.0, seasonalAdjustment: 1.0 }
    },
    wellness: {
      peak: { baseRate: 5500, multiplier: 1.0, seasonalAdjustment: 1.4 },
      regular: { baseRate: 4800, multiplier: 1.0, seasonalAdjustment: 1.2 },
      offSeason: { baseRate: 4000, multiplier: 1.0, seasonalAdjustment: 1.0 }
    },
    leisure: {
      peak: { baseRate: 3200, multiplier: 1.0, seasonalAdjustment: 1.2 },
      regular: { baseRate: 2800, multiplier: 1.0, seasonalAdjustment: 1.05 },
      offSeason: { baseRate: 2300, multiplier: 1.0, seasonalAdjustment: 1.0 }
    },
    exclusive: {
      peak: { baseRate: 7200, multiplier: 1.0, seasonalAdjustment: 1.5 },
      regular: { baseRate: 6500, multiplier: 1.0, seasonalAdjustment: 1.3 },
      offSeason: { baseRate: 5500, multiplier: 1.0, seasonalAdjustment: 1.1 }
    }
  };

  // Difficulty multipliers
  private static difficultyMultipliers = {
    'Easy': 1.0,
    'Moderate': 1.15,
    'Challenging': 1.35
  };

  // Location premium multipliers
  private static locationMultipliers: Record<string, number> = {
    'Meghalaya': 1.0,
    'Uttarakhand': 1.1,
    'Sikkim': 1.25,
    'Himachal Pradesh': 1.15,
    'Kerala': 1.05,
    'Tamil Nadu': 0.95,
    'Arunachal Pradesh': 1.3,
    'Nagaland': 1.2,
    'Manipur': 1.15,
    'Northeast India': 1.1
  };

  static calculatePrice(
    duration: string, 
    category: string, 
    difficulty: string, 
    location: string, 
    bestSeason: string
  ): string {
    const days = this.extractDays(duration);
    const season = this.determineSeason(bestSeason);
    
    // Get base pricing for category and season
    const categoryPricing = this.categoryBasePricing[category] || this.categoryBasePricing.cultural;
    const seasonalTier = categoryPricing[season];
    
    // Calculate base price
    let basePrice = seasonalTier.baseRate * days * seasonalTier.seasonalAdjustment;
    
    // Apply difficulty multiplier
    const difficultyMultiplier = this.difficultyMultipliers[difficulty as keyof typeof this.difficultyMultipliers] || 1.0;
    basePrice *= difficultyMultiplier;
    
    // Apply location multiplier
    const locationMultiplier = this.locationMultipliers[location] || 1.0;
    basePrice *= locationMultiplier;
    
    // Add 15% markup (as requested)
    basePrice *= 1.15;
    
    // Round to nearest 100
    const finalPrice = Math.round(basePrice / 100) * 100;
    
    return `₹${finalPrice.toLocaleString()}`;
  }

  private static extractDays(duration: string): number {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 3;
  }

  private static determineSeason(bestSeason: string): 'peak' | 'regular' | 'offSeason' {
    const season = bestSeason.toLowerCase();
    
    // Peak seasons (high demand periods)
    if (season.includes('oct-mar') || season.includes('dec-feb') || season.includes('mar-may')) {
      return 'peak';
    }
    
    // Off seasons (monsoon/extreme weather)
    if (season.includes('jun-sep') || season.includes('jul-sep')) {
      return 'offSeason';
    }
    
    // Regular season
    return 'regular';
  }

  // Generate group pricing based on per person rate
  static generateGroupPricing(perPersonPrice: string, days: number) {
    const basePrice = parseInt(perPersonPrice.replace(/[^\d]/g, ''));
    
    // Group discounts based on duration
    let group4Discount = 0.85; // 15% discount for 4 people
    let group10Discount = 0.75; // 25% discount for 10+ people
    
    // Better discounts for longer trips
    if (days >= 7) {
      group4Discount = 0.80; // 20% discount
      group10Discount = 0.70; // 30% discount
    } else if (days >= 5) {
      group4Discount = 0.82; // 18% discount
      group10Discount = 0.72; // 28% discount
    }
    
    return {
      perPerson: perPersonPrice,
      group4: `₹${Math.round(basePrice * group4Discount).toLocaleString()}`,
      group10: `₹${Math.round(basePrice * group10Discount).toLocaleString()}`
    };
  }
}