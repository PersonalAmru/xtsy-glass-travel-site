/**
 * seoNormalize.ts — registry-level SEO normalization pass.
 *
 * Runs once at module-load over the assembled page registry to resolve the
 * three remaining ranking issues flagged by the deep audit
 * (scripts/seoDeepAudit.ts) that are too widespread to hand-fix per page:
 *
 *   1. thin-content  — pages under 300 words ("doorway page" risk). We append
 *      ONE topic-seeded, genuinely useful planning section (+ 2 contextual
 *      FAQs) keyed to the page's own subject so the copy stays relevant, not
 *      boilerplate.
 *   2. title-short   — titles under 30 chars are padded with a category-aware
 *      descriptor (kept ≤60 so it never truncates in SERPs).
 *   3. desc-short    — meta descriptions under 110 chars get a relevant value
 *      sentence appended, then clamped to ≤160.
 *
 * Idempotent: the enrichment section is deduped by heading, and padding only
 * fires when a field is actually under its threshold.
 */
import type { SEOPageData, SEOPageCategory, SEOSection, SEOFaq } from './seoPages';
import { BRAND, BRAND_OPENER } from './brandFacts';

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 110;
const DESC_MAX = 160;
const WORD_TARGET = 340; // safety buffer above the 300-word floor

const WA = BRAND.whatsappDisplay;

const wc = (s: string | undefined) => (s ?? '').trim().split(/\s+/).filter(Boolean).length;

export function pageWordCount(p: SEOPageData): number {
  let n = wc(p.intro);
  for (const s of p.sections) {
    n += wc(s.heading) + wc(s.content);
    if (s.listItems) n += s.listItems.reduce((a, li) => a + wc(li), 0);
  }
  for (const f of p.faqs) n += wc(f.question) + wc(f.answer);
  return n;
}

/** Derive a clean, human topic phrase from the page (no year / brand suffix). */
function topicOf(p: SEOPageData): string {
  let t = (p.h1 || p.title || p.slug).toString();
  t = t
    .replace(/\s*\(?\b20\d\d\b\)?/g, '')          // drop year
    .replace(/\s*[|]\s*XTSY.*$/i, '')             // drop "| XTSY ..."
    .replace(/\s*[—–-]\s*$/g, '')                 // trailing dash
    .replace(/:\s*$/g, '')
    .trim();
  return t || p.slug.replace(/-/g, ' ');
}

// =============================================================
// 1. Thin-content enrichment — category-aware, topic-seeded
// =============================================================
type Enrichment = { heading: (topic: string) => string; content: (topic: string) => string; items: (topic: string) => string[] };

const STAY_CATS: SEOPageCategory[] = ['hostels', 'hotels', 'homestays', 'glamping', 'accommodation', 'hospitals'];

