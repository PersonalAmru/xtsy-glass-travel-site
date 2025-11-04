/**
 * Utility functions for handling room identifiers consistently across the application
 */

/**
 * Create room aliases for consistent identification across admin and booking systems
 */
export const createRoomAliases = (roomName: string): string[] => {
  const aliases = [roomName];
  
  // Add normalized versions
  const normalized = roomName.toLowerCase().replace(/\s+/g, '-');
  if (normalized !== roomName) {
    aliases.push(normalized);
  }
  
  // Add specific mappings for known room types
  const lowerName = roomName.toLowerCase();
  
  // 8-bed dormitory aliases
  if (lowerName.includes('8') && lowerName.includes('bed')) {
    aliases.push('8-bed-mixed-economy-dorm');
    aliases.push('Bed in 8 bed mixed economy dorm');
    aliases.push('8 bed mixed economy dorm');
  }
  
  // 6-bed dormitory aliases
  if (lowerName.includes('6') && lowerName.includes('bed')) {
    if (lowerName.includes('mixed')) {
      aliases.push('6-bed-mixed-dormitory');
      aliases.push('Bed in 6-Bed Mixed Dormitory');
    }
    if (lowerName.includes('female')) {
      aliases.push('6-bed-female-only-dormitory');
      aliases.push('Bed in 6-Bed Female Only Dormitory');
      aliases.push('6-bed-mixed-economy-dorm');
      aliases.push('Bed in 6-Bed Female Dormitory');
    }
    if (lowerName.includes('economy')) {
      aliases.push('6-bed-mixed-economy-dormitory');
      aliases.push('Bed in 6-Bed Mixed Economy Dormitory');
      aliases.push('Bed in 6-Bed Female Dormitory');
    }
  }
  
  // 4-bed dormitory aliases
  if (lowerName.includes('4') && lowerName.includes('bed')) {
    if (lowerName.includes('mixed')) {
      aliases.push('4-bed-mixed-dormitory');
      aliases.push('Bed in 4-Bed Mixed Dormitory');
    }
    if (lowerName.includes('female')) {
      aliases.push('4-bed-female-only-dormitory');
      aliases.push('Bed in 4-Bed Female Only Dormitory');
    }
  }
  
  // Private room aliases
  if (lowerName.includes('270') || lowerName.includes('panorama')) {
    aliases.push('270-panorama-glass-ensuite');
    aliases.push('270° Panorama Glass Ensuite');
  }
  
  if (lowerName.includes('king')) {
    if (lowerName.includes('double')) {
      aliases.push('king-double-room');
      aliases.push('King Double Room');
    }
    if (lowerName.includes('triple')) {
      aliases.push('king-triple-room');
      aliases.push('King Triple Room');
    }
  }
  
  // Remove duplicates and return
  return [...new Set(aliases)];
};

/**
 * Standardize room identifier for admin operations
 */
export const standardizeRoomId = (roomName: string): string => {
  const lowerName = roomName.toLowerCase();
  
  // Map to standard slug format
  if (lowerName.includes('8') && lowerName.includes('bed')) {
    return '8-bed-mixed-economy-dorm';
  }
  
  if (lowerName.includes('6') && lowerName.includes('bed')) {
    if (lowerName.includes('economy')) return '6-bed-mixed-economy-dormitory';
    if (lowerName.includes('mixed')) return '6-bed-mixed-dormitory';
    if (lowerName.includes('female')) return '6-bed-female-only-dormitory';
  }
  
  if (lowerName.includes('4') && lowerName.includes('bed')) {
    if (lowerName.includes('mixed')) return '4-bed-mixed-dormitory';
    if (lowerName.includes('female')) return '4-bed-female-only-dormitory';
  }
  
  if (lowerName.includes('270') || lowerName.includes('panorama')) {
    return '270-panorama-glass-ensuite';
  }
  
  if (lowerName.includes('king')) {
    if (lowerName.includes('double')) return 'king-double-room';
    if (lowerName.includes('triple')) return 'king-triple-room';
  }
  
  // Fallback to normalized version
  return roomName.toLowerCase().replace(/\s+/g, '-');
};