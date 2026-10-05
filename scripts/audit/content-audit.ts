/**
 * Content + facts audit over every page's server HTML (what Google and AI crawlers read).
 *
 * Checks each page against the owner-confirmed facts:
 *  - prices (per room type), rating 4.7 / 237 reviews (TAB Bistro 4.7 / 142), 10,786+ guests
 *  - location (New Shillong Township, Mawdiangdiang Road, 793018), phone, email
 *  - no free cancellation / booking amount non-refundable, pet policy, check-in/out
 * plus placeholders, stale years, JSON-LD validity and facts, SEO and AEO signals.
 * Writes <OUT>/content.json (per page) and <OUT>/content-summary.json (per rule, with examples).
 */
import fs from 'fs';

const SITE = process.env.SITE_URL || 'http://localhost:4174';
const OUT = process.env.OUT_DIR || 'shots/content';
const HOST_RE = /^https?:\/\/(www\.)?xtsy\.one/;

// ---------- facts ----------
const PRICES: { key: string; re: RegExp; ok: number[] }[] = [
  { key: '8-bed dorm', re: /8[- ]?bed/i, ok: [399, 550] },
  { key: '6-bed mixed dorm', re: /6[- ]?bed(?![^.]{0,20}female)/i, ok: [499, 699] },
  { key: 'female dorm', re: /female|women/i, ok: [599, 679] },
  { key: 'king/private room', re: /king|double room|private room/i, ok: [2399, 3499] },
  { key: 'Experience by XTSY', re: /270|panorama|glass (suite|room|ensuite|house)|experience by xtsy|stargaze/i, ok: [5999, 2500, 11999] },
  { key: 'dorm "from" price', re: /(dorm|bed)s?\s*(beds?\s*)?(from|starting|start at|at just|for just|only)/i, ok: [399] },
];
const RATING = { hostel: ['4.7', '237'], bistro: ['4.7', '142'] };
const PHONE_OK = /8837317070/;
const EMAIL_OK = /^(admin|info|hello|bookings?|support)@xtsy\.one$/i;
/** Own properties only: partner stays (e.g. the Dawki campsite) have their own address. */
const OWN = (name: unknown) => /xtsy|tab bistro/i.test(String(name ?? '')) && !/dawki|partner|via xtsy/i.test(String(name ?? ''));

type Finding = { rule: string; detail: string };
type PageOut = { url: string; status: number; words: number; findings: Finding[]; seo: Record<string, unknown>; aeo: Record<string, unknown> };

const decode = (x: string) =>
  x.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;|&#160;/g, ' ').replace(/&#x20B9;|&#8377;/g, '₹');
const textOf = (html: string) =>
  decode(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<\/(p|li|h\d|div|section|tr|dd|dt|button|a)>/gi, '$&\n').replace(/<[^>]+>/g, ' ')).replace(/[ \t]+/g, ' ').replace(/\n\s*/g, '\n').trim();
const pick = (h: string, re: RegExp) => decode(h.match(re)?.[1] ?? '').trim();
const ctx = (t: string, i: number, a = 70, b = 50) => t.slice(Math.max(0, i - a), i + b).replace(/\s+/g, ' ');
const num = (s: string) => Number(s.replace(/,/g, ''));