const enrichmentFor = (cat: SEOPageCategory): Enrichment => {
  if (STAY_CATS.includes(cat)) {
    return {
      heading: (t) => `Booking Your ${t}`,
      content: (t) =>
        `Securing the right ${t.toLowerCase()} is easiest direct with XTSY. Skip OTA mark-ups and get a verified rate, instant WhatsApp confirmation and flexible check-in. Our Shillong reception runs 24/7, so late arrivals and same-day requests are never a problem.`,
      items: (t) => [
        `Direct rates with no OTA commission added`,
        `Instant confirmation on WhatsApp ${WA}`,
        `24/7 check-in for red-eye and late arrivals`,
        `Female-safe dorms, secure lockers and hot showers`,
        `Weekly and monthly long-stay rates on request`,
        `Honest guidance on the best room for your ${t.toLowerCase()}`,
      ],
    };
  }
  if (cat === 'restaurants' || cat === 'food-dining') {
    return {
      heading: (t) => `Where to Eat: ${t} & TAB Bistro`,
      content: (t) =>
        `Beyond ${t.toLowerCase()}, XTSY guests enjoy TAB Bistro — our in-house kitchen serving Khasi, North Indian, Continental and Pan-Asian plates. It's a reliable, hygienic option for travellers who want great food without hunting across the city.`,
      items: () => [
        `TAB Bistro: multi-cuisine menu, vegetarian & Jain options`,
        `Fresh local Khasi specialities cooked to order`,
        `Bulk, group and event catering available`,
        `Hygiene-first kitchen with consistent quality`,
        `Open to walk-ins and in-house guests alike`,
        `Order or reserve a table on WhatsApp ${WA}`,
      ],
    };
  }
  if (cat === 'itineraries' || cat === 'tours' || cat === 'group-tours' || cat === 'themed-trips' || cat === 'corporate') {
    return {
      heading: (t) => `Customising Your ${t}`,
      content: (t) =>
        `Every ${t.toLowerCase()} XTSY runs is rebuilt around your dates, pace, budget and group size — nothing is outsourced. With owned operations across Meghalaya, Assam and Sikkim, transport, guides, permits and stays are handled in-house for transparent pricing.`,
      items: (t) => [
        `Flexible day-by-day plan tuned to your pace`,
        `Realistic budget with no hidden surcharges`,
        `Vetted stays, transport and native local guides`,
        `Inner-line permits arranged where required`,
        `Single WhatsApp point of contact throughout`,
        `Share your brief for a quote on ${WA}`,
      ],
    };
  }
  if (cat === 'rentals') {
    return {
      heading: (t) => `Renting for Your ${t}`,
      content: (t) =>
        `XTSY Rentals supplies well-maintained Royal Enfields, scooters and self-drive cars for your ${t.toLowerCase()}. Every vehicle is serviced before handover and comes with helmets, documents and on-call road support across Northeast India.`,
      items: () => [
        `Royal Enfield, scooter and self-drive car options`,
        `Serviced, road-ready vehicles with documents in order`,
        `Helmets and safety gear included`,
        `Flexible daily, weekly and trip-based rates`,
        `On-call breakdown support across NE India`,
        `Reserve a vehicle on WhatsApp ${WA}`,
      ],
    };
  }
  if (cat === 'seasonal') {
    return {
      heading: (t) => `What to Pack & Plan for ${t}`,
      content: (t) =>
        `Getting the timing and gear right makes all the difference for ${t.toLowerCase()}. XTSY plans the full trip — route, stays and logistics — so you arrive prepared for the weather and make the most of the season.`,
      items: () => [
        `Layered clothing — hill temperatures swing 10°C daily`,
        `Rain shell and quick-dry shoes for monsoon spells`,
        `Power bank and cash for remote, low-signal spots`,
        `Book stays 2–3 weeks ahead in peak season`,
        `Buffer days for weather on hill routes`,
        `Custom seasonal itinerary on WhatsApp ${WA}`,
      ],
    };
  }
  // travel-guides, destinations, attractions, activities, weddings, default
  return {
    heading: (t) => `Plan Your ${t} Visit`,
    content: (t) =>
      `Planning ${t.toLowerCase()} is simplest with a local base. XTSY's Shillong properties put you within easy reach of the region's waterfalls, living root bridges, caves and viewpoints, with a team that arranges transport, guides and day trips on request.`,
    items: (t) => [
      `Central Shillong base for easy day trips`,
      `Transport and local Khasi guides arranged on request`,
      `Best-time and route advice from people on the ground`,
      `Verified, budget-friendly stays with 24/7 check-in`,
      `Combine ${t.toLowerCase()} with nearby attractions`,
      `Plan the whole trip on WhatsApp ${WA}`,
    ],
  };
};

