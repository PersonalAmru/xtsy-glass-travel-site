export interface MeghalayaDestination {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  region: 'Near Shillong' | 'Cherrapunji & Sohra' | 'Jaintia Hills' | 'Garo Hills' | 'West Khasi Hills' | 'East Khasi Hills';
  category: 'waterfall' | 'cave' | 'village' | 'viewpoint' | 'lake' | 'adventure' | 'wildlife' | 'river' | 'peak' | 'cultural';
  bestTimeToVisit: string;
  howToReach: string;
  travelTips: string[];
  thingsToDo: string[];
  nearbyAttractions: string[];
  featured?: boolean;
  /** Optional deep-dive editorial paragraphs rendered below the overview for content depth. */
  deepDive?: { heading: string; body: string }[];
  /** Optional extra FAQs merged into the visible FAQ block and FAQPage schema. */
  extraFaqs?: { q: string; a: string }[];
}

const SUPABASE_BUCKET_URL = 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Meghalaya%20things%20to%20do';

export const getDestinationImageUrl = (slug: string, index: number = 1) =>
  `${SUPABASE_BUCKET_URL}/${slug}-meghalaya-${index}.webp`;

/**
 * Known available image indices per destination slug.
 * Verified against Supabase storage to prevent 404 requests.
 * Destinations not listed here have NO images uploaded.
 */
export const knownImageIndices: Record<string, number[]> = {
  'dawki-suspension-bridge': [2, 3],
  'dawki-umngot-river': [2, 3],
  'double-decker-living-root-bridge': [2, 3],
  'elephant-falls': [1, 2],
  'jakrem-hot-springs': [4],
  'krang-suri-falls': [2, 3],
  'krem-liat-prah': [1, 2],
  'laitlum-canyons': [2, 3, 4],
  'mawjymbuin-cave': [2],
  'mawlynnong-village': [2, 1],
  'mawphlang-sacred-forest': [1, 2, 3],
  'mawryngkhang-bamboo-trail': [1, 2],
  'mawsmai-cave': [1, 2, 3],
  'mawthadraishan-peak': [1, 2, 3],
  'nohkalikai-falls': [1, 2],
  'nokrek-biosphere-reserve': [1],
  'nongjrong-sunrise-viewpoint': [1, 2, 3],
  'nongkhnum-island': [1, 2, 3],
  'nongriat-village': [1, 2, 3],
  'rainbow-falls': [4],
  'ranikor': [1, 2, 3],
  'shillong-peak': [2, 3],
  'siju-cave': [2, 3],
  'spread-eagle-falls': [1, 2],
  'sweet-falls': [1, 2],
  'thadlaskein-lake': [2, 3],
  'tura-peak': [2, 3],
  'umiam-lake': [1, 2],
  'wei-sawdong-falls': [2, 3],
};

// Override image indices for specific destinations (1-based)
const destinationImageOverrides: Record<string, number[]> = {
  'wei-sawdong-falls': [2, 3], // skip image 1
};

export const getDestinationImages = (slug: string, count: number = 3) => {
  const overrides = destinationImageOverrides[slug];
  if (overrides) {
    return overrides.map((idx) => ({
      src: getDestinationImageUrl(slug, idx),
      alt: `${slug.replace(/-/g, ' ')} Meghalaya - Photo ${idx}`,
    }));
  }
  
  // Use known indices if available
  const known = knownImageIndices[slug];
  if (known) {
    return known.map((idx) => ({
      src: getDestinationImageUrl(slug, idx),
      alt: `${slug.replace(/-/g, ' ')} Meghalaya - Photo ${idx}`,
    }));
  }
  
  return Array.from({ length: count }, (_, i) => ({
    src: getDestinationImageUrl(slug, i + 1),
    alt: `${slug.replace(/-/g, ' ')} Meghalaya - Photo ${i + 1}`,
  }));
};

/**
 * Returns the first known valid image index for a slug, or null if no images exist.
 */
export const getFirstValidImageIndex = (slug: string): number | null => {
  const known = knownImageIndices[slug];
  return known && known.length > 0 ? known[0] : null;
};

