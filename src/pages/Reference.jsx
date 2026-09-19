import { useState } from 'react'
import {
  ACIDS,
  ACTIVITY,
  ANIONS,
  CATIONS,
  SOL_LEGEND,
  SOLUBILITY,
} from '../data/chemistry'

const tabs = [
  { id: 'sol', label: 'Растворимость' },
  { id: 'act', label: 'Ряд активности' },
  { id: 'acid', label: 'Кислоты' },
]

export default function Reference() {
  const [tab, setTab] = useState('sol')

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-2xl bg-white/5 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-xl px-2 py-2 text-xs ${
              tab === t.id ? 'bg-violet-500' : ''
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'sol' && (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-max border-collapse text-center text-[10px]">
            <thead>
              <tr>
                <th className="sticky left-0 bg-slate-900 px-1 py-1"> </th>
                {ANIONS.map((a) => (
                  <th key={a.id} className="px-1 py-1 text-violet-200">
                    {a.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATIONS.map((c) => (
                <tr key={c.id}>
                  <th className="sticky left-0 bg-slate-900 px-1 py-1 text-violet-200">
                    {c.label}
                  </th>
                  {ANIONS.map((a) => {
                    const code = SOLUBILITY[c.id][a.id]
                    const L = SOL_LEGEND[code]
                    return (
                      <td key={a.id} className="p-0.5">
                        <span className={`inline-block min-w-6 rounded ${L.cls}`} title={L.title}>
                          {L.text}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-wrap gap-2 p-2 text-xs text-violet-200/80">
            {Object.values(SOL_LEGEND).map((L) => (
              <span key={L.text}>
                {L.text} — {L.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {tab === 'act' && (
        <ol className="space-y-2">
          {ACTIVITY.map((item, i) => (
            <li
              key={item.metal}
              className={`flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 ${
                item.metal === 'H₂' ? 'bg-violet-500/30' : 'bg-white/5'
              }`}
            >
              <span className="font-mono text-lg">
                {i + 1}. {item.metal}
              </span>
              <span className="text-xs text-violet-200/70">{item.note}</span>
            </li>
          ))}
        </ol>
      )}

      {tab === 'acid' && (
        <ul className="space-y-2">
          {ACIDS.map((a) => (
            <li key={a.acid} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-lg">{a.acid}</p>
              <p className="text-sm text-violet-100">{a.name}</p>
              <p className="mt-1 text-sm text-violet-300/80">
                Остаток: {a.residue} — {a.residueName}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
