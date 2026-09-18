import { ShieldAlert } from 'lucide-react'
import { SAFETY } from '../data/chemistry'

export default function Safety() {
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm text-violet-200/80">
        <ShieldAlert size={18} /> Правила техники безопасности
      </p>
      {SAFETY.map((card) => (
        <article
          key={card.title}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <h2 className="font-medium text-violet-100">{card.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-violet-200/80">{card.text}</p>
        </article>
      ))}
    </div>
  )
}
