#!/usr/bin/env node

/**
 * Supabase Storage Link Verification Script
 * 
 * Scans codebase for Supabase Storage URLs and verifies they exist
 * Fails if any links return 404 or 3xx (stale links create origin trips)
 * 
 * Usage:
 * node scripts/verify-storage-links.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Recursively scan directory for files
 */
function scanDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.html']) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...scanDirectory(fullPath, extensions));
    } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extract Supabase Storage URLs from file content
 */
function extractStorageUrls(content) {
  const urls = [];
  
  // Match Supabase storage URLs
  const supabaseUrlRegex = /https:\/\/[^"'\s]+supabase\.co\/storage\/v1\/object\/public\/[^"'\s]+/g;
  const matches = content.match(supabaseUrlRegex);
  
  if (matches) {
    urls.push(...matches);
  }
  
  return urls;
}

/**
 * Scan codebase for Supabase Storage URLs
 */
function scanCodebaseForUrls() {
  console.log('🔍 Scanning codebase for Supabase Storage URLs...');
  
  const foundUrls = new Set();
  const sourceFiles = scanDirectory('src');
  const publicFiles = scanDirectory('public');
  const rootFiles = ['index.html', 'README.md'].filter(f => fs.existsSync(f));
  
  const allFiles = [...sourceFiles, ...publicFiles, ...rootFiles];
  
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const urls = extractStorageUrls(content);
      
      for (const url of urls) {
        foundUrls.add(url);
      }
    } catch (error) {
      console.warn(`⚠️  Could not read ${filePath}:`, error.message);
    }
  }
  
  console.log(`📊 Found ${foundUrls.size} unique Supabase Storage URLs`);
  return Array.from(foundUrls);
}

/**
 * Check if URL is accessible (HEAD request)
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode >= 200 && res.statusCode < 300,
        redirect: res.statusCode >= 300 && res.statusCode < 400
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        status: 0,
        success: false,
        error: error.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        success: false,
        error: 'Request timeout'
      });
    });
    
    req.end();
  });
}

/**
 * Verify all URLs with parallel requests
 */
async function verifyUrls(urls) {
  console.log(`🔗 Verifying ${urls.length} URLs...`);
  
  const BATCH_SIZE = 10; // Process in batches to avoid overwhelming the server
  const results = [];
  
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    console.log(`⏳ Checking batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(urls.length / BATCH_SIZE)}`);
    
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
    
    // Add small delay between batches
    if (i + BATCH_SIZE < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Supabase Storage Link Verification\n');
  
  try {
    // Scan codebase for URLs
    const urls = scanCodebaseForUrls();
    
    if (urls.length === 0) {
      console.log('✅ No Supabase Storage URLs found');
      return;
    }
    
    // Verify all URLs
    const results = await verifyUrls(urls);
    
    // Analyze results
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success && !r.redirect);
    const redirected = results.filter(r => r.redirect);
    
    console.log('\n📊 VERIFICATION RESULTS');
    console.log('=======================');
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`🔄 Redirected: ${redirected.length}`);
    console.log(`📋 Total checked: ${results.length}`);
    
    // Report failures
    if (failed.length > 0) {
      console.log('\n❌ FAILED URLS:');
      failed.forEach(result => {
        console.log(`  ${result.url}`);
        console.log(`    Status: ${result.status || 'Network Error'}`);
        if (result.error) {
          console.log(`    Error: ${result.error}`);
        }
      });
    }
    
    // Report redirects (potential stale links)
    if (redirected.length > 0) {
      console.log('\n🔄 REDIRECTED URLS (potential stale links):');
      redirected.forEach(result => {
        console.log(`  ${result.url}`);
        console.log(`    Status: ${result.status}`);
      });
    }
    
    // Exit with error if any links are broken or redirected
    if (failed.length > 0 || redirected.length > 0) {
      console.log('\n💥 Link verification failed!');
      console.log('Broken or redirected links create unnecessary origin requests and increase egress costs.');
      console.log('Please fix the above URLs before deploying.');
      process.exit(1);
    }
    
    console.log('\n🎉 All Supabase Storage links verified successfully!');
    
  } catch (error) {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
}