/** Experience by XTSY JSON-LD — separate from the page so the route head doesn't pull the page into the main chunk. */
import { XTSY270_DATA } from '@/data/rooms/xtsy270';
import { IMG } from '@/data/v2Images';
import { roomPrice } from '@/components/v2/pricing';
import { PANORAMA_WITH_BREAKFAST, PANORAMA_STAY_ONLY } from '@/data/panoramaPricing';

/** JSON-LD for the suite — rendered server-side by the /xtsy-270 route head. */
export function experienceSchema() {
  const now = roomPrice('xtsy-270').now || XTSY270_DATA.price;
  return {
    '@context': 'https://schema.org',
    '@type': ['LodgingBusiness', 'Accommodation'],
    '@id': 'https://xtsy.one/xtsy-270#suite',
    containedInPlace: { '@id': 'https://xtsy.one/#hostel' },
    geo: { '@type': 'GeoCoordinates', latitude: 25.6025457, longitude: 91.9448902 },
    telephone: '+918837317070',
    checkinTime: '11:00',
    checkoutTime: '10:00',
    name: "Experience by XTSY – India's First Stargaze Glamp",
    description: 'A 270° panoramic glass suite for couples at XTSY Travellers Hostel, New Shillong Township, Meghalaya.',
    url: XTSY270_DATA.canonicalUrl,
    image: IMG.suite.slice(0, 4).map((p) => `https://xtsy.one${p}`),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mawdiangdiang Road, New Shillong Township',
      addressLocality: 'Shillong',
      addressRegion: 'Meghalaya',
      postalCode: '793018',
      addressCountry: 'IN',
    },
    amenityFeature: XTSY270_DATA.features.map((f) => ({ '@type': 'LocationFeatureSpecification', name: f, value: true })),
    offers: { '@type': 'Offer', priceCurrency: 'INR', price: String(now), availability: 'https://schema.org/LimitedAvailability', url: 'https://xtsy.one/xtsy-270' },
    makesOffer: [
      { '@type': 'Offer', name: 'Stay only', price: String(PANORAMA_STAY_ONLY), priceCurrency: 'INR' },
      { '@type': 'Offer', name: 'Stay with breakfast for two', price: String(PANORAMA_WITH_BREAKFAST), priceCurrency: 'INR' },
    ],
  };
}
