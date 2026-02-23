import { Wifi, Coffee, Bath, Bed, Mountain, Star, Award, Eye, Sun, Moon, Users, MapPin, Wind, Thermometer, Shield, Camera } from 'lucide-react';
import xtsyStargazing from '@/assets/xtsy-270-stargazing.jpeg';
import xtsyAerial from '@/assets/xtsy-270-aerial.jpeg';
import xtsyMilkyway from '@/assets/xtsy-270-milkyway.jpeg';
import xtsyMilkyway2 from '@/assets/xtsy-270-milkyway2.jpeg';
import xtsyInterior from '@/assets/xtsy-270-interior.jpeg';

export const XTSY270_DATA = {
  path: '/xtsy-270',
  canonicalUrl: 'https://xtsy.one/xtsy-270',
  name: 'XTSY 270° Panorama Glass Ensuite',
  shortName: 'XTSY 270°',
  seoTitle: 'XTSY 270° Panorama Glass Ensuite | India\'s First Luxury Glass House Shillong',
  seoDescription:
    'Experience India\'s first 270° panoramic glass house in Shillong. Luxury ensuite with stunning mountain views, architectural excellence, and premium amenities. From ₹8,500/night.',
  description:
    'India\'s pioneering 270° panoramic glass house offering unparalleled luxury and breathtaking mountain vistas. Experience architectural innovation meets hospitality excellence.',
  location: 'Shillong, Meghalaya, India',
  occupancy: { min: 1, max: 2 },
  bed: { type: 'Queen', count: 1 },
  features: [
    'Premium Breakfast',
    '270° Panoramic Glass Walls',
    'Luxury Ensuite Washroom',
    'Premium Mountain Views',
    'High-Speed Wi-Fi',
    'Air Conditioning',
    '4K QLED Television',
    'Netflix & Chill',
    'Instagram Moments',
  ],
  luxuryFeatures: [
    {
      icon: Eye,
      title: '270° Panoramic Views',
      description: 'Floor-to-ceiling glass walls offering uninterrupted mountain vistas from every angle'
    },
    {
      icon: Bath,
      title: 'Luxury Ensuite',
      description: 'Private washroom with premium fittings and panoramic views while bathing'
    },
    {
      icon: Bed,
      title: 'Premium Bedding',
      description: 'Queen bed with hotel-grade linens and dual comfort pillows for perfect rest'
    },
    {
      icon: Wifi,
      title: 'High-Speed Wi-Fi',
      description: 'Seamless internet for remote work and streaming with mountain views'
    },
    {
      icon: Coffee,
      title: 'Gourmet Breakfast',
      description: 'Complimentary premium breakfast served with spectacular sunrise views'
    },
    {
      icon: Thermometer,
      title: 'Climate Perfection',
      description: 'Advanced climate control with blackout options for optimal comfort'
    },
    {
      icon: Shield,
      title: 'Privacy Glass',
      description: 'Intelligent privacy glazing technology for intimate moments without losing views'
    },
    {
      icon: Camera,
      title: 'Instagram Moments',
      description: 'Every corner designed for perfect photography with natural lighting'
    },
    {
      icon: Wind,
      title: 'Fresh Mountain Air',
      description: 'Controlled ventilation system bringing pure Meghalaya mountain air indoors'
    }
  ],
  priceCurrency: 'INR',
  weekendPrice: 11500,
  weekdayPrice: 8500,
  price: 7489, // XTSY Xperience starting price (inclusive of GST)
  maxGuests: 2,
  maxRooms: 1,
  image: xtsyStargazing,
  images: [
    xtsyStargazing,
    xtsyAerial,
    xtsyMilkyway,
    xtsyMilkyway2,
    xtsyInterior,
  ],
};

// Export for backward compatibility with BookingFlow
export const ROOM_DATA = {
  'xtsy-270': {
    id: 'xtsy-270',
    name: XTSY270_DATA.name,
    price: XTSY270_DATA.price,
    image: XTSY270_DATA.image,
    description: XTSY270_DATA.description,
    amenities: XTSY270_DATA.features,
    type: 'private' as const,
    maxGuests: XTSY270_DATA.maxGuests,
    propertyType: 'luxury-glass-house'
  }
};

export type Xtsy270Data = typeof XTSY270_DATA;
