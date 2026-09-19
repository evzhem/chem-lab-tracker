import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadExperiments, saveExperiments, uid } from '../lib/storage'

const STATUS = {
  running: { emoji: '🟡', label: 'В процессе' },
  ok: { emoji: '🟢', label: 'Успешно' },
  fail: { emoji: '🔴', label: 'Ошибка' },
}

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
  const nav = useNavigate()

  useEffect(() => {
    setList(loadExperiments())
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
    const exp = {
      id: uid(),
      title: form.title.trim() || 'Без названия',
      goal: form.goal.trim(),
      reagents: form.reagents.trim(),
      steps,
      notes: { color: '', precipitate: '', gas: '', temperature: '' },
      status: 'running',
      createdAt: Date.now(),
    }
    persist([exp, ...list])
    setForm(emptyForm)
    setOpen(false)
    nav(`/exp/${exp.id}`)
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 py-3 font-medium shadow-lg shadow-violet-900/40"
      >
        <Plus size={18} /> Новый эксперимент
      </button>

      {list.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-violet-200/70">
          Пока нет записей. Добавьте первый опыт.
        </p>
      )}

      <ul className="space-y-3">
        {list.map((exp) => (
          <li key={exp.id}>
            <Link
              to={`/exp/${exp.id}`}
              className="block rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-medium">{exp.title}</h2>
                <span className="shrink-0 text-xs text-violet-200/80">
                  {STATUS[exp.status]?.emoji} {STATUS[exp.status]?.label}
                </span>
              </div>
              {exp.goal && (
                <p className="mt-1 line-clamp-2 text-sm text-violet-200/70">{exp.goal}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {open && (
        <div className="fixed inset-0 z-30 flex items-end bg-black/60 p-4 sm:items-center">
          <form
            onSubmit={create}
            className="w-full max-w-lg space-y-3 rounded-3xl border border-white/10 bg-slate-900 p-5"
          >
            <h2 className="text-lg font-semibold">Новый эксперимент</h2>
            <input
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              placeholder="Название"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              placeholder="Цель"
              rows={2}
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
            />
            <textarea
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              placeholder="Реактивы"
              rows={2}
              value={form.reagents}
              onChange={(e) => setForm({ ...form, reagents: e.target.value })}
            />
            <textarea
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              placeholder="Шаги — каждый с новой строки"
              rows={4}
              value={form.stepsText}
              onChange={(e) => setForm({ ...form, stepsText: e.target.value })}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl bg-white/10 py-2"
              >
                Отмена
              </button>
              <button type="submit" className="flex-1 rounded-xl bg-violet-500 py-2">
                Сохранить
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
