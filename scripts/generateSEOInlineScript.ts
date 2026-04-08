/**
 * Generate an inline <script> block that sets page-specific
 * <title> and <meta description> BEFORE React loads.
 * 
 * This ensures Google's initial HTML crawl sees unique metadata
 * for each of the 210+ programmatic SEO pages, even though
 * Lovable hosting serves the same index.html for all routes.
 */

import { ALL_SEO_PAGES } from '../src/data/seoPages';

interface SEOMapEntry {
  t: string;  // title
  d: string;  // meta description
}

export function generateSEOMap(): Record<string, SEOMapEntry> {
  const map: Record<string, SEOMapEntry> = {};
  for (const page of ALL_SEO_PAGES) {
    map[page.slug] = { t: page.title, d: page.metaDescription };
  }
  return map;
}

export function generateInlineScript(): string {
  const map = generateSEOMap();
  
  // Minified inline script that runs synchronously before React
  return `<script>
(function(){
var m=${JSON.stringify(map)};
var p=location.pathname.replace(/^\\/|\\/$$/g,'');
if(m[p]){
document.title=m[p].t;
var d=document.querySelector('meta[name="description"]');
if(d)d.setAttribute('content',m[p].d);
var c=document.querySelector('link[rel="canonical"]');
if(c)c.setAttribute('href','https://xtsy.one/'+p);
var ot=document.querySelector('meta[property="og:title"]');
if(ot)ot.setAttribute('content',m[p].t);
var od=document.querySelector('meta[property="og:description"]');
if(od)od.setAttribute('content',m[p].d);
var ou=document.querySelector('meta[property="og:url"]');
if(ou)ou.setAttribute('content','https://xtsy.one/'+p);
var tt=document.querySelector('meta[name="twitter:title"]');
if(tt)tt.setAttribute('content',m[p].t);
var td=document.querySelector('meta[name="twitter:description"]');
if(td)td.setAttribute('content',m[p].d);
}
})();
</script>`;
}

// CLI usage
if (process.argv[1]?.includes('generateSEOInlineScript')) {
  console.log(generateInlineScript());
}
