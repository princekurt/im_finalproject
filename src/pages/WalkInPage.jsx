import React, { useState, useEffect } from 'react'
import { Zap, UserSearch, Receipt, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react'
import { Button } from '../components/Button.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { FieldLabel, SelectField, TextField } from '../components/Field.jsx'
import { supabase } from '../lib/supabase'
import { isActiveMember } from '../utils/dates.js'

export function WalkInPage() {
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([]) 
  const [walkinTypes, setWalkinTypes] = useState([]) 
  const [paymentTypes, setPaymentTypes] = useState([]) 
  const [activeMembership, setActiveMembership] = useState(null)
  const [checkingMembership, setCheckingMembership] = useState(false)
  
  // Get current logged-in staff info
  const staffName = localStorage.getItem('staff_name') || 'Staff'
  const currentStaffId = localStorage.getItem('staff_id')

  const [form, setForm] = useState({
    paymenttype_id: '', 
    discounttype_id: '7', // Updated to your 'None' discount ID
    customer_id: '', 
    walkintype_id: '', 
    time_in: new Date().toISOString().slice(0, 16),
    time_out: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const { data: typeData } = await supabase.from('tbl_walkintype').select('*')
      const { data: custData } = await supabase.from('tbl_customer').select('customer_id, full_name')
      const { data: payData } = await supabase.from('tbl_paymenttype').select('*')
      
      if (typeData && typeData.length > 0) {
        setWalkinTypes(typeData)
        setForm(prev => ({ ...prev, walkintype_id: typeData[0].walkintype_id.toString() }))
      }

      if (payData && payData.length > 0) {
        setPaymentTypes(payData)
        setForm(prev => ({ ...prev, paymenttype_id: payData[0].paymenttype_id.toString() }))
      }

      if (custData) setCustomers(custData)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const checkMembership = async () => {
      if (!form.customer_id) {
        setActiveMembership(null)
        return
      }

      setCheckingMembership(true)
      try {
        const { data, error } = await supabase
          .from('tbl_membership')
          .select(`
            membership_id,
            start_date,
            end_date,
            tbl_membershiptype (membershiptype_name)
          `)
          .eq('customer_id', parseInt(form.customer_id))
          .order('end_date', { ascending: false })

        if (error) throw error

        const active = (data || []).find((m) => isActiveMember({ start_date: m.start_date, end_date: m.end_date }))

        if (active) {
          setActiveMembership({
            membership_id: active.membership_id,
            start_date: active.start_date,
            end_date: active.end_date,
            membershiptype_name: Array.isArray(active.tbl_membershiptype)
              ? active.tbl_membershiptype[0]?.membershiptype_name
              : active.tbl_membershiptype?.membershiptype_name,
          })
        } else {
          setActiveMembership(null)
        }
      } catch (err) {
        console.error('Membership status check failed:', err)
        setActiveMembership(null)
      } finally {
        setCheckingMembership(false)
      }
    }

    checkMembership()
  }, [form.customer_id])

  const selectedType = walkinTypes.find(t => t.walkintype_id.toString() === form.walkintype_id.toString())
  const totalAmount = selectedType ? selectedType.walkin_fee : 0

  const handleProcessTransaction = async (e) => {
    e.preventDefault()
    if (!form.customer_id) return alert("Please select a customer!")
    if (!currentStaffId) return alert("No active staff session. Please re-login.")
    if (activeMembership) {
      return alert('Walk-in is disabled for this customer because an active membership already exists.')
    }
    
    setLoading(true)

    try {
      // Step A: Create Parent Transaction with your specific column names
      const { data: trans, error: transError } = await supabase
        .from('tbl_transaction')
        .insert([{
          receptionist_id: parseInt(currentStaffId),
          paymenttype_id: parseInt(form.paymenttype_id),
          discounttype_id: parseInt(form.discounttype_id),
          total: totalAmount,        // Changed from total_amount
          amount_due: totalAmount    // Added missing column
        }])
        .select()
        .single()

      if (transError) throw transError

      // Step B: Create Walk-In Record with your specific column names
      const { error: walkinError } = await supabase
        .from('tbl_walkintransaction')
        .insert([{
          transac_id: trans.transac_id, // Changed from transaction_id to match your PK
          customer_id: parseInt(form.customer_id),
          walkintype_id: parseInt(form.walkintype_id),
          time_in: form.time_in,
          time_out: form.time_out || null
        }])

      if (walkinError) throw walkinError

      alert(`Success! Entry recorded by ${staffName}.`)
      
      setForm(prev => ({ 
        ...prev, 
        customer_id: '', 
        time_out: '',
        time_in: new Date().toISOString().slice(0, 16) 
      }))

    } catch (err) {
      console.error(err)
      alert("Transaction Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2 border-t-2 border-[#CCFF00]">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-black tracking-tight text-zinc-100 uppercase italic">Walk-In</div>
              <div className="mt-1 text-[10px] text-zinc-500 font-bold flex items-center gap-1 uppercase">
                <ShieldCheck className="h-3 w-3 text-[#CCFF00]" />
                Operator: {staffName}
              </div>
            </div>
            <div className="rounded-2xl bg-[#CCFF00]/10 p-3 ring-1 ring-[#CCFF00]/20 text-[#CCFF00]">
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form className="space-y-6" onSubmit={handleProcessTransaction}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              
              <div className="md:col-span-2 space-y-2">
                <FieldLabel>SELECT CUSTOMER</FieldLabel>
                <div className="relative">
                  <select 
                    required
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#CCFF00] outline-none appearance-none"
                    value={form.customer_id} 
                    onChange={(e) => setForm({...form, customer_id: e.target.value})}
                  >
                    <option value="">-- Search Registered Customers --</option>
                    {customers.map(c => (
                      <option key={c.customer_id} value={c.customer_id}>
                        {c.full_name} (ID: {c.customer_id})
                      </option>
                    ))}
                  </select>
                  <UserSearch className="absolute right-4 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
                {checkingMembership ? (
                  <div className="text-[11px] text-zinc-500">Checking membership status...</div>
                ) : activeMembership ? (
                  <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    <div className="flex items-center gap-2 font-semibold uppercase tracking-wide">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Walk-in disabled for active members
                    </div>
                    <div className="mt-1 text-[11px]">
                      Active plan: {activeMembership.membershiptype_name || 'Membership'} ({activeMembership.start_date} to {activeMembership.end_date})
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <FieldLabel>WALK-IN TYPE</FieldLabel>
                <SelectField 
                  value={form.walkintype_id} 
                  onChange={(e) => setForm({...form, walkintype_id: e.target.value})}
                >
                  {walkinTypes.map(type => (
                    <option key={type.walkintype_id} value={type.walkintype_id}>
                      {type.walkintype_name}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className="space-y-2">
                <FieldLabel>PAYMENT METHOD</FieldLabel>
                <SelectField 
                  value={form.paymenttype_id} 
                  onChange={(e) => setForm({...form, paymenttype_id: e.target.value})}
                >
                  {paymentTypes.map(pay => (
                    <option key={pay.paymenttype_id} value={pay.paymenttype_id}>
                      {pay.paymenttype_name}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className="space-y-2">
                <FieldLabel>TIME IN</FieldLabel>
                <TextField 
                  type="datetime-local" 
                  value={form.time_in} 
                  onChange={(e) => setForm({...form, time_in: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>TIME OUT (OPTIONAL)</FieldLabel>
                <TextField 
                  type="datetime-local" 
                  value={form.time_out} 
                  onChange={(e) => setForm({...form, time_out: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <Button type="submit" variant="primary" className="w-full md:w-auto" disabled={loading || Boolean(activeMembership)}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Receipt className="h-4 w-4 mr-2" />}
                Confirm Walk-In
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="space-y-4">
        <Card className="bg-black/40">
          <CardHeader>
            <div className="text-sm font-black tracking-tight text-zinc-100 uppercase">Billing Summary</div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4 text-center">
              <div className="py-6 rounded-2xl bg-[#111] ring-1 ring-white/5 border-b-2 border-[#CCFF00]">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount Due</div>
                <div className="text-4xl font-black text-[#CCFF00]">₱{totalAmount.toLocaleString()}</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
