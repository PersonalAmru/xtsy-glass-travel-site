// ============================================
// Tour Itineraries — Day-by-Day from PDF Sources
// Keyed by tour ID, merged into TourPackage at export
// ============================================

export interface ItineraryDay {
  day: string;
  title: string;
  route?: string;
  activities: string[];
  overnight?: string;
}

export const tourItineraries: Record<number, ItineraryDay[]> = {
  // ── ID 202: Wilderness Survival Winter Camp ──
  202: [
    {
      day: "Day 1",
      title: "Arrival & Base Camp Setup",
      route: "Guwahati to Wilderness Base Camp (Drive: 4-5 hrs)",
      activities: [
        "Pickup from Guwahati Airport/Railway Station",
        "Drive through scenic Northeast countryside",
        "Base camp orientation & safety briefing",
        "Introduction to wilderness survival principles",
        "Evening campfire & team bonding"
      ],
      overnight: "Wilderness Base Camp"
    },
    {
      day: "Day 2",
      title: "Shelter Building & Fire Making",
      activities: [
        "Morning fitness & warm-up exercises",
        "Natural shelter construction techniques",
        "Fire making without matches — friction & flint methods",
        "Water sourcing & purification in the wild",
        "Knot tying & rope craft workshop",
        "Night navigation basics"
      ],
      overnight: "Self-built Shelters"
    },
    {
      day: "Day 3",
      title: "Foraging & Navigation",
      activities: [
        "Wild edible plant identification hike",
        "Foraging walk with naturalist guide",
        "Compass & map reading workshop",
        "Natural navigation using sun, stars & terrain",
        "Trap & snare building (demonstration only)",
        "Cooking wild-foraged meals"
      ],
      overnight: "Wilderness Camp"
    },
    {
      day: "Day 4",
      title: "Survival Challenge Day",
      activities: [
        "Full-day solo/team survival challenge",
        "River crossing techniques",
        "Emergency signaling methods",
        "First aid in the wilderness",
        "Wildlife awareness & safety protocols",
        "Celebration campfire & certificate ceremony"
      ],
      overnight: "Wilderness Camp"
    },
    {
      day: "Day 5",
      title: "Departure",
      activities: [
        "Leave No Trace — campsite restoration",
        "Feedback session & survival kit distribution",
        "Drive back to Guwahati",
        "Drop-off at Airport/Railway Station"
      ]
    }
  ],

  // ── ID 203: Northeast Ecological Immersion (Garo Hills) ──
  203: [
    {
      day: "Day 1",
      title: "Guwahati to Tura",
      route: "Drive: 6-7 hrs via Goalpara",
      activities: [
        "Pickup from Guwahati Airport",
        "Scenic drive through Assam plains to Garo Hills",
        "Evening arrival at Tura — orientation briefing",
        "Introduction to Garo tribal ecology & culture"
      ],
      overnight: "Tura"
    },
    {
      day: "Day 2",
      title: "Nokrek Biosphere Reserve",
      route: "Drive: 1.5 hrs from Tura",
      activities: [
        "Visit Nokrek National Park — UNESCO Biosphere Reserve",
        "Citrus Gene Sanctuary — world's only wild citrus habitat",
        "Red Panda habitat exploration",
        "Guided botanical walk with conservation scientist",
        "Bird watching — Hornbills, Sunbirds & endemic species",
        "Community interaction with Garo A'chik tribe"
      ],
      overnight: "Tura"
    },
    {
      day: "Day 3",
      title: "Siju Cave & Simsang River Ecosystem",
      route: "Drive: 2 hrs from Tura",
      activities: [
        "Explore Siju Cave — one of India's longest cave systems",
        "Bat colony observation & cave ecology study",
        "Simsang River riparian ecosystem walk",
        "Freshwater biodiversity sampling",
        "Aquatic insect & fish species documentation",
        "Evening lecture: Climate change impact on Garo Hills"
      ],
      overnight: "Siju / Baghmara"
    },
    {
      day: "Day 4",
      title: "Balpakram National Park",
      route: "Drive: 3 hrs from Siju",
      activities: [
        "Full-day exploration of Balpakram — 'Land of Spirits'",
        "Canyon rim walk with panoramic views",
        "Wild elephant & hoolock gibbon tracking",
        "Medicinal plant documentation with tribal healer",
        "Fossil exploration along canyon edges",
        "Sunset at Balpakram plateau"
      ],
      overnight: "Baghmara"
    },
    {
      day: "Day 5",
      title: "Wari Chora & Village Ecology",
      activities: [
        "Community-managed forest walk",
        "Butterfly & moth identification session",
        "Participatory rural ecology mapping",
        "Traditional Garo farming techniques observation",
        "Jhum (shifting cultivation) & sustainable alternatives discussion",
        "Cultural evening with Garo Wangala dance"
      ],
      overnight: "Tura"
    },
    {
      day: "Day 6",
      title: "Pelga Falls & Highland Ecology",
      activities: [
        "Trek to Pelga Falls through bamboo forests",
        "Highland grassland ecosystem study",
        "Orchid & epiphyte documentation",
        "Soil & water quality testing workshop",
        "Citizen science data compilation session"
      ],
      overnight: "Tura"
    },
    {
      day: "Day 7",
      title: "Research Synthesis & Presentation",
      activities: [
        "Morning bird census at Tura Peak",
        "Group data analysis & findings presentation",
        "Conservation action plan workshop",
        "Certificate ceremony & feedback",
        "Afternoon departure to Guwahati"
      ],
      overnight: "Guwahati (optional)"
    },
    {
      day: "Day 8",
      title: "Departure",
      activities: [
        "Transfer to Guwahati Airport/Railway Station",
        "Trip concludes — carry forward your ecological learnings"
      ]
    }
  ],

  // ── ID 204: Wari Chora — Hidden Gem of Meghalaya ──
  204: [
    {
      day: "Day 1",
      title: "Guwahati to Wari Chora Base",
      route: "Drive: 5-6 hrs",
      activities: [
        "Pickup from Guwahati Airport/Station",
        "Drive through Khasi Hills to base village",
        "Meet local guides & trek orientation",
        "Equipment check & safety briefing",
        "Evening bonfire with village community"
      ],
      overnight: "Village Homestay"
    },
    {
      day: "Day 2",
      title: "Canyon Trek & Waterfall Rappelling",
      activities: [
        "Early morning trek into Wari Chora canyon",
        "River crossing through pristine streams",
        "Waterfall rappelling — 60ft descent",
        "Natural pool swimming & cliff jumping",
        "Lunch in the wilderness",
        "Canyoning through narrow gorge sections"
      ],
      overnight: "Wilderness Camp"
    },
    {
      day: "Day 3",
      title: "Deep Forest Exploration",
      activities: [
        "Trek through sacred Khasi forests",
        "Rock climbing on natural formations",
        "Wild river swim & natural jacuzzi pools",
        "Night trek preparation — headlamp navigation",
        "Extreme wilderness camping setup",
        "Night trek through bioluminescent forest trails"
      ],
      overnight: "Forest Camp"
    },
    {
      day: "Day 4",
      title: "Summit & Return Trek",
      activities: [
        "Pre-dawn summit hike for sunrise views",
        "Panoramic photography from summit point",
        "Descent through alternate trail",
        "Final waterfall swim & canyon exploration",
        "Return to base village",
        "Farewell dinner with local community"
      ],
      overnight: "Village Homestay"
    },
    {
      day: "Day 5",
      title: "Departure",
      activities: [
        "Morning village walk & goodbyes",
        "Drive back to Guwahati",
        "Drop-off at Airport/Railway Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 205: Himachal Yoga Retreat Program ──
  205: [
    {
      day: "Day 1",
      title: "Arrival in Dharamshala",
      route: "Airport pickup from Gaggal / Bus stand Dharamshala",
      activities: [
        "Welcome at retreat centre in Dharamkot",
        "Herbal welcome drink & orientation",
        "Introduction to retreat schedule & philosophy",
        "Gentle evening yoga session",
        "Sattvic dinner & early rest"
      ],
      overnight: "Dharamkot Retreat Centre"
    },
    {
      day: "Day 2",
      title: "Yoga Foundation & Naddi Village",
      activities: [
        "6:00 AM — Pranayama & Breathwork session",
        "7:30 AM — Hatha Yoga practice (2 hrs)",
        "Organic breakfast",
        "Walk to Naddi Village — Dhauladhar mountain views",
        "Afternoon meditation & Yoga Nidra",
        "Evening Kirtan & mantra chanting"
      ],
      overnight: "Dharamkot Retreat Centre"
    },
    {
      day: "Day 3",
      title: "Tushita Meditation Centre & Deep Practice",
      activities: [
        "Morning Ashtanga Yoga flow",
        "Visit Tushita Meditation Centre — Buddhist meditation session",
        "Guided silent walking meditation in cedar forests",
        "Afternoon workshop: Chakra balancing & energy healing",
        "Evening restorative yoga & sound healing"
      ],
      overnight: "Dharamkot Retreat Centre"
    },
    {
      day: "Day 4",
      title: "Kareri Village Trek & Nature Immersion",
      route: "Trek: 3-4 hrs round trip",
      activities: [
        "Early morning yoga at sunrise point",
        "Trek to Kareri Village through pine & oak forests",
        "Riverside meditation by Kareri stream",
        "Picnic lunch with Himalayan views",
        "Afternoon free time — Ayurvedic spa or journaling",
        "Evening philosophy discussion: Patanjali's Yoga Sutras"
      ],
      overnight: "Dharamkot Retreat Centre"
    },
    {
      day: "Day 5",
      title: "Advanced Practice & McLeod Ganj",
      activities: [
        "Advanced Pranayama techniques — Kapalabhati, Nadi Shodhana",
        "Intensive Hatha Yoga practice",
        "Visit McLeod Ganj — Dalai Lama Temple complex",
        "Tibetan singing bowl meditation experience",
        "Evening Yin Yoga & deep relaxation",
        "Group sharing circle & reflections"
      ],
      overnight: "Dharamkot Retreat Centre"
    },
    {
      day: "Day 6",
      title: "Closing Ceremony & Departure",
      activities: [
        "Sunrise meditation & final yoga session",
        "Closing ceremony — certificate & blessings",
        "Personal practice plan consultation",
        "Brunch & farewell",
        "Transfer to Gaggal Airport / Dharamshala bus stand",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 206: Krem Chympe & Moopun Falls ──
  206: [
    {
      day: "Day 1",
      title: "Guwahati to Khaddum Village",
      route: "Drive: 4-5 hrs via Jowai",
      activities: [
        "Pickup from Guwahati Airport/Station",
        "Scenic drive through Jaintia Hills",
        "Arrival at Khaddum — base for cave expeditions",
        "Meet cave expedition team & safety briefing",
        "Equipment fitting — helmets, harnesses, headlamps",
        "Evening orientation on cave geology & formations"
      ],
      overnight: "Khaddum Village Homestay"
    },
    {
      day: "Day 2",
      title: "Krem Chympe Cave Exploration",
      activities: [
        "Full-day cave expedition into Krem Chympe",
        "Navigate limestone passages & underground chambers",
        "Stalactite & stalagmite formation photography",
        "Underground river navigation by boat",
        "Cave boating through flooded passages",
        "Speleology training — reading cave formations",
        "Exit via alternate passage — technical climbing section"
      ],
      overnight: "Khaddum Village Homestay"
    },
    {
      day: "Day 3",
      title: "Moopun Falls & Jungle Trek",
      activities: [
        "Trek through dense jungle to Moopun Falls",
        "Multi-tier waterfall exploration & swimming",
        "Natural rock slides & canyon pools",
        "Jungle lunch by the waterfall",
        "Return trek via scenic ridge trail",
        "Evening village cultural interaction"
      ],
      overnight: "Khaddum Village Homestay"
    },
    {
      day: "Day 4",
      title: "Departure",
      activities: [
        "Morning village walk & farewell",
        "Drive back to Guwahati via scenic route",
        "Drop-off at Airport/Railway Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 1: Double Decker Root Bridge & Cherrapunji ──
  1: [
    {
      day: "Day 1",
      title: "Guwahati to Shillong",
      route: "Drive: 3-4 hrs via NH6",
      activities: [
        "Pickup from Guwahati Airport/Railway Station",
        "Drive through scenic Khasi Hills",
        "Stop at Umiam Lake (Barapani) for photo break",
        "Arrival in Shillong — check-in & rest",
        "Evening walk at Police Bazaar",
        "Dinner at local Khasi restaurant"
      ],
      overnight: "Shillong"
    },
    {
      day: "Day 2",
      title: "Shillong to Cherrapunji",
      route: "Drive: 2.5 hrs",
      activities: [
        "Breakfast & early departure to Cherrapunji",
        "Visit Nohkalikai Falls — India's tallest plunge waterfall",
        "Explore Mawsmai Cave — limestone formations",
        "Seven Sisters Falls viewpoint",
        "Eco Park & canyon rim walks",
        "Arrival at Nongriat base village"
      ],
      overnight: "Cherrapunji"
    },
    {
      day: "Day 3",
      title: "Double Decker Root Bridge Trek",
      route: "Trek: 3,500+ steps descent & ascent",
      activities: [
        "Early morning descent to Nongriat village",
        "Cross single-decker living root bridge",
        "Arrive at Double Decker Living Root Bridge — 500+ years old",
        "Swim in Rainbow Falls natural pool",
        "Photography at the iconic bridge structure",
        "Packed lunch at Nongriat",
        "Ascent back (challenging — 3,500 steps)"
      ],
      overnight: "Cherrapunji"
    },
    {
      day: "Day 4",
      title: "Cherrapunji Exploration & Mawlynnong",
      route: "Drive: 2.5 hrs to Mawlynnong",
      activities: [
        "Visit Arwah Cave — fossil-rich limestone cave",
        "Garden of Caves — waterfall & rock formations",
        "Drive to Mawlynnong — Asia's cleanest village",
        "Living Root Bridge at Riwai",
        "Sky Walk — bamboo platform over valley",
        "Bangladesh border viewpoint"
      ],
      overnight: "Shillong"
    },
    {
      day: "Day 5",
      title: "Shillong & Departure",
      activities: [
        "Don Bosco Museum — largest museum in Northeast",
        "Cathedral of Mary Help of Christians",
        "Ward's Lake morning walk",
        "Souvenir shopping at Police Bazaar",
        "Drive to Guwahati Airport — drop-off",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 5: Shillong Winter Cultural Sojourn ──
  5: [
    {
      day: "Day 1",
      title: "Arrival & Shillong Exploration",
      route: "Guwahati to Shillong (Drive: 3-4 hrs)",
      activities: [
        "Pickup from Guwahati Airport/Station",
        "Drive via Umiam Lake — photo stop",
        "Check-in at Shillong hotel/homestay",
        "Visit Air Force Museum — aviation history",
        "Shillong Golf Course — one of the oldest in Asia",
        "Evening at Police Bazaar — street food & shopping",
        "Live music at local café (Shillong's music culture)"
      ],
      overnight: "Shillong"
    },
    {
      day: "Day 2",
      title: "Cultural Immersion & Departure",
      activities: [
        "Morning visit to Don Bosco Centre for Indigenous Cultures",
        "Cathedral of Mary Help of Christians",
        "Ward's Lake & Lady Hydari Park walk",
        "Elephant Falls visit",
        "Local Khasi lunch — Jadoh, Tungrymbai & Doh Khlieh",
        "Drive back to Guwahati for departure",
        "Drop-off at Airport/Railway Station"
      ]
    }
  ],

  // ── ID 7: Moopun Falls & Phe Phe Falls Adventure ──
  7: [
    {
      day: "Day 1",
      title: "Guwahati to Phe Phe Falls",
      route: "Drive: 4-5 hrs to East Khasi Hills",
      activities: [
        "Pickup from Guwahati Airport/Station",
        "Drive through Khasi Hills countryside",
        "Trek to Phe Phe Falls (2 hrs moderate trail)",
        "Swim in crystal-clear turquoise pool",
        "Photography at multi-tier cascade",
        "Return trek & drive to base"
      ],
      overnight: "East Khasi Hills Homestay"
    },
    {
      day: "Day 2",
      title: "Moopun Waterfall Expedition",
      activities: [
        "Early departure for Moopun Falls trek",
        "Jungle trail through dense subtropical forest",
        "Arrive at Moopun Falls — dramatic multi-tier cascade",
        "Natural rock sliding & swimming",
        "Explore hidden pools above main falls",
        "Packed lunch in the wilderness",
        "Return trek via ridge trail with valley views"
      ],
      overnight: "East Khasi Hills Homestay"
    },
    {
      day: "Day 3",
      title: "Hidden Falls & Departure",
      activities: [
        "Morning trek to a lesser-known local waterfall",
        "Village walk & interaction with Khasi families",
        "Local Khasi lunch — authentic village cooking",
        "Drive back to Guwahati",
        "Drop-off at Airport/Railway Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 29: Arunachal Tawang Exploration ──
  29: [
    {
      day: "Day 1",
      title: "Guwahati to Bhalukpong",
      route: "Drive: 5-6 hrs",
      activities: [
        "Pickup from Guwahati Airport/Station",
        "Inner Line Permit (ILP) check at Bhalukpong",
        "Drive through Assam plains to Arunachal foothills",
        "Evening arrival & check-in",
        "Riverside walk along Kameng River"
      ],
      overnight: "Bhalukpong"
    },
    {
      day: "Day 2",
      title: "Bhalukpong to Dirang",
      route: "Drive: 4-5 hrs via Bomdila",
      activities: [
        "Scenic mountain drive through Eastern Himalayas",
        "Stop at Bomdila Monastery — panoramic views",
        "Visit Bomdila craft centre — Monpa weaving",
        "Arrival at Dirang — hot springs soak",
        "Dirang Dzong (fortress) exploration",
        "Evening walk through apple & kiwi orchards"
      ],
      overnight: "Dirang"
    },
    {
      day: "Day 3",
      title: "Dirang to Tawang via Sela Pass",
      route: "Drive: 6-7 hrs via Sela Pass (13,700 ft)",
      activities: [
        "Early departure for Sela Pass crossing",
        "Sela Pass — 13,700 ft, snow-capped panoramas",
        "Sela Lake — sacred frozen high-altitude lake",
        "Stop at Jaswant Garh War Memorial",
        "Visit Nuranang Waterfall (Jang Falls) — 100m cascade",
        "Arrival at Tawang — evening monastery views"
      ],
      overnight: "Tawang"
    },
    {
      day: "Day 4",
      title: "Tawang Monastery & Bumla Pass",
      route: "Bumla Pass: 37 km from Tawang (permit required)",
      activities: [
        "Visit Tawang Monastery — India's largest Buddhist monastery",
        "Explore ancient manuscripts & prayer halls",
        "Drive to Bumla Pass — India-China border (15,200 ft)",
        "India-China border point & army post visit",
        "Madhuri Lake (Sangetsar Tso) — stunning glacial lake",
        "Visit PTSO Lake — high-altitude bird habitat",
        "Evening Tawang market walk"
      ],
      overnight: "Tawang"
    },
    {
      day: "Day 5",
      title: "Tawang to Bomdila",
      route: "Drive: 7-8 hrs return journey",
      activities: [
        "Morning visit to Tawang War Memorial — 1962 heroes",
        "Visit Urgelling Monastery — birthplace of 6th Dalai Lama",
        "Return drive via Sela Pass",
        "Stop at Bomdila for sunset views",
        "Shopping for local handicrafts & Monpa textiles"
      ],
      overnight: "Bomdila"
    },
    {
      day: "Day 6",
      title: "Bomdila to Guwahati & Departure",
      route: "Drive: 8-9 hrs",
      activities: [
        "Early departure from Bomdila",
        "Scenic descent through Arunachal foothills",
        "Lunch stop en route",
        "Arrival at Guwahati — drop-off at Airport/Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 201: Meghalaya Biodiversity Research Expedition (8-day) ──
  201: [
    {
      day: "Day 0",
      title: "Arrival in Guwahati",
      activities: [
        "Arrive at Guwahati Airport/Station",
        "Transfer to hotel & rest",
        "Evening orientation & research briefing",
        "Meet fellow expedition members & naturalist guides"
      ],
      overnight: "Guwahati"
    },
    {
      day: "Day 1",
      title: "Guwahati to Shillong & Upper Shillong Forests",
      route: "Drive: 3-4 hrs",
      activities: [
        "Drive to Shillong via Umiam Lake",
        "Afternoon field session at Upper Shillong sacred forests",
        "Orchid & fern species identification",
        "Introduction to Meghalaya's unique Khasi biodiversity",
        "Evening lecture: Meghalaya — a biodiversity hotspot"
      ],
      overnight: "Shillong"
    },
    {
      day: "Day 2",
      title: "Mawphlang Sacred Forest",
      route: "Drive: 1 hr from Shillong",
      activities: [
        "Full-day at Mawphlang Sacred Grove — 800+ year old forest",
        "Guided walk with Khasi elder — traditional forest laws",
        "Moss, lichen & epiphyte documentation",
        "Medicinal plant identification with tribal healer",
        "Bird census — Asian Barred Owlet, Sultan Tit, Maroon Oriole",
        "Soil sampling & ecosystem health assessment"
      ],
      overnight: "Shillong"
    },
    {
      day: "Day 3",
      title: "Cherrapunji Limestone Ecosystem",
      route: "Drive: 2.5 hrs",
      activities: [
        "Drive to Cherrapunji — wettest place on Earth",
        "Mawsmai Cave exploration — limestone ecology",
        "Nohkalikai Falls — plunge pool ecosystem study",
        "Cliff-edge flora documentation",
        "Rainfall impact on karst landscape research",
        "Evening data compilation"
      ],
      overnight: "Cherrapunji"
    },
    {
      day: "Day 4",
      title: "Living Root Bridge Ecosystem Trek",
      route: "Trek: 3,500 steps descent",
      activities: [
        "Trek to Nongriat — Double Decker Root Bridge",
        "Root bridge bio-engineering documentation",
        "Stream biodiversity sampling — freshwater crabs, fish",
        "Riparian forest ecology study",
        "Rainbow Falls microhabitat analysis",
        "Ascent & evening species list compilation"
      ],
      overnight: "Cherrapunji"
    },
    {
      day: "Day 5",
      title: "Mawlynnong & Dawki Ecosystem",
      route: "Drive: 2.5 hrs",
      activities: [
        "Drive to Mawlynnong — Asia's cleanest village",
        "Community-managed forest conservation model study",
        "Butterfly transect walk — species diversity count",
        "Visit Dawki/Umngot River — aquatic ecology observation",
        "Water clarity analysis & fish species documentation",
        "Indo-Bangladesh border ecosystem transition zone"
      ],
      overnight: "Dawki"
    },
    {
      day: "Day 6",
      title: "Jaintia Hills — Cave & Wetland Ecology",
      route: "Drive: 3 hrs from Dawki",
      activities: [
        "Krem Mawmluh — cave fauna documentation",
        "Underground stream sampling for cave-adapted species",
        "Syntung wetlands — migratory bird observation",
        "Amphibian diversity survey",
        "Evening research synthesis session"
      ],
      overnight: "Jowai"
    },
    {
      day: "Day 7",
      title: "Research Presentation & Departure Prep",
      activities: [
        "Morning bird watching at Jowai hills",
        "Group research presentation & findings discussion",
        "Conservation action plan drafting",
        "Certificate ceremony & expedition debrief",
        "Drive to Guwahati"
      ],
      overnight: "Guwahati"
    },
    {
      day: "Day 8",
      title: "Departure",
      activities: [
        "Transfer to Guwahati Airport/Railway Station",
        "Expedition concludes — take your field notes & research data home"
      ]
    }
  ],

  // ── ID 4: Dawki Crystal Waters Winter Escape ──
  4: [
    {
      day: "Day 1",
      title: "Guwahati to Dawki",
      route: "Drive: 5-6 hrs via Shillong bypass",
      activities: [
        "Pickup from Guwahati Airport/Station",
        "Scenic drive through Khasi Hills",
        "Arrival at Dawki — Umngot River",
        "Transparent river boating — see riverbed 20ft below",
        "Photography at India's clearest river",
        "Evening riverside bonfire"
      ],
      overnight: "Dawki Riverside Camp"
    },
    {
      day: "Day 2",
      title: "River Exploration & Border Views",
      activities: [
        "Sunrise kayaking on Umngot River",
        "Visit Indo-Bangladesh border — Tamabil",
        "Shnongpdeng cliff jumping & swimming",
        "Snorkeling in crystal-clear waters",
        "Local Khasi lunch — Jadoh & Tungrymbai",
        "Evening stargazing by the river"
      ],
      overnight: "Dawki Riverside Camp"
    },
    {
      day: "Day 3",
      title: "Departure",
      activities: [
        "Morning boat ride — winter light photography",
        "Visit Byrdaw Falls en route",
        "Drive back to Guwahati",
        "Drop-off at Airport/Railway Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 6: Krang Suri Waterfall Budget Getaway ──
  6: [
    {
      day: "Day 1",
      title: "Guwahati to Krang Suri",
      route: "Drive: 5-6 hrs via Jowai",
      activities: [
        "Pickup from Guwahati Airport/Station",
        "Drive through Jaintia Hills",
        "Arrival & trek to Krang Suri Waterfall",
        "Swim in turquoise natural pools",
        "Photography at the stunning cascade",
        "Evening at local Jaintia homestay"
      ],
      overnight: "Jaintia Hills Homestay"
    },
    {
      day: "Day 2",
      title: "Exploration & Departure",
      activities: [
        "Morning revisit to Krang Suri — fewer crowds",
        "Explore nearby caves & viewpoints",
        "Jaintia tribal market visit",
        "Local lunch — smoked pork & rice beer",
        "Drive back to Guwahati",
        "Drop-off at Airport/Railway Station"
      ]
    }
  ],

  // ── ID 8: Meghalaya Waterfalls Budget Circuit ──
  8: [
    {
      day: "Day 1",
      title: "Guwahati to Krang Suri Falls",
      route: "Drive: 5-6 hrs via Jowai",
      activities: [
        "Pickup from Guwahati Airport/Station",
        "Drive to Jaintia Hills",
        "Trek to Krang Suri Waterfall",
        "Swimming in turquoise natural pools",
        "Photography session at sunset light"
      ],
      overnight: "Jaintia Hills Homestay"
    },
    {
      day: "Day 2",
      title: "Moopun Falls & Hidden Cascades",
      route: "Drive: 2-3 hrs",
      activities: [
        "Trek to Moopun Falls through subtropical forest",
        "Multi-tier waterfall swimming & rock slides",
        "Explore hidden cascades above main falls",
        "Packed jungle lunch",
        "Photography at lesser-known waterfalls",
        "Return to base"
      ],
      overnight: "East Khasi Hills Homestay"
    },
    {
      day: "Day 3",
      title: "Departure",
      activities: [
        "Morning visit to a local waterfall",
        "Village walk & Khasi breakfast",
        "Drive back to Guwahati",
        "Drop-off at Airport/Railway Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 21: Arunachal Winter Cultural Festival ──
  21: [
    {
      day: "Day 1",
      title: "Guwahati to Itanagar",
      route: "Drive: 6-7 hrs / Flight: 1 hr",
      activities: [
        "Pickup from Guwahati Airport/Station",
        "Drive/fly to Itanagar — Arunachal capital",
        "Inner Line Permit (ILP) processing",
        "Visit Ita Fort — 14th century ruins",
        "Evening cultural orientation"
      ],
      overnight: "Itanagar"
    },
    {
      day: "Day 2",
      title: "Tribal Village Immersion",
      activities: [
        "Visit Nyishi tribal village",
        "Traditional bamboo house architecture tour",
        "Tribal dance performance & interaction",
        "Traditional craft market — cane & bamboo works",
        "Local cuisine tasting — Apong (rice beer) & smoked meats",
        "Evening tribal folklore storytelling"
      ],
      overnight: "Itanagar"
    },
    {
      day: "Day 3",
      title: "Festival Grounds & Cultural Programs",
      activities: [
        "Full-day festival activities",
        "Tribal dance competitions from 26+ tribes",
        "Traditional archery demonstrations",
        "Handicraft exhibitions & artisan interactions",
        "Traditional food stalls — diverse tribal cuisines",
        "Evening cultural gala & bonfire"
      ],
      overnight: "Festival Ground / Itanagar"
    },
    {
      day: "Day 4",
      title: "Ziro Valley Excursion",
      route: "Drive: 5-6 hrs from Itanagar",
      activities: [
        "Drive to Ziro Valley — UNESCO World Heritage site",
        "Apatani tribal village walk — unique nose plugs & tattoo tradition",
        "Rice paddy terraces photography",
        "Pine grove & bamboo forest hike",
        "Evening interaction with Apatani elders"
      ],
      overnight: "Ziro Valley"
    },
    {
      day: "Day 5",
      title: "Ziro Valley Exploration",
      activities: [
        "Sunrise at Ziro paddy fields",
        "Visit Talley Valley Wildlife Sanctuary area",
        "Traditional Apatani weaving demonstration",
        "Local market visit — organic produce & handicrafts",
        "Afternoon departure to Itanagar"
      ],
      overnight: "Itanagar"
    },
    {
      day: "Day 6",
      title: "Departure",
      activities: [
        "Morning visit to Jawaharlal Nehru State Museum",
        "Souvenir shopping — tribal crafts & textiles",
        "Drive/fly back to Guwahati",
        "Drop-off at Airport/Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 22: Assam Wildlife & Tea Heritage ──
  22: [
    {
      day: "Day 1",
      title: "Guwahati to Kaziranga",
      route: "Drive: 5-6 hrs via NH27",
      activities: [
        "Pickup from Guwahati Airport/Station",
        "Drive through Assam's Brahmaputra valley",
        "Arrival at Kaziranga National Park",
        "Evening nature walk at resort periphery",
        "Wildlife orientation & safari briefing"
      ],
      overnight: "Kaziranga Resort"
    },
    {
      day: "Day 2",
      title: "Kaziranga Elephant & Jeep Safari",
      activities: [
        "5:00 AM — Elephant safari in Central Range",
        "One-horned rhino tracking in misty grasslands",
        "Breakfast at resort",
        "Afternoon jeep safari — Western Range",
        "Wild buffalo, elephant & deer spotting",
        "Bird watching — Bengal Florican, Pallas's Fish Eagle",
        "Evening bonfire with naturalist talk"
      ],
      overnight: "Kaziranga Resort"
    },
    {
      day: "Day 3",
      title: "Eastern Range & Tea Gardens",
      route: "Drive to Jorhat: 2-3 hrs",
      activities: [
        "Morning jeep safari — Eastern Range",
        "Tiger territory & swamp deer habitat",
        "Drive to Jorhat — tea capital of Assam",
        "Visit heritage tea estate — plucking & processing tour",
        "Tea tasting session — orthodox & CTC varieties",
        "Evening at colonial tea bungalow"
      ],
      overnight: "Jorhat Tea Bungalow"
    },
    {
      day: "Day 4",
      title: "Majuli Island",
      route: "Ferry: 1.5 hrs from Jorhat",
      activities: [
        "Ferry to Majuli — world's largest river island",
        "Visit Vaishnavite Satras (monasteries)",
        "Mask-making workshop with local artisans",
        "Mising tribal village interaction",
        "Traditional Assamese thali lunch",
        "Sunset at Brahmaputra riverbank"
      ],
      overnight: "Majuli Island"
    },
    {
      day: "Day 5",
      title: "Kamakhya Temple & Guwahati",
      route: "Drive: 6-7 hrs via Nagaon",
      activities: [
        "Morning departure for Guwahati",
        "Visit Kamakhya Temple — powerful Shakti Peetha",
        "Umananda Island temple — Brahmaputra boat ride",
        "Fancy Bazaar shopping — silk & spices",
        "Evening Ganga aarti at Brahmaputra ghat"
      ],
      overnight: "Guwahati"
    },
    {
      day: "Day 6",
      title: "Departure",
      activities: [
        "Morning visit to Assam State Museum",
        "Transfer to Guwahati Airport/Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 23: Nagaland Dzukou Valley & Kohima Heritage ──
  23: [
    {
      day: "Day 1",
      title: "Guwahati/Dimapur to Kohima",
      route: "Drive: 3-4 hrs from Dimapur",
      activities: [
        "Pickup from Dimapur Airport/Station",
        "Drive through Naga hills to Kohima",
        "Visit Kohima War Cemetery — WWII memorial",
        "Kohima State Museum",
        "Evening walk at Kohima town"
      ],
      overnight: "Kohima"
    },
    {
      day: "Day 2",
      title: "Dzukou Valley Trek",
      route: "Trek: 6-7 hrs round trip",
      activities: [
        "Early morning drive to trek base (Viswema village)",
        "Trek to Dzukou Valley — Valley of Flowers of the East",
        "Explore seasonal wildflowers & rolling grasslands",
        "Packed lunch at valley campsite",
        "Photography at Dzukou river & lily pools",
        "Return trek to base"
      ],
      overnight: "Kohima / Dzukou Camp"
    },
    {
      day: "Day 3",
      title: "Naga Tribal Villages",
      activities: [
        "Visit Khonoma — first green village of India",
        "Traditional Angami Naga morung (dormitory) visit",
        "Naga warrior dance performance",
        "Traditional feast — smoked pork, bamboo shoot, Axone",
        "Handicraft shopping — Naga shawls & beadwork"
      ],
      overnight: "Kohima"
    },
    {
      day: "Day 4",
      title: "Heritage Trail & Markets",
      activities: [
        "Visit Naga Heritage Village — Kisama",
        "Traditional Naga house replicas from all tribes",
        "Local market visit — Naga chillies & fermented bamboo",
        "Afternoon departure to Dimapur"
      ],
      overnight: "Dimapur"
    },
    {
      day: "Day 5",
      title: "Departure",
      activities: [
        "Morning visit to Dimapur ruins — Kachari kingdom",
        "Transfer to Dimapur Airport/Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 230: Kohima WWII Heritage & Tribal Culture ──
  230: [
    {
      day: "Day 1",
      title: "Arrival in Kohima",
      route: "Dimapur to Kohima (Drive: 3-4 hrs)",
      activities: [
        "Pickup from Dimapur Airport/Station",
        "Drive through Naga hills",
        "Visit Kohima War Cemetery — 1,420 Commonwealth graves",
        "Walk through Kohima town — colonial & tribal heritage",
        "Evening orientation on Naga history"
      ],
      overnight: "Kohima"
    },
    {
      day: "Day 2",
      title: "WWII Heritage & Naga Culture Deep Dive",
      activities: [
        "Kohima State Museum — tribal artifacts & WWII exhibits",
        "Visit Tennis Court (Battle of Kohima site)",
        "Naga Heritage Village — Kisama",
        "Traditional morung house exploration",
        "Naga tribal dance & warrior demonstration",
        "Traditional Naga feast — smoked meats & bamboo shoot"
      ],
      overnight: "Kohima"
    },
    {
      day: "Day 3",
      title: "Khonoma Village & Craft Trail",
      activities: [
        "Visit Khonoma — Asia's first green village",
        "Angami Naga community interaction",
        "Traditional Naga shawl weaving demonstration",
        "Nature walk through community-conserved forest",
        "Afternoon handicraft shopping — beadwork & woodcraft"
      ],
      overnight: "Kohima"
    },
    {
      day: "Day 4",
      title: "Departure",
      activities: [
        "Morning local market visit — Naga chillies & spices",
        "Drive to Dimapur",
        "Transfer to Dimapur Airport/Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 24: Manipur Loktak Lake Winter Discovery ──
  24: [
    {
      day: "Day 1",
      title: "Arrival in Imphal",
      route: "Flight to Imphal / Drive from Dimapur",
      activities: [
        "Pickup from Imphal Airport",
        "Visit Kangla Fort — ancient royal seat",
        "Ima Keithel — world's largest all-women market",
        "Manipur State Museum",
        "Evening cultural performance — Ras Lila dance"
      ],
      overnight: "Imphal"
    },
    {
      day: "Day 2",
      title: "Loktak Lake & Keibul Lamjao",
      route: "Drive: 1.5 hrs from Imphal",
      activities: [
        "Drive to Loktak Lake — largest freshwater lake in NE",
        "Boat ride through floating phumdi islands",
        "Keibul Lamjao National Park — world's only floating park",
        "Sangai deer spotting — Manipur's state animal",
        "Floating village visit — Champu Khangpok",
        "Sunset over Loktak from Sendra Island"
      ],
      overnight: "Moirang / Loktak"
    },
    {
      day: "Day 3",
      title: "Moirang & INA Heritage",
      activities: [
        "INA Museum — Subhas Chandra Bose memorial",
        "Moirang ancient temple visit",
        "Local Manipuri cuisine — Eromba, Singju & Chak-hao",
        "Handloom & handicraft centre visit",
        "Traditional Meitei pottery workshop"
      ],
      overnight: "Imphal"
    },
    {
      day: "Day 4",
      title: "Departure",
      activities: [
        "Morning visit to Shree Govindajee Temple",
        "Red Hill (Japan's WWII memorial) visit",
        "Transfer to Imphal Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 26: Tripura Heritage & Craft Trail ──
  26: [
    {
      day: "Day 1",
      title: "Arrival in Agartala",
      route: "Flight to Agartala",
      activities: [
        "Pickup from Agartala Airport",
        "Visit Ujjayanta Palace — grand Indo-Saracenic architecture",
        "Tripura State Museum inside the palace",
        "Heritage walk through Agartala old town",
        "Evening at Rabindra Kanan park"
      ],
      overnight: "Agartala"
    },
    {
      day: "Day 2",
      title: "Neermahal & Bamboo Craft Villages",
      route: "Drive: 1.5 hrs to Melaghar",
      activities: [
        "Boat ride to Neermahal — India's only water palace",
        "Photography at the lake palace complex",
        "Visit bamboo & cane handicraft village",
        "Traditional Tripuri weaving demonstration",
        "Bamboo basket & furniture making workshop",
        "Local tribal lunch — Mui Borok cuisine"
      ],
      overnight: "Agartala"
    },
    {
      day: "Day 3",
      title: "Unakoti & Heritage Sites",
      route: "Drive: 4 hrs to Unakoti",
      activities: [
        "Drive to Unakoti — ancient rock-cut sculptures",
        "Explore 7th-century carved Shiva figures",
        "Pillar Rocks & waterfall viewpoints",
        "Tribal heritage museum visit",
        "Evening drive back or stay at Unakoti"
      ],
      overnight: "Kailashahar / Agartala"
    },
    {
      day: "Day 4",
      title: "Departure",
      activities: [
        "Morning visit to Fourteen Goddess Temple (Chaturdasha)",
        "Souvenir shopping — tribal textiles & bamboo crafts",
        "Transfer to Agartala Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 28: Bumla Pass Bike Expedition ──
  28: [
    {
      day: "Day 1",
      title: "Guwahati — Ride Prep & Departure",
      route: "Guwahati to Tezpur (Drive: 4-5 hrs)",
      activities: [
        "Bike allocation & inspection",
        "Riding gear fitting — helmet, jacket, gloves, knee guards",
        "Route briefing & safety protocols",
        "Ride to Tezpur via NH27",
        "Evening riverside halt at Brahmaputra"
      ],
      overnight: "Tezpur"
    },
    {
      day: "Day 2",
      title: "Tezpur to Bhalukpong — Arunachal Gateway",
      route: "Ride: 60 km, 2-3 hrs",
      activities: [
        "Inner Line Permit (ILP) processing",
        "Ride through tea gardens & foothills",
        "Entry into Arunachal Pradesh",
        "Kameng River bridge crossing",
        "Evening campfire & route review"
      ],
      overnight: "Bhalukpong"
    },
    {
      day: "Day 3",
      title: "Bhalukpong to Dirang",
      route: "Ride: 140 km, 5-6 hrs mountain roads",
      activities: [
        "Climb into Eastern Himalayas",
        "Pass through Bomdila — panoramic Himalayan views",
        "Stop at Bomdila monastery",
        "Arrive Dirang — hot springs soak",
        "Bike maintenance check"
      ],
      overnight: "Dirang"
    },
    {
      day: "Day 4",
      title: "Dirang to Tawang via Sela Pass",
      route: "Ride: 180 km, 7-8 hrs via Sela Pass (13,700 ft)",
      activities: [
        "Epic Sela Pass crossing at 13,700 ft",
        "Snow & ice riding sections",
        "Sela Lake photo stop",
        "Jaswant Garh War Memorial",
        "Nuranang Waterfall (100m cascade)",
        "Triumphant arrival at Tawang"
      ],
      overnight: "Tawang"
    },
    {
      day: "Day 5",
      title: "Tawang Monastery & Rest Day",
      activities: [
        "Visit Tawang Monastery — India's largest",
        "Explore prayer halls & ancient manuscripts",
        "Tawang War Memorial — 1962 heroes tribute",
        "Local market walk & Monpa cuisine",
        "Bike rest day — maintenance & preparation"
      ],
      overnight: "Tawang"
    },
    {
      day: "Day 6",
      title: "Bumla Pass — Indo-China Border",
      route: "Ride: 37 km one way (permit required)",
      activities: [
        "Ride to Bumla Pass — 15,200 ft",
        "India-China border point visit",
        "Army post interaction",
        "Madhuri Lake (Sangetsar Tso) — glacial lake",
        "PTSO Lake — high-altitude riding",
        "Return to Tawang"
      ],
      overnight: "Tawang"
    },
    {
      day: "Day 7",
      title: "Tawang to Bomdila Return",
      route: "Ride: 180 km return via Sela Pass",
      activities: [
        "Return ride via Sela Pass",
        "Different light conditions — new photo opportunities",
        "Stop at Jung Falls viewpoint",
        "Arrive Bomdila — sunset views",
        "Evening celebration dinner"
      ],
      overnight: "Bomdila"
    },
    {
      day: "Day 8",
      title: "Bomdila to Guwahati & Departure",
      route: "Ride: 300+ km, full day descent",
      activities: [
        "Final ride through Arunachal foothills",
        "Scenic descent to Assam plains",
        "Lunch stop at Tezpur",
        "Arrival at Guwahati — bike return",
        "Certificate ceremony & farewell",
        "Drop-off at Airport/Station"
      ]
    }
  ],

  // ── ID 53: Pelling Kanchenjunga Winter Views ──
  53: [
    {
      day: "Day 1",
      title: "Arrival in Pelling",
      route: "Bagdogra to Pelling (Drive: 5-6 hrs)",
      activities: [
        "Pickup from Bagdogra Airport/NJP Station",
        "Scenic drive through Teesta valley & Rangit river",
        "Arrival at Pelling — Kanchenjunga views",
        "Visit Pemayangtse Monastery — oldest in Sikkim",
        "Evening sunset over Kanchenjunga massif"
      ],
      overnight: "Pelling"
    },
    {
      day: "Day 2",
      title: "Pelling Heritage & Adventure",
      activities: [
        "Sunrise point — Kanchenjunga golden hour",
        "Skywalk & glass bridge experience",
        "Rabdentse Ruins — ancient Sikkimese capital",
        "Khecheopalri Lake — sacred wishing lake",
        "Rimbi Waterfall & rock garden visit",
        "Evening monastery chanting ceremony"
      ],
      overnight: "Pelling"
    },
    {
      day: "Day 3",
      title: "Ravangla & Buddha Park",
      route: "Drive: 2 hrs",
      activities: [
        "Drive to Ravangla — panoramic mountain route",
        "Buddha Park — 130 ft Tathagata Tsal statue",
        "Temi Tea Garden — Sikkim's only tea estate",
        "Tea plucking experience & tasting",
        "Char Dham temple complex visit"
      ],
      overnight: "Ravangla / Pelling"
    },
    {
      day: "Day 4",
      title: "Departure",
      activities: [
        "Morning Kanchenjunga photography",
        "Traditional Sikkimese breakfast — thukpa & momos",
        "Drive to Bagdogra Airport/NJP Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 55: North Sikkim Winter Expedition ──
  55: [
    {
      day: "Day 1",
      title: "Bagdogra to Gangtok",
      route: "Drive: 4-5 hrs via NH10",
      activities: [
        "Pickup from Bagdogra Airport/NJP Station",
        "Scenic drive along Teesta River",
        "Arrival in Gangtok — capital of Sikkim",
        "MG Marg evening walk",
        "Permit processing for North Sikkim"
      ],
      overnight: "Gangtok"
    },
    {
      day: "Day 2",
      title: "Gangtok Sightseeing",
      activities: [
        "Visit Rumtek Monastery — seat of Karmapa",
        "Enchey Monastery — 200-year-old hilltop monastery",
        "Namgyal Institute of Tibetology",
        "Flower Exhibition Centre — orchids & rhododendrons",
        "Tashi Viewpoint — Kanchenjunga panorama",
        "Ropeway ride over Gangtok valley"
      ],
      overnight: "Gangtok"
    },
    {
      day: "Day 3",
      title: "Gangtok to Lachung",
      route: "Drive: 6-7 hrs via Chungthang",
      activities: [
        "Drive through Seven Sisters Waterfalls",
        "Naga Waterfall stop",
        "Chungthang confluence — Lachen & Lachung rivers",
        "Arrival at Lachung — alpine village at 9,600 ft",
        "Evening walk in Lachung village",
        "Hot soup & bonfire at hotel"
      ],
      overnight: "Lachung"
    },
    {
      day: "Day 4",
      title: "Yumthang Valley & Zero Point",
      route: "Drive: 1.5 hrs to Yumthang, 2.5 hrs to Zero Point",
      activities: [
        "Drive to Yumthang Valley — Valley of Flowers",
        "Hot springs at Yumthang",
        "Continue to Zero Point (15,300 ft) — snow experience",
        "Photography at snow-covered peaks",
        "Return to Lachung via scenic route"
      ],
      overnight: "Lachung"
    },
    {
      day: "Day 5",
      title: "Lachung to Lachen",
      route: "Drive: 4-5 hrs via Chungthang",
      activities: [
        "Drive to Lachen — gateway to Gurudongmar",
        "Scenic route through rhododendron forests",
        "Lachen village walk — Lachenpa tribe interaction",
        "Early dinner & rest for high-altitude day ahead"
      ],
      overnight: "Lachen"
    },
    {
      day: "Day 6",
      title: "Gurudongmar Lake",
      route: "Drive: 4 hrs one way (17,100 ft)",
      activities: [
        "4:00 AM departure for Gurudongmar Lake",
        "Drive through Thangu & Chopta Valley",
        "Arrive at Gurudongmar — sacred high-altitude lake",
        "Photography at one of the world's highest lakes",
        "High-altitude acclimatization experience",
        "Return to Lachen"
      ],
      overnight: "Lachen"
    },
    {
      day: "Day 7",
      title: "Lachen to Gangtok & Departure",
      route: "Drive: 6-7 hrs",
      activities: [
        "Drive back to Gangtok via scenic route",
        "Stop at Singhik viewpoint — Kanchenjunga views",
        "Farewell lunch at Gangtok",
        "Continue to Bagdogra Airport/NJP Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 52: Sikkim Peaceful Winter Retreat ──
  52: [
    {
      day: "Day 1",
      title: "Bagdogra to Gangtok",
      route: "Drive: 4-5 hrs",
      activities: [
        "Pickup from Bagdogra Airport/NJP Station",
        "Scenic drive along Teesta River valley",
        "Check-in at heritage homestay/hotel",
        "Afternoon walk at MG Marg",
        "Evening monastery chanting — Enchey Monastery"
      ],
      overnight: "Gangtok"
    },
    {
      day: "Day 2",
      title: "Monasteries & Valley Walks",
      activities: [
        "Visit Rumtek Monastery — Buddhist meditation session",
        "Nature walk through Gangtok's ridge trails",
        "Flower Exhibition Centre — winter orchids",
        "Organic farm visit — fresh mountain produce",
        "Afternoon Tibetan cooking class",
        "Evening bonfire & storytelling"
      ],
      overnight: "Gangtok"
    },
    {
      day: "Day 3",
      title: "Tsomgo Lake & Baba Harbhajan Singh Temple",
      route: "Drive: 2 hrs one way",
      activities: [
        "Drive to Tsomgo Lake — sacred alpine lake at 12,310 ft",
        "Yak ride & lake photography",
        "Continue to Baba Harbhajan Singh Temple",
        "Mountain panorama viewpoints",
        "Return to Gangtok — free time for shopping"
      ],
      overnight: "Gangtok"
    },
    {
      day: "Day 4",
      title: "Departure",
      activities: [
        "Sunrise from Tashi Viewpoint — Kanchenjunga",
        "Traditional Sikkimese breakfast",
        "Drive to Bagdogra Airport/NJP Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 64: Kullu Valley Winter Adventure ──
  64: [
    {
      day: "Day 1",
      title: "Arrival in Kullu",
      route: "Bhuntar Airport / Manali bus stand pickup",
      activities: [
        "Pickup from Bhuntar Airport or bus stand",
        "Drive through Kullu Valley — Beas River views",
        "Check-in at riverside resort",
        "Afternoon hot spring visit — Manikaran/Vashisht",
        "Evening bonfire at campsite"
      ],
      overnight: "Kullu / Manali"
    },
    {
      day: "Day 2",
      title: "Adventure Day — Paragliding & Trails",
      activities: [
        "Morning paragliding at Solang Valley / Bir Billing prep",
        "Tandem paraglide over snow-capped mountains",
        "Afternoon mountain biking trail — Naggar route",
        "Beas River walk & bridge crossing",
        "Evening at Kasol village — café culture"
      ],
      overnight: "Kasol / Kullu"
    },
    {
      day: "Day 3",
      title: "Apple Orchards & Hot Springs",
      activities: [
        "Visit Kullu apple & cherry orchards",
        "Fruit tasting & orchard photography",
        "Manikaran Gurudwara & hot springs",
        "Parvati Valley scenic drive",
        "Afternoon trek to Chalal village",
        "Evening riverside dinner"
      ],
      overnight: "Kullu"
    },
    {
      day: "Day 4",
      title: "Departure",
      activities: [
        "Morning yoga by the river",
        "Naggar Castle visit — heritage museum",
        "Roerich Art Gallery",
        "Transfer to Bhuntar Airport / bus stand",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 63: Dharamshala McLeod Ganj Winter ──
  63: [
    {
      day: "Day 1",
      title: "Arrival in Dharamshala",
      route: "Gaggal Airport / Dharamshala bus stand pickup",
      activities: [
        "Pickup from Gaggal Airport or bus stand",
        "Drive to McLeod Ganj",
        "Visit Dalai Lama Temple Complex — Tsuglagkhang",
        "Tibetan Museum & Cultural Institute",
        "Evening walk at McLeod Ganj main square"
      ],
      overnight: "McLeod Ganj"
    },
    {
      day: "Day 2",
      title: "Triund Trek & Monastery Visits",
      route: "Trek: 9 km, 4-5 hrs one way",
      activities: [
        "Early morning departure for Triund trek",
        "Trek through oak & rhododendron forests",
        "Arrive at Triund top — 360° Dhauladhar panorama",
        "Packed lunch at summit",
        "Descent & visit Norbulingka Monastery",
        "Evening Tibetan cooking class"
      ],
      overnight: "McLeod Ganj"
    },
    {
      day: "Day 3",
      title: "Bhagsu & Dharamkot Exploration",
      activities: [
        "Morning meditation session",
        "Visit Bhagsu Waterfall",
        "Walk through Dharamkot village — yoga capital",
        "St. John's Church in the Wilderness",
        "HPCA Cricket Stadium views",
        "Evening shopping — Tibetan handicrafts & singing bowls"
      ],
      overnight: "McLeod Ganj"
    },
    {
      day: "Day 4",
      title: "Kangra Valley & Fort",
      route: "Drive: 40 mins",
      activities: [
        "Visit Kangra Fort — oldest fort in India",
        "Masroor Rock Cut Temple — Indian Angkor Wat",
        "Kangra Art Museum",
        "Tea garden visit in Palampur"
      ],
      overnight: "Dharamshala"
    },
    {
      day: "Day 5",
      title: "Departure",
      activities: [
        "Morning walk at Naddi viewpoint — Dhauladhar sunrise",
        "Souvenir shopping",
        "Transfer to Gaggal Airport / bus stand",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 33: Nainital Winter Lake Serenity ──
  33: [
    {
      day: "Day 1",
      title: "Arrival in Nainital",
      route: "Pantnagar Airport / Kathgodam Station pickup (Drive: 1.5-2 hrs)",
      activities: [
        "Pickup from Pantnagar Airport / Kathgodam Station",
        "Drive through Kumaon hills to Nainital",
        "Check-in at lakeside hotel",
        "Afternoon Naini Lake boating",
        "Evening walk at Mall Road — shopping & street food"
      ],
      overnight: "Nainital"
    },
    {
      day: "Day 2",
      title: "Nainital Exploration",
      activities: [
        "Snow View Point via ropeway — Himalayan panorama",
        "Naina Devi Temple — lakeside pilgrimage",
        "Eco Cave Gardens — interconnected natural caves",
        "Tiffin Top trek — panoramic views",
        "Winter bird watching at Bhimtal Lake",
        "Evening bonfire at hotel"
      ],
      overnight: "Nainital"
    },
    {
      day: "Day 3",
      title: "Bhimtal & Sattal Lakes",
      route: "Drive: 30-45 mins",
      activities: [
        "Visit Bhimtal Lake — island temple in the centre",
        "Sattal — cluster of seven interconnected lakes",
        "Nature walk through oak forests",
        "Bird watching — Kingfishers, Cormorants, Eagles",
        "Butterfly museum visit",
        "Return to Nainital for evening"
      ],
      overnight: "Nainital"
    },
    {
      day: "Day 4",
      title: "Departure",
      activities: [
        "Sunrise at Hanuman Garhi viewpoint",
        "Souvenir shopping — candles, wooden crafts",
        "Drive to Pantnagar Airport / Kathgodam Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 31: Char Dham Winter Pilgrimage Prep ──
  31: [
    {
      day: "Day 1",
      title: "Arrival in Haridwar",
      route: "Dehradun Airport / Haridwar Station pickup",
      activities: [
        "Pickup from Dehradun Airport / Haridwar Station",
        "Visit Har Ki Pauri ghat",
        "Evening Ganga Aarti — spectacular fire ceremony",
        "Walk along the ghats"
      ],
      overnight: "Haridwar"
    },
    {
      day: "Day 2",
      title: "Rishikesh Yoga & Adventure",
      route: "Drive: 30 mins",
      activities: [
        "Visit Triveni Ghat — morning aarti",
        "Ram Jhula & Laxman Jhula bridges",
        "Yoga session at traditional ashram",
        "Beatles Ashram exploration",
        "Evening meditation by the Ganges"
      ],
      overnight: "Rishikesh"
    },
    {
      day: "Day 3",
      title: "Rishikesh Advanced Yoga & Temples",
      activities: [
        "Morning pranayama at sunrise",
        "Neelkanth Mahadev Temple trek/drive",
        "Vashishta Cave meditation",
        "Afternoon Ayurvedic massage",
        "Evening philosophy lecture — Vedantic discourse"
      ],
      overnight: "Rishikesh"
    },
    {
      day: "Day 4",
      title: "Devprayag & Spiritual Circuit",
      route: "Drive: 2-3 hrs",
      activities: [
        "Drive to Devprayag — confluence of Alaknanda & Bhagirathi",
        "Holy dip at Sangam point — Ganges origin",
        "Ancient temple visits",
        "Scenic return drive along river valleys",
        "Evening discourse on Char Dham significance"
      ],
      overnight: "Rishikesh"
    },
    {
      day: "Day 5",
      title: "Meditation Retreat Day",
      activities: [
        "Full-day silent meditation retreat",
        "Guided Vipassana session",
        "Walking meditation by the river",
        "Sattvic meals throughout the day",
        "Evening Yoga Nidra & sound healing"
      ],
      overnight: "Rishikesh"
    },
    {
      day: "Day 6",
      title: "Mussoorie Excursion",
      route: "Drive: 2.5 hrs",
      activities: [
        "Drive to Mussoorie — Queen of Hills",
        "Kempty Falls visit",
        "Mall Road walk & Landour heritage trail",
        "Gun Hill sunset views",
        "Return to Rishikesh or continue to Dehradun"
      ],
      overnight: "Rishikesh / Mussoorie"
    },
    {
      day: "Day 7",
      title: "Temple Architecture & Sacred Texts Study",
      activities: [
        "Morning yoga at ashram",
        "Temple architecture lecture — Char Dham engineering",
        "Visit Parmarth Niketan Ashram — largest in Rishikesh",
        "Spiritual text study session",
        "Afternoon free — café or bookstore exploration"
      ],
      overnight: "Rishikesh"
    },
    {
      day: "Day 8",
      title: "Departure",
      activities: [
        "Final sunrise meditation at Ganga ghat",
        "Closing ceremony & blessings",
        "Transfer to Dehradun Airport / Haridwar Station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 81: Grand Tamil Nadu Temple Circuit ──
  81: [
    {
      day: "Day 1",
      title: "Arrival in Chennai",
      route: "Chennai Airport pickup",
      activities: [
        "Pickup from Chennai Airport",
        "Visit Kapaleeshwarar Temple — Dravidian masterpiece",
        "Marina Beach evening walk",
        "San Thome Cathedral",
        "Traditional South Indian dinner — banana leaf meal"
      ],
      overnight: "Chennai"
    },
    {
      day: "Day 2",
      title: "Kanchipuram — City of 1000 Temples",
      route: "Drive: 2.5 hrs",
      activities: [
        "Ekambareswarar Temple — earth linga shrine",
        "Kailasanathar Temple — oldest Pallava temple",
        "Kamakshi Amman Temple",
        "Kanchipuram silk sari weaving visit",
        "Traditional vegetarian lunch at temple kitchen"
      ],
      overnight: "Kanchipuram"
    },
    {
      day: "Day 3",
      title: "Mahabalipuram — Shore Temples",
      route: "Drive: 1.5 hrs",
      activities: [
        "Shore Temple — UNESCO World Heritage sunrise",
        "Pancha Rathas — five monolithic chariots",
        "Arjuna's Penance — world's largest bas-relief",
        "Krishna's Butter Ball — balanced boulder",
        "Tiger Cave & coastal temple ruins",
        "Evening on Mahabalipuram beach"
      ],
      overnight: "Mahabalipuram"
    },
    {
      day: "Day 4",
      title: "Pondicherry & Auroville",
      route: "Drive: 2 hrs",
      activities: [
        "Visit Auroville — experimental township",
        "Matrimandir meditation (advance booking)",
        "French Quarter heritage walk in Pondicherry",
        "Aurobindo Ashram visit",
        "Promenade Beach evening walk",
        "French-Tamil fusion dinner"
      ],
      overnight: "Pondicherry"
    },
    {
      day: "Day 5",
      title: "Chidambaram & Thanjavur",
      route: "Drive: 3-4 hrs",
      activities: [
        "Nataraja Temple Chidambaram — cosmic dance shrine",
        "Observe ancient temple rituals",
        "Drive to Thanjavur — Chola capital",
        "Evening at Thanjavur Palace complex"
      ],
      overnight: "Thanjavur"
    },
    {
      day: "Day 6",
      title: "Brihadeeswara Temple & Chola Heritage",
      activities: [
        "Brihadeeswara Temple — UNESCO Chola masterpiece",
        "No-shadow noon observation (seasonal)",
        "Thanjavur Palace Art Gallery — Chola bronzes",
        "Saraswathi Mahal Library — ancient manuscripts",
        "Traditional Thanjavur painting workshop",
        "Classical Bharatanatyam performance"
      ],
      overnight: "Thanjavur"
    },
    {
      day: "Day 7",
      title: "Trichy & Srirangam",
      route: "Drive: 1.5 hrs",
      activities: [
        "Ranganathaswamy Temple — world's largest functioning temple",
        "Rock Fort Temple climb — panoramic city views",
        "Jambukeswarar Temple — water linga shrine",
        "Afternoon drive to Madurai"
      ],
      overnight: "Madurai"
    },
    {
      day: "Day 8",
      title: "Meenakshi Temple & Madurai",
      activities: [
        "Meenakshi Amman Temple — 33,000 sculptures, 14 gopurams",
        "Temple corridor meditation walk",
        "Thirumalai Nayakkar Palace",
        "Gandhi Memorial Museum",
        "Evening temple ceremony — night aarti",
        "Madurai street food walk — jigarthanda & kothu parotta"
      ],
      overnight: "Madurai"
    },
    {
      day: "Day 9",
      title: "Rameshwaram",
      route: "Drive: 3.5 hrs",
      activities: [
        "Cross Pamban Bridge — India's first sea bridge",
        "Ramanathaswamy Temple — 22 sacred wells ritual",
        "Dhanushkodi — abandoned ghost town at India's tip",
        "APJ Abdul Kalam Memorial",
        "Return to Madurai"
      ],
      overnight: "Madurai"
    },
    {
      day: "Day 10",
      title: "Departure",
      activities: [
        "Morning Meenakshi Temple sunrise visit",
        "Souvenir shopping — temple crafts & silks",
        "Transfer to Madurai Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 82: Sacred Temples of South India ──
  82: [
    {
      day: "Day 1",
      title: "Arrival in Chennai",
      activities: [
        "Pickup from Chennai Airport",
        "Parthasarathy Temple — one of the oldest in Chennai",
        "Marina Beach sunset walk",
        "Evening orientation"
      ],
      overnight: "Chennai"
    },
    {
      day: "Day 2",
      title: "Tirupati & Tirumala",
      route: "Drive: 3 hrs / Flight: 1 hr",
      activities: [
        "Early departure for Tirumala Hills",
        "Sri Venkateswara Temple — world's richest temple",
        "Darshan & spiritual experience",
        "Tirumala hills viewpoint",
        "Evening return"
      ],
      overnight: "Tirupati / Chennai"
    },
    {
      day: "Day 3",
      title: "Kanchipuram Temple Circuit",
      route: "Drive: 2.5 hrs from Chennai",
      activities: [
        "1000 Pillar Temple exploration",
        "Varadharaja Perumal Temple",
        "Silk sari weaving centre visit",
        "Temple cuisine lunch",
        "Drive to Mahabalipuram"
      ],
      overnight: "Mahabalipuram"
    },
    {
      day: "Day 4",
      title: "Mahabalipuram Shore Temples",
      activities: [
        "Sunrise at Shore Temple — UNESCO site",
        "Five Rathas & Arjuna's Penance",
        "Stone carving workshop with local artisan",
        "Beach meditation session",
        "Drive to Pondicherry"
      ],
      overnight: "Pondicherry"
    },
    {
      day: "Day 5",
      title: "Chidambaram & Thanjavur",
      route: "Drive: 3-4 hrs",
      activities: [
        "Chidambaram Nataraja Temple — cosmic dance shrine",
        "Vedic chanting ceremony observation",
        "Drive to Thanjavur",
        "Evening at Brihadeeswara Temple"
      ],
      overnight: "Thanjavur"
    },
    {
      day: "Day 6",
      title: "Thanjavur & Kumbakonam",
      activities: [
        "Brihadeeswara Temple — detailed architecture study",
        "Thanjavur painting demonstration",
        "Drive to Kumbakonam — temple town",
        "Visit Adi Kumbeswarar Temple",
        "Sacred tank — Mahamaham Tank"
      ],
      overnight: "Kumbakonam"
    },
    {
      day: "Day 7",
      title: "Trichy to Madurai",
      route: "Drive: 3-4 hrs total",
      activities: [
        "Srirangam Temple — largest temple complex in India",
        "Rock Fort Temple — panoramic views",
        "Drive to Madurai",
        "Evening Meenakshi Temple aarti"
      ],
      overnight: "Madurai"
    },
    {
      day: "Day 8",
      title: "Madurai Meenakshi & Rameshwaram",
      route: "Drive: 3.5 hrs to Rameshwaram",
      activities: [
        "Morning Meenakshi Temple detailed visit",
        "Drive to Rameshwaram via Pamban Bridge",
        "Ramanathaswamy Temple — 22 sacred wells",
        "Dhanushkodi visit",
        "Return to Madurai"
      ],
      overnight: "Madurai"
    },
    {
      day: "Day 9",
      title: "Departure",
      activities: [
        "Morning temple photography walk",
        "Sacred Kaveri River aarti ceremony",
        "Transfer to Madurai Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 84: Dravidian Architecture Masterclass ──
  84: [
    {
      day: "Day 1",
      title: "Arrival & Architecture Orientation",
      activities: [
        "Pickup from Chennai Airport",
        "Lecture: Evolution of Dravidian temple architecture",
        "Visit Government Museum — bronze gallery",
        "Kapaleeshwarar Temple — live architecture walkthrough",
        "Evening reading material distribution"
      ],
      overnight: "Chennai"
    },
    {
      day: "Day 2",
      title: "Pallava Period — Mahabalipuram",
      route: "Drive: 1.5 hrs",
      activities: [
        "Shore Temple — structural analysis with archaeologist",
        "Pancha Rathas — monolithic temple evolution study",
        "Rock-cut cave temples — transition from cave to structural",
        "Arjuna's Penance — relief sculpture techniques",
        "Afternoon stone carving workshop"
      ],
      overnight: "Mahabalipuram"
    },
    {
      day: "Day 3",
      title: "Pallava to Chola Transition — Kanchipuram",
      route: "Drive: 1.5 hrs",
      activities: [
        "Kailasanathar Temple — earliest Pallava structural temple",
        "Inscription reading workshop with epigraphist",
        "Vaikuntha Perumal Temple — narrative sculptures",
        "Ekambareswarar Temple — Vijayanagar additions",
        "Lecture: Reading temple inscriptions"
      ],
      overnight: "Kanchipuram"
    },
    {
      day: "Day 4",
      title: "Early Chola — Kumbakonam Circuit",
      route: "Drive: 4-5 hrs",
      activities: [
        "Nageswaraswamy Temple — early Chola proto-type",
        "Airavatesvara Temple (Darasuram) — UNESCO site",
        "Detailed study of sculptural panels",
        "Kumbakonam bronze casting village visit",
        "Lost-wax bronze casting demonstration"
      ],
      overnight: "Kumbakonam"
    },
    {
      day: "Day 5",
      title: "Peak Chola — Thanjavur Brihadeeswara",
      route: "Drive: 40 mins",
      activities: [
        "Brihadeeswara Temple — full-day architectural study",
        "Vimana engineering analysis — 216 ft tower, 80-ton capstone",
        "Nandi mandapa proportional study",
        "Chola fresco paintings in inner ambulatory",
        "Saraswathi Mahal Library — palm leaf manuscripts"
      ],
      overnight: "Thanjavur"
    },
    {
      day: "Day 6",
      title: "Gangaikondacholapuram",
      route: "Drive: 1.5 hrs",
      activities: [
        "Brihadeeswara Temple — Rajendra Chola's capital",
        "Comparative study with Thanjavur temple",
        "Lion-well & ancient water engineering",
        "Lecture: Chola military & cultural expansion",
        "Return to Thanjavur"
      ],
      overnight: "Thanjavur"
    },
    {
      day: "Day 7",
      title: "Pandya Period — Madurai",
      route: "Drive: 3.5 hrs",
      activities: [
        "Meenakshi Temple — Pandya & Nayak masterwork",
        "Gopuram analysis — painted stucco techniques",
        "1000 Pillar Hall — colonnade engineering",
        "Musical pillars acoustic experiment",
        "Nayakkar Palace — Indo-Saracenic transition"
      ],
      overnight: "Madurai"
    },
    {
      day: "Day 8",
      title: "Sculptural Deep Dive & Documentation",
      activities: [
        "Morning photography workshop — temple architecture",
        "Sculptural iconography study — Shiva, Vishnu, Devi forms",
        "Temple corridor proportional measurements",
        "Afternoon lecture: Temple as cosmic diagram",
        "Evening group presentation prep"
      ],
      overnight: "Madurai"
    },
    {
      day: "Day 9",
      title: "Trichy & Heritage Conservation",
      route: "Drive: 2.5 hrs",
      activities: [
        "Srirangam Temple — evolution across dynasties",
        "Rock Fort — geological & architectural significance",
        "Heritage conservation lecture — ASI perspective",
        "Group research presentations",
        "Certificate ceremony"
      ],
      overnight: "Trichy"
    },
    {
      day: "Day 10",
      title: "Departure",
      activities: [
        "Morning reflection & final discussions",
        "Transfer to Trichy Airport / Madurai Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 83: Kodaikanal Winter Hill Retreat ──
  83: [
    {
      day: "Day 1",
      title: "Arrival in Kodaikanal",
      route: "Madurai Airport pickup (Drive: 3 hrs)",
      activities: [
        "Pickup from Madurai Airport / station",
        "Scenic ghat road drive through Western Ghats",
        "Arrival in Kodaikanal — check-in",
        "Kodai Lake cycling — star-shaped lake",
        "Coaker's Walk — panoramic valley views",
        "Evening at Bryant Park — botanical garden"
      ],
      overnight: "Kodaikanal"
    },
    {
      day: "Day 2",
      title: "Nature Trails & Local Experiences",
      activities: [
        "Pillar Rocks viewpoint — three vertical rock pillars",
        "Pine forest walk — eucalyptus & pine scents",
        "Dolphin's Nose trek — cliff edge views",
        "Visit chocolate factory — homemade varieties",
        "Kurinji Andavar Temple",
        "Evening bonfire at resort"
      ],
      overnight: "Kodaikanal"
    },
    {
      day: "Day 3",
      title: "Departure",
      activities: [
        "Sunrise at Green Valley View",
        "Silver Cascade Waterfall stop",
        "Souvenir shopping — homemade chocolates & eucalyptus oil",
        "Drive to Madurai Airport / station",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 71: Kerala Winter Backwaters Paradise ──
  71: [
    {
      day: "Day 1",
      title: "Arrival in Kochi",
      route: "Kochi Airport pickup",
      activities: [
        "Pickup from Cochin International Airport",
        "Fort Kochi heritage walk — Chinese fishing nets",
        "St. Francis Church — India's oldest European church",
        "Jewish Synagogue & Spice Market",
        "Kathakali dance performance evening"
      ],
      overnight: "Fort Kochi"
    },
    {
      day: "Day 2",
      title: "Alleppey Houseboat Cruise",
      route: "Drive: 1.5 hrs to Alleppey",
      activities: [
        "Drive to Alleppey — Venice of the East",
        "Board traditional Kerala houseboat (kettuvallam)",
        "Cruise through palm-fringed canals",
        "Fresh Kerala lunch onboard — fish curry & appam",
        "Village stops along the canals",
        "Sunset over Vembanad Lake"
      ],
      overnight: "Houseboat"
    },
    {
      day: "Day 3",
      title: "Kumarakom & Backwater Villages",
      activities: [
        "Morning birdwatching at Kumarakom Bird Sanctuary",
        "Canoe ride through narrow village canals",
        "Visit coir-making & toddy tapping villages",
        "Kerala cooking class — traditional sadya preparation",
        "Afternoon Ayurvedic massage at lakeside spa"
      ],
      overnight: "Kumarakom"
    },
    {
      day: "Day 4",
      title: "Munnar Tea Hills",
      route: "Drive: 4 hrs to Munnar",
      activities: [
        "Drive through Western Ghats to Munnar",
        "Tata Tea Museum — tea processing tour",
        "Tea plucking experience in rolling estates",
        "Eravikulam National Park — Nilgiri Tahr spotting",
        "Evening walk at Munnar town"
      ],
      overnight: "Munnar"
    },
    {
      day: "Day 5",
      title: "Departure",
      activities: [
        "Sunrise at Pothamedu viewpoint",
        "Mattupetty Dam & Echo Point visit",
        "Spice garden tour",
        "Drive to Kochi Airport (4 hrs)",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 73: Thekkady Wildlife & Spice Winter ──
  73: [
    {
      day: "Day 1",
      title: "Arrival in Thekkady",
      route: "Kochi / Madurai pickup (Drive: 4-5 hrs)",
      activities: [
        "Pickup from Kochi / Madurai Airport",
        "Scenic drive through cardamom-scented hills",
        "Arrival at Thekkady",
        "Afternoon spice plantation walking tour",
        "Cardamom, pepper, vanilla & clove trails",
        "Evening Kalaripayattu martial arts show"
      ],
      overnight: "Thekkady"
    },
    {
      day: "Day 2",
      title: "Periyar Lake & Wildlife",
      activities: [
        "Morning Periyar Lake boat safari",
        "Elephant & bison spotting at water's edge",
        "Bamboo rafting through Periyar Tiger Reserve",
        "Nature walk with tribal guide — Mannan tribe",
        "Spice market shopping — fresh whole spices",
        "Evening tribal heritage centre visit"
      ],
      overnight: "Thekkady"
    },
    {
      day: "Day 3",
      title: "Departure",
      activities: [
        "Morning elephant encounter — bathing & feeding",
        "Final spice garden visit — buy plantation-fresh spices",
        "Drive to Kochi / Madurai Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── International Tours ──

  // ── ID 301: Vietnam Discovery Trail ──
  301: [
    {
      day: "Day 1",
      title: "Arrival in Hanoi",
      activities: [
        "Arrival at Noi Bai International Airport",
        "Transfer to Old Quarter hotel",
        "Evening walking tour — Hanoi Old Quarter",
        "Water puppet show at Thang Long Theatre",
        "Welcome dinner — Vietnamese pho & spring rolls"
      ],
      overnight: "Hanoi Old Quarter"
    },
    {
      day: "Day 2",
      title: "Hanoi Heritage & Culture",
      activities: [
        "Ho Chi Minh Mausoleum & Presidential Palace",
        "Temple of Literature — Vietnam's first university",
        "Hoan Kiem Lake & Ngoc Son Temple",
        "Vietnamese cooking class — bun cha & banh mi",
        "Evening street food walking tour"
      ],
      overnight: "Hanoi"
    },
    {
      day: "Day 3-4",
      title: "Ha Long Bay Overnight Cruise",
      route: "Drive: 3.5 hrs to Ha Long Bay",
      activities: [
        "Board traditional junk boat cruise",
        "Sail through 1,600 limestone karst islands",
        "Kayaking through grottoes & caves",
        "Cooking class on the boat",
        "Sunrise tai chi on deck",
        "Visit floating fishing village"
      ],
      overnight: "Ha Long Bay (Boat)"
    },
    {
      day: "Day 5",
      title: "Ninh Binh — Inland Ha Long Bay",
      route: "Drive: 2.5 hrs",
      activities: [
        "Tam Coc boat ride through rice paddy karsts",
        "Mua Cave climb — panoramic views",
        "Bich Dong Pagoda",
        "Cycling through rice paddies",
        "Evening flight to Da Nang"
      ],
      overnight: "Hoi An"
    },
    {
      day: "Day 6-7",
      title: "Hoi An Ancient Town",
      activities: [
        "Hoi An Old Town walking tour — UNESCO site",
        "Japanese Covered Bridge & Assembly Halls",
        "Tailor-made clothing experience",
        "Lantern-making workshop",
        "Tra Que herb village cycling",
        "My Son ruins — Champa temple complex",
        "Evening lantern festival on Thu Bon River"
      ],
      overnight: "Hoi An"
    },
    {
      day: "Day 8",
      title: "Fly to Ho Chi Minh City",
      route: "Flight: 1.5 hrs",
      activities: [
        "Morning flight to HCMC",
        "Cu Chi Tunnels — Vietnam War history",
        "War Remnants Museum",
        "Notre Dame Cathedral & Central Post Office",
        "Ben Thanh Market evening"
      ],
      overnight: "Ho Chi Minh City"
    },
    {
      day: "Day 9",
      title: "Mekong Delta",
      route: "Drive: 2 hrs",
      activities: [
        "Cai Be floating market by sampan",
        "Coconut candy workshop",
        "Row through narrow Mekong canals",
        "Traditional delta village lunch",
        "Fruit orchard visit",
        "Return to HCMC"
      ],
      overnight: "Ho Chi Minh City"
    },
    {
      day: "Day 10",
      title: "Departure",
      activities: [
        "Morning free for shopping at Saigon Centre",
        "Transfer to Tan Son Nhat International Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 302: Thailand Nature & Culture ──
  302: [
    {
      day: "Day 1",
      title: "Arrival in Chiang Mai",
      activities: [
        "Arrival at Chiang Mai Airport",
        "Old City temple tour — Wat Chedi Luang, Wat Phra Singh",
        "Evening Night Bazaar exploration",
        "Traditional Khantoke dinner & cultural show"
      ],
      overnight: "Chiang Mai"
    },
    {
      day: "Day 2",
      title: "Doi Inthanon & Hill Tribes",
      route: "Drive: 2 hrs",
      activities: [
        "Doi Inthanon — Thailand's highest peak",
        "Royal twin pagodas at summit",
        "Waterfall trail hikes",
        "Karen hill tribe village visit",
        "Coffee plantation tour"
      ],
      overnight: "Chiang Mai"
    },
    {
      day: "Day 3",
      title: "Elephant Sanctuary & Cooking",
      activities: [
        "Ethical elephant sanctuary — feeding & bathing",
        "Mud spa with elephants",
        "Afternoon Thai cooking school",
        "Cook pad thai, green curry & mango sticky rice",
        "Evening walk at Tha Phae Gate"
      ],
      overnight: "Chiang Mai"
    },
    {
      day: "Day 4",
      title: "Fly to Krabi",
      route: "Flight: 2 hrs",
      activities: [
        "Morning Wat Phra That Doi Suthep — hilltop temple",
        "Flight to Krabi",
        "Ao Nang beach arrival & sunset",
        "Seafood dinner by the beach"
      ],
      overnight: "Krabi"
    },
    {
      day: "Day 5",
      title: "Krabi Nature Trails",
      activities: [
        "Emerald Pool & Blue Pool trek through rainforest",
        "Hot springs natural Jacuzzi",
        "Tiger Cave Temple — 1,237 steps to the top",
        "Panoramic views from temple summit",
        "Evening Railay Beach walk"
      ],
      overnight: "Krabi"
    },
    {
      day: "Day 6",
      title: "Island Hopping — 4 Islands Tour",
      activities: [
        "Longtail boat to Phra Nang Cave Beach",
        "Snorkeling at Chicken Island",
        "Tup Island sandbar walk",
        "Poda Island swimming & sunbathing",
        "Fresh seafood BBQ lunch on beach"
      ],
      overnight: "Krabi"
    },
    {
      day: "Day 7",
      title: "Khao Sok or Free Day",
      activities: [
        "Optional: Khao Sok National Park day trip",
        "Cheow Lan Lake — floating bungalows",
        "Jungle trekking & wildlife spotting",
        "Or free day for spa, diving, or beach relaxation"
      ],
      overnight: "Krabi"
    },
    {
      day: "Day 8",
      title: "Departure",
      activities: [
        "Morning beach walk",
        "Transfer to Krabi Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 303: Bali Wellness & Culture ──
  303: [
    {
      day: "Day 1",
      title: "Arrival in Bali",
      activities: [
        "Arrival at Ngurah Rai Airport",
        "Transfer to Ubud — cultural heart of Bali",
        "Welcome ceremony with offerings & flowers",
        "Gentle yoga session at rice terrace pavilion",
        "Welcome dinner — traditional Balinese feast"
      ],
      overnight: "Ubud"
    },
    {
      day: "Day 2",
      title: "Ubud Culture & Rice Terraces",
      activities: [
        "Sunrise yoga overlooking Tegallalang rice terraces",
        "Visit Ubud Royal Palace & art market",
        "Tegallalang Rice Terrace walk — iconic swings",
        "Traditional Balinese painting workshop",
        "Afternoon meditation at Saraswati Temple"
      ],
      overnight: "Ubud"
    },
    {
      day: "Day 3",
      title: "Sacred Water Temple & Healing",
      activities: [
        "Tirta Empul holy spring water purification ritual",
        "Traditional Balinese healer (Balian) session",
        "Gunung Kawi ancient rock-cut temples",
        "Afternoon Balinese massage & spa",
        "Evening Kecak fire dance performance"
      ],
      overnight: "Ubud"
    },
    {
      day: "Day 4",
      title: "Mount Batur Sunrise Trek",
      route: "Drive: 1.5 hrs to trek base",
      activities: [
        "2:00 AM departure for Mount Batur",
        "Trek to summit — 1,717m active volcano",
        "Sunrise over Lake Batur & Mount Agung",
        "Breakfast cooked by volcanic steam",
        "Afternoon natural hot springs soak",
        "Rest & restorative yoga"
      ],
      overnight: "Ubud"
    },
    {
      day: "Day 5",
      title: "Artisan Villages & Workshops",
      activities: [
        "Visit Celuk — gold & silver smithing village",
        "Batuan — traditional painting village",
        "Mas — wood carving demonstration",
        "Luwak coffee plantation — civet coffee tasting",
        "Afternoon free for Ubud market shopping",
        "Evening yin yoga & sound bath"
      ],
      overnight: "Ubud"
    },
    {
      day: "Day 6",
      title: "Coastal Temples & Sunset",
      route: "Drive: 1.5 hrs to coast",
      activities: [
        "Visit Uluwatu Temple — clifftop ocean temple",
        "Padang Padang Beach walk",
        "Tanah Lot Temple — iconic sea temple at sunset",
        "Final group dinner — Balinese farewell feast"
      ],
      overnight: "Seminyak / Canggu"
    },
    {
      day: "Day 7",
      title: "Departure",
      activities: [
        "Morning beach yoga — final session",
        "Free time for last-minute shopping",
        "Transfer to Ngurah Rai Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 304: Nepal Himalayan Culture & Trek Lite ──
  304: [
    {
      day: "Day 1",
      title: "Arrival in Kathmandu",
      activities: [
        "Arrival at Tribhuvan International Airport",
        "Transfer to Thamel area hotel",
        "Afternoon Kathmandu Durbar Square — living heritage",
        "Kumari (Living Goddess) house visit",
        "Evening Thamel walk & welcome dinner"
      ],
      overnight: "Kathmandu"
    },
    {
      day: "Day 2",
      title: "Kathmandu Heritage Tour",
      activities: [
        "Swayambhunath Stupa — Monkey Temple sunrise",
        "Patan Durbar Square — Newar architecture masterpiece",
        "Boudhanath Stupa — largest in Nepal",
        "Pashupatinath Temple — holy Bagmati River",
        "Tibetan carpet workshop visit"
      ],
      overnight: "Kathmandu"
    },
    {
      day: "Day 3",
      title: "Kathmandu to Pokhara",
      route: "Flight: 30 mins / Drive: 6-7 hrs",
      activities: [
        "Scenic flight with Himalayan views (or drive)",
        "Arrival at Pokhara — Phewa Lakeside",
        "Boating on Phewa Lake — reflection of Machhapuchhre",
        "Visit World Peace Pagoda",
        "Lakeside evening walk & café culture"
      ],
      overnight: "Pokhara"
    },
    {
      day: "Day 4-5",
      title: "Poon Hill Trek",
      route: "Trek: 2 days, moderate altitude",
      activities: [
        "Drive to Nayapul — trek start point",
        "Trek through Ghandruk village — Gurung culture",
        "Overnight at mountain lodge",
        "Pre-dawn trek to Poon Hill — 3,210m",
        "Sunrise panorama — Annapurna, Dhaulagiri, Machhapuchhre",
        "Descent through rhododendron forests",
        "Return to Pokhara"
      ],
      overnight: "Mountain Lodge / Pokhara"
    },
    {
      day: "Day 6",
      title: "Pokhara Adventure & Culture",
      activities: [
        "Sarangkot sunrise viewpoint",
        "Davis Falls & Gupteshwar Cave",
        "International Mountain Museum",
        "Optional: Paragliding over Phewa Lake",
        "Farewell Nepali thali dinner"
      ],
      overnight: "Pokhara"
    },
    {
      day: "Day 7",
      title: "Departure",
      activities: [
        "Morning lakeside walk",
        "Flight/drive to Kathmandu",
        "Transfer to Tribhuvan Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 305: Bhutan Mindful Kingdom Journey ──
  305: [
    {
      day: "Day 1",
      title: "Arrival in Paro",
      activities: [
        "Dramatic mountain landing at Paro Airport",
        "Visit Paro Rinpung Dzong — fortress monastery",
        "National Museum of Bhutan — Ta Dzong",
        "Evening walk at Paro town",
        "Traditional Bhutanese dinner — Ema Datshi"
      ],
      overnight: "Paro"
    },
    {
      day: "Day 2",
      title: "Tiger's Nest Trek",
      route: "Trek: 5-6 hrs round trip",
      activities: [
        "Trek to Taktsang (Tiger's Nest) Monastery — 3,120m",
        "Cliffside monastery perched 900m above valley",
        "Meditation at the sacred cave",
        "Cafeteria stop midway — valley views",
        "Descent & visit Kyichu Lhakhang — oldest temple"
      ],
      overnight: "Paro"
    },
    {
      day: "Day 3",
      title: "Paro to Thimphu",
      route: "Drive: 1.5 hrs",
      activities: [
        "Drive to Thimphu — Bhutan's capital",
        "Tashichho Dzong — seat of government",
        "Buddha Dordenma statue — 169 ft golden Buddha",
        "Memorial Chorten — prayer & meditation",
        "Weekend market (if Saturday) or craft bazaar"
      ],
      overnight: "Thimphu"
    },
    {
      day: "Day 4",
      title: "Thimphu to Punakha",
      route: "Drive: 3 hrs via Dochula Pass",
      activities: [
        "Dochula Pass — 108 memorial chortens at 10,000 ft",
        "Himalayan panorama — Jomolhari, Masang Gang",
        "Descend to Punakha Valley — warm subtropical climate",
        "Punakha Dzong — most beautiful dzong in Bhutan",
        "Suspension bridge walk over Mo Chhu river"
      ],
      overnight: "Punakha"
    },
    {
      day: "Day 5",
      title: "Punakha Valley & Culture",
      activities: [
        "Chimi Lhakhang trek — temple of the Divine Madman",
        "Rice paddy walk through Punakha valley",
        "Traditional archery session — Bhutan's national sport",
        "Prayer flag planting ceremony",
        "Farm-to-table Bhutanese cooking class",
        "Drive back to Paro"
      ],
      overnight: "Paro"
    },
    {
      day: "Day 6",
      title: "Departure",
      activities: [
        "Morning meditation at riverside",
        "Last-minute souvenir shopping",
        "Transfer to Paro Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 306: Sri Lanka Heritage & Wildlife ──
  306: [
    {
      day: "Day 1",
      title: "Arrival in Colombo",
      activities: [
        "Arrival at Bandaranaike International Airport",
        "Colombo city tour — Gangaramaya Temple, Independence Square",
        "Evening at Galle Face Green — ocean sunset",
        "Welcome Sri Lankan dinner — rice & curry spread"
      ],
      overnight: "Colombo"
    },
    {
      day: "Day 2",
      title: "Sigiriya Rock Fortress",
      route: "Drive: 4-5 hrs",
      activities: [
        "Drive to Cultural Triangle",
        "Climb Sigiriya Rock — 5th century sky palace",
        "Frescoes, mirror wall & lion's paw gateway",
        "Pidurangala Rock sunset — Sigiriya panorama",
        "Village cycling tour"
      ],
      overnight: "Sigiriya / Dambulla"
    },
    {
      day: "Day 3",
      title: "Dambulla & Kandy",
      route: "Drive: 3 hrs to Kandy",
      activities: [
        "Dambulla Cave Temple — 2,000-year-old Buddhist murals",
        "Spice garden visit en route",
        "Arrival in Kandy — cultural capital",
        "Temple of the Tooth — sacred Buddhist relic",
        "Evening Kandy cultural dance show"
      ],
      overnight: "Kandy"
    },
    {
      day: "Day 4",
      title: "Kandy to Nuwara Eliya",
      route: "Train: 3-4 hrs (one of world's most scenic)",
      activities: [
        "Iconic train ride through tea country",
        "Tea plantations, tunnels & mountain bridges",
        "Nuwara Eliya — Little England of Sri Lanka",
        "Pedro Tea Estate tour & tasting",
        "Gregory Lake walk"
      ],
      overnight: "Nuwara Eliya"
    },
    {
      day: "Day 5",
      title: "Ella & Nine Arches Bridge",
      route: "Drive: 2 hrs",
      activities: [
        "Drive to Ella — mountain village",
        "Nine Arches Bridge — iconic railway bridge",
        "Little Adam's Peak short trek",
        "Ravana Waterfall visit",
        "Ella Rock trek (optional)",
        "Evening at Ella's charming cafés"
      ],
      overnight: "Ella"
    },
    {
      day: "Day 6",
      title: "Yala National Park Safari",
      route: "Drive: 3 hrs",
      activities: [
        "Drive to Yala — highest leopard density in the world",
        "Morning jeep safari — leopard, elephant, sloth bear",
        "Bird watching — peacocks, painted storks",
        "Afternoon beach at Yala coastline",
        "Evening safari debrief"
      ],
      overnight: "Yala / Tissamaharama"
    },
    {
      day: "Day 7",
      title: "Galle Fort Heritage",
      route: "Drive: 3.5 hrs along coast",
      activities: [
        "Coastal drive with ocean views",
        "Galle Fort — UNESCO Dutch colonial heritage",
        "Fort rampart walk — lighthouse & bastions",
        "Galle boutique shopping — gems, batik, spices",
        "Unawatuna Beach relaxation",
        "Farewell dinner at Galle Fort restaurant"
      ],
      overnight: "Galle"
    },
    {
      day: "Day 8",
      title: "Departure",
      activities: [
        "Morning stroll at Galle Fort",
        "Drive to Colombo Airport (2.5 hrs)",
        "Transfer to Bandaranaike International Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 307: Turkey History & Landscape ──
  307: [
    {
      day: "Day 1",
      title: "Arrival in Istanbul",
      activities: [
        "Arrival at Istanbul Airport",
        "Transfer to Sultanahmet area",
        "Evening Bosphorus cruise — Europe & Asia skyline",
        "Welcome dinner — meze & kebab spread"
      ],
      overnight: "Istanbul"
    },
    {
      day: "Day 2",
      title: "Istanbul's Byzantine & Ottoman Heritage",
      activities: [
        "Hagia Sophia — 1,500 years of history",
        "Blue Mosque — Ottoman masterpiece",
        "Topkapi Palace — sultans' jewels & harem",
        "Basilica Cistern — underground marble palace",
        "Grand Bazaar — 4,000 shops in covered labyrinth"
      ],
      overnight: "Istanbul"
    },
    {
      day: "Day 3",
      title: "Istanbul Asian Side & Local Life",
      activities: [
        "Ferry to Kadikoy — Asian Istanbul",
        "Moda neighbourhood walk & tea",
        "Spice Bazaar — Egyptian market",
        "Suleymaniye Mosque — Sinan's masterwork",
        "Evening Galata Tower sunset views"
      ],
      overnight: "Istanbul"
    },
    {
      day: "Day 4",
      title: "Fly to Cappadocia",
      route: "Flight: 1.5 hrs",
      activities: [
        "Morning flight to Kayseri/Nevsehir",
        "Goreme Open Air Museum — rock-cut churches",
        "Devrent Imagination Valley",
        "Pasabag Monks Valley — fairy chimneys",
        "Sunset at Red Valley"
      ],
      overnight: "Cappadocia (Cave Hotel)"
    },
    {
      day: "Day 5",
      title: "Cappadocia Hot Air Balloon & Exploration",
      activities: [
        "4:30 AM — Hot air balloon flight over fairy chimneys",
        "Sunrise from the balloon — lifetime experience",
        "Kaymakli Underground City — 8 levels deep",
        "Ihlara Valley hike — canyon walk",
        "Pigeon Valley viewpoint",
        "Turkish pottery workshop in Avanos"
      ],
      overnight: "Cappadocia"
    },
    {
      day: "Day 6",
      title: "Cappadocia to Pamukkale",
      route: "Drive/Flight",
      activities: [
        "Transfer to Pamukkale — cotton castle",
        "White travertine terraces — thermal pools",
        "Hierapolis ancient city — Roman ruins",
        "Cleopatra's Pool — swim in ancient thermal waters",
        "Evening traditional Turkish bath (Hammam)"
      ],
      overnight: "Pamukkale"
    },
    {
      day: "Day 7",
      title: "Ephesus Ancient City",
      route: "Drive: 3 hrs",
      activities: [
        "Ephesus — one of best-preserved Roman cities",
        "Library of Celsus, Great Theatre, Temple of Artemis",
        "House of the Virgin Mary",
        "Sirince village — wine tasting & olive oil",
        "Return to Izmir area"
      ],
      overnight: "Izmir / Kusadasi"
    },
    {
      day: "Day 8",
      title: "Fly to Istanbul & Free Time",
      route: "Flight: 1 hr",
      activities: [
        "Morning flight to Istanbul",
        "Free time for shopping — Istiklal Street",
        "Optional: Princes' Islands ferry trip",
        "Farewell dinner — rooftop with Bosphorus views"
      ],
      overnight: "Istanbul"
    },
    {
      day: "Day 9",
      title: "Departure",
      activities: [
        "Morning free for last shopping",
        "Transfer to Istanbul Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 308: Morocco Culture & Desert ──
  308: [
    {
      day: "Day 1",
      title: "Arrival in Marrakech",
      activities: [
        "Arrival at Marrakech Menara Airport",
        "Transfer to Riad in the Medina",
        "Jemaa el-Fna square — snake charmers, musicians, food stalls",
        "Welcome Moroccan dinner — tagine & couscous"
      ],
      overnight: "Marrakech Riad"
    },
    {
      day: "Day 2",
      title: "Marrakech Heritage",
      activities: [
        "Bahia Palace — 19th century masterpiece",
        "Saadian Tombs & Koutoubia Mosque",
        "Souk exploration — leather, spices, ceramics, textiles",
        "Majorelle Garden — Yves Saint Laurent's Marrakech",
        "Moroccan cooking class — pastilla & harira",
        "Evening rooftop dinner with Atlas views"
      ],
      overnight: "Marrakech"
    },
    {
      day: "Day 3",
      title: "Atlas Mountains Trek",
      route: "Drive: 1.5 hrs to Imlil",
      activities: [
        "Drive to Imlil village — Atlas Mountains base",
        "Trek through Berber villages — terraced fields",
        "Traditional Berber lunch at mountain home",
        "Waterfall hike in Ourika Valley",
        "Evening with Berber family — mint tea ceremony"
      ],
      overnight: "Atlas Mountain Lodge"
    },
    {
      day: "Day 4",
      title: "Atlas to Desert — Ait Benhaddou",
      route: "Drive: 5-6 hrs via Tizi n'Tichka Pass",
      activities: [
        "Cross Tizi n'Tichka Pass — 2,260m",
        "Ait Benhaddou — UNESCO ksar (fortified village)",
        "Hollywood's Morocco — Game of Thrones, Gladiator locations",
        "Ouarzazate — Atlas Film Studios",
        "Continue to Dades Valley"
      ],
      overnight: "Dades Gorge"
    },
    {
      day: "Day 5",
      title: "Todgha Gorge & Merzouga Desert",
      route: "Drive: 5-6 hrs",
      activities: [
        "Todgha Gorge — 300m canyon walls",
        "Short hike in the gorge",
        "Drive to Merzouga — gateway to Sahara",
        "Camel caravan into Erg Chebbi dunes",
        "Watch sunset from dune top",
        "Night in desert camp — stargazing, drumming, Berber songs"
      ],
      overnight: "Sahara Desert Camp"
    },
    {
      day: "Day 6",
      title: "Sahara Sunrise & Fes Journey",
      route: "Drive: 8-9 hrs",
      activities: [
        "Sunrise over Sahara dunes",
        "Camel ride back from camp",
        "Long scenic drive through Ziz Valley",
        "Stop at Ifrane — Morocco's Switzerland",
        "Arrival in Fes — oldest medina in the world"
      ],
      overnight: "Fes Riad"
    },
    {
      day: "Day 7",
      title: "Fes Medina Exploration",
      activities: [
        "Fes el-Bali medina — 9,000 narrow lanes",
        "Chouara Tanneries — iconic leather dyeing",
        "Al-Qarawiyyin Mosque — world's oldest university",
        "Bou Inania Madrasa — Marinid architecture",
        "Pottery cooperative visit",
        "Farewell dinner at palatial Riad"
      ],
      overnight: "Fes"
    },
    {
      day: "Day 8",
      title: "Departure",
      activities: [
        "Morning free for final shopping",
        "Transfer to Fes Airport or Marrakech (optional train)",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 309: Georgia Wine & Mountains ──
  309: [
    {
      day: "Day 1",
      title: "Arrival in Tbilisi",
      activities: [
        "Arrival at Tbilisi International Airport",
        "Transfer to Old Town hotel",
        "Narikala Fortress — panoramic city views",
        "Abanotubani — sulfur baths district walk",
        "Welcome dinner — khinkali & khachapuri"
      ],
      overnight: "Tbilisi"
    },
    {
      day: "Day 2",
      title: "Tbilisi Cultural Tour",
      activities: [
        "Holy Trinity Cathedral (Tsminda Sameba)",
        "Rustaveli Avenue — National Museum",
        "Dry Bridge Flea Market — Soviet memorabilia",
        "Wine tasting at Georgian Wine Bar",
        "Traditional polyphonic singing performance",
        "Evening cable car ride over Old Town"
      ],
      overnight: "Tbilisi"
    },
    {
      day: "Day 3",
      title: "Kakheti Wine Region",
      route: "Drive: 2 hrs",
      activities: [
        "Drive to Kakheti — birthplace of wine (8,000 years)",
        "Qvevri winemaking — UNESCO-listed clay vessel method",
        "Visit traditional wine cellar — marani",
        "Wine & cheese pairing lunch",
        "Tsinandali Estate — historical wine estate",
        "Gremi Monastery & fortress"
      ],
      overnight: "Kakheti / Telavi"
    },
    {
      day: "Day 4",
      title: "Kazbegi Mountain Day",
      route: "Drive: 3 hrs via Georgian Military Highway",
      activities: [
        "Scenic drive on Georgian Military Highway",
        "Ananuri Fortress — medieval castle on reservoir",
        "Cross-pass at Jvari Pass — 2,379m",
        "Gergeti Trinity Church — iconic mountain church at 2,170m",
        "Mount Kazbek views — 5,033m peak",
        "Natural hot springs in Kazbegi area"
      ],
      overnight: "Kazbegi (Stepantsminda)"
    },
    {
      day: "Day 5",
      title: "Mtskheta & Uplistsikhe",
      route: "Drive: 3.5 hrs",
      activities: [
        "Drive to Mtskheta — ancient capital, UNESCO site",
        "Jvari Monastery — 6th century hilltop church",
        "Svetitskhoveli Cathedral — Georgia's holiest site",
        "Drive to Uplistsikhe — cave city from 1st millennium BC",
        "Return to Tbilisi"
      ],
      overnight: "Tbilisi"
    },
    {
      day: "Day 6",
      title: "Free Day & Georgian Supra",
      activities: [
        "Morning free — spa, shopping, or explore",
        "Optional: Davit Gareja cave monastery day trip",
        "Afternoon cooking class — khachapuri & churchkhela",
        "Evening Georgian Supra feast — toasting tradition with tamada"
      ],
      overnight: "Tbilisi"
    },
    {
      day: "Day 7",
      title: "Departure",
      activities: [
        "Morning souvenir shopping — Meidan area",
        "Transfer to Tbilisi Airport",
        "Trip concludes"
      ]
    }
  ],

  // ── ID 500: Tri-Nation Himalayan Motorbike Expedition ──
  500: [
    {
      day: "Day 1",
      title: "Guwahati — Rally Briefing & Gear Up",
      activities: [
        "Royal Enfield Himalayan bike allocation",
        "Full riding gear fitting — premium equipment",
        "Route briefing & documentation check",
        "Test ride & bike familiarization",
        "Evening team dinner & expedition kickoff"
      ],
      overnight: "Guwahati"
    },
    {
      day: "Day 2-3",
      title: "Northeast India Leg — Tezpur to Tawang",
      route: "Ride: 400+ km over 2 days via Sela Pass (13,700 ft)",
      activities: [
        "Ride through Assam tea gardens to Bhalukpong",
        "Arunachal ILP entry",
        "Bomdila monastery stop",
        "Epic Sela Pass crossing at 13,700 ft",
        "Nuranang Waterfall halt",
        "Arrival at Tawang — monastery visit"
      ],
      overnight: "Bhalukpong / Tawang"
    },
    {
      day: "Day 4-5",
      title: "Tawang Exploration & Return Ride",
      activities: [
        "Tawang Monastery — India's largest Buddhist monastery",
        "Optional Bumla Pass ride (15,200 ft) — India-China border",
        "Madhuri Lake visit",
        "Return ride via Sela Pass to Dirang/Tezpur",
        "Hot springs halt at Dirang"
      ],
      overnight: "Tawang / Dirang"
    },
    {
      day: "Day 6-8",
      title: "India to Nepal Border Crossing",
      route: "Ride via Siliguri corridor to Kakarbhitta/Bhadrapur",
      activities: [
        "Ride through North Bengal — Darjeeling foothills",
        "India-Nepal border crossing",
        "Ride through Terai plains to Kathmandu valley",
        "Kathmandu Durbar Square exploration",
        "Swayambhunath & Boudhanath"
      ],
      overnight: "En route / Kathmandu"
    },
    {
      day: "Day 9-10",
      title: "Kathmandu to Pokhara & Back",
      route: "Ride: 200 km each way",
      activities: [
        "Scenic ride to Pokhara",
        "Phewa Lake & Annapurna views",
        "Sarangkot sunrise",
        "Return ride to Kathmandu",
        "Nepal souvenirs & bike prep for Bhutan"
      ],
      overnight: "Pokhara / Kathmandu"
    },
    {
      day: "Day 11-12",
      title: "Nepal to Bhutan — Kingdom Entry",
      route: "Ride via Phuentsholing border",
      activities: [
        "Ride to Nepal-Bhutan border",
        "Bhutan immigration & permit",
        "Ride through Bhutan foothills to Thimphu",
        "Dochula Pass crossing — 108 chortens at 10,000 ft",
        "Thimphu Dzong & Buddha Dordenma"
      ],
      overnight: "En route / Thimphu"
    },
    {
      day: "Day 13-14",
      title: "Paro & Tiger's Nest",
      activities: [
        "Ride to Paro valley",
        "Tiger's Nest Monastery trek (bikes parked)",
        "Paro Dzong & Ta Dzong museum",
        "Prayer flag planting ceremony",
        "Farewell Bhutanese dinner"
      ],
      overnight: "Paro"
    },
    {
      day: "Day 15",
      title: "Departure",
      activities: [
        "Bike return & expedition debrief",
        "Certificate ceremony — Tri-Nation Expedition Finisher",
        "Transfer to Paro Airport / overland return",
        "Expedition concludes"
      ]
    }
  ],
};
