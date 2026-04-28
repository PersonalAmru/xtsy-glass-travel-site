/**
 * JSON-LD Schema Validator — runs over EVERY SEO route in the registry.
 *
 * For each route it simulates the entity + FAQPage JSON-LD blocks the
 * runtime injection script would emit, then validates them against Google's
 * rich-result requirements. Errors fail the build (process.exit 1).
 *
 * Catches:
 *  - Missing @context / @type
 *  - FAQPage without mainEntity, or with empty Question/Answer
 *  - Hostel/Hotel/LodgingBusiness without address (root only)
 *  - AggregateRating without ratingValue + reviewCount/ratingCount
 *  - Offer without priceCurrency / price
 *  - Empty / non-string name / description
 *  - URL malformed
 */
import fs from 'fs';
import path from 'path';

interface Issue {
  source: string;
  message: string;
  severity: 'error' | 'warning';
}

const SITE_URL = 'https://xtsy.one';

function validateBlock(json: any, source: string): Issue[] {
  const issues: Issue[] = [];

  if (!json['@context']) {
    issues.push({ source, message: 'Missing @context', severity: 'error' });
  }
  if (!json['@type']) {
    issues.push({ source, message: 'Missing @type', severity: 'error' });
  }

  // FAQPage-specific checks
  if (json['@type'] === 'FAQPage') {
    const me = json.mainEntity;
    if (!Array.isArray(me) || me.length === 0) {
      issues.push({ source, message: 'FAQPage has no mainEntity entries', severity: 'error' });
    } else {
      me.forEach((q: any, i: number) => {
        if (q['@type'] !== 'Question') {
          issues.push({ source, message: `FAQ[${i}] missing @type Question`, severity: 'error' });
        }
        if (!q.name || typeof q.name !== 'string' || q.name.length < 5) {
          issues.push({ source, message: `FAQ[${i}] question text missing/too short`, severity: 'error' });
        }
        const ans = q.acceptedAnswer;
        if (!ans || ans['@type'] !== 'Answer' || !ans.text || typeof ans.text !== 'string' || ans.text.length < 5) {
          issues.push({ source, message: `FAQ[${i}] missing/invalid acceptedAnswer`, severity: 'error' });
        }
      });
    }
  }

  // Generic name/description quality (root-level entities)
  if (json['@type'] && json['@type'] !== 'FAQPage' && json['@type'] !== 'BreadcrumbList') {
    if (!json.name || typeof json.name !== 'string' || json.name.length < 3) {
      issues.push({ source, message: `${json['@type']} name missing/too short`, severity: 'warning' });
    }
    if (!json.description || typeof json.description !== 'string' || json.description.length < 20) {
      issues.push({ source, message: `${json['@type']} description missing/too short`, severity: 'warning' });
    }
    if (json.url && !/^https?:\/\//.test(json.url)) {
      issues.push({ source, message: `${json['@type']} url is not absolute`, severity: 'error' });
    }
  }

  // Walk nested nodes for AggregateRating / Offer / address rules
  const visit = (node: any, depth: number) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(n => visit(n, depth)); return; }
    if (node['@type'] === 'AggregateRating') {
      if (!node.reviewCount && !node.ratingCount) {
        issues.push({ source, message: 'AggregateRating missing reviewCount/ratingCount', severity: 'error' });
      }
      if (!node.ratingValue) {
        issues.push({ source, message: 'AggregateRating missing ratingValue', severity: 'error' });
      }
    }
    if (node['@type'] === 'Offer') {
      if (!node.priceCurrency) issues.push({ source, message: 'Offer missing priceCurrency', severity: 'error' });
      if (!node.price) issues.push({ source, message: 'Offer missing price', severity: 'error' });
      if (!node.availability) issues.push({ source, message: 'Offer missing availability', severity: 'warning' });
    }
    if (depth === 0 && ['Hostel', 'Hotel', 'LodgingBusiness'].includes(node['@type'])) {
      if (!node.address) issues.push({ source, message: `${node['@type']} root missing address`, severity: 'warning' });
    }
    for (const v of Object.values(node)) visit(v, depth + 1);
  };
  visit(json, 0);

  return issues;
}

/** Mirror what the runtime body script injects per route. */
function buildRouteBlocks(slug: string, e: any): any[] {
  const url = `${SITE_URL}/${slug}`;
  const blocks: any[] = [];
  // Entity block
  blocks.push({
    '@context': 'https://schema.org',
    '@type': e.s || 'WebPage',
    name: e.h || e.t,
    description: e.d,
    url,
  });
  // FAQ block (only if FAQs present)
  if (e.f && e.f.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: e.f.map((q: [string, string]) => ({
        '@type': 'Question',
        name: q[0],
        acceptedAnswer: { '@type': 'Answer', text: q[1] },
      })),
    });
  }
  return blocks;
}

function extractJsonLd(html: string): { raw: string; parsed: any | null }[] {
  const blocks: { raw: string; parsed: any | null }[] = [];
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = regex.exec(html))) {
    try { blocks.push({ raw: m[1], parsed: JSON.parse(m[1]) }); }
    catch { blocks.push({ raw: m[1], parsed: null }); }
  }
  return blocks;
}

