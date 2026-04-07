import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    proxy: {
      "/manga-api": {
        target: "https://api.mangadex.org",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/manga-api/, ""),
      },
    },
  },
})
