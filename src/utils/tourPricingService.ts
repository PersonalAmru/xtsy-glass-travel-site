// ============================================================
// XTSY Tour Pricing — Transparent Cost-Based Model
// 
// Formula per person:
//   Activity/Guide/Food cost: ₹3,000–4,000/day (avg ₹3,500)
//   Accommodation: ₹700/night (dorm bed) × (days - 1)
//   Transport addon from Guwahati (distance-based, shared)
//   XTSY margin: ~17.5% (safe & competitive vs Zostel/Thrillophilia)
// ============================================================

// Distance from Guwahati → transport add-on per person (shared cab/shared transport)
export const TRANSPORT_ADDONS: Record<string, number> = {
  'Meghalaya':          0,      // Base — Shillong ~100 km
  'Assam':              1500,   // Kaziranga ~250 km
  'Nagaland':           2500,   // Kohima ~280 km
  'Manipur':            3000,   // Imphal ~400 km
  'Tripura':            3500,   // Agartala ~600 km
  'Mizoram':            3500,   // Aizawl ~600 km
  'Arunachal Pradesh':  4500,   // Tawang ~600 km + permits
  'Sikkim':             4500,   // Gangtok ~600 km via NJP
  'Northeast India':    2000,   // Multi-state avg
  'Himachal Pradesh':   7000,   // Flight + cab (Delhi/Chandigarh hub)
  'Uttarakhand':        6500,   // Flight + cab
  'Kerala':             8000,   // Flight (Kochi)
  'Tamil Nadu':         7500,   // Flight (Chennai/Madurai)
  'Rajasthan':          7000,   // Flight + cab
};

// Per-day activity/guide/food cost by difficulty
const DAILY_ACTIVITY_COST: Record<string, number> = {
  'Easy':        3000,
  'Moderate':    3500,
  'Challenging': 4000,
  'educational': 3800,
};

// Dorm accommodation per person per night
const DORM_NIGHT_COST = 700;

// XTSY margin applied on top of cost
const XTSY_MARGIN = 1.175; // 17.5%

export class TourPricingService {

  static calculatePrice(
    duration: string,
    category: string,
    difficulty: string,
    location: string,
    bestSeason: string
  ): string {
    const days = this.extractDays(duration);
    const nights = days - 1;

    const dailyCost = DAILY_ACTIVITY_COST[difficulty] || DAILY_ACTIVITY_COST['Moderate'];
    const accommodationCost = DORM_NIGHT_COST * nights;
    const transportAddon = TRANSPORT_ADDONS[location] || 2000;

    const totalCost = (dailyCost * days) + accommodationCost + transportAddon;
    const finalPrice = Math.round((totalCost * XTSY_MARGIN) / 100) * 100;

    return `₹${finalPrice.toLocaleString()}`;
  }

  static extractDays(duration: string): number {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 3;
  }

  // Group pricing — shared transport makes groups cheaper
  static generateGroupPricing(perPersonPrice: string, days: number) {
    const basePrice = parseInt(perPersonPrice.replace(/[^\d]/g, ''));

    // Group savings come from shared transport & accommodation
    let group4Factor = 0.87; // 13% saving
    let group6Factor = 0.80; // 20% saving

    if (days >= 7) {
      group4Factor = 0.82;
      group6Factor = 0.75;
    } else if (days >= 5) {
      group4Factor = 0.84;
      group6Factor = 0.77;
    }

    return {
      perPerson: perPersonPrice,
      group4: `₹${Math.round(basePrice * group4Factor).toLocaleString()}`,
      group6: `₹${Math.round(basePrice * group6Factor).toLocaleString()}`,
    };
  }
}
