import {
  Beaker,
  Calculator,
  Droplets,
  FlaskConical,
  Grid3x3,
  List,
  Settings,
} from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { to: '/', icon: Beaker, label: 'Реакции', end: true },
  { to: '/table', icon: Grid3x3, label: 'Таблица' },
  { to: '/solubility', icon: Droplets, label: 'Растворим.' },
  { to: '/calc', icon: Calculator, label: 'Молярная' },
  { to: '/schemes', icon: List, label: 'Схемы' },
]

const titles = {
  '/': 'Реакции',
  '/table': 'Таблица Менделеева',
  '/solubility': 'Таблица растворимости',
  '/calc': 'Калькулятор молярных масс',
  '/schemes': 'Схемы',
  '/journal': 'Дневник опытов',
  '/settings': 'Настройки',
  '/safety': 'Безопасность',
}

export default function Layout() {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const isExperiment = pathname.startsWith('/exp/')
  const isJournal = pathname.startsWith('/journal') || isExperiment
  const subtitle = isExperiment ? 'Опыт' : titles[pathname] || 'ChemLab Tracker'

  return (
    <div className="app-bg min-h-svh text-violet-50">
      <div className="mx-auto flex min-h-svh max-w-lg flex-col">
        <header className="app-bar sticky top-0 z-20 flex items-start justify-between gap-2 border-b border-white/5 px-4 pb-2 pt-[max(0.7rem,env(safe-area-inset-top))] backdrop-blur-xl">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-[10px] font-bold shadow">
                H₂O
              </div>
              <h1 className="truncate text-lg font-medium tracking-tight text-violet-50 sm:text-xl">
                {subtitle}
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {(isJournal || pathname === '/schemes') && (
              <button
                type="button"
                onClick={() => nav('/journal')}
                className="rounded-full bg-white/5 p-2 text-violet-300 active:bg-white/10"
                title="Дневник"
                aria-label="Дневник"
              >
                <FlaskConical size={18} />
              </button>
            )}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `rounded-full p-2 transition-colors ${
                  isActive
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-violet-300 active:bg-white/10'
                }`
              }
              title="Настройки"
              aria-label="Настройки"
            >
              <Settings size={18} />
            </NavLink>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-28">
          <Outlet />
        </main>

        <nav
          className="app-bar fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 backdrop-blur-xl"
          style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1.5">
            {tabs.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => {
                  const active =
                    isActive ||
                    (to === '/schemes' && (isJournal || pathname === '/safety'))
                  return `flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] transition-colors ${
                    active
                      ? 'text-violet-200'
                      : 'text-violet-300/45 active:bg-white/5'
                  }`
                }}
              >
                {({ isActive }) => {
                  const active =
                    isActive ||
                    (to === '/schemes' && (isJournal || pathname === '/safety'))
                  return (
                    <>
                      <Icon size={22} strokeWidth={active ? 2.2 : 1.7} />
                      <span className="leading-tight">{label}</span>
                    </>
                  )
                }}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