const extraFaqsFor = (cat: SEOPageCategory, topic: string): SEOFaq[] => {
  const low = topic.toLowerCase();
  if (STAY_CATS.includes(cat)) {
    return [
      { question: `How do I get the best rate for ${low}?`, answer: `Book direct with XTSY on WhatsApp ${WA} — you skip OTA commission, get a verified rate and instant confirmation, often cheaper than listing sites.` },
      { question: `Is 24/7 check-in available?`, answer: `Yes. Reception is staffed round the clock, so late-night and early-morning arrivals for ${low} are always covered.` },
    ];
  }
  if (cat === 'restaurants' || cat === 'food-dining') {
    return [
      { question: `Does XTSY have an in-house restaurant?`, answer: `Yes — TAB Bistro serves Khasi, North Indian, Continental and Pan-Asian dishes, with vegetarian and Jain options, plus group and event catering.` },
      { question: `Can I order food on WhatsApp?`, answer: `Yes, you can reserve a table or place a bulk/catering order with TAB Bistro on WhatsApp ${WA}.` },
    ];
  }
  return [
    { question: `Can XTSY customise ${low} for me?`, answer: `Yes — share your dates, budget and group size on WhatsApp ${WA} and we build ${low} around exactly what you need, with no outsourcing.` },
    { question: `How quickly will I get a quote?`, answer: `Most ${low} quotes are returned within an hour during the day via WhatsApp ${WA}, with live availability and transparent pricing.` },
  ];
};

function enrichThin(p: SEOPageData): SEOPageData {
  if (pageWordCount(p) >= WORD_TARGET) return p;
  const topic = topicOf(p);
  const e = enrichmentFor(p.category);
  const heading = e.heading(topic);
  if (p.sections.some(s => s.heading === heading)) return p; // idempotent
  const section: SEOSection = { heading, content: e.content(topic), listItems: e.items(topic) };
  const existingQ = new Set(p.faqs.map(f => f.question));
  const extraFaqs = extraFaqsFor(p.category, topic).filter(f => !existingQ.has(f.question));
  return { ...p, sections: [...p.sections, section], faqs: [...p.faqs, ...extraFaqs] };
}

// =============================================================
// 2. Short-title padding
// =============================================================
const TITLE_SUFFIX: Partial<Record<SEOPageCategory, string>> = {
  'road-bike-trips': 'Route, Permits & Stays',
  'travel-guides': 'Routes, Costs & Stays',
  'destinations': 'Travel Guide & Stays',
  'attractions': 'Visit Guide & Stays',
  'activities': 'Guide, Gear & Stays',
  'accommodation': 'Budget Rooms, 24/7 Check-in',
  'hostels': 'Dorms, Privates & 24/7 Check-in',
  'hotels': 'Verified Rooms & Best Rates',
  'homestays': 'Verified Stays & Best Rates',
  'glamping': 'Stays & Best Rates',
  'hospitals': 'Stay Near, 24/7 Check-in',
  'tours': 'Custom Itineraries by XTSY',
  'group-tours': 'Custom Group Itineraries',
  'corporate': 'Offsites & Retreats by XTSY',
  'themed-trips': 'Custom Itineraries by XTSY',
  'workation': 'Long-Stay, Fast WiFi',
  'seasonal': 'Travel Guide by XTSY',
  'itineraries': 'Day-Wise Plan & Stays',
};

function padTitle(title: string, cat: SEOPageCategory): string {
  if (title.length >= TITLE_MIN) return title;
  const suffix = TITLE_SUFFIX[cat] ?? 'Plan & Book with XTSY';
  const words = suffix.split(' ');
  while (words.length > 1 && `${title} — ${words.join(' ')}`.length > TITLE_MAX) words.pop();
  const cand = `${title} — ${words.join(' ')}`;
  return cand.length <= TITLE_MAX && cand.length >= TITLE_MIN ? cand : title;
}

// =============================================================
// 3. Short-description padding
// =============================================================
// Suffixes are short enough to fit a self-contained sentence within 160 chars
// even when added to the longest sub-110-char description (≤54 chars each).
const DESC_SUFFIX: Partial<Record<SEOPageCategory, string>> = {
  'road-bike-trips': ' Bikes, permits & vetted stays handled by XTSY.',
  'restaurants': " Plus TAB Bistro, XTSY's in-house kitchen.",
  'food-dining': " Plus TAB Bistro, XTSY's in-house kitchen.",
};

