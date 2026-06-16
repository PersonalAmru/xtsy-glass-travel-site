import { ALL_SEO_PAGES } from '../src/data/seoPages';
const norm=(s:string)=>(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
const dmap=new Map<string,string[]>();
for(const p of ALL_SEO_PAGES as any[]){const k=norm(p.metaDescription);if(!dmap.has(k))dmap.set(k,[]);dmap.get(k)!.push(p.slug);}
for(const[k,v]of dmap){if(v.length>1){console.log('DUPDESC count='+v.length,'::',v.slice(0,40).join(','));console.log('  desc:',k);}}
const hmap=new Map<string,{slug:string,h1:string,title:string}[]>();
for(const p of ALL_SEO_PAGES as any[]){const h=p.h1||'';if(!h)continue;const k=norm(h);if(!hmap.has(k))hmap.set(k,[]);hmap.get(k)!.push({slug:p.slug,h1:h,title:p.title});}
for(const[k,v]of hmap){if(v.length>1){console.log('\nDUPH1',v.map(x=>x.slug).join(' , '));v.forEach(x=>console.log('   ',x.slug,'| h1:',x.h1,'| title:',x.title));}}
