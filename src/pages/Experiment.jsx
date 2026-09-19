import { Check, ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatDate, loadExperiments, saveExperiments, uid } from '../lib/storage'

const STATUS = {
  running: { emoji: '🟡', label: 'В процессе' },
  ok: { emoji: '🟢', label: 'Успешно' },
  fail: { emoji: '🔴', label: 'Ошибка' },
}

const NOTE_FIELDS = [
  ['color', 'Цвет', 'синий, зелёный…'],
  ['precipitate', 'Осадок', 'белый, студенистый…'],
  ['gas', 'Газ', 'пузырьки, запах…'],
  ['temperature', 'Температура', 'нагрев, t °C…'],
]

export default function Experiment() {
  const { id } = useParams()
  const nav = useNavigate()
  const [exp, setExp] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [newStep, setNewStep] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const found = loadExperiments().find((e) => e.id === id) || null
    setExp(found)
    setDraft(found)
    setEditing(false)
    setConfirmDelete(false)
  }, [id])

  function patch(next) {
    const withTime = { ...next, updatedAt: Date.now() }
    setExp(withTime)
    if (!editing) setDraft(withTime)
    const all = loadExperiments().map((e) => (e.id === id ? withTime : e))
    saveExperiments(all)
  }

  if (!exp) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-sm text-violet-200/70">Опыт не найден или был удалён.</p>
        <Link to="/" className="mt-3 inline-block text-sm text-violet-300 underline">
          Вернуться в дневник
        </Link>
      </div>
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

  function addStep(e) {
    e?.preventDefault()
    const text = newStep.trim()
    if (!text) return
    patch({ ...exp, steps: [...exp.steps, { id: uid(), text, done: false }] })
    setNewStep('')
  }

  function removeStep(sid) {
    patch({ ...exp, steps: exp.steps.filter((s) => s.id !== sid) })
  }

  function saveMeta(e) {
    e.preventDefault()
    patch({
      ...exp,
      title: draft.title.trim() || 'Без названия',
      goal: draft.goal.trim(),
      reagents: draft.reagents.trim(),
    })
    setEditing(false)
  }

  function remove() {
    saveExperiments(loadExperiments().filter((e) => e.id !== id))
    nav('/')
  }

  const done = exp.steps.filter((s) => s.done).length
  const total = exp.steps.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 text-sm text-violet-300">
          <ChevronLeft size={16} /> Дневник
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setDraft(exp)
              setEditing((v) => !v)
            }}
            className="text-sm text-violet-300"
          >
            {editing ? 'Закрыть' : 'Изменить'}
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-rose-300"
            aria-label="Удалить"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        {editing ? (
          <form onSubmit={saveMeta} className="space-y-3">
            <input
              className="w-full rounded-xl bg-white/10 px-3 py-2 text-lg font-semibold outline-none"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Название"
            />
            <textarea
              className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm outline-none"
              rows={2}
              value={draft.goal}
              onChange={(e) => setDraft({ ...draft, goal: e.target.value })}
              placeholder="Цель"
            />
            <textarea
              className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm outline-none"
              rows={2}
              value={draft.reagents}
              onChange={(e) => setDraft({ ...draft, reagents: e.target.value })}
              placeholder="Реактивы"
            />
            <button type="submit" className="w-full rounded-xl bg-violet-500 py-2.5 text-sm font-medium">
              Сохранить
            </button>
          </form>
        ) : (
          <>
            <h2 className="text-xl font-semibold leading-snug">{exp.title}</h2>
            {exp.goal ? (
              <p className="mt-1 text-sm text-violet-200/80">{exp.goal}</p>
            ) : (
              <p className="mt-1 text-sm italic text-violet-300/40">Цель не указана</p>
            )}
            {exp.reagents && (
              <p className="mt-2 text-sm">
                <span className="text-violet-300/70">Реактивы: </span>
                {exp.reagents}
              </p>
            )}
            <p className="mt-2 text-[11px] text-violet-300/50">
              Обновлено {formatDate(exp.updatedAt || exp.createdAt)}
            </p>
          </>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(STATUS).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => patch({ ...exp, status: k })}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                exp.status === k ? 'bg-violet-500 text-white' : 'bg-white/10 text-violet-200/80'
              }`}
            >
              {v.emoji} {v.label}
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="font-medium">Чек-лист шагов</h3>
          {total > 0 && (
            <span className="text-xs text-violet-300/70">
              {done}/{total}
            </span>
          )}
        </div>
        {total > 0 && (
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full bg-violet-400 transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
        )}
        {total === 0 && (
          <p className="mb-3 text-sm text-violet-200/60">Шаги не заданы — добавьте ниже.</p>
        )}
        <ul className="space-y-2">
          {exp.steps.map((s, idx) => (
            <li
              key={s.id}
              className="group flex items-start gap-2 rounded-xl bg-black/20 px-2 py-2"
            >
              <button
                type="button"
                onClick={() => toggleStep(s.id)}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                  s.done
                    ? 'border-violet-400 bg-violet-500 text-white'
                    : 'border-white/20 bg-transparent'
                }`}
                aria-label={s.done ? 'Снять отметку' : 'Отметить выполненным'}
              >
                {s.done && <Check size={12} strokeWidth={3} />}
              </button>
              <button
                type="button"
                onClick={() => toggleStep(s.id)}
                className={`min-w-0 flex-1 text-left text-sm ${
                  s.done ? 'text-violet-300/45 line-through' : ''
                }`}
              >
                <span className="mr-1.5 text-violet-400/50">{idx + 1}.</span>
                {s.text}
              </button>
              <button
                type="button"
                onClick={() => removeStep(s.id)}
                className="shrink-0 p-1 text-rose-300/50 opacity-70 hover:opacity-100"
                aria-label="Удалить шаг"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addStep} className="mt-3 flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-violet-300/35"
            placeholder="Новый шаг…"
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newStep.trim()}
            className="flex items-center gap-1 rounded-xl bg-violet-500/80 px-3 py-2 text-sm disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </form>
      </section>

      <section className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="font-medium">Наблюдения</h3>
        {NOTE_FIELDS.map(([key, label, ph]) => (
          <label key={key} className="block text-sm">
            <span className="text-violet-300/70">{label}</span>
            <input
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none placeholder:text-violet-300/30"
              value={exp.notes?.[key] || ''}
              placeholder={ph}
              onChange={(e) => setNote(key, e.target.value)}
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="text-violet-300/70">Прочие заметки</span>
          <textarea
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none placeholder:text-violet-300/30"
            rows={3}
            value={exp.notes?.extra || ''}
            placeholder="Что ещё заметили…"
            onChange={(e) => setNote('extra', e.target.value)}
          />
        </label>
      </section>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => e.target === e.currentTarget && setConfirmDelete(false)}
          role="presentation"
        >
          <div className="w-full max-w-sm space-y-4 rounded-3xl border border-white/10 bg-slate-900 p-5">
            <h3 className="text-lg font-semibold">Удалить опыт?</h3>
            <p className="text-sm text-violet-200/70">
              «{exp.title}» будет удалён безвозвратно с этого устройства.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={remove}
                className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-medium"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
