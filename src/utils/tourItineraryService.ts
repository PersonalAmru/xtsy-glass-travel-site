
interface ItineraryHighlight {
  id: number;
  title: string;
  description: string;
  day: number;
  activities: string[];
  duration: string;
  pricing: {
    perPerson: string;
    group4: string;
    group10: string;
  };
  source: string;
  highlights: string[]; // Add highlights to each day
}

interface TourPackage {
  title: string;
  duration: string;
  category: string;
  difficulty: string;
  location: string;
  highlights: string[];
}

export class TourItineraryService {
  // Extract days from duration string (e.g., "5 Days" -> 5)
  static extractDays(duration: string): number {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 3;
  }

  // Generate pricing based on duration and group type
  static generateDurationBasedPricing(basePrice: string, type: 'person' | 'group4' | 'group10', days: number) {
    const price = parseInt(basePrice.replace(/[^\d]/g, '') || '10000');
    
    // Base multipliers adjusted by duration
    let multipliers = {
      person: 1,
      group4: 3.5,
      group10: 8.5
    };

    // Longer trips get better group discounts
    if (days >= 7) {
      multipliers = {
        person: 1,
        group4: 3.2, // Better discount for 7+ day trips
        group10: 7.5
      };
    } else if (days >= 5) {
      multipliers = {
        person: 1,
        group4: 3.3,
        group10: 8.0
      };
    }
    
    const finalPrice = Math.round(price * multipliers[type]);
    return `₹${finalPrice.toLocaleString()}`;
  }

  // Generate relevant itinerary highlights based on package details and highlights
  static generateItineraryHighlights(tourPackage: TourPackage): ItineraryHighlight[] {
    const days = this.extractDays(tourPackage.duration);
    const highlights: ItineraryHighlight[] = [];
    
    // Distribute package highlights across days intelligently
    const highlightGroups = this.distributeHighlightsAcrossDays(tourPackage.highlights, days);
    
    // Generate day-by-day itinerary based on package specifics and highlights
    for (let day = 1; day <= days; day++) {
      const dayHighlights = highlightGroups[day - 1] || [];
      const highlight = this.generateDayHighlight(day, days, tourPackage, dayHighlights);
      highlights.push(highlight);
    }
    
    return highlights;
  }

  // Intelligently distribute highlights across days
  private static distributeHighlightsAcrossDays(highlights: string[], days: number): string[][] {
    const result: string[][] = Array(days).fill([]).map(() => []);
    
    if (highlights.length === 0) return result;
    
    // For single day trips, put all highlights in day 1
    if (days === 1) {
      result[0] = [...highlights];
      return result;
    }
    
    // For multi-day trips, distribute strategically
    const highlightsPerDay = Math.ceil(highlights.length / days);
    
    highlights.forEach((highlight, index) => {
      const dayIndex = Math.floor(index / highlightsPerDay);
      if (dayIndex < days) {
        result[dayIndex].push(highlight);
      } else {
        // If we have extras, add to the last day
        result[days - 1].push(highlight);
      }
    });
    
    return result;
  }

