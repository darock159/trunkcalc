
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/ryan-urban-forestry.png","icons/app-icon-192.png","icons/app-icon-512.png"],
      manifest: {
        name: "Trunkcalc",
        short_name: "Trunkcalc",
        description: "Ryan Trunkcalc, mobile injection rate calculator.",
        theme_color: "#1F4D33",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          { "src": "/icons/app-icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
          { "src": "/icons/app-icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
        ]
      },
      workbox: { globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"] }
    })
  ]
});
