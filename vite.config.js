import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const isCapacitor = process.env.CAPACITOR === '1'

export default defineConfig({
  // GitHub Pages needs the repo base; Android WebView needs relative paths.
  base: isCapacitor ? './' : '/chem-lab-tracker/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'ChemLab Tracker',
        short_name: 'ChemLab',
        description:
          'Бесплатный справочник химии: реакции, таблица Менделеева, растворимость, молярная масса, дневник опытов',
        theme_color: '#1e1033',
        background_color: '#0f1219',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: isCapacitor ? './' : '/chem-lab-tracker/',
        start_url: isCapacitor ? './' : '/chem-lab-tracker/',
        lang: 'ru',
        categories: ['education', 'utilities'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: isCapacitor ? 'index.html' : '/chem-lab-tracker/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: { cacheName: 'pages' },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
