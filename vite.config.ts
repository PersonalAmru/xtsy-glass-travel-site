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
