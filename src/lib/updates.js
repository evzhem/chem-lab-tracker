/* global __APP_APK_URL__, __APP_IS_NATIVE__ */
import { APP_VERSION } from './appInfo.js'

export const APK_URL = typeof __APP_APK_URL__ === 'string' ? __APP_APK_URL__ : ''
export const IS_NATIVE =
  (typeof __APP_IS_NATIVE__ === 'boolean' && __APP_IS_NATIVE__) ||
  (typeof window !== 'undefined' &&
    (window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'ionic:' ||
      window.Capacitor?.isNativePlatform?.() === true))

const SKIP_KEY = 'chemlab-update-later'

/** version.json лежит рядом с приложением (работает и на сайте, и в APK) */
const VERSION_PATH = `${import.meta.env.BASE_URL}version.json`

export const UPDATE_STATE = {
  idle: 'idle',
  checking: 'checking',
  ready: 'ready',
  error: 'error',
}

export function parseVersion(v) {
  return String(v || '')
    .split(/[.\-+]/)
    .map((n) => parseInt(n, 10) || 0)
}

/** 1 — a новее b, -1 — старее, 0 — совпадают */
export function compareVersions(a, b) {
  const x = parseVersion(a)
  const y = parseVersion(b)
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0)
    if (d) return d > 0 ? 1 : -1
  }
  return 0
}

export function readPostponed() {
  try {
    return localStorage.getItem(SKIP_KEY) || ''
  } catch {
    return ''
  }
}

export function postponeVersion(version) {
  try {
    localStorage.setItem(SKIP_KEY, version || '')
  } catch {
    /* приватный режим — просто не запомним */
  }
}

async function fetchVersionFile() {
  const res = await fetch(`${VERSION_PATH}?t=${Date.now()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * Тихая проверка обновлений: сравнивает версию приложения с версией на сервере.
 * Ничего не пишет пользователю — только возвращает результат.
 */
export async function checkForUpdate() {
  const remote = await fetchVersionFile()
  const comparison = compareVersions(remote.version, APP_VERSION)
  const postponed = readPostponed()
  return {
    updateAvailable: comparison > 0,
    postponed: comparison > 0 && postponed === remote.version,
    version: remote.version,
    build: remote.build || '',
    releasedAt: remote.releasedAt || '',
    title: remote.title || '',
    notes: Array.isArray(remote.notes) ? remote.notes : [],
    apkUrl: remote.apkUrl || APK_URL,
    current: APP_VERSION,
  }
}

/** Открывает ссылку на APK: в Android-сборке — системным браузером */
export function openApk(url) {
  if (!url) return false
  const opened = window.open(url, '_blank', 'noopener')
  if (!opened) window.location.href = url
  return true
}
