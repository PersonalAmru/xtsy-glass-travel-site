/** Every page URL listed in the live sitemaps (image sitemap excluded), with the sitemap it came from. */
const HOST_RE = /^https?:\/\/(www\.)?xtsy\.one/;

export async function sitemapUrls(base: string): Promise<{ path: string; sitemap: string }[]> {
  const idx = await (await fetch(base + '/sitemap_index.xml')).text();
  const maps = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(HOST_RE, ''));
  const seen = new Set<string>();
  const out: { path: string; sitemap: string }[] = [];
  for (const m of maps) {
    if (/images/.test(m)) continue;
    const xml = await (await fetch(base + m)).text();
    for (const u of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const p = u[1].replace(HOST_RE, '') || '/';
      if (!seen.has(p)) { seen.add(p); out.push({ path: p, sitemap: m.replace(/^\/|\.xml$/g, '') }); }
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}
