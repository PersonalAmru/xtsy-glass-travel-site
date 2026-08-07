import { useNavigate } from 'react-router-dom';

// Gallery navigation utility functions
export const navigateToGallery = (category?: string, tag?: string) => {
  const path = '/gallery';
  const params = new URLSearchParams();
  
  if (category) params.set('category', category);
  if (tag) params.set('tag', tag);
  
  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
};

// Hook for gallery navigation
export const useGalleryNavigation = () => {
  const navigate = useNavigate();
  
  const goToGallery = (category?: string, tag?: string) => {
    const path = navigateToGallery(category, tag);
    navigate(path);
  };
  
  return { goToGallery };
};

// Gallery image data mapping for site-wide images
export const galleryImageMap = {
  // Room Images
  'luxury-suite': {
    category: 'luxury-rooms',
    tags: ['panoramic-views', 'glass-architecture', 'premium-accommodation']
  },
  'female-dorm': {
    category: 'dormitories', 
    tags: ['female-dormitory', 'modern-amenities', 'comfortable-beds']
  },
  'mixed-dorm': {
    category: 'dormitories',
    tags: ['mixed-dormitory', 'social-atmosphere', 'shared-facilities']
  },
  'private-room': {
    category: 'private-rooms',
    tags: ['private-accommodation', 'luxury-amenities']
  },
  
  // Tour Destinations
  'meghalaya-tour': {
    category: 'tour-destinations',
    tags: ['adventure-tours', 'hidden-waterfalls', 'nature-exploration']
  },
  'cultural-tour': {
    category: 'tour-destinations', 
    tags: ['cultural-tours', 'khasi-culture', 'local-markets']
  },
  'adventure-tour': {
    category: 'tour-destinations',
    tags: ['adventure-tours', 'challenging-trek', 'monsoon-experience']
  },
  
  // Brand Assets
  'brand-logo': {
    category: 'brand-assets',
    tags: ['brand-identity', 'logo-design', 'hostel-branding']
  }
};

// Helper function to get gallery link for specific image types
export const getGalleryLinkForImage = (imageType: keyof typeof galleryImageMap) => {
  const mapping = galleryImageMap[imageType];
  return navigateToGallery(mapping.category, mapping.tags[0]);
};