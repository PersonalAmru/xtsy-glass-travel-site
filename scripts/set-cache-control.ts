import { createClient } from '@supabase/supabase-js';

/**
 * EU-compliant cache optimization script
 * Sets long-lived Cache-Control headers on Supabase Storage assets
 * for improved performance and reduced egress costs
 */

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'xtsy-gallery-assets'; // Default bucket
const CACHE_CONTROL = 'public, max-age=31536000, immutable'; // 1 year cache

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables:');
  console.error('- SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Determine content type from file extension
 */
function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'pdf': 'application/pdf',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'txt': 'text/plain',
    'html': 'text/html'
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Update cache control for a single file
 */
async function updateFileCache(filename: string): Promise<boolean> {
  try {
    console.log(`Processing: ${filename}`);
    
    // Download the file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filename);

    if (downloadError) {
      console.error(`Failed to download ${filename}:`, downloadError.message);
      return false;
    }

    // Determine content type
    const contentType = getContentType(filename);
    
    // Re-upload with cache control headers
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileData, {
        cacheControl: CACHE_CONTROL,
        contentType,
        upsert: true
      });

    if (uploadError) {
      console.error(`Failed to update ${filename}:`, uploadError.message);
      return false;
    }

    console.log(`✓ Updated cache control for: ${filename}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
    return false;
  }
}

/**
 * List all files in the bucket recursively
 */
async function listAllFiles(prefix?: string, allFiles: string[] = []): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(prefix, {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }

    for (const item of data) {
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      
      if (item.id === null) {
        // This is a folder, recurse into it
        await listAllFiles(fullPath, allFiles);
      } else {
        // This is a file
        allFiles.push(fullPath);
      }
    }

    return allFiles;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  try {
    console.log(`🚀 Starting cache control optimization for bucket: ${BUCKET_NAME}`);
    console.log(`📋 Cache-Control header: ${CACHE_CONTROL}`);
    console.log('');

    // Get all files in the bucket
    const files = await listAllFiles();
    console.log(`📁 Found ${files.length} files to process`);
    console.log('');

    if (files.length === 0) {
      console.log('No files found in bucket');
      return;
    }

    // Process files in batches to avoid rate limiting
    const batchSize = 5;
    const batches = [];
    for (let i = 0; i < files.length; i += batchSize) {
      batches.push(files.slice(i, i + batchSize));
    }

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`\n📦 Processing batch ${i + 1}/${batches.length} (${batch.length} files)`);
      
      // Process batch in parallel
      const results = await Promise.all(
        batch.map(filename => updateFileCache(filename))
      );
      
      successCount += results.filter(Boolean).length;
      failureCount += results.filter(r => !r).length;
      
      // Small delay between batches
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n🎯 Cache Control Optimization Complete!');
    console.log(`✅ Successfully updated: ${successCount} files`);
    console.log(`❌ Failed to update: ${failureCount} files`);
    
    if (failureCount > 0) {
      console.log('\n⚠️  Some files failed to update. Check the error messages above.');
      process.exit(1);
    }
    
    console.log('\n💡 Next steps:');
    console.log('- Files are now cached for 1 year');
    console.log('- Consider versioning file names for updates');
    console.log('- Monitor CDN cache hit rates in your analytics');
    
  } catch (error) {
    console.error('❌ Cache optimization failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}