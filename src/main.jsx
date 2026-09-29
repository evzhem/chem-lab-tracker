import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './lib/ThemeProvider.jsx'
import { UpdateProvider } from './lib/UpdateProvider.jsx'
import { registerServiceWorker } from './lib/pwa.js'
import './index.css'
import App from './App.jsx'

registerServiceWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UpdateProvider>
        <App />
      </UpdateProvider>
    </ThemeProvider>
  </StrictMode>,
)
