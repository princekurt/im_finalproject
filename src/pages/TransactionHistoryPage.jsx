import React, { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Loader2, RefreshCw, Search } from 'lucide-react'
import { Button } from '../components/Button.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { TextField } from '../components/Field.jsx'
import { supabase } from '../lib/supabase'
import { formatISO } from '../utils/dates.js'

function firstRow(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
}

function formatDateTime(ts) {
  if (!ts) return '-'
  const dt = new Date(ts)
  if (Number.isNaN(dt.getTime())) return '-'
  return dt.toLocaleString()
}

export function TransactionHistoryPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError(null)

      const [txnRes, membershipRes, walkinRes] = await Promise.all([
        supabase
          .from('tbl_transaction')
          .select(`
            transac_id,
            transac_date,
            total,
            amount_due,
            tbl_receptionist (receptionist_name),
            tbl_paymenttype (paymenttype_name),
            tbl_discounttype (discounttype_name)
          `)
          .order('transac_id', { ascending: false }),
        supabase
          .from('tbl_membershiptransaction')
          .select(`
            transac_id,
            membership_id,
            tbl_membership (
              membership_id,
              start_date,
              end_date,
              tbl_customer (customer_id, full_name),
              tbl_membershiptype (membershiptype_name)
            )
          `),
        supabase
          .from('tbl_walkintransaction')
          .select(`
            transac_id,
            customer_id,
            time_in,
            time_out,
            tbl_customer (customer_id, full_name),
            tbl_walkintype (walkintype_name)
          `),
      ])

      if (txnRes.error) throw txnRes.error
      if (membershipRes.error) throw membershipRes.error
      if (walkinRes.error) throw walkinRes.error

      const membershipByTransac = new Map((membershipRes.data || []).map((row) => [row.transac_id, row]))
      const walkinByTransac = new Map((walkinRes.data || []).map((row) => [row.transac_id, row]))

      const mapped = (txnRes.data || []).map((txn) => {
        const membershipLink = membershipByTransac.get(txn.transac_id)
        const walkinLink = walkinByTransac.get(txn.transac_id)

        const membership = firstRow(membershipLink?.tbl_membership)
        const membershipCustomer = firstRow(membership?.tbl_customer)
        const membershipType = firstRow(membership?.tbl_membershiptype)

        const walkinCustomer = firstRow(walkinLink?.tbl_customer)
        const walkinType = firstRow(walkinLink?.tbl_walkintype)

        let category = 'Unknown'
        let customerName = '-'
        let detail = 'No linked detail record found'

        if (membershipLink && walkinLink) {
          category = 'Mixed'
          customerName = membershipCustomer?.full_name || walkinCustomer?.full_name || '-'
          detail = 'Linked to both membership and walk-in records'
        } else if (membershipLink) {
          category = 'Membership'
          customerName = membershipCustomer?.full_name || '-'
          detail = `${membershipType?.membershiptype_name || 'Membership'} • ${formatISO(membership?.start_date)} to ${formatISO(membership?.end_date)}`
        } else if (walkinLink) {
          category = 'Walk-in'
          customerName = walkinCustomer?.full_name || '-'
          const inTime = formatDateTime(walkinLink.time_in)
          const outTime = formatDateTime(walkinLink.time_out)
          detail = `${walkinType?.walkintype_name || 'Walk-in'} • In: ${inTime}${walkinLink.time_out ? ` • Out: ${outTime}` : ''}`
        }

        return {
          transac_id: txn.transac_id,
          transac_date: txn.transac_date,
          total: txn.total,
          amount_due: txn.amount_due,
          receptionist_name: firstRow(txn.tbl_receptionist)?.receptionist_name || '-',
          paymenttype_name: firstRow(txn.tbl_paymenttype)?.paymenttype_name || '-',
          discounttype_name: firstRow(txn.tbl_discounttype)?.discounttype_name || 'None',
          category,
          customerName,
          detail,
        }
      })

      setRows(mapped)
    } catch (err) {
      setError(err.message || 'Failed to load transaction history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return rows.filter((row) => {
      if (typeFilter !== 'all' && row.category.toLowerCase() !== typeFilter) return false
      if (!q) return true

      return (
        String(row.transac_id).includes(q) ||
        String(row.customerName).toLowerCase().includes(q) ||
        String(row.category).toLowerCase().includes(q) ||
        String(row.paymenttype_name).toLowerCase().includes(q) ||
        String(row.receptionist_name).toLowerCase().includes(q)
      )
    })
  }, [rows, query, typeFilter])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-black tracking-tight text-zinc-100 uppercase italic">Unified Transaction Ledger</div>
              <div className="mt-1 text-xs text-zinc-500">Unified transaction timeline with linked activity records.</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl bg-black/30 ring-1 ring-white/10 p-1">
                {['all', 'membership', 'walk-in'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTypeFilter(key)}
                    className={[
                      'px-3 py-1.5 text-xs font-semibold rounded-lg transition',
                      typeFilter === key
                        ? 'bg-[#CCFF00] text-black shadow-[0_6px_18px_rgba(255,212,0,0.25)]'
                        : 'text-zinc-300 hover:bg-white/5',
                    ].join(' ')}
                  >
                    {key === 'all' ? 'All' : key === 'membership' ? 'Membership' : 'Walk-in'}
                  </button>
                ))}
              </div>
              <div className="w-full md:w-[280px]">
                <TextField
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search txn, customer, staff..."
                  leading={<Search className="h-4 w-4" />}
                />
              </div>
              <Button variant="ghost" onClick={fetchHistory} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="py-14 text-center text-[#CCFF00] font-black tracking-wide uppercase">
              Loading transaction history...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-6 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
              <div className="mt-2 text-sm font-bold text-zinc-100">Could not load history</div>
              <div className="mt-1 text-xs text-zinc-500">{error}</div>
              <Button className="mt-4" onClick={fetchHistory}>Retry</Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-[#161616] ring-1 ring-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-black/35 text-[10px] uppercase tracking-widest text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Txn</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Details</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3 text-right">Amount Due</th>
                      <th className="px-4 py-3">Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                          No transactions found for this filter.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((row) => (
                        <tr key={row.transac_id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-zinc-200">T-{row.transac_id}</td>
                          <td className="px-4 py-3 text-zinc-400">{formatDateTime(row.transac_date)}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-[#CCFF00]/12 px-2.5 py-1 text-[11px] font-semibold text-[#CCFF00] ring-1 ring-[#CCFF00]/25">
                              {row.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-zinc-200">{row.customerName}</td>
                          <td className="px-4 py-3 text-xs text-zinc-400">{row.detail}</td>
                          <td className="px-4 py-3 text-xs text-zinc-300">
                            {row.paymenttype_name}
                            <div className="text-[10px] text-zinc-500">Discount: {row.discounttype_name}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-black text-zinc-100">
                            PHP {Number(row.amount_due || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-xs text-zinc-300">{row.receptionist_name}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
