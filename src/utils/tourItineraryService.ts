
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
    
    // Day 1 - Arrival activities with relevant highlights
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
        source: "Curated by XTSY Travel Experts"
      };
    }
    
    // Last day - Departure with final highlights
    if (day === totalDays) {
      return {
        id: day,
        title: `Day ${day}: ${this.getDepartureFocus(dayHighlights)} & Departure`,
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
        source: "Local Expert Recommendations"
      };
    }
    
    // Middle days - Main activities based on highlights
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
    if (highlights.length === 0) return "Welcome Orientation";
    
    const firstHighlight = highlights[0].toLowerCase();
    if (firstHighlight.includes('cultural') || firstHighlight.includes('heritage')) return "Cultural Introduction";
    if (firstHighlight.includes('nature') || firstHighlight.includes('forest')) return "Nature Orientation";
    if (firstHighlight.includes('adventure') || firstHighlight.includes('trek')) return "Adventure Briefing";
    if (firstHighlight.includes('wellness') || firstHighlight.includes('yoga')) return "Wellness Welcome";
    
    return highlights[0].length > 30 ? "Introduction" : highlights[0];
  }

  // Get departure focus based on highlights
  private static getDepartureFocus(highlights: string[]): string {
    if (highlights.length === 0) return "Final Exploration";
    
    const lastHighlight = highlights[highlights.length - 1] || highlights[0];
    if (lastHighlight.toLowerCase().includes('shopping')) return "Souvenir Collection";
    if (lastHighlight.toLowerCase().includes('sunset') || lastHighlight.toLowerCase().includes('viewpoint')) return "Farewell Views";
    if (lastHighlight.toLowerCase().includes('cultural')) return "Cultural Farewell";
    
    return lastHighlight.length > 30 ? "Final Experience" : lastHighlight;
  }

  // Generate arrival descriptions based on destination and highlights
  private static getArrivalDescription(title: string, location: string, highlights: string[]): string {
    const baseDescription = this.getBaseArrivalDescription(title, location);
    
    if (highlights.length === 0) return baseDescription;
    
    const highlightContext = highlights.slice(0, 2).join(', ');
    return `${baseDescription} Begin your journey with an introduction to ${highlightContext}.`;
  }

  private static getBaseArrivalDescription(title: string, location: string): string {
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

  // Generate arrival activities incorporating highlights
  private static getArrivalActivities(title: string, location: string, highlights: string[]): string[] {
    const baseActivities = this.getBaseArrivalActivities(title, location);
    
    if (highlights.length === 0) return baseActivities;
    
    // Replace last 1-2 activities with highlight-based activities
    const highlightActivities = highlights.slice(0, 2).map(h => 
      `Introduction to ${h.toLowerCase()}`
    );
    
    return [...baseActivities.slice(0, 3), ...highlightActivities];
  }

  private static getBaseArrivalActivities(title: string, location: string): string[] {
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

  // Generate main activity titles based on highlights
  private static getMainActivityTitle(highlights: string[], category: string): string {
    if (highlights.length === 0) {
      return `Main Activities - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
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
      return "Immersive experience with guided exploration, cultural interactions, adventure activities, and authentic local experiences tailored to your interests.";
    }
    
    const highlightsList = highlights.join(', ');
    const baseDescription = this.getBaseActivityDescription(title, category);
    
    return `${baseDescription} Today's focus includes: ${highlightsList}.`;
  }

  private static getBaseActivityDescription(title: string, category: string): string {
    if (title.includes('biodiversity') || title.includes('research')) {
      return "Intensive field research activities with expert guides, species identification, ecosystem mapping, and data collection in pristine natural habitats.";
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
    
    return "Immersive experience with guided exploration, cultural interactions, adventure activities, and authentic local experiences.";
  }

  // Generate main activities based on highlights
  private static getMainActivities(day: number, title: string, category: string, location: string, highlights: string[]): string[] {
    if (highlights.length === 0) {
      return this.getDefaultActivities(title, category);
    }
    
    // Convert highlights into actionable activities
    const highlightActivities = highlights.map(highlight => {
      const h = highlight.toLowerCase();
      if (h.includes('waterfall')) return "Waterfall exploration";
      if (h.includes('bridge')) return "Bridge visit and photography";
      if (h.includes('village')) return "Village interaction and cultural exchange";
      if (h.includes('trek') || h.includes('hike')) return "Guided trekking experience";
      if (h.includes('temple') || h.includes('monastery')) return "Spiritual site visit";
      if (h.includes('market') || h.includes('shopping')) return "Local market exploration";
      if (h.includes('sunset') || h.includes('sunrise')) return "Scenic viewpoint visit";
      if (h.includes('cave')) return "Cave exploration";
      if (h.includes('wildlife')) return "Wildlife spotting and photography";
      if (h.includes('boat') || h.includes('river')) return "Water activity experience";
      
      // Default: make it an activity
      return `${highlight} experience`;
    });
    
    // Add some standard activities to fill the day
    const standardActivities = ["Photography session", "Local interaction", "Refreshment break"];
    
    return [...highlightActivities, ...standardActivities].slice(0, 5);
  }

  private static getDefaultActivities(title: string, category: string): string[] {
    if (title.includes('biodiversity') || title.includes('research')) {
      return ["Field research expedition", "Species documentation", "Ecosystem photography", "Data analysis session", "Local interaction"];
    }
    
    if (title.includes('yoga') || title.includes('wellness')) {
      return ["Morning yoga session", "Guided meditation", "Healing therapy", "Nature walks", "Wellness consultation"];
    }
    
    return ["Guided exploration", "Cultural interaction", "Photography session", "Local cuisine tasting", "Scenic viewpoints"];
  }

  // Generate departure descriptions incorporating highlights
  private static getDepartureDescription(title: string, location: string, highlights: string[]): string {
    const baseDescription = this.getBaseDepartureDescription(title, location);
    
    if (highlights.length === 0) return baseDescription;
    
    const finalHighlight = highlights[highlights.length - 1] || highlights[0];
    return `${baseDescription} Conclude with ${finalHighlight.toLowerCase()} before departure.`;
  }

  private static getBaseDepartureDescription(title: string, location: string): string {
    if (title.includes('research') || title.includes('biodiversity')) {
      return "Final research compilation, data backup, certificate presentation, and departure with newfound knowledge and research portfolio.";
    }
    if (title.includes('yoga') || title.includes('wellness')) {
      return "Final yoga session, wellness consultation, takeaway practice guide, and peaceful departure with renewed energy.";
    }
    return "Last-minute exploration, souvenir shopping, group photos, heartfelt farewells, and departure with beautiful memories.";
  }

  // Generate departure activities incorporating highlights
  private static getDepartureActivities(title: string, category: string, highlights: string[]): string[] {
    const baseActivities = this.getBaseDepartureActivities(title, category);
    
    if (highlights.length === 0) return baseActivities;
    
    // Incorporate final highlights as departure activities
    const finalHighlight = highlights[highlights.length - 1];
    if (finalHighlight) {
      const finalActivity = finalHighlight.toLowerCase().includes('shopping') ? 
        "Souvenir collection" : `Final ${finalHighlight.toLowerCase()} experience`;
      
      return [finalActivity, ...baseActivities.slice(1)];
    }
    
    return baseActivities;
  }

  private static getBaseDepartureActivities(title: string, category: string): string[] {
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
