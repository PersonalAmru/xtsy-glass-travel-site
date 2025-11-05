// Shared utility for generating standardized room feature tags
// Used across RoomsSection.tsx, BookingFlow.tsx, and RoomCard.tsx

export const generateStandardizedFeatures = (propertyType: string, roomName: string, roomType: 'dorm' | 'private') => {
  if (propertyType === 'economy') {
    // XTSY Economy: exactly 3 tags, no Female tag ever
    return ["Mixed", "Only Bed", "Wi-Fi", "Mountain Views"].slice(0, 4);
  } else if (propertyType === 'hostel') {
    // XTSY Travellers Hostel: max 7 tags with conditional Female/Mixed
    let features = [];
    
    // For private rooms (King Double/Triple), use specific features as per user specification
    if (roomType === 'private') {
      if (roomName.includes('Double')) {
        // King Double Room: specific feature set
        features = ["King Bed", "Attached washroom", "Wi-Fi", "Mountain Views", "Lover's Seat"];
      } else if (roomName.includes('Triple')) {
        // King Triple Room: specific feature set with "King Bed + single bed"
        features = ["King Bed + single bed", "Attached washroom", "Wi-Fi", "Mountain Views", "Lover's Seat"];
      }
      return features;
    } else {
      // For dorm rooms, use standard hostel features
      const baseFeatures = ["Attached washroom", "Wi-Fi", "Locker", "Reading lights", "Charging point", "Mountain Views"];
      
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