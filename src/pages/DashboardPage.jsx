import React, { useState, useEffect, useMemo } from 'react'
import { AlarmClock, Dumbbell, Users, Loader2, AlertCircle, UserPlus, TrendingUp } from 'lucide-react'
import { StatCard } from '../components/StatCard.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { Badge } from '../components/Badge.jsx'
import { daysRemaining, formatISO, isActiveMember } from '../utils/dates.js'
import { supabase } from '../lib/supabase'

export function DashboardPage({ onOpenMember }) {
  const [members, setMembers] = useState([])
  const [walkInCount, setWalkInCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const now = new Date()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 1. Fetch Membership Data
      const { data: memberData, error: memberError } = await supabase
        .from('tbl_membership')
        .select(`
          membership_id,
          start_date,
          end_date,
          tbl_customer (full_name),
          tbl_membershiptype (membershiptype_name)
        `)

      if (memberError) throw memberError

      // 2. Fetch Today's Walk-ins from tbl_walkintransaction using time_in
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)
      
      const { count, error: walkInError } = await supabase
        .from('tbl_walkintransaction')
        .select('*', { count: 'exact', head: true })
        .gte('time_in', startOfToday.toISOString())

      if (walkInError) {
        console.error("Walk-in Fetch Error:", walkInError)
      }

      const formatted = memberData.map(m => ({
        id: `M-${m.membership_id}`,
        name: m.tbl_customer?.full_name || 'Unknown',
        tier: m.tbl_membershiptype?.membershiptype_name || 'Standard',
        startDate: m.start_date,
        endDate: m.end_date
      }))

      setMembers(formatted)
      setWalkInCount(count || 0)
    } catch (err) {
      console.error("Dashboard Fetch Error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = members.length
    const active = members.filter((m) => isActiveMember(m, now)).length
    const expiringSoon = members.filter((m) => {
      const r = daysRemaining(m.endDate, now)
      return r != null && r >= 0 && r <= 7
    }).length
    return { total, active, expiringSoon }
  }, [members])

  const expiringList = useMemo(() => {
    return [...members]
      .map((m) => ({ m, r: daysRemaining(m.endDate, now) }))
      .filter((x) => x.r != null && x.r >= 0 && x.r <= 14)
      .sort((a, b) => a.r - b.r)
      .slice(0, 6)
  }, [members])

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-[#CCFF00]">
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <span className="font-black italic uppercase tracking-widest text-sm">Crunching Gym Data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="TOTAL MEMBERS"
          value={stats.total}
          hint="All records in database."
          icon={<Users className="h-5 w-5" />}
          accent="lime"
        />
        <StatCard
          label="ACTIVE NOW"
          value={stats.active}
          hint="Valid membership as of today."
          icon={<Dumbbell className="h-5 w-5" />}
          accent="lime"
        />
        <StatCard
          label="EXPIRING SOON"
          value={stats.expiringSoon}
          hint="Expiring within 7 days."
          icon={<AlarmClock className="h-5 w-5" />}
          accent="orange"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black tracking-tight text-zinc-100 uppercase italic">Expiring Soon</div>
                <div className="mt-1 text-xs text-zinc-500">Members requiring immediate attention.</div>
              </div>
              <Badge tone="neutral">Next 14 days</Badge>
            </div>
          </CardHeader>
          <CardBody>
            {expiringList.length === 0 ? (
              <div className="rounded-2xl bg-black/30 p-8 border border-dashed border-white/10 text-center text-sm text-zinc-500">
                No memberships expiring in the next 14 days.
              </div>
            ) : (
              <div className="space-y-2">
                {expiringList.map(({ m, r }) => (
                  <button
                    key={m.id}
                    type="button"
                    className="w-full rounded-2xl bg-black/25 p-4 text-left ring-1 ring-white/10 hover:bg-white/5 transition group"
                    onClick={() => onOpenMember?.(m)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-zinc-100 group-hover:text-[#CCFF00] transition-colors">{m.name}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-wider">
                          <span className="font-bold text-zinc-400">{m.id}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span>{m.tier}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span>Ends {formatISO(m.endDate)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Days Left</div>
                        <div className={`mt-1 text-2xl font-black tracking-tighter ${r <= 3 ? 'text-red-500' : 'text-orange-500'}`}>
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
            <div className="text-sm font-black tracking-tight text-zinc-100 uppercase italic">Gym Overview</div>
            <div className="mt-1 text-xs text-zinc-500">Real-time daily activity.</div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              
              {/* Daily Walk-ins Tracker - Now using tbl_walkintransaction */}
              <div className="rounded-2xl bg-[#CCFF00] p-5 shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                <div className="flex justify-between items-start text-black">
                  <div>
                    <div className="text-[10px] font-black tracking-widest uppercase opacity-60">Today's Traffic</div>
                    <div className="mt-1 text-3xl font-black italic tracking-tighter uppercase leading-none">
                      {walkInCount} Walk-ins
                    </div>
                  </div>
                  <UserPlus className="h-6 w-6 opacity-40" />
                </div>
                <p className="mt-3 text-[10px] font-bold text-black/50 uppercase leading-tight italic">
                  Total walk-in sessions today
                </p>
              </div>

              <div className={`rounded-2xl p-4 ring-1 ${stats.expiringSoon > 0 ? 'bg-orange-500/5 ring-orange-500/20' : 'bg-zinc-900 ring-white/5'}`}>
                <div className={`text-[10px] font-bold tracking-widest uppercase ${stats.expiringSoon > 0 ? 'text-orange-500' : 'text-zinc-500'}`}>Attention Required</div>
                <div className="mt-1 text-sm font-bold text-white">{stats.expiringSoon} Renewals Due</div>
                <p className="mt-2 text-[11px] text-zinc-400 leading-relaxed">
                  {stats.expiringSoon > 0 
                    ? "Members are expiring within 7 days. High priority for staff outreach." 
                    : "No immediate renewals required for this week."}
                </p>
              </div>

              <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/5">
                <div className="flex justify-between items-center mb-1">
                   <div className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Retention Rate</div>
                   <TrendingUp className="h-3 w-3 text-[#CCFF00]" />
                </div>
                <div className="mt-1 text-xl font-black text-white italic">
                  {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0}%
                </div>
                <div className="mt-3 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#CCFF00] transition-all duration-1000" 
                    style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}