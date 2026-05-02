import { findSEOPage } from '../src/data/seoPages';
const slugs = ['dawki-umngot-river-guide','cherrapunjee-travel-guide','mawlynnong-cleanest-village','laitlum-canyons-shillong','double-decker-root-bridge','umiam-lake-shillong','nohkalikai-falls-meghalaya','krang-suri-falls-meghalaya','mawsmai-cave-cherrapunji','shnongpdeng-camping-meghalaya','xtsy-270'];
for (const s of slugs) {
  const p = findSEOPage(s);
  if (!p) { console.log(s,'NOT FOUND'); continue; }
  const total = (p.intro?.length||0)+p.sections.reduce((a:number,x:any)=>a+(x.content?.length||0),0);
  console.log(s.padEnd(40), 'sections=', p.sections.length, 'bodyLen=', total, (total<600||p.sections.length<3)?'BLANK!':'ok');
}