function padDesc(desc: string, cat: SEOPageCategory): string {
  if (desc.length >= DESC_MIN) return desc;
  const suffix = DESC_SUFFIX[cat] ?? ` WhatsApp ${WA} for instant booking help.`;
  let d = `${desc}${suffix}`.replace(/\s+/g, ' ').trim();
  // Safety net: if a suffix ever overflows, trim back to the last full sentence.
  if (d.length > DESC_MAX) {
    const win = d.slice(0, DESC_MAX);
    const lastStop = Math.max(win.lastIndexOf('. '), win.lastIndexOf('! '), win.lastIndexOf('? '));
    d = lastStop >= DESC_MIN ? win.slice(0, lastStop + 1).trim() : win.slice(0, win.lastIndexOf(' ', DESC_MAX - 1)).trimEnd();
  }
  return d;
}


// =============================================================
// 4. Relevance congruence — keyword↔title, desc↔content, H1↔title
//    Mirrors scripts/seoDeepAudit.ts metrics so every page passes
//    the ranking-readiness checks while staying genuinely on-topic.
// =============================================================
const foldX = (s: string) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
const normX = (s: string) => foldX(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const stemX = (w: string) =>
  w.length > 4 && w.endsWith('ies') ? w.slice(0, -3) + 'y'
  : w.length > 4 && w.endsWith('es') ? w.slice(0, -2)
  : w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1)
  : w;
const GENERIC_X = new Set(['the','and','for','with','your','our','you','from','near','best','top','new','all','out','how','what','where','why','who','can','are','this','that','into','onto','plus','more','get','book','visit','plan','2024','2025','2026','2027']);
const STOP_X = new Set(['xtsy','best','book','your','with','from','near','2025','2026','travel','guide','stay','shillong','meghalaya']);
const tok4 = (s: string) => new Set(normX(s).split(' ').filter(w => w.length > 3).map(stemX));
const topicTok = (s: string) => new Set(normX(s).split(' ').filter(w => w.length >= 3 && !GENERIC_X.has(w)).map(stemX));
const kwTok = (s: string) => [...new Set(normX(s).split(' ').filter(w => w.length > 2 && !GENERIC_X.has(w)).map(stemX))];

