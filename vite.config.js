import { defineConfig } from "vite";
import handlebars from "./vite-plugin-handlebars-precompile.js";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@styles": resolve(__dirname, "src/styles"),
      "@core": resolve(__dirname, "src/core"),
    },
  },
  root: resolve(__dirname, "src"),
  build: {
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
      },
    },
    emptyOutDir: true,
  },
  plugins: [handlebars()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@styles/helpers' as *;`,
      },
    },
  },
});
