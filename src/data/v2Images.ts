/**
 * Real photos used by the 2026 redesign. Everything comes from the Lovable CDN
 * (src/data/cdnImageMap.ts): XTSY's own rooms, property, TAB Bistro, the Dawki
 * partner campsite and XTSY Voyage destination photos. No AI or stock images.
 */
import { cdn, cdnMany } from './cdnImages';
import { ROOM_IMAGES } from '@/config/roomTypes';

export const IMG = {
  suite: ROOM_IMAGES['xtsy-270'] ?? [],
  femaleDorm: ROOM_IMAGES['4-bed-female-only-dorm'] ?? [],
  mixedDorm: ROOM_IMAGES['6-bed-mixed-dorm'] ?? [],
  property: cdnMany(['xtsy/Property Image 1.jpg', 'xtsy/Property Images 2.jpg', 'xtsy/Property Images 3.jpg', 'xtsy/Property Images 4.jpg']),
  king: ROOM_IMAGES['king-double-room'] ?? [],
  bistro: cdnMany(['xtsy/TAB Bistro by XTSY.jpeg', 'xtsy/TAB Bistro by XTSY 1.jpeg']),
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
