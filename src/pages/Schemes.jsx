import {
  Activity,
  ArrowLeft,
  Atom,
  ChevronRight,
  FlaskConical,
  Gauge,
  Settings,
  ShieldCheck,
  Sigma,
  TestTube2,
  Thermometer,
  Zap,
} from 'lucide-react'
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
  {
    id: 'en',
    title: 'Ряд электроотрицательности',
    subtitle: 'Шкала Полинга — от Cs до F',
    count: ELECTRONEGATIVITY.length,
    icon: Zap,
    badge: 'from-amber-400 to-orange-600',
    glow: 'from-amber-500/20',
  },
  {
    id: 'org',
    title: 'Молекулярные массы органических веществ',
    subtitle: 'Готовые значения M, г/моль',
    count: ORGANIC_MASSES.length,
    icon: Atom,
    badge: 'from-emerald-400 to-teal-600',
    glow: 'from-emerald-500/20',
  },
  {
    id: 'act',
    title: 'Ряд активности металлов',
    subtitle: 'Электрохимический ряд напряжений',
    count: ACTIVITY.length,
    icon: Activity,
    badge: 'from-sky-400 to-blue-600',
    glow: 'from-sky-500/20',
  },
  {
    id: 'acidstr',
    title: 'Ряд силы кислот',
    subtitle: 'От очень сильных к очень слабым',
    count: ACID_STRENGTH.length,
    icon: Gauge,
    badge: 'from-rose-400 to-pink-600',
    glow: 'from-rose-500/20',
  },
  {
    id: 'redox',
    title: 'Стандартные электродные потенциалы',
    subtitle: 'E°, В — таблица восстановления',
    count: REDOX_POTENTIALS.length,
    icon: Sigma,
    badge: 'from-violet-400 to-purple-600',
    glow: 'from-violet-500/20',
  },
  {
    id: 'redox25',
    title: 'Редокс-потенциалы при 25 °C',
    subtitle: 'Тот же ряд с подсказками',
    count: REDOX_POTENTIALS.length,
    icon: Thermometer,
    badge: 'from-fuchsia-400 to-purple-600',
    glow: 'from-fuchsia-500/20',
  },
  {
    id: 'acids',
    title: 'Кислоты и кислотные остатки',
    subtitle: 'Названия и формулы остатков',
    count: ACIDS.length,
    icon: TestTube2,
    badge: 'from-cyan-400 to-blue-600',
    glow: 'from-cyan-500/20',
  },
  {
    id: 'safety',
    title: 'Техника безопасности',
    subtitle: 'Правила работы в лаборатории',
    count: 8,
    icon: ShieldCheck,
    badge: 'from-lime-400 to-green-600',
    glow: 'from-lime-500/20',
  },
]

export default function Schemes() {
  const [page, setPage] = useState(null)
  const nav = useNavigate()
  const current = MENU.find((m) => m.id === page)

  if (page) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setPage(null)}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-violet-200 active:bg-white/10"
        >
          <ArrowLeft size={14} /> К схемам
        </button>

        {current && (
          <div
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${current.glow} via-transparent to-transparent p-4`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${current.badge} shadow-lg`}
              >
                <current.icon size={22} className="text-white" />
              </span>
              <div className="min-w-0">
                <h2 className="text-[17px] font-medium leading-snug text-violet-50">
                  {current.title}
                </h2>
                <p className="text-[11px] text-violet-200/70">{current.subtitle}</p>
              </div>
            </div>
          </div>
        )}

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
    <div className="space-y-3">
      <p className="text-xs text-violet-300/60">Все схемы открыты · без Pro и рекламы</p>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {MENU.map((m) => (
          <Card key={m.id} item={m} onClick={() => setPage(m.id)} />
        ))}
      </div>

      <div className="pt-1">
        <Card
          item={{
            id: 'journal',
            title: 'Дневник лабораторных опытов',
            subtitle: 'Цели, шаги, наблюдения — офлайн',
            count: null,
            icon: FlaskConical,
            badge: 'from-violet-500 to-indigo-600',
            glow: 'from-violet-500/25',
            accent: true,
          }}
          onClick={() => nav('/journal')}
        />
      </div>

      <button
        type="button"
        onClick={() => nav('/settings')}
        className="flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-left active:bg-white/10"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-500/60 to-slate-700 text-white">
          <Settings size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium text-violet-50">
            Настройки, установка, APK
          </span>
          <span className="mt-0.5 block text-[11px] text-violet-300/65">
            Тема, скачать APK, очистить дневник
          </span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-violet-300/50" />
      </button>
    </div>
  )
}

function Card({ item, onClick }) {
  const { title, subtitle, count, icon: Icon, badge, glow, accent } = item
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border p-4 text-left transition-colors active:scale-[0.99] ${
        accent
          ? 'border-violet-400/30 bg-gradient-to-br from-violet-500/25 via-violet-500/5 to-transparent'
          : `border-white/10 bg-white/[0.04]`
      }`}
    >
      <span
        className={`pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${glow} to-transparent blur-2xl`}
      />
      <span className="relative flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${badge} shadow-lg shadow-black/30`}
        >
          <Icon size={21} className="text-white" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium leading-snug text-violet-50">{title}</span>
          <span className="mt-0.5 block text-[11px] leading-snug text-violet-300/70">
            {subtitle}
          </span>
        </span>
        <ChevronRight
          size={18}
          className="shrink-0 text-violet-300/50 transition-transform group-active:translate-x-0.5"
        />
      </span>
      {count != null && (
        <span className="relative mt-3 inline-flex w-fit rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] text-violet-200/80">
          {count} поз.
        </span>
      )}
    </button>
  )
}

function EnList() {
  const max = ELECTRONEGATIVITY[0].value
  return (
    <ul className="space-y-2">
      {ELECTRONEGATIVITY.map((item) => (
        <li key={item.el} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-mono font-semibold">{item.el}</span>
            <span className="tabular-nums text-violet-200/80">{item.value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
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
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
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
