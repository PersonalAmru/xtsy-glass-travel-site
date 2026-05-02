import { SEO_DESTINATION_PAGES } from '../src/data/seoDestinationPages';
import { SEO_PILLAR_PAGES } from '../src/data/seoPillarPages';
const slugs = ['dawki-umngot-river-guide','cherrapunjee-travel-guide','mawlynnong-cleanest-village','laitlum-canyons-shillong','double-decker-root-bridge','umiam-lake-shillong','nohkalikai-falls-meghalaya','krang-suri-falls-meghalaya','mawsmai-cave-cherrapunji','shnongpdeng-camping-meghalaya','xtsy-270'];
const all: any[] = [...SEO_DESTINATION_PAGES, ...SEO_PILLAR_PAGES];
for (const s of slugs) {
  const p = all.find((x:any)=>x.slug===s);
  if (!p) { console.log(s,'NOT FOUND in seoDest/Pillar'); continue; }
  const total = (p.intro?.length||0)+p.sections.reduce((a:number,x:any)=>a+(x.content?.length||0),0);
  console.log(s, 'sections=', p.sections.length, 'bodyLen=', total, (total<600||p.sections.length<3)?'BLANK!':'ok');
}
