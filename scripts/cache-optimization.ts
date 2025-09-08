/**
 * Cache optimization script for EU/GDPR compliant asset delivery
 * Sets optimal cache headers for public assets
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://oidnydyyjyjfnyadhyzn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Asset types and their optimal cache settings
const CACHE_POLICIES = {
  // Static assets - long cache with immutable content
  images: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'],
    cacheControl: 'public, max-age=31536000, immutable', // 1 year
    contentTypes: {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg', 
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    }
  },
  
  // Fonts - long cache
  fonts: {
    extensions: ['.woff', '.woff2', '.ttf', '.otf', '.eot'],
    cacheControl: 'public, max-age=31536000, immutable',
    contentTypes: {
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.otf': 'font/otf',
      '.eot': 'application/vnd.ms-fontobject'
    }
  },
  
  // Documents - medium cache
  documents: {
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
    cacheControl: 'public, max-age=86400', // 1 day
    contentTypes: {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  },
  
  // Media files - long cache
  media: {
    extensions: ['.mp4', '.mp3', '.wav', '.mov', '.avi'],
    cacheControl: 'public, max-age=2592000', // 30 days
    contentTypes: {
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo'
    }
  }
};

/**
 * Get cache policy for file extension
 */
function getCachePolicy(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  
  for (const [categoryName, policy] of Object.entries(CACHE_POLICIES)) {
    if (policy.extensions.includes(ext)) {
      return {
        cacheControl: policy.cacheControl,
        contentType: policy.contentTypes[ext] || 'application/octet-stream',
        category: categoryName
      };
    }
  }
  
  // Default policy for unknown file types
  return {
    cacheControl: 'public, max-age=3600', // 1 hour
    contentType: 'application/octet-stream',
    category: 'unknown'
  };
}

/**
 * Update cache control for Supabase storage objects
 */
async function updateStorageCache(bucketName: string) {
  console.log(`\n🗄️ Updating cache settings for bucket: ${bucketName}`);
  
  try {
    // List all files in the bucket
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

    if (listError) {
      console.error(`Error listing files in bucket ${bucketName}:`, listError);
      return;
    }

    if (!files || files.length === 0) {
      console.log(`No files found in bucket ${bucketName}`);
      return;
    }

    console.log(`Found ${files.length} files to optimize`);

    let optimized = 0;
    let errors = 0;

    for (const file of files) {
      try {
        const policy = getCachePolicy(file.name);
        
        console.log(`📁 ${file.name} (${policy.category}) -> ${policy.cacheControl}`);
        
        // Update the file's cache control headers
        const { error: updateError } = await supabase.storage
          .from(bucketName)
          .update(file.name, file.name, {
            cacheControl: policy.cacheControl,
            contentType: policy.contentType
          });

        if (updateError) {
          console.error(`  ❌ Error updating ${file.name}:`, updateError);
          errors++;
        } else {
          optimized++;
        }

        // Rate limiting to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`  ❌ Error processing ${file.name}:`, error);
        errors++;
      }
    }

    console.log(`\n✅ Optimization complete for ${bucketName}:`);
    console.log(`   📈 Optimized: ${optimized} files`);
    console.log(`   ❌ Errors: ${errors} files`);

  } catch (error) {
    console.error(`Fatal error updating cache for bucket ${bucketName}:`, error);
  }
}

/**
 * Optimize local public assets (for static hosting)
 */
