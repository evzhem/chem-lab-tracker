import {
  AlertTriangle,
  Droplets,
  Eye,
  Flame,
  FlaskConical,
  Recycle,
  ShieldAlert,
  Thermometer,
  Wind,
} from 'lucide-react'
import { SAFETY } from '../data/chemistry'

const ICONS = [Eye, AlertTriangle, Droplets, Wind, Flame, Thermometer, ShieldAlert, Recycle]

export default function Safety() {
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm text-violet-200/80">
        <FlaskConical size={18} className="text-violet-300" />
        Правила техники безопасности в лаборатории
      </p>
      {SAFETY.map((card, i) => {
        const Icon = ICONS[i % ICONS.length]
        return (
          <article
            key={card.title}
            className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200">
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="font-medium text-violet-100">{card.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-violet-200/80">{card.text}</p>
            </div>
          </article>
        )
      })}
      <p className="px-1 pb-2 text-center text-[11px] text-violet-300/45">
        При сомнениях всегда спрашивайте преподавателя.
      </p>
    </div>
  )
}
