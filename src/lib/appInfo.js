/* global __APP_VERSION__, __APP_BUILD__, __APP_UPDATED_AT__ */

/**
 * Информация о текущей сборке. Значения подставляет Vite при сборке
 * (см. define в vite.config.js), поэтому в приложении они всегда актуальны.
 */

function readGlobal(value, fallback) {
  return typeof value === 'string' && value ? value : fallback
}

export const APP_VERSION = readGlobal(__APP_VERSION__, '0.0.0')
export const APP_BUILD = readGlobal(__APP_BUILD__, '')
export const APP_UPDATED_AT = readGlobal(__APP_UPDATED_AT__, '')

export function formatBuildDate(iso) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}