export const meghalayaDestinations: MeghalayaDestination[] = [
  {
    name: 'Umiam Lake',
    slug: 'umiam-lake',
    description: 'Umiam Lake, locally known as Barapani, is one of the most beautiful landscapes in Meghalaya and the scenic gateway to Shillong. Spread across roughly 220 square kilometres of catchment, the reservoir sits about 15 kilometres before the city when you arrive from Guwahati, making it the first breathtaking view most travellers get of the Khasi Hills. It was created in the 1960s after the construction of the Umiam Dam — North East India\'s first hydel power project — and is today ringed by emerald pine forests and rolling hills that mirror the changing colours of the sky.\n\nMost travellers stop at the lakeside viewpoints to photograph the still blue water against the pines, but Umiam rewards those who linger. Early morning is genuinely magical: mist rises gently off the surface while the surrounding hills glow in soft gold light, and the water is calm enough for reflections. By afternoon the breeze picks up and the lake turns into one of the best spots near Shillong for boating, kayaking, water scooters and other adventure water sports run from the state water-sports complex.\n\nBecause it is so close to the city, Umiam Lake works equally well as a quick half-day trip from a Shillong base or as a relaxed first or last stop on a longer Meghalaya itinerary. Sunset over Barapani — when the sky burns orange and the dam lights flicker on — is one of those quiet, unhurried experiences that defines a trip to the hills.',
    shortDescription: 'A scenic reservoir (Barapani) surrounded by pine forests, perfect for boating, kayaking and sunset viewpoints near Shillong.',
    region: 'Near Shillong',
    category: 'lake',
    bestTimeToVisit: 'October to May for clear blue skies, pleasant weather and the best reflections. Early mornings (6–8 AM) offer misty, crowd-free views; sunset is best for photography. Monsoon (June–September) turns the surrounding hills lush green but skies can be overcast.',
    howToReach: 'Umiam Lake is 15 km north of Shillong on the Guwahati–Shillong Highway (NH6), about a 30–40 minute drive. Shared sumos and taxis run frequently from Police Bazar; a private cab costs roughly ₹600–₹900 round trip. From Guwahati it is around 2.5 hours by road, so it is an easy first stop on arrival.',
    travelTips: [
      'Visit between 6–8 AM for misty water and reflections before tour buses arrive',
      'Carry a light jacket or windbreaker — it gets breezy by the water in the afternoon',
      'Book boating or kayaking at the Orchid Lake Resort / state water-sports complex',
      'Weekdays are far quieter than weekends, when Shillong locals visit',
      'Combine Umiam with Shillong Peak and Elephant Falls for a full sightseeing day',
      'Sunset viewpoints near the dam are the most photogenic — arrive 45 minutes early',
    ],
    thingsToDo: [
      'Boating, kayaking and pedal-boating on the reservoir',
      'Water scooter and speedboat rides at the water-sports complex',
      'Photography at the sunrise and sunset viewpoints',
      'Lakeside picnic among the pine groves',
      'Visit the nearby orchid garden and lakeside cafés',
      'Cycling and short nature walks along the shoreline',
    ],
    nearbyAttractions: ['Shillong Peak', 'Elephant Falls', 'Don Bosco Museum'],
    featured: true,
    deepDive: [
      {
        heading: 'Why Umiam Lake is worth a stop',
        body: 'Umiam (Barapani) is the largest artificial lake in Meghalaya and acts as a natural welcome to the state. Unlike crowded waterfalls, the lake offers space to slow down — wide-open water, pine-scented air and uninterrupted hill views. It is one of the few spots near Shillong where you can combine gentle adventure (boating, kayaking) with pure relaxation, which is why it suits families, couples and solo travellers alike.',
      },
      {
        heading: 'Boating and water sports at Umiam',
        body: 'The state water-sports complex on the lake runs paddle boats, kayaks, water scooters and speedboat rides through most of the year, with sessions typically priced between ₹300 and ₹800 depending on the craft. Mornings have the calmest water; afternoons are livelier with a steady breeze. Life jackets are provided, and the calmer coves make it beginner-friendly. Always confirm operating hours, especially during peak monsoon when rides may pause.',
      },
      {
        heading: 'Where to stay near Umiam Lake',
        body: 'There is no need to find a stay right on the lake. Umiam is only 15 km from Shillong, so most travellers base themselves in the city and visit Umiam as a half-day trip. XTSY Travellers Hostel in Shillong is an affordable, well-located base — dorms from ₹329/night — with a travel desk that can arrange a cab to Umiam, Shillong Peak and Elephant Falls in a single circuit.',
      },
    ],
    extraFaqs: [
      {
        q: 'What is Umiam Lake also known as?',
        a: 'Umiam Lake is locally called Barapani, which means "big water" in the local language. It was formed by the Umiam Dam, North East India\'s first hydroelectric power project, built in the 1960s.',
      },
      {
        q: 'Is boating available at Umiam Lake?',
        a: 'Yes. The state water-sports complex at Umiam offers paddle boats, kayaks, water scooters and speedboat rides, typically priced between ₹300 and ₹800. Mornings have the calmest water and life jackets are provided.',
      },
      {
        q: 'How far is Umiam Lake from Shillong and Guwahati?',
        a: 'Umiam Lake is about 15 km (30–40 minutes) north of Shillong on NH6, and roughly 2.5 hours by road from Guwahati, making it an ideal first or last stop on a Meghalaya trip.',
      },
    ],
  },
  {
    name: 'Shillong Peak',
    slug: 'shillong-peak',
    description: 'Shillong Peak is the highest point in the city and offers a panoramic view of Shillong and the surrounding Khasi Hills. Located about 10 kilometers from the city center, the viewpoint provides travelers with a breathtaking perspective of the entire region.\n\nOn clear days visitors can see the entire Shillong city spread across the hills along with distant valleys and forests. The cool mountain air and wide landscape make the viewpoint a perfect place for photography and sightseeing.\n\nThe area is also popular during sunset when the sky transforms into shades of orange and purple while the lights of Shillong gradually appear below.',
    shortDescription: 'The highest point in Shillong offering panoramic views of the city and Khasi Hills.',
    region: 'Near Shillong',
    category: 'viewpoint',
    bestTimeToVisit: 'October to April. Visit during sunset for dramatic sky colors.',
    howToReach: '10 km from Shillong city center. Hire a taxi or drive up the winding road.',
    travelTips: ['Carry ID proof as it\'s near a military area', 'Best visited during clear weather', 'Sunset is the most photogenic time'],
    thingsToDo: ['Panoramic photography', 'Sunset viewing', 'Explore nearby trails'],
    nearbyAttractions: ['Elephant Falls', 'Umiam Lake', 'Ward\'s Lake'],
    featured: true,
  },
  {
    name: 'Elephant Falls',
    slug: 'elephant-falls',
    description: 'Elephant Falls is the most famous waterfall near Shillong and one of the most visited natural attractions in all of Meghalaya. Tucked into the Khasi Hills about 12 kilometres from the city centre, the falls cascade through three distinct tiers, each framed by moss-covered rocks and dense, dripping forest. The name comes from a colonial-era stone beside the falls that resembled an elephant — it was later destroyed in the 1897 earthquake, but the name stuck.\n\nA well-maintained staircase and series of railed viewing platforms lead visitors down through all three tiers. The first tier is broad and partly hidden by trees, the second is the widest and most photographed, and the third — the bottom tier — is the tallest single drop, plunging dramatically into a clear pool. The short descent takes most people 15–20 minutes each way and is one of the most accessible waterfall experiences in the region.\n\nDuring the monsoon (June–September) the falls roar at full force, the spray drifting across the platforms, while in the drier winter months the flow is gentler but the surrounding light and greenery are at their clearest. Because it sits close to Shillong Peak and on the road back from the city\'s southern viewpoints, Elephant Falls is easy to combine with other sights into a single, rewarding day of sightseeing.',
    shortDescription: 'A scenic three-tiered waterfall 12 km from Shillong — one of the most accessible and most visited natural attractions in Meghalaya.',
    region: 'Near Shillong',
    category: 'waterfall',
    bestTimeToVisit: 'June to September for the most powerful, full-flow falls (expect spray and slippery steps). October to February offers pleasant weather, clearer light and easier walking. Early morning (entry opens around 8 AM) is best to beat the crowds.',
    howToReach: 'Elephant Falls is 12 km south-west of Shillong, about a 30-minute drive, on the road towards Shillong Peak. Shared and private taxis run from Police Bazar; a private cab covering Elephant Falls and Shillong Peak together costs roughly ₹800–₹1,200 round trip. A small entry ticket and parking fee apply at the gate.',
    travelTips: [
      'Wear shoes with good grip — the stone steps get slippery in the monsoon',
      'Visit right at opening (around 8 AM) to photograph the tiers without crowds',
      'Carry a light raincoat in monsoon; spray reaches the lower platforms',
      'The full descent and climb is moderate — pace yourself if you have knee issues',
      'Pair it with Shillong Peak on the same trip, as they share the same road',
      'Keep a small amount of cash for the entry ticket, parking and local snack stalls',
    ],
    thingsToDo: [
      'Walk down to view all three tiers from the railed platforms',
      'Photography at each viewing point, especially the widest middle tier',
      'Watch the powerful monsoon flow from the lower deck',
      'Enjoy hot tea and local snacks at the stalls near the entrance',
      'Combine with a sunset visit to nearby Shillong Peak',
    ],
    nearbyAttractions: ['Shillong Peak', 'Umiam Lake', 'Lady Hydari Park'],
    featured: true,
    deepDive: [
      {
        heading: 'The three tiers of Elephant Falls',
        body: 'Elephant Falls is really three waterfalls in one. The top tier is wide and partly screened by foliage; the middle tier fans out across the rocks and is the favourite for photos; and the bottom tier is a single tall plunge into a clear pool. A staircase with viewing decks connects all three, so even casual visitors can see the full sequence in under an hour.',
      },
      {
        heading: 'Best time to photograph Elephant Falls',
        body: 'For raw power and spray, come during the monsoon when the falls are at their loudest. For crisp, well-lit photos and dry steps, the winter months (October–February) are ideal. Either way, arrive at opening time around 8 AM — by mid-morning the platforms fill with tour groups, making clean shots harder.',
      },
      {
        heading: 'Where to stay when visiting Elephant Falls',
        body: 'Elephant Falls is a short day trip, so it is best visited from a Shillong base rather than staying nearby. XTSY Travellers Hostel in Shillong is an affordable, central option — dorms from ₹329/night — and its travel desk can arrange a half-day cab circuit covering Elephant Falls, Shillong Peak and Umiam Lake in one go.',
      },
    ],
    extraFaqs: [
      {
        q: 'Why is it called Elephant Falls?',
        a: 'The falls were named by British settlers after a large rock beside it that resembled an elephant. The rock was destroyed in the 1897 earthquake, but the name Elephant Falls remained.',
      },
      {
        q: 'How many tiers does Elephant Falls have?',
        a: 'Elephant Falls has three distinct tiers, each with its own railed viewing platform. The bottom tier is the tallest single drop and the middle tier is the widest and most photographed.',
      },
      {
        q: 'Is there an entry fee for Elephant Falls?',
        a: 'Yes, there is a small entry ticket and a parking fee at the gate. Carry some cash, as the descent through the tiers takes about 15–20 minutes each way along a maintained staircase.',
      },
    ],
  },
  {
    name: 'Laitlum Canyons',
    slug: 'laitlum-canyons',
    description: 'Laitlum Canyons is one of the most breathtaking viewpoints in Meghalaya. Located around 25 kilometers from Shillong, the canyon offers sweeping views of deep valleys and endless rolling hills.\n\nStanding at the edge of the canyon allows visitors to witness clouds drifting slowly through the valley below while the cliffs rise dramatically above the landscape. The scenery constantly changes with the movement of clouds and sunlight.\n\nLaitlum is also known for trekking routes that descend into remote Khasi villages hidden deep within the valley, offering adventurous travelers a chance to experience traditional life in the hills.',
    shortDescription: 'Breathtaking canyons near Shillong with sweeping valley views and trekking routes to remote villages.',
    region: 'Near Shillong',
    category: 'viewpoint',
    bestTimeToVisit: 'October to March for clear views. Monsoon brings dramatic cloud-filled valleys.',
    howToReach: '25 km from Shillong. Hire a taxi or drive. The last stretch is a narrow road.',
    travelTips: ['Carry water and snacks', 'Start early for the best light', 'Don\'t go too close to cliff edges'],
    thingsToDo: ['Canyon viewpoint photography', 'Trek to Rasong village', 'Cloud watching', 'Sunrise viewing'],
    nearbyAttractions: ['Smit Village', 'Shillong Peak', 'Mawphlang Sacred Forest'],
    featured: true,
  },
  {
    name: 'Nohkalikai Falls',
    slug: 'nohkalikai-falls',
    description: 'Nohkalikai Falls is the tallest plunge waterfall in India and one of the most iconic natural landmarks in Meghalaya. Located near Cherrapunji (Sohra), the waterfall plunges dramatically from a high cliff into a turquoise pool far below.\n\nThe surrounding cliffs and valleys create a breathtaking landscape that becomes even more dramatic during the monsoon season when heavy rainfall feeds the waterfall.\n\nAccording to Khasi folklore, the waterfall\'s name is linked to a tragic legend about a woman named Likai who leapt from the cliff, giving the falls its name "Noh-Ka-Likai."',
    shortDescription: 'India\'s tallest plunge waterfall near Cherrapunji, plunging into a turquoise pool below dramatic cliffs.',
    region: 'Cherrapunji & Sohra',
    category: 'waterfall',
    bestTimeToVisit: 'July to September for peak water flow. October to March for clear skies.',
    howToReach: '7 km from Cherrapunji. Accessible by road with a short walk to the viewpoint.',
    travelTips: ['Monsoon offers the best waterfall views but trails can be slippery', 'Carry a raincoat', 'The turquoise pool is visible best in winter'],
    thingsToDo: ['Viewpoint photography', 'Learn the local legend', 'Visit nearby Nohsngithiang Falls'],
    nearbyAttractions: ['Mawsmai Cave', 'Seven Sisters Falls', 'Eco Park Sohra'],
    featured: true,
  },
  {
    name: 'Double Decker Living Root Bridge',
    slug: 'double-decker-living-root-bridge',
    description: 'The Double Decker Living Root Bridge in Nongriat is one of the most extraordinary natural structures in the world. Instead of being built using modern construction materials, the bridge is formed by guiding the roots of rubber fig trees across rivers until they grow strong enough to support human weight.\n\nOver time the roots intertwine and strengthen, forming a durable bridge that can last for centuries. The unique double-layer structure consists of two bridges stacked vertically.\n\nReaching the bridge requires trekking through dense rainforest and descending thousands of steps from the village of Tyrna, making the journey an unforgettable adventure.',
    shortDescription: 'A centuries-old natural bridge formed from living tree roots — one of the world\'s most extraordinary structures.',
    region: 'Cherrapunji & Sohra',
    category: 'adventure',
    bestTimeToVisit: 'November to March for dry trekking conditions. Avoid monsoon for safety.',
    howToReach: 'Trek from Tyrna village (about 3,500 steps down). Start early for a day trip or stay overnight in Nongriat.',
    travelTips: ['Carry at least 2 liters of water', 'Wear proper trekking shoes', 'Consider staying overnight at Nongriat guesthouses', 'The climb back up is harder — pace yourself'],
    thingsToDo: ['Trek through the rainforest', 'Swim in natural rock pools', 'Visit Rainbow Falls nearby', 'Experience Khasi village life'],
    nearbyAttractions: ['Rainbow Falls', 'Nongriat Village', 'Nohkalikai Falls'],
    featured: true,
  },
  {
    name: 'Dawki – Umngot River',
    slug: 'dawki-umngot-river',
    description: 'The Umngot River in Dawki is famous for its crystal-clear water that allows visitors to see the riverbed beneath the surface. During winter the water becomes so transparent that boats floating on the river appear to hover in mid-air.\n\nThe river flows peacefully between green hills near the India–Bangladesh border. Small wooden boats operated by local fishermen take travelers along the river, allowing them to admire the stunning landscape.\n\nDawki has become one of the most photographed locations in Meghalaya thanks to the extraordinary clarity of the water.',
    shortDescription: 'Crystal-clear river where boats appear to float in mid-air — Meghalaya\'s most photographed destination.',
    region: 'Jaintia Hills',
    category: 'river',
    bestTimeToVisit: 'November to February for the clearest water. Monsoon makes the river murky.',
    howToReach: '95 km from Shillong (about 3 hours). Taxis available from Shillong.',
    travelTips: ['Visit in winter for transparent water', 'Carry snacks as limited food options', 'Combine with Shnongpdeng visit'],
    thingsToDo: ['Crystal-clear boating', 'Photography', 'Visit India-Bangladesh border', 'Camping at Shnongpdeng'],
    nearbyAttractions: ['Shnongpdeng Village', 'Dawki Suspension Bridge', 'Mawlynnong Village'],
    featured: true,
  },
  {
    name: 'Mawphlang Sacred Forest',
    slug: 'mawphlang-sacred-forest',
    description: 'Mawphlang Sacred Forest is an ancient forest protected for centuries by Khasi tribal traditions. According to local beliefs the forest is sacred and removing anything from it is strictly forbidden.\n\nWalking through the forest reveals towering trees, moss-covered rocks, and rare plant species that have grown undisturbed for generations.\n\nVisitors explore the forest with local guides who explain the cultural significance and ecological importance of the sacred grove.',
    shortDescription: 'An ancient sacred forest protected by Khasi traditions for centuries, rich with rare flora.',
    region: 'Near Shillong',
    category: 'cultural',
    bestTimeToVisit: 'Year-round. Monsoon adds mystical beauty with mist and lush greenery.',
    howToReach: '25 km from Shillong. Hire a taxi. Local guides are available at the entrance.',
    travelTips: ['Hire a local guide — mandatory for the full experience', 'Don\'t remove anything from the forest', 'Wear comfortable walking shoes'],
    thingsToDo: ['Guided forest walk', 'Learn about Khasi traditions', 'Nature photography', 'Birdwatching'],
    nearbyAttractions: ['Laitlum Canyons', 'Shillong Peak', 'Smit Village'],
  },
  {
    name: 'Mawlynnong Village',
    slug: 'mawlynnong-village',
    description: 'Mawlynnong Village is widely known as the "Cleanest Village in Asia." Located near the India–Bangladesh border, the village is famous for its spotless pathways, bamboo dustbins, and beautifully maintained gardens.\n\nThe community follows strict cleanliness practices, making the village an inspiring example of sustainable tourism.\n\nVisitors can climb the bamboo skywalk which offers panoramic views of surrounding forests and the plains of Bangladesh.',
    shortDescription: 'Asia\'s cleanest village with spotless pathways, bamboo skywalk, and views of Bangladesh.',
    region: 'East Khasi Hills',
    category: 'village',
    bestTimeToVisit: 'October to May for pleasant weather and clear views from the skywalk.',
    howToReach: '90 km from Shillong (about 3 hours). Often combined with Dawki trip.',
    travelTips: ['Respect the village cleanliness practices', 'Try local Khasi cuisine', 'Climb the bamboo skywalk for best views'],
    thingsToDo: ['Bamboo skywalk', 'Village walks', 'Photography', 'Visit the living root bridge nearby'],
    nearbyAttractions: ['Dawki – Umngot River', 'Shnongpdeng Village', 'Riwai Living Root Bridge'],
    featured: true,
  },
  {
    name: 'Krang Suri Falls',
    slug: 'krang-suri-falls',
    description: 'Krang Suri Falls is one of the most picturesque waterfalls in Meghalaya. Located in the Jaintia Hills near Jowai, the waterfall is famous for its vibrant turquoise pool and layered rock formations.\n\nVisitors can walk down a trail to the base of the waterfall where they can swim in the clear water and enjoy the surrounding forest.\n\nBecause of its vibrant blue water and peaceful setting, Krang Suri Falls is considered one of the most photogenic waterfalls in Meghalaya.',
    shortDescription: 'A stunning waterfall with vibrant turquoise pool in the Jaintia Hills — perfect for swimming.',
    region: 'Jaintia Hills',
    category: 'waterfall',
    bestTimeToVisit: 'October to March for swimmable conditions. Monsoon for dramatic waterfall views.',
    howToReach: '60 km from Jowai. Trek required from the parking area to the falls.',
    travelTips: ['Carry swimwear', 'The trek down is moderate', 'Changing rooms available at the base'],
    thingsToDo: ['Swimming in turquoise pool', 'Cliff photography', 'Nature trekking', 'Picnic by the falls'],
    nearbyAttractions: ['Thadlaskein Lake', 'Nartiang Monoliths', 'Tyrshi Falls'],
  },
  {
    name: 'Mawsmai Cave',
    slug: 'mawsmai-cave',
    description: 'Mawsmai Cave is one of the most accessible limestone caves in Meghalaya. Located near Cherrapunji, the cave features fascinating stalactite and stalagmite formations created over thousands of years.\n\nVisitors can walk through narrow passages and chambers inside the cave while observing unique rock structures.\n\nThe cave offers a glimpse into the vast underground cave systems that exist throughout Meghalaya.',
    shortDescription: 'An accessible limestone cave near Cherrapunji with stunning stalactite and stalagmite formations.',
    region: 'Cherrapunji & Sohra',
    category: 'cave',
    bestTimeToVisit: 'October to May. Avoid monsoon as caves can get slippery.',
    howToReach: '6 km from Cherrapunji town center. Easily accessible by road.',
    travelTips: ['Wear non-slip shoes', 'The cave has narrow passages — not suitable for claustrophobic visitors', 'Carry a small torch'],
    thingsToDo: ['Cave exploration', 'Photography of rock formations', 'Learn about geological history'],
    nearbyAttractions: ['Nohkalikai Falls', 'Seven Sisters Falls', 'Arwah Cave'],
  },
  {
    name: 'Seven Sisters Falls',
    slug: 'seven-sisters-falls',
    description: 'Seven Sisters Falls is a spectacular waterfall located near Cherrapunji. The waterfall consists of multiple cascades flowing down a cliff, creating a stunning visual display especially during the monsoon season.\n\nThe falls are named after the seven northeastern states of India and can be best viewed from the Eco Park in Sohra.',
    shortDescription: 'Multiple cascades flowing down dramatic cliffs near Cherrapunji — named after the seven NE states.',
    region: 'Cherrapunji & Sohra',
    category: 'waterfall',
    bestTimeToVisit: 'June to September for all seven streams to flow. Best viewed after heavy rain.',
    howToReach: 'Viewable from Eco Park Sohra or Mawsmai viewpoint, both near Cherrapunji.',
    travelTips: ['Best seen during or after rainfall', 'Visit Eco Park for the best vantage point', 'Carry a raincoat'],
    thingsToDo: ['Viewpoint photography', 'Visit Eco Park Sohra', 'Combine with Nohkalikai Falls'],
    nearbyAttractions: ['Nohkalikai Falls', 'Eco Park Sohra', 'Mawsmai Cave'],
  },
  {
    name: 'Wei Sawdong Falls',
    slug: 'wei-sawdong-falls',
    description: 'Wei Sawdong Falls is one of the most visually stunning waterfalls in Meghalaya. Located near Cherrapunji, this three-tier waterfall is famous for its vibrant turquoise pools and layered rock formations that create a breathtaking natural staircase of water.\n\nReaching the waterfall requires descending a steep trail through dense forest and rocky paths. Although the hike can be challenging, the view of the cascading water surrounded by lush cliffs makes the journey worthwhile.\n\nBecause of its hidden location and crystal-clear water, Wei Sawdong Falls has become a favorite destination for photographers and adventure travelers seeking untouched natural beauty.',
    shortDescription: 'A stunning three-tier waterfall with turquoise pools hidden in the forests near Cherrapunji.',
    region: 'Cherrapunji & Sohra',
    category: 'waterfall',
    bestTimeToVisit: 'October to March for clear water. Monsoon adds drama but trails are slippery.',
    howToReach: 'Near Cherrapunji. A steep descent through forest — moderate to challenging trek.',
    travelTips: ['Wear sturdy trekking shoes', 'The descent is steep — bring trekking poles', 'Carry sufficient water'],
    thingsToDo: ['Multi-tier waterfall trekking', 'Photography', 'Swimming in rock pools'],
    nearbyAttractions: ['Nohkalikai Falls', 'Mawsmai Cave', 'Garden of Caves'],
  },
  {
    name: 'Rainbow Falls',
    slug: 'rainbow-falls',
    description: 'Rainbow Falls is a spectacular waterfall located deep in the forests near Nongriat village. Many travelers visit it after trekking to the famous Double Decker Living Root Bridge.\n\nThe waterfall flows into a crystal-clear turquoise pool surrounded by rocky cliffs and dense tropical forest. When sunlight hits the mist created by the falling water, vibrant rainbows often appear above the pool.\n\nThe trek to Rainbow Falls offers an immersive journey through Meghalaya\'s lush rainforest and suspension bridges, making it one of the most rewarding adventure experiences in the region.',
    shortDescription: 'A magical waterfall where rainbows form in the mist — accessible via the Nongriat trek.',
    region: 'Cherrapunji & Sohra',
    category: 'waterfall',
    bestTimeToVisit: 'November to March for best trekking conditions and rainbow sightings.',
    howToReach: 'Trek from Tyrna village through Nongriat. About 1-2 hours beyond the Double Decker Root Bridge.',
    travelTips: ['Visit between 10am-2pm for rainbow sightings', 'Stay overnight at Nongriat', 'The trek is demanding — good fitness required'],
    thingsToDo: ['Rainbow photography', 'Swimming in the pool', 'Rainforest trekking', 'Suspension bridge crossings'],
    nearbyAttractions: ['Double Decker Living Root Bridge', 'Nongriat Village', 'Nohkalikai Falls'],
  },
  {
    name: 'Garden of Caves',
    slug: 'garden-of-caves',
    description: 'The Garden of Caves is a scenic natural park located near Cherrapunji that combines waterfalls, caves, and unique rock formations within a beautifully landscaped environment.\n\nVisitors can explore walking trails that lead to multiple viewpoints overlooking waterfalls, streams, and lush green valleys. Small bridges and pathways allow travelers to discover hidden corners of the park.\n\nThe peaceful atmosphere and diverse natural features make the Garden of Caves a perfect destination for travelers looking to explore Meghalaya\'s landscapes at a relaxed pace.',
    shortDescription: 'A scenic natural park combining waterfalls, caves, and rock formations near Cherrapunji.',
    region: 'Cherrapunji & Sohra',
    category: 'cave',
    bestTimeToVisit: 'Year-round, but best from October to May.',
    howToReach: 'Near Cherrapunji, accessible by road. Short walking trails within the park.',
    travelTips: ['Allow 1-2 hours for exploration', 'Easy walking trails suitable for all ages', 'Good photo opportunities throughout'],
    thingsToDo: ['Walking trails', 'Cave exploration', 'Waterfall viewing', 'Photography'],
    nearbyAttractions: ['Mawsmai Cave', 'Nohkalikai Falls', 'Wei Sawdong Falls'],
  },
  {
    name: 'Arwah Cave',
    slug: 'arwah-cave',
    description: 'Arwah Cave is a fascinating limestone cave located near Cherrapunji. The cave is known for its ancient rock formations and fossil impressions embedded in the cave walls.\n\nVisitors walking through the cave can observe stalactites and stalagmites formed by mineral deposits over thousands of years. Fossilized marine life preserved in the limestone suggests that this region was once under the ocean millions of years ago.\n\nThe cave offers a unique opportunity to explore Meghalaya\'s geological history while experiencing the mysterious underground world of limestone caves.',
    shortDescription: 'A limestone cave with ancient fossils embedded in its walls — a geological wonder near Cherrapunji.',
    region: 'Cherrapunji & Sohra',
    category: 'cave',
    bestTimeToVisit: 'October to May. Cave interiors remain cool year-round.',
    howToReach: 'Near Cherrapunji, accessible by road. A short trail leads to the cave entrance.',
    travelTips: ['Look for fossil imprints on cave walls', 'Carry a torch', 'The cave has some narrow sections'],
    thingsToDo: ['Fossil observation', 'Cave exploration', 'Photography of rock formations'],
    nearbyAttractions: ['Mawsmai Cave', 'Nohkalikai Falls', 'Garden of Caves'],
  },
  {
    name: 'Dainthlen Falls',
    slug: 'dainthlen-falls',
    description: 'Dainthlen Falls is a powerful waterfall located near Cherrapunji that flows across a wide rocky plateau before plunging into a deep gorge below.\n\nAccording to Khasi legends, the waterfall is connected to the story of a mythical serpent known as "Thlen," which once terrorized the region. The name Dainthlen roughly translates to "the place where the serpent was slain."\n\nToday visitors come here to admire the dramatic landscape and powerful cascades, especially during the monsoon season when the water flow becomes extremely strong.',
    shortDescription: 'A legendary waterfall near Cherrapunji tied to the myth of the serpent Thlen.',
    region: 'Cherrapunji & Sohra',
    category: 'waterfall',
    bestTimeToVisit: 'June to September for maximum water flow.',
    howToReach: 'Near Cherrapunji town, accessible by road.',
    travelTips: ['Learn the Thlen legend from local guides', 'Slippery during monsoon', 'Great for landscape photography'],
    thingsToDo: ['Waterfall viewing', 'Learn Khasi mythology', 'Photography'],
    nearbyAttractions: ['Nohkalikai Falls', 'Mawsmai Cave', 'Seven Sisters Falls'],
  },
  {
    name: 'Eco Park Sohra',
    slug: 'eco-park-sohra',
    description: 'Eco Park in Sohra is a scenic viewpoint park developed by the Meghalaya government to showcase the dramatic landscapes of the region. The park offers panoramic views of deep valleys, waterfalls, and the distant plains of Bangladesh.\n\nWell-maintained gardens and walking paths make it a pleasant place for travelers to relax while enjoying the scenery.\n\nBecause of its elevated location, Eco Park is considered one of the best places to appreciate the vast landscapes surrounding Cherrapunji.',
    shortDescription: 'A scenic viewpoint park in Cherrapunji with panoramic views of valleys and Bangladesh plains.',
    region: 'Cherrapunji & Sohra',
    category: 'viewpoint',
    bestTimeToVisit: 'October to May for clear views. Monsoon offers dramatic cloud formations.',
    howToReach: 'In Cherrapunji (Sohra) town, easily accessible.',
    travelTips: ['Great viewpoint for Seven Sisters Falls', 'Well-maintained with facilities', 'Best visited during clear weather'],
    thingsToDo: ['Valley panoramic views', 'Photography', 'Garden walks', 'View Seven Sisters Falls'],
    nearbyAttractions: ['Seven Sisters Falls', 'Nohkalikai Falls', 'Mawsmai Cave'],
  },
  {
    name: 'Shnongpdeng Village',
    slug: 'shnongpdeng',
    description: 'Shnongpdeng is a small riverside village located near Dawki along the crystal-clear Umngot River. In recent years it has become one of the most popular adventure tourism destinations in Meghalaya.\n\nVisitors can enjoy activities such as kayaking, boating, snorkeling, and cliff jumping in the clear waters of the river. The surrounding hills and forests create a peaceful natural environment.\n\nCamping by the riverside at night is one of the most memorable experiences here, as travelers can enjoy starry skies and the soothing sound of flowing water.',
    shortDescription: 'An adventure village on the crystal-clear Umngot River — kayaking, cliff jumping, and riverside camping.',
    region: 'Jaintia Hills',
    category: 'adventure',
    bestTimeToVisit: 'November to March for crystal-clear water and camping weather.',
    howToReach: 'Near Dawki, about 3 hours from Shillong. Taxis available.',
    travelTips: ['Book riverside campsites in advance', 'Carry swimwear', 'Best combined with Dawki visit'],
    thingsToDo: ['Kayaking', 'Cliff jumping', 'Snorkeling', 'Riverside camping', 'Boating'],
    nearbyAttractions: ['Dawki – Umngot River', 'Mawlynnong Village', 'Dawki Suspension Bridge'],
  },
  {
    name: 'Nartiang Monoliths',
    slug: 'nartiang-monoliths',
    description: 'The Nartiang Monoliths are one of the most significant historical sites in Meghalaya. Located in the Jaintia Hills, the site contains several massive stone monoliths erected by the Jaintia kings centuries ago.\n\nThese monoliths were traditionally built to commemorate important events and honor warriors. Some of the stones reach impressive heights, making them among the tallest monolithic structures in India.\n\nToday the site stands as a reminder of the rich cultural heritage and traditions of the Jaintia kingdom.',
    shortDescription: 'Ancient stone monoliths erected by Jaintia kings — among the tallest in India.',
    region: 'Jaintia Hills',
    category: 'cultural',
    bestTimeToVisit: 'Year-round. Pleasant weather from October to April.',
    howToReach: 'Near Jowai town in Jaintia Hills. Accessible by road from Shillong (about 2 hours).',
    travelTips: ['Hire a local guide for historical context', 'The site is compact — allow 1 hour', 'Visit the nearby Durga temple'],
    thingsToDo: ['Learn Jaintia history', 'Photography of monoliths', 'Visit adjacent temple'],
    nearbyAttractions: ['Thadlaskein Lake', 'Krang Suri Falls', 'Tyrshi Falls'],
  },
  {
    name: 'Thadlaskein Lake',
    slug: 'thadlaskein-lake',
    description: 'Thadlaskein Lake is a serene natural lake located near Jowai in the Jaintia Hills. Surrounded by rolling hills and open grasslands, the lake provides a peaceful setting for visitors looking to relax in nature.\n\nAccording to local legend, the lake was created by followers of a Jaintia hero during their migration to the region. Over time it became an important cultural and recreational site. Today the lake is popular for picnics, nature walks, and scenic photography.',
    shortDescription: 'A serene lake surrounded by grasslands in the Jaintia Hills — perfect for picnics and photography.',
    region: 'Jaintia Hills',
    category: 'lake',
    bestTimeToVisit: 'October to March for pleasant weather.',
    howToReach: 'Near Jowai, accessible by road.',
    travelTips: ['Peaceful spot for a half-day visit', 'Combine with Nartiang Monoliths', 'Carry snacks for a lakeside picnic'],
    thingsToDo: ['Lakeside walks', 'Picnics', 'Photography', 'Boating'],
    nearbyAttractions: ['Nartiang Monoliths', 'Krang Suri Falls', 'Syntu Ksiar'],
  },
  {
    name: 'Balpakram National Park',
    slug: 'balpakram-national-park',
    description: 'Balpakram National Park is a remote wildlife sanctuary located in the Garo Hills. The park is often referred to as the "Grand Canyon of Meghalaya" because of its dramatic cliffs and deep gorges.\n\nThe region is home to diverse wildlife including elephants, red pandas, barking deer, and many rare plant species. The rugged landscape and dense forests make it an important biodiversity hotspot.\n\nFor travelers interested in wilderness exploration and wildlife, Balpakram offers one of the most unique natural environments in Meghalaya.',
    shortDescription: 'The "Grand Canyon of Meghalaya" — a remote national park with dramatic cliffs and diverse wildlife.',
    region: 'Garo Hills',
    category: 'wildlife',
    bestTimeToVisit: 'October to March for wildlife sightings and trekking.',
    howToReach: 'Located in South Garo Hills. Nearest town is Baghmara (about 50 km).',
    travelTips: ['Requires permits — arrange in advance', 'Remote area — carry essentials', 'Best visited with a local guide'],
    thingsToDo: ['Wildlife spotting', 'Canyon viewpoints', 'Trekking', 'Bird watching'],
    nearbyAttractions: ['Siju Cave', 'Baghmara Reserve Forest', 'Simsang River'],
  },
  {
    name: 'Nokrek Biosphere Reserve',
    slug: 'nokrek-biosphere-reserve',
    description: 'Nokrek Biosphere Reserve is a UNESCO-recognized ecological reserve located in the Garo Hills. The reserve protects dense tropical forests that are home to rare wildlife species and unique plant varieties.\n\nThe area is particularly known for its wild citrus species, which are believed to be ancestors of many modern citrus fruits.\n\nTrekkers and wildlife enthusiasts visit Nokrek to explore its forests, observe biodiversity, and experience the pristine natural environment of the Garo Hills.',
    shortDescription: 'A UNESCO biosphere reserve in the Garo Hills — home to the ancestor of all citrus fruits.',
    region: 'Garo Hills',
    category: 'wildlife',
    bestTimeToVisit: 'October to April for trekking and wildlife observation.',
    howToReach: 'Near Tura in the Garo Hills. Trek required to reach the reserve.',
    travelTips: ['Arrange permits in advance', 'Hire local Garo guides', 'Carry camping gear for overnight treks'],
    thingsToDo: ['Trekking', 'Wildlife observation', 'Citrus species discovery', 'Bird watching'],
    nearbyAttractions: ['Tura Peak', 'Nokrek Peak', 'Rongbang Dare Falls'],
  },
  {
    name: 'Sweet Falls',
    slug: 'sweet-falls',
    description: 'Sweet Falls is one of the most dramatic waterfalls near Shillong. Located about five kilometers from the city center, the waterfall plunges sharply down a steep cliff surrounded by dense forest.\n\nBecause of the vertical drop and narrow stream, the falls create an impressive natural spectacle during the rainy season.\n\nThe surrounding landscape is rugged and relatively untouched, making the waterfall feel remote even though it is close to Shillong.',
    shortDescription: 'A dramatic waterfall just 5 km from Shillong city center, plunging down steep cliffs.',
    region: 'Near Shillong',
    category: 'waterfall',
    bestTimeToVisit: 'June to September for peak water flow.',
    howToReach: '5 km from Shillong city center. Accessible by taxi.',
    travelTips: ['Not safe for swimming due to strong currents', 'Best viewed from designated viewpoints', 'Quick visit — combine with other attractions'],
    thingsToDo: ['Waterfall viewing', 'Photography', 'Nature walks'],
    nearbyAttractions: ['Bishop Falls', 'Beadon Falls', 'Shillong Peak'],
  },
  {
    name: 'Bishop Falls',
    slug: 'bishop-falls',
    description: 'Bishop Falls is one of the tallest waterfalls in Meghalaya and is located near Shillong. The waterfall plunges from a height of over 130 meters into a deep forested valley below, creating a spectacular sight during the monsoon season.\n\nThe falls are often viewed alongside the nearby Beadon Falls, as both cascades are located close to each other within the same valley. The lush greenery surrounding the cliffs adds to the beauty of the waterfall.',
    shortDescription: 'One of Meghalaya\'s tallest waterfalls, plunging 130 meters into a forested valley near Shillong.',
    region: 'Near Shillong',
    category: 'waterfall',
    bestTimeToVisit: 'June to October for the best views.',
    howToReach: 'Near Shillong, viewable from Upper Shillong road.',
    travelTips: ['Best viewed from a distance', 'Combine with Beadon Falls', 'Most impressive during monsoon'],
    thingsToDo: ['Distant viewing', 'Photography', 'Combine with nearby falls'],
    nearbyAttractions: ['Beadon Falls', 'Sweet Falls', 'Spread Eagle Falls'],
  },
  {
    name: 'Spread Eagle Falls',
    slug: 'spread-eagle-falls',
    description: 'Spread Eagle Falls is a charming waterfall located near Shillong Cantonment. The waterfall gets its name from the way the cascading water spreads across the rock face, resembling the wings of an eagle in flight.\n\nUnlike some of the taller waterfalls in Meghalaya, Spread Eagle Falls is known for its wide and graceful flow. The surrounding forest creates a peaceful environment ideal for quiet sightseeing.',
    shortDescription: 'A graceful waterfall near Shillong where water spreads across rocks like eagle wings.',
    region: 'Near Shillong',
    category: 'waterfall',
    bestTimeToVisit: 'June to September for full water spread.',
    howToReach: 'Near Shillong Cantonment. Accessible by road.',
    travelTips: ['Less crowded than other Shillong waterfalls', 'Peaceful for nature photography', 'Quick visit — 30 minutes sufficient'],
    thingsToDo: ['Waterfall photography', 'Peaceful nature walks', 'Bird watching'],
    nearbyAttractions: ['Bishop Falls', 'Sweet Falls', 'Shillong Peak'],
  },
  {
    name: 'Mawjymbuin Cave',
    slug: 'mawjymbuin-cave',
    description: 'Mawjymbuin Cave is a limestone cave located near Mawsynram, one of the wettest places on Earth. The cave is famous for a naturally formed stalagmite structure that resembles a Shiva Lingam, making it an important spiritual site for many visitors.\n\nThe cave also contains several impressive stalactites and stalagmites formed over thousands of years by mineral deposits.',
    shortDescription: 'A spiritual limestone cave near the world\'s wettest place, featuring a natural Shiva Lingam formation.',
    region: 'East Khasi Hills',
    category: 'cave',
    bestTimeToVisit: 'October to May. The region receives extreme rainfall during monsoon.',
    howToReach: 'Near Mawsynram, about 60 km from Shillong.',
    travelTips: ['Combine with a visit to Mawsynram', 'The cave has spiritual significance', 'Accessible even for non-trekkers'],
    thingsToDo: ['Cave exploration', 'Spiritual visit', 'Photography of formations'],
    nearbyAttractions: ['Mawsynram', 'Cherrapunji', 'Nohkalikai Falls'],
  },
  {
    name: 'Nongkhnum Island',
    slug: 'nongkhnum-island',
    description: 'Nongkhnum Island is the second largest river island in Asia and one of Meghalaya\'s hidden natural gems. Located in the West Khasi Hills, the island is surrounded by rivers and offers beautiful sandy riverbanks and open landscapes.\n\nVisitors can explore scenic waterfalls, grassy fields, and peaceful river viewpoints while enjoying the quiet atmosphere of the island.',
    shortDescription: 'Asia\'s second largest river island — a hidden gem with sandy riverbanks in the West Khasi Hills.',
    region: 'West Khasi Hills',
    category: 'adventure',
    bestTimeToVisit: 'November to March for dry conditions and accessible river crossings.',
    howToReach: 'In the West Khasi Hills, requires local transport. About 4 hours from Shillong.',
    travelTips: ['Very offbeat — limited facilities', 'Carry food and water', 'Best for adventurous travelers'],
    thingsToDo: ['Island exploration', 'Riverside walks', 'Photography', 'Camping'],
    nearbyAttractions: ['Nongkhnum Falls', 'Langshiang Falls', 'Mawthadraishan Peak'],
  },
  {
    name: 'Krem Mawmluh',
    slug: 'krem-mawmluh',
    description: 'Krem Mawmluh Cave is one of the longest caves in India and is located near Cherrapunji. The cave system extends several kilometers underground and contains impressive limestone formations.\n\nInside the cave visitors can observe stalactites, stalagmites, and underground streams that have shaped the rock formations over thousands of years.\n\nThe cave is also scientifically important because geological studies here helped define a new age in Earth\'s geological timeline known as the Meghalayan Age.',
    shortDescription: 'One of India\'s longest caves that defined the Meghalayan Age in Earth\'s geological timeline.',
    region: 'Cherrapunji & Sohra',
    category: 'cave',
    bestTimeToVisit: 'October to May for safe exploration.',
    howToReach: 'Near Cherrapunji, accessible by road. Guided tours available.',
    travelTips: ['Geological significance — learn about the Meghalayan Age', 'Hire an experienced guide', 'Not all sections are accessible to tourists'],
    thingsToDo: ['Cave exploration', 'Learn geological history', 'Photography'],
    nearbyAttractions: ['Mawsmai Cave', 'Nohkalikai Falls', 'Arwah Cave'],
  },
  {
    name: 'Siju Cave',
    slug: 'siju-cave',
    description: 'Siju Cave is one of the most famous caves in the Garo Hills and is located near the Simsang River. The cave is known for its extensive limestone formations and large chambers.\n\nInside the cave visitors can observe impressive stalactites and stalagmites that have formed over thousands of years. Some sections of the cave extend deep underground and are explored by experienced cavers.',
    shortDescription: 'A famous cave system in the Garo Hills with extensive limestone formations and vast chambers.',
    region: 'Garo Hills',
    category: 'cave',
    bestTimeToVisit: 'October to March for safe exploration.',
    howToReach: 'Near Simsang River in Garo Hills. Remote — requires local transport.',
    travelTips: ['Experienced guide recommended', 'Carry proper lighting', 'Not all sections open to public'],
    thingsToDo: ['Cave exploration', 'Photography', 'Visit nearby Siju Bird Sanctuary'],
    nearbyAttractions: ['Siju Bird Sanctuary', 'Balpakram National Park', 'Simsang River'],
  },
  {
    name: 'Tura Peak',
    slug: 'tura-peak',
    description: 'Tura Peak is the highest point in the Garo Hills and offers breathtaking views of the surrounding landscape. The peak is located near the town of Tura and is surrounded by dense tropical forest.\n\nVisitors often hike to the summit to enjoy panoramic views of hills, forests, and distant valleys. The area is also known for its rich biodiversity and peaceful environment.',
    shortDescription: 'The highest point in the Garo Hills offering panoramic views of tropical forests and valleys.',
    region: 'Garo Hills',
    category: 'peak',
    bestTimeToVisit: 'October to March for clear views and pleasant weather.',
    howToReach: 'Near Tura town. A short trek leads to the summit.',
    travelTips: ['Start early for sunrise views', 'Moderate trek suitable for most fitness levels', 'Carry water'],
    thingsToDo: ['Summit trekking', 'Panoramic photography', 'Bird watching', 'Nature walks'],
    nearbyAttractions: ['Nokrek Biosphere Reserve', 'Rongbang Dare Falls', 'Nokrek Peak'],
  },
  {
    name: 'Nongjrong Sunrise Viewpoint',
    slug: 'nongjrong-sunrise-viewpoint',
    description: 'Nongjrong Sunrise Viewpoint is one of the most spectacular sunrise spots in Meghalaya. Located in the East Khasi Hills, the viewpoint overlooks a deep valley where clouds gather during early morning, creating the illusion of a vast ocean of clouds beneath the surrounding hills.\n\nAs the sun rises, golden light spreads across the landscape and gradually illuminates the forests and valleys below.',
    shortDescription: 'A spectacular sunrise viewpoint where clouds form an ocean below the Khasi Hills.',
    region: 'East Khasi Hills',
    category: 'viewpoint',
    bestTimeToVisit: 'November to February for the most dramatic sea-of-clouds sunrise.',
    howToReach: 'In the East Khasi Hills, requires early morning start from Shillong (about 2 hours).',
    travelTips: ['Arrive before dawn', 'Carry warm clothes — mornings are cold', 'Photography heaven at golden hour'],
    thingsToDo: ['Sunrise photography', 'Sea of clouds viewing', 'Village exploration'],
    nearbyAttractions: ['Laitlum Canyons', 'Mawphlang Sacred Forest', 'Shillong Peak'],
  },
  {
    name: 'Kynrem Falls',
    slug: 'kynrem-falls',
    description: 'Kynrem Falls is one of the tallest waterfalls in Meghalaya and is located within Thangkharang Park near Cherrapunji. The waterfall cascades down a steep cliff in three impressive tiers surrounded by lush greenery.\n\nDuring the monsoon season, the waterfall becomes extremely powerful as rainwater flows down the cliffs into the valley below.',
    shortDescription: 'A majestic three-tier waterfall within Thangkharang Park, one of the tallest in Meghalaya.',
    region: 'Cherrapunji & Sohra',
    category: 'waterfall',
    bestTimeToVisit: 'June to September for dramatic water flow.',
    howToReach: 'Within Thangkharang Park near Cherrapunji, accessible by road.',
    travelTips: ['Entry fee for Thangkharang Park', 'Combine with other Cherrapunji falls', 'Best during monsoon'],
    thingsToDo: ['Waterfall viewing from park', 'Valley panoramas', 'Photography'],
    nearbyAttractions: ['Nohkalikai Falls', 'Eco Park Sohra', 'Mawsmai Cave'],
  },
  {
    name: 'Langshiang Falls',
    slug: 'langshiang-falls',
    description: 'Langshiang Falls is one of the tallest waterfalls in India and is located near the town of Nongstoin in the West Khasi Hills. The waterfall plunges down a dramatic cliff into a deep valley surrounded by forested hills.\n\nBecause of its remote location, Langshiang Falls remains less crowded compared to other famous waterfalls in Meghalaya.',
    shortDescription: 'One of India\'s tallest waterfalls in the remote West Khasi Hills — uncrowded and majestic.',
    region: 'West Khasi Hills',
    category: 'waterfall',
    bestTimeToVisit: 'June to October for maximum water flow.',
    howToReach: 'Near Nongstoin, West Khasi Hills. About 3 hours from Shillong.',
    travelTips: ['Remote location — plan transport in advance', 'Less crowded alternative to Cherrapunji falls', 'Spectacular viewpoints'],
    thingsToDo: ['Waterfall viewing', 'Photography', 'Offbeat exploration'],
    nearbyAttractions: ['Nongkhnum Island', 'Mawthadraishan Peak', 'Wah Kaba Falls'],
  },
  {
    name: 'Mawryngkhang Bamboo Trail',
    slug: 'mawryngkhang-bamboo-trail',
    description: 'The Mawryngkhang Bamboo Trail is one of the most thrilling trekking experiences in Meghalaya. Located near Wahkhen village, the trail consists of narrow bamboo walkways built along steep cliffs. The trail leads hikers across suspension bridges and bamboo pathways overlooking deep valleys and rivers below.\n\nThe experience offers both adventure and spectacular scenery. For travelers seeking excitement and breathtaking views, the Mawryngkhang trail is one of the most unique adventures in the state.',
    shortDescription: 'A thrilling bamboo cliff trail with suspension bridges overlooking deep valleys.',
    region: 'East Khasi Hills',
    category: 'adventure',
    bestTimeToVisit: 'October to March for dry, safe trail conditions.',
    howToReach: 'Near Wahkhen village, about 2 hours from Shillong.',
    travelTips: ['Not for those with vertigo', 'Wear proper trekking shoes', 'Local guide essential', 'The bamboo sections can be slippery'],
    thingsToDo: ['Bamboo trail trekking', 'Cliff-edge walks', 'Suspension bridge crossing', 'Valley photography'],
    nearbyAttractions: ['Nongjrong Sunrise Viewpoint', 'Laitlum Canyons', 'Krang Suri Falls'],
  },
  {
    name: 'Jakrem Hot Springs',
    slug: 'jakrem-hot-springs',
    description: 'Jakrem Hot Springs is a natural geothermal spring located in the South West Khasi Hills district. The warm mineral-rich water is believed by locals to have therapeutic properties. Visitors come here to relax in the hot water pools while enjoying the surrounding natural environment.',
    shortDescription: 'Natural hot springs with therapeutic mineral-rich water in the Khasi Hills.',
    region: 'West Khasi Hills',
    category: 'adventure',
    bestTimeToVisit: 'October to March for the most comfortable experience.',
    howToReach: 'About 64 km from Shillong. Accessible by road.',
    travelTips: ['Bathing facilities available', 'Carry a change of clothes', 'The water is warm, not scalding'],
    thingsToDo: ['Hot spring bathing', 'Relaxation', 'Nature walks'],
    nearbyAttractions: ['Nongkhnum Island', 'Langshiang Falls', 'Mawthadraishan Peak'],
  },
  {
    name: 'Dawki Suspension Bridge',
    slug: 'dawki-suspension-bridge',
    description: 'The Dawki Suspension Bridge is an iconic landmark located above the crystal-clear Umngot River near the town of Dawki. Built during the British era, the bridge connects important routes leading to the India–Bangladesh border.\n\nFrom the bridge, visitors can enjoy breathtaking views of the transparent river below where boats appear to float in mid-air.',
    shortDescription: 'A British-era suspension bridge over the crystal-clear Umngot River — iconic photo spot.',
    region: 'Jaintia Hills',
    category: 'cultural',
    bestTimeToVisit: 'November to February for the clearest water views from the bridge.',
    howToReach: 'In Dawki town, near the India-Bangladesh border.',
    travelTips: ['Best photographed in winter when water is clear', 'Combine with boating on Umngot River', 'Quick visit — 30 minutes'],
    thingsToDo: ['Bridge photography', 'River viewing', 'Border area exploration'],
    nearbyAttractions: ['Dawki – Umngot River', 'Shnongpdeng Village', 'Mawlynnong Village'],
  },
  {
    name: 'Mawthadraishan Peak',
    slug: 'mawthadraishan-peak',
    description: 'Mawthadraishan Peak is one of the most spectacular viewpoints in the West Khasi Hills of Meghalaya. The peak offers breathtaking views of endless rolling hills and deep valleys often covered in thick clouds. During early mornings the landscape transforms into a magical "sea of clouds," creating a surreal atmosphere.',
    shortDescription: 'A West Khasi Hills viewpoint famous for its magical "sea of clouds" at sunrise.',
    region: 'West Khasi Hills',
    category: 'viewpoint',
    bestTimeToVisit: 'November to February for sea-of-clouds phenomenon.',
    howToReach: 'In the West Khasi Hills. Accessible by road + short walk.',
    travelTips: ['Arrive before dawn for the best views', 'Carry warm clothes', 'Limited facilities — carry snacks'],
    thingsToDo: ['Sunrise photography', 'Sea of clouds viewing', 'Mountain trekking'],
    nearbyAttractions: ['Langshiang Falls', 'Nongkhnum Island', 'Jakrem Hot Springs'],
  },
  {
    name: 'Nongriat Village',
    slug: 'nongriat-village',
    description: 'Nongriat Village is a remote village located deep within the rainforest valleys near Cherrapunji. The village is famous for its proximity to the Double Decker Living Root Bridge and several other natural attractions.\n\nReaching Nongriat requires descending thousands of stone steps through dense forest and crossing multiple suspension bridges. Despite its remote location, the village welcomes travelers with small guesthouses and homestays.',
    shortDescription: 'A remote rainforest village — gateway to the Double Decker Living Root Bridge.',
    region: 'Cherrapunji & Sohra',
    category: 'village',
    bestTimeToVisit: 'November to March for dry trekking weather.',
    howToReach: 'Trek from Tyrna village — 3,500+ steps down into the valley.',
    travelTips: ['Stay overnight for the full experience', 'The climb back up takes 2-3 hours', 'Book homestays in advance during peak season'],
    thingsToDo: ['Living Root Bridge visit', 'Rainbow Falls trek', 'Village walks', 'Swimming in rock pools'],
    nearbyAttractions: ['Double Decker Living Root Bridge', 'Rainbow Falls', 'Nohkalikai Falls'],
  },
  {
    name: 'Phe Phe Falls',
    slug: 'phe-phe-falls',
    description: 'Phe Phe Falls is one of Meghalaya\'s hidden waterfalls located in the Jaintia Hills. The waterfall flows through dense forest before plunging into a beautiful turquoise pool.\n\nReaching the falls requires a short trek through forest trails, making the destination popular among adventure travelers and explorers.',
    shortDescription: 'A hidden waterfall in the Jaintia Hills with a stunning turquoise pool amid dense forest.',
    region: 'Jaintia Hills',
    category: 'waterfall',
    bestTimeToVisit: 'October to March for swimmable conditions.',
    howToReach: 'In the Jaintia Hills, requires a short trek from the nearest road.',
    travelTips: ['Offbeat destination — limited visitors', 'Carry swimwear', 'Local guide recommended for the trail'],
    thingsToDo: ['Waterfall swimming', 'Forest trekking', 'Photography'],
    nearbyAttractions: ['Krang Suri Falls', 'Tyrshi Falls', 'Thadlaskein Lake'],
  },
  {
    name: 'Krem Liat Prah',
    slug: 'krem-liat-prah',
    description: 'Krem Liat Prah is the longest cave in India and one of the most remarkable cave systems in South Asia. Located in the Jaintia Hills, the cave contains enormous chambers and complex underground passages.\n\nThe cave features stunning limestone formations and underground rivers that have shaped the rock over millennia.',
    shortDescription: 'India\'s longest cave system with enormous chambers in the Jaintia Hills.',
    region: 'Jaintia Hills',
    category: 'cave',
    bestTimeToVisit: 'October to March for safe caving conditions.',
    howToReach: 'In the Jaintia Hills. Expert caving guides required.',
    travelTips: ['Only for experienced cavers', 'Proper caving equipment required', 'Arrange guides in advance'],
    thingsToDo: ['Expert caving', 'Underground river exploration', 'Geological study'],
    nearbyAttractions: ['Krang Suri Falls', 'Nartiang Monoliths', 'Umlawan Cave'],
  },
  {
    name: 'Wah Rilang Viewpoint',
    slug: 'wah-rilang-viewpoint',
    description: 'Wah Rilang Viewpoint is a hidden scenic destination located in the East Khasi Hills. The viewpoint offers panoramic views of deep valleys, forested hills, and winding rivers flowing through the landscape.\n\nVisitors often arrive early in the morning to witness mist rising from the valley as the sun slowly illuminates the surrounding hills.',
    shortDescription: 'A hidden viewpoint in the East Khasi Hills with misty valley panoramas at sunrise.',
    region: 'East Khasi Hills',
    category: 'viewpoint',
    bestTimeToVisit: 'November to March for sunrise mist views.',
    howToReach: 'In the East Khasi Hills. Local directions needed — offbeat destination.',
    travelTips: ['Arrive before sunrise', 'Offbeat — carry supplies', 'Combine with nearby village visits'],
    thingsToDo: ['Sunrise photography', 'Mist-covered valley views', 'Nature walks'],
    nearbyAttractions: ['Nongjrong Sunrise Viewpoint', 'Laitlum Canyons', 'Mawryngkhang Bamboo Trail'],
  },
  {
    name: 'Ranikor',
    slug: 'ranikor',
    description: 'Ranikor is a scenic river destination located in the South West Khasi Hills of Meghalaya. The area is known for its wide river valley surrounded by rolling green hills.\n\nThe calm river waters attract visitors who enjoy fishing, boating, and relaxing along the riverbanks.',
    shortDescription: 'A serene river valley in the South West Khasi Hills — perfect for fishing, boating, and riverside relaxation.',
    region: 'West Khasi Hills',
    category: 'river',
    bestTimeToVisit: 'October to March for calm river conditions.',
    howToReach: 'In the South West Khasi Hills, about 4 hours from Shillong.',
    travelTips: ['Very offbeat — plan transport', 'Great for fishing enthusiasts', 'Peaceful and uncrowded'],
    thingsToDo: ['River fishing', 'Boating', 'Riverside relaxation', 'Nature photography'],
    nearbyAttractions: ['Jakrem Hot Springs', 'Nongkhnum Island', 'Mawthadraishan Peak'],
  },
];

