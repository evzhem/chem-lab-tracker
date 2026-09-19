import { Rocket } from 'lucide-react'

/**
 * Окно обновления: показывает версию, что изменилось, и две кнопки —
 * «Позже» и «Обновить».
 */
export default function UpdateDialog({ info, onPostpone, onUpdate, applying, error }) {
  if (!info) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center"
      onClick={(e) => e.target === e.currentTarget && onPostpone()}
      role="presentation"
    >
      <div className="max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-900/40">
            <Rocket size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-violet-300/70">
              Доступно обновление
            </p>
            <h2 className="text-lg font-semibold leading-tight">
              Версия {info.version}
              {info.build ? (
                <span className="ml-2 text-xs font-normal text-violet-300/60">
                  сборка {info.build}
                </span>
              ) : null}
            </h2>
          </div>
        </div>

        {info.title && <p className="mt-4 text-sm font-medium text-violet-100">{info.title}</p>}

        {info.notes.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {info.notes.map((n) => (
              <li key={n} className="flex gap-2 text-sm leading-relaxed text-violet-200/85">
                <span className="text-violet-400">•</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-3 text-xs text-violet-300/60">
          Установлено: {info.current}
          {info.updateAvailable ? ' → ' : ''}
          {info.updateAvailable ? info.version : ''}
        </p>

        {error && (
          <p className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onPostpone}
            disabled={applying}
            className="flex-1 rounded-2xl bg-white/10 py-3 text-sm font-medium disabled:opacity-50"
          >
            Позже
          </button>
          <button
            type="button"
            onClick={onUpdate}
            disabled={applying || !info.updateAvailable}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-500 py-3 text-sm font-medium shadow-lg shadow-violet-900/40 disabled:opacity-60"
          >
            {applying ? 'Обновляем…' : info.isNative ? 'Обновить APK' : 'Обновить'}
          </button>
        </div>

        {info.isNative && info.apkUrl && (
          <p className="mt-2 text-center text-[11px] text-violet-300/55">
            Откроется загрузка APK — установите файл поверх текущей версии, дневник сохранится.
          </p>
        )}
      </div>
    </div>
  )
}
