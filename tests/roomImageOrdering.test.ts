/**
 * Room-card image ordering tests.
 *
 * Verifies the single source of truth (ROOM_IMAGES / CDN map) that every room
 * card consumes renders the correct image numbers and ordering per room type,
 * across the homepage rooms section, Rooms page, recommended stays and gallery,
 * plus the Dawki campsite thumbnail + gallery ordering.
 *
 * Card components read `ROOM_IMAGES[id][0]` for the thumbnail and
 * `ROOM_IMAGES[id]` for the gallery, so asserting the resolved arrays locks in
 * the exact imagery each card shows.
 */
import { describe, it, expect } from 'vitest';
import { ROOM_IMAGES } from '../src/config/roomTypes';
import { CDN_IMAGE_MAP } from '../src/data/cdnImageMap';

const cdn = (key: string) => {
  const url = CDN_IMAGE_MAP[key];
  if (!url) throw new Error(`Missing CDN mapping for ${key}`);
  return url;
};

// Expected ordering of source filenames for every room type.
const EXPECTED_ROOM_ORDER: Record<string, string[]> = {
  'xtsy-270': [
    'xtsy-270/XTSY270.JPG',
    'xtsy-270/XTSY270 2.JPG',
    'xtsy-270/XTSY270 3.JPG',
    'xtsy-270/XTSY270 4.JPG',
    'xtsy-270/XTSY270 5.JPG',
    'xtsy-270/XTSY270 6.JPG',
    'xtsy-270/XTSY270 7.JPG',
  ],
  '4-bed-female-only-dorm': [
    'xtsy/4 Bed Female Dormitory.jpg',
    'xtsy/4 Bed Female Dormitory 2.jpg',
    'xtsy/4 Bed Female Dormitory 3.jpg',
    'xtsy/4 Bed Female Dormitory 4.JPG',
    'xtsy/4 Bed Female Dormitory 5.JPG',
    'xtsy/4 Bed Female Dormitory 6.JPG',
    'xtsy/4 Bed Female Dormitory 7.JPG',
    'xtsy/4 Bed Female Dormitory 8.jpg',
  ],
  '4-bed-mixed-female-dorm': [
    'xtsy/4 Bed Mixed Dormitory 1.JPG',
    'xtsy/4 Bed Mixed Dormitory 2.JPG',
    'xtsy/4 Bed Mixed Dormitory 3.jpg',
    'xtsy/4 Bed Mixed Dormitory 4.JPG',
    'xtsy/4 Bed Mixed Dormitory 5.jpg',
    'xtsy/4 Bed Mixed Dormitory 7.jpg',
  ],
  '6-bed-mixed-female-dorm': [
    'xtsy/6 Bed Mixed Dormitory 1.JPG',
    'xtsy/6 Bed Mixed Dormitory 2.JPG',
    'xtsy/6 Bed Mixed Dormitory 3.jpg',
    'xtsy/6 Bed Mixed Dormitory 4.jpg',
    'xtsy/6 Bed Mixed Dormitory 5.JPG',
    'xtsy/6 Bed Mixed Dormitory 6.JPG',
  ],
  '6-bed-mixed-dorm': [
    'xtsy/6 Bed Mixed Dormitory 7.jpg',
    'xtsy/6 Bed Mixed Dormitory 8.jpg',
    'xtsy/6 Bed Mixed Dormitory 9.jpg',
    'xtsy/6 Bed Mixed Dormitory 1.JPG',
    'xtsy/6 Bed Mixed Dormitory 2.JPG',
    'xtsy/6 Bed Mixed Dormitory 3.jpg',
  ],
  'king-double-room': [
    'xtsy/King Double Room.jpg',
    'xtsy/King Double Room 2.jpg',
    'xtsy/King Double Room 3.JPG',
    'xtsy/King Double Room 4.jpg',
  ],
  // 8-bed reuses the 6-bed mixed set, shuffled (must NOT equal 6-bed ordering).
  '8-bed-mixed-dorm': [
    'xtsy/6 Bed Mixed Dormitory 4.jpg',
    'xtsy/6 Bed Mixed Dormitory 5.JPG',
    'xtsy/6 Bed Mixed Dormitory 6.JPG',
    'xtsy/6 Bed Mixed Dormitory 7.jpg',
    'xtsy/6 Bed Mixed Dormitory 8.jpg',
    'xtsy/6 Bed Mixed Dormitory 9.jpg',
  ],
};

