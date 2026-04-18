import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
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

// SEO Inline Meta Plugin — injects page-specific <title> and <meta> at build time
// so Google sees unique metadata for each of the 210+ pages on first crawl
function seoInlineMetaPlugin(): Plugin {
  return {
    name: 'xtsy-seo-inline-meta',
    apply: 'build',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        try {
          const result = execSync('npx tsx -e "import{generateInlineScript}from\'./scripts/generateSEOInlineScript\';console.log(generateInlineScript())"', {
            cwd: process.cwd(),
            encoding: 'utf-8',
            timeout: 30000,
          });
          // Inject the inline script right before </head>
          return html.replace('</head>', `${result.trim()}\n</head>`);
        } catch (e) {
          console.warn('⚠️ SEO inline meta injection skipped:', (e as Error).message?.substring(0, 100));
          return html;
        }
      }
    }
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
    mode === 'production' && seoInlineMetaPlugin(),
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
        manualChunks: (id: string) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react-core';
          if (id.includes('react-router')) return 'router';
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-popover')) return 'radix-core';
          if (id.includes('@radix-ui')) return 'radix-ui';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('@tanstack/react-query')) return 'query';
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('/zod/')) return 'forms';
          if (id.includes('date-fns') || id.includes('react-day-picker')) return 'date';
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('embla-carousel')) return 'carousel';
          if (id.includes('fuse.js')) return 'search';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('@sentry')) return 'sentry';
          if (id.includes('react-helmet-async')) return 'helmet';
          return 'vendor';
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
