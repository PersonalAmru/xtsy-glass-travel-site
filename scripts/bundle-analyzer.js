#!/usr/bin/env node

/**
 * Bundle Analyzer Script for CI/CD
 * 
 * Analyzes bundle size and fails if any chunk exceeds size limits
 * Helps prevent performance regressions in CI
 * 
 * Usage:
 * npm run build && node scripts/bundle-analyzer.js
 */

const fs = require('fs');
const path = require('path');
const { gzipSync } = require('zlib');

// Size limits (in KB)
const LIMITS = {
  SINGLE_CHUNK_GZIP: 300, // Max 300KB gzipped per chunk
  TOTAL_JS_GZIP: 1000,    // Max 1MB total JS gzipped
  SINGLE_CSS_GZIP: 50,    // Max 50KB CSS gzipped
  SINGLE_IMAGE: 500       // Max 500KB per image
};

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Math.round(stats.size / 1024);
  } catch {
    return 0;
  }
}

/**
 * Get gzipped size in KB
 */
function getGzippedSizeKB(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const gzipped = gzipSync(content);
    return Math.round(gzipped.length / 1024);
  } catch {
    return 0;
  }
}

/**
 * Recursively find files in directory
 */
function findFiles(dir, extensions) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, extensions));
    } else if (extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Analyze bundle sizes
 */
function analyzeBundles() {
  console.log('🔍 Analyzing bundle sizes...\n');
  
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory not found. Run `npm run build` first.');
    process.exit(1);
  }
  
  // Find all assets
  const jsFiles = findFiles(distDir, ['.js']);
  const cssFiles = findFiles(distDir, ['.css']);
  const imageFiles = findFiles(distDir, ['.jpg', '.jpeg', '.png', '.webp', '.svg']);
  
  let hasViolations = false;
  const violations = [];
  
  // Analyze JavaScript files
  console.log('📦 JavaScript Files:');
  let totalJsGzipped = 0;
  
  for (const file of jsFiles) {
    const originalKB = getFileSizeKB(file);
    const gzippedKB = getGzippedSizeKB(file);
    const filename = path.relative(distDir, file);
    
    totalJsGzipped += gzippedKB;
    
    console.log(`  ${filename}: ${originalKB}KB (${gzippedKB}KB gzipped)`);
    
    if (gzippedKB > LIMITS.SINGLE_CHUNK_GZIP) {
      hasViolations = true;
      violations.push(`${filename} exceeds single chunk limit: ${gzippedKB}KB > ${LIMITS.SINGLE_CHUNK_GZIP}KB`);
    }
  }
  
  console.log(`  Total JS (gzipped): ${totalJsGzipped}KB\n`);
  
  if (totalJsGzipped > LIMITS.TOTAL_JS_GZIP) {
    hasViolations = true;
    violations.push(`Total JS exceeds limit: ${totalJsGzipped}KB > ${LIMITS.TOTAL_JS_GZIP}KB`);
  }
  
  // Analyze CSS files
  if (cssFiles.length > 0) {
    console.log('🎨 CSS Files:');
    
    for (const file of cssFiles) {
      const originalKB = getFileSizeKB(file);
      const gzippedKB = getGzippedSizeKB(file);
      const filename = path.relative(distDir, file);
      
      console.log(`  ${filename}: ${originalKB}KB (${gzippedKB}KB gzipped)`);
      
      if (gzippedKB > LIMITS.SINGLE_CSS_GZIP) {
        hasViolations = true;
        violations.push(`${filename} exceeds CSS limit: ${gzippedKB}KB > ${LIMITS.SINGLE_CSS_GZIP}KB`);
      }
    }
    console.log('');
  }
  
  // Analyze image files
  if (imageFiles.length > 0) {
    console.log('🖼️  Image Files:');
    let totalImageKB = 0;
    
    for (const file of imageFiles) {
      const sizeKB = getFileSizeKB(file);
      const filename = path.relative(distDir, file);
      
      totalImageKB += sizeKB;
      
      console.log(`  ${filename}: ${sizeKB}KB`);
      
      if (sizeKB > LIMITS.SINGLE_IMAGE) {
        hasViolations = true;
        violations.push(`${filename} exceeds image limit: ${sizeKB}KB > ${LIMITS.SINGLE_IMAGE}KB`);
      }
    }
    
    console.log(`  Total Images: ${totalImageKB}KB\n`);
  }
  
  // Summary
  console.log('📊 BUNDLE ANALYSIS SUMMARY');
  console.log('==========================');
  console.log(`JavaScript chunks: ${jsFiles.length}`);
  console.log(`CSS files: ${cssFiles.length}`);
  console.log(`Image files: ${imageFiles.length}`);
  console.log(`Total JS (gzipped): ${totalJsGzipped}KB`);
  
  if (hasViolations) {
    console.log('\n❌ SIZE LIMIT VIOLATIONS:');
    violations.forEach(violation => {
      console.log(`  • ${violation}`);
    });
    
    console.log('\n💡 OPTIMIZATION SUGGESTIONS:');
    console.log('  • Use dynamic imports for large components');
    console.log('  • Split vendor libraries into separate chunks');
    console.log('  • Compress images using WebP format');
    console.log('  • Remove unused dependencies');
    console.log('  • Enable tree shaking');
    
    process.exit(1);
  } else {
    console.log('\n✅ All bundle sizes are within limits!');
  }
}

/**
 * Generate bundle report for GitHub Actions
 */
function generateReport() {
  const distDir = path.join(process.cwd(), 'dist');
  const jsFiles = findFiles(distDir, ['.js']);
  const cssFiles = findFiles(distDir, ['.css']);
  
  let totalJsGzipped = 0;
  let totalCssGzipped = 0;
  
  jsFiles.forEach(file => {
    totalJsGzipped += getGzippedSizeKB(file);
  });
  
  cssFiles.forEach(file => {
    totalCssGzipped += getGzippedSizeKB(file);
  });
  
  const report = {
    timestamp: new Date().toISOString(),
    totalJsKB: totalJsGzipped,
    totalCssKB: totalCssGzipped,
    jsChunks: jsFiles.length,
    cssFiles: cssFiles.length,
    limits: LIMITS
  };
  
  // Write report for CI
  fs.writeFileSync('bundle-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Bundle report saved to bundle-report.json');
}

/**
 * Main execution
 */
function main() {
  try {
    analyzeBundles();
    
    // Generate report if in CI environment
    if (process.env.CI) {
      generateReport();
    }
    
  } catch (error) {
    console.error('💥 Bundle analysis failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}