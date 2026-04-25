import * as fs from 'fs';
import { ALL_SEO_PAGES } from '../src/data/seoPages';
import { PILLAR_PAGES } from '../src/data/seoPillarPages';
import { DESTINATION_PAGES } from '../src/data/seoDestinationPages';
import { EXPANSION_SEO_PAGES } from '../src/data/seoPagesExpansion';
import { LAST_MINUTE_SEO_PAGES } from '../src/data/seoLastMinutePages';
import { ROUTE_SEO_PAGES } from '../src/data/seoPagesRoutes';
import { INTENT_STAY_SEO_PAGES } from '../src/data/seoPagesIntent';
import { INSTITUTION_SEO_PAGES } from '../src/data/seoPagesInstitutions';
import { ACTIVITY_SEO_PAGES } from '../src/data/seoPagesActivities';
import { DURATION_ITINERARY_SEO_PAGES } from '../src/data/seoPagesDurations';
import { GLOBAL_NE_SEO_PAGES } from '../src/data/seoPagesGlobalNE';

const affected = fs.readFileSync('/tmp/slugs.txt', 'utf8').split('\n')
  .map(l => l.trim()).filter(Boolean).filter(l => !l.startsWith('TOTAL'));

const raw = new Set([
  ...PILLAR_PAGES, ...DESTINATION_PAGES, ...EXPANSION_SEO_PAGES, ...LAST_MINUTE_SEO_PAGES,
  ...ROUTE_SEO_PAGES, ...INTENT_STAY_SEO_PAGES, ...INSTITUTION_SEO_PAGES, ...ACTIVITY_SEO_PAGES,
  ...DURATION_ITINERARY_SEO_PAGES, ...GLOBAL_NE_SEO_PAGES,
].map(p => p.slug));
const filtered = new Set(ALL_SEO_PAGES.map(p => p.slug));

const inFiltered: string[] = [];
const filteredOut: string[] = [];
const missing: string[] = [];
const placesPaths: string[] = [];

for (const s of affected) {
  if (s.startsWith('places-to-visit/')) { placesPaths.push(s); continue; }
  if (filtered.has(s)) inFiltered.push(s);
  else if (raw.has(s)) filteredOut.push(s);
  else missing.push(s);
}

console.log('Total RAW:', raw.size, 'FILTERED:', filtered.size);
console.log('Affected total:', affected.length);
console.log(' - Live (in filtered):', inFiltered.length);
console.log(' - Filtered OUT (return NotFound):', filteredOut.length);
console.log(' - Completely missing:', missing.length);
console.log(' - places-to-visit/* paths:', placesPaths.length);
console.log('\n=== FILTERED OUT ===');
filteredOut.forEach(s => console.log(' ', s));
console.log('\n=== MISSING ===');
missing.forEach(s => console.log(' ', s));
console.log('\n=== places-to-visit/* ===');
placesPaths.forEach(s => console.log(' ', s));
console.log('\n=== ALSO LIVE (these should be working) ===');
inFiltered.forEach(s => console.log(' ', s));
