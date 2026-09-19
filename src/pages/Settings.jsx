import {
  Check,
  Download,
  ExternalLink,
  FlaskConical,
  GitBranch,
  Palette,
  Share2,
  Smartphone,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import pkg from '../../package.json'
import { THEMES, useTheme } from '../lib/theme-context.js'
import { loadExperiments, saveExperiments } from '../lib/storage'

const SITE_URL = 'https://evzhem.github.io/chem-lab-tracker/'
const APK_URL =
  'https://github.com/evzhem/chem-lab-tracker/releases/download/apk-latest/ChemLabTracker.apk'
const RELEASES_URL = 'https://github.com/evzhem/chem-lab-tracker/releases'
const ACTIONS_URL = 'https://github.com/evzhem/chem-lab-tracker/actions/workflows/build-apk.yml'
const GITHUB_URL = 'https://github.com/evzhem/chem-lab-tracker'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [deferred, setDeferred] = useState(null)
  const [isIOS] = useState(
    () =>
      typeof navigator !== 'undefined' &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)),
  )
  const [standalone, setStandalone] = useState(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true),
  )
  const [journalCount, setJournalCount] = useState(() => loadExperiments().length)
  const [confirmClear, setConfirmClear] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    function onPrompt(e) {
      e.preventDefault()
      setDeferred(e)
    }
    function onInstalled() {
      setStandalone(true)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(t)
  }, [toast])

  async function installPwa() {
    if (!deferred) return
    deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === 'accepted') setStandalone(true)
    setDeferred(null)
  }

  async function shareApp() {
    const data = {
      title: 'ChemLab Tracker',
      text: 'Бесплатный справочник по химии: реакции, таблица Менделеева, растворимость, молярная масса, дневник опытов.',
      url: SITE_URL,
    }
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(data)
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(SITE_URL)
      setToast('Ссылка скопирована')
    } catch {
      setToast(SITE_URL)
    }
  }

  function clearJournal() {
    saveExperiments([])
    setJournalCount(0)
    setConfirmClear(false)
    setToast('Дневник очищен')
  }

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/35 via-violet-700/10 to-cyan-500/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-2xl shadow-lg shadow-violet-900/40">
            ⚗️
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-2xl leading-tight text-violet-50">ChemLab Tracker</h2>
            <p className="text-xs text-violet-200/75">
              Версия {pkg.version} · бесплатно, без рекламы и подписки
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Установка ---------- */}
      <Section icon={Smartphone} title="Установка приложения" tone="violet">
        {standalone ? (
          <p className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            <Check size={16} /> Приложение уже установлено на этом устройстве
          </p>
        ) : (
          <>
            {deferred && (
              <button
                type="button"
                onClick={installPwa}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 py-3 font-medium shadow-lg shadow-violet-900/40 active:scale-[0.99]"
              >
                <Smartphone size={18} /> Установить на телефон (PWA)
              </button>
            )}
            {isIOS && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                <p className="mb-1.5 font-medium text-violet-100">iPhone / iPad</p>
                <ol className="list-decimal space-y-1 pl-5 text-violet-200/80">
                  <li>Откройте сайт в Safari</li>
                  <li>Нажмите «Поделиться»</li>
                  <li>Выберите «На экран „Домой“»</li>
                </ol>
              </div>
            )}
            {!deferred && !isIOS && (
              <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-violet-200/80">
                В Chrome / Edge: меню ⋮ → «Установить приложение» или «Добавить на главный
                экран».
              </p>
            )}
          </>
        )}

        <a
          href={APK_URL}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 font-medium text-emerald-50 shadow-lg shadow-emerald-900/30 active:scale-[0.99]"
        >
          <Download size={18} /> Скачать APK для Android
        </a>
        <div className="grid grid-cols-2 gap-2">
          <LinkButton href={RELEASES_URL} icon={GitBranch} label="Все релизы" />
          <LinkButton href={ACTIONS_URL} icon={ExternalLink} label="Сборка APK" />
        </div>
        <p className="text-[11px] leading-relaxed text-violet-300/55">
          APK обновляется автоматически после каждой сборки в GitHub Actions. При установке
          поверх старой версии данные дневника сохраняются.
        </p>
      </Section>

      {/* ---------- Оформление ---------- */}
      <Section icon={Palette} title="Оформление" tone="cyan">
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => {
            const active = theme === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                aria-pressed={active}
                className={`rounded-2xl border p-3 text-left transition-colors ${
                  active
                    ? 'border-violet-400/60 bg-violet-500/15'
                    : 'border-white/10 bg-white/5 active:bg-white/10'
                }`}
              >
                <span className="mb-2 flex gap-1">
                  {t.swatch.map((c) => (
                    <span
                      key={c}
                      className="h-6 w-6 rounded-full border border-white/15"
                      style={{ background: c }}
                    />
                  ))}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-violet-50">
                  {t.label}
                  {active && <Check size={14} className="text-violet-300" />}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-violet-300/65">
                  {t.hint}
                </span>
              </button>
            )
          })}
        </div>
      </Section>

      {/* ---------- Данные ---------- */}
      <Section icon={Trash2} title="Дневник и данные" tone="rose">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <span className="text-violet-200/80">Записей в дневнике</span>
          <span className="font-medium tabular-nums">{journalCount}</span>
        </div>
        <button
          type="button"
          onClick={() => setConfirmClear(true)}
          disabled={journalCount === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 py-3 text-sm font-medium text-rose-100 active:scale-[0.99] disabled:opacity-40"
        >
          <Trash2 size={16} /> Очистить дневник
        </button>
        <button
          type="button"
          onClick={shareApp}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-violet-100 active:scale-[0.99]"
        >
          <Share2 size={16} /> Поделиться приложением
        </button>
        <LinkButton href={GITHUB_URL} icon={GitBranch} label="Открыть проект на GitHub" full />
      </Section>

      <Section icon={FlaskConical} title="О приложении" tone="slate">
        <ul className="space-y-1.5 text-sm text-violet-200/80">
          <li>· Полный доступ ко всем разделам, без Pro-экранов</li>
          <li>· Работает офлайн после первого открытия</li>
          <li>· Открытый исходный код, лицензия MIT</li>
        </ul>
        <a
          href={SITE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-violet-300 underline"
        >
          evzhem.github.io/chem-lab-tracker <ExternalLink size={12} />
        </a>
      </Section>

      {confirmClear && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
          onClick={(e) => e.target === e.currentTarget && setConfirmClear(false)}
          role="presentation"
        >
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-5">
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="font-semibold">Очистить дневник?</h3>
              <button type="button" onClick={() => setConfirmClear(false)} aria-label="Закрыть">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-violet-200/80">
              Будут удалены все записи опытов ({journalCount}) с этого устройства. Действие
              необратимо.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="flex-1 rounded-xl bg-white/10 py-3 text-sm"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={clearJournal}
                className="flex-1 rounded-xl bg-rose-500 py-3 text-sm font-medium text-white"
              >
                Удалить всё
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 max-w-[92vw] -translate-x-1/2 break-all rounded-2xl border border-white/10 bg-slate-800/95 px-4 py-2 text-center text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

function Section({ icon: Icon, title, tone = 'violet', children }) {
  const tones = {
    violet: 'from-violet-500/25 to-fuchsia-500/5 text-violet-200',
    cyan: 'from-cyan-500/25 to-blue-500/5 text-cyan-200',
    rose: 'from-rose-500/20 to-orange-500/5 text-rose-200',
    slate: 'from-slate-500/20 to-slate-500/5 text-slate-200',
  }
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="mb-3 flex items-center gap-2.5 text-[15px] font-medium text-violet-50">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${tones[tone]}`}
        >
          <Icon size={16} />
        </span>
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function LinkButton({ href, icon: Icon, label, full }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-violet-100 active:bg-white/10 ${
        full ? 'w-full' : ''
      }`}
    >
      <Icon size={14} /> {label}
    </a>
  )
}
