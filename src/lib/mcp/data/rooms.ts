// Self-contained public room summaries for the MCP server.
// Mirrors the public display data in src/data/roomInventory.ts (kept in sync
// manually) so the edge-function bundle stays free of `@/`-aliased imports.
// Prices are the same public "from" prices already shown on xtsy.one.

export interface McpRoom {
  id: string;
  name: string;
  category: "luxury" | "hostel";
  kind: "private" | "dorm";
  capacity: number;
  property: string;
  description: string;
  fromPriceInr: number;
  originalPriceInr: number;
  perUnit: "per night" | "per bed / night";
  bookable: boolean;
  tag?: string;
}

export const MCP_ROOMS: McpRoom[] = [
  {
    id: "xtsy-270",
    name: "XTSY 270° Panorama Glass Ensuite",
    category: "luxury",
    kind: "private",
    capacity: 2,
    property: "Experience by XTSY",
    description:
      "India's pioneering 270° panoramic glass house offering unparalleled luxury and breathtaking mountain vistas.",
    fromPriceInr: 4999,
    originalPriceInr: 11999,
    perUnit: "per night",
    bookable: true,
    tag: "luxury_couple",
  },
  {
    id: "king-double-room",
    name: "King Double Room",
    category: "hostel",
    kind: "private",
    capacity: 2,
    property: "XTSY Travellers Hostel",
    description: "Spacious private room with king bed for two guests.",
    fromPriceInr: 2399,
    originalPriceInr: 3499,
    perUnit: "per night",
    bookable: true,
    tag: "preferred_by_couple",
  },
  {
    id: "4-bed-female-only-dorm",
    name: "Bed in 4-Bed Female Dormitory",
    category: "hostel",
    kind: "dorm",
    capacity: 4,
    property: "XTSY Travellers Hostel",
    description: "Female-only dormitory with modern amenities and comfortable beds.",
    fromPriceInr: 419,
    originalPriceInr: 679,
    perUnit: "per bed / night",
    bookable: true,
    tag: "preferred_by_female",
  },
  {
    id: "4-bed-mixed-female-dorm",
    name: "Bed in 4-Bed Mixed Dormitory",
    category: "hostel",
    kind: "dorm",
    capacity: 4,
    property: "XTSY Travellers Hostel",
    description: "Mixed dormitory with shared facilities and a social atmosphere.",
    fromPriceInr: 569,
    originalPriceInr: 799,
    perUnit: "per bed / night",
    bookable: true,
    tag: "solo_traveller",
  },
  {
    id: "6-bed-mixed-dorm",
    name: "Bed in 6-Bed Mixed Dormitory",
    category: "hostel",
    kind: "dorm",
    capacity: 6,
    property: "XTSY Travellers Hostel",
    description: "Budget-friendly mixed dormitory with essential amenities.",
    fromPriceInr: 469,
    originalPriceInr: 699,
    perUnit: "per bed / night",
    bookable: true,
    tag: "recommended",
  },
  {
    id: "8-bed-mixed-dorm",
    name: "Bed in 8-Bed Mixed Dormitory",
    category: "hostel",
    kind: "dorm",
    capacity: 8,
    property: "XTSY Travellers Hostel",
    description: "Best value mixed dormitory for budget-conscious backpackers.",
    fromPriceInr: 369,
    originalPriceInr: 550,
    perUnit: "per bed / night",
    bookable: true,
    tag: "bestseller",
  },
];

export const BOOKING_URL = "https://xtsy.one/book";
