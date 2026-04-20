import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'MD Reader',
        short_name: 'MD Reader',
        description: 'A markdown reader web app',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1976d2',
      },
      pwaAssets: {
        image: "public/favicon.png",
      }
    })
  ],
  base: process.env.BASE_URL || '/',
})
