// Shared utility for generating standardized room feature tags
// Used across RoomsSection.tsx, BookingFlow.tsx, and RoomCard.tsx

// Utility to determine dormitory type for visual styling
export const getDormitoryType = (roomName: string): 'female' | 'mixed' | 'private' | null => {
  const lowerName = roomName.toLowerCase();
  
  // Check for private room types first
  if (lowerName.includes('king double') || lowerName.includes('king triple') || lowerName.includes('panorama') || lowerName.includes('ensuite')) {
    return 'private';
  }
  
  // Check for dormitory types
  if (lowerName.includes('female')) {
    return 'female';
  }
  
  if (lowerName.includes('mixed') || lowerName.includes('dorm')) {
    return 'mixed';
  }
  
  return null;
};

export const generateStandardizedFeatures = (propertyType: string, roomName: string, roomType: 'dorm' | 'private') => {
  if (propertyType === 'economy') {
    // XTSY Economy: conditional Female/Mixed tag based on room name
    const genderTag = roomName.toLowerCase().includes('female') ? "Female" : "Mixed";
    return [genderTag, "Only Bed", "Wi-Fi", "Hot water", "Mountain Views", "Attached washroom"].slice(0, 6);
  } else if (propertyType === 'hostel') {
    // XTSY Travellers Hostel: max 7 tags with conditional Female/Mixed
    let features: string[] = [];
    
    // For private rooms (King Double/Triple), use specific features as per user specification
    if (roomType === 'private') {
      if (roomName.includes('Double')) {
        // King Double Room: specific feature set
        features = ["King Bed", "Attached washroom", "Hot water", "Wi-Fi", "Mountain Views", "Lover's Seat"];
      } else if (roomName.includes('Triple')) {
        // King Triple Room: specific feature set with "King Bed + single bed"
        features = ["King Bed + single bed", "Attached washroom", "Hot water", "Wi-Fi", "Mountain Views", "Lover's Seat"];
      }
      return features;
    } else {
      // For dorm rooms, use standard hostel features
      const baseFeatures = ["Attached washroom", "Hot water", "Wi-Fi", "Locker", "Reading lights", "Charging point", "Mountain Views"];
      
      // Add Female or Mixed tag conditionally (never both)
      if (roomName.toLowerCase().includes('female')) {
        features = ["Female", ...baseFeatures];
      } else if (roomName.toLowerCase().includes('mixed')) {
        features = ["Mixed", ...baseFeatures];
      } else {
        features = baseFeatures;
      }
      
      return features.slice(0, 7);
    }
  } else {
    // Fallback for other property types
    return [];
  }
};