import { Link } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IMG } from '@/data/v2Images';

export const adventureGuides = {
  'adventure-tours-northeast-india': {
    title: 'Adventure tours in Northeast India', image: IMG.assam,
    lead: 'Start from Guwahati for road journeys into Meghalaya, Arunachal Pradesh and Nagaland. The right route depends on your time, the season and permit eligibility — not just the distance on a map.',
    sections: [
      ['Choose a circuit', 'For a first trip, base in Shillong and allow 3–4 days for Dawki, Mawlynnong and Cherrapunji. Tawang is a separate high-altitude journey from Guwahati via Bhalukpong, Bomdila and Dirang; allow at least 5–6 days round trip. Kohima via Dimapur takes 3–4 days round trip, with a possible Dzukou Valley trekking day.'],
      ['When to go', 'October to April is a practical window for the Meghalaya river circuit and clearer roads. Tawang is better planned for April–June or mid-September–October. Rain and landslides can disrupt hill roads in summer; snow can close high passes in winter. Check local conditions before departure.'],
      ['Permits and preparation', 'Meghalaya does not require an Inner Line Permit. Indian visitors to Arunachal Pradesh and Nagaland should arrange the relevant ILP; international visitors must check current entry requirements, including protected-area or registration rules. Carry valid ID, vehicle documents and weather protection.'],
      ['Match the journey to your available days', 'With four days, choose one Meghalaya circuit rather than adding another state. With a week, a slower Meghalaya journey allows a trekking day, river day and weather buffer. Treat Tawang as its own trip: mountain driving, acclimatisation and possible closures make a rushed multi-state itinerary unreliable. Arrival and departure transfers need time of their own.'],
      ['What to include in your quote', 'Share your dates, group size, arrival point and preferred activities. Ask for transport type, driving days, accommodation, meals, guides, permits, entry fees and activity charges to be itemised. Check cancellation terms and the alternative plan for unsafe weather. A regional itinerary is not a promise that every activity will operate.'],
    ],
    faqs: [
      ['Where should a Northeast adventure trip start?', 'Guwahati is a practical arrival point for onward travel to Shillong. Check flight times against the onward road transfer, and avoid planning a demanding activity on arrival day.'],
      ['Can we combine Meghalaya and Tawang in one short trip?', 'Not comfortably in four or five days. Choose one circuit or allow substantially more time for long transfers, permits and altitude adjustment.'],
    ],
    links: [['Meghalaya adventure tour', '/meghalaya-adventure-tour'], ['Motorbike expedition guide', '/motorbike-expedition-northeast-india'], ['4x4 Meghalaya circuit', '/4x4-expedition-meghalaya']],
  },
  'meghalaya-adventure-tour': {
    title: 'Meghalaya adventure tour', image: IMG.rootBridge,
    lead: 'Build a Shillong-based trip around the Nongriat root-bridge trek, Sohra waterfalls and the Umngot river at Dawki. These are different kinds of days: plan the walking and driving separately.',
    sections: [
      ['A practical 4-day outline', 'Day 1: arrive in Shillong via Guwahati and visit Umiam Lake. Day 2: drive to Sohra for Nohkalikai Falls and Mawsmai Cave. Day 3: reserve a full day for the steep Nongriat descent and climb back; do not combine it with Dawki. Day 4: visit Mawlynnong and the Umngot river near Dawki before returning to Shillong or staying at the Dawki campsite.'],
      ['Pick activities to suit conditions', 'The Nongriat path has thousands of steps and calls for good footwear and an early start. River activities at Shnongpdeng are subject to operator safety checks and water conditions. During the monsoon, waterfalls are at their fullest but trails may be slippery and Dawki water may not be clear.'],
      ['Access and costs', 'Shillong is the main base, reached by road from Guwahati. Meghalaya has no ILP for visitors, but local entry fees and activity charges vary. Ask for a current trip quote rather than assuming transport, guide, meals or river activities are included.'],
      ['Allow a recovery and weather buffer', 'For a less rushed five-day trip, stay in Sohra before the Nongriat trek and keep the following morning easy. Confirm local accommodation before descending if staying overnight in Nongriat. Carry water, light rain protection and footwear with grip; the return climb can be much harder than the descent. Choose shorter walks if the steps are unsuitable for your group.'],
      ['River-day safety', 'Confirm the meeting point with the Shnongpdeng operator, because Dawki and Shnongpdeng are not interchangeable pickup locations. Ask about life jackets, guide supervision and the conditions for cancellation. Do not enter a swollen river or assume that photographs of clear winter water represent monsoon conditions. Keep a dry change of clothes and protect electronics.'],
    ],
    faqs: [
      ['Can Nongriat and Dawki be visited on the same day?', 'Keep them on separate days. The Nongriat walk needs an early start and a demanding return climb; adding a long road transfer makes the schedule unnecessarily tiring.'],
      ['Are river activities included in a Meghalaya tour?', 'Only when your written quote lists them. Check operator availability, equipment, supervision and weather-dependent cancellation terms before paying.'],
    ],
    links: [['Meghalaya packages', '/meghalaya-tour-packages'], ['Adventure activities', '/things-to-do-in-meghalaya'], ['Dawki campsite', '/xtsy-adventure-campsite-dawki']],
  },
  'motorbike-expedition-northeast-india': {
    title: 'Motorbike expedition in Northeast India', image: IMG.bumla,
    lead: 'Compare a gentle Meghalaya loop with longer rides to Tawang and Kohima. Daily distances are only one part of the plan: permits, altitude, fuel and daylight matter as much as the map.',
    sections: [
      ['Start with Meghalaya', 'The roughly 350 km Shillong–Dawki–Mawlynnong–Sohra loop works over 3–4 days. Roads are generally surfaced, with narrow village sections and blind bends on the Dawki descent. No ILP is required within Meghalaya.'],
      ['Ride to Tawang', 'From Guwahati, the route via Bhalukpong, Bomdila and Dirang covers roughly 520 km one way. Split the ascent to acclimatise before Sela Pass. Indian riders need an Arunachal ILP; foreign visitors must check protected-area requirements. Bumla needs separate local permission and is weather-dependent.'],
      ['Kohima and riding essentials', 'The approximately 340 km Guwahati–Dimapur–Kohima route includes a slow hill climb after Dimapur. Arrange Nagaland entry requirements ahead of time. Bring licence, registration, insurance, protective gear and wet-weather layers; plan fuel and avoid unfamiliar mountain roads after dark.'],
      ['A manageable Meghalaya riding itinerary', 'Day 1: Shillong to Dawki or Shnongpdeng, with time for the downhill sections. Day 2: continue via Mawlynnong toward Sohra, checking your actual road route rather than assuming a straight-line connection. Day 3: local Sohra stops and return to Shillong. Add a fourth day if trekking to Nongriat; leave the bike securely parked at the trail access and walk.'],
      ['Rental and breakdown checklist', 'Before accepting a rental, check tyres, brakes, lights, chain, documents, deposit terms and damage liability. Confirm whether the provider permits travel to each state and offers roadside recovery. Share your route with someone, carry offline maps and a charged phone, and agree on fuel stops before remote legs. A support vehicle or mechanic is included only if stated in the quote.'],
    ],
    faqs: [
      ['Should I rent a bike or bring my own?', 'Compare the rental terms, luggage capacity and recovery support against the cost of transporting your own bike. In either case, use a roadworthy bike you can confidently manage on hill roads.'],
      ['How many kilometres should we ride each day?', 'Plan by daylight and road conditions, not a fixed highway target. Hairpins, rain, roadworks and photo stops can make a short hill leg take most of the day.'],
    ],
    links: [['Meghalaya motorbike route', '/expeditions/motorbike/meghalaya-loop'], ['Tawang motorbike route', '/expeditions/motorbike/guwahati-to-tawang'], ['Kohima motorbike route', '/expeditions/motorbike/guwahati-to-kohima']],
  },
  '4x4-expedition-meghalaya': {
    title: '4x4 expedition in Meghalaya', image: IMG.dawki,
    lead: 'A 3–4 day driving circuit from Shillong connects Dawki, Mawlynnong and Sohra. A high-clearance vehicle is useful for rougher approaches, but most main roads do not require four-wheel drive.',
    sections: [
      ['The loop', 'Leave Shillong for Dawki and the Umngot river, continue through Mawlynnong and the Riwai root bridge, then travel toward Sohra for Nohkalikai and Seven Sisters Falls. Return via Shillong. The circuit is roughly 350 km before local detours.'],
      ['Road and trail reality', 'Shillong–Dawki–Sohra roads are mainly paved, but village lanes narrow and the Dawki descent has steep blind hairpins. Nongriat’s double-decker root bridge is reached on foot, not by driving a 4x4 to the bridge. Some waterfall approach tracks need clearance or a local driver.'],
      ['Season and entry', 'October–April usually brings clearer water at Dawki; late monsoon can make waterfalls dramatic while roads and trails remain slippery. No ILP is needed in Meghalaya. Carry ID near the border and allow for local entry fees and changing weather.'],
      ['A four-day driving outline', 'Day 1: arrive in Shillong and check the vehicle before departure. Day 2: travel toward Dawki or Shnongpdeng and stay locally if river activities are planned. Day 3: visit Mawlynnong and continue toward Sohra, allowing time for narrow roads. Day 4: choose accessible Sohra viewpoints before returning to Shillong. Add another day for Nongriat rather than fitting its trek into the return drive.'],
      ['Vehicle preparation and responsible access', 'Check tyres, spare wheel, brakes, ground clearance and roadside-assistance coverage. Ask the driver or rental provider which roads are permitted. Four-wheel drive is not permission to enter private land, protected areas or unapproved trails; obtain local consent and use recognised access roads. Do not attempt flooded crossings or treat a recovery kit as protection against fast water.'],
    ],
    faqs: [
      ['Do the main Meghalaya roads require a 4x4?', 'Most of this circuit is on paved roads. High clearance can help on damaged approaches, but local conditions and careful driving matter more than having four-wheel drive.'],
      ['Can a 4x4 reach the double-decker root bridge?', 'No. The Nongriat bridge is reached on foot by a stepped trail. Plan secure parking, a full walking day and suitable fitness rather than an off-road vehicle approach.'],
    ],
    links: [['Full 4x4 route details', '/expeditions/4x4/meghalaya-loop'], ['Meghalaya adventure tour', '/meghalaya-adventure-tour'], ['Explore Dawki', '/destinations/meghalaya/dawki']],
  },
} as const;

