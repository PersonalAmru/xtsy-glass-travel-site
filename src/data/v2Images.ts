/**
 * Real photos used by the 2026 redesign. Everything comes from the Lovable CDN
 * (src/data/cdnImageMap.ts): XTSY's own rooms, property, TAB Bistro, the Dawki
 * partner campsite and XTSY Voyage destination photos. No AI or stock images.
 */
import { cdn, cdnMany } from './cdnImages';
import { ROOM_IMAGES } from '@/config/roomTypes';
import { BISTRO_COVER } from './bistroCover';

export const IMG = {
  suite: ROOM_IMAGES['xtsy-270'] ?? [],
  femaleDorm: ROOM_IMAGES['4-bed-female-only-dorm'] ?? [],
  mixedDorm: ROOM_IMAGES['6-bed-mixed-dorm'] ?? [],
  // Chosen in the Sept 2026 cover audit: exterior in the pines, terraces, common spaces.
  // (Property Image 1 and Images 4 are curtain close-ups; Images 2 is the gate — not used as covers.)
  property: cdnMany(['xtsy/Property Images 8.jpg', 'xtsy/Property Images 6.jpg', 'xtsy/Property Images 15.jpg', 'xtsy/Property Images 9.jpg', 'xtsy/Property Images 13.jpg', 'xtsy/Property Images 22.jpg', 'xtsy/Property Images 25.JPG', 'xtsy/Property Images 21.jpg']),
  king: ROOM_IMAGES['king-double-room'] ?? [],
  bistro: [BISTRO_COVER, ...cdnMany(['xtsy/TAB Bistro by XTSY.jpeg'])],
  campsite: cdnMany([
    'xtsy-adventure-campsite/Dawki Campsite 4.jpeg',
    'xtsy-adventure-campsite/Dawki Campsite 1.jpeg',
    'xtsy-adventure-campsite/Dawki Campsite 2.jpeg',
  ]),
  dawki: cdn('xtsyvoyage/Dawki River.jpeg'),
  dawki2: cdn('xtsyvoyage/Dawki River 2.jpeg'),
  umiam: cdn('xtsyvoyage/Umiam Lake.jpeg'),
  nohkalikai: cdn('xtsyvoyage/Nohkalikai Falls.jpeg'),
  mawlynnong: cdn('xtsyvoyage/Mawlynnong.jpeg'),
  mawsmai: cdn('xtsyvoyage/Mawsmai Cave.jpeg'),
  rootBridge: cdn('xtsyvoyage/Nongriat Double Decker Root Bridge.jpeg'),
  laitlum: cdn('xtsyvoyage/Laitlum canyons.jpeg'),
  elephant: cdn('xtsyvoyage/Elephant Falls.jpeg'),
  krangSuri: cdn('xtsyvoyage/Krang Shuri Waterfall.jpeg'),
  sevenSisters: cdn('xtsyvoyage/Seven Sister waterfalls.jpeg'),
  meghalaya: cdn('xtsyvoyage/Meghalaya Cover Image.jpeg'),
  arunachal: cdn('xtsyvoyage/Arunachal Pradesh Cover Image.jpeg'),
  assam: cdn('xtsyvoyage/Assam Cover Image.jpeg'),
  nagaland: cdn('xtsyvoyage/Nagaland Cover Image.jpeg'),
  sikkim: cdn('xtsyvoyage/Sikkim Cover Image.jpeg'),
  bumla: cdn('xtsyvoyage/Bumla Pass Bike Expedition.jpeg'),
};

export const first = (list: string[] | string): string => (Array.isArray(list) ? list[0] ?? '' : list);

/** Named cover photos for each page (all real XTSY photos). */
export const COVERS = {
  home: cdn('xtsy/Property Images 8.jpg'),
  about: cdn('xtsy/Property Images 6.jpg'),
  contact: cdn('xtsy/Property Images 9.jpg'),
  pet: cdn('xtsy/Property Images 15.jpg'),
  petGallery: cdnMany(['xtsy/Property Images 13.jpg', 'xtsy/Property Images 25.JPG', 'xtsy/Property Images 22.jpg']),
  groups: cdn('xtsy/Property Images 12.jpg'),
  commonRoom: cdn('xtsy/Property Images 16.jpg'),
  workation: cdn('xtsy/Property Images 27.JPG'),
  women: cdn('xtsy/4 Bed Female Dormitory.jpg'),
  wedding: cdn('xtsy-270/XTSY270 6.JPG'),
  terrace: cdn('xtsy/Property Images 21.jpg'),
};

export const HERO_IMAGE = {
  src: COVERS.home,
  alt: 'XTSY Travellers Hostel among the pines of New Shillong Township',
  position: '50% 40%',
  /** Phones: a portrait crop of the same framing (about half the bytes of the landscape 1280). */
  mobile: {
    src: '/img/o/xtsy-property-images-8-portrait-720.webp',
    srcSet: '/img/o/xtsy-property-images-8-portrait-720.webp 720w, /img/o/xtsy-property-images-8-portrait-1080.webp 1080w',
  },
};
