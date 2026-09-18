import { useMemo, useState } from 'react'
import { parseFormula } from '../lib/molarMass'

export default function Calculator() {
  const [formula, setFormula] = useState('H2SO4')
  const [c, setC] = useState('0.1')
  const [v, setV] = useState('0.25')
  const [mSolute, setMSolute] = useState('')

  const molar = useMemo(() => {
    try {
      return { ok: true, ...parseFormula(formula) }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }, [formula])

  const massFromCV = useMemo(() => {
    if (!molar.ok) return null
    const C = Number(c)
    const V = Number(v)
    if (![C, V].every(Number.isFinite)) return null
    return C * V * molar.total
  }, [c, v, molar])

  const concFromMass = useMemo(() => {
    if (!molar.ok) return null
    const m = Number(mSolute)
    const V = Number(v)
    if (![m, V].every(Number.isFinite) || V === 0) return null
    return m / (V * molar.total)
  }, [mSolute, v, molar])

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="mb-2 font-medium">Молярная масса</h2>
        <input
          className="w-full rounded-xl bg-white/10 px-3 py-2 font-mono outline-none"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="H2SO4, CaCO3, Fe2(SO4)3"
        />
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {['H2SO4', 'CaCO3', 'NaOH', 'CuSO4*5H2O', 'Fe2(SO4)3'].map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setFormula(ex)}
              className="rounded-full bg-violet-500/20 px-2 py-1"
            >
              {ex}
            </button>
          ))}
        </div>
        {molar.ok ? (
          <div className="mt-4">
            <p className="text-3xl font-semibold">
              {molar.total.toFixed(3)}{' '}
              <span className="text-base font-normal text-violet-300">г/моль</span>
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              {molar.breakdown.map((b) => (
                <li key={b.el} className="flex justify-between rounded-lg bg-black/20 px-3 py-1.5">
                  <span>
                    {b.el} · {b.name} × {b.n}
                  </span>
                  <span className="text-violet-200/80">
                    {b.mass} × {b.n} = {b.sub.toFixed(3)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-sm text-rose-300">{molar.error}</p>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="mb-1 font-medium">Растворы</h2>
        <p className="mb-3 text-xs text-violet-300/70">m = C · V · M (моль/л · л · г/моль)</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            C, моль/л
            <input
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={c}
              onChange={(e) => setC(e.target.value)}
            />
          </label>
          <label className="text-sm">
            V, л
            <input
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={v}
              onChange={(e) => setV(e.target.value)}
            />
          </label>
        </div>
        <p className="mt-3 text-lg">
          Масса вещества:{' '}
          <span className="font-semibold">
            {massFromCV != null ? `${massFromCV.toFixed(3)} г` : '—'}
          </span>
        </p>
        <label className="mt-4 block text-sm">
          Обратный расчёт: масса навески, г
          <input
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
            value={mSolute}
            onChange={(e) => setMSolute(e.target.value)}
            placeholder="необязательно"
          />
        </label>
        {mSolute && (
          <p className="mt-2 text-sm">
            C = {concFromMass != null ? `${concFromMass.toFixed(4)} моль/л` : '—'}
          </p>
        )}
      </section>
    </div>
  )
}
