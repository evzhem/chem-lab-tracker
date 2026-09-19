import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import UpdateDialog from '../components/UpdateDialog.jsx'
import { APP_BUILD, APP_VERSION } from './appInfo.js'
import { UpdateContext } from './update-context.js'
import { IS_NATIVE, UPDATE_STATE, checkForUpdate, openApk, postponeVersion } from './updates.js'
import { applyWebUpdate } from './pwa.js'

const RECHECK_AFTER_MS = 30 * 60 * 1000

/**
 * Тихая проверка обновлений при входе в приложение.
 *
 * Пользователю ничего не показывается, пока обновления нет.
 * Если версия на сервере новее — открывается окно с описанием
 * обновления и кнопками «Позже» / «Обновить».
 */
export function UpdateProvider({ children }) {
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
      const result = await checkForUpdate()
      setState(UPDATE_STATE.ready)
      setError('')
      const shouldShow = result.updateAvailable && (!result.postponed || !silent)
      setInfo(shouldShow ? { ...result, isNative: IS_NATIVE } : null)
      return result
    } catch {
      // нет сети или файла версии — приложение работает как обычно
      setState(UPDATE_STATE.error)
      if (!silent) setError('Не удалось проверить обновления. Проверьте подключение к сети.')
      return null
    } finally {
      busyRef.current = false
    }
  }, [])

  // проверка при запуске приложения — с небольшой задержкой, чтобы
  // не мешать первому отображению интерфейса
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

  const dismiss = useCallback(() => {
    setInfo((current) => {
      if (current?.version) postponeVersion(current.version)
      return null
    })
  }, [])

  const applyUpdate = useCallback(async () => {
    const current = info
    if (!current) return false
    setApplying(true)
    setError('')
    // запоминаем, что пользователь уже обновился, чтобы при запуске
    // не показывать то же окно повторно
    postponeVersion(current.version)

    if (current.isNative) {
      const ok = openApk(current.apkUrl)
      setApplying(false)
      if (!ok) {
        setError('Ссылка на новую версию недоступна. Попробуйте позже.')
        return false
      }
      setInfo(null)
      return true
    }

    // веб-версия: активируем новый service worker и перезагружаем страницу
    applyWebUpdate()
    return true
  }, [info])

  const value = useMemo(
    () => ({
      info,
      state,
      error,
      applying,
      version: APP_VERSION,
      build: APP_BUILD,
      check: runCheck,
      dismiss,
      applyUpdate,
    }),
    [info, state, error, applying, runCheck, dismiss, applyUpdate],
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
