import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: true,
      port: Number(env.VITE_DEV_PORT || 5173),
      open: false,
      strictPort: false,
    },
    build: {
      target: "es2022",
      outDir: "dist",
      sourcemap: mode !== "production",
      chunkSizeWarningLimit: 1200,
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    esbuild: {
      legalComments: "none",
    },
    optimizeDeps: {
      include: ["@supabase/supabase-js"],
    },
  };
});
