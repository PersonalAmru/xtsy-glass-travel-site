#!/usr/bin/env npx ts-node

/**
 * Supabase Storage Image Optimization Script
 * 
 * Generates and uploads responsive image variants:
 * - _thumb.jpg (~150w, JPEG low quality)
 * - _sm.webp (~400w, WebP q≈70) 
 * - _md.webp (~800w, WebP q≈75)
 * 
 * Usage:
 * export SUPABASE_URL=https://your-project.supabase.co
 * export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 * export SB_BUCKET=xtsy-gallery-assets
 * npx ts-node scripts/optimize-and-upload-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

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

interface ImageVariant {
  suffix: string;
  width: number;
  quality: number;
  format: 'jpeg' | 'webp';
}

// Image variant configurations
const VARIANTS: ImageVariant[] = [
  { suffix: '_thumb', width: 150, quality: 40, format: 'jpeg' },
  { suffix: '_sm', width: 400, quality: 70, format: 'webp' },
  { suffix: '_md', width: 800, quality: 75, format: 'webp' }
];

/**
 * Check if file is an image that should be optimized
 */
function isOptimizableImage(filename: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const lowerFilename = filename.toLowerCase();
  
  // Skip if already a variant
  if (lowerFilename.includes('_thumb') || lowerFilename.includes('_sm') || lowerFilename.includes('_md')) {
    return false;
  }
  
  return imageExtensions.some(ext => lowerFilename.endsWith(ext));
}

/**
 * Generate base filename without extension
 */
function getBaseName(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex > -1 ? filename.substring(0, lastDotIndex) : filename;
}

/**
 * Download image from Supabase Storage
 */
async function downloadImage(filename: string): Promise<Buffer | null> {
  try {
    const { data, error } = await supabase.storage
      .from(SB_BUCKET)
      .download(filename);
      
    if (error) {
      console.error(`❌ Error downloading ${filename}:`, error.message);
      return null;
    }
    
    return Buffer.from(await data.arrayBuffer());
  } catch (error) {
    console.error(`❌ Failed to download ${filename}:`, error);
    return null;
  }
}

/**
 * Create optimized image variant using Sharp
 */
async function createVariant(imageBuffer: Buffer, variant: ImageVariant): Promise<Buffer> {
  let sharpInstance = sharp(imageBuffer)
    .resize(variant.width, undefined, {
      withoutEnlargement: true,
      fit: 'inside'
    });
    
  if (variant.format === 'webp') {
    sharpInstance = sharpInstance.webp({ quality: variant.quality });
  } else {
    sharpInstance = sharpInstance.jpeg({ quality: variant.quality });
  }
  
  return sharpInstance.toBuffer();
}

/**
 * Upload image variant to Supabase Storage
 */
async function uploadVariant(
  filename: string, 
  buffer: Buffer, 
  format: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(SB_BUCKET)
      .upload(filename, buffer, {
        contentType: format === 'webp' ? 'image/webp' : 'image/jpeg',
        cacheControl: '31536000', // 1 year cache
        upsert: true
      });
      
    if (error) {
      console.error(`❌ Error uploading ${filename}:`, error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error);
    return false;
  }
}

/**
 * Process single image and create all variants
 */
async function processImage(filename: string): Promise<void> {
  console.log(`🔄 Processing: ${filename}`);
  
  // Download original image
  const imageBuffer = await downloadImage(filename);
  if (!imageBuffer) {
    return;
  }
  
  const baseName = getBaseName(filename);
  let successCount = 0;
  
  // Create and upload each variant
  for (const variant of VARIANTS) {
    try {
      console.log(`  📐 Creating ${variant.suffix} variant (${variant.width}px)`);
      
      const variantBuffer = await createVariant(imageBuffer, variant);
      const extension = variant.format === 'webp' ? '.webp' : '.jpg';
      const variantFilename = `${baseName}${variant.suffix}${extension}`;
      
      const uploaded = await uploadVariant(variantFilename, variantBuffer, variant.format);
      if (uploaded) {
        successCount++;
        console.log(`  ✅ Uploaded: ${variantFilename}`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to create ${variant.suffix} variant:`, error);
    }
  }
  
  console.log(`📊 ${filename}: ${successCount}/${VARIANTS.length} variants created\n`);
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log('🚀 Starting Supabase Storage Image Optimization');
  console.log(`📁 Bucket: ${SB_BUCKET}`);
  console.log(`🔧 Variants: ${VARIANTS.map(v => v.suffix).join(', ')}\n`);
  
  try {
    // List all files in bucket
    console.log('📋 Fetching file list...');
    const { data: files, error } = await supabase.storage
      .from(SB_BUCKET)
      .list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });
      
    if (error) {
      console.error('❌ Error listing files:', error.message);
      process.exit(1);  
    }
    
    if (!files || files.length === 0) {
      console.log('📄 No files found in bucket');
      return;
    }
    
    // Filter for optimizable images
    const imagesToProcess = files
      .filter(file => file.name && isOptimizableImage(file.name))
      .map(file => file.name!);
      
    console.log(`🖼️  Found ${imagesToProcess.length} images to optimize:`);
    imagesToProcess.forEach(name => console.log(`  - ${name}`));
    console.log('');
    
    if (imagesToProcess.length === 0) {
      console.log('✨ No images need optimization');
      return;
    }
    
    // Process images sequentially to avoid overwhelming the API
    let processedCount = 0;
    for (const filename of imagesToProcess) {
      await processImage(filename);
      processedCount++;
      
      // Add small delay between files
      if (processedCount < imagesToProcess.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`🎉 Optimization complete! Processed ${processedCount} images`);
    console.log('💡 Run storage-cache-control.ts next to set long-term cache headers');
    
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