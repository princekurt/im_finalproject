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
        String(m.phone).toLowerCase().includes(q) ||
        String(m.tier).toLowerCase().includes(q)
      )
    })
  }, [members, query])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-black tracking-tight text-zinc-100">Members</div>
          <div className="mt-1 text-xs text-zinc-500">
            Search by name, ID, contact, phone, or tier.
          </div>
        </div>

        <div className="w-full md:w-[360px]">
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members…"
            leading={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 bg-[#161616]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/30 text-xs font-semibold tracking-widest text-zinc-500">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Days Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((m) => {
                const remaining = daysRemaining(m.endDate)
                return (
                  <tr
                    key={m.id}
                    className="cursor-pointer hover:bg-white/5 active:bg-white/10 transition"
                    onClick={() => onOpenMember?.(m)}
                  >
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <div className="truncate font-bold text-zinc-100">{m.name}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                          <span className="font-semibold tracking-widest text-zinc-400">{m.id}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span className="truncate">{m.contact}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-200">{m.tier}</td>
                    <td className="px-4 py-3 text-zinc-400">{formatISO(m.startDate)}</td>
                    <td className="px-4 py-3 text-zinc-400">{formatISO(m.endDate)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone(m)}>{statusLabel(m)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-black tracking-tight">
                      <span className={isActiveMember(m) ? 'text-[#CCFF00]' : 'text-[#FF4500]/90'}>
                        {remaining == null ? '—' : remaining}
                      </span>
                    </td>
                  </tr>
                )
              })}

              {filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-sm text-zinc-400" colSpan={6}>
                    No results. Try a different search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-zinc-600">
        Tip: Click a row to open the profile view.
      </div>
    </div>
  )
}

