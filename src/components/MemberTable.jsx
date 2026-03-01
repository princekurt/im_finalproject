import React, { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Badge } from './Badge.jsx'
import { TextField } from './Field.jsx'
import { daysRemaining, formatISO, isActiveMember } from '../utils/dates.js'

function statusTone(member) {
  return isActiveMember(member) ? 'active' : 'expired'
}

function statusLabel(member) {
  return isActiveMember(member) ? 'Active' : 'Expired'
}

export function MemberTable({ members, onOpenMember }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return members
    return members.filter((m) => {
      return (
        String(m.id).toLowerCase().includes(q) ||
        String(m.name).toLowerCase().includes(q) ||
        String(m.contact).toLowerCase().includes(q) ||
        String(m.membershipType).toLowerCase().includes(q) 
      )
    })
  }, [members, query])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-black tracking-tight text-zinc-100 uppercase">Gym Registry</div>
          <div className="mt-1 text-xs text-zinc-500">
            Search by name, ID, or membership access level.
          </div>
        </div>

        <div className="w-full md:w-[360px]">
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members..."
            leading={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 bg-[#161616]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/40 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              <tr>
                <th className="px-4 py-4">Member Info</th>
                <th className="px-4 py-4">Membership Type</th>
                <th className="px-4 py-4">Access Start</th>
                <th className="px-4 py-4">Access End</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-4 py-4 text-right">Days Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((m) => {
                const remaining = daysRemaining(m.endDate)
                return (
                  <tr
                    key={m.id}
                    className="group cursor-pointer hover:bg-white/[0.02] active:bg-white/[0.05] transition-colors"
                    onClick={() => onOpenMember?.(m)}
                  >
                    <td className="px-4 py-4">
                      <div className="min-w-0">
                        <div className="font-bold text-zinc-100 group-hover:text-[#CCFF00] transition-colors">{m.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase">
                          <span>{m.id}</span>
                          <span className="h-1 w-1 rounded-full bg-zinc-700" />
                          <span className="truncate">{m.contact}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-300 text-xs font-medium">
                      {m.membershipType}
                    </td>
                    <td className="px-4 py-4 text-zinc-500 text-xs font-mono">{formatISO(m.startDate)}</td>
                    <td className="px-4 py-4 text-zinc-500 text-xs font-mono">{formatISO(m.endDate)}</td>
                    <td className="px-4 py-4 text-center">
                      <Badge tone={statusTone(m)}>{statusLabel(m)}</Badge>
                    </td>
                    <td className="px-4 py-4 text-right font-black tracking-tighter">
                      <span className={isActiveMember(m) ? 'text-[#CCFF00]' : 'text-red-500/80'}>
                        {remaining == null ? '—' : remaining}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}