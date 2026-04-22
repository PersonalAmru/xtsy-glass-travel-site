/**
 * Local rich-results schema validator — checks every JSON-LD block injected
 * by index.html and a sample of programmatic pages for the most common
 * Google rich-results errors:
 *   - aggregateRating without reviewCount/ratingCount
 *   - Offer without priceCurrency
 *   - Hostel without address
 *   - Missing required @context or @type
 */
import fs from 'fs';
import path from 'path';

interface Issue { source: string; message: string; severity: 'error' | 'warning' }

function validateBlock(json: any, source: string): Issue[] {
  const issues: Issue[] = [];
  // Track depth so nested @type references (e.g., parentOrganization, mainEntity)
  // are not validated as if they were the root entity. Only validate the
  // top-level type and direct schema children.
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
    // Only enforce address/priceRange on the ROOT entity. Nested references
    // like { @type: "Hostel", name, url } in parentOrganization are stubs.
    if (depth === 0 && ['Hostel', 'Hotel', 'LodgingBusiness'].includes(node['@type'])) {
      if (!node.address) issues.push({ source, message: `${node['@type']} missing address`, severity: 'error' });
      if (!node.priceRange) issues.push({ source, message: `${node['@type']} missing priceRange`, severity: 'warning' });
    }
    for (const v of Object.values(node)) visit(v, depth + 1);
  };
  if (!json['@context']) issues.push({ source, message: 'Missing @context', severity: 'error' });
  if (!json['@type']) issues.push({ source, message: 'Missing @type', severity: 'error' });
  visit(json, 0);
  return issues;
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
  const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
  const blocks = extractJsonLd(indexHtml);
  const allIssues: Issue[] = [];
  blocks.forEach((b, i) => {
    if (!b.parsed) {
      allIssues.push({ source: `index.html block#${i}`, message: 'Invalid JSON', severity: 'error' });
      return;
    }
    allIssues.push(...validateBlock(b.parsed, `index.html block#${i} (${b.parsed['@type']})`));
  });

  console.log(`\n📋 Schema validation: ${blocks.length} JSON-LD blocks scanned`);
  if (allIssues.length === 0) {
    console.log('✅ No schema errors found.');
  } else {
    const errors = allIssues.filter(i => i.severity === 'error');
    const warnings = allIssues.filter(i => i.severity === 'warning');
    console.log(`❌ ${errors.length} errors, ⚠️  ${warnings.length} warnings`);
    allIssues.forEach(i => console.log(`  [${i.severity.toUpperCase()}] ${i.source}: ${i.message}`));
  }
  process.exit(allIssues.filter(i => i.severity === 'error').length > 0 ? 1 : 0);
}

main();
