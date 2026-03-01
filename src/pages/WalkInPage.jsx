import React, { useState } from 'react'
import { Zap, Clock, UserSearch, Receipt } from 'lucide-react'
import { Button } from '../components/Button.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { FieldLabel, SelectField, TextField } from '../components/Field.jsx'

export function WalkInPage() {
  const [form, setForm] = useState({
    // tbl_transaction fields
    receptionist_id: '1',
    paymenttype_id: '1',
    discounttype_id: '1',
    // tbl_walkintransaction fields
    customer_id: '', // To be picked via search/select
    walkintype_id: '1',
    time_in: '',
    time_out: '',
  })

  // Mock calculation based on tbl_walkintype
  const walkinFee = form.walkintype_id === '2' ? 500 : 250; // e.g., Gym vs Muay Thai Daily
  const totalAmount = walkinFee;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-black tracking-tight text-zinc-100 uppercase italic">Walk-In Entry</div>
              <div className="mt-1 text-xs text-zinc-500">Record a single-session visit in <strong>tbl_walkintransaction</strong>.</div>
            </div>
            <div className="rounded-2xl bg-[#CCFF00]/10 p-3 ring-1 ring-[#CCFF00]/20 text-[#CCFF00]">
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              
              {/* CUSTOMER SELECTION */}
              <div className="md:col-span-2 space-y-2">
                <FieldLabel>SELECT CUSTOMER</FieldLabel>
                <div className="relative">
                  <SelectField 
                    value={form.customer_id} 
                    onChange={(e) => setForm({...form, customer_id: e.target.value})}
                  >
                    <option value="">Search Registered Customer...</option>
                    <option value="101">Juan Dela Cruz (C-101)</option>
                    <option value="102">Maria Santos (C-102)</option>
                  </SelectField>
                  <UserSearch className="absolute right-8 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* WALK-IN DETAILS */}
              <div className="space-y-2">
                <FieldLabel>WALK-IN TYPE</FieldLabel>
                <SelectField 
                  value={form.walkintype_id} 
                  onChange={(e) => setForm({...form, walkintype_id: e.target.value})}
                >
                  <option value="1">Gym Daily Pass</option>
                  <option value="2">Muay Thai Session</option>
                </SelectField>
              </div>

              <div className="space-y-2">
                <FieldLabel>PAYMENT METHOD</FieldLabel>
                <SelectField 
                  value={form.paymenttype_id} 
                  onChange={(e) => setForm({...form, paymenttype_id: e.target.value})}
                >
                  <option value="1">Cash</option>
                  <option value="2">E-Wallet (GCash)</option>
                </SelectField>
              </div>

              {/* TIMESTAMPS */}
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
              <Button type="submit" variant="primary" className="w-full md:w-auto">
                <Receipt className="h-4 w-4 mr-2" />
                Process Walk-In Transaction
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* RIGHT SIDE: BILLING PREVIEW */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="text-sm font-black tracking-tight text-zinc-100 uppercase">Transaction Summary</div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="text-center py-4 rounded-2xl bg-black/40 ring-1 ring-white/5">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount Due</div>
                <div className="text-3xl font-black text-[#CCFF00]">₱{totalAmount.toLocaleString()}</div>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Session Fee:</span>
                  <span className="text-zinc-100 font-bold">₱{walkinFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Discount:</span>
                  <span className="text-zinc-100 font-bold">₱0.00</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-[#CCFF00]/5 border-[#CCFF00]/10">
          <CardBody className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-[#CCFF00] mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-100">Schema Reminder</div>
              <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">
                This entry creates a <strong>tbl_transaction</strong> first, then uses that ID to create the <strong>tbl_walkintransaction</strong> record.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}