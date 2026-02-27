import React, { useMemo } from 'react'
import { AlarmClock, Dumbbell, Users } from 'lucide-react'
import { StatCard } from '../components/StatCard.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { Badge } from '../components/Badge.jsx'
import { daysRemaining, formatISO, isActiveMember } from '../utils/dates.js'

export function DashboardPage({ members, onOpenMember }) {
  const now = new Date()

  const stats = useMemo(() => {
    const total = members.length
    const active = members.filter((m) => isActiveMember(m, now)).length
    const expiringSoon = members.filter((m) => {
      const r = daysRemaining(m.endDate, now)
      return r != null && r >= 0 && r <= 7
    }).length
    return { total, active, expiringSoon }
  }, [members, now])

  const expiringList = useMemo(() => {
    return [...members]
      .map((m) => ({ m, r: daysRemaining(m.endDate, now) }))
      .filter((x) => x.r != null && x.r >= 0 && x.r <= 14)
      .sort((a, b) => a.r - b.r)
      .slice(0, 6)
  }, [members, now])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="TOTAL MEMBERS"
          value={stats.total}
          hint="All-time directory entries (mock)."
          icon={<Users className="h-5 w-5" />}
          accent="lime"
        />
        <StatCard
          label="ACTIVE NOW"
          value={stats.active}
          hint="Membership end date is today or later."
          icon={<Dumbbell className="h-5 w-5" />}
          accent="lime"
        />
        <StatCard
          label="EXPIRING SOON"
          value={stats.expiringSoon}
          hint="Within the next 7 days."
          icon={<AlarmClock className="h-5 w-5" />}
          accent="orange"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black tracking-tight text-zinc-100">Expiring Soon</div>
                <div className="mt-1 text-xs text-zinc-500">Prioritize renewals and outreach.</div>
              </div>
              <Badge tone="neutral">Next 14 days</Badge>
            </div>
          </CardHeader>
          <CardBody>
            {expiringList.length === 0 ? (
              <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10 text-sm text-zinc-400">
                No memberships expiring in the next 14 days.
              </div>
            ) : (
              <div className="space-y-2">
                {expiringList.map(({ m, r }) => (
                  <button
                    key={m.id}
                    type="button"
                    className="w-full rounded-2xl bg-black/25 p-4 text-left ring-1 ring-white/10 hover:bg-white/5 active:bg-white/10 transition"
                    onClick={() => onOpenMember?.(m)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-zinc-100">{m.name}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                          <span className="font-semibold tracking-widest text-zinc-400">{m.id}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span>{m.tier}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span>Ends {formatISO(m.endDate)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold tracking-widest text-zinc-500">DAYS LEFT</div>
                        <div className="mt-1 text-2xl font-black tracking-tight text-[#FF4500]">
                          {r}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-black tracking-tight text-zinc-100">Ops Notes</div>
            <div className="mt-1 text-xs text-zinc-500">Placeholders for your team’s logic.</div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 text-sm text-zinc-300">
              <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold tracking-widest text-zinc-500">TODO</div>
                <div className="mt-2 font-bold">Check-in workflow</div>
                <div className="mt-1 text-xs text-zinc-500">
                  // TODO: Group will implement Member Check-In here.
                </div>
              </div>
              <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold tracking-widest text-zinc-500">TODO</div>
                <div className="mt-2 font-bold">Renewals + payments</div>
                <div className="mt-1 text-xs text-zinc-500">
                  // TODO: Group will implement Renew Membership + Payment tracking here.
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

