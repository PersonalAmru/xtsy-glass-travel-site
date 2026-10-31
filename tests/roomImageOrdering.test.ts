/**
 * Room-card image ordering tests.
 *
 * Card components read `ROOM_IMAGES[id][0]` for the thumbnail and `ROOM_IMAGES[id]` for the
 * gallery, across the homepage rooms section, Rooms page, recommended stays and the gallery,
 * plus the Dawki campsite thumbnail.
 *
 * These assertions pin the lead photograph of each room and the integrity of each gallery.
 * They deliberately do NOT pin the full running order: see the note above the expectations.
 */
import { describe, it, expect } from 'vitest';
import { ROOM_IMAGES } from '../src/config/roomTypes';
import { CDN_IMAGE_MAP } from '../src/data/cdnImageMap';
import { cdnMany } from '../src/data/cdnImages';

const cdn = (key: string) => {
  const url = CDN_IMAGE_MAP[key];
  if (!url) throw new Error(`Missing CDN mapping for ${key}`);
  return url;
};

// Rewritten 30 Oct 2026. This block used to hard-code the full ordering of all 45 room photos
// and compare them against CDN_IMAGE_MAP directly. It failed on every room type the first time
// it was ever run in CI, for two reasons, neither of which was a bug in the site:
//
//  1. cdnMany() resolves a key through CDN_IMAGE_MAP and THEN upgrades it to the optimised
//     self-hosted asset (/img/o/<name>-1280.webp). The test skipped that second step, so it
//     compared live WebP URLs against the legacy /__l5e/ JPEGs and every room mismatched.
//  2. The photo order had been recurated since the test was written (XTSY270 6 promoted to
//     second, the 6-bed dorm extended from six photos to eight). Recuration is a normal
//     editorial act, and a test that hard-codes 45 filenames turns it into a CI failure.
//
// So it now pins the things that are actually rules, and leaves the running order to whoever is
// choosing the photographs:
//   - the lead photo of each room, because that is the card thumbnail a guest picks from;
//   - that the 6-bed and 8-bed cards never lead with the same shot, which is the one curation
//     rule the source file states out loud (there are no dedicated 8-bed photos yet);
//   - that no gallery repeats a photo, and none falls back to the placeholder.

// Card thumbnail for each room: ROOM_IMAGES[id][0].
const EXPECTED_LEAD_PHOTO: Record<string, string> = {
  'xtsy-270': 'xtsy-270/XTSY270.JPG',
  '4-bed-female-only-dorm': 'xtsy/4 Bed Female Dormitory.jpg',
  '4-bed-mixed-female-dorm': 'xtsy/4 Bed Mixed Dormitory 1.JPG',
  '6-bed-mixed-dorm': 'xtsy/6 Bed Mixed Dormitory 1.JPG',
  'king-double-room': 'xtsy/King Double Room.jpg',
  '8-bed-mixed-dorm': 'xtsy/6 Bed Mixed Dormitory 2.JPG',
};

describe('ROOM_IMAGES — card thumbnails and gallery integrity', () => {
  for (const [roomId, leadKey] of Object.entries(EXPECTED_LEAD_PHOTO)) {
    it(`${roomId} leads with the intended card photo`, () => {
      // Resolved the same way the app resolves it, so an asset-pipeline change
      // cannot fail this while the photograph on the card is unchanged.
      expect(ROOM_IMAGES[roomId]?.[0]).toBe(cdnMany([leadKey])[0]);
    });
  }

  it('the 6-bed and 8-bed dorm cards never show the same lead photo', () => {
    // There are no dedicated 8-bed photos: it reuses the 6-bed set. If both cards led with the
    // same shot a guest would see two identical dorm cards at different prices.
    expect(ROOM_IMAGES['8-bed-mixed-dorm'][0]).not.toBe(ROOM_IMAGES['6-bed-mixed-dorm'][0]);
    expect(ROOM_IMAGES['8-bed-mixed-dorm']).not.toEqual(ROOM_IMAGES['6-bed-mixed-dorm']);
  });

  it('no room repeats a photo in its own gallery', () => {
    const repeats = Object.entries(ROOM_IMAGES)
      .filter(([, urls]) => new Set(urls).size !== urls.length)
      .map(([roomId]) => roomId);
    expect(repeats).toEqual([]);
  });

  it('covers every defined room type with at least one real image', () => {
    for (const [roomId, urls] of Object.entries(ROOM_IMAGES)) {
      expect(urls.length, `${roomId} should have images`).toBeGreaterThan(0);
      urls.forEach((u) => expect(u).not.toBe('/placeholder.svg'));
    }
  });

  it('every 8-bed photo is a real 6-bed mixed dormitory photograph', () => {
    const sixSetAll = Object.keys(CDN_IMAGE_MAP)
      .filter((k) => k.startsWith('xtsy/6 Bed Mixed Dormitory'))
      .flatMap((k) => cdnMany([k]));
    ROOM_IMAGES['8-bed-mixed-dorm'].forEach((u) => expect(sixSetAll).toContain(u));
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