  // Generate specific day highlight based on tour details and assigned highlights
  private static generateDayHighlight(
    day: number, 
    totalDays: number, 
    tourPackage: TourPackage,
    dayHighlights: string[]
  ): ItineraryHighlight {
    const basePrice = tourPackage.duration;
    const title = tourPackage.title.toLowerCase();
    const category = tourPackage.category.toLowerCase();
    const location = tourPackage.location.toLowerCase();
    
    // Day 1 - Arrival and initial exploration
    if (day === 1) {
      return {
        id: day,
        title: `Day ${day}: Arrival & ${this.getArrivalFocus(dayHighlights)}`,
        description: this.getArrivalDescription(title, location, dayHighlights),
        day,
        activities: this.getArrivalActivities(title, location, dayHighlights),
        duration: "Full Day",
        highlights: dayHighlights,
        pricing: {
          perPerson: this.generateDurationBasedPricing(basePrice, 'person', totalDays),
          group4: this.generateDurationBasedPricing(basePrice, 'group4', totalDays),
          group10: this.generateDurationBasedPricing(basePrice, 'group10', totalDays)
        },
        source: "XTSY Adventure Specialists"
      };
    }
    
    // Last day - Final experiences and departure
    if (day === totalDays) {
      return {
        id: day,
        title: `Day ${day}: ${this.getDepartureFocus(dayHighlights)} & Farewell`,
        description: this.getDepartureDescription(title, location, dayHighlights),
        day,
        activities: this.getDepartureActivities(title, category, dayHighlights),
        duration: "Half Day",
        highlights: dayHighlights,
        pricing: {
          perPerson: this.generateDurationBasedPricing(basePrice, 'person', totalDays),
          group4: this.generateDurationBasedPricing(basePrice, 'group4', totalDays),
          group10: this.generateDurationBasedPricing(basePrice, 'group10', totalDays)
        },
        source: "Travel Experience Curators"
      };
    }
    
    // Middle days - Core adventure and exploration activities
    return {
      id: day,
      title: `Day ${day}: ${this.getMainActivityTitle(dayHighlights, category)}`,
      description: this.getMainActivityDescription(day, totalDays, title, category, location, dayHighlights),
      day,
      activities: this.getMainActivities(day, title, category, location, dayHighlights),
      duration: "Full Day",
      highlights: dayHighlights,
      pricing: {
        perPerson: this.generateDurationBasedPricing(basePrice, 'person', totalDays),
        group4: this.generateDurationBasedPricing(basePrice, 'group4', totalDays),
        group10: this.generateDurationBasedPricing(basePrice, 'group10', totalDays)
      },
      source: this.getActivitySource(category)
    };
  }

  // Get arrival focus based on highlights
  private static getArrivalFocus(highlights: string[]): string {
    if (highlights.length === 0) return "Local Exploration";
    
    const firstHighlight = highlights[0].toLowerCase();
    if (firstHighlight.includes('cultural') || firstHighlight.includes('heritage')) return "Cultural Discovery";
    if (firstHighlight.includes('nature') || firstHighlight.includes('forest')) return "Nature Introduction";
    if (firstHighlight.includes('adventure') || firstHighlight.includes('trek')) return "Adventure Preview";
    if (firstHighlight.includes('wellness') || firstHighlight.includes('yoga')) return "Wellness Journey Start";
    
    return highlights[0].length > 30 ? "Experience Introduction" : highlights[0];
  }

  // Get departure focus based on highlights
  private static getDepartureFocus(highlights: string[]): string {
    if (highlights.length === 0) return "Final Adventures";
    
    const lastHighlight = highlights[highlights.length - 1] || highlights[0];
    if (lastHighlight.toLowerCase().includes('shopping')) return "Local Shopping Experience";
    if (lastHighlight.toLowerCase().includes('sunset') || lastHighlight.toLowerCase().includes('viewpoint')) return "Scenic Farewell";
    if (lastHighlight.toLowerCase().includes('cultural')) return "Cultural Immersion";
    
    return lastHighlight.length > 30 ? "Final Experience" : lastHighlight;
  }

  // Generate arrival descriptions based on destination and highlights
  private static getArrivalDescription(title: string, location: string, highlights: string[]): string {
    const baseDescription = this.getBaseArrivalDescription(title, location);
    
    if (highlights.length === 0) return baseDescription;
    
    const highlightContext = highlights.slice(0, 2).join(' and ');
    return `${baseDescription} Begin your adventure with ${highlightContext.toLowerCase()}.`;
  }

  private static getBaseArrivalDescription(title: string, location: string): string {
    if (title.includes('meghalaya') || location.includes('meghalaya')) {
      return "Welcome to the enchanting land of clouds! Arrive and immerse yourself in the mystical beauty with a traditional Khasi welcome and local area exploration.";
    }
    if (title.includes('biodiversity') || title.includes('research')) {
      return "Arrival at the biodiversity hotspot with expert naturalist guides who will introduce you to the incredible ecosystem and wildlife you'll encounter.";
    }
    if (title.includes('yoga') || title.includes('wellness')) {
      return "Peaceful arrival at your wellness sanctuary, followed by a gentle introduction to the healing practices and natural surroundings.";
    }
    if (title.includes('survival') || title.includes('wilderness')) {
      return "Adventure begins with wilderness orientation, essential skills introduction, and connecting with the natural environment around you.";
    }
    if (title.includes('char dham') || title.includes('pilgrimage')) {
      return "Sacred journey commences with traditional prayers, route overview, and spiritual preparation for the divine adventure ahead.";
    }
    return "Exciting arrival and warm welcome, followed by local area discovery, cultural introduction, and adventure preview.";
  }

