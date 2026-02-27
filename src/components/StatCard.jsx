import React from 'react'
import { Card } from './Card.jsx'

export function StatCard({ label, value, icon, hint, accent = 'lime' }) {
  const accentCls =
    accent === 'orange'
      ? 'from-[#FF4500]/18 to-transparent ring-[#FF4500]/20'
      : 'from-[#CCFF00]/18 to-transparent ring-[#CCFF00]/20'

  return (
    <Card className="relative overflow-hidden">
      <div className={['pointer-events-none absolute inset-0 bg-gradient-to-br', accentCls].join(' ')} />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-semibold tracking-widest text-zinc-400">{label}</div>
            <div className="mt-2 truncate text-3xl font-black tracking-tight text-zinc-100">
              {value}
            </div>
            {hint ? <div className="mt-2 text-xs text-zinc-500">{hint}</div> : null}
          </div>
          <div className="rounded-2xl bg-black/35 p-3 ring-1 ring-white/10 text-zinc-200">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  )
}

