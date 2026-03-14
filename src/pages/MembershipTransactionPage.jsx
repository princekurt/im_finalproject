import React, { useMemo, useState, useEffect } from 'react'
import { CreditCard, UserSearch, ShieldCheck, TicketPercent, Loader2 } from 'lucide-react'
import { Button } from '../components/Button.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { FieldLabel, SelectField, TextField } from '../components/Field.jsx'
import { supabase } from '../lib/supabase'

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

function roundToPeso(value) {
  return Math.round(Number(value))
}

export function MembershipTransactionPage() {
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  
  const [customers, setCustomers] = useState([])
  const [membershipTypes, setMembershipTypes] = useState([])
  const [paymentTypes, setPaymentTypes] = useState([])
  const [discountTypes, setDiscountTypes] = useState([])

  const currentStaffId = localStorage.getItem('staff_id')

  const [form, setForm] = useState({
    customer_id: '',
    membershiptype_id: '1',
    paymenttype_id: '1',
    discounttype_id: '7', 
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  })

  // --- AUTO-CALCULATE END DATE (30 DAYS) ---
  useEffect(() => {
    if (form.start_date) {
      const date = new Date(form.start_date);
      date.setDate(date.getDate() + 30); // Add 30 days
      const formattedDate = date.toISOString().split('T')[0];
      
      setForm(prev => ({ ...prev, end_date: formattedDate }));
    }
  }, [form.start_date, form.membershiptype_id]); // Runs when start date or plan changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: memData } = await supabase.from('tbl_membershiptype').select('*')
        const { data: custData } = await supabase.from('tbl_customer').select('*')
        const { data: payData } = await supabase.from('tbl_paymenttype').select('*')
        const { data: discData } = await supabase.from('tbl_discounttype').select('*')

        if (memData) setMembershipTypes(memData)
        if (custData) setCustomers(custData)
        if (payData) setPaymentTypes(payData)
        if (discData) setDiscountTypes(discData)

        if (memData?.length > 0) setForm(f => ({ ...f, membershiptype_id: memData[0].membershiptype_id.toString() }))
        if (payData?.length > 0) setForm(f => ({ ...f, paymenttype_id: payData[0].paymenttype_id.toString() }))
      } catch (err) {
        console.error("Fetch Error:", err)
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [])

  const selectedType = membershipTypes.find(m => m.membershiptype_id?.toString() === form.membershiptype_id)
  const selectedTypeName = (selectedType?.membershiptype_name || '').toLowerCase()
  const isMuayPlusStandardType = selectedTypeName.includes('muay') && selectedTypeName.includes('standard')
  const isStandardOnlyType = selectedTypeName.includes('standard') && !selectedTypeName.includes('muay')

  const filteredDiscountTypes = useMemo(() => {
    const isMuayTag = (name = '') => name.toLowerCase().includes('muay')
    const isNoneTag = (name = '') => name.toLowerCase().includes('none')

    if (isMuayPlusStandardType) {
      const muayOnly = discountTypes.filter((d) => isMuayTag(d.discounttype_name) || isNoneTag(d.discounttype_name))
      return muayOnly.length > 0 ? muayOnly : discountTypes
    }

    if (isStandardOnlyType) {
      const nonMuayOnly = discountTypes.filter((d) => !isMuayTag(d.discounttype_name))
      return nonMuayOnly.length > 0 ? nonMuayOnly : discountTypes
    }

    return discountTypes
  }, [discountTypes, isMuayPlusStandardType, isStandardOnlyType])

  useEffect(() => {
    if (!filteredDiscountTypes.length) return
    const stillValid = filteredDiscountTypes.some((d) => d.discounttype_id?.toString() === form.discounttype_id?.toString())
    if (stillValid) return

    const noneOption = filteredDiscountTypes.find((d) => (d.discounttype_name || '').toLowerCase().includes('none'))
    const fallback = noneOption || filteredDiscountTypes[0]
    setForm((prev) => ({ ...prev, discounttype_id: fallback.discounttype_id.toString() }))
  }, [filteredDiscountTypes, form.discounttype_id])

  const selectedDiscount = filteredDiscountTypes.find(d => d.discounttype_id?.toString() === form.discounttype_id)
  
  const baseFee = roundMoney(selectedType ? parseFloat(selectedType.membership_fee) : 0)
  const discountPercentage = selectedDiscount ? parseFloat(selectedDiscount.discounttype_fee) : 0
  
  const rawAmountDue = baseFee - (baseFee * discountPercentage) / 100
  const amountDue = roundMoney(Math.max(0, roundToPeso(rawAmountDue)))
  const discountInPesos = roundMoney(baseFee - amountDue)

  const handleFinalize = async (e) => {
    e.preventDefault()
    if (!form.customer_id || !form.end_date) return alert("Please select a customer and end date.")
    setLoading(true)

    try {
      const { data: existingMemberships, error: membershipCheckError } = await supabase
        .from('tbl_membership')
        .select('membership_id, start_date, end_date')
        .eq('customer_id', parseInt(form.customer_id))

      if (membershipCheckError) throw membershipCheckError

      const requestedStart = new Date(`${form.start_date}T00:00:00`)
      const requestedEnd = new Date(`${form.end_date}T23:59:59`)
      const overlaps = (existingMemberships || []).some((m) => {
        const start = new Date(`${m.start_date}T00:00:00`)
        const end = new Date(`${m.end_date}T23:59:59`)
        return requestedStart <= end && requestedEnd >= start
      })

      if (overlaps) {
        throw new Error('This customer already has a membership period overlapping the selected dates.')
      }

      const { data: txn, error: txnErr } = await supabase.from('tbl_transaction').insert([{
        receptionist_id: parseInt(currentStaffId),
        paymenttype_id: parseInt(form.paymenttype_id),
        discounttype_id: parseInt(form.discounttype_id),
        total: baseFee,
        amount_due: amountDue
      }]).select().single()
      if (txnErr) throw txnErr

      const { data: member, error: memErr } = await supabase.from('tbl_membership').insert([{
        customer_id: parseInt(form.customer_id),
        membershiptype_id: parseInt(form.membershiptype_id),
        start_date: form.start_date,
        end_date: form.end_date
      }]).select().single()
      if (memErr) throw memErr

      const { error: bridgeErr } = await supabase.from('tbl_membershiptransaction').insert([{
        transac_id: txn.transac_id,
        membership_id: member.membership_id
      }])
      if (bridgeErr) throw bridgeErr

      alert("Membership Transaction Successful!")
      setForm(prev => ({ ...prev, customer_id: '', end_date: '' }))
    } catch (err) {
      alert("Transaction Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="p-10 text-[#CCFF00] font-black italic">LOADING GYM DATA...</div>

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-black tracking-tight text-zinc-100 uppercase italic">Membership Transaction</div>
              <div className="mt-1 text-xs text-zinc-500">Creates a membership record and linked transaction entry.</div>
            </div>
            <div className="rounded-2xl bg-[#CCFF00]/10 p-3 ring-1 ring-[#CCFF00]/20 text-[#CCFF00]">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form className="space-y-6" onSubmit={handleFinalize}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              
              <div className="md:col-span-2 space-y-2">
                <FieldLabel>SELECT CUSTOMER</FieldLabel>
                <div className="relative">
                  <SelectField 
                    value={form.customer_id} 
                    onChange={(e) => setForm({...form, customer_id: e.target.value})}
                    required
                  >
                    <option value="">Choose a customer...</option>
                    {customers.map(c => (
                      <option key={c.customer_id} value={c.customer_id}>{c.full_name}</option>
                    ))}
                  </SelectField>
                  <UserSearch className="absolute right-8 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel>MEMBERSHIP TYPE</FieldLabel>
                <SelectField 
                  value={form.membershiptype_id} 
                  onChange={(e) => setForm({...form, membershiptype_id: e.target.value})}
                >
                  {membershipTypes.map(m => (
                    <option key={m.membershiptype_id} value={m.membershiptype_id}>
                      {m.membershiptype_name}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className="space-y-2">
                <FieldLabel>PAYMENT TYPE</FieldLabel>
                <SelectField 
                  value={form.paymenttype_id} 
                  onChange={(e) => setForm({...form, paymenttype_id: e.target.value})}
                >
                  {paymentTypes.map(p => (
                    <option key={p.paymenttype_id} value={p.paymenttype_id}>{p.paymenttype_name}</option>
                  ))}
                </SelectField>
              </div>

              <div className="space-y-2">
                <FieldLabel>START DATE</FieldLabel>
                <TextField 
                  type="date" 
                  value={form.start_date} 
                  onChange={(e) => setForm({...form, start_date: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>END DATE (EXPIRATION)</FieldLabel>
                <TextField 
                  type="date" 
                  value={form.end_date} 
                  onChange={(e) => setForm({...form, end_date: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <FieldLabel>DISCOUNT APPLIED</FieldLabel>
                <SelectField 
                  value={form.discounttype_id} 
                  onChange={(e) => setForm({...form, discounttype_id: e.target.value})}
                  disabled={filteredDiscountTypes.length === 0}
                >
                  {filteredDiscountTypes.map(d => (
                    <option key={d.discounttype_id} value={d.discounttype_id}>
                      {d.discounttype_name} ({d.discounttype_fee}%)
                    </option>
                  ))}
                </SelectField>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <Button type="submit" variant="primary" className="w-full md:w-auto" disabled={loading}>
                {loading ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                Finalize Transaction
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="text-sm font-black tracking-tight text-zinc-100 uppercase">Billing Summary</div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="text-center py-6 rounded-2xl bg-black/40 ring-1 ring-white/5 border-b-2 border-[#CCFF00]">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-zinc-400">Amount Due</div>
                <div className="text-4xl font-black text-white italic">₱{amountDue.toFixed(2)}</div>
              </div>
              
              <div className="space-y-3 px-1 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Base Plan:</span>
                  <span className="text-zinc-100 font-bold">₱{baseFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span className="flex items-center gap-1">
                    <TicketPercent className="h-3 w-3" /> 
                    Discount ({discountPercentage}%):
                  </span>
                  <span>- ₱{discountInPesos.toFixed(2)}</span>
                </div>
                <div className="h-px bg-white/5 my-2" />
                <div className="flex justify-between text-[#CCFF00] font-black uppercase tracking-tighter">
                  <span>Grand Total:</span>
                  <span className="text-sm">₱{amountDue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
