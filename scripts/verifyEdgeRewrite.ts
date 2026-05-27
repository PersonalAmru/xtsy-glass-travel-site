/**
 * verifyEdgeRewrite — post-deploy smoke test.
 *
 * After the Cloudflare worker (`xtsy-prerender`) deploys, samples N random URLs
 * from every sitemap branch and asserts:
 *   1. HTTP 2xx
 *   2. `x-rendered-by` header equals `cf-edge-rewrite` or `cf-bot-rewrite`
 *      → confirms the worker is intercepting and rewriting at the edge.
 *   3. `<link rel="canonical">` matches the requested URL (per-route, not the
 *      homepage fallback) → confirms slim-map lookup + HTMLRewriter ran.
 *
 * Exits 1 on any failure so the GitHub Action marks the deploy as broken.
 *
 * Usage:
 *   VERIFY_BASE_URL=https://xtsy.one bunx tsx scripts/verifyEdgeRewrite.ts
 *   VERIFY_SAMPLE_SIZE=20 bunx tsx scripts/verifyEdgeRewrite.ts
 */
import fs from "fs";
import path from "path";

const BASE = (process.env.VERIFY_BASE_URL || "https://xtsy.one").replace(/\/$/, "");
const SAMPLE = Math.max(1, parseInt(process.env.VERIFY_SAMPLE_SIZE || "20", 10));
const PUBLIC = path.resolve(process.cwd(), "public");

function collectSitemapUrls(): string[] {
  const branches = fs
    .readdirSync(PUBLIC)
    .filter((f) => /^sitemap-.+\.xml$/.test(f));
  const urls = new Set<string>();
  for (const f of branches) {
    const xml = fs.readFileSync(path.join(PUBLIC, f), "utf-8");
    const re = /<loc>([^<]+)<\/loc>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml))) urls.add(m[1].trim());
  }
  return [...urls];
}

function pickSample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

async function probe(url: string) {
  const res = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": "XTSY-EdgeVerifier/1.0" },
  });
  const html = await res.text();
  const canonical =
    html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] ?? "";
  return {
    url,
    status: res.status,
    renderedBy: res.headers.get("x-rendered-by") || "",
    seoEntry: res.headers.get("x-seo-entry") || "",
    canonical,
  };
}

(async () => {
  const all = collectSitemapUrls();
  if (!all.length) {
    console.error("❌ no sitemap URLs discovered under /public");
    process.exit(1);
  }
  const sample = pickSample(all, SAMPLE);
  console.log(`🔎 Probing ${sample.length} of ${all.length} URLs against ${BASE}\n`);

  const fails: string[] = [];
  const results: Array<Awaited<ReturnType<typeof probe>>> = [];

  for (const u of sample) {
    try {
      const target = u.startsWith("http") ? u : `${BASE}${u.startsWith("/") ? "" : "/"}${u}`;
      const r = await probe(target);
      results.push(r);

      const okStatus = r.status >= 200 && r.status < 300;
      const okRender = r.renderedBy === "cf-edge-rewrite" || r.renderedBy === "cf-bot-rewrite";
      const expected = target.replace(/\/$/, "");
      const got = r.canonical.replace(/\/$/, "");
      const okCanonical = got === expected;

      const verdict = okStatus && okRender && okCanonical ? "✅" : "❌";
      console.log(
        `${verdict} ${r.status} rendered=${r.renderedBy || "MISSING"} entry=${r.seoEntry} canonical=${r.canonical || "MISSING"}\n    ${target}`,
      );
      if (!(okStatus && okRender && okCanonical)) fails.push(target);
    } catch (e) {
      console.error(`❌ fetch error for ${u}:`, e instanceof Error ? e.message : e);
      fails.push(u);
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`Total probed   : ${results.length}`);
  console.log(`Passed         : ${results.length - fails.length}`);
  console.log(`Failed         : ${fails.length}`);
  console.log(
    `cf-edge-rewrite: ${results.filter((r) => r.renderedBy === "cf-edge-rewrite").length}`,
  );
  console.log(
    `cf-bot-rewrite : ${results.filter((r) => r.renderedBy === "cf-bot-rewrite").length}`,
  );

  if (fails.length) {
    console.error(`\n❌ ${fails.length} URL(s) failed verification.`);
    process.exit(1);
  }
  console.log(`\n✅ Edge rewrite live and per-route canonicals match.`);
})();
