const KEY = 'chemlab-experiments-v1'

export function loadExperiments() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveExperiments(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function uid() {
  return crypto.randomUUID?.() ?? String(Date.now() + Math.random())
}
