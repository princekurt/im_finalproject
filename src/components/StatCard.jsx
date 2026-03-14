import React from 'react'
import { Card } from './Card.jsx'

export function StatCard({ label, value, icon, hint }) {
  return (
    <Card className="p-5 ring-1 ring-[#CCFF00]/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold tracking-widest text-zinc-400">{label}</div>
          <div className="mt-2 truncate text-3xl font-black tracking-tight text-zinc-100">
            {value}
          </div>
          {hint ? <div className="mt-2 text-xs text-zinc-500">{hint}</div> : null}
        </div>
        <div className="rounded-2xl bg-[#CCFF00]/12 p-3 ring-1 ring-[#CCFF00]/25 text-[#CCFF00]">
          {icon}
        </div>
      </div>
    </Card>
  )
}

