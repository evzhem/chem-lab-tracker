import { registerSW } from 'virtual:pwa-register'

let updateServiceWorker = null

/** Регистрирует service worker и запоминает функцию обновления */
export function registerServiceWorker() {
  updateServiceWorker = registerSW({ immediate: true })
}

/**
 * Применяет обновление веб-версии (PWA): активирует новую версию
 * service worker'а и перезагружает страницу.
 */
export function applyWebUpdate() {
  if (updateServiceWorker) {
    updateServiceWorker(true)
    return
  }
  window.location.reload()
}