async function main() {
  const allIssues: Issue[] = [];
  let totalBlocks = 0;
  let routesChecked = 0;

  // 1) Validate static blocks already in index.html
  const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
    const blocks = extractJsonLd(indexHtml);
    blocks.forEach((b, i) => {
      totalBlocks++;
      if (!b.parsed) {
        allIssues.push({ source: `index.html#${i}`, message: 'Invalid JSON', severity: 'error' });
        return;
      }
      allIssues.push(...validateBlock(b.parsed, `index.html#${i} (${b.parsed['@type']})`));
    });
  }

  // 2) Validate every route's runtime-injected blocks via the SEO map
  const { generateSEOMap } = await import('./generateSEOInlineScript');
  const map = generateSEOMap();
  const slugs = Object.keys(map);
  console.log(`\n📋 Validating JSON-LD for ${slugs.length} routes...`);

  for (const slug of slugs) {
    const e = map[slug];
    const blocks = buildRouteBlocks(slug, e);
    routesChecked++;
    blocks.forEach(b => {
      totalBlocks++;
      allIssues.push(...validateBlock(b, `route:/${slug} (${b['@type']})`));
    });
  }

  // 3) Sample 10 prerendered HTML files (if dist exists) for end-to-end check
  const distDir = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    const sampleSlugs = slugs.filter(s => !s.includes('/')).slice(0, 10);
    for (const slug of sampleSlugs) {
      const file = path.join(distDir, slug, 'index.html');
      if (!fs.existsSync(file)) continue;
      const html = fs.readFileSync(file, 'utf-8');
      const blocks = extractJsonLd(html);
      blocks.forEach((b, i) => {
        totalBlocks++;
        if (!b.parsed) {
          allIssues.push({ source: `dist/${slug}/index.html#${i}`, message: 'Invalid JSON', severity: 'error' });
          return;
        }
        allIssues.push(...validateBlock(b.parsed, `dist/${slug}#${i} (${b.parsed['@type']})`));
      });
    }
  }

  const errors = allIssues.filter(i => i.severity === 'error');
  const warnings = allIssues.filter(i => i.severity === 'warning');

  console.log(`\n📊 Summary`);
  console.log(`   Routes checked  : ${routesChecked}`);
  console.log(`   Blocks scanned  : ${totalBlocks}`);
  console.log(`   Errors          : ${errors.length}`);
  console.log(`   Warnings        : ${warnings.length}`);

  // -----------------------------------------------------------------------
  // Optional artifact: HTML + JSON report (--report <dir>)
  // -----------------------------------------------------------------------
  const reportFlagIdx = process.argv.indexOf('--report');
  if (reportFlagIdx !== -1) {
    const reportDir = path.resolve(process.cwd(), process.argv[reportFlagIdx + 1] || 'dist/seo-reports');
    fs.mkdirSync(reportDir, { recursive: true });
    const json = {
      generatedAt: new Date().toISOString(),
      routesChecked,
      totalBlocks,
      errors: errors.length,
      warnings: warnings.length,
      issues: allIssues,
    };
    fs.writeFileSync(path.join(reportDir, 'schema-report.json'), JSON.stringify(json, null, 2));

    const escape = (s: string) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
    const routeFromSource = (src: string) => {
      const m = src.match(/route:\/([^\s(]+)/) || src.match(/dist\/([^#\s]+)/);
      return m ? m[1].replace(/\/index\.html$/, '') : '';
    };
    const rows = allIssues.map(i => {
      const slug = routeFromSource(i.source);
      const link = slug ? `<a href="https://xtsy.one/${slug}" target="_blank" rel="noopener">/${slug}</a>` : '<em>—</em>';
      return `<tr class="${i.severity}"><td>${i.severity.toUpperCase()}</td><td>${link}</td><td>${escape(i.source)}</td><td>${escape(i.message)}</td></tr>`;
    }).join('\n');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>XTSY SEO Schema Report</title>
<style>
body{font:14px/1.5 -apple-system,Segoe UI,sans-serif;margin:24px;color:#0f172a;background:#f8fafc}
h1{margin:0 0 8px}small{color:#64748b}
table{border-collapse:collapse;width:100%;margin-top:16px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.06)}
th,td{padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:left;vertical-align:top;font-size:13px}
th{background:#f1f5f9;position:sticky;top:0}
tr.error td:first-child{color:#b91c1c;font-weight:600}
tr.warning td:first-child{color:#b45309;font-weight:600}
.summary{display:flex;gap:16px;margin:12px 0}
.summary div{padding:8px 12px;background:#fff;border-radius:6px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
a{color:#2563eb;text-decoration:none}a:hover{text-decoration:underline}
</style></head><body>
<h1>XTSY SEO Schema Report</h1>
<small>Generated ${json.generatedAt}</small>
<div class="summary">
  <div><strong>${routesChecked}</strong> routes</div>
  <div><strong>${totalBlocks}</strong> JSON-LD blocks</div>
  <div style="color:#b91c1c"><strong>${errors.length}</strong> errors</div>
  <div style="color:#b45309"><strong>${warnings.length}</strong> warnings</div>
</div>
<table><thead><tr><th>Sev</th><th>Route</th><th>Source</th><th>Message</th></tr></thead>
<tbody>${rows || '<tr><td colspan="4">✅ No issues</td></tr>'}</tbody></table>
</body></html>`;
    fs.writeFileSync(path.join(reportDir, 'schema-report.html'), html);
    console.log(`📝 Report: ${reportDir}/schema-report.html`);
    console.log(`📝 Report: ${reportDir}/schema-report.json`);
  }

  if (allIssues.length === 0) {
    console.log('\n✅ All JSON-LD blocks valid.');
    process.exit(0);
  }

  // Print first 50 issues to keep build log readable
  const MAX_PRINT = 50;
  allIssues.slice(0, MAX_PRINT).forEach(i =>
    console.log(`  [${i.severity.toUpperCase().padEnd(7)}] ${i.source}: ${i.message}`)
  );
  if (allIssues.length > MAX_PRINT) {
    console.log(`  ... and ${allIssues.length - MAX_PRINT} more issues`);
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('❌ Schema validator fatal:', err);
  process.exit(1);
});
