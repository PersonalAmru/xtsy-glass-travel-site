import { Wifi, Coffee, Bath, Bed, Mountain, Star, Award, Eye, Sun, Moon, Users, MapPin, Wind, Tv, Shield, Camera } from 'lucide-react';
import xtsyStargazing from '@/assets/xtsy-270-stargazing.jpeg';
import xtsyAerial from '@/assets/xtsy-270-aerial.jpeg';
import xtsyMilkyway from '@/assets/xtsy-270-milkyway.jpeg';
import xtsyMilkyway2 from '@/assets/xtsy-270-milkyway2.jpeg';
import xtsyInterior from '@/assets/xtsy-270-interior.jpeg';

export const XTSY270_DATA = {
  path: '/xtsy-270',
  canonicalUrl: 'https://xtsy.one/xtsy-270',
  name: 'XTSY Experience – 270° Glasshouse Glamping Retreat',
  shortName: 'XTSY Experience',
  seoTitle: 'XTSY Experience – India\'s First 270° Glasshouse Glamping Retreat | Shillong, Meghalaya',
  seoDescription:
    'Sleep under stars. Wake to mountains. XTSY Experience is India\'s first 270° panoramic glasshouse glamping retreat in Shillong. Luxury glamping for couples — pine forests, stargazing, and rolling hills. Book now.',
  seoKeywords:
    'glamping India, luxury glamping Shillong, glasshouse glamping, romantic glamping retreat, glamping Meghalaya, stargazing glamping, couples glamping India, 270 glass house, XTSY Experience, glamping resort Shillong, unique glamping India, honeymoon glamping',
  description:
    'India\'s first 270° panoramic glasshouse glamping retreat. Sleep under the stars, wake to mountains — luxury glamping without compromise in Shillong, Meghalaya.',
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
      title: 'En Suite',
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
      icon: Tv,
      title: 'Netflix & Chill',
      description: 'Enjoy Streaming in QLED 4K TV'
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
  price: 7489, // XTSY Experience starting price (inclusive of GST)
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
