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

  // Generate relevant itinerary highlights based on package details
  static generateItineraryHighlights(tourPackage: TourPackage): ItineraryHighlight[] {
    const days = this.extractDays(tourPackage.duration);
    const highlights: ItineraryHighlight[] = [];
    
    // Parse package title for key activities and destinations
    const title = tourPackage.title.toLowerCase();
    const category = tourPackage.category.toLowerCase();
    const location = tourPackage.location.toLowerCase();
    
    // Generate day-by-day itinerary based on package specifics
    for (let day = 1; day <= days; day++) {
      const highlight = this.generateDayHighlight(day, days, title, category, location, tourPackage);
      highlights.push(highlight);
    }
    
    return highlights;
  }

  // Generate specific day highlight based on tour details
  private static generateDayHighlight(
    day: number, 
    totalDays: number, 
    title: string, 
    category: string, 
    location: string,
    tourPackage: TourPackage
  ): ItineraryHighlight {
    const basePrice = tourPackage.duration;
    
    // Day 1 - Arrival activities
    if (day === 1) {
      return {
        id: day,
        title: `Day ${day}: Arrival & Welcome`,
        description: this.getArrivalDescription(title, location),
        day,
        activities: this.getArrivalActivities(title, location),
        duration: "Full Day",
        pricing: {
          perPerson: this.generateDurationBasedPricing(basePrice, 'person', totalDays),
          group4: this.generateDurationBasedPricing(basePrice, 'group4', totalDays),
          group10: this.generateDurationBasedPricing(basePrice, 'group10', totalDays)
        },
        source: "Curated by XTSY Travel Experts"
      };
    }
    
    // Last day - Departure
    if (day === totalDays) {
      return {
        id: day,
        title: `Day ${day}: Final Exploration & Departure`,
        description: this.getDepartureDescription(title, location),
        day,
        activities: this.getDepartureActivities(title, category),
        duration: "Half Day",
        pricing: {
          perPerson: this.generateDurationBasedPricing(basePrice, 'person', totalDays),
          group4: this.generateDurationBasedPricing(basePrice, 'group4', totalDays),
          group10: this.generateDurationBasedPricing(basePrice, 'group10', totalDays)
        },
        source: "Local Expert Recommendations"
      };
    }
    
    // Middle days - Main activities
    return {
      id: day,
      title: `Day ${day}: ${this.getMainActivityTitle(day, title, category)}`,
      description: this.getMainActivityDescription(day, totalDays, title, category, location),
      day,
      activities: this.getMainActivities(day, title, category, location, tourPackage.highlights),
      duration: "Full Day",
      pricing: {
        perPerson: this.generateDurationBasedPricing(basePrice, 'person', totalDays),
        group4: this.generateDurationBasedPricing(basePrice, 'group4', totalDays),
        group10: this.generateDurationBasedPricing(basePrice, 'group10', totalDays)
      },
      source: this.getActivitySource(category)
    };
  }

  // Generate arrival descriptions based on destination
  private static getArrivalDescription(title: string, location: string): string {
    if (title.includes('meghalaya') || location.includes('meghalaya')) {
      return "Welcome to the abode of clouds! Check-in, orientation session, and local area familiarization with traditional Khasi welcome.";
    }
    if (title.includes('biodiversity') || title.includes('research')) {
      return "Arrival and briefing session on the research program, equipment distribution, and introduction to local ecosystem guides.";
    }
    if (title.includes('yoga') || title.includes('wellness')) {
      return "Peaceful arrival, welcome ceremony, yoga space orientation, and settling into your wellness sanctuary.";
    }
    if (title.includes('survival') || title.includes('wilderness')) {
      return "Base camp setup, survival gear briefing, safety orientation, and first wilderness skills demonstration.";
    }
    if (title.includes('char dham') || title.includes('pilgrimage')) {
      return "Sacred arrival, prayer ceremony, route briefing, and spiritual preparation for the holy journey ahead.";
    }
    return "Warm welcome and check-in, local area orientation, cultural briefing, and relaxation time to acclimatize.";
  }

  // Generate arrival activities
  private static getArrivalActivities(title: string, location: string): string[] {
    if (title.includes('meghalaya')) {
      return ["Airport/Station pickup", "Hotel check-in", "Khasi cultural orientation", "Local market visit", "Traditional welcome dinner"];
    }
    if (title.includes('biodiversity') || title.includes('research')) {
      return ["Equipment distribution", "Research methodology briefing", "Local guide introduction", "Field notebook setup", "Evening documentation session"];
    }
    if (title.includes('yoga') || title.includes('wellness')) {
      return ["Peaceful check-in", "Wellness consultation", "Yoga mat assignment", "Meditation space visit", "Organic welcome meal"];
    }
    if (title.includes('survival')) {
      return ["Base camp setup", "Survival kit inspection", "Safety protocol training", "Local terrain assessment", "Group bonding activities"];
    }
    return ["Check-in assistance", "Welcome briefing", "Local area walk", "Cultural introduction", "Group dinner"];
  }

  // Generate main activity titles
  private static getMainActivityTitle(day: number, title: string, category: string): string {
    if (title.includes('hidden gems') || title.includes('waterfalls')) {
      return ["Hidden Waterfalls Exploration", "Living Root Bridges Trek", "Sacred Groves Discovery"][day % 3] || "Adventure Exploration";
    }
    if (title.includes('biodiversity') || title.includes('research')) {
      return ["Field Research & Data Collection", "Species Documentation", "Ecosystem Analysis"][day % 3] || "Research Activities";
    }
    if (title.includes('yoga') || title.includes('wellness')) {
      return ["Deep Yoga Practice", "Meditation & Mindfulness", "Healing Therapies"][day % 3] || "Wellness Activities";
    }
    if (title.includes('monsoon') || title.includes('cherrapunji')) {
      return ["Monsoon Waterfalls Trek", "Cave Exploration", "Valley Views"][day % 3] || "Monsoon Adventures";
    }
    if (title.includes('char dham')) {
      return ["Sacred Temple Visit", "Pilgrimage Trek", "Spiritual Ceremonies"][day % 3] || "Pilgrimage Journey";
    }
    return `Main Activities - Day ${day}`;
  }

  // Generate main activity descriptions
  private static getMainActivityDescription(day: number, totalDays: number, title: string, category: string, location: string): string {
    const midPoint = Math.ceil(totalDays / 2);
    
    if (title.includes('biodiversity') || title.includes('research')) {
      if (day <= midPoint) {
        return "Intensive field research activities with expert guides, species identification, ecosystem mapping, and data collection in pristine natural habitats.";
      }
      return "Advanced research techniques, sample analysis, documentation photography, and compilation of research findings with local expert insights.";
    }
    
    if (title.includes('yoga') || title.includes('wellness')) {
      return "Comprehensive wellness program including guided yoga sessions, meditation practices, healing therapies, and spiritual guidance in serene natural settings.";
    }
    
    if (title.includes('hidden gems') || title.includes('waterfalls')) {
      return "Exploration of lesser-known natural wonders, pristine waterfalls, ancient living root bridges, and untouched landscapes with experienced local guides.";
    }
    
    if (title.includes('survival') || title.includes('wilderness')) {
      return "Hands-on wilderness survival training including shelter building, food foraging, navigation techniques, and emergency preparedness in natural environment.";
    }
    
    return "Immersive experience with guided exploration, cultural interactions, adventure activities, and authentic local experiences tailored to your interests.";
  }

  // Generate main activities based on tour specifics
  private static getMainActivities(day: number, title: string, category: string, location: string, highlights: string[]): string[] {
    // Use tour highlights as base activities
    const baseActivities = highlights.slice(0, 4); // Take first 4 highlights
    
    if (title.includes('biodiversity') || title.includes('research')) {
      return ["Field research expedition", "Species documentation", "Ecosystem photography", "Data analysis session", ...baseActivities.slice(0, 2)];
    }
    
    if (title.includes('yoga') || title.includes('wellness')) {
      return ["Morning yoga session", "Guided meditation", "Healing therapy", "Nature walks", ...baseActivities.slice(0, 2)];
    }
    
    if (title.includes('hidden gems') || title.includes('waterfalls')) {
      return ["Waterfall trekking", "Root bridge exploration", "Photography session", "Local interaction", ...baseActivities.slice(0, 2)];
    }
    
    if (title.includes('survival') || title.includes('wilderness')) {
      return ["Survival skills training", "Shelter construction", "Foraging techniques", "Navigation practice", ...baseActivities.slice(0, 2)];
    }
    
    // Default activities incorporating tour highlights
    return ["Guided exploration", "Cultural interaction", "Photography session", ...baseActivities.slice(0, 3)];
  }

  // Generate departure descriptions
  private static getDepartureDescription(title: string, location: string): string {
    if (title.includes('research') || title.includes('biodiversity')) {
      return "Final research compilation, data backup, certificate presentation, and departure with newfound knowledge and research portfolio.";
    }
    if (title.includes('yoga') || title.includes('wellness')) {
      return "Final yoga session, wellness consultation, takeaway practice guide, and peaceful departure with renewed energy.";
    }
    return "Last-minute exploration, souvenir shopping, group photos, heartfelt farewells, and departure with beautiful memories.";
  }

  // Generate departure activities
  private static getDepartureActivities(title: string, category: string): string[] {
    if (title.includes('research')) {
      return ["Research compilation", "Certificate ceremony", "Photo documentation", "Data backup", "Departure transfer"];
    }
    if (title.includes('yoga') || title.includes('wellness')) {
      return ["Final yoga session", "Wellness consultation", "Practice guide", "Group meditation", "Peaceful departure"];
    }
    return ["Final exploration", "Souvenir shopping", "Group photos", "Farewell ceremony", "Departure transfer"];
  }

  // Get activity source based on category
  private static getActivitySource(category: string): string {
    const sources = {
      adventure: "Adventure Travel India",
      cultural: "Cultural Heritage Foundation",
      wellness: "Wellness Tourism Board",
      research: "Biodiversity Research Institute",
      exclusive: "XTSY Exclusive Experiences"
    };
    return sources[category as keyof typeof sources] || "Local Tourism Board";
  }
}