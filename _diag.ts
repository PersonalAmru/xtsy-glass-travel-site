import { ALL_SEO_PAGES } from './src/data/seoPages';
const fold=(s:string)=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
const norm=(s:string)=>fold(s).toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
const stem=(w:string)=>w.length>4&&w.endsWith('ies')?w.slice(0,-3)+'y':w.length>4&&w.endsWith('es')?w.slice(0,-2):w.length>3&&w.endsWith('s')&&!w.endsWith('ss')?w.slice(0,-1):w;
const GENERIC=new Set(['the','and','for','with','your','our','you','from','near','best','top','new','all','out','how','what','where','why','who','can','are','this','that','into','onto','plus','more','get','book','visit','plan','2024','2025','2026','2027']);
const STOP=new Set(['xtsy','best','book','your','with','from','near','2025','2026','travel','guide','stay','shillong','meghalaya']);
const tokens=(s:string)=>new Set(norm(s).split(' ').filter(w=>w.length>3).map(stem));
const topicTokens=(s:string)=>new Set(norm(s).split(' ').filter(w=>w.length>=3&&!GENERIC.has(w)).map(stem));
console.log('=== H1 MISMATCH ===');
for(const p of ALL_SEO_PAGES){const t=topicTokens(p.title),h=topicTokens(p.h1);if(t.size===0||h.size===0)continue;const sh=[...h].filter(w=>t.has(w)).length;if(sh/Math.min(t.size,h.size)<0.5)console.log(`H1 | ${p.slug} | h1="${p.h1}" | title="${p.title}"`);}
console.log('=== DESC IRRELEVANT ===');
for(const p of ALL_SEO_PAGES){const body=tokens(p.h1+' '+p.intro);const d=[...tokens(p.metaDescription)].filter(w=>!STOP.has(w));if(d.length===0)continue;const ov=d.filter(w=>body.has(w)).length/d.length;if(ov<0.25)console.log(`DR | ${p.slug} | ${(ov*100|0)}% | desc="${p.metaDescription}"`);}
console.log('=== DUP H1 ===');
const m=new Map<string,string[]>();for(const p of ALL_SEO_PAGES){const k=norm(p.h1);(m.get(k)??m.set(k,[]).get(k)!).push(p.slug);}for(const[k,v]of m)if(v.length>1)console.log(`DUP | "${k}" | ${v.join(', ')}`);
