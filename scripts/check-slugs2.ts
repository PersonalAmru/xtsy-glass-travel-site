import { ALL_SEO_PAGES } from '../src/data/seoPages';
const targets = ['cherrapun','double-decker','root-bridge','shnongpdeng','dawki','xtsy-270'];
for (const t of targets) {
  console.log('---',t);
  ALL_SEO_PAGES.filter(p=>p.slug.includes(t)).forEach(p=>console.log('  ',p.slug));
}