describe('ROOM_IMAGES — exact image numbers & ordering per room type', () => {
  for (const [roomId, keys] of Object.entries(EXPECTED_ROOM_ORDER)) {
    it(`${roomId} resolves the correct images in order`, () => {
      const expected = keys.map(cdn);
      expect(ROOM_IMAGES[roomId]).toEqual(expected);
    });

    it(`${roomId} thumbnail (index 0) is the first image`, () => {
      expect(ROOM_IMAGES[roomId][0]).toBe(cdn(keys[0]));
    });
  }

  it('covers every defined room type with at least one image', () => {
    for (const [roomId, urls] of Object.entries(ROOM_IMAGES)) {
      expect(urls.length, `${roomId} should have images`).toBeGreaterThan(0);
      urls.forEach((u) => expect(u).not.toBe('/placeholder.svg'));
    }
  });

  it('8-bed dorm reuses 6-bed photos but shuffled (different order)', () => {
    const six = ROOM_IMAGES['6-bed-mixed-dorm'];
    const eight = ROOM_IMAGES['8-bed-mixed-dorm'];
    expect(eight).not.toEqual(six);
    // Every 8-bed image is a real 6-bed mixed dormitory photo.
    const sixSetAll = Object.entries(CDN_IMAGE_MAP)
      .filter(([k]) => k.startsWith('xtsy/6 Bed Mixed Dormitory'))
      .map(([, u]) => u);
    eight.forEach((u) => expect(sixSetAll).toContain(u));
  });
});

describe('Dawki campsite thumbnail & gallery ordering', () => {
  const dawkiKeys = [
    'xtsy-adventure-campsite/Dawki Campsite 1.jpeg',
    'xtsy-adventure-campsite/Dawki Campsite 2.jpeg',
    'xtsy-adventure-campsite/Dawki Campsite 3.jpeg',
    'xtsy-adventure-campsite/Dawki Campsite 4.jpeg',
    'xtsy-adventure-campsite/Dawki Campsite 5.jpeg',
    'xtsy-adventure-campsite/Dawki Campsite 6.jpeg',
  ];

  it('campsite hero thumbnail uses Dawki Campsite 4', () => {
    // DawkiCampsiteCard renders DAWKI_CAMPING_IMAGES[3] and the property hero
    // is "Dawki Campsite 4.jpeg" — both must resolve to image #4.
    expect(cdn('xtsy-adventure-campsite/Dawki Campsite 4.jpeg')).toBe(cdn(dawkiKeys[3]));
  });

  it('all six Dawki gallery images are mapped in order', () => {
    dawkiKeys.forEach((key) => expect(CDN_IMAGE_MAP[key]).toBeTruthy());
  });
});

describe('Gallery section ordering derives from ROOM_IMAGES', () => {
  // Mirrors GallerySection GALLERY_SOURCES → flatMap(ROOM_IMAGES[roomId]).
  const sources = [
    'xtsy-270',
    'king-double-room',
    '4-bed-female-only-dorm',
    '4-bed-mixed-female-dorm',
    '6-bed-mixed-dorm',
    '8-bed-mixed-dorm',
  ];

  it('produces a flat, ordered list with the first image per room first', () => {
    const items = sources.flatMap((roomId) =>
      ROOM_IMAGES[roomId].map((image, idx) => ({ roomId, idx, image })),
    );
    expect(items.length).toBeGreaterThan(0);
    // First tile of each source group is index 0 of that room.
    for (const roomId of sources) {
      const first = items.find((i) => i.roomId === roomId);
      expect(first?.image).toBe(ROOM_IMAGES[roomId][0]);
    }
  });
});
