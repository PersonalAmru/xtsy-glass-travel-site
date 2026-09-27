/**
 * OTA & Influencer reviews for XTSY properties.
 * Sources: MakeMyTrip, Goibibo, Agoda, Hostelworld, Airbnb, Instagram.
 *
 * IMPORTANT: Booking IDs are intentionally NOT stored or displayed anywhere.
 * Reviews are mapped to the correct property and room type so that the home
 * page and individual property pages surface the right social proof.
 *
 * Rating scales (handled in PremiumReviewCard):
 *   MakeMyTrip / Goibibo / Airbnb / Instagram → out of 5
 *   Agoda / Hostelworld / Booking.com         → out of 10
 */
import type { Review } from '@/hooks/useReviews';

const HOSTEL = 'XTSY Travellers Hostel';
const GLASS = 'Experience by XTSY';

export const otaReviews: Review[] = [
  // ===================== AGODA (out of 10) =====================
  {
    name: 'Paramjit',
    rating: 10,
    comment:
      'Far away from the hustle and bustle of the city. Really amazing and affordable place to stay near Shillong. Prices are quite reasonable as well.',
    date: 'May 2026',
    source: 'Agoda',
    roomType: '6 Bed Mixed Dormitory with Balcony and Forest View',
    property: HOSTEL,
    travelType: 'Solo traveller',
    highlights: 'Peaceful · Forest view · Great value',
  },
  {
    name: 'Kandarp',
    rating: 9.2,
    comment: 'One of the best dormitories. Clean, comfortable and full of good vibes.',
    date: 'April 2026',
    source: 'Agoda',
    roomType: 'Mixed Dormitory - 8 Bunk Beds',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'Sourav',
    rating: 10,
    comment: 'Exceptional. Much recommended ❤️⭐⭐⭐❤️',
    date: 'February 2026',
    source: 'Agoda',
    roomType: 'Mixed Dormitory - 8 Bunk Beds',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'Adhiyamaan',
    rating: 10,
    comment: 'Awesome. Stayed 10 nights and loved every moment of it.',
    date: 'September 2025',
    source: 'Agoda',
    roomType: 'Double Room with Mountain View',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },

  // ===================== INFLUENCER / INSTAGRAM (out of 5) =====================
  {
    name: 'Nomad KNM',
    rating: 5,
    comment:
      'Guys main abhi Shillong ke XTSY hostel me hu… yaha ka vibe full international backpacker type hai 😍 Rooms clean hai, staff super friendly hai aur sabse best – yaha strangers bhi dost ban jaate hain! Agar tum budget me Shillong explore karna chahte ho, toh ye place definitely try karna 👍',
    date: '2026',
    source: 'Instagram',
    roomType: 'Mixed Dormitory',
    property: HOSTEL,
    travelType: 'Influencer · Delhi',
    highlights: 'International backpacker vibe · Friendly staff',
  },

  // ===================== AIRBNB — Panorama / Experience by XTSY (out of 5) =====================
  {
    name: 'Airbnb Guest',
    rating: 5,
    comment:
      "Had an amazing stay at Experience by XTSY – India's First Stargaze Glamping. The entire concept is super unique and honestly feels unlike a regular hotel experience. Sleeping under a transparent glass roof with Meghalaya's skies above you is just surreal. 🌌✨ What stood out was that the glass room felt noticeably less humid compared to many glamping setups across Asia and Europe. The ventilation and ambience were surprisingly comfortable. The property is clearly built around the experience — cozy lighting, aesthetic interiors, peaceful atmosphere, and a perfect stargazing vibe at night. Ideal for couples, content creators, and travellers looking for something memorable. The host was super supportive, the place was clean and the whole stay felt thoughtfully designed. Definitely one of the most unique experiential stays in India and South East Asia.",
    date: 'May 2026',
    source: 'Airbnb',
    roomType: 'Experience by XTSY',
    property: GLASS,
    travelType: 'Couple',
    highlights: 'Stargazing · Unique experience · Clean',
    ownerReply: 'Thanks for your valuable feedback! ❤️',
  },

  // ===================== MAKEMYTRIP (out of 5) =====================
  {
    name: 'Verified Guest',
    rating: 5,
    comment:
      "I had a wonderful experience at XTSY Travellers Hostel! The staff were super friendly and helpful, and the atmosphere was very welcoming. The rooms were clean and comfortable, and the common areas have games and a TV. It felt like good vibes. Highly recommend this place if you're looking for a great stay!",
    date: 'May 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
  },
  {
    name: 'Mahesh Singh',
    rating: 4,
    comment: 'Good stay. Food was great, staff were very polite.',
    date: 'May 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
  },
  {
    name: 'Suman Das',
    rating: 4,
    comment: 'Good stay overall — comfortable dorms and a friendly crowd.',
    date: 'May 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 6-Bed Mixed Dormitory',
    property: HOSTEL,
    travelType: 'Group',
  },
  {
    name: 'sugandh Raju',
    rating: 5,
    comment: 'Excellent stay — clean dorms and helpful staff.',
    date: 'May 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
  },
  {
    name: 'Priyadarshinee Nayak',
    rating: 5,
    comment: 'It was very neat and clean. People were polite. Overall a peaceful stay.',
    date: 'May 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
  },
  {
    name: 'Marshal Malcolm',
    rating: 5,
    comment:
      'Best stay ever. Best place I could ask for in Shillong. The staff were all really friendly, cheerful and helpful.',
    date: 'April 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
  },
  {
    name: 'Santhosh',
    rating: 5,
    comment: 'Excellent — well maintained, hygienic and quality, with responsible staff.',
    date: 'April 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 6-Bed Mixed Dormitory',
    property: HOSTEL,
  },
  {
    name: 'Avinash Kumar',
    rating: 4,
    comment: 'Good to stay for a group of 6 people. Would love added food facilities.',
    date: 'April 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 6-Bed Mixed Dormitory',
    property: HOSTEL,
    travelType: 'Group',
  },
  {
    name: 'Millie Celeste',
    rating: 5,
    comment:
      "XTSY Travellers Hostel is hands down the best hostel I've ever stayed in! The beds are incredibly cozy and spotless—honestly so comfortable that I think they should be charging more! The entire place is well-maintained, with a warm and welcoming vibe. But what truly sets it apart is the stunning view. Everywhere you look, you're surrounded by pure nature—lush greenery, fresh mountain air, and total tranquility. If you're looking for a perfect stay in Shillong, this is the place!",
    date: 'April 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 4 Bed Female Dormitory',
    property: HOSTEL,
    highlights: 'Cozy beds · Stunning views · Well maintained',
  },
  {
    name: 'Abhishek Jaiswal',
    rating: 4,
    comment: 'Good stay. Clean dorm and easy check-in.',
    date: 'April 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 4 Bed Mixed Dormitory',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'Vipin Garg',
    rating: 5,
    comment: 'Excellent stay — comfortable beds and a great location.',
    date: 'March 2026',
    source: 'MakeMyTrip',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
  },
  {
    name: 'Sindhu G N',
    rating: 5,
    comment: 'Clean female dorm with a peaceful, safe atmosphere.',
    date: 'March 2026',
    source: 'MakeMyTrip',
    roomType: 'Bed in 4 Bed Female Dormitory',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'Andrew D',
    rating: 5,
    comment: 'Great stay — friendly crowd and clean mixed dorm.',
    date: 'February 2025',
    source: 'MakeMyTrip',
    roomType: 'Standard 8 Bed Mixed Dormitory',
    property: HOSTEL,
  },
  {
    name: 'Ayush Hawelia',
    rating: 4,
    comment: 'Good experience. The glass suite can get warm during the day as it is made of glass.',
    date: 'April 2026',
    source: 'MakeMyTrip',
    roomType: 'Experience by XTSY',
    property: GLASS,
    travelType: 'Group',
    ownerReply:
      'Thanks for the honest feedback! We have added climate control and blackout shades for daytime comfort. 🌿',
  },

  // ===================== GOIBIBO (out of 5) =====================
  {
    name: 'Vineeth S',
    rating: 5,
    comment: 'Excellent stay — very nice atmosphere with cooperative staff.',
    date: 'May 2026',
    source: 'Goibibo',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'Karthick Mr',
    rating: 5,
    comment: 'Great stay across three nights — clean dorm and friendly staff.',
    date: 'May 2026',
    source: 'Goibibo',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'Amrit Warudkar',
    rating: 5,
    comment: 'Experience by XTSY is a stunning, one-of-a-kind experience.',
    date: 'May 2026',
    source: 'Goibibo',
    roomType: 'Experience by XTSY',
    property: GLASS,
  },
  {
    name: 'Nital Kumar',
    rating: 5,
    comment: 'Excellent stay — clean dorm and a welcoming vibe.',
    date: 'May 2026',
    source: 'Goibibo',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'SANTANU GOSWAMI',
    rating: 5,
    comment: 'Great mixed dormitory stay — comfortable and well kept.',
    date: 'May 2026',
    source: 'Goibibo',
    roomType: '8 Bed Mixed Dormitory',
    property: HOSTEL,
  },
  {
    name: 'Karthick J',
    rating: 5,
    comment: 'Two relaxing nights — clean dorm and helpful staff.',
    date: 'May 2026',
    source: 'Goibibo',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'Pratyaksha Singh',
    rating: 5,
    comment: 'Clean, safe female dorm — a peaceful solo stay.',
    date: 'May 2026',
    source: 'Goibibo',
    roomType: 'Deluxe 4 Bed Female Dormitory',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'Priyanka Tirkey',
    rating: 5,
    comment: 'Lovely female dormitory — clean and comfortable.',
    date: 'May 2026',
    source: 'Goibibo',
    roomType: 'Deluxe 4 Bed Female Dormitory',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'Adithi Anil',
    rating: 4,
    comment:
      "Good stay. The location is accessible and scenic and the dorms are good. The staff is helpful when present.",
    date: 'May 2026',
    source: 'Goibibo',
    roomType: 'Deluxe 8 Bed Mixed Dormitory',
    property: HOSTEL,
    travelType: 'Solo traveller',
  },
  {
    name: 'Elric Topno',
    rating: 5,
    comment:
      "Excellent stay — amazing experience. The service was well served with all facilities and cleanliness was greatly maintained, with a pleasant and heartily vibe. Strongly recommend this hostel; the staff were great people to interact with.",
    date: 'April 2026',
    source: 'Goibibo',
    roomType: 'Deluxe 4 Bed Female Dormitory',
    property: HOSTEL,
    travelType: 'Group',
    highlights: 'All facilities · Clean · Friendly staff',
  },
  {
    name: 'Aaimee Koch',
    rating: 5,
    comment: 'Great two-night group stay — clean mixed dorm and good vibes.',
    date: 'April 2026',
    source: 'Goibibo',
    roomType: 'Deluxe 6-Bed Mixed Dormitory',
    property: HOSTEL,
    travelType: 'Group',
  },
  {
    name: 'Srijana Panda',
    rating: 5,
    comment: 'Comfortable mixed dorm — clean and great value.',
    date: 'March 2026',
    source: 'Goibibo',
    roomType: 'Deluxe 4 Bed Mixed Dormitory',
    property: HOSTEL,
  },
  {
    name: 'ARAVIND K M',
    rating: 5,
    comment: 'Great value standard dorm — clean and comfortable.',
    date: 'February 2025',
    source: 'Goibibo',
    roomType: 'Standard 6 Bed Mixed Dormitory',
    property: HOSTEL,
  },
];

export default otaReviews;
