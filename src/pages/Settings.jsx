import { Check, Palette, RefreshCw, Share2, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { APP_VERSION, APP_UPDATED_AT, formatBuildDate } from '../lib/appInfo.js'
import { THEMES, useTheme } from '../lib/theme-context.js'
import { useUpdate } from '../lib/update-context.js'
import { IS_NATIVE, UPDATE_STATE } from '../lib/updates.js'
import { loadExperiments, saveExperiments } from '../lib/storage'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { state, version, build, check } = useUpdate()
  const [journalCount, setJournalCount] = useState(() => loadExperiments().length)
  const [confirmClear, setConfirmClear] = useState(false)
  const [toast, setToast] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const shareInputRef = useRef(null)
  const toastTimer = useRef(null)

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  function flash(message) {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }

  async function shareApp() {
    const text = 'ChemLab Tracker — приложение-справочник по химии'
    const url = shareableUrl()
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(url ? { title: 'ChemLab Tracker', text, url } : { title: 'ChemLab Tracker', text })
        return
      } catch (err) {
        if (err?.name === 'AbortError' || err?.name === 'NotAllowedError') return
      }
    }
    if (url) {
      try {
        await navigator.clipboard.writeText(url)
        flash('Ссылка скопирована')
        return
      } catch {
        /* покажем окно с ссылкой ниже */
      }
    }
    setShareUrl(url || text)
    setShareOpen(true)
  }

  async function checkManually() {
    const result = await check()
    if (!result) {
      flash('Не удалось проверить обновления')
      return
    }
    if (result.updateAvailable) {
      flash(`Найдено обновление ${result.version}`)
      return
    }
    flash('Установлена последняя версия')
  }

  function clearJournal() {
    saveExperiments([])
    setJournalCount(0)
    setConfirmClear(false)
    flash('Дневник очищен')
  }

  const checking = state === UPDATE_STATE.checking
  const buildLabel = [build ? `сборка ${build}` : '', formatBuildDate(APP_UPDATED_AT)]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="space-y-4">
      <section className="flex items-center gap-3 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/35 via-violet-700/10 to-cyan-500/10 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-2xl shadow-lg shadow-violet-900/40">
          ⚗️
        </div>
        <div className="min-w-0">
          <h2 className="font-serif text-2xl leading-tight text-violet-50">ChemLab Tracker</h2>
          <p className="text-xs text-violet-200/75">
            Версия {version || APP_VERSION}
            {buildLabel ? ` · ${buildLabel}` : ''}
          </p>
        </div>
      </section>

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

      {/* ---------- Обновления ---------- */}
      <Section icon={RefreshCw} title="Обновления" tone="violet">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <span className="text-violet-200/80">Текущая версия</span>
          <span className="font-medium tabular-nums">{version || APP_VERSION}</span>
        </div>
        <button
          type="button"
          onClick={checkManually}
          disabled={checking}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-violet-100 active:scale-[0.99] disabled:opacity-50"
        >
          <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
          {checking ? 'Проверяем…' : 'Проверить обновления'}
        </button>
        <p className="text-[11px] leading-relaxed text-violet-300/55">
          Проверка выполняется автоматически при запуске приложения. Данные дневника при
          обновлении сохраняются.
        </p>
      </Section>

      {/* ---------- Дневник ---------- */}
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
      </Section>

      <p className="px-2 pb-2 text-center text-[11px] leading-relaxed text-violet-300/45">
        Все данные (дневник опытов и настройки) хранятся только на этом устройстве.
      </p>

      {shareOpen && (
        <Modal onClose={() => setShareOpen(false)} title="Ссылка на приложение">
          <p className="text-sm text-violet-200/80">
            Скопируйте ссылку и отправьте её в мессенджере или вставьте в браузер.
          </p>
          <input
            ref={shareInputRef}
            readOnly
            value={shareUrl}
            onFocus={(e) => e.target.select()}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(shareUrl)
                flash('Ссылка скопирована')
                setShareOpen(false)
              } catch {
                shareInputRef.current?.select()
                flash('Скопируйте ссылку вручную')
              }
            }}
            className="mt-3 w-full rounded-xl bg-violet-500 py-3 text-sm font-medium"
          >
            Скопировать
          </button>
        </Modal>
      )}

      {confirmClear && (
        <Modal onClose={() => setConfirmClear(false)} title="Очистить дневник?">
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
        </Modal>
      )}

      {toast && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 max-w-[92vw] -translate-x-1/2 break-all rounded-2xl border border-white/10 bg-slate-800/95 px-4 py-2 text-center text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

/** Ссылка на приложение в интернете (в Android-сборке её нет) */
function shareableUrl() {
  if (IS_NATIVE || typeof window === 'undefined') return ''
  const { origin, pathname } = window.location
  if (!/^https?:$/.test(window.location.protocol)) return ''
  if (/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/.test(origin)) return ''
  return `${origin}${pathname}`
}

function Section({ icon: Icon, title, tone = 'violet', children }) {
  const tones = {
    violet: 'from-violet-500/25 to-fuchsia-500/5 text-violet-200',
    cyan: 'from-cyan-500/25 to-blue-500/5 text-cyan-200',
    rose: 'from-rose-500/20 to-orange-500/5 text-rose-200',
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

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="font-semibold">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="p-0.5">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
