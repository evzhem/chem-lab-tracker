import { FlaskConical, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate, loadExperiments, saveExperiments, uid } from '../lib/storage'

const STATUS = {
  running: { emoji: '🟡', label: 'В процессе', cls: 'bg-amber-500/20 text-amber-100' },
  ok: { emoji: '🟢', label: 'Успешно', cls: 'bg-emerald-500/20 text-emerald-100' },
  fail: { emoji: '🔴', label: 'Ошибка', cls: 'bg-rose-500/20 text-rose-100' },
}

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'running', label: 'В процессе' },
  { id: 'ok', label: 'Успешно' },
  { id: 'fail', label: 'Ошибка' },
]

const emptyForm = {
  title: '',
  goal: '',
  reagents: '',
  stepsText: '',
}

export default function Journal() {
  const [list, setList] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    setList(loadExperiments())
  }, [])

  // refresh when returning via back button / storage changes in same tab navigation
  useEffect(() => {
    const onFocus = () => setList(loadExperiments())
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  function persist(next) {
    setList(next)
    saveExperiments(next)
  }

  function create(e) {
    e.preventDefault()
    const steps = form.stepsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text) => ({ id: uid(), text, done: false }))
    const now = Date.now()
    const exp = {
      id: uid(),
      title: form.title.trim() || 'Без названия',
      goal: form.goal.trim(),
      reagents: form.reagents.trim(),
      steps,
      notes: { color: '', precipitate: '', gas: '', temperature: '', extra: '' },
      status: 'running',
      createdAt: now,
      updatedAt: now,
    }
    persist([exp, ...list])
    setForm(emptyForm)
    setOpen(false)
    nav(`/exp/${exp.id}`)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((exp) => {
      if (filter !== 'all' && exp.status !== filter) return false
      if (!q) return true
      return (
        exp.title.toLowerCase().includes(q) ||
        exp.goal.toLowerCase().includes(q) ||
        exp.reagents.toLowerCase().includes(q)
      )
    })
  }, [list, filter, query])

  const counts = useMemo(() => {
    const c = { all: list.length, running: 0, ok: 0, fail: 0 }
    for (const e of list) c[e.status] = (c[e.status] || 0) + 1
    return c
  }, [list])

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 py-3.5 font-medium shadow-lg shadow-violet-900/40 active:scale-[0.99]"
      >
        <Plus size={18} /> Новый эксперимент
      </button>

      {list.length > 0 && (
        <div className="space-y-3">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-300/50"
            />
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-violet-300/40 focus:border-violet-400/40"
              placeholder="Поиск по названию, цели…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors ${
                  filter === f.id ? 'bg-violet-500 text-white' : 'bg-white/10 text-violet-200/80'
                }`}
              >
                {f.label}
                <span className="ml-1 opacity-70">{counts[f.id] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {list.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200">
            <FlaskConical size={28} />
          </div>
          <p className="font-medium text-violet-100">Пока нет записей</p>
          <p className="mt-1 text-sm text-violet-200/60">
            Добавьте первый опыт — название, цель, реактивы и шаги.
          </p>
        </div>
      )}

      {list.length > 0 && filtered.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-violet-200/70">
          Ничего не найдено. Сбросьте фильтр или измените запрос.
        </p>
      )}

      <ul className="space-y-3">
        {filtered.map((exp) => {
          const st = STATUS[exp.status] || STATUS.running
          const done = exp.steps.filter((s) => s.done).length
          const total = exp.steps.length
          return (
            <li key={exp.id}>
              <Link
                to={`/exp/${exp.id}`}
                className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors active:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-medium leading-snug">{exp.title}</h2>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${st.cls}`}>
                    {st.emoji} {st.label}
                  </span>
                </div>
                {exp.goal && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-violet-200/70">{exp.goal}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-violet-300/60">
                  <span>{formatDate(exp.updatedAt || exp.createdAt)}</span>
                  {total > 0 && (
                    <span>
                      Шаги {done}/{total}
                      {done === total && total > 0 ? ' ✓' : ''}
                    </span>
                  )}
                  {exp.reagents && (
                    <span className="line-clamp-1 max-w-[12rem]">
                      {exp.reagents.split(/[,;\n]/)[0].trim()}
                      {exp.reagents.includes(',') || exp.reagents.includes(';') ? '…' : ''}
                    </span>
                  )}
                </div>
                {total > 0 && (
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/30">
                    <div
                      className="h-full rounded-full bg-violet-400/80 transition-all"
                      style={{ width: `${(done / total) * 100}%` }}
                    />
                  </div>
                )}
              </Link>
            </li>
          )
        })}
      </ul>

      {open && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 p-3 sm:items-center"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          role="presentation"
        >
          <form
            onSubmit={create}
            className="max-h-[min(92dvh,40rem)] w-full max-w-lg space-y-3 overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl"
          >
            <h2 className="text-lg font-semibold">Новый эксперимент</h2>
            <Field
              label="Название"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
              placeholder="Например: Реакция CuSO₄ с NaOH"
              autoFocus
            />
            <Field
              label="Цель"
              value={form.goal}
              onChange={(v) => setForm({ ...form, goal: v })}
              placeholder="Что хотите получить / проверить"
              multiline
              rows={2}
            />
            <Field
              label="Реактивы"
              value={form.reagents}
              onChange={(v) => setForm({ ...form, reagents: v })}
              placeholder="CuSO₄, NaOH, H₂O…"
              multiline
              rows={2}
            />
            <Field
              label="Шаги"
              value={form.stepsText}
              onChange={(v) => setForm({ ...form, stepsText: v })}
              placeholder={'Каждый шаг с новой строки:\n1. Приготовить раствор\n2. Смешать…'}
              multiline
              rows={4}
            />
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setForm(emptyForm)
                }}
                className="flex-1 rounded-xl bg-white/10 py-3 text-sm"
              >
                Отмена
              </button>
              <button type="submit" className="flex-1 rounded-xl bg-violet-500 py-3 text-sm font-medium">
                Создать
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, multiline, rows = 3, autoFocus }) {
  const cls =
    'mt-1 w-full rounded-xl border border-transparent bg-white/10 px-3 py-2.5 text-sm outline-none placeholder:text-violet-300/35 focus:border-violet-400/40'
  return (
    <label className="block text-sm">
      <span className="text-violet-300/80">{label}</span>
      {multiline ? (
        <textarea
          className={cls}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={cls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
        />
      )}
    </label>
  )
}
