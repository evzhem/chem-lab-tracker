const KEY = 'chemlab-experiments-v1'

export function loadExperiments() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list.map(normalizeExperiment) : []
  } catch {
    return []
  }
}

export function saveExperiments(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function uid() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function normalizeExperiment(exp) {
  return {
    id: exp.id || uid(),
    title: exp.title || 'Без названия',
    goal: exp.goal || '',
    reagents: exp.reagents || '',
    steps: Array.isArray(exp.steps)
      ? exp.steps.map((s) => ({
          id: s.id || uid(),
          text: s.text || '',
          done: Boolean(s.done),
        }))
      : [],
    notes: {
      color: exp.notes?.color || '',
      precipitate: exp.notes?.precipitate || '',
      gas: exp.notes?.gas || '',
      temperature: exp.notes?.temperature || '',
      extra: exp.notes?.extra || '',
    },
    status: ['running', 'ok', 'fail'].includes(exp.status) ? exp.status : 'running',
    createdAt: exp.createdAt || Date.now(),
    updatedAt: exp.updatedAt || exp.createdAt || Date.now(),
  }
}

export function formatDate(ts) {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts))
  } catch {
    return ''
  }
}
