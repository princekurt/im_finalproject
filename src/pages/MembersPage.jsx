import React, { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Loader2, RefreshCw, Search, Users } from 'lucide-react'
import { Badge } from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import { Modal } from '../components/Modal.jsx'
import { TextField } from '../components/Field.jsx'
import { supabase } from '../lib/supabase'
import { formatISO, isActiveMember, parseISODate, startOfDay } from '../utils/dates.js'

function firstRow(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
}

function hasActiveMembershipRecord(record, now = new Date()) {
  return isActiveMember({ start_date: record.start_date, end_date: record.end_date }, now)
}

function membershipStatus(record, now = new Date()) {
  if (hasActiveMembershipRecord(record, now)) return 'Active'
  const start = parseISODate(record.start_date)
  if (start && startOfDay(now).getTime() < startOfDay(start).getTime()) return 'Upcoming'
  return 'Ended'
}

function formatDateTime(value) {
  if (!value) return '-'
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return '-'
  return dt.toLocaleString()
}

function CustomerProfileModal({ customer, open, onClose }) {
  const memberships = customer?.memberships || []
  const walkins = customer?.walkins || []
  const activeMembership = memberships.find((m) => hasActiveMembershipRecord(m))

  return (
    <Modal
      open={open}
      title={customer ? `${customer.full_name} • C-${customer.customer_id}` : 'Customer Profile'}
      subtitle="Customer activity timeline (membership + walk-in)"
      onClose={onClose}
    >
      {!customer ? null : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-[#161616] p-4 ring-1 ring-white/10">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">Membership Records</div>
              <div className="mt-2 text-2xl font-black text-zinc-100">{memberships.length}</div>
            </div>
            <div className="rounded-2xl bg-[#161616] p-4 ring-1 ring-white/10">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">Walk-in Records</div>
              <div className="mt-2 text-2xl font-black text-zinc-100">{walkins.length}</div>
            </div>
            <div className="rounded-2xl bg-[#161616] p-4 ring-1 ring-white/10">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">Current Access</div>
              <div className="mt-2">
                {activeMembership ? <Badge tone="active">Active Member</Badge> : <Badge tone="neutral">No Active Membership</Badge>}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#161616] p-4 ring-1 ring-white/10">
            <div className="text-sm font-black uppercase tracking-tight text-zinc-100">Membership Timeline</div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[10px] uppercase tracking-widest text-zinc-500">
                  <tr>
                    <th className="px-3 py-2">Membership ID</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Start</th>
                    <th className="px-3 py-2">End</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {memberships.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-xs text-zinc-500">No membership records.</td>
                    </tr>
                  ) : (
                    memberships.map((m) => (
                      <tr key={m.membership_id}>
                        <td className="px-3 py-3 font-mono text-xs text-zinc-300">M-{m.membership_id}</td>
                        <td className="px-3 py-3 text-xs text-zinc-300">{m.membershiptype_name || '-'}</td>
                        <td className="px-3 py-3 text-xs text-zinc-400">{formatISO(m.start_date)}</td>
                        <td className="px-3 py-3 text-xs text-zinc-400">{formatISO(m.end_date)}</td>
                        <td className="px-3 py-3">
                          {membershipStatus(m) === 'Active' ? (
                            <Badge tone="active">Active</Badge>
                          ) : membershipStatus(m) === 'Upcoming' ? (
                            <Badge tone="neutral">Upcoming</Badge>
                          ) : (
                            <Badge tone="expired">Ended</Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-[#161616] p-4 ring-1 ring-white/10">
            <div className="text-sm font-black uppercase tracking-tight text-zinc-100">Walk-in Timeline</div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[10px] uppercase tracking-widest text-zinc-500">
                  <tr>
                    <th className="px-3 py-2">Transaction</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Time In</th>
                    <th className="px-3 py-2">Time Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {walkins.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-xs text-zinc-500">No walk-in records.</td>
                    </tr>
                  ) : (
                    walkins.map((w) => (
                      <tr key={w.transac_id}>
                        <td className="px-3 py-3 font-mono text-xs text-zinc-300">T-{w.transac_id}</td>
                        <td className="px-3 py-3 text-xs text-zinc-300">{w.walkintype_name || '-'}</td>
                        <td className="px-3 py-3 text-xs text-zinc-400">{formatDateTime(w.time_in)}</td>
                        <td className="px-3 py-3 text-xs text-zinc-400">{formatDateTime(w.time_out)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export function MembersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      const [customerRes, membershipRes, walkinRes] = await Promise.all([
        supabase
          .from('tbl_customer')
          .select(`
            customer_id,
            full_name,
            contact_number,
            address,
            dob,
            tbl_gender (gender_name),
            tbl_relationshipstatus (relation_status_name)
          `)
          .order('customer_id', { ascending: false }),
        supabase
          .from('tbl_membership')
          .select(`
            membership_id,
            customer_id,
            start_date,
            end_date,
            tbl_membershiptype (membershiptype_name)
          `)
          .order('membership_id', { ascending: false }),
        supabase
          .from('tbl_walkintransaction')
          .select(`
            transac_id,
            customer_id,
            time_in,
            time_out,
            tbl_walkintype (walkintype_name)
          `)
          .order('transac_id', { ascending: false }),
      ])

      if (customerRes.error) throw customerRes.error
      if (membershipRes.error) throw membershipRes.error
      if (walkinRes.error) throw walkinRes.error

      const membershipsByCustomer = new Map()
      for (const row of membershipRes.data || []) {
        const mapped = {
          membership_id: row.membership_id,
          customer_id: row.customer_id,
          start_date: row.start_date,
          end_date: row.end_date,
          membershiptype_name: firstRow(row.tbl_membershiptype)?.membershiptype_name || '-',
        }
        const bucket = membershipsByCustomer.get(mapped.customer_id) || []
        bucket.push(mapped)
        membershipsByCustomer.set(mapped.customer_id, bucket)
      }

      const walkinsByCustomer = new Map()
      for (const row of walkinRes.data || []) {
        const mapped = {
          transac_id: row.transac_id,
          customer_id: row.customer_id,
          time_in: row.time_in,
          time_out: row.time_out,
          walkintype_name: firstRow(row.tbl_walkintype)?.walkintype_name || '-',
        }
        const bucket = walkinsByCustomer.get(mapped.customer_id) || []
        bucket.push(mapped)
        walkinsByCustomer.set(mapped.customer_id, bucket)
      }

      const merged = (customerRes.data || []).map((c) => {
        const memberships = membershipsByCustomer.get(c.customer_id) || []
        const walkins = walkinsByCustomer.get(c.customer_id) || []
        const activeMembership = memberships.find((m) => hasActiveMembershipRecord(m))
        const latestMembership = memberships[0] || null
        const latestWalkin = walkins[0] || null

        return {
          customer_id: c.customer_id,
          full_name: c.full_name || 'Unknown Customer',
          contact_number: c.contact_number || '-',
          address: c.address || '-',
          dob: c.dob,
          gender_name: firstRow(c.tbl_gender)?.gender_name || '-',
          relation_status_name: firstRow(c.tbl_relationshipstatus)?.relation_status_name || '-',
          memberships,
          walkins,
          hasMembership: memberships.length > 0,
          hasWalkin: walkins.length > 0,
          activeMembership,
          latestMembership,
          latestWalkin,
        }
      })

      setCustomers(merged)
    } catch (err) {
      setError(err.message || 'Failed to load customers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase()
    return customers.filter((c) => {
      if (filter === 'members' && !c.hasMembership) return false
      if (filter === 'walkins' && !c.hasWalkin) return false
      if (!q) return true

      return (
        String(c.customer_id).includes(q) ||
        String(c.full_name).toLowerCase().includes(q) ||
        String(c.contact_number).toLowerCase().includes(q)
      )
    })
  }, [customers, filter, query])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#CCFF00]/10 p-2 ring-1 ring-[#CCFF00]/20">
            <Users className="h-5 w-5 text-[#CCFF00]" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight uppercase italic text-zinc-100">Customer List</div>
            <div className="text-xs text-zinc-500">One customer record, with both membership and walk-in history.</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-black/30 p-1 ring-1 ring-white/10">
            {[
              { key: 'all', label: 'All' },
              { key: 'members', label: 'Members Only' },
              { key: 'walkins', label: 'Walk-ins Only' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={[
                  'rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition',
                  filter === item.key
                    ? 'bg-[#CCFF00] text-black shadow-[0_6px_18px_rgba(255,212,0,0.25)]'
                    : 'text-zinc-300 hover:bg-white/5',
                ].join(' ')}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="w-full md:w-[280px]">
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer..."
              leading={<Search className="h-4 w-4" />}
            />
          </div>
          <Button variant="ghost" onClick={fetchCustomers} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#CCFF00]" />
          <div className="mt-3 text-xs font-black uppercase tracking-widest text-zinc-500">Syncing customer records...</div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <div className="mt-3 text-sm font-bold uppercase text-zinc-100">Connection Issue</div>
          <div className="mt-1 text-xs text-zinc-500">{error}</div>
          <Button className="mt-5" onClick={fetchCustomers}>Try Again</Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-[#161616] ring-1 ring-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-black/35 text-[10px] uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Membership</th>
                  <th className="px-4 py-3">Walk-ins</th>
                  <th className="px-4 py-3">Current Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                      No customers found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr
                      key={c.customer_id}
                      className="cursor-pointer transition-colors hover:bg-white/[0.02] active:bg-white/[0.05]"
                      onClick={() => setSelectedCustomer(c)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-zinc-100">{c.full_name}</div>
                        <div className="mt-1 text-[10px] font-mono uppercase text-zinc-500">C-{c.customer_id}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-300">{c.contact_number || '-'}</td>
                      <td className="px-4 py-3 text-xs text-zinc-300">
                        {c.memberships.length} record(s)
                        <div className="mt-1 text-[10px] text-zinc-500">
                          {c.latestMembership ? c.latestMembership.membershiptype_name : 'No membership'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-300">
                        {c.walkins.length} record(s)
                        <div className="mt-1 text-[10px] text-zinc-500">
                          {c.latestWalkin ? formatDateTime(c.latestWalkin.time_in) : 'No walk-in'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {c.activeMembership ? (
                          <Badge tone="active">Active Member</Badge>
                        ) : c.hasMembership ? (
                          <Badge tone="expired">Inactive Member</Badge>
                        ) : c.hasWalkin ? (
                          <Badge tone="neutral">Walk-in Only</Badge>
                        ) : (
                          <Badge tone="neutral">No Activity</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CustomerProfileModal
        open={Boolean(selectedCustomer)}
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  )
}