export type AdventureGuideKey = keyof typeof adventureGuides;

export default function AdventureLanding({ guide }: { guide: AdventureGuideKey }) {
  const content = adventureGuides[guide];
  return <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main className="pt-20 pb-20">
      <div className="relative h-64 sm:h-96 overflow-hidden">
        <img src={content.image} alt={content.title} className="h-full w-full object-cover" />
      </div>
      <div className="container mx-auto max-w-4xl px-4 pt-10">
        <Link to="/expeditions" className="text-sm text-primary underline">All expeditions</Link>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">{content.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{content.lead}</p>
        <div className="mt-12 space-y-10">{content.sections.map(([heading, body]) => <section key={heading}>
          <h2 className="text-2xl font-semibold">{heading}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
        </section>)}</div>
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">Before you travel</h2>
          <div className="mt-5 space-y-6">{content.faqs.map(([question, answer]) => <div key={question}>
            <h3 className="text-lg font-semibold">{question}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{answer}</p>
          </div>)}</div>
        </section>
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">Plan the next leg</h2>
          <nav className="mt-5 grid gap-3 sm:grid-cols-2">{content.links.map(([label, href]) => <Link key={href} to={href} className="border border-border p-4 text-primary underline hover:bg-muted">{label}</Link>)}</nav>
        </section>
        <p className="mt-10 text-sm text-muted-foreground">Routes, permits and availability can change. Confirm details before travelling.</p>
      </div>
    </main>
    <Footer />
  </div>;
}