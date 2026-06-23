/**
 * SEO Workflow — 7-phase, approval-gated revenue program for XTSY.
 *
 * Drives the AdminSEOWorkflow approval UI. Each phase surfaces findings and
 * must be explicitly approved before the next unlocks. Phase 1 & 2 carry
 * real audit + Semrush data; later phases carry the framework and are
 * populated as the program advances.
 *
 * Primary objective: direct bookings (XTSY Hostel, TAB Bistro, XTSY Travel).
 * Secondary objective: dominate Meghalaya / Northeast India organic search.
 */

export type FindingTone = 'positive' | 'warning' | 'critical' | 'neutral';

export interface PhaseFinding {
  label: string;
  detail: string;
  tone?: FindingTone;
}

export interface PhaseMetric {
  label: string;
  value: string;
  sub?: string;
}

export interface WorkflowPhase {
  id: number;
  key: string;
  title: string;
  objective: string;
  /** Optional deep-link to a supporting dashboard. */
  link?: { label: string; to: string };
  metrics: PhaseMetric[];
  findings: PhaseFinding[];
  /** Forward-looking deliverables (shown when phase is the gate). */
  deliverables?: string[];
}

export const SEO_WORKFLOW_PHASES: WorkflowPhase[] = [
  {
    id: 1,
    key: 'audit',
    title: 'Website Audit',
    objective: 'Establish a clean technical + commercial baseline across all indexable pages.',
    metrics: [
      { label: 'Indexable pages', value: '533' },
      { label: 'Critical issues', value: '0' },
      { label: 'Warnings', value: '0' },
      { label: 'Organic keywords', value: '140', sub: 'Semrush · IN' },
    ],
    findings: [
      { tone: 'positive', label: 'Technically clean', detail: '0 critical, 0 warnings, 0 duplicate titles / descriptions / H1s across 533 pages.' },
      { tone: 'critical', label: 'Revenue–traffic mismatch', detail: 'Every top-ranking page is informational (Umiam Lake, Seven Sisters, Nohkalikai) sitting on page 2–4. Bookable pages barely rank.' },
      { tone: 'warning', label: 'Commercial pages starved', detail: '“youth hostel shillong” #29, best-hostel-in-shillong #58, hotels-in-shillong #33; TAB Bistro & XTSY Travel revenue terms not ranking.' },
      { tone: 'warning', label: 'Internal equity leak', detail: '226 relatedSlugs resolve outside the registry — authority from informational giants is not flowing to booking pages.' },
    ],
  },
  {
    id: 2,
    key: 'competitors',
    title: 'Competitor Analysis',
    objective: 'Benchmark the exact pages and keywords driving bookings for Meghalaya & Northeast India.',
    link: { label: 'Open Competitor Dashboard', to: '/admin/seo/competitors' },
    metrics: [
      { label: 'Organic competitors', value: 'Live', sub: 'Semrush · IN' },
      { label: 'Booking-intent gap', value: 'Live' },
      { label: 'Head-to-head', value: 'Top 3' },
    ],
    findings: [
      { tone: 'neutral', label: 'Live benchmark', detail: 'Competitor Dashboard auto-discovers organic competitors and isolates booking-intent keywords (hostel, stay, tour, restaurant) they capture and we don’t.' },
      { tone: 'warning', label: 'Niche players outrank us on commercial terms', detail: 'Travel agencies and stay providers (e.g. flytribo, sunrisedestinations, windermerehotel, emeghalaya) convert booking intent we currently leak.' },
      { tone: 'neutral', label: 'Action', detail: 'Review the live gap table, then approve to map opportunities by revenue.' },
    ],
    deliverables: [
      'Auto-discovered competitor set with relevance + traffic',
      'Head-to-head authority/traffic table for top 3',
      'Booking-intent keyword gap (their commercial keywords we miss)',
    ],
  },
  {
    id: 3,
    key: 'opportunity',
    title: 'SEO Opportunity Mapping',
    objective: 'Map validated opportunities, prioritising revenue-generating pages over informational ones.',
    metrics: [
      { label: 'Quick wins', value: 'Pos 11–20' },
      { label: 'Revenue terms', value: 'Hostel/Bistro/Travel' },
    ],
    findings: [
      { tone: 'neutral', label: 'Quick-win bucket', detail: 'Informational giants on page 2 (positions 12–20) → on-page + internal-link push to page 1; each lifted page funnels authority to booking CTAs.' },
      { tone: 'neutral', label: 'Revenue-first bucket', detail: 'Validate and prioritise commercial keywords for Hostel, TAB Bistro, XTSY Travel before any informational expansion.' },
    ],
    deliverables: [
      'Keyword-validated opportunity list (volume, KD, intent, revenue)',
      'Quick-win vs build-new classification',
      'No duplicates: every target checked against existing 533 pages',
    ],
  },
  {
    id: 4,
    key: 'revenue',
    title: 'Revenue Potential Analysis',
    objective: 'Quantify booking revenue potential per opportunity to sequence the roadmap.',
    metrics: [
      { label: 'Model', value: 'Vol × CTR × CVR × AOV' },
    ],
    findings: [
      { tone: 'neutral', label: 'Revenue model', detail: 'Each target scored on estimated monthly bookings = search volume × position CTR × booking conversion rate × average order value per property.' },
      { tone: 'neutral', label: 'Sequencing', detail: 'Highest revenue-per-effort first; informational pages only when they feed a booking funnel.' },
    ],
    deliverables: [
      'Per-keyword revenue estimate for the 3 properties',
      'Ranked priority queue by revenue-per-effort',
    ],
  },
  {
    id: 5,
    key: 'architecture',
    title: 'SEO Architecture Design',
    objective: 'Design the internal-linking and schema architecture that channels authority into bookings.',
    metrics: [
      { label: 'Linking wheel', value: 'Info → Booking' },
      { label: 'Schema', value: 'Hotel/Restaurant/Trip' },
    ],
    findings: [
      { tone: 'neutral', label: 'Authority funnel', detail: 'Repair the 226 unresolved relatedSlugs and route high-traffic informational pages to the matching booking page (e.g. Umiam Lake → nearby stays).' },
      { tone: 'neutral', label: 'Schema plan', detail: 'Hotel/LodgingBusiness for stays, Restaurant + Menu for TAB Bistro, TouristTrip/Product for Travel, FAQPage + BreadcrumbList sitewide.' },
    ],
    deliverables: [
      'Internal-linking wheel mapping informational → booking pages',
      'Per-template schema specification',
      'Canonical / hreflang integrity check',
    ],
  },
  {
    id: 6,
    key: 'roadmap',
    title: 'Implementation Roadmap',
    objective: 'Sequence the work into a revenue-prioritised, no-duplicate execution plan.',
    metrics: [
      { label: 'Sprint 1', value: 'Quick wins' },
      { label: 'Sprint 2+', value: 'New revenue pages' },
    ],
    findings: [
      { tone: 'neutral', label: 'Phase 1 of build', detail: 'On-page + internal-link lifts for page-2 informational giants and existing booking pages (no new pages, fastest revenue).' },
      { tone: 'neutral', label: 'Phase 2 of build', detail: 'Net-new booking pages only where validated demand has no existing page — duplicate check enforced.' },
    ],
    deliverables: [
      'Sprint-by-sprint task list with owners',
      'Acceptance criteria per task (intent, volume, KD, schema, links)',
    ],
  },
  {
    id: 7,
    key: 'content',
    title: 'Content Production',
    objective: 'Produce keyword-validated, schema-complete content — booking pages first.',
    metrics: [
      { label: 'Gate', value: 'Keyword-validated only' },
      { label: 'Priority', value: 'Revenue pages' },
    ],
    findings: [
      { tone: 'neutral', label: 'Production rule', detail: 'No page is produced without keyword validation; every page ships with intent, volume, KD, revenue note, internal links and schema.' },
      { tone: 'neutral', label: 'Order', detail: 'Revenue-generating pages produced before informational pages, per the primary objective.' },
    ],
    deliverables: [
      'Validated, schema-complete booking pages',
      'Supporting informational content wired into the linking wheel',
    ],
  },
];
