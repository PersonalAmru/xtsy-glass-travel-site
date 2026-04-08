#!/usr/bin/env node
/**
 * Upload pre-rendered HTML pages to Cloudflare KV
 * 
 * Prerequisites:
 *   npm install -g wrangler
 *   wrangler login
 * 
 * Usage:
 *   1. First build the site:  npm run build
 *   2. Then run prerender:    npx tsx scripts/prerender.ts
 *   3. Then upload to KV:     node cloudflare/upload-to-kv.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const KV_NAMESPACE = 'PRERENDER_CACHE'; // Must match wrangler.toml binding

function findHTMLFiles(dir, basePath = '') {
  const entries = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`❌ dist/ directory not found. Run "npm run build" first.`);
    process.exit(1);
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.join(basePath, item.name);
    
    if (item.isDirectory()) {
      // Skip asset directories
      if (item.name === 'assets') continue;
      entries.push(...findHTMLFiles(fullPath, relativePath));
    } else if (item.name === 'index.html' && basePath !== '') {
      // This is a pre-rendered page (not the root index.html)
      const kvKey = '/' + basePath.replace(/\\/g, '/');
      entries.push({ key: kvKey, filePath: fullPath });
    }
  }
  
  return entries;
}

function main() {
  console.log('🔍 Scanning dist/ for pre-rendered pages...\n');
  
  const pages = findHTMLFiles(DIST_DIR);
  
  if (pages.length === 0) {
    console.log('⚠️  No pre-rendered pages found. Run prerender first:');
    console.log('   npx tsx scripts/prerender.ts');
    process.exit(1);
  }

  console.log(`📦 Found ${pages.length} pre-rendered pages to upload.\n`);

  // Create bulk upload JSON file
  const bulkData = pages.map(({ key, filePath }) => ({
    key,
    value: fs.readFileSync(filePath, 'utf-8'),
  }));

  const bulkFile = path.join(__dirname, 'kv-bulk.json');
  fs.writeFileSync(bulkFile, JSON.stringify(bulkData));

  console.log(`📤 Uploading ${pages.length} pages to KV...`);
  
  try {
    execSync(
      `wrangler kv:bulk put --binding=${KV_NAMESPACE} "${bulkFile}"`,
      { stdio: 'inherit', cwd: __dirname }
    );
    console.log(`\n✅ Successfully uploaded ${pages.length} pages to Cloudflare KV!`);
  } catch (err) {
    console.error('\n❌ Upload failed. Make sure wrangler is configured:');
    console.error('   wrangler login');
    console.error('   Update wrangler.toml with your KV namespace ID');
  } finally {
    // Clean up bulk file
    if (fs.existsSync(bulkFile)) fs.unlinkSync(bulkFile);
  }

  // Print summary
  console.log('\n📋 Uploaded routes:');
  pages.slice(0, 10).forEach(p => console.log(`   ${p.key}`));
  if (pages.length > 10) console.log(`   ... and ${pages.length - 10} more`);
}

main();
