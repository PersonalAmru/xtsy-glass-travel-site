import { ALL_SEO_PAGES } from '../src/data/seoPages';
const norm=(s:string)=>(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
const dmap=new Map<string,string[]>();
for(const p of ALL_SEO_PAGES){const k=norm(p.description);if(!dmap.has(k))dmap.set(k,[]);dmap.get(k)!.push(p.slug);}
for(const[k,v]of dmap){if(v.length>1){console.log('DUPDESC count='+v.length,'::',v.slice(0,8).join(','));console.log('  desc:',k.slice(0,170));}}
const hmap=new Map<string,{slug:string,h1:string}[]>();
for(const p of ALL_SEO_PAGES){const h=(p as any).h1||(p as any).heading||(p as any).hero?.heading||'';if(!h)continue;const k=norm(h);if(!hmap.has(k))hmap.set(k,[]);hmap.get(k)!.push({slug:p.slug,h1:h});}
for(const[k,v]of hmap){if(v.length>1)console.log('DUPH1',v.map(x=>x.slug).join(','),'::',v[0].h1);}
