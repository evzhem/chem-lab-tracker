import { Rocket } from 'lucide-react'
import { useUpdate } from '../lib/update-context.js'

/**
 * Карточка обновления на главном экране.
 * Появляется только тогда, когда есть новая версия: коротко показывает,
 * что изменилось, и даёт кнопки «Обновить» / «Позже».
 * Если пользователь нажал «Позже», карточка сжимается до одной строки.
 */
export default function UpdateNotice() {
  const { hasUpdate, postponed, result, applying, open, dismiss, applyUpdate } = useUpdate()
  if (!hasUpdate || !result) return null

  const { version, title, notes = [], isNative } = result

  if (postponed) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-violet-400/25 bg-violet-500/10 px-3 py-2.5">
        <Rocket size={16} className="shrink-0 text-violet-300" />
        <button
          type="button"
          onClick={open}
          className="min-w-0 flex-1 text-left text-[13px] text-violet-100"
        >
          Доступно обновление {version}
          <span className="block text-[11px] text-violet-300/65">Нажмите, чтобы посмотреть</span>
        </button>
        <button
          type="button"
          onClick={applyUpdate}
          className="shrink-0 rounded-full bg-violet-500 px-3 py-1.5 text-xs font-medium text-white"
        >
          Обновить
        </button>
      </div>
    )
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-600/30 via-violet-700/10 to-cyan-500/10 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-900/40">
          <Rocket size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-violet-300/70">
            Доступно обновление
          </p>
          <h2 className="text-[15px] font-medium leading-snug text-violet-50">
            Версия {version}
          </h2>
          {title && <p className="mt-0.5 text-[12px] text-violet-200/80">{title}</p>}
        </div>
      </div>

      {notes.length > 0 && (
        <ul className="mt-3 space-y-1">
          {notes.slice(0, 3).map((n) => (
            <li key={n} className="flex gap-2 text-[12px] leading-snug text-violet-200/85">
              <span className="text-violet-400">•</span>
              <span>{n}</span>
            </li>
          ))}
          {notes.length > 3 && (
            <li className="pl-4 text-[11px] text-violet-300/60">
              и ещё {notes.length - 3}…
            </li>
          )}
        </ul>
      )}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={applyUpdate}
          disabled={applying}
          className="flex-1 rounded-xl bg-violet-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-900/40 active:scale-[0.99] disabled:opacity-60"
        >
          {applying ? 'Обновляем…' : isNative ? 'Обновить APK' : 'Обновить'}
        </button>
        <button
          type="button"
          onClick={open}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-violet-100 active:bg-white/10"
        >
          Подробнее
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-xl px-3 py-2.5 text-sm text-violet-300/80 active:bg-white/5"
        >
          Позже
        </button>
      </div>
    </section>
  )
}