  // Generate arrival activities incorporating highlights
  private static getArrivalActivities(title: string, location: string, highlights: string[]): string[] {
    const baseActivities = this.getBaseArrivalActivities(title, location);
    
    if (highlights.length === 0) return baseActivities;
    
    // Replace last 1-2 activities with highlight-based activities
    const highlightActivities = highlights.slice(0, 2).map(h => 
      `Experience ${h.toLowerCase()}`
    );
    
    return [...baseActivities.slice(0, 3), ...highlightActivities];
  }

  private static getBaseArrivalActivities(title: string, location: string): string[] {
    if (title.includes('meghalaya')) {
      return ["Scenic arrival transfer", "Traditional welcome ceremony", "Local area orientation walk", "Cultural interaction session", "Regional cuisine tasting"];
    }
    if (title.includes('biodiversity') || title.includes('research')) {
      return ["Expert guide meeting", "Wildlife introduction session", "Nature walk orientation", "Photography briefing", "Evening wildlife spotting"];
    }
    if (title.includes('yoga') || title.includes('wellness')) {
      return ["Serene arrival experience", "Wellness space introduction", "Relaxation session", "Organic meal experience", "Evening meditation"];
    }
    if (title.includes('survival')) {
      return ["Adventure briefing", "Essential skills overview", "Natural environment tour", "Group bonding activities", "Campfire gathering"];
    }
    return ["Arrival experience", "Local area exploration", "Cultural introduction", "Adventure preview", "Welcome dinner"];
  }

