#!/usr/bin/env npx ts-node

/**
 * Supabase Storage Asset Audit Script
 * 
 * Analyzes bucket contents and code references to identify:
 * - Orphaned assets (in bucket but not referenced in code)
 * - Top 50 largest assets by size
 * - Missing assets (referenced in code but not in bucket)
 * 
 * Usage:
 * export SUPABASE_URL=https://your-project.supabase.co
 * export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 * export SB_BUCKET=xtsy-gallery-assets
 * npx ts-node scripts/audit-supabase-assets.ts [--delete-orphans]
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Environment configuration
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SB_BUCKET = process.env.SB_BUCKET || 'xtsy-gallery-assets';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('- SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// CLI arguments
const DELETE_ORPHANS = process.argv.includes('--delete-orphans');

interface AssetInfo {
  name: string;
  size: number;
  lastModified: string;
  url: string;
}

interface AuditResults {
  totalAssets: number;
  totalSize: number;
  referencedAssets: Set<string>;
  orphanedAssets: AssetInfo[];
  topAssets: AssetInfo[];
  missingAssets: string[];
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx', '.css', '.html']): string[] {
  const files: string[] = [];
  
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
function extractStorageUrls(content: string): string[] {
  const urls: string[] = [];
  
  // Match Supabase storage URLs
  const supabaseUrlRegex = /https:\/\/[^"'\s]+supabase\.co\/storage\/v1\/object\/public\/[^"'\s]+/g;
  const matches = content.match(supabaseUrlRegex);
  
  if (matches) {
    urls.push(...matches);
  }
  
  return urls;
}

/**
 * Scan codebase for Supabase Storage references
 */
