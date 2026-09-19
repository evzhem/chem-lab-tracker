import { BookOpen, Calculator, FlaskConical, Shield } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/', icon: FlaskConical, label: 'Дневник', end: true },
  { to: '/calc', icon: Calculator, label: 'Расчёт' },
  { to: '/ref', icon: BookOpen, label: 'Справка' },
  { to: '/safety', icon: Shield, label: 'ТБ' },
]

export default function Layout() {
  return (
    <div className="min-h-svh bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-violet-50">
      <div className="mx-auto flex min-h-svh max-w-lg flex-col">
        <header className="px-5 pb-2 pt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300/80">ChemLab</p>
          <h1 className="text-2xl font-semibold tracking-tight">Tracker</h1>
        </header>
        <main className="flex-1 overflow-y-auto px-4 pb-24">
          <Outlet />
        </main>
        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto grid max-w-lg grid-cols-4 px-2 py-2">
            {tabs.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] ${
                    isActive ? 'bg-violet-500/20 text-violet-200' : 'text-violet-300/60'
                  }`
                }
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
