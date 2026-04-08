import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";
import { execSync } from "child_process";
import { STATIC_ROUTES } from "./scripts/generate-prerender-routes";

// Collect all SEO slugs at config time for pre-rendering
function getAllPrerenderRoutes(): string[] {
  try {
    // Use tsx to extract slugs from the SEO data at build time
    const result = execSync(
      'npx tsx -e "import{ALL_SEO_PAGES}from\'./src/data/seoPages\';console.log(JSON.stringify(ALL_SEO_PAGES.map(p=>\'/\'+p.slug)))"',
      { encoding: 'utf-8', cwd: process.cwd(), timeout: 30000 }
    ).trim();
    const seoRoutes: string[] = JSON.parse(result);
    return [...new Set([...STATIC_ROUTES, ...seoRoutes])];
  } catch (e) {
    console.warn('⚠️ Could not load SEO routes, using static routes only:', (e as Error).message);
    return STATIC_ROUTES;
  }
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
    mode === 'production' && prerenderPlugin(),
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
    chunkSizeWarningLimit: 500, // Stricter limit for smaller bundles
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug', 'console.warn'] : [],
        passes: 2, // Multiple compression passes
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
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
    reportCompressedSize: false, // Faster builds
  },
  // Enable dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
  },
}));
