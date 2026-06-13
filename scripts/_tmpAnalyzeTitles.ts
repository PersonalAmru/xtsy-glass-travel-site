import { ALL_SEO_PAGES } from '../src/data/seoPages';
const long = ALL_SEO_PAGES.filter(p => p.title.length > 60);
const byCat = new Map<string, number>();
for (const p of long) byCat.set(p.category, (byCat.get(p.category)??0)+1);
console.log('Long titles by category:');
[...byCat.entries()].sort((a,b)=>b[1]-a[1]).forEach(([c,n])=>console.log(`  ${c.padEnd(16)} ${n}`));
const suffixCount = new Map<string, number>();
for (const p of long) {
  const idx = Math.max(p.title.lastIndexOf('|'), p.title.lastIndexOf('–'), p.title.lastIndexOf('—'));
  if (idx>0) { const s=p.title.slice(idx); suffixCount.set(s,(suffixCount.get(s)??0)+1); }
}
console.log('\nCommon long-title suffixes:');
[...suffixCount.entries()].sort((a,b)=>b[1]-a[1]).slice(0,12).forEach(([s,n])=>console.log(`  ${n}x  "${s}"`));
console.log('\nSamples:');
long.slice(0,10).forEach(p=>console.log(`  [${p.title.length}] ${p.title}`));
