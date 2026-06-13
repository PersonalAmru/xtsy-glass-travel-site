// Destination Pages — 80+ detailed pages for Meghalaya destinations
// Each page has 800-1500 words of unique travel content

import type { SEOPageData } from './seoPages';

const dest = (
  slug: string, title: string, metaDesc: string, h1: string, intro: string,
  sections: { heading: string; content: string; listItems?: string[] }[],
  faqs: { question: string; answer: string }[],
  related: string[], keywords: string[],
  schema: 'TouristAttraction' | 'TravelGuide' | 'TouristTrip' = 'TouristAttraction'
): SEOPageData => ({
  slug, category: 'destinations', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: schema, relatedSlugs: related, ctaText: 'Book Your Trip', ctaLink: '/tours', keywords,
});

export const DESTINATION_PAGES: SEOPageData[] = [
  // === WATERFALLS ===
  dest('nohkalikai-falls-meghalaya',
    'Nohkalikai Falls — India\'s Tallest Waterfall Guide 2026',
    'Visit Nohkalikai Falls, India\'s tallest plunge waterfall at 1,115 ft. Location, timings, how to reach from Shillong, photography tips.',
    'Nohkalikai Falls — India\'s Tallest Plunge Waterfall',
    'Standing at 1,115 feet (340 meters), Nohkalikai Falls is India\'s tallest plunge waterfall and one of Meghalaya\'s most awe-inspiring natural wonders. Located near Cherrapunji (Sohra), this majestic cascade plunges into a turquoise-green pool that changes color with the seasons. The falls are named after a tragic Khasi legend of a woman named Ka Likai, making it both a natural and cultural landmark.',
    [
      { heading: 'How to Visit Nohkalikai Falls', content: 'The waterfall viewpoint is easily accessible by road, located 7 km from Cherrapunji town and 61 km from Shillong. A paved path from the parking area leads to two viewpoints — the upper viewpoint offers a panoramic view of the full cascade, while the lower viewpoint brings you closer to the cliff edge for photography.', listItems: ['Distance from Shillong: 61 km (2 hours by car)', 'Distance from Cherrapunji town: 7 km (15 minutes)', 'Entry fee: ₹30 per person', 'Parking: Available, ₹20 for cars', 'Best viewing time: Morning (8-10 AM) for clear views and best light', 'Time needed: 45-60 minutes at the viewpoint'] },
      { heading: 'Best Time to Visit', content: 'Nohkalikai is spectacular in every season but transforms dramatically. During monsoon (June-September), the waterfall is at full power — a thundering white column that you can hear from kilometers away. However, clouds often obscure the view. Post-monsoon (October-December) offers the best combination of good water flow, clear skies, and the iconic turquoise pool. Winter and spring (January-April) show reduced flow but the clearest visibility of the pool\'s stunning color.' },
      { heading: 'Photography Tips', content: 'Nohkalikai is one of India\'s most photogenic waterfalls. Here\'s how to capture the best shots:', listItems: ['Morning light (7-9 AM) provides the most dramatic shadows and colors', 'Bring a wide-angle lens — the falls and surrounding cliffs are massive', 'Carry a polarizing filter to reduce haze and enhance the turquoise pool color', 'In monsoon, wait for cloud breaks — when they clear, the reveal is dramatic', 'The lower viewpoint offers the most dramatic perspectives', 'Drone photography is possible but check local regulations'] },
      { heading: 'The Legend of Ka Likai', content: 'The waterfall\'s name comes from a haunting Khasi legend. Ka Likai was a woman who, upon discovering a terrible truth about her second husband\'s actions, threw herself off this cliff in grief. The Khasi people named the falls "Noh Ka Likai" (The Leap of Ka Likai) in her memory. This story reflects the deep connection between Khasi culture and their landscape — nearly every waterfall, cave, and peak in Meghalaya has an associated legend.' },
      { heading: 'Nearby Attractions', content: 'Combine your Nohkalikai visit with other Cherrapunji attractions, all within 15 km:', listItems: ['Mawsmai Cave — 5 km away, easy walkthrough limestone cave', 'Seven Sisters Falls viewpoint — 7 km, visible from Eco Park', 'Eco Park — 4 km, gardens with Bangladesh plains views', 'Thangkharang Park — 8 km, Kynrem Falls viewpoint', 'Double Decker Root Bridge — 12 km to trailhead at Tyrna'] },
    ],
    [
      { question: 'Can you swim in the pool below Nohkalikai Falls?', answer: 'No, the pool is not accessible from the viewpoint. Reaching it requires a very difficult and dangerous descent with no maintained trail. The viewpoint offers excellent views from above.' },
      { question: 'Is Nohkalikai Falls worth visiting?', answer: 'Absolutely. As India\'s tallest plunge waterfall with its iconic turquoise pool, it\'s one of the country\'s most spectacular natural sights. The viewpoint is easily accessible and requires no trekking.' },
    ],
    ['waterfalls-in-meghalaya', 'cherrapunji-travel-guide', 'meghalaya-travel-guide'],
    ['nohkalikai falls', 'tallest waterfall india', 'nohkalikai falls meghalaya', 'nohkalikai falls cherrapunji']
  ),

  dest('krang-suri-falls-meghalaya',
    'Krang Suri Falls — Meghalaya\'s Most Beautiful Swimming Hole',
    'Visit Krang Suri Falls in Jaintia Hills. Turquoise swimming pool, how to reach, entry fee, best time to visit. Complete guide.',
    'Krang Suri Falls — Meghalaya\'s Most Beautiful Waterfall',
    'Krang Suri Falls in Jaintia Hills is arguably Meghalaya\'s most photogenic waterfall, featuring a stunning turquoise swimming pool surrounded by limestone cliffs. Unlike many Meghalaya waterfalls that are view-only, Krang Suri invites you to swim in its crystal-clear waters — an unforgettable experience that\'s become a must-do for every Meghalaya visitor.',
    [
      { heading: 'How to Visit Krang Suri', content: 'Krang Suri is located near Amlarem in Jaintia Hills, about 3 hours from Shillong. The last 1 km from the parking area to the falls requires a descent down stone and bamboo steps (about 20 minutes each way).', listItems: ['Distance from Shillong: 100 km (3 hours by car)', 'Distance from Jowai: 35 km (1 hour)', 'Entry fee: ₹50 per person, ₹20 for camera', 'Descend: 20-minute walk down stone steps to the pool', 'Best months: November-April for clearest turquoise water', 'Monsoon warning: Water turns brownish and swimming can be dangerous'] },
      { heading: 'Swimming at Krang Suri', content: 'The main attraction is the turquoise swimming pool at the base of the falls. The water is cold (15-18°C) but clean and refreshing. Life jackets are available for rent at ₹100. The pool depth varies from shallow edges to deep center (8-10 feet). Changing rooms are available near the parking area. The pool behind the waterfall curtain is a magical experience — you can swim behind the falling water for stunning views and photos.' },
      { heading: 'Photography Tips', content: 'Krang Suri is incredibly photogenic with its turquoise water against white limestone and green vegetation. Visit on sunny days (10 AM - 2 PM) when sunlight hits the pool for the most vivid turquoise color. Bring a waterproof camera or GoPro for swimming photos. The area behind the waterfall offers dramatic selfie opportunities.' },
      { heading: 'Nearby Attractions', content: 'Combine Krang Suri with other Jaintia Hills attractions:', listItems: ['Phe Phe Falls — Another hidden gem, 2-hour trek', 'Thadlaskein Lake — Serene lake with Jaintia legend', 'Jowai town — Local market, Jaintia culture', 'Nartiang Monoliths — Ancient megalithic site, tallest monolith in India', 'Syndai Cave — Limestone cave near Jowai'] },
    ],
    [
      { question: 'Is swimming allowed at Krang Suri Falls?', answer: 'Yes! Swimming is allowed and encouraged. Life jackets are available for rent. The pool is safe during non-monsoon months (October-May).' },
      { question: 'When is the water clearest at Krang Suri?', answer: 'The turquoise color is most vivid from December to April when sediment levels are lowest. Avoid June-September when monsoon rains make the water brown.' },
    ],
    ['waterfalls-in-meghalaya', 'places-to-visit-meghalaya', 'meghalaya-travel-guide'],
    ['krang suri falls', 'krang suri meghalaya', 'krang suri waterfall jaintia hills', 'best waterfall meghalaya swimming']
  ),

  dest('wei-sawdong-falls-meghalaya',
    'Wei Sawdong Falls — Meghalaya\'s Hidden Three-Tiered Gem',
    'Discover Wei Sawdong Falls near Cherrapunji. Three-tiered waterfall, trek details, best time to visit. One of Meghalaya\'s most beautiful.',
    'Wei Sawdong Falls — Three-Tiered Hidden Gem',
    'Wei Sawdong Falls is one of Meghalaya\'s best-kept secrets — a stunning three-tiered waterfall near Cherrapunji that requires a moderate 45-minute trek to reach. Unlike the easily accessible Nohkalikai or Elephant Falls, Wei Sawdong rewards those willing to make the effort with an uncrowded, pristine waterfall experience that many travelers rank as their favorite in Meghalaya.',
    [
      { heading: 'The Trek to Wei Sawdong', content: 'The trek begins from a small village near Laitkynsew on the Cherrapunji-Shillong road. A local guide (₹300-500) leads you down stone steps and forest paths for approximately 45 minutes to the first tier. The path is moderately steep but well-trodden.', listItems: ['Trek duration: 45 minutes down, 1 hour up', 'Difficulty: Moderate (steep stone steps, some slippery sections)', 'Guide: ₹300-500 (strongly recommended, trail can be confusing)', 'Best time: October-March for best views and safest trekking', 'What to carry: Water, snacks, good shoes, camera', 'Time at falls: Plan 1-2 hours to explore all three tiers'] },
      { heading: 'The Three Tiers', content: 'Each tier of Wei Sawdong offers a different perspective and experience. The first (top) tier is the widest with a broad curtain of water falling into a shallow pool. The second tier is the tallest and most photographed, with the classic plunge into a deep green pool. The third (lowest) tier requires careful navigation but offers the most intimate waterfall experience with fewer visitors.' },
      { heading: 'Why Wei Sawdong is Special', content: 'What makes Wei Sawdong exceptional is the combination of beauty and solitude. While Nohkalikai and Seven Sisters attract bus-loads of tourists, Wei Sawdong receives only a handful of visitors daily. The three-tiered structure means multiple vantage points, and the surrounding forest creates a cathedral-like atmosphere that amplifies the sound of falling water.' },
    ],
    [
      { question: 'Is Wei Sawdong Falls difficult to reach?', answer: 'The 45-minute trek is moderate — manageable for most fit adults. The path involves stone steps that can be slippery in rain. A local guide is recommended.' },
      { question: 'How does Wei Sawdong compare to Nohkalikai?', answer: 'Nohkalikai is taller and more easily accessible (viewpoint by road). Wei Sawdong requires trekking but offers a more intimate, uncrowded experience with three distinct tiers to explore.' },
    ],
    ['waterfalls-in-meghalaya', 'cherrapunji-travel-guide', 'trekking-in-meghalaya'],
    ['wei sawdong falls', 'wei sawdong waterfall meghalaya', 'hidden waterfall cherrapunji', 'three tier waterfall meghalaya']
  ),

  // === VILLAGES & CULTURAL ===
  dest('mawlynnong-cleanest-village',
    'Mawlynnong — Asia\'s Cleanest Village Guide 2026',
    'Visit Mawlynnong, Asia\'s cleanest village. Living root bridge, sky platform, how to reach from Shillong. Complete visitor guide.',
    'Mawlynnong — Asia\'s Cleanest Village',
    'Mawlynnong earned the title of "Asia\'s Cleanest Village" in 2003 from Discover India magazine, and it has maintained that distinction through a remarkable community-driven cleanliness initiative. This small Khasi village near the Bangladesh border offers visitors a glimpse of sustainable living, a living root bridge, and a bamboo sky platform with views across the border.',
    [
      { heading: 'What to See in Mawlynnong', content: 'Despite its small size, Mawlynnong offers several attractions that justify the 2.5-hour drive from Shillong:', listItems: ['The Village Walk — Spotless paths, bamboo dustbins, flower gardens in every yard', 'Living Root Bridge — A single-decker root bridge just outside the village, 10-min walk', 'Bamboo Sky Platform — Tall bamboo viewing platform with Bangladesh plains visible on clear days', 'Balancing Rock — Natural geological formation where a large rock balances on a smaller one', 'Church — The village is predominantly Christian, the church is a community gathering point', 'Community Hall — Learn about the self-governance and cleanliness management system'] },
      { heading: 'How to Visit Mawlynnong', content: 'Mawlynnong is 90 km from Shillong (2.5 hours). Most visitors combine it with Dawki (17 km away) in a single day trip. The Dawki-Mawlynnong combo is the most popular day trip from Shillong.', listItems: ['Distance from Shillong: 90 km (2.5 hours)', 'Distance from Dawki: 17 km (30 minutes)', 'Entry fee: ₹50 per person', 'Best time: October-April for clear weather', 'Combo trip: Dawki boating + Mawlynnong in one day is ideal', 'Time needed: 1.5-2 hours to explore the village'] },
      { heading: 'The Cleanliness Story', content: 'Mawlynnong\'s cleanliness isn\'t a government initiative — it\'s a community tradition rooted in Khasi culture. Every household takes responsibility for cleaning their surroundings, and a community "cleaning day" is observed weekly. Bamboo dustbins are placed throughout the village, and organic waste is composted. The system works because it\'s culturally embedded, not externally imposed. It offers a powerful lesson in community-driven sustainability that has attracted global attention.' },
    ],
    [
      { question: 'Is Mawlynnong worth visiting?', answer: 'Yes, especially combined with Dawki. The village offers a unique cultural experience — seeing a community that genuinely lives sustainably. The living root bridge and sky platform add natural attractions.' },
      { question: 'How long should I spend in Mawlynnong?', answer: '1.5-2 hours is sufficient to walk through the village, see the root bridge, and climb the sky platform. Most visitors combine it with a Dawki trip.' },
    ],
    ['places-to-visit-meghalaya', 'dawki-umngot-river-guide', 'meghalaya-travel-guide'],
    ['mawlynnong village', 'cleanest village asia', 'mawlynnong meghalaya', 'asia cleanest village india']
  ),

  dest('living-root-bridges-meghalaya',
    'Living Root Bridges — Meghalaya\'s Natural Engineering Marvels',
    'Guide to Living Root Bridges in Meghalaya. Double Decker Bridge trek, locations, how they\'re made. UNESCO nomination details.',
    'Living Root Bridges of Meghalaya — A Complete Guide',
    'Meghalaya\'s living root bridges (Jingkieng Jri in Khasi) are perhaps the most extraordinary human-nature collaboration on Earth. Created by the Khasi people over generations, these bridges are grown from the aerial roots of rubber fig trees (Ficus elastica), trained across rivers and gorges using betel nut tree trunks as scaffolding. The most famous — the Double Decker Root Bridge in Nongriat — attracts trekkers from around the world.',
    [
      { heading: 'How Living Root Bridges Are Made', content: 'The process of creating a living root bridge takes 15-30 years. Khasi villagers identify suitable Ficus elastica trees on either side of a stream, then guide their aerial roots across the gap using hollowed betel nut trunks as channels. As roots reach the opposite bank, they\'re planted into the soil. Over decades, the roots thicken, intertwine, and strengthen — eventually forming bridges capable of supporting 50+ people. Unlike man-made bridges, these structures actually grow stronger with age.' },
      { heading: 'Famous Root Bridges to Visit', content: 'Meghalaya has over 100 known living root bridges, but only a handful are easily accessible:', listItems: ['Double Decker Root Bridge (Nongriat) — The most famous, 6-8 hour trek, 3,500 steps', 'Single Root Bridge (Mawlynnong) — 10-minute walk from the village, easy access', 'Ritymmen Root Bridge — Near Mawlynnong, combines with Double Decker for multi-day trek', 'Umshiang Root Bridge — Located near Mawlynnong, lesser known but beautiful', 'Nongbareh Root Bridge — Remote location in East Khasi Hills, adventurous access'] },
      { heading: 'UNESCO Nomination', content: 'The living root bridges of Meghalaya are on India\'s tentative list for UNESCO World Heritage Sites. The nomination recognizes them as outstanding examples of human interaction with the natural environment — a living cultural landscape that continues to evolve. A successful inscription would bring global recognition and protection to these fragile bio-cultural heritage sites.' },
      { heading: 'Visiting the Double Decker Root Bridge', content: 'The trek to Nongriat village\'s Double Decker Root Bridge is Meghalaya\'s most iconic adventure. Starting from Tyrna village (12 km from Cherrapunji), you descend approximately 3,500 concrete and stone steps through subtropical forest to reach the valley floor. The Double Decker is a two-level root bridge spanning a stream, with a natural swimming pool nearby.', listItems: ['Start point: Tyrna village, 12 km from Cherrapunji', 'Descent: 3,500 steps (1.5-2 hours down)', 'Ascent: 3,500 steps (2.5-3 hours up)', 'Total time: 6-8 hours round trip', 'Cost: Free entry, guide ₹500-1,000 (recommended)', 'Best season: October-April for dry conditions', 'Overnight option: Basic stays in Nongriat ₹300-500/night'] },
    ],
    [
      { question: 'How old are the living root bridges?', answer: 'The oldest bridges are estimated to be 150-500 years old. The Double Decker Root Bridge in Nongriat is believed to be about 180 years old.' },
      { question: 'Can you walk on living root bridges?', answer: 'Yes! The bridges are fully functional and used daily by local villagers. They can support 50+ people at a time. However, be respectful — these are living organisms and community infrastructure.' },
      { question: 'Do I need to trek to see a root bridge?', answer: 'Not necessarily. The single root bridge near Mawlynnong village is accessible via a short 10-minute walk. The famous Double Decker Bridge requires a 6-8 hour trek.' },
    ],
    ['trekking-in-meghalaya', 'places-to-visit-meghalaya', 'cherrapunji-travel-guide', 'meghalaya-travel-guide'],
    ['living root bridges meghalaya', 'double decker root bridge', 'root bridge trek', 'meghalaya root bridge', 'nongriat root bridge']
  ),

  dest('dawki-river-boating',
    'Dawki River Boating 2026 — Prices, Timings & Tips',
    'Complete guide to Dawki river boating on crystal-clear Umngot River. Prices, best time, photography tips for floating boat effect.',
    'Dawki River Boating — Crystal Clear Experience',
    'Boating on the crystal-clear Umngot River at Dawki has become one of India\'s most bucket-list travel experiences. The water is so transparent that boats appear to float in mid-air — creating the viral "floating boat" photographs that have made Dawki famous worldwide.',
    [
      { heading: 'Boating Details', content: 'Local Jaintia fishermen operate wooden boats on the Umngot River near Dawki bridge. The experience is simple but magical — you glide over transparent water while the riverbed is clearly visible below.', listItems: ['Boat capacity: 4-5 persons per boat', 'Duration: 30-45 minutes (upstream and back)', 'Cost: ₹600-1,200 per boat (not per person)', 'Operating hours: 7 AM - 4 PM daily', 'Life jackets: Available on request', 'Best time of day: Morning (8-10 AM) for best light and clarity'] },
      { heading: 'When to Visit for Best Water Clarity', content: 'The Umngot\'s famous clarity depends entirely on the season. November to March offers the clearest water with maximum transparency — this is when the "floating boat" effect is most dramatic. During monsoon (June-September), rain carries sediment that reduces visibility significantly and boats may not operate during heavy rainfall. April-May is a good shoulder season with reasonable clarity.' },
      { heading: 'Photography Guide', content: 'To capture the famous floating boat effect:', listItems: ['Shoot from the bridge above — this gives the best angle to show water clarity', 'Morning light (8-10 AM) provides the most striking shadow patterns on the riverbed', 'Use a polarizing filter to cut surface reflections and enhance underwater visibility', 'In the boat, shoot straight down to show the riverbed below', 'Video works even better than photos for the floating effect'] },
    ],
    [
      { question: 'How much does Dawki boating cost?', answer: 'A boat ride costs ₹600-1,200 per boat (shared by 4-5 people). During peak season, prices may be slightly higher.' },
      { question: 'Is Dawki boating safe?', answer: 'Yes, the river is calm and shallow in the boating area. Life jackets are available. Boats are operated by experienced local fishermen. During heavy monsoon, boating may be suspended for safety.' },
    ],
    ['dawki-umngot-river-guide', 'places-to-visit-meghalaya', 'meghalaya-travel-guide'],
    ['dawki boating', 'dawki river boating price', 'umngot river boating', 'dawki floating boat', 'crystal river india boating']
  ),

  dest('laitlum-canyons-shillong',
    'Laitlum Canyons — Shillong\'s Most Dramatic Viewpoint',
    'Visit Laitlum Canyons near Shillong. Stunning cliff-edge views, easy trek, sunset photography spot. How to reach & tips.',
    'Laitlum Canyons — "End of the Hills"',
    'Laitlum Canyons, meaning "End of the Hills" in Khasi, offers one of the most dramatic viewpoints in all of Northeast India. Located just 23 km from Shillong, this cliff-edge viewpoint reveals a vast valley stretching to the horizon, with terraced farming on the slopes and wisps of cloud drifting through the canyon. It\'s easily accessible, free to visit, and particularly stunning at sunset.',
    [
      { heading: 'What to Expect at Laitlum', content: 'The viewpoint is perched on the edge of the Khasi Plateau, where the hills suddenly give way to a deep canyon. On clear days, the panoramic views extend for miles across rolling hills and valleys. The landscape changes dramatically with seasons — lush green in monsoon, golden in autumn, and misty in winter.', listItems: ['Distance from Shillong: 23 km (45 minutes by car)', 'Entry fee: Free', 'Best time: Late afternoon for sunset (3:30-5:30 PM)', 'Trek: Gentle walk from parking area, some steps descending to viewpoints', 'Duration: 1-2 hours for casual exploration', 'Safety: Stay on marked paths — cliff edges are steep and unguarded'] },
      { heading: 'The Trek Down', content: 'From the main viewpoint, a trail descends into the canyon through the village of Rasong. The trek is moderate — about 1 hour down and 1.5 hours back up. It passes through Khasi farmland with views of terraced rice paddies and traditional houses. Few tourists go beyond the main viewpoint, so the trek offers solitude and authentic village encounters.' },
      { heading: 'Photography Tips', content: 'Laitlum is one of Shillong\'s most photogenic locations. Golden hour (4-5:30 PM) bathes the canyon in warm light. Fog and cloud layers in the morning create ethereal landscapes. Bring a wide-angle lens to capture the sweeping panorama, and a telephoto for the village details in the valley below.' },
    ],
    [
      { question: 'Is Laitlum Canyons safe to visit?', answer: 'Yes, but exercise caution near cliff edges — there are no guardrails. Stay on marked paths, especially in wet or misty conditions. Not recommended for young children without close supervision.' },
      { question: 'When is the best time to visit Laitlum?', answer: 'Late afternoon for sunset views. October-December for the clearest conditions. Monsoon for the lushest green but frequent cloud cover.' },
    ],
    ['shillong-travel-guide', 'places-to-visit-meghalaya', 'things-to-do-meghalaya'],
    ['laitlum canyons', 'laitlum canyon shillong', 'laitlum viewpoint', 'best viewpoint shillong', 'end of the hills meghalaya']
  ),

  dest('mawphlang-sacred-forest',
    'Mawphlang Sacred Forest — Ancient Protected Grove Guide',
    'Explore Mawphlang Sacred Forest, a 78-hectare ancient grove protected by Khasi beliefs. Guided walks, orchids, history. Near Shillong.',
    'Mawphlang Sacred Forest — An Ancient Living Heritage',
    'The Sacred Forest of Mawphlang is a 78-hectare pristine grove that has been protected for centuries by Khasi religious beliefs. Located 25 km from Shillong, this ancient forest is a living museum of biodiversity — home to rare orchids, medicinal plants, and centuries-old trees that have been untouched because the Khasi people believe that removing anything from the forest invites misfortune.',
    [
      { heading: 'Visiting the Sacred Forest', content: 'The forest can only be entered with a local guide from the Mawphlang village. Guided walks last about 1.5-2 hours and follow a circuit through the grove, with the guide explaining the ecological and cultural significance of the forest.', listItems: ['Distance from Shillong: 25 km (45 minutes by car)', 'Entry fee: ₹100 per person (includes guide)', 'Duration: 1.5-2 hour guided walk', 'Terrain: Mostly flat forest paths, some uneven ground', 'Best time: Morning for birding, any time for forest experience', 'Rules: Nothing may be removed — no leaves, stones, flowers, or even fallen branches'] },
      { heading: 'What Makes It Sacred', content: 'The Khasi people believe the forest is protected by the spirit "U Ryngkew U Basa," and anyone who takes anything from within — even a pebble — will face misfortune. This belief system has created one of the most effective conservation models in the world. The forest has been untouched for centuries while surrounding areas were deforested. Researchers have found over 450 species of plants, numerous orchids, and ancient trees up to 1,000 years old within the grove.' },
      { heading: 'Biodiversity Highlights', content: 'The sacred forest is a biodiversity hotspot:', listItems: ['Ancient trees: Oaks and rudraksha trees estimated at 500-1,000 years old', 'Orchids: Over 100 species, many endemic to the Khasi Hills', 'Medicinal plants: Used in traditional Khasi medicine for centuries', 'Mushrooms: Diverse fungi species, including edible varieties', 'Birds: 100+ species including rare and endemic varieties', 'Monoliths: Ancient stone structures within the forest from pre-Christian Khasi religion'] },
    ],
    [
      { question: 'Can I visit Mawphlang Sacred Forest without a guide?', answer: 'No, the forest can only be entered with an authorized local guide. Guides are available at the forest entrance and are included in the ₹100 entry fee.' },
      { question: 'Is photography allowed?', answer: 'Yes, photography is allowed inside the forest. However, nothing may be physically removed — not even fallen leaves or stones.' },
    ],
    ['shillong-travel-guide', 'trekking-in-meghalaya', 'things-to-do-meghalaya'],
    ['mawphlang sacred forest', 'sacred grove shillong', 'mawphlang meghalaya', 'ancient forest meghalaya']
  ),

  dest('shnongpdeng-camping',
    'Shnongpdeng Camping Guide 2026 — River Adventures & Stays',
    'Complete guide to Shnongpdeng camping. Riverside tents, kayaking, cliff jumping, how to reach. Meghalaya\'s adventure hub.',
    'Shnongpdeng Camping — Meghalaya\'s Adventure Hub',
    'Shnongpdeng, a small village on the banks of the crystal-clear Umngot River, has become Meghalaya\'s premier adventure camping destination. With riverside tent camps, cliff jumping spots, kayaking, and zip-lining, it offers an adrenaline-packed alternative to the typical Dawki day trip.',
    [
      { heading: 'Camping Options', content: 'Several operators offer riverside camping in Shnongpdeng with varying comfort levels:', listItems: ['Basic tent: ₹800-1,200/person (tent + dinner + breakfast)', 'Deluxe tent: ₹1,500-2,500/person (better amenities, riverside location)', 'Riverside cottage: ₹3,000-5,000/room (permanent structure, attached bathroom)', 'Camping season: October-May (closed during heavy monsoon)', 'Booking: WhatsApp-based, advance booking recommended during peak season'] },
      { heading: 'Adventure Activities', content: 'Shnongpdeng is Meghalaya\'s adventure sports center:', listItems: ['Kayaking: 1-2 hours on crystal-clear Umngot, ₹1,500-3,000/person', 'Cliff jumping: 5-15 meter jumps into deep river pools, free (at your own risk)', 'Snorkeling: Crystal-clear visibility, equipment rental ₹500-800', 'Zip-lining: Across the river gorge, ₹500-800/person', 'Boating: Peaceful rides on the transparent water, ₹500-800/boat', 'Night fishing: With local guides, seasonal activity'] },
      { heading: 'How to Reach', content: 'Shnongpdeng is 80 km from Shillong (3 hours) and 15 km from Dawki (30 minutes). Most visitors combine it with a Dawki visit. The road from Dawki to Shnongpdeng follows the river and is scenic but narrow.', listItems: ['From Shillong: 80 km, 3 hours by car', 'From Dawki: 15 km, 30 minutes', 'Best approach: Stay overnight on the Dawki trip instead of rushing back', 'XTSY organizes Dawki + Shnongpdeng overnight packages'] },
    ],
    [
      { question: 'Is Shnongpdeng safe for camping?', answer: 'Yes, the camping areas are well-established and operated by local villagers. The river has designated swimming/jumping zones. However, exercise standard water safety precautions.' },
      { question: 'Can I visit Shnongpdeng as a day trip?', answer: 'Yes, but staying overnight is recommended. The campfire evenings, stargazing, and early morning kayaking make the overnight experience special.' },
    ],
    ['dawki-umngot-river-guide', 'meghalaya-backpacking-guide', 'things-to-do-meghalaya'],
    ['shnongpdeng camping', 'shnongpdeng meghalaya', 'camping near dawki', 'adventure camping meghalaya', 'cliff jumping meghalaya']
  ),

  dest('kongthong-whistling-village',
    'Kongthong — The Whistling Village of Meghalaya',
    'Visit Kongthong, the whistling village where each person has a musical name. Location, how to reach, cultural significance explained.',
    'Kongthong — The Whistling Village',
    'Kongthong is one of Meghalaya\'s most unique cultural destinations — a Khasi village where each person receives a unique musical tune (called "Jingrwai Lawbei") as their name at birth. Mothers compose a special melody for each child, and villagers call each other by whistling or humming these tunes. This extraordinary tradition has earned Kongthong the name "The Whistling Village."',
    [
      { heading: 'The Jingrwai Lawbei Tradition', content: 'In Kongthong, every child receives two names: a regular name for official use and a unique melody — the Jingrwai Lawbei (Song of the Mother) — composed by their mother. These tunes are used in daily life, especially while calling someone across the village or in the forests. No two tunes are the same, and each melody dies with its owner. The tradition is believed to protect villagers from evil spirits who might use their real names. It\'s a living example of intangible cultural heritage found nowhere else on Earth.' },
      { heading: 'How to Visit', content: 'Kongthong is 65 km from Shillong (2.5 hours), located in the East Khasi Hills. The village has basic tourism infrastructure with a community-run homestay program.', listItems: ['Distance from Shillong: 65 km (2.5 hours by car)', 'Entry fee: Community contribution of ₹50-100', 'Duration: 2-3 hours for village walk and cultural interaction', 'Homestay: Available for overnight stays, ₹500-800/person with meals', 'Best approach: Hire a local guide through the village committee', 'Respectful tourism: Always ask before recording or photographing'] },
      { heading: 'What to Experience', content: 'Beyond the whistling tradition, Kongthong offers a window into authentic Khasi village life:', listItems: ['Listen to the Jingrwai Lawbei tunes from villagers', 'Walk through the village surrounded by areca nut and broom grass fields', 'Learn about traditional Khasi governance and matrilineal culture', 'Try local Khasi food prepared by village families', 'See traditional Khasi architecture and bamboo craftsmanship', 'Visit the community church and school'] },
    ],
    [
      { question: 'Can I hear the whistling tunes in Kongthong?', answer: 'Yes! Villagers are happy to demonstrate their unique tunes for respectful visitors. The village committee organizes cultural interaction sessions.' },
      { question: 'Is Kongthong accessible by road?', answer: 'Yes, the village is connected by road from Shillong (2.5 hours). The last stretch is a narrow village road. A sturdy vehicle is recommended.' },
    ],
    ['places-to-visit-meghalaya', 'things-to-do-meghalaya', 'meghalaya-travel-guide'],
    ['kongthong whistling village', 'whistling village meghalaya', 'kongthong meghalaya', 'jingrwai lawbei', 'unique village india']
  ),

  // === LAKES & VIEWPOINTS ===
  dest('umiam-lake-shillong',
    'Umiam Lake (Barapani) — Shillong\'s Scenic Reservoir Guide',
    'Visit Umiam Lake near Shillong. Boating, water sports, photography spots, restaurants. Complete guide with timings and costs.',
    'Umiam Lake — Scenic Gateway to Shillong',
    'Umiam Lake, locally known as Barapani, is a stunning man-made reservoir located 15 km north of Shillong on the Guwahati-Shillong highway. Created in 1965 by damming the Umiam River, the lake is surrounded by pine-covered hills and serves as the scenic gateway to Shillong — every visitor from Guwahati passes its shores.',
    [
      { heading: 'Things to Do at Umiam Lake', content: 'The lake offers a mix of relaxation and adventure activities:', listItems: ['Pedal boating: ₹100-200 for 30 minutes, family-friendly', 'Kayaking: ₹300-500 for single kayak session', 'Speed boat rides: ₹500-800 for a quick lap around the lake', 'Photography: Sunrise and sunset create stunning reflections', 'Orchid Lake Resort: Dining with lake views', 'Cycling: Ride around the lake perimeter road (8 km circuit)'] },
      { heading: 'Best Time to Visit', content: 'Umiam Lake is beautiful year-round but peaks during different seasons. October-February offers the clearest water and best reflections. Monsoon months fill the lake to capacity with dramatic cloud formations. The lake is often the first photo-stop for visitors arriving from Guwahati.' },
      { heading: 'How to Reach', content: 'Umiam Lake is on the NH6 highway between Guwahati and Shillong. Every Guwahati-Shillong taxi passes the lake viewpoint. Dedicated visits from Shillong take 15 km (30 minutes by car) to the main viewpoint and boating area.' },
    ],
    [
      { question: 'Is swimming allowed in Umiam Lake?', answer: 'Swimming is generally not allowed in the main lake area for safety reasons. Water sports are conducted with safety equipment and supervision.' },
      { question: 'Is Umiam Lake worth a dedicated visit?', answer: 'If you\'re passing by (Guwahati-Shillong route), definitely stop for photos. For a dedicated trip from Shillong, combine it with Laitlum Canyons or Nongkrem village for a half-day outing.' },
    ],
    ['shillong-travel-guide', 'places-to-visit-meghalaya'],
    ['umiam lake', 'barapani lake shillong', 'umiam lake boating', 'lake near shillong']
  ),

  // === CAVES ===
  dest('mawsmai-cave-cherrapunji',
    'Mawsmai Cave — Cherrapunji\'s Easy Limestone Cave Walk',
    'Visit Mawsmai Cave in Cherrapunji. Easy 150m walkthrough, limestone formations, entry fee ₹20. Perfect for families.',
    'Mawsmai Cave — A Walk Through Ancient Limestone',
    'Mawsmai Cave in Cherrapunji is Meghalaya\'s most accessible cave, offering a 150-meter illuminated walkthrough that reveals millions of years of geological history. Unlike Meghalaya\'s extreme adventure caves, Mawsmai is suitable for families and casual visitors — you can walk through in 20-30 minutes and marvel at stalactites, stalagmites, and narrow passages carved by water over millennia.',
    [
      { heading: 'What to Expect Inside', content: 'The cave features a well-lit walkway through natural limestone passages. Some sections are narrow enough to require ducking or turning sideways, which adds to the adventure. The formations are dramatically lit, creating an otherworldly atmosphere. The exit leads to a viewpoint overlooking the valley.', listItems: ['Length: ~150 meters walkthrough', 'Time: 20-30 minutes to explore', 'Entry fee: ₹20 per person', 'Difficulty: Easy — no climbing or crawling, just walking', 'Some narrow sections — not suitable for very large individuals', 'Wear shoes with grip — the floor can be wet and slippery', 'Photography allowed — flash recommended for formations'] },
      { heading: 'Geology of Mawsmai Cave', content: 'The cave is formed in limestone deposited approximately 100-200 million years ago when this region was under a shallow sea. Water seeping through cracks over millions of years dissolved the rock, creating the passages. The stalactites (hanging formations) and stalagmites (floor formations) continue to grow at approximately 1mm per century. Fossil imprints of ancient marine life can be spotted in the cave walls by observant visitors.' },
    ],
    [
      { question: 'Is Mawsmai Cave safe for children?', answer: 'Yes, children can safely explore the cave with supervision. The path is lit and maintained. Some narrow passages require ducking but are not dangerous.' },
      { question: 'How long does Mawsmai Cave take?', answer: '20-30 minutes for a comfortable walkthrough. Including the viewpoint at the exit, plan for 45 minutes total.' },
    ],
    ['cherrapunji-travel-guide', 'places-to-visit-meghalaya', 'things-to-do-meghalaya'],
    ['mawsmai cave', 'mawsmai cave cherrapunji', 'caves in meghalaya', 'limestone cave meghalaya']
  ),

  dest('elephant-falls-shillong',
    'Elephant Falls — Shillong\'s Most Accessible Waterfall',
    'Visit Elephant Falls, a three-tiered waterfall just 12 km from Shillong. Easy access, well-maintained. Entry fee, timings & tips.',
    'Elephant Falls — Shillong\'s Three-Tiered Waterfall',
    'Elephant Falls, located just 12 km from Shillong city center, is the most easily accessible waterfall in the region. Named by the British for a rock formation that once resembled an elephant (destroyed in the 1897 earthquake), this three-tiered cascade is surrounded by tropical forest and is a perfect short excursion from Shillong.',
    [
      { heading: 'Visiting Elephant Falls', content: 'The falls are reached via well-maintained stairs from the parking area. Each tier has viewing platforms. The path is concrete and safe even in wet conditions.', listItems: ['Distance from Shillong: 12 km (25 minutes by car)', 'Entry fee: ₹20 per person, ₹20 camera fee', 'Opening hours: 8 AM - 5 PM daily', 'Time needed: 30-45 minutes', 'Accessibility: Concrete stairs throughout, some steep sections', 'Facilities: Restrooms, small shops at the entrance'] },
      { heading: 'The Three Tiers', content: 'The first tier is a wide, gentle cascade visible from the viewing platform at the top. The second tier is partially hidden and can be glimpsed from between the trees. The third and most impressive tier is a tall, powerful cascade falling into a moss-covered pool. The mist from the third tier keeps the surrounding area cool and lush even in summer.' },
    ],
    [
      { question: 'Is Elephant Falls worth visiting?', answer: 'Yes, especially for a quick outing from Shillong. While not as dramatic as Nohkalikai or Krang Suri, its easy accessibility and beautiful setting make it a pleasant 30-minute stop.' },
    ],
    ['shillong-travel-guide', 'waterfalls-in-meghalaya', 'places-to-visit-meghalaya'],
    ['elephant falls shillong', 'elephant falls meghalaya', 'waterfall near shillong', 'three tier waterfall shillong']
  ),

  dest('shillong-peak-viewpoint',
    'Shillong Peak — Highest Point & 360° Panoramic Views',
    'Visit Shillong Peak at 1,965m. 360° panoramic views, sunrise photography, Indian Air Force station. How to reach & timings.',
    'Shillong Peak — The City\'s Highest Point',
    'At 1,965 meters (6,449 feet), Shillong Peak is the highest point in the city and offers unparalleled 360-degree panoramic views of the Khasi Hills. On clear days, you can see the plains of Bangladesh stretching to the horizon. The peak houses an Indian Air Force radar station, adding a unique military element to the visit.',
    [
      { heading: 'Visiting Shillong Peak', content: 'The peak is accessible by road, with a parking area near the summit. The last stretch is a short walk up stone steps to the viewpoint.', listItems: ['Distance from Shillong center: 10 km (20 minutes by car)', 'Entry fee: ₹30 per person, camera ₹20', 'Opening hours: 8 AM - 4:30 PM (hours may vary)', 'Best time: Sunrise (arrive by 5:30 AM), or clear afternoons', 'Time needed: 30-45 minutes', 'Note: IAF may restrict access occasionally for security reasons'] },
      { heading: 'Sunrise at Shillong Peak', content: 'Sunrise from Shillong Peak is a magical experience. The sun rises over the eastern hills, gradually illuminating the valleys and villages below. On clear mornings, the golden light on the hills with cloud-filled valleys creates one of Northeast India\'s most photographable scenes. Arrive by 5:30 AM for the best light.' },
    ],
    [
      { question: 'Is Shillong Peak always open?', answer: 'The peak is generally open daily 8 AM - 4:30 PM. However, the Indian Air Force may occasionally restrict access for security reasons. Check locally before planning a visit.' },
    ],
    ['shillong-travel-guide', 'places-to-visit-meghalaya'],
    ['shillong peak', 'shillong peak viewpoint', 'highest point shillong', 'shillong peak sunrise']
  ),
];
