import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import UpdateDialog from '../components/UpdateDialog.jsx'
import { APP_BUILD, APP_VERSION } from './appInfo.js'
import { UpdateContext } from './update-context.js'
import { IS_NATIVE, UPDATE_STATE, checkForUpdate, openApk, postponeVersion } from './updates.js'
import { applyWebUpdate } from './pwa.js'

const RECHECK_AFTER_MS = 30 * 60 * 1000

/**
 * Проверка обновлений при запуске приложения.
 *
 * Пользователю ничего не показывается, пока обновления нет.
 * Если версия новее — открывается окно с описанием обновления и кнопками
 * «Позже» / «Обновить», а на главном экране появляется карточка обновления.
 */
export function UpdateProvider({ children }) {
  const [result, setResult] = useState(null)
  const [info, setInfo] = useState(null)
  const [state, setState] = useState(UPDATE_STATE.idle)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState('')
  const lastCheckRef = useRef(0)
  const busyRef = useRef(false)

  const runCheck = useCallback(async ({ silent = false } = {}) => {
    if (busyRef.current) return null
    busyRef.current = true
    lastCheckRef.current = Date.now()
    setState(UPDATE_STATE.checking)
    try {
      const found = await checkForUpdate()
      setState(UPDATE_STATE.ready)
      setError('')
      setResult(found)
      setInfo(found.updateAvailable && !found.postponed ? { ...found, isNative: IS_NATIVE } : null)
      return found
    } catch {
      // нет сети или файла версии — приложение работает как обычно
      setState(UPDATE_STATE.error)
      if (!silent) setError('Не удалось проверить обновления. Проверьте подключение к сети.')
      return null
    } finally {
      busyRef.current = false
    }
  }, [])

  // проверка при запуске приложения — с небольшой задержкой,
  // чтобы не мешать первому отображению интерфейса
  useEffect(() => {
    const timer = setTimeout(() => {
      runCheck({ silent: true })
    }, 1200)
    return () => clearTimeout(timer)
  }, [runCheck])

  // при возврате в приложение из фона проверяем ещё раз (не чаще 30 минут)
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastCheckRef.current < RECHECK_AFTER_MS) return
      runCheck({ silent: true })
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
  }, [runCheck])

  /** «Позже» — окно закрывается, версия запоминается */
  const dismiss = useCallback(() => {
    setInfo((current) => {
      if (current?.version) postponeVersion(current.version)
      return null
    })
    setResult((current) => (current ? { ...current, postponed: true } : current))
  }, [])

  /** Показать окно обновления (например, с карточки на главной) */
  const open = useCallback(() => {
    setResult((current) => {
      if (current?.updateAvailable) setInfo({ ...current, isNative: IS_NATIVE })
      return current
    })
  }, [])

  const applyUpdate = useCallback(async () => {
    const current = info && info.updateAvailable ? info : result
    if (!current?.updateAvailable) return false
    setApplying(true)
    setError('')
    // помечаем версию, чтобы при запуске не показывать то же окно повторно
    postponeVersion(current.version)

    if (IS_NATIVE) {
      const ok = openApk(current.apkUrl || '')
      setApplying(false)
      if (!ok) {
        setError('Ссылка на новую версию недоступна. Попробуйте позже.')
        setInfo({ ...current, isNative: true })
        return false
      }
      setInfo(null)
      return true
    }

    // веб-версия: активируем новый service worker и перезагружаем страницу
    applyWebUpdate()
    return true
  }, [info, result])

  const value = useMemo(
    () => ({
      info,
      result,
      state,
      error,
      applying,
      version: APP_VERSION,
      build: APP_BUILD,
      hasUpdate: Boolean(result?.updateAvailable),
      postponed: Boolean(result?.postponed),
      check: runCheck,
      dismiss,
      open,
      applyUpdate,
    }),
    [info, result, state, error, applying, runCheck, dismiss, open, applyUpdate],
  )

  return (
    <UpdateContext.Provider value={value}>
      {children}
      <UpdateDialog
        info={info}
        onPostpone={dismiss}
        onUpdate={applyUpdate}
        applying={applying}
        error={error}
      />
    </UpdateContext.Provider>
  )
}
