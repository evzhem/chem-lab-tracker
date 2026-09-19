import { useMemo, useState } from 'react'
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
  const [acidQuery, setAcidQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const acids = useMemo(() => {
    const q = acidQuery.trim().toLowerCase()
    if (!q) return ACIDS
    return ACIDS.filter(
      (a) =>
        a.acid.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.residue.toLowerCase().includes(q) ||
        a.residueName.toLowerCase().includes(q),
    )
  }, [acidQuery])

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-2xl bg-white/5 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-xl px-2 py-2.5 text-xs font-medium transition-colors ${
              tab === t.id ? 'bg-violet-500 text-white shadow' : 'text-violet-200/70'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'sol' && (
        <div className="space-y-2">
          <p className="text-xs text-violet-300/65">
            Листайте таблицу горизонтально. Нажмите ячейку — подробнее.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] [-webkit-overflow-scrolling:touch]">
            <table className="min-w-max border-collapse text-center text-[11px]">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-slate-950/95 px-2 py-2 backdrop-blur">
                    <span className="sr-only">Катион</span>
                  </th>
                  {ANIONS.map((a) => (
                    <th key={a.id} className="px-1.5 py-2 font-normal text-violet-200/90">
                      {a.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATIONS.map((c) => (
                  <tr key={c.id} className="border-t border-white/5">
                    <th className="sticky left-0 z-10 bg-slate-950/95 px-2 py-1.5 text-left font-normal text-violet-200 backdrop-blur">
                      {c.label}
                    </th>
                    {ANIONS.map((a) => {
                      const code = SOLUBILITY[c.id][a.id]
                      const L = SOL_LEGEND[code]
                      const isSel = selected?.c === c.id && selected?.a === a.id
                      return (
                        <td key={a.id} className="p-0.5">
                          <button
                            type="button"
                            title={`${c.label} + ${a.label}: ${L.title}`}
                            onClick={() =>
                              setSelected(isSel ? null : { c: c.id, a: a.id, code })
                            }
                            className={`inline-flex min-h-7 min-w-7 items-center justify-center rounded-md text-[11px] font-medium ${L.cls} ${
                              isSel ? 'ring-2 ring-violet-300' : ''
                            }`}
                          >
                            {L.text}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected && (
            <div className="rounded-2xl border border-violet-400/30 bg-violet-500/15 px-4 py-3 text-sm">
              {(() => {
                const cat = CATIONS.find((x) => x.id === selected.c)
                const an = ANIONS.find((x) => x.id === selected.a)
                const L = SOL_LEGEND[selected.code]
                return (
                  <>
                    <p className="font-medium">
                      {cat?.label} + {an?.label}
                    </p>
                    <p className="mt-0.5 text-violet-100/80">
                      {L.text} — {L.title}
                    </p>
                  </>
                )
              })()}
            </div>
          )}
          <div className="flex flex-wrap gap-2 px-1 text-xs text-violet-200/80">
            {Object.values(SOL_LEGEND).map((L) => (
              <span key={L.text} className={`rounded-full px-2 py-0.5 ${L.cls}`}>
                {L.text} — {L.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {tab === 'act' && (
        <div className="space-y-2">
          <p className="text-xs text-violet-300/65">
            Слева направо / сверху вниз — активность убывает. H₂ — граница.
          </p>
          <ol className="space-y-2">
            {ACTIVITY.map((item, i) => {
              const isH = item.metal === 'H₂'
              return (
                <li
                  key={item.metal}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
                    isH
                      ? 'border-violet-400/40 bg-violet-500/30'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span className="font-mono text-lg">
                    <span className="mr-2 text-sm text-violet-400/60">{i + 1}</span>
                    {item.metal}
                  </span>
                  <span className="text-right text-xs text-violet-200/70">{item.note}</span>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {tab === 'acid' && (
        <div className="space-y-3">
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-violet-300/40 focus:border-violet-400/40"
            placeholder="Поиск кислоты или остатка…"
            value={acidQuery}
            onChange={(e) => setAcidQuery(e.target.value)}
          />
          {acids.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-violet-200/60">
              Ничего не найдено
            </p>
          )}
          <ul className="space-y-2">
            {acids.map((a) => (
              <li key={a.acid} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-mono text-lg text-violet-50">{a.acid}</p>
                <p className="text-sm text-violet-100">{a.name}</p>
                <p className="mt-1.5 text-sm text-violet-300/80">
                  Остаток: <span className="font-mono text-violet-100">{a.residue}</span>
                  <span className="text-violet-300/60"> — {a.residueName}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