function factChecks(url: string, text: string, f: Finding[]) {
  // Prices: the nearest room-type word before a ₹ amount decides what it should be.
  for (const m of text.matchAll(/₹\s?([\d,]{3,6})(?![\d,])/g)) {
    const v = num(m[1]);
    const before = text.slice(Math.max(0, m.index! - 60), m.index!);
    const sentenceStart = Math.max(before.lastIndexOf('.'), before.lastIndexOf('\n'));
    const near = before.slice(sentenceStart + 1);
    for (const p of PRICES) {
      if (!p.re.test(near)) continue;
      // Only judge amounts in the plausible range for that room type.
      const lo = Math.min(...p.ok) * 0.6, hi = Math.max(...p.ok) * 1.5;
      if (v >= lo && v <= hi && !p.ok.includes(v)) f.push({ rule: `price:${p.key}`, detail: `₹${v} — "${ctx(text, m.index!)}"` });
      break;
    }
    // Room rates before the 5 Oct 2026 all-inclusive change; none of these should appear for rooms now.
    if ([389, 2200, 5399, 5799].includes(v) && /dorm|bed|room|king|double|suite|experience|stay|night/i.test(ctx(text, m.index!))) f.push({ rule: `price:old rate ₹${v}`, detail: ctx(text, m.index!) });
    if (v === 0) f.push({ rule: 'placeholder:₹0', detail: ctx(text, m.index!) });
  }
  // Ratings and review counts
  for (const m of text.matchAll(/(\d\.\d)\s*(?:★|\/\s?5|stars?|star rating|-star|on google|google rating|rated)/gi)) {
    const around = ctx(text, m.index!, 90, 60);
    const bistro = /bistro|restaurant|tab\b|café|cafe/i.test(around);
    const want = bistro ? RATING.bistro[0] : RATING.hostel[0];
    if (m[1] !== want && !(bistro && m[1] === RATING.hostel[0]) && !/zostel|hosteller|oyo|competitor|vs\b|other hostels|madpackers|stargaze hostel|zion/i.test(around))
      f.push({ rule: 'rating:value', detail: `${m[1]} — "${around}"` });
  }
  for (const m of text.matchAll(/([\d,]{2,6})\+?\s*(?:google\s+|verified\s+|guest\s+|5-star\s+)?reviews/gi)) {
    const v = m[1].replace(/,/g, '');
    const around = ctx(text, m.index!, 90, 40);
    if (!['237', '142'].includes(v) && !/zostel|hosteller|oyo|vs\b|other/i.test(around)) f.push({ rule: 'rating:review count', detail: `${v} — "${around}"` });
  }
  for (const m of text.matchAll(/([\d,]{3,7})\+?\s*(?:happy\s+|global\s+|satisfied\s+)?(?:guests|travell?ers|backpackers|visitors)\b/gi)) {
    const v = num(m[1]);
    if (v >= 500 && v !== 10786) f.push({ rule: 'guests:count', detail: `${m[1]} — "${ctx(text, m.index!)}"` });
  }
  // Location
  for (const m of text.matchAll(/(located|situated|based|nestled|we are|hostel is|stay)\s+(in|at|near|on)\s+(the heart of\s+)?(Mawkhar|Police Baza[a]?r|Laitumkhrah|central Shillong|Shillong city cent(re|er)|Upper Shillong|Mawlai|Lachumiere)/gi))
    f.push({ rule: 'location:wrong area', detail: ctx(text, m.index!, 60, 80) });
  if (/heart of shillong/i.test(text)) f.push({ rule: 'location:"heart of Shillong"', detail: ctx(text, text.search(/heart of shillong/i)) });
  for (const m of text.matchAll(/\b7930\d\d\b/g)) if (m[0] !== '793018' && /xtsy|hostel|address|mawdiangdiang/i.test(ctx(text, m.index!, 120, 10))) f.push({ rule: 'location:pincode', detail: ctx(text, m.index!) });
  // Policies
  for (const m of text.matchAll(/(free cancell?ation|fully refundable|full refund|100% refund|refundable|cancel (for free|anytime)|flexible cancell?ation|money[- ]back)/gi)) {
    const around = ctx(text, m.index!, 60, 40);
    if (!/\b(no|not|non|isn't|aren't|without|never)\b[^.]{0,25}$/i.test(text.slice(Math.max(0, m.index! - 30), m.index!)) && !/non-refundable/i.test(m[0]))
      f.push({ rule: 'policy:cancellation/refund claim', detail: around });
  }
  for (const m of text.matchAll(/(no pets|pets? (are )?not allowed|pet-free|we do not allow pets)/gi)) f.push({ rule: 'policy:pets', detail: ctx(text, m.index!) });
  for (const m of text.matchAll(/check[- ]?in[^.\n]{0,25}?(\d{1,2})(:\d\d)?\s?(am|pm|a\.m\.|p\.m\.)/gi)) {
    const h = `${m[1]}${(m[3][0]).toLowerCase()}`;
    if (!['11a', '12p', '1p', '2p'].includes(h)) f.push({ rule: 'policy:check-in time', detail: ctx(text, m.index!, 20, 60) });
    else f.push({ rule: 'info:check-in time seen', detail: h });
  }
  for (const m of text.matchAll(/check[- ]?out[^.\n]{0,25}?(\d{1,2})(:\d\d)?\s?(am|pm|a\.m\.|p\.m\.)/gi)) f.push({ rule: 'info:check-out time seen', detail: `${m[1]}${m[3][0].toLowerCase()}` });
  // Contacts
  for (const m of text.matchAll(/(?:\+?91[\s-]?)?(?<![\d])([6-9]\d{4}[\s-]?\d{5})(?![\d])/g)) {
    if (!PHONE_OK.test(m[1].replace(/[\s-]/g, ''))) f.push({ rule: 'contact:phone', detail: `${m[1]} — "${ctx(text, m.index!)}"` });
  }
  for (const m of text.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)) if (!EMAIL_OK.test(m[0]) && !/example|sentry|wixpress/i.test(m[0])) f.push({ rule: 'contact:email', detail: m[0] });
  // Placeholders and staleness
  for (const m of text.matchAll(/\b(lorem ipsum|TODO|TBD|undefined|NaN|\[object Object\]|null null|coming soon)\b/g)) f.push({ rule: `placeholder:${m[1]}`, detail: ctx(text, m.index!) });
  for (const m of text.matchAll(/\{\{?[a-z_]+\}?\}/gi)) f.push({ rule: 'placeholder:template token', detail: ctx(text, m.index!) });
  for (const m of text.matchAll(/\b(2023|2024|2025)\b/g)) {
    const around = ctx(text, m.index!, 50, 30);
    if (!/since|founded|opened|established|in 20\d\d,|history|©|launched|started|began|back in|was|were|record/i.test(around)) f.push({ rule: 'stale:year', detail: `${m[1]} — "${around}"` });
  }
}

