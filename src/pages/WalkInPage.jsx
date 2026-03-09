import React, { useState, useEffect } from 'react'
import { Zap, Clock, UserSearch, Receipt, Loader2 } from 'lucide-react'
import { Button } from '../components/Button.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { FieldLabel, SelectField, TextField } from '../components/Field.jsx'
import { supabase } from '../lib/supabase'

export function WalkInPage() {
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([]) 
  const [walkinTypes, setWalkinTypes] = useState([]) 
  const [paymentTypes, setPaymentTypes] = useState([]) // State for dynamic payment types
  
  const [form, setForm] = useState({
    receptionist_id: '1',
    paymenttype_id: '', 
    discounttype_id: '1',
    customer_id: '', 
    walkintype_id: '', 
    time_in: new Date().toISOString().slice(0, 16),
    time_out: '',
  })

  // 1. Fetch existing Data from your DB
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
        // Set default payment type to the first one (usually Cash)
        setForm(prev => ({ ...prev, paymenttype_id: payData[0].paymenttype_id.toString() }))
      }

      if (custData) setCustomers(custData)
    }
    fetchData()
  }, [])

  // 2. Dynamic Price Calculation from your DB values
  const selectedType = walkinTypes.find(t => t.walkintype_id.toString() === form.walkintype_id.toString())
  const totalAmount = selectedType ? selectedType.walkin_fee : 0

  const handleProcessTransaction = async (e) => {
    e.preventDefault()
    if (!form.customer_id) return alert("Please select a customer!")
    setLoading(true)

    try {
      // Step A: Create the Parent Transaction
      const { data: trans, error: transError } = await supabase
        .from('tbl_transaction')
        .insert([{
          receptionist_id: parseInt(form.receptionist_id),
          paymenttype_id: parseInt(form.paymenttype_id),
          discounttype_id: parseInt(form.discounttype_id),
          total_amount: totalAmount
        }])
        .select()
        .single()

      if (transError) throw transError

      // Step B: Create the Walk-In Record linked to that Transaction
      const { error: walkinError } = await supabase
        .from('tbl_walkintransaction')
        .insert([{
          transaction_id: trans.transaction_id,
          customer_id: parseInt(form.customer_id),
          walkintype_id: parseInt(form.walkintype_id),
          time_in: form.time_in,
          time_out: form.time_out || null
        }])

      if (walkinError) throw walkinError

      alert(`Success! Transaction # ${trans.transaction_id} recorded.`)
      
      // Reset only customer and timeout
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
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-black tracking-tight text-zinc-100 uppercase italic">Walk-In Entry</div>
              <div className="mt-1 text-xs text-zinc-500">Linking <strong>tbl_transaction</strong> and <strong>tbl_walkintransaction</strong>.</div>
            </div>
            <div className="rounded-2xl bg-[#CCFF00]/10 p-3 ring-1 ring-[#CCFF00]/20 text-[#CCFF00]">
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form className="space-y-6" onSubmit={handleProcessTransaction}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              
              {/* SEARCHABLE CUSTOMER SELECT */}
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
              </div>

              {/* DYNAMIC TYPES FROM YOUR DB */}
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

              {/* DYNAMIC PAYMENT TYPES FROM YOUR DB */}
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
              <Button type="submit" variant="primary" className="w-full md:w-auto" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Receipt className="h-4 w-4 mr-2" />}
                Process Walk-In Transaction
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* BILLING PREVIEW */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="text-sm font-black tracking-tight text-zinc-100 uppercase">Transaction Summary</div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4 text-center">
              <div className="py-6 rounded-2xl bg-black/40 ring-1 ring-white/5 border-b-2 border-[#CCFF00]">
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