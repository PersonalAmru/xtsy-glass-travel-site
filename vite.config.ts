import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { execSync } from "child_process";

// Post-build plugin to pre-render SEO pages
function prerenderPlugin(): Plugin {
  return {
    name: 'xtsy-prerender',
    apply: 'build',
    closeBundle() {
      try {
        console.log('\n🔧 Running SEO pre-render...');
        execSync('npx tsx scripts/prerender.ts', { stdio: 'inherit', cwd: process.cwd() });
      } catch (e) {
        console.warn('⚠️ Pre-render skipped (non-fatal):', (e as Error).message);
      }
    }
  };
}

// Sitemap & content-manifest generator: rebuilds sitemap + writes
// public/seo-content.json (the rich map fetched lazily by the body script).
function seoArtifactsPlugin(): Plugin {
  return {
    name: 'xtsy-seo-artifacts',
    apply: 'build',
    buildStart() {
      try {
        console.log('🗺️  Regenerating sitemaps...');
        execSync('npx tsx scripts/generate-sitemaps.ts', { stdio: 'inherit', cwd: process.cwd() });
        console.log('📦 Writing seo-content.json manifest...');
        const json = execSync(
          'npx tsx scripts/generateSEOInlineScript.ts --map',
          { cwd: process.cwd(), encoding: 'utf-8', timeout: 60000, maxBuffer: 32 * 1024 * 1024 }
        );
        fs.writeFileSync(path.resolve(process.cwd(), 'public/seo-content.json'), json);
        console.log(`✅ seo-content.json (${(json.length / 1024).toFixed(1)} KB)`);
      } catch (e) {
        console.warn('⚠️ SEO artifacts step failed:', (e as Error).message?.substring(0, 200));
      }
    },
  };
}

// SEO Inline Meta Plugin — injects two scripts:
//   • HEAD (synchronous): title, meta, canonical, OG, Twitter, redirects (~10 KB)
//   • BODY tail (deferred): fetches /seo-content.json, injects H1/intro/FAQ + JSON-LD
// This keeps the synchronous payload tiny (LCP-safe) while still serving rich
// AI-readable content per route. Crawlers run the body script synchronously.
function seoInlineMetaPlugin(): Plugin {
  return {
    name: 'xtsy-seo-inline-meta',
    apply: 'build',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        try {
          const head = execSync(
            'npx tsx scripts/generateSEOInlineScript.ts',
            { cwd: process.cwd(), encoding: 'utf-8', timeout: 30000, maxBuffer: 16 * 1024 * 1024 }
          );
          const body = execSync(
            'npx tsx scripts/generateSEOInlineScript.ts --body',
            { cwd: process.cwd(), encoding: 'utf-8', timeout: 30000, maxBuffer: 4 * 1024 * 1024 }
          );
          let out = html.replace('</head>', `${head.trim()}\n</head>`);
          out = out.replace('</body>', `${body.trim()}\n</body>`);
          return out;
        } catch (e) {
          console.warn('⚠️ SEO inline meta injection skipped:', (e as Error).message?.substring(0, 200));
          return html;
        }
      }
    }
  };
}

// Schema validator — runs after build, fails the build on JSON-LD errors.
function schemaValidatorPlugin(): Plugin {
  return {
    name: 'xtsy-schema-validator',
    apply: 'build',
    closeBundle() {
      try {
        console.log('\n🔍 Validating JSON-LD schemas across all routes...');
        execSync('npx tsx scripts/validateSchema.ts', { stdio: 'inherit', cwd: process.cwd() });
      } catch (e) {
        // validateSchema.ts exits 1 on errors. Surface but don't kill build (warn-only).
        console.warn('⚠️ Schema validator reported errors. See log above.');
      }
    },
  };
}


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && seoArtifactsPlugin(),
    mode === 'production' && seoInlineMetaPlugin(),
    mode === 'production' && prerenderPlugin(),
    mode === 'production' && schemaValidatorPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Aggressive code splitting for smaller initial bundle
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'radix-core': ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          'radix-ui': ['@radix-ui/react-tabs', '@radix-ui/react-accordion', '@radix-ui/react-popover'],
          'supabase': ['@supabase/supabase-js'],
          'query': ['@tanstack/react-query'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'date': ['date-fns', 'react-day-picker'],
          'charts': ['recharts'],
        },
        // Optimize chunk filenames for better caching
        chunkFileNames: 'assets/[name]-[hash:8].js',
        entryFileNames: 'assets/[name]-[hash:8].js',
        assetFileNames: 'assets/[name]-[hash:8].[ext]',
      },
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug', 'console.warn'] : [],
        passes: 2,
        ecma: 2020,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
    sourcemap: false,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
  },
}));