  // Generate main activity titles based on highlights
  private static getMainActivityTitle(highlights: string[], category: string): string {
    if (highlights.length === 0) {
      return `Adventure & Exploration - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    }
    
    // Use the primary highlight for the day's title
    const primaryHighlight = highlights[0];
    if (primaryHighlight.length > 40) {
      // Shorten very long highlights
      return primaryHighlight.substring(0, 37) + "...";
    }
    
    return primaryHighlight;
  }

  // Generate main activity descriptions incorporating highlights
  private static getMainActivityDescription(day: number, totalDays: number, title: string, category: string, location: string, highlights: string[]): string {
    if (highlights.length === 0) {
      return "Full day of immersive adventures, cultural discoveries, natural exploration, and authentic local experiences that create lasting memories.";
    }
    
    const highlightsList = highlights.join(', ');
    const baseDescription = this.getBaseActivityDescription(title, category);
    
    return `${baseDescription} Today's adventures include: ${highlightsList}.`;
  }

  private static getBaseActivityDescription(title: string, category: string): string {
    if (title.includes('biodiversity') || title.includes('research')) {
      return "Deep dive into nature's wonders with expert naturalists, discovering unique ecosystems, rare species, and pristine wilderness areas.";
    }
    
    if (title.includes('yoga') || title.includes('wellness')) {
      return "Transformative wellness journey with guided practices, healing therapies, mindfulness sessions, and rejuvenating natural experiences.";
    }
    
    if (title.includes('hidden gems') || title.includes('waterfalls')) {
      return "Exploration of breathtaking hidden treasures, majestic waterfalls, secret trails, and untouched natural wonders with expert local guides.";
    }
    
    if (title.includes('survival') || title.includes('wilderness')) {
      return "Exciting wilderness adventure learning essential outdoor skills, nature survival techniques, and deep connection with the natural world.";
    }
    
    return "Immersive adventure experiences combining exploration, cultural discovery, natural beauty, and authentic local interactions.";
  }

  // Generate main activities based on highlights
  private static getMainActivities(day: number, title: string, category: string, location: string, highlights: string[]): string[] {
    if (highlights.length === 0) {
      return this.getDefaultActivities(title, category);
    }
    
    // Convert highlights into actionable adventure activities
    const highlightActivities = highlights.map(highlight => {
      const h = highlight.toLowerCase();
      if (h.includes('waterfall')) return "Waterfall adventure and exploration";
      if (h.includes('bridge')) return "Living root bridge expedition";
      if (h.includes('village')) return "Village cultural immersion";
      if (h.includes('trek') || h.includes('hike')) return "Guided trekking adventure";
      if (h.includes('temple') || h.includes('monastery')) return "Spiritual site exploration";
      if (h.includes('market') || h.includes('shopping')) return "Local market discovery";
      if (h.includes('sunset') || h.includes('sunrise')) return "Scenic viewpoint experience";
      if (h.includes('cave')) return "Cave exploration adventure";
      if (h.includes('wildlife')) return "Wildlife safari and spotting";
      if (h.includes('boat') || h.includes('river')) return "Water adventure experience";
      
      // Default: make it an adventure experience
      return `${highlight} adventure`;
    });
    
    // Add complementary adventure activities
    const complementaryActivities = ["Photography expedition", "Cultural interaction", "Nature meditation"];
    
    return [...highlightActivities, ...complementaryActivities].slice(0, 5);
  }

  private static getDefaultActivities(title: string, category: string): string[] {
    if (title.includes('biodiversity') || title.includes('research')) {
      return ["Wildlife tracking expedition", "Nature photography adventure", "Ecosystem exploration", "Bird watching session", "Natural habitat discovery"];
    }
    
    if (title.includes('yoga') || title.includes('wellness')) {
      return ["Sunrise yoga practice", "Guided nature meditation", "Wellness therapy session", "Mindful nature walks", "Rejuvenation experience"];
    }
    
    return ["Adventure exploration", "Cultural discovery", "Photography expedition", "Local experience", "Scenic adventures"];
  }

  // Generate departure descriptions incorporating highlights
  private static getDepartureDescription(title: string, location: string, highlights: string[]): string {
    const baseDescription = this.getBaseDepartureDescription(title, location);
    
    if (highlights.length === 0) return baseDescription;
    
    const finalHighlight = highlights[highlights.length - 1] || highlights[0];
    return `${baseDescription} Conclude your journey with ${finalHighlight.toLowerCase()} and cherished memories.`;
  }

  private static getBaseDepartureDescription(title: string, location: string): string {
    if (title.includes('research') || title.includes('biodiversity')) {
      return "Final day of nature exploration, wildlife documentation, and sharing your incredible discoveries with fellow adventurers.";
    }
    if (title.includes('yoga') || title.includes('wellness')) {
      return "Concluding wellness session, personal reflection time, and departure with renewed energy and inner peace.";
    }
    return "Last adventure experiences, souvenir collection, memorable farewells, and departure with a heart full of incredible memories.";
  }

  // Generate departure activities incorporating highlights
  private static getDepartureActivities(title: string, category: string, highlights: string[]): string[] {
    const baseActivities = this.getBaseDepartureActivities(title, category);
    
    if (highlights.length === 0) return baseActivities;
    
    // Incorporate final highlights as farewell activities
    const finalHighlight = highlights[highlights.length - 1];
    if (finalHighlight) {
      const finalActivity = finalHighlight.toLowerCase().includes('shopping') ? 
        "Souvenir shopping experience" : `Final ${finalHighlight.toLowerCase()} adventure`;
      
      return [finalActivity, ...baseActivities.slice(1)];
    }
    
    return baseActivities;
  }

  private static getBaseDepartureActivities(title: string, category: string): string[] {
    if (title.includes('research')) {
      return ["Final nature expedition", "Adventure sharing session", "Photo compilation", "Memory documentation", "Farewell celebration"];
    }
    if (title.includes('yoga') || title.includes('wellness')) {
      return ["Final wellness session", "Personal reflection time", "Journey sharing circle", "Peaceful meditation", "Grateful departure"];
    }
    return ["Last adventure exploration", "Souvenir shopping", "Group photo session", "Farewell gathering", "Departure with memories"];
  }

  // Get activity source based on category
  private static getActivitySource(category: string): string {
    const sources = {
      adventure: "Adventure Travel Experts",
      cultural: "Cultural Experience Guides",
      wellness: "Wellness Travel Specialists",
      research: "Nature Exploration Teams",
      exclusive: "XTSY Adventure Curators"
    };
    return sources[category as keyof typeof sources] || "Local Adventure Specialists";
  }
}
