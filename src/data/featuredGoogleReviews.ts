/**
 * Curated best Google reviews, pinned at the top of the review showcases.
 * Source: Google Business Profile (fetched 6 Nov 2026). Comments and owner
 * replies are verbatim; do not edit wording, only the selection.
 * Hostel listing: 4.7★ from 252 reviews (see brandFacts.ts).
 */

export interface FeaturedGoogleReview {
  name: string;
  rating: 5;
  comment: string;
  date: string;
  property: "XTSY Travellers Hostel" | "TAB Bistro by XTSY";
  ownerReply?: string;
}

export const featuredHostelReviews: FeaturedGoogleReview[] = [
  {
    name: "Nupur Kothari",
    rating: 5,
    comment:
      "We stayed in the glass cabin and it was a wonderful experience. We loved watching the stars while lying on the bed. A great glamping experience! The food was quite tasty too. It's just a bit far from the main town. They also have a backup room if the glass cabin gets too hot. Very thoughtful. Highly recommended for someone into stargazing.",
    date: "November 2026",
    property: "XTSY Travellers Hostel",
    ownerReply: "Thanks for your valuable feedback ❤️😍",
  },
  {
    name: "Safique",
    rating: 5,
    comment:
      "My fourth visit to Xtsy Hostel in a year, and it still feels like home. I've witnessed four seasons and countless shades of Meghalaya, with this place being part of so many memories. Even spent an entire month here in February! Staff: 5/5, Cleanliness: 5/5, Food 4/5, comfy beds. Always a pleasure staying here. Great vibes, lovely people, and memories worth coming back for. Highly recommended!",
    date: "November 2026",
    property: "XTSY Travellers Hostel",
    ownerReply: "Thanks for your valuable feedback! ❤️😍",
  },
  {
    name: "Asmita Saha",
    rating: 5,
    comment:
      "Stayed in their Stargaze Glass Dome perched at the top of hostel terrace. Responsive hosts and caretakers. Loved the food and service. Special thanks to Amrudheen and Naphisabet for accomodating our requests. Private and serene getaway among green hills. Highly recommended 👌",
    date: "June 2026",
    property: "XTSY Travellers Hostel",
    ownerReply:
      "Dear Asmita, Thanks for your amazing feedback! We would love to host you again! Thank for recommending us!☺️🫰",
  },
  {
    name: "praveen b",
    rating: 5,
    comment:
      "We had a wonderful stay at Xtsy Travellers Hostel in Shillong. Naveen, who was in charge, took great care of us and made sure we were comfortable throughout our stay. Nafi at the reception was also very helpful, friendly, and made our experience pleasant. Thank you both for the great hospitality. We would definitely recommend this hostel to anyone visiting Shillong!",
    date: "August 2026",
    property: "XTSY Travellers Hostel",
    ownerReply: "Thanks for your valuable feedback!",
  },
  {
    name: "Pushpam Singh",
    rating: 5,
    comment:
      "Had a wonderful stay at XTSY! The place is clean, cozy, and has a great atmosphere. The staff is friendly and makes you feel welcome. A special thanks to Nafi for being so kind, helpful, and always ready to assist with a smile. Her hospitality made our stay even more enjoyable. Highly recommended, and I'd love to visit again!",
    date: "June 2026",
    property: "XTSY Travellers Hostel",
    ownerReply: "Thanks for your valuable feedback! 😍",
  },
  {
    name: "Shiksha Jaiswal",
    rating: 5,
    comment:
      "Hospitality isn't just a service here—it's a feeling. From check-in to check-out, everything was smooth. Special appreciation to Miss Naphrine for making us feel genuinely welcome. Would happily stay again!",
    date: "July 2026",
    property: "XTSY Travellers Hostel",
    ownerReply: "Thanks for your amazing feedback! We are happy to host you again ❤️",
  },
];

export const featuredBistroReviews: FeaturedGoogleReview[] = [
  {
    name: "Daiamonlang Khardewsaw",
    rating: 5,
    comment:
      "The food was really yummy especially the tandoori chicken.yummm.😋.. The service is excellent. I would highly recommend this place.",
    date: "July 2026",
    property: "TAB Bistro by XTSY",
    ownerReply: "Thanks for the valuable feedback! ❤️",
  },
  {
    name: "Sumar Shylla",
    rating: 5,
    comment:
      "Great food at Tab Bistro by XTSY. Tried the tandoori chicken, butter chicken masala, and cheese garlic naan — all were delicious and fresh. Wings of Heaven are a must-try too. Friendly staff, fast service, cozy ambience. Clean place and good value for money. Will come back.",
    date: "June 2026",
    property: "TAB Bistro by XTSY",
    ownerReply: "Dear Shylla, Thanks for your amazing feedback! 😍❤️",
  },
  {
    name: "Sai Priya",
    rating: 5,
    comment:
      "I had amazing food and stay at XTSY!! Thanks to Chef Lakshman for the food.For the nominal rates they charge, the experience is truly great. The rooms and the washrooms are very clean. Special thanks to Naveen and Naphi for making everything smooth and for attending to all my needs. It is located at a very beautiful site so the views from the rooms are also pretty! Definitely recommend!",
    date: "June 2026",
    property: "TAB Bistro by XTSY",
    ownerReply: "Thanks for your amazing feedback!",
  },
  {
    name: "Fidelity Behphat",
    rating: 5,
    comment:
      "Absolutely loved my experience at Tab Bistro by XTSY. The food was delicious, the ambience was cozy, and the service was excellent. Special thanks to Naffi for her warm hospitality and friendly service. Highly recommended",
    date: "June 2026",
    property: "TAB Bistro by XTSY",
    ownerReply: "Dear Fidelity, Thanks for your amazing feedback! ❤️😍",
  },
  {
    name: "Bom Nions",
    rating: 5,
    comment:
      "Had an amazing time at Tab Bistro by XTSY .The food is chumeswari 😘.But what made the experience better was the amazing service by naphisabet.I love how she was being so welcoming and very attentive and also made sure we had everything we needed.Really recommended.",
    date: "June 2026",
    property: "TAB Bistro by XTSY",
    ownerReply: "Thanks for your amazing feedback 😍🫰",
  },
  {
    name: "Phiningstar manar",
    rating: 5,
    comment:
      "A great place to enjoy good food and quality service. Every dish was prepared perfectly, and the staff made us feel comfortable throughout our visit. Highly recommended!",
    date: "June 2026",
    property: "TAB Bistro by XTSY",
    ownerReply: "Thanks for your valuable feedback! ❤️😍",
  },
];
