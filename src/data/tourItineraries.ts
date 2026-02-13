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
      title: "Mawlynnong & Dawn Ecosystem",
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
  ]
};
