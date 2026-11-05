/**
 * Read-only production SEO intelligence audit.
 * Usage: npm run seo:intelligence -- --base https://xtsy.one --limit 100
 */
import { writeFile } from 'node:fs/promises';
const args=process.argv.slice(2);
const arg=(n,d)=>{const i=args.indexOf(n);return i>=0&&args[i+1]?args[i+1]:d};
const base=arg('--base','https://xtsy.one').replace(/\/$/,'');
const limit=Number(arg('--limit','0'));
const concurrency=Math.max(1,Number(arg('--concurrency','8'))||8);
const sitemapUrl=arg('--sitemap',base+'/sitemap_index.xml');
const textOf=s=>s.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const attr=(tag,name)=>{const m=tag.match(new RegExp('\\b'+name+'\\s*=\\s*["\\']([^"\\']*)["\\']','i'));return m?.[1]||''};
async function fetchText(url){const r=await fetch(url,{redirect:'follow',headers:{'user-agent':'XTSY-SEO-Intelligence-Audit/1.0'}});return {status:r.status,url:r.url,text:await r.text()}}
function locs(xml){return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m=>m[1].trim().replace(/&amp;/g,'&'))}
async function collect(url,seen=new Set()){if(seen.has(url))return[];seen.add(url);const r=await fetchText(url);if(r.status<200||r.status>=300)throw Error('Sitemap fetch failed '+r.status+': '+url);const children=locs(r.text);if(/<sitemapindex\b/i.test(r.text)){const nested=await Promise.all(children.map(u=>collect(u,seen)));return nested.flat()}return children}
function parsePage(html,url,status,finalUrl){
 const tags=[...html.matchAll(/<(meta|link)\b[^>]*>/gi)].map(m=>m[0]);
 const title=textOf(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
 const h1=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>textOf(m[1]));
 const meta=name=>{const t=tags.find(t=>attr(t,'name').toLowerCase()===name.toLowerCase());return t?attr(t,'content'):''};
 const canonicalTag=tags.find(t=>t.startsWith('<link')&&attr(t,'rel').toLowerCase().split(/\s+/).includes('canonical'));
 const og=tags.find(t=>attr(t,'property').toLowerCase()==='og:image');
 const robots=meta('robots')||meta('googlebot')||'';
 const blocks=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 let valid=true;for(const b of blocks){try{JSON.parse(b)}catch{valid=false}}
 const imgs=[...html.matchAll(/<img\b[^>]*>/gi)].map(m=>attr(m[0],'src')||attr(m[0],'data-src')).filter(Boolean);
 const nonPexels=imgs.filter(s=>!/images\.pexels\.com|pexels\.com/i.test(s)&&!s.startsWith('data:'));
 const description=meta('description'),canonical=canonicalTag?attr(canonicalTag,'href'):'';
 const issues=[];
 if(status!==200)issues.push('http-'+status);
 if(!title)issues.push('missing-title');else if(title.length>65)issues.push('title-long');
 if(!description)issues.push('missing-description');else if(description.length>170)issues.push('description-long');
 if(!canonical)issues.push('missing-canonical');
 if(canonical&&new URL(canonical,base).origin!==new URL(base).origin)issues.push('cross-origin-canonical');
 if(robots.toLowerCase().includes('noindex'))issues.push('noindex-in-sitemap');
 if(!h1.length)issues.push('missing-h1');if(h1.length>1)issues.push('multiple-h1');
 if(!blocks.length)issues.push('missing-jsonld');if(!valid)issues.push('invalid-jsonld');if(!og)issues.push('missing-og-image');
 return {url,finalUrl,status,title,titleLength:title.length,description,descriptionLength:description.length,canonical,robots,h1,jsonLdBlocks:blocks.length,jsonLdValid:valid,imageCount:imgs.length,nonPexelsImages:nonPexels,issues};
}
const urls=await collect(sitemapUrl),selected=limit>0?urls.slice(0,limit):urls;let next=0;const rows=[];
const workers=Array.from({length:Math.min(concurrency,selected.length)},async()=>{while(next<selected.length){const url=selected[next++];try{const r=await fetchText(url);rows.push(parsePage(r.text,url,r.status,r.url))}catch(e){rows.push({url,finalUrl:'',status:0,title:'',titleLength:0,description:'',descriptionLength:0,canonical:'',robots:'',h1:[],jsonLdBlocks:0,jsonLdValid:false,imageCount:0,nonPexelsImages:[],issues:['fetch-error: '+String(e)]})}}});
await Promise.all(workers);rows.sort((a,b)=>a.url.localeCompare(b.url));
const counts={};for(const row of rows)for(const issue of row.issues)counts[issue]=(counts[issue]||0)+1;
const report={generatedAt:new Date().toISOString(),base,sitemapUrl,totalSitemapUrls:urls.length,auditedUrls:rows.length,issueCounts:counts,rows};
await writeFile('seo-intelligence-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({generatedAt:report.generatedAt,base,totalSitemapUrls:report.totalSitemapUrls,auditedUrls:report.auditedUrls,issueCounts:counts,reportFile:'seo-intelligence-report.json'},null,2));
