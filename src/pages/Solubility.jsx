import { Info, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ZoomControls from '../components/ZoomControls'
import { SOL_ANIONS, SOL_CATIONS, SOL_TABLE, solClass } from '../data/solubility'
import { useZoom } from '../lib/useZoom'

/**
 * Как и в таблице Менделеева: масштаб — это базовый font-size контейнера,
 * все размеры внутри заданы в em, поэтому ячейки всегда одинаковые,
 * область прокрутки реальная, а sticky-заголовки работают корректно.
 */
const UNIT = 10 // px при 100 %
const CELL = 3.6 // em
const GAP = 0.2 // em
const HEAD_W = 9.4 // em
const HEAD_H = 3.4 // em
const PADDING = 8 // px
const COLS = SOL_CATIONS.length
const NEEDED_WIDTH =
  PADDING * 2 + (HEAD_W + GAP + COLS * CELL + (COLS - 1) * GAP) * UNIT

export default function Solubility() {
  const [sel, setSel] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const scrollRef = useRef(null)
  const [containerW, setContainerW] = useState(0)

  const { zoom, setZoom, zoomIn, zoomOut, reset, canZoomIn, canZoomOut } = useZoom({
    min: 0.4,
    max: 1.8,
    step: 0.1,
    initial: 1,
    storageKey: 'chemlab-zoom-solubility',
  })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const measure = () => setContainerW(el.clientWidth)
    measure()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const fitZoom = useMemo(() => {
    if (!containerW) return 1
    const raw = containerW / NEEDED_WIDTH
    return Math.min(1, Math.max(0.4, Math.round(raw * 100) / 100))
  }, [containerW])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-violet-300/65">г/100 мл H₂O · ~20 °C · всё бесплатно</p>
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="rounded-full bg-white/10 p-1.5 text-violet-200 active:bg-white/15"
          aria-label="Справка"
        >
          <Info size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-violet-300/60">Масштаб таблицы</span>
        <ZoomControls
          zoom={zoom}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          reset={reset}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
          fitZoom={fitZoom}
          onFit={() => setZoom(fitZoom)}
        />
      </div>

      <div
        ref={scrollRef}
        className="table-scroll isolate overflow-auto rounded-xl border border-white/10 bg-black/30"
        style={{ maxHeight: 'min(66dvh, 34rem)', padding: PADDING }}
      >
        <div style={{ fontSize: `${zoom * UNIT}px`, width: 'max-content' }}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: `${HEAD_W}em repeat(${COLS}, ${CELL}em)`,
              gap: `${GAP}em`,
            }}
          >
            <div
              className="sticky left-0 top-0 z-30 flex items-center bg-slate-950 px-[0.4em] text-[0.95em] leading-tight text-violet-300/70"
              style={{ height: `${HEAD_H}em` }}
            >
              <span>
                Анионы
                <span className="block text-violet-400/50">↓ Кат. →</span>
              </span>
            </div>
            {SOL_CATIONS.map((c) => {
              const active = sel?.c === c.id
              return (
                <div
                  key={c.id}
                  className={`sticky top-0 z-20 flex items-center justify-center rounded-[0.3em] text-[1em] font-medium ${
                    active ? 'bg-violet-500 text-white' : 'bg-slate-950 text-violet-200'
                  }`}
                  style={{ height: `${HEAD_H}em` }}
                >
                  {c.label}
                </div>
              )
            })}

            {SOL_ANIONS.map((a) => (
              <Row key={a.id} anion={a} rowActive={sel?.a === a.id} sel={sel} onSelect={setSel} />
            ))}
          </div>
        </div>
      </div>

      <p className="px-1 text-[10px] text-violet-300/50">
        Проведите пальцем по таблице, чтобы увидеть все ионы. Кнопка ⤢ умещает таблицу по ширине
        экрана.
      </p>

      {sel && (
        <div className="rounded-2xl border border-violet-400/30 bg-violet-500/15 px-4 py-3 text-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium">
              {sel.cLabel} + {sel.aLabel}
              <span className="ml-2 text-xs font-normal text-violet-300/70">({sel.aName})</span>
            </p>
            <button
              type="button"
              onClick={() => setSel(null)}
              className="shrink-0 p-0.5 text-violet-300"
              aria-label="Убрать выделение"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-1 text-violet-100/90">{sel.info.label}</p>
          {sel.info.num != null && (
            <p className="mt-1 text-xs text-violet-300/70">
              Ориентировочно при комнатной температуре — точные значения зависят от t °C.
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
              <button type="button" onClick={() => setShowHelp(false)} aria-label="Закрыть">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-violet-200/80">
              Числа — приблизительная растворимость в граммах безводной соли на 100 мл воды при
              ~20 °C. Цвет ячейки показывает, растворяется ли вещество хорошо, плохо или почти не
              растворяется. Нажмите ячейку для подробностей. Масштаб меняется кнопками − и +, а ⤢
              умещает таблицу по ширине экрана. Все данные доступны бесплатно.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/** Строка таблицы: заголовок аниона + ячейки катионов */
function Row({ anion, rowActive, sel, onSelect }) {
  return (
    <>
      <div
        className={`sticky left-0 z-10 flex items-center rounded-[0.3em] px-[0.4em] ${
          rowActive ? 'bg-violet-500/40' : 'bg-slate-950'
        }`}
        style={{ minHeight: `${CELL}em` }}
      >
        <span className="leading-tight">
          <span className="text-[1.1em] font-medium text-violet-100">{anion.label}</span>
          <span className="block text-[0.8em] leading-tight text-violet-400/55">
            {anion.name}
          </span>
        </span>
      </div>
      {SOL_CATIONS.map((c) => {
        const raw = SOL_TABLE[c.id]?.[anion.id]
        const info = solClass(raw)
        const isSel = sel?.c === c.id && sel?.a === anion.id
        return (
          <button
            key={c.id}
            type="button"
            onClick={() =>
              onSelect(
                isSel
                  ? null
                  : {
                      c: c.id,
                      a: anion.id,
                      raw,
                      info,
                      cLabel: c.label,
                      aLabel: anion.label,
                      aName: anion.name,
                    },
              )
            }
            style={{ width: `${CELL}em`, height: `${CELL}em` }}
            className={`flex items-center justify-center rounded-[0.3em] text-[1.05em] font-medium tabular-nums ${info.cls} ${
              isSel ? 'ring-2 ring-white' : ''
            }`}
          >
            {displayValue(info)}
          </button>
        )
      })}
    </>
  )
}

function displayValue(info) {
  if (info.num != null) {
    const n = info.num
    if (n < 0.01) return 'Н'
    if (n >= 10) return n.toFixed(0)
    if (n >= 1) return n.toFixed(1)
    return n.toFixed(2)
  }
  if (info.code === 'R') return 'Р'
  if (info.code === 'N') return 'Н'
  if (info.code === 'M') return 'М'
  if (info.code === 'H') return 'Г'
  return '?'
}