// Category helpers
export const getDestinationsByCategory = (category: MeghalayaDestination['category']) =>
  meghalayaDestinations.filter(d => d.category === category);

export const getDestinationsByRegion = (region: MeghalayaDestination['region']) =>
  meghalayaDestinations.filter(d => d.region === region);

export const getFeaturedDestinations = () =>
  meghalayaDestinations.filter(d => d.featured);

/**
 * SEO slug aliases → canonical destination slug.
 *
 * These keyword-rich URL variants (e.g. "umiam-lake-shillong",
 * "nohkalikai-falls-meghalaya", "*-guide") were advertised in
 * sitemap-destinations.xml but had no matching destination, so
 * /places-to-visit/<alias> rendered a redirect to the pillar (soft-404,
 * wasted crawl equity). Mapping them here makes every URL a LIVE 200 page;
 * DestinationDetail emits a cross-canonical to the primary slug so equity
 * consolidates onto one URL per place (no duplicate-content penalty).
 */
export const DESTINATION_SLUG_ALIASES: Readonly<Record<string, string>> = {
  'umiam-lake-shillong': 'umiam-lake',
  'nohkalikai-falls-meghalaya': 'nohkalikai-falls',
  'nohkalikai-falls-guide': 'nohkalikai-falls',
  'cherrapunji-guide': 'nohkalikai-falls',
  'krang-suri-falls-meghalaya': 'krang-suri-falls',
  'krang-suri-falls-guide': 'krang-suri-falls',
  'wei-sawdong-falls-meghalaya': 'wei-sawdong-falls',
  'wei-sawdong-falls-guide': 'wei-sawdong-falls',
  'mawlynnong-cleanest-village': 'mawlynnong-village',
  'mawlynnong-guide': 'mawlynnong-village',
  'kongthong-whistling-village': 'mawlynnong-village',
  'living-root-bridges-meghalaya': 'double-decker-living-root-bridge',
  'living-root-bridge-trek': 'double-decker-living-root-bridge',
  'dawki-river-boating': 'dawki-umngot-river',
  'dawki-guide': 'dawki-umngot-river',
  'laitlum-canyons-shillong': 'laitlum-canyons',
  'laitlum-canyons-guide': 'laitlum-canyons',
  'shnongpdeng-camping': 'shnongpdeng',
  'mawsmai-cave-cherrapunji': 'mawsmai-cave',
  'elephant-falls-shillong': 'elephant-falls',
  'elephant-falls-guide': 'elephant-falls',
  'shillong-peak-viewpoint': 'shillong-peak',
  'shillong-guide': 'shillong-peak',
  'rainbow-falls-guide': 'rainbow-falls',
};

