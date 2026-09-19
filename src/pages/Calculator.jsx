import { useMemo, useState } from 'react'
import { parseFormula } from '../lib/molarMass'

const EXAMPLES = ['H2SO4', 'CaCO3', 'NaOH', 'CuSO4·5H2O', 'Fe2(SO4)3', 'Al2(SO4)3·18H2O', 'C6H12O6']

function fmt(n, digits = 3) {
  if (n == null || !Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-4)) return n.toExponential(3)
  return n.toFixed(digits)
}

export default function Calculator() {
  const [formula, setFormula] = useState('H2SO4')
  const [c, setC] = useState('0.1')
  const [v, setV] = useState('0.25')
  const [mSolute, setMSolute] = useState('')
  const [vUnit, setVUnit] = useState('L') // L | mL

  const molar = useMemo(() => {
    try {
      return { ok: true, ...parseFormula(formula) }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }, [formula])

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

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="mb-2 font-medium">Молярная масса</h2>
        <input
          className="w-full rounded-xl border border-transparent bg-white/10 px-3 py-2.5 font-mono text-base outline-none focus:border-violet-400/40"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="H2SO4, CaCO3, CuSO4·5H2O"
          inputMode="text"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <p className="mt-1.5 text-[11px] text-violet-300/55">
          Скобки, [комплексы], кристаллогидраты · * . — поддерживаются
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setFormula(ex)}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                formula === ex ? 'bg-violet-500 text-white' : 'bg-violet-500/20 text-violet-100'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
        {molar.ok ? (
          <div className="mt-4">
            <p className="text-3xl font-semibold tracking-tight">
              {fmt(molar.total)}{' '}
              <span className="text-base font-normal text-violet-300">г/моль</span>
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              {molar.breakdown.map((b) => (
                <li
                  key={b.el}
                  className="flex items-center justify-between gap-2 rounded-lg bg-black/25 px-3 py-1.5"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-mono text-violet-100">{b.el}</span>
                    <span className="text-violet-300/60"> · {b.name}</span>
                    <span className="text-violet-300/80"> × {formatCount(b.n)}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-violet-200/80">
                    {b.mass}×{formatCount(b.n)}={fmt(b.sub)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {molar.error}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="mb-1 font-medium">Растворы</h2>
        <p className="mb-3 text-xs text-violet-300/70">
          m = C · V · M &nbsp;·&nbsp; C = m / (V · M)
        </p>
        {!molar.ok && (
          <p className="mb-3 text-xs text-amber-200/80">
            Сначала введите корректную формулу выше — M берётся из неё.
          </p>
        )}
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
            <span className="flex items-center justify-between gap-1">
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
        <div className="mt-3 rounded-xl bg-black/25 px-3 py-3">
          <p className="text-xs text-violet-300/60">Масса растворённого вещества</p>
          <p className="text-xl font-semibold">
            {massFromCV != null ? `${fmt(massFromCV)} г` : '—'}
          </p>
          {molar.ok && (
            <p className="mt-1 text-[11px] text-violet-300/50">
              M = {fmt(molar.total)} г/моль
              {volumeL != null && vUnit === 'mL' ? ` · V = ${fmt(volumeL, 4)} л` : ''}
            </p>
          )}
        </div>
        <label className="mt-4 block text-sm">
          Обратный расчёт: масса навески, г
          <input
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
            value={mSolute}
            onChange={(e) => setMSolute(e.target.value)}
            placeholder="необязательно"
            inputMode="decimal"
          />
        </label>
        {mSolute !== '' && (
          <div className="mt-2 rounded-xl bg-black/25 px-3 py-2 text-sm">
            C ={' '}
            <span className="font-semibold">
              {concFromMass != null ? `${fmt(concFromMass, 4)} моль/л` : '—'}
            </span>
          </div>
        )}
      </section>
    </div>
  )
}

function formatCount(n) {
  return Number.isInteger(n) ? String(n) : String(n)
}
