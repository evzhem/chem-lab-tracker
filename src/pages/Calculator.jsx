import { useMemo, useState } from 'react'
import { parseFormula } from '../lib/molarMass'

const EXAMPLES = ['H2SO4', 'CaCO3', 'NaOH', 'CuSO4·5H2O', 'Fe2(SO4)3', 'C6H12O6']

function fmt(n, digits = 3) {
  if (n == null || !Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-4)) return n.toExponential(3)
  return n.toFixed(digits)
}

export default function Calculator() {
  const [formula, setFormula] = useState('')
  const [committed, setCommitted] = useState('')
  const [c, setC] = useState('0.1')
  const [v, setV] = useState('0.25')
  const [mSolute, setMSolute] = useState('')
  const [vUnit, setVUnit] = useState('L')

  const active = committed || formula
  const molar = useMemo(() => {
    if (!active.trim()) return { ok: false, empty: true }
    try {
      return { ok: true, ...parseFormula(active) }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }, [active])

  const volumeL = useMemo(() => {
    const raw = Number(String(v).replace(',', '.'))
    if (!Number.isFinite(raw)) return null
    return vUnit === 'mL' ? raw / 1000 : raw
  }, [v, vUnit])

  const massFromCV = useMemo(() => {
    if (!molar.ok || volumeL == null) return null
    const C = Number(String(c).replace(',', '.'))
    if (!Number.isFinite(C)) return null
    return C * volumeL * molar.total
  }, [c, volumeL, molar])

  const concFromMass = useMemo(() => {
    if (!molar.ok || volumeL == null || volumeL === 0) return null
    const m = Number(String(mSolute).replace(',', '.'))
    if (!Number.isFinite(m)) return null
    return m / (volumeL * molar.total)
  }, [mSolute, volumeL, molar])

  function find(e) {
    e?.preventDefault()
    setCommitted(formula.trim())
  }

  return (
    <div className="space-y-5">
      <form onSubmit={find} className="relative">
        <input
          className="w-full border-b border-white/15 bg-transparent py-3 pr-16 font-mono text-lg outline-none placeholder:text-violet-300/35 focus:border-violet-400"
          value={formula}
          onChange={(e) => {
            setFormula(e.target.value)
            setCommitted(e.target.value)
          }}
          placeholder="H2SO4"
          inputMode="text"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-violet-300"
        >
          Найти
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => {
              setFormula(ex)
              setCommitted(ex)
            }}
            className={`rounded-xl px-3 py-2 text-sm ${
              active === ex ? 'bg-violet-500 text-white' : 'bg-violet-500/25 text-violet-100'
            }`}
          >
            {ex}
          </button>
        ))}
      </div>

      {!active.trim() && (
        <div className="space-y-3 pt-6 text-center text-violet-100/80">
          <p>Введите формулу вещества в поле поиска.</p>
          <p>
            Например:{' '}
            <button
              type="button"
              className="rounded-xl bg-violet-500/30 px-3 py-1.5 font-mono"
              onClick={() => {
                setFormula('CaCO3')
                setCommitted('CaCO3')
              }}
            >
              CaCO3
            </button>
          </p>
          <p className="text-sm text-violet-300/60">
            Маленькие и большие буквы должны быть введены правильно.
          </p>
          <p className="text-xs text-violet-300/40">
            Поддержка: скобки, [комплексы], кристаллогидраты CuSO4·5H2O
          </p>
        </div>
      )}

      {active.trim() && molar.ok && (
        <div className="space-y-3">
          <p className="text-3xl font-semibold tracking-tight">
            {fmt(molar.total)}{' '}
            <span className="text-base font-normal text-violet-300">г/моль</span>
          </p>
          <ul className="space-y-1 text-sm">
            {molar.breakdown.map((b) => (
              <li
                key={b.el}
                className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2"
              >
                <span>
                  <span className="font-mono">{b.el}</span>
                  <span className="text-violet-300/60"> · {b.name}</span>
                  <span className="text-violet-300/80"> × {b.n}</span>
                </span>
                <span className="font-mono text-xs text-violet-200/80">{fmt(b.sub)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {active.trim() && !molar.ok && !molar.empty && (
        <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{molar.error}</p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="mb-1 font-medium">Растворы</h2>
        <p className="mb-3 text-xs text-violet-300/70">m = C · V · M · C = m / (V · M)</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            C, моль/л
            <input
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={c}
              onChange={(e) => setC(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <label className="text-sm">
            <span className="flex items-center justify-between">
              V
              <span className="flex rounded-lg bg-black/30 p-0.5 text-[10px]">
                {['L', 'mL'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setVUnit(u)}
                    className={`rounded-md px-1.5 py-0.5 ${
                      vUnit === u ? 'bg-violet-500 text-white' : 'text-violet-300/70'
                    }`}
                  >
                    {u === 'L' ? 'л' : 'мл'}
                  </button>
                ))}
              </span>
            </span>
            <input
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={v}
              onChange={(e) => setV(e.target.value)}
              inputMode="decimal"
            />
          </label>
        </div>
        <div className="mt-3 rounded-xl bg-black/30 px-3 py-3">
          <p className="text-xs text-violet-300/60">Масса растворённого вещества</p>
          <p className="text-xl font-semibold">
            {massFromCV != null ? `${fmt(massFromCV)} г` : '—'}
          </p>
        </div>
        <label className="mt-3 block text-sm">
          Масса навески, г → C
          <input
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
            value={mSolute}
            onChange={(e) => setMSolute(e.target.value)}
            placeholder="необязательно"
            inputMode="decimal"
          />
        </label>
        {mSolute !== '' && (
          <p className="mt-2 text-sm">
            C ={' '}
            <span className="font-semibold">
              {concFromMass != null ? `${fmt(concFromMass, 4)} моль/л` : '—'}
            </span>
          </p>
        )}
      </section>
    </div>
  )
}