function scanCodebaseForAssets(): Set<string> {
  console.log('🔍 Scanning codebase for asset references...');
  
  const referencedUrls = new Set<string>();
  const sourceFiles = scanDirectory('src');
  const publicFiles = scanDirectory('public');
  const rootFiles = ['index.html', 'README.md'].filter(f => fs.existsSync(f));
  
  const allFiles = [...sourceFiles, ...publicFiles, ...rootFiles];
  
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const urls = extractStorageUrls(content);
      
      for (const url of urls) {
        // Extract filename from URL
        const filename = decodeURIComponent(url.split('/').pop() || '');
        if (filename) {
          referencedUrls.add(filename);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not read ${filePath}:`, error);
    }
  }
  
  console.log(`📊 Found ${referencedUrls.size} unique asset references`);
  return referencedUrls;
}

/**
 * Recursively list all files in bucket with metadata
 */
async function listAllAssetsWithMetadata(prefix = ''): Promise<AssetInfo[]> {
  const assets: AssetInfo[] = [];
  
  const { data: files, error } = await supabase.storage
    .from(SB_BUCKET)
    .list(prefix, {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' }
    });
    
  if (error) {
    throw new Error(`Error listing files: ${error.message}`);
  }
  
  if (!files) {
    return assets;
  }
  
  for (const file of files) {
    if (!file.name) continue;
    
    const fullPath = prefix ? `${prefix}/${file.name}` : file.name;
    
    if (file.id === null) {
      // This is a folder, recurse into it
      assets.push(...await listAllAssetsWithMetadata(fullPath));
    } else {
      // This is a file
      const url = `${SUPABASE_URL}/storage/v1/object/public/${SB_BUCKET}/${fullPath}`;
      
      assets.push({
        name: fullPath,
        size: file.metadata?.size || 0,
        lastModified: file.updated_at || file.created_at || '',
        url
      });
    }
  }
  
  return assets;
}

/**
 * Delete orphaned assets (with confirmation)
 */
async function deleteOrphans(orphans: AssetInfo[]): Promise<void> {
  if (orphans.length === 0) {
    console.log('✨ No orphaned assets to delete');
    return;
  }
  
  console.log(`\n🗑️  Deleting ${orphans.length} orphaned assets...`);
  
  let deletedCount = 0;
  let failedCount = 0;
  
  for (const asset of orphans) {
    try {
      const { error } = await supabase.storage
        .from(SB_BUCKET)
        .remove([asset.name]);
        
      if (error) {
        console.error(`❌ Failed to delete ${asset.name}:`, error.message);
        failedCount++;
      } else {
        console.log(`✅ Deleted: ${asset.name}`);
        deletedCount++;
      }
    } catch (error) {
      console.error(`❌ Error deleting ${asset.name}:`, error);
      failedCount++;
    }
  }
  
  console.log(`\n📊 Deletion complete: ${deletedCount} deleted, ${failedCount} failed`);
}

/**
 * Write CSV report files
 */
function writeReports(results: AuditResults): void {
  // Orphaned assets CSV
  if (results.orphanedAssets.length > 0) {
    const orphansCsv = [
      'filename,size_bytes,size_mb,last_modified,url',
      ...results.orphanedAssets.map(asset => 
        `"${asset.name}",${asset.size},${(asset.size / 1024 / 1024).toFixed(2)},"${asset.lastModified}","${asset.url}"`
      )
    ].join('\n');
    
    fs.writeFileSync('supabase-orphans.csv', orphansCsv);
    console.log(`📄 Orphaned assets report: supabase-orphans.csv`);
  }
  
  // Top 50 largest assets CSV
  if (results.topAssets.length > 0) {
    const topAssetsCsv = [
      'filename,size_bytes,size_mb,last_modified,referenced,url',
      ...results.topAssets.map(asset => 
        `"${asset.name}",${asset.size},${(asset.size / 1024 / 1024).toFixed(2)},"${asset.lastModified}",${results.referencedAssets.has(asset.name)},"${asset.url}"`
      )
    ].join('\n');
    
    fs.writeFileSync('supabase-top50.csv', topAssetsCsv);
    console.log(`📄 Top 50 largest assets report: supabase-top50.csv`);
  }
  
  // Missing assets report
  if (results.missingAssets.length > 0) {
    const missingCsv = [
      'filename',
      ...results.missingAssets.map(asset => `"${asset}"`)
    ].join('\n');
    
    fs.writeFileSync('supabase-missing.csv', missingCsv);
    console.log(`📄 Missing assets report: supabase-missing.csv`);
  }
}

/**
 * Main audit function
 */
async function runAudit(): Promise<AuditResults> {
  console.log('🚀 Starting Supabase Storage Asset Audit');
  console.log(`📁 Bucket: ${SB_BUCKET}\n`);
  
  // Scan codebase for references
  const referencedAssets = scanCodebaseForAssets();
  
  // List all assets in bucket
  console.log('📋 Fetching bucket contents...');
  const allAssets = await listAllAssetsWithMetadata();
  
  console.log(`📊 Found ${allAssets.length} total assets in bucket`);
  
  // Calculate total size
  const totalSize = allAssets.reduce((sum, asset) => sum + asset.size, 0);
  
  // Find orphaned assets (in bucket but not referenced)
  const orphanedAssets = allAssets.filter(asset => 
    !referencedAssets.has(asset.name) && 
    !referencedAssets.has(path.basename(asset.name))
  );
  
  // Find top 50 largest assets
  const topAssets = [...allAssets]
    .sort((a, b) => b.size - a.size)
    .slice(0, 50);
  
  // Find missing assets (referenced but not in bucket)
  const bucketFilenames = new Set(allAssets.map(asset => asset.name));
  const bucketBasenames = new Set(allAssets.map(asset => path.basename(asset.name)));
  
  const missingAssets = Array.from(referencedAssets).filter(ref => 
    !bucketFilenames.has(ref) && !bucketBasenames.has(ref)
  );
  
  return {
    totalAssets: allAssets.length,
    totalSize,
    referencedAssets,
    orphanedAssets,
    topAssets,
    missingAssets
  };
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  try {
    const results = await runAudit();
    
    // Print summary
    console.log('\n📈 AUDIT SUMMARY');
    console.log('================');
    console.log(`Total assets: ${results.totalAssets}`);
    console.log(`Total size: ${(results.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Referenced assets: ${results.referencedAssets.size}`);
    console.log(`Orphaned assets: ${results.orphanedAssets.length}`);
    console.log(`Missing assets: ${results.missingAssets.length}`);
    
    if (results.orphanedAssets.length > 0) {
      const orphanSize = results.orphanedAssets.reduce((sum, asset) => sum + asset.size, 0);
      console.log(`Orphaned size: ${(orphanSize / 1024 / 1024).toFixed(2)} MB`);
    }
    
    // Write CSV reports
    writeReports(results);
    
    // Delete orphans if requested
    if (DELETE_ORPHANS && results.orphanedAssets.length > 0) {
      console.log(`\n⚠️  DELETE_ORPHANS flag detected`);
      console.log(`This will permanently delete ${results.orphanedAssets.length} orphaned assets!`);
      
      if (results.orphanedAssets.length > 10) {
        console.log('❌ Refusing to delete more than 10 assets without manual confirmation');
        console.log('Review supabase-orphans.csv and delete manually if needed');
      } else {
        await deleteOrphans(results.orphanedAssets);
      }
    }
    
    console.log('\n✅ Audit complete! Check CSV files for detailed reports.');
    
  } catch (error) {
    console.error('💥 Audit failed:', error);
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