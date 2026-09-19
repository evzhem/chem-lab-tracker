import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/chem-lab-tracker/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    // Arena / e2b preview hosts are dynamic: <port>-<id>.e2b.app
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
