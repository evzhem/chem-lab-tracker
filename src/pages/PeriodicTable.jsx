import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ZoomControls from '../components/ZoomControls'
import { CATEGORIES, ELEMENTS } from '../data/elements'
import { useZoom } from '../lib/useZoom'

/**
 * Масштаб таблицы сделан через базовый font-size контейнера + em-размеры ячеек:
 * все ячейки остаются одинаковыми, реальная ширина области прокрутки меняется,
 * а sticky-заголовки работают в любом браузере (в отличие от CSS `zoom`).
 */
const UNIT = 10 // px при 100 %
const CELL = 4.2 // em
const GAP = 0.4 // em
const PADDING = 10 // px
const TABLE_COLS = 18
const FBLOCK_COLS = 15
const NEEDED_WIDTH = PADDING * 2 + (TABLE_COLS * CELL + (TABLE_COLS - 1) * GAP) * UNIT

const GROUPS = Array.from({ length: TABLE_COLS }, (_, i) => i + 1)
const PERIODS = [1, 2, 3, 4, 5, 6, 7]

export default function PeriodicTable() {
  const [selected, setSelected] = useState(null)
  const [q, setQ] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const scrollRef = useRef(null)
  const [containerW, setContainerW] = useState(0)

  const { zoom, setZoom, zoomIn, zoomOut, reset, canZoomIn, canZoomOut } = useZoom({
    min: 0.4,
    max: 1.8,
    step: 0.1,
    initial: 1,
    storageKey: 'chemlab-zoom-table',
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

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return null
    return ELEMENTS.filter(
      (e) =>
        e.sym.toLowerCase() === s ||
        e.sym.toLowerCase().startsWith(s) ||
        e.name.toLowerCase().includes(s) ||
        String(e.z) === s,
    )
  }, [q])

  const main = ELEMENTS.filter((e) => e.period <= 7)
  const lant = ELEMENTS.filter((e) => e.period === 8)
  const act = ELEMENTS.filter((e) => e.period === 9)

  function cell(el) {
    if (!el) return <span style={{ width: `${CELL}em`, height: `${CELL}em` }} aria-hidden="true" />
    const cat = CATEGORIES[el.cat]
    const hit = filtered?.some((x) => x.z === el.z)
    const dim = filtered && !hit
    const active = selected?.z === el.z
    return (
      <button
        type="button"
        key={el.z}
        onClick={() => setSelected(el)}
        title={`${el.sym} — ${el.name}`}
        style={{
          width: `${CELL}em`,
          height: `${CELL}em`,
          background: cat?.color || '#334155',
        }}
        className={`relative flex flex-col items-center justify-center rounded-[0.3em] text-white shadow-sm transition active:scale-95 ${
          active ? 'ring-2 ring-white' : hit ? 'ring-2 ring-white/80' : ''
        } ${dim ? 'opacity-25' : ''}`}
      >
        <span className="absolute left-[0.25em] top-[0.15em] text-[0.8em] leading-none opacity-85">
          {el.z}
        </span>
        <span className="text-[1.3em] font-bold leading-none">{el.sym}</span>
        <span className="mt-[0.15em] text-[0.7em] leading-none opacity-80">
          {Number.isInteger(el.mass) ? el.mass : el.mass.toFixed(1)}
        </span>
      </button>
    )
  }

  function gridRow(period) {
    return GROUPS.map((g) => {
      const el = main.find((e) => e.period === period && e.group === g)
      return <div key={`${period}-${g}`}>{cell(el)}</div>
    })
  }

  const gridStyle = { gridTemplateColumns: `repeat(${TABLE_COLS}, ${CELL}em)`, gap: `${GAP}em` }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-violet-300/70">{ELEMENTS.length} элементов · всё бесплатно</p>
        <button
          type="button"
          onClick={() => setShowSearch((v) => !v)}
          className="rounded-full bg-white/10 p-2 text-violet-200 active:bg-white/15"
          aria-label="Поиск"
        >
          <Search size={18} />
        </button>
      </div>

      {showSearch && (
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-violet-400/40"
          placeholder="Символ, название или номер…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      )}

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
        className="table-scroll isolate overflow-auto rounded-xl border border-white/10 bg-black/20"
        style={{ maxHeight: 'min(62dvh, 34rem)', padding: PADDING }}
      >
        <div style={{ fontSize: `${zoom * UNIT}px`, width: 'max-content' }}>
          <div
            className="sticky top-0 z-10 grid pb-[0.3em] text-center text-[0.9em] text-violet-300/60"
            style={{ ...gridStyle, background: '#020617' }}
          >
            {GROUPS.map((g) => (
              <div key={`g${g}`}>{g}</div>
            ))}
          </div>

          <div className="grid" style={gridStyle}>
            {PERIODS.map((p) => gridRow(p))}
          </div>

          <p className="mt-[0.8em] text-[1em] text-violet-300/60">Лантаноиды</p>
          <div
            className="mt-[0.3em] grid"
            style={{
              gridTemplateColumns: `repeat(${FBLOCK_COLS}, ${CELL}em)`,
              gap: `${GAP}em`,
            }}
          >
            <div
              className="flex items-center justify-center text-[0.8em] text-violet-300/60"
              style={{ height: `${CELL}em` }}
            >
              57–71
            </div>
            {lant.map((el) => (
              <div key={el.z}>{cell(el)}</div>
            ))}
          </div>

          <p className="mt-[0.8em] text-[1em] text-violet-300/60">Актиноиды</p>
          <div
            className="mt-[0.3em] grid"
            style={{
              gridTemplateColumns: `repeat(${FBLOCK_COLS}, ${CELL}em)`,
              gap: `${GAP}em`,
            }}
          >
            <div
              className="flex items-center justify-center text-[0.8em] text-violet-300/60"
              style={{ height: `${CELL}em` }}
            >
              89–103
            </div>
            {act.map((el) => (
              <div key={el.z}>{cell(el)}</div>
            ))}
          </div>
        </div>
      </div>

      <p className="px-1 text-[10px] text-violet-300/50">
        Проведите пальцем по таблице, чтобы увидеть все группы. Кнопка ⤢ умещает таблицу по ширине
        экрана.
      </p>

      <div className="flex flex-wrap gap-1.5 px-0.5">
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1 text-[10px] text-violet-200/80">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: v.color }} />
            {v.name}
          </span>
        ))}
      </div>

      {filtered && filtered.length > 0 && (
        <ul className="space-y-1">
          {filtered.slice(0, 8).map((el) => (
            <li key={el.z}>
              <button
                type="button"
                onClick={() => setSelected(el)}
                className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-3 py-2 text-left text-sm active:bg-white/10"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-white"
                  style={{ background: CATEGORIES[el.cat]?.color }}
                >
                  {el.sym}
                </span>
                <span>
                  <span className="font-medium">{el.name}</span>
                  <span className="block text-xs text-violet-300/60">
                    Z={el.z} · {el.mass} г/моль
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {filtered && filtered.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm text-violet-200/70">
          Элемент не найден. Попробуйте символ (Cu) или название (медь).
        </p>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-40 flex items-end bg-black/70 sm:items-center sm:justify-center sm:p-4"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          role="presentation"
        >
          <div className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-slate-900 p-5 sm:rounded-3xl">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl text-white shadow-lg"
                  style={{ background: CATEGORIES[selected.cat]?.color }}
                >
                  <span className="text-[10px] opacity-80">{selected.z}</span>
                  <span className="text-2xl font-bold leading-none">{selected.sym}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{selected.name}</h2>
                  <p className="text-sm text-violet-300/70">{CATEGORIES[selected.cat]?.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1 text-violet-300"
                aria-label="Закрыть"
              >
                <X size={22} />
              </button>
            </div>
            <dl className="space-y-2 text-sm">
              <Row k="Атомная масса" v={`${selected.mass} г/моль`} />
              <Row k="Атомный номер" v={selected.z} />
              <Row
                k="Период / группа"
                v={`${selected.period <= 7 ? selected.period : '—'} / ${selected.group}`}
              />
              <Row k="Электронная конфигурация" v={selected.electron} mono />
              <Row k="Степени окисления" v={selected.oxidation} />
              <Row
                k="Открыт"
                v={selected.discovery ? `${selected.discovery} г.` : 'известен с древности'}
              />
            </dl>
            <p className="mt-4 text-center text-[11px] text-violet-300/40">
              Полная карточка элемента · без подписки
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ k, v, mono }) {
  return (
    <div className="flex justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
      <dt className="text-violet-300/70">{k}</dt>
      <dd className={`text-right text-violet-50 ${mono ? 'font-mono text-xs' : ''}`}>{v}</dd>
    </div>
  )
}
