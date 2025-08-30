#!/usr/bin/env npx ts-node

/**
 * Supabase Storage Cache Control Script
 * 
 * Sets long-term cache headers for all public objects:
 * Cache-Control: public, max-age=31536000, immutable
 * 
 * Usage:
 * export SUPABASE_URL=https://your-project.supabase.co
 * export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 * export SB_BUCKET=xtsy-gallery-assets
 * npx ts-node scripts/storage-cache-control.ts
 */

import { createClient } from '@supabase/supabase-js';

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

// Optimal cache control header for static assets
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

/**
 * Update cache control for a single file
 */
async function updateFileCache(filename: string): Promise<boolean> {
  try {
    // Get current file to preserve other metadata
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(SB_BUCKET)
      .download(filename);
      
    if (downloadError) {
      console.error(`❌ Error downloading ${filename}:`, downloadError.message);
      return false;
    }
    
    // Determine content type based on file extension
    const extension = filename.toLowerCase().split('.').pop();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'css':
        contentType = 'text/css';
        break;
      case 'js':
        contentType = 'application/javascript';
        break;
      case 'json':
        contentType = 'application/json';
        break;
    }
    
    // Re-upload with updated cache control headers
    const { error: uploadError } = await supabase.storage
      .from(SB_BUCKET) 
      .upload(filename, fileData, {
        contentType,
        cacheControl: CACHE_CONTROL,
        upsert: true
      });
      
    if (uploadError) {
      console.error(`❌ Error updating cache for ${filename}:`, uploadError.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to update cache for ${filename}:`, error);
    return false;
  }
}

/**
 * Recursively list all files in bucket
 */
async function listAllFiles(prefix = '', allFiles: string[] = []): Promise<string[]> {
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
    return allFiles;
  }
  
  for (const file of files) {
    if (!file.name) continue;
    
    const fullPath = prefix ? `${prefix}/${file.name}` : file.name;
    
    if (file.id === null) {
      // This is a folder, recurse into it
      await listAllFiles(fullPath, allFiles);
    } else {
      // This is a file
      allFiles.push(fullPath);
    }
  }
  
  return allFiles;
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log('🚀 Starting Supabase Storage Cache Control Update');
  console.log(`📁 Bucket: ${SB_BUCKET}`);
  console.log(`🕒 Cache-Control: ${CACHE_CONTROL}\n`);
  
  try {
    // Get all files recursively
    console.log('📋 Fetching complete file list...');
    const allFiles = await listAllFiles();
    
    if (allFiles.length === 0) {
      console.log('📄 No files found in bucket');
      return;
    }
    
    console.log(`📊 Found ${allFiles.length} files to update:`);
    
    // Process files in batches to avoid rate limits
    const BATCH_SIZE = 10;
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
      const batch = allFiles.slice(i, i + BATCH_SIZE);
      console.log(`\n🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allFiles.length / BATCH_SIZE)}`);
      
      // Process batch in parallel
      const batchPromises = batch.map(async (filename) => {
        const success = await updateFileCache(filename);
        if (success) {
          console.log(`  ✅ Updated: ${filename}`);
          return true;
        } else {
          console.log(`  ❌ Failed: ${filename}`);
          return false;
        }
      });
      
      const results = await Promise.all(batchPromises);
      successCount += results.filter(Boolean).length;
      failureCount += results.filter(r => !r).length;
      
      // Add delay between batches
      if (i + BATCH_SIZE < allFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\n🎉 Cache control update complete!`);
    console.log(`✅ Successfully updated: ${successCount} files`);
    console.log(`❌ Failed to update: ${failureCount} files`);
    
    if (failureCount > 0) {
      console.log(`\n⚠️  Some files failed to update. Check errors above.`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Script failed:', error);
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