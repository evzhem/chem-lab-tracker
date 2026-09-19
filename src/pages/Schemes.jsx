import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ACIDS, ACTIVITY } from '../data/chemistry'
import {
  ACID_STRENGTH,
  ELECTRONEGATIVITY,
  ORGANIC_MASSES,
  REDOX_POTENTIALS,
} from '../data/schemes'
import Safety from './Safety'

const MENU = [
  { id: 'en', title: 'Ряд электроотрицательности элементов' },
  { id: 'org', title: 'Молекулярные массы органических веществ' },
  { id: 'act', title: 'Электрохимический ряд активности металлов' },
  { id: 'acidstr', title: 'Ряд силы кислот' },
  { id: 'redox', title: 'Стандартный электродный потенциал' },
  { id: 'redox25', title: 'Стандартный редокс-потенциал при 25 °C' },
  { id: 'acids', title: 'Кислоты и кислотные остатки' },
  { id: 'safety', title: 'Техника безопасности' },
]

export default function Schemes() {
  const [page, setPage] = useState(null)
  const nav = useNavigate()

  if (page) {
    return (
      <div className="space-y-3">
        <button type="button" onClick={() => setPage(null)} className="text-sm text-violet-300">
          ← К схемам
        </button>
        <h2 className="text-lg font-medium text-violet-50">
          {MENU.find((m) => m.id === page)?.title}
        </h2>
        {page === 'en' && <EnList />}
        {page === 'org' && <OrgList />}
        {page === 'act' && <ActList />}
        {page === 'acidstr' && <AcidStrList />}
        {page === 'redox' && <RedoxList title="E°, В (восстановление)" />}
        {page === 'redox25' && <RedoxList title="E° при 25 °C, В" />}
        {page === 'acids' && <AcidsList />}
        {page === 'safety' && <Safety />}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <p className="mb-3 text-xs text-violet-300/60">Все схемы открыты · без Pro и рекламы</p>
      <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
        {MENU.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setPage(m.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-[15px] text-violet-50 active:bg-white/5"
            >
              <span>{m.title}</span>
              <ChevronRight size={18} className="shrink-0 text-violet-400/50" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => nav('/journal')}
        className="mt-4 flex w-full items-center justify-between rounded-2xl border border-violet-400/30 bg-violet-500/15 px-4 py-4 text-left text-sm text-violet-100"
      >
        <span>Дневник лабораторных опытов</span>
        <ChevronRight size={18} className="text-violet-300/60" />
      </button>
      <button
        type="button"
        onClick={() => nav('/install')}
        className="mt-2 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-violet-100"
      >
        <span>Установить приложение / скачать APK</span>
        <ChevronRight size={18} className="text-violet-300/60" />
      </button>
    </div>
  )
}

function EnList() {
  const max = ELECTRONEGATIVITY[0].value
  return (
    <ul className="space-y-2">
      {ELECTRONEGATIVITY.map((item) => (
        <li key={item.el} className="rounded-xl bg-white/5 px-3 py-2">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-mono font-semibold">{item.el}</span>
            <span className="text-violet-200/80">{item.value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/40">
            <div
              className="h-full rounded-full bg-violet-400"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
      <p className="text-[11px] text-violet-300/50">Шкала Полинга (упрощённо)</p>
    </ul>
  )
}

function OrgList() {
  return (
    <ul className="space-y-2">
      {ORGANIC_MASSES.map((o) => (
        <li
          key={o.formula}
          className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3"
        >
          <div>
            <p className="font-mono text-violet-50">{o.formula}</p>
            <p className="text-xs text-violet-300/70">{o.name}</p>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">{o.mass}</p>
        </li>
      ))}
    </ul>
  )
}

function ActList() {
  return (
    <ol className="space-y-2">
      {ACTIVITY.map((item, i) => (
        <li
          key={item.metal}
          className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
            item.metal === 'H₂'
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
      ))}
    </ol>
  )
}

function AcidStrList() {
  const color = {
    'очень сильная': 'text-rose-300',
    сильная: 'text-orange-300',
    средняя: 'text-amber-200',
    слабая: 'text-emerald-300',
    'очень слабая': 'text-teal-300',
  }
  return (
    <ol className="space-y-2">
      {ACID_STRENGTH.map((a, i) => (
        <li
          key={a.name}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3"
        >
          <span>
            <span className="mr-2 text-xs text-violet-400/50">{i + 1}.</span>
            <span className="font-mono">{a.name}</span>
            <span className="ml-2 text-xs text-violet-300/60">{a.label}</span>
          </span>
          <span className={`text-xs ${color[a.strength] || ''}`}>{a.strength}</span>
        </li>
      ))}
    </ol>
  )
}

function RedoxList({ title }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-violet-300/60">{title}</p>
      <ul className="space-y-1.5">
        {REDOX_POTENTIALS.map((r) => (
          <li
            key={r.half}
            className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-sm"
          >
            <span className="font-mono text-violet-100">{r.half}</span>
            <span
              className={`tabular-nums font-medium ${
                r.E > 0 ? 'text-emerald-300' : r.E < 0 ? 'text-rose-300' : 'text-violet-200'
              }`}
            >
              {r.E > 0 ? '+' : ''}
              {r.E.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-violet-300/45">
        Чем выше E°, тем сильнее окислитель (левая форма пары).
      </p>
    </div>
  )
}

function AcidsList() {
  return (
    <ul className="space-y-2">
      {ACIDS.map((a) => (
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
  )
}
