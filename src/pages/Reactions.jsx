import { GraduationCap, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { REACTIONS, searchReactions } from '../data/reactions'

const EXAMPLES = [
  { q: 'NaOH', hint: 'реакции с NaOH' },
  { q: 'H+O', hint: 'вещества с H и O' },
  { q: 'HCOOH', hint: 'муравьиная кислота' },
  { q: 'CuSO4', hint: 'сульфат меди' },
]

export default function Reactions() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [showAbout, setShowAbout] = useState(false)

  const results = useMemo(() => {
    if (!submitted.trim()) return null
    return searchReactions(submitted)
  }, [submitted])

  function run(q) {
    setQuery(q)
    setSubmitted(q)
  }

  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(query)
        }}
        className="relative"
      >
        <input
          className="w-full border-b border-white/15 bg-transparent py-3 pr-10 text-lg outline-none placeholder:text-violet-300/40 focus:border-violet-400"
          placeholder="H2O+HCOOH"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-violet-300"
          aria-label="Найти"
        >
          <Search size={22} />
        </button>
      </form>

      {results === null && (
        <div className="space-y-6 pt-4 text-center">
          <p className="px-4 text-base leading-relaxed text-violet-100/80">
            Введите вещество или часть химической реакции в поле поиска.
          </p>
          <button
            type="button"
            onClick={() => setShowAbout(true)}
            className="mx-auto flex items-center gap-2 rounded-2xl bg-violet-500/25 px-5 py-3 text-sm text-violet-100"
          >
            <GraduationCap size={18} />
            Что такое химическая реакция
          </button>
          <div>
            <p className="mb-4 text-lg text-violet-100/90">Примеры</p>
            <ul className="space-y-3 text-left">
              {EXAMPLES.map((ex) => (
                <li key={ex.q}>
                  <button
                    type="button"
                    onClick={() => run(ex.q)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-2 pr-3 text-left active:bg-white/10"
                  >
                    <span className="min-w-[5.5rem] rounded-xl bg-violet-500/30 px-3 py-3 text-center font-mono text-sm">
                      {ex.q}
                    </span>
                    <span className="text-sm text-violet-200/75">найдёт {ex.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-3">
          <p className="text-sm text-violet-300/70">
            Найдено: {results.length}
            <button
              type="button"
              className="ml-3 text-violet-300 underline"
              onClick={() => {
                setSubmitted('')
                setQuery('')
              }}
            >
              Сбросить
            </button>
          </p>
          {results.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-violet-200/70">
              Ничего не найдено. Попробуйте формулу вещества (NaOH, CuSO₄) или часть уравнения.
            </p>
          )}
          {results.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="font-mono text-base leading-relaxed text-violet-50">{r.eq}</p>
              <span className="mt-2 inline-block rounded-full bg-violet-500/25 px-2.5 py-0.5 text-[11px] text-violet-200">
                {r.type}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-violet-200/75">{r.note}</p>
            </article>
          ))}
          <p className="text-center text-[11px] text-violet-300/40">
            База офлайн · {REACTIONS.length} уравнений · всё бесплатно
          </p>
        </div>
      )}

      {showAbout && (
        <div
          className="fixed inset-0 z-40 flex items-end bg-black/60 p-3 sm:items-center"
          onClick={(e) => e.target === e.currentTarget && setShowAbout(false)}
          role="presentation"
        >
          <div className="max-h-[80dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold">Химическая реакция</h2>
            <p className="mt-3 text-sm leading-relaxed text-violet-100/85">
              Это процесс, в котором одни вещества (реагенты) превращаются в другие (продукты) с
              разрывом и образованием химических связей. Признаки: изменение цвета, осадок, газ,
              тепло, свет.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-violet-100/85">
              Типы: соединение, разложение, замещение, обмен, окислительно-восстановительные,
              горение, присоединение.
            </p>
            <button
              type="button"
              onClick={() => setShowAbout(false)}
              className="mt-4 w-full rounded-xl bg-violet-500 py-2.5 text-sm font-medium"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
