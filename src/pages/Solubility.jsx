import { Info, X } from 'lucide-react'
import { useState } from 'react'
import { SOL_ANIONS, SOL_CATIONS, SOL_TABLE, solClass } from '../data/solubility'

export default function Solubility() {
  const [sel, setSel] = useState(null)
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-violet-300/65">г/100 мл H₂O · ~20 °C · всё бесплатно</p>
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="rounded-full bg-white/10 p-1.5 text-violet-200"
          aria-label="Справка"
        >
          <Info size={16} />
        </button>
      </div>

      <div className="overflow-auto rounded-xl border border-white/10 bg-black/30 [-webkit-overflow-scrolling:touch]" style={{ maxHeight: 'min(70dvh, 32rem)' }}>
        <table className="border-collapse text-center text-[10px]">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-20 bg-slate-950 px-1 py-2 text-[9px] font-normal text-violet-300/70">
                <div className="text-left leading-tight">
                  Анионы
                  <span className="block text-violet-400/50">↓ Катионы →</span>
                </div>
              </th>
              {SOL_CATIONS.map((c) => (
                <th
                  key={c.id}
                  className="sticky top-0 z-10 bg-slate-950 px-0.5 py-2 font-normal text-violet-200"
                >
                  <span className="inline-block min-w-[1.6rem]">{c.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SOL_ANIONS.map((a) => (
              <tr key={a.id} className="border-t border-white/5">
                <th className="sticky left-0 z-10 bg-slate-950 px-1 py-0.5 text-left font-normal">
                  <div className="leading-tight">
                    <span className="text-violet-100">{a.label}</span>
                    <span className="block text-[8px] text-violet-400/50">{a.name}</span>
                  </div>
                </th>
                {SOL_CATIONS.map((c) => {
                  const raw = SOL_TABLE[c.id]?.[a.id]
                  const info = solClass(raw)
                  const isSel = sel?.c === c.id && sel?.a === a.id
                  const display =
                    info.num != null
                      ? info.num >= 100
                        ? info.num.toFixed(0)
                        : info.num >= 10
                          ? info.num.toFixed(0)
                          : info.num >= 1
                            ? info.num.toFixed(1)
                            : info.num < 0.01
                              ? 'Н'
                              : info.num.toFixed(2)
                      : info.code === 'R'
                        ? 'Р'
                        : info.code === 'N'
                          ? 'Н'
                          : info.code === 'M'
                            ? 'М'
                            : info.code === 'H'
                              ? 'Г'
                              : '?'
                  return (
                    <td key={c.id} className="p-[1px]">
                      <button
                        type="button"
                        onClick={() =>
                          setSel(isSel ? null : { c: c.id, a: a.id, raw, info, cLabel: c.label, aLabel: a.label, aName: a.name })
                        }
                        className={`flex h-7 min-w-[1.7rem] items-center justify-center rounded-sm px-0.5 font-medium ${info.cls} ${
                          isSel ? 'ring-2 ring-white' : ''
                        }`}
                      >
                        {display}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sel && (
        <div className="rounded-2xl border border-violet-400/30 bg-violet-500/15 px-4 py-3 text-sm">
          <p className="font-medium">
            {sel.cLabel} + {sel.aLabel}
            <span className="ml-2 text-xs font-normal text-violet-300/70">({sel.aName})</span>
          </p>
          <p className="mt-1 text-violet-100/90">{sel.info.label}</p>
          {sel.info.num != null && (
            <p className="mt-1 text-xs text-violet-300/70">
              Ориентировочная растворимость при комнатной температуре. Точные значения зависят от t °C.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-[10px] text-violet-200/80">
        <span className="rounded bg-teal-600/90 px-1.5 py-0.5">число / Р — растворимо</span>
        <span className="rounded bg-amber-600/80 px-1.5 py-0.5">М — мало</span>
        <span className="rounded bg-orange-700/90 px-1.5 py-0.5">Н — нераств.</span>
        <span className="rounded bg-slate-600 px-1.5 py-0.5">Г — гидролиз</span>
        <span className="rounded bg-slate-800 px-1.5 py-0.5">? — нет данных</span>
      </div>

      {showHelp && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowHelp(false)}
          role="presentation"
        >
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-5">
            <div className="mb-2 flex justify-between">
              <h3 className="font-semibold">Таблица растворимости</h3>
              <button type="button" onClick={() => setShowHelp(false)}>
                <X size={18} />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-violet-200/80">
              Числа — приблизительная растворимость в граммах безводной соли на 100 мл воды при ~20 °C.
              Цвет ячейки показывает, растворяется ли вещество хорошо, плохо или почти не растворяется.
              Нажмите ячейку для подробностей. Все данные доступны бесплатно.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