export const getDestinationBySlug = (slug: string) => {
  const canonical = DESTINATION_SLUG_ALIASES[slug] ?? slug;
  return meghalayaDestinations.find(d => d.slug === canonical);
};

export interface DestinationCategory {
  slug: string;
  name: string;
  category: MeghalayaDestination['category'];
  description: string;
  /** Optional editorial deep-dive sections rendered below the card grid for depth/SEO. */
  seoContent?: { heading: string; body: string }[];
  /** Optional extra FAQs appended to the auto-generated category FAQs. */
  extraFaqs?: { q: string; a: string }[];
}

export const destinationCategories: DestinationCategory[] = [
  {
    slug: 'meghalaya-waterfalls',
    name: 'Waterfalls',
    category: 'waterfall' as const,
    description: 'Discover the most stunning waterfalls in Meghalaya — from India\'s tallest plunge waterfall to hidden turquoise pools in the rainforest.',
    seoContent: [
      {
        heading: 'Why Meghalaya has the best waterfalls in India',
        body: 'Meghalaya catches the full force of the Bay of Bengal monsoon, making it the wettest place on Earth — Mawsynram and Cherrapunji (Sohra) record over 11,000 mm of rain a year. All that water spills off the Khasi and Jaintia plateau in dramatic plunge waterfalls, including Nohkalikai Falls, India\'s tallest plunge waterfall at 340 metres. The result is a concentration of waterfalls unmatched anywhere else in the country, most of them within a two-hour drive of Shillong.',
      },
      {
        heading: 'The most famous waterfalls in Meghalaya',
        body: 'Nohkalikai Falls near Cherrapunji is the headline act, plunging into a turquoise pool framed by sheer cliffs. Seven Sisters Falls (Nohsngithiang) fans out across the Sohra escarpment after rain, while Elephant Falls just outside Shillong offers an easy three-tiered walk perfect for first-timers. In the Jaintia Hills, Krang Suri Falls is famous for its swimmable blue water, and Wei Sawdong\'s three-tiered pools are a photographer\'s favourite. Dainthlen and Kynrem Falls round out a classic Meghalaya waterfall circuit.',
      },
      {
        heading: 'Best time to visit Meghalaya waterfalls',
        body: 'For sheer power and mist-filled drama, visit during or just after the monsoon (June to September) when the falls are at full flow — but expect leeches, slippery trails and limited visibility on heavy-rain days. For swimmable pools, clear skies and safe trekking, plan your trip between October and March. Krang Suri and Wei Sawdong are best enjoyed in this drier window when the water runs clear and turquoise.',
      },
      {
        heading: 'How to plan a waterfall trip from Shillong',
        body: 'Shillong is the natural base — most major waterfalls are an easy day trip. Pair Elephant Falls with Shillong Peak, then dedicate a full day to the Cherrapunji circuit (Nohkalikai, Seven Sisters, Dainthlen) and another to the Jaintia Hills (Krang Suri, Wei Sawdong). XTSY Travellers Hostel offers dorms from ₹329/night plus curated Meghalaya tours that bundle transport and a local guide so you cover the best waterfalls without renting a car.',
      },
    ],
    extraFaqs: [
      {
        q: 'Which is the tallest waterfall in Meghalaya?',
        a: 'Nohkalikai Falls near Cherrapunji is the tallest in Meghalaya and the tallest plunge waterfall in India, dropping around 340 metres into a turquoise plunge pool.',
      },
      {
        q: 'Which Meghalaya waterfalls can you swim in?',
        a: 'Krang Suri Falls in the Jaintia Hills is the most popular swimming spot, with clear blue water and a managed entry. Wei Sawdong\'s lower pools are also swimmable in the dry season — always check local conditions first.',
      },
    ],
  },
  { slug: 'meghalaya-caves', name: 'Caves', category: 'cave' as const, description: 'Explore Meghalaya\'s underground world — the longest caves in India with ancient fossils and stunning limestone formations.' },
  { slug: 'meghalaya-villages', name: 'Villages', category: 'village' as const, description: 'Visit Asia\'s cleanest village, remote root bridge communities, and traditional Khasi and Garo settlements.' },
  { slug: 'meghalaya-viewpoints', name: 'Viewpoints', category: 'viewpoint' as const, description: 'Stand above the clouds at Meghalaya\'s most spectacular viewpoints — canyons, peaks, and sunrise spots.' },
];