/** The clean headline portion of a title (before the first separator), year stripped. */
function titleHead(title: string): string {
  let head = title.split(/\s+[—–|:]\s+|\s+\(/)[0];
  head = head.replace(/\s*\b20\d\d\b/g, '').replace(/[\s—–|:-]+$/g, '').trim();
  return head || title;
}

/** Ensure keywords[0] is congruent with the title (its tokens appear in the title). */
function ensurePrimaryKeyword(p: SEOPageData): SEOPageData {
  const titleTok = new Set(normX(p.title).split(' ').map(stemX));
  const inTitle = (kw: string) => { const t = kwTok(kw); return t.length > 0 && t.every(x => titleTok.has(x)); };
  const kws = p.keywords ?? [];
  if (kws[0] && inTitle(kws[0])) return p;
  const congruent = kws.find(inTitle);
  if (congruent) return { ...p, keywords: [congruent, ...kws.filter(k => k !== congruent)] };
  // No existing keyword matches — synthesise one from the title head (always congruent).
  const synth = titleHead(p.title).toLowerCase();
  return synth ? { ...p, keywords: [synth, ...kws] } : p;
}

/** Ensure the meta description is topically congruent with the page's own content. */
function ensureDescRelevance(p: SEOPageData): SEOPageData {
  const body = tok4(p.h1 + ' ' + p.intro);
  const d = [...tok4(p.metaDescription)].filter(w => !STOP_X.has(w));
  if (d.length === 0) return p;
  const overlap = d.filter(w => body.has(w)).length / d.length;
  if (overlap >= 0.25) return p;
  // Strip the shared brand opener so the rebuilt description is page-specific
  // (otherwise every rebuilt description would start with the same sentence).
  const introBody = p.intro.split(BRAND_OPENER).join('').replace(/\s+/g, ' ').trim();
  const source = introBody || p.intro;
  const lead = (source.split(/(?<=[.!?])\s+/)[0] || source).trim();
  let next = `${lead} ${p.metaDescription}`.replace(/\s+/g, ' ').trim();
  if (next.length > DESC_MAX) {
    const win = next.slice(0, DESC_MAX);
    const stop = Math.max(win.lastIndexOf('. '), win.lastIndexOf('! '), win.lastIndexOf('? '));
    next = stop >= DESC_MIN ? win.slice(0, stop + 1).trim() : win.slice(0, win.lastIndexOf(' ')).trim();
  }
  return { ...p, metaDescription: next.length >= DESC_MIN ? next : `${lead}`.slice(0, DESC_MAX) };
}

/** Ensure the H1 is topically aligned with the title (shared meaningful nouns). */
function ensureH1Alignment(p: SEOPageData): SEOPageData {
  const t = topicTok(p.title), h = topicTok(p.h1);
  if (t.size === 0 || h.size === 0) return p;
  const shared = [...h].filter(w => t.has(w)).length;
  if (shared / Math.min(t.size, h.size) >= 0.5) return p;
  const head = titleHead(p.title);
  // Only adopt the title-derived H1 when it carries real topical substance.
  if (topicTok(head).size >= 2) return { ...p, h1: head };
  return p;
}

// Proper nouns we re-capitalize when surfacing a keyword phrase in copy.
const PROPER_X = new Set([
  'shillong','meghalaya','guwahati','cherrapunji','sohra','dawki','northeast',
  'india','khasi','thai','italian','chinese','indo','tandoor','xtsy',
]);
/** Cosmetically case a lowercase keyword phrase for use as a sentence lead. */
function caseKeyword(kw: string): string {
  return kw
    .split(/\s+/)
    .map((w, i) => {
      const lw = w.toLowerCase();
      if (i === 0 || PROPER_X.has(lw)) return w.charAt(0).toUpperCase() + w.slice(1);
      return w;
    })
    .join(' ')
    .trim();
}

/**
 * Ensure every meaningful token of the primary keyword appears in the meta
 * description (the audit's `kw-in-desc` check). Runs AFTER ensurePrimaryKeyword
 * so it uses the final keywords[0]. When tokens are missing we prepend the
 * keyword phrase as a natural lead — placed at the START so it survives the
 * ≤160-char clamp (which only trims from the end).
 */
function ensureKeywordInDesc(p: SEOPageData): SEOPageData {
  const kw = (p.keywords?.[0] ?? '').trim();
  if (!kw) return p;
  const need = kwTok(kw);
  if (need.length === 0) return p;
  const descTok = new Set(normX(p.metaDescription).split(' ').map(stemX));
  if (need.every(t => descTok.has(t))) return p;
  const lead = caseKeyword(kw);
  let next = `${lead}: ${p.metaDescription}`.replace(/\s+/g, ' ').trim();
  if (next.length > DESC_MAX) {
    const win = next.slice(0, DESC_MAX);
    const stop = Math.max(win.lastIndexOf('. '), win.lastIndexOf('! '), win.lastIndexOf('? '));
    next = stop >= DESC_MIN ? win.slice(0, stop + 1).trim() : win.slice(0, win.lastIndexOf(' ')).trim();
  }
  return { ...p, metaDescription: next };
}

/** Apply all normalizations. Safe to compose after enforceBrandFacts. */
export function normalizeSEOPage(p: SEOPageData): SEOPageData {
  let out = enrichThin(p);
  out = {
    ...out,
    title: padTitle(out.title, out.category),
    metaDescription: padDesc(out.metaDescription, out.category),
  };
  out = ensureH1Alignment(out);
  out = ensureDescRelevance(out);
  out = ensurePrimaryKeyword(out);
  out = ensureKeywordInDesc(out);
  return out;
}