function optimizeLocalAssets() {
  console.log('\n🏠 Analyzing local public assets...');
  
  const publicDir = path.join(process.cwd(), 'public');
  
  if (!fs.existsSync(publicDir)) {
    console.log('No public directory found, skipping local optimization');
    return;
  }

  const recommendations = [];
  
  function scanDirectory(dir: string, basePath = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const relativePath = path.join(basePath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath, relativePath);
      } else {
        const policy = getCachePolicy(file);
        const sizeKB = Math.round(stat.size / 1024);
        
        recommendations.push({
          file: relativePath,
          size: `${sizeKB} KB`,
          category: policy.category,
          cacheControl: policy.cacheControl,
          contentType: policy.contentType
        });
      }
    }
  }
  
  scanDirectory(publicDir);
  
  if (recommendations.length === 0) {
    console.log('No assets found in public directory');
    return;
  }

  console.log(`\n📊 Cache recommendations for ${recommendations.length} assets:`);
  
  // Group by category
  const byCategory = recommendations.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof recommendations>);

  for (const [category, items] of Object.entries(byCategory)) {
    console.log(`\n📁 ${category.toUpperCase()} (${items.length} files):`);
    items.forEach(item => {
      console.log(`   ${item.file} (${item.size}) -> ${item.cacheControl}`);
    });
  }

  // Write cache headers configuration for various hosting platforms
  writeHostingConfigs(recommendations);
}

/**
 * Write cache configuration files for different hosting platforms
 */
function writeHostingConfigs(recommendations: any[]) {
  console.log('\n📝 Writing hosting configuration files...');

  // Netlify _headers file
  const netlifyHeaders = ['# Cache optimization headers\n'];
  
  for (const [category, policy] of Object.entries(CACHE_POLICIES)) {
    const extensions = policy.extensions.join(',');
    netlifyHeaders.push(`# ${category} assets`);
    netlifyHeaders.push(`/*${extensions}`);
    netlifyHeaders.push(`  Cache-Control: ${policy.cacheControl}`);
    netlifyHeaders.push('');
  }

  fs.writeFileSync(path.join(process.cwd(), 'public/_headers'), netlifyHeaders.join('\n'));
  console.log('✅ Created public/_headers (Netlify)');

  // Vercel vercel.json headers
  const vercelConfig = {
    headers: Object.entries(CACHE_POLICIES).map(([category, policy]) => ({
      source: `/*.(${policy.extensions.map(ext => ext.substring(1)).join('|')})`,
      headers: [
        {
          key: 'Cache-Control',
          value: policy.cacheControl
        }
      ]
    }))
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'vercel-headers.json'), 
    JSON.stringify(vercelConfig, null, 2)
  );
  console.log('✅ Created vercel-headers.json (Vercel)');

  // Apache .htaccess
  const htaccess = ['# Cache optimization for Apache\n'];
  htaccess.push('<IfModule mod_expires.c>');
  htaccess.push('  ExpiresActive On');
  
  for (const [category, policy] of Object.entries(CACHE_POLICIES)) {
    htaccess.push(`  # ${category} assets`);
    policy.extensions.forEach(ext => {
      const maxAge = policy.cacheControl.match(/max-age=(\d+)/)?.[1] || '3600';
      const seconds = parseInt(maxAge);
      const days = Math.round(seconds / 86400);
      htaccess.push(`  ExpiresByType ${policy.contentTypes[ext]} "access plus ${days} days"`);
    });
  }
  
  htaccess.push('</IfModule>');
  
  fs.writeFileSync(path.join(process.cwd(), 'htaccess-example'), htaccess.join('\n'));
  console.log('✅ Created htaccess-example (Apache)');
}

/**
 * Main optimization function
 */
async function main() {
  console.log('🚀 Starting cache optimization for EU/GDPR compliance...');
  console.log('📅 Timestamp:', new Date().toISOString());
  
  // Optimize Supabase storage buckets
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error);
  } else if (buckets && buckets.length > 0) {
    for (const bucket of buckets) {
      await updateStorageCache(bucket.name);
    }
  } else {
    console.log('No storage buckets found');
  }
  
  // Optimize local assets
  optimizeLocalAssets();
  
  console.log('\n🎉 Cache optimization completed successfully!');
  console.log('📚 Next steps:');
  console.log('   1. Deploy the hosting configuration files');
  console.log('   2. Test cache headers using browser dev tools');
  console.log('   3. Monitor cache hit rates in your CDN/hosting platform');
  console.log('   4. Run this script periodically when assets change');
}

// Run the optimization
if (import.meta.main) {
  main().catch(console.error);
}

export { main as optimizeCache, getCachePolicy, CACHE_POLICIES };