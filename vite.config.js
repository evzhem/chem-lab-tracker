import { readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { LATEST_RELEASE } from './src/data/changelog.js'

const isCapacitor = process.env.CAPACITOR === '1'
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

// Номер сборки и ссылка на APK подставляются в version.json
// (см. .github/workflows/deploy.yml и build-apk.yml)
const APP_BUILD = process.env.APP_BUILD || ''
const APP_APK_URL =
  process.env.APP_APK_URL ||
  'https://github.com/evzhem/chem-lab-tracker/releases/download/apk-latest/ChemLabTracker.apk'

/**
 * Публикует version.json рядом с приложением: по нему приложение при запуске
 * проверяет, нет ли новой версии, и показывает окно обновления.
 */
function versionPayload() {
  return {
    version: pkg.version,
    build: APP_BUILD,
    releasedAt: new Date().toISOString(),
    title: LATEST_RELEASE?.title || '',
    notes: LATEST_RELEASE?.notes || [],
    apkUrl: APP_APK_URL,
  }
}

function versionFile() {
  const body = () => `${JSON.stringify(versionPayload(), null, 2)}\n`
  return {
    name: 'chemlab-version-file',
    // в режиме разработки файл отдаётся тем же адресом, что и в собранном виде
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.includes('version.json')) return next()
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        res.end(body())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: body() })
    },
  }
}

export default defineConfig({
  // GitHub Pages needs the repo base; Android WebView needs relative paths.
  base: isCapacitor ? './' : '/chem-lab-tracker/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD__: JSON.stringify(APP_BUILD),
    __APP_UPDATED_AT__: JSON.stringify(new Date().toISOString()),
    __APP_APK_URL__: JSON.stringify(APP_APK_URL),
    __APP_IS_NATIVE__: JSON.stringify(isCapacitor),
  },
  plugins: [
    react(),
    tailwindcss(),
    versionFile(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'ChemLab Tracker',
        short_name: 'ChemLab',
        description:
          'Справочник по химии: реакции, таблица Менделеева, растворимость, молярная масса, дневник опытов',
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
            // версия и обновления всегда берутся из сети
            urlPattern: ({ url }) => url.pathname.endsWith('version.json'),
            handler: 'NetworkOnly',
          },
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
