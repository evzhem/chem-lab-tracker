import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CATEGORIES, ELEMENTS } from '../data/elements'

export default function PeriodicTable() {
  const [selected, setSelected] = useState(null)
  const [q, setQ] = useState('')
  const [showSearch, setShowSearch] = useState(false)

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
    if (!el) return <div className="aspect-square" />
    const cat = CATEGORIES[el.cat]
    const hit =
      filtered && filtered.some((x) => x.z === el.z)
        ? 'ring-2 ring-white scale-[1.03] z-[1]'
        : filtered
          ? 'opacity-30'
          : ''
    return (
      <button
        type="button"
        key={el.z}
        onClick={() => setSelected(el)}
        title={`${el.sym} — ${el.name}`}
        className={`relative flex aspect-square flex-col items-center justify-center rounded-[3px] p-0.5 text-white shadow-sm transition active:scale-95 ${hit}`}
        style={{ background: cat?.color || '#334155' }}
      >
        <span className="absolute left-0.5 top-0 text-[7px] leading-none opacity-80 sm:text-[8px]">
          {el.z}
        </span>
        <span className="text-[10px] font-bold leading-none sm:text-xs">{el.sym}</span>
        <span className="mt-0.5 hidden max-w-full truncate text-[6px] opacity-80 xs:block sm:text-[7px]">
          {el.mass}
        </span>
      </button>
    )
  }

  function gridRow(period, groups) {
    return groups.map((g) => {
      const el = main.find((e) => e.period === period && e.group === g)
      return (
        <div key={`${period}-${g}`} className="min-w-0">
          {cell(el)}
        </div>
      )
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-violet-300/70">Всё бесплатно · полный доступ</p>
        <button
          type="button"
          onClick={() => setShowSearch((v) => !v)}
          className="rounded-full bg-white/10 p-2 text-violet-200"
          aria-label="Поиск"
        >
          <Search size={18} />
        </button>
      </div>

      {showSearch && (
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none"
          placeholder="Символ, название или номер…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20 p-1.5 [-webkit-overflow-scrolling:touch]">
        <div
          className="grid gap-[2px]"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(1.55rem, 1fr))',
            minWidth: '28rem',
          }}
        >
          {/* group numbers */}
          {Array.from({ length: 18 }, (_, i) => (
            <div
              key={`g${i}`}
              className="pb-0.5 text-center text-[8px] text-violet-300/50"
            >
              {i + 1}
            </div>
          ))}
          {[1, 2, 3, 4, 5, 6, 7].map((p) => gridRow(p, Array.from({ length: 18 }, (_, i) => i + 1)))}
        </div>

        <p className="mt-2 px-1 text-[10px] text-violet-300/50">Лантаноиды</p>
        <div
          className="mt-1 grid gap-[2px]"
          style={{
            gridTemplateColumns: 'repeat(15, minmax(1.55rem, 1fr))',
            minWidth: '24rem',
          }}
        >
          {/* spacer label cell */}
          <div className="flex items-center justify-center text-[8px] text-violet-300/60">57–71</div>
          {lant.map((el) => (
            <div key={el.z}>{cell(el)}</div>
          ))}
        </div>
        <p className="mt-2 px-1 text-[10px] text-violet-300/50">Актиноиды</p>
        <div
          className="mt-1 grid gap-[2px]"
          style={{
            gridTemplateColumns: 'repeat(15, minmax(1.55rem, 1fr))',
            minWidth: '24rem',
          }}
        >
          <div className="flex items-center justify-center text-[8px] text-violet-300/60">89–103</div>
          {act.map((el) => (
            <div key={el.z}>{cell(el)}</div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-0.5">
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1 text-[10px] text-violet-200/80">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: v.color }} />
            {v.name}
          </span>
        ))}
      </div>

      {filtered && filtered.length > 0 && !selected && (
        <ul className="space-y-1">
          {filtered.slice(0, 8).map((el) => (
            <li key={el.z}>
              <button
                type="button"
                onClick={() => setSelected(el)}
                className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-3 py-2 text-left text-sm"
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
              <button type="button" onClick={() => setSelected(null)} className="p-1 text-violet-300">
                <X size={22} />
              </button>
            </div>
            <dl className="space-y-2 text-sm">
              <Row k="Атомная масса" v={`${selected.mass} г/моль`} />
              <Row k="Атомный номер" v={selected.z} />
              <Row k="Период / группа" v={`${selected.period <= 7 ? selected.period : '—'} / ${selected.group}`} />
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
