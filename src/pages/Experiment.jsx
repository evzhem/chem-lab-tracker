import { ChevronLeft, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { loadExperiments, saveExperiments } from '../lib/storage'

const STATUS = {
  running: { emoji: '🟡', label: 'В процессе' },
  ok: { emoji: '🟢', label: 'Успешно' },
  fail: { emoji: '🔴', label: 'Ошибка' },
}

export default function Experiment() {
  const { id } = useParams()
  const nav = useNavigate()
  const [exp, setExp] = useState(null)

  useEffect(() => {
    setExp(loadExperiments().find((e) => e.id === id) || null)
  }, [id])

  function patch(next) {
    setExp(next)
    const all = loadExperiments().map((e) => (e.id === id ? next : e))
    saveExperiments(all)
  }

  if (!exp) {
    return (
      <p className="text-sm text-violet-200/70">
        Опыт не найден. <Link to="/">Назад</Link>
      </p>
    )
  }

  function toggleStep(sid) {
    patch({
      ...exp,
      steps: exp.steps.map((s) => (s.id === sid ? { ...s, done: !s.done } : s)),
    })
  }

  function setNote(key, value) {
    patch({ ...exp, notes: { ...exp.notes, [key]: value } })
  }

  function remove() {
    saveExperiments(loadExperiments().filter((e) => e.id !== id))
    nav('/')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 text-sm text-violet-300">
          <ChevronLeft size={16} /> Дневник
        </Link>
        <button type="button" onClick={remove} className="text-rose-300">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">{exp.title}</h2>
        <p className="mt-1 text-sm text-violet-200/80">{exp.goal}</p>
        {exp.reagents && (
          <p className="mt-2 text-sm">
            <span className="text-violet-300/70">Реактивы: </span>
            {exp.reagents}
          </p>
        )}
        <div className="mt-3 flex gap-2">
          {Object.entries(STATUS).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => patch({ ...exp, status: k })}
              className={`rounded-full px-3 py-1 text-xs ${
                exp.status === k ? 'bg-violet-500' : 'bg-white/10'
              }`}
            >
              {v.emoji} {v.label}
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-3 font-medium">Чек-лист шагов</h3>
        {exp.steps.length === 0 && (
          <p className="text-sm text-violet-200/60">Шаги не заданы</p>
        )}
        <ul className="space-y-2">
          {exp.steps.map((s) => (
            <li key={s.id}>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={s.done}
                  onChange={() => toggleStep(s.id)}
                  className="mt-1"
                />
                <span className={s.done ? 'text-violet-300/50 line-through' : ''}>{s.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="font-medium">Наблюдения</h3>
        {[
          ['color', 'Цвет'],
          ['precipitate', 'Осадок'],
          ['gas', 'Газ'],
          ['temperature', 'Температура'],
        ].map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="text-violet-300/70">{label}</span>
            <input
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={exp.notes?.[key] || ''}
              onChange={(e) => setNote(key, e.target.value)}
            />
          </label>
        ))}
      </section>
    </div>
  )
}