function jsonLdChecks(html: string, text: string, f: Finding[], aeo: Record<string, unknown>) {
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const types: string[] = [];
  const faqQs: string[] = [];
  const walk = (o: unknown) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== 'object') return;
    const n = o as Record<string, unknown>;
    const t = ([] as unknown[]).concat(n['@type'] ?? []).map(String);
    types.push(...t);
    if (n.aggregateRating && typeof n.aggregateRating === 'object') {
      const r = n.aggregateRating as Record<string, unknown>;
      const bistro = /bistro|restaurant/i.test(String(n.name ?? '') + t.join());
      const want = bistro ? RATING.bistro : RATING.hostel;
      if (String(r.ratingValue) !== want[0] || String(r.reviewCount ?? r.ratingCount) !== want[1])
        f.push({ rule: 'schema:aggregateRating', detail: `${n.name ?? t.join()}: ${r.ratingValue}/${r.reviewCount ?? r.ratingCount}` });
    }
    if (n.address && typeof n.address === 'object') {
      const a = n.address as Record<string, unknown>;
      const s = JSON.stringify(a);
      if (OWN(n.name) && (!/793018/.test(s) || /mawkhar|police baza/i.test(s))) f.push({ rule: 'schema:address', detail: `${n.name}: ${s.slice(0, 160)}` });
    }
    if (n.geo && typeof n.geo === 'object') {
      const g = n.geo as Record<string, unknown>;
      if (OWN(n.name) && (Math.abs(Number(g.latitude) - 25.6025457) > 0.002 || Math.abs(Number(g.longitude) - 91.9448902) > 0.002))
        f.push({ rule: 'schema:geo', detail: `${n.name}: ${g.latitude},${g.longitude}` });
    }
    if (typeof n.telephone === 'string' && !PHONE_OK.test(n.telephone.replace(/\D/g, ''))) f.push({ rule: 'schema:telephone', detail: n.telephone });
    if (t.includes('Question') && typeof n.name === 'string') faqQs.push(n.name);
    if (t.includes('Offer') && n.price !== undefined && Number(n.price) === 0) f.push({ rule: 'schema:offer price 0', detail: JSON.stringify(n).slice(0, 160) });
    for (const v of Object.values(n)) walk(v);
  };
  for (const b of blocks) {
    try { walk(JSON.parse(b)); } catch (e) { f.push({ rule: 'schema:invalid JSON-LD', detail: String(e).slice(0, 120) }); }
  }
  // AEO: FAQ schema questions must be visible on the page (Google requirement; AI engines quote visible text).
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const nt = norm(text);
  const hidden = faqQs.filter((q) => !nt.includes(norm(q).slice(0, 60)));
  if (hidden.length) f.push({ rule: 'aeo:FAQ schema question not on page', detail: `${hidden.length}/${faqQs.length}: ${hidden[0]}` });
  aeo.schemaTypes = [...new Set(types)];
  aeo.faqSchemaQuestions = faqQs.length;
  return types;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const urls = new Set<string>(['/']);
  const idx = await (await fetch(SITE + '/sitemap_index.xml')).text();
  for (const m of idx.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (/images/.test(m[1])) continue;
    const xml = await (await fetch(SITE + m[1].replace(HOST_RE, ''))).text();
    for (const u of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(u[1].replace(HOST_RE, '') || '/');
  }
  for (const extra of (process.env.EXTRA_ROUTES || '/book,/guides,/faq,/contact,/about,/pricing-cancellation-policy,/tab-bistro,/xtsy-270,/pet-friendly,/female-travellers').split(',')) urls.add(extra);

  const pages: PageOut[] = [];
  const descs = new Map<string, string[]>();
  const list = [...urls];
  let i = 0;
  async function worker() {
    while (i < list.length) {
      const url = list[i++];
      const f: Finding[] = [];
      const seo: Record<string, unknown> = {};
      const aeo: Record<string, unknown> = {};
      let status = 0, words = 0;
      try {
        const r = await fetch(SITE + url, { headers: { 'User-Agent': 'xtsy-content-audit' } });
        status = r.status;
        const html = await r.text();
        const body = html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? html;
        const text = textOf(body);
        words = text.split(/\s+/).filter(Boolean).length;
        const title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/);
        const desc = pick(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"/);
        const canonical = pick(html, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/);
        const robots = pick(html, /<meta[^>]*name="robots"[^>]*content="([^"]*)"/);
        const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => textOf(m[1]));
        const heads = [...body.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => textOf(m[1]));
        const imgs = [...body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
        Object.assign(seo, { title, titleLen: title.length, desc, descLen: desc.length, canonical, robots, h1: h1s, ogImage: /property="og:image"/.test(html), imgs: imgs.length, imgsNoAlt: imgs.filter((x) => !/\balt="[^"]+"/.test(x) && !/aria-hidden="true"|alt=""/.test(x)).length });
        const noindex = /noindex/.test(robots);
        if (status !== 200) f.push({ rule: 'seo:status', detail: String(status) });
        if (!noindex) {
          if (!title) f.push({ rule: 'seo:title missing', detail: '' });
          else if (title.length > 60) f.push({ rule: 'seo:title > 60 chars', detail: `${title.length}: ${title}` });
          else if (title.length < 25) f.push({ rule: 'seo:title < 25 chars', detail: title });
          if (!desc) f.push({ rule: 'seo:description missing', detail: '' });
          else if (desc.length > 160) f.push({ rule: 'seo:description > 160 chars', detail: `${desc.length}: ${desc.slice(0, 90)}…` });
          else if (desc.length < 70) f.push({ rule: 'seo:description < 70 chars', detail: desc });
          if (h1s.length !== 1) f.push({ rule: 'seo:h1 count', detail: `${h1s.length}: ${h1s.join(' | ').slice(0, 100)}` });
          if (!canonical) f.push({ rule: 'seo:canonical missing', detail: '' });
          if (!seo.ogImage) f.push({ rule: 'seo:og:image missing', detail: '' });
          if ((seo.imgsNoAlt as number) > 0) f.push({ rule: 'seo:images without alt', detail: String(seo.imgsNoAlt) });
          if (words < 300) f.push({ rule: 'seo:thin (<300 words)', detail: String(words) });
          if (desc) descs.set(desc.toLowerCase(), [...(descs.get(desc.toLowerCase()) ?? []), url]);
          // Facts in title / description too
          factChecks(url, `${title}.\n${desc}.`, f);
        }
        factChecks(url, text, f);
        jsonLdChecks(html, text, f, aeo);
        // AEO signals
        const qHeads = heads.filter((h) => /\?$|^(how|what|when|where|why|which|is|are|can|do|does|should)\b/i.test(h));
        const firstP = textOf(body.match(/<h1[\s\S]*?<\/h1>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '');
        Object.assign(aeo, { questionHeadings: qHeads.length, firstParagraphWords: firstP.split(/\s+/).filter(Boolean).length, mentionsBrand: /XTSY Travellers Hostel/.test(text), mentionsLocation: /New Shillong Township/i.test(text), updatedDate: /updated|last reviewed/i.test(text) });
        if (!noindex && status === 200) {
          if (!(aeo.schemaTypes as string[]).includes('FAQPage') && qHeads.length === 0) f.push({ rule: 'aeo:no FAQ or question headings', detail: '' });
          if (!aeo.mentionsLocation) f.push({ rule: 'aeo:no "New Shillong Township" entity mention', detail: '' });
          if ((aeo.firstParagraphWords as number) === 0 || (aeo.firstParagraphWords as number) > 80) f.push({ rule: 'aeo:no concise answer paragraph under H1', detail: String(aeo.firstParagraphWords) });
        }
      } catch (e) { f.push({ rule: 'fetch:error', detail: String(e).slice(0, 100) }); }
      pages.push({ url, status, words, findings: f.filter((x) => !x.rule.startsWith('info:')), seo, aeo });
      (pages[pages.length - 1] as PageOut & { info?: Finding[] }).info = f.filter((x) => x.rule.startsWith('info:'));
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));
  for (const [d, us] of descs) if (us.length > 1) for (const u of us) pages.find((p) => p.url === u)?.findings.push({ rule: 'seo:duplicate description', detail: `${us.length} pages: ${d.slice(0, 80)}` });

  // Site-level AEO files
  const site: Record<string, unknown> = {};
  for (const p of ['/robots.txt', '/llms.txt', '/llms-full.txt']) {
    try { const r = await fetch(SITE + p); const t = await r.text(); site[p] = { status: r.status, bytes: t.length, blocksAIBots: p === '/robots.txt' ? /User-agent:\s*(GPTBot|ClaudeBot|PerplexityBot|Google-Extended)[\s\S]*?Disallow:\s*\/\s*$/im.test(t) : undefined }; } catch (e) { site[p] = String(e); }
  }

  const byRule: Record<string, { pages: number; examples: string[] }> = {};
  for (const p of pages) for (const x of p.findings) {
    const r = (byRule[x.rule] ??= { pages: 0, examples: [] });
    r.pages++;
    if (r.examples.length < 12) r.examples.push(`${p.url} — ${x.detail}`);
  }
  const info: Record<string, Record<string, number>> = {};
  for (const p of pages as (PageOut & { info?: Finding[] })[]) for (const x of p.info ?? []) { (info[x.rule] ??= {})[x.detail] = ((info[x.rule] ??= {})[x.detail] ?? 0) + 1; }
  const summary = { site: SITE, pages: pages.length, pagesWithFindings: pages.filter((p) => p.findings.length).length, siteFiles: site, info, rules: Object.fromEntries(Object.entries(byRule).sort((a, b) => b[1].pages - a[1].pages)) };
  fs.writeFileSync(`${OUT}/content.json`, JSON.stringify(pages.sort((a, b) => a.url.localeCompare(b.url)), null, 1));
  fs.writeFileSync(`${OUT}/content-summary.json`, JSON.stringify(summary, null, 1));
  console.log(`::notice::Content audit: ${pages.length} pages, ${summary.pagesWithFindings} with findings, ${Object.keys(byRule).length} rule types`);
}
main();
