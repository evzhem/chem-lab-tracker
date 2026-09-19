import { Download, Share, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'

const APK_URL =
  'https://github.com/evzhem/chem-lab-tracker/releases/download/apk-latest/ChemLabTracker.apk'
const RELEASES_URL = 'https://github.com/evzhem/chem-lab-tracker/releases/tag/apk-latest'

export default function Install() {
  const [deferred, setDeferred] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(ios)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    setIsStandalone(standalone)
    setInstalled(standalone)

    function onBip(e) {
      e.preventDefault()
      setDeferred(e)
    }
    function onInstalled() {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBip)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function installPwa() {
    if (!deferred) return
    deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
    setDeferred(null)
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-violet-600/40 to-slate-900/80 p-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-500/30 text-4xl shadow-lg shadow-violet-900/40">
          ⚗️
        </div>
        <h2 className="font-serif text-3xl text-violet-50">ChemLab Tracker</h2>
        <p className="mt-2 text-sm text-violet-200/80">
          Для тех, кому нужно больше, чем в школьной программе — и всё это бесплатно
        </p>
        <ul className="mt-5 space-y-2 text-left text-sm text-violet-100/90">
          {[
            'Полная таблица Менделеева и карточки элементов',
            'Таблица растворимости с числами',
            'Калькулятор молярной массы и растворов',
            'База реакций и справочные схемы',
            'Дневник опытов офлайн',
            'Без рекламы и без подписки',
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-violet-300">✦</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {isStandalone || installed ? (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-sm text-emerald-100">
          Приложение уже установлено на этом устройстве.
        </p>
      ) : (
        <>
          {deferred && (
            <button
              type="button"
              onClick={installPwa}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 py-3.5 font-medium shadow-lg shadow-violet-900/40"
            >
              <Smartphone size={18} />
              Установить на телефон (PWA)
            </button>
          )}

          {isIOS && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              <p className="mb-2 flex items-center gap-2 font-medium text-violet-100">
                <Share size={16} /> Установка на iPhone / iPad
              </p>
              <ol className="list-decimal space-y-1 pl-5 text-violet-200/80">
                <li>Откройте сайт в Safari</li>
                <li>Нажмите «Поделиться» ⌂</li>
                <li>Выберите «На экран „Домой“»</li>
              </ol>
            </div>
          )}

          {!deferred && !isIOS && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-violet-200/80">
              <p className="font-medium text-violet-100">Установка из браузера</p>
              <p className="mt-1">
                В Chrome / Edge: меню ⋮ → «Установить приложение» или «Добавить на главный экран».
              </p>
            </div>
          )}
        </>
      )}

      <div className="rounded-2xl border border-violet-400/25 bg-violet-500/10 p-4">
        <p className="mb-1 flex items-center gap-2 font-medium">
          <Download size={18} /> APK для Android
        </p>
        <p className="mb-3 text-sm text-violet-200/75">
          Скачайте установочный файл с GitHub Releases и установите (разрешите установку из
          неизвестных источников).
        </p>
        <a
          href={APK_URL}
          className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 py-3 text-sm font-medium"
        >
          <Download size={16} />
          Скачать ChemLabTracker.apk
        </a>
        <a
          href={RELEASES_URL}
          target="_blank"
          rel="noreferrer"
          className="block text-center text-xs text-violet-300 underline"
        >
          Страница релизов на GitHub
        </a>
      </div>

      <p className="text-center text-[11px] text-violet-300/40">
        Open source · MIT · без оплаты и без Pro-экранов
      </p>
    </div>
  )
}
