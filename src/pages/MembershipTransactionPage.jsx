import React, { useState } from 'react'
import { CreditCard, Calendar, UserSearch, ShieldCheck, TicketPercent } from 'lucide-react'
import { Button } from '../components/Button.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { FieldLabel, SelectField, TextField } from '../components/Field.jsx'

export function MembershipTransactionPage() {
  const [form, setForm] = useState({
    // tbl_transaction fields
    receptionist_id: '1',
    paymenttype_id: '1',
    discounttype_id: '1',
    // tbl_membership fields
    customer_id: '',
    membershiptype_id: '1',
    start_date: '',
    end_date: '',
  })

  // Mock calculation based on tbl_membershiptype
  const baseFee = form.membershiptype_id === '2' ? 2500 : 1000;
  const discount = form.discounttype_id === '2' ? 200 : 0; // Example: Promo discount
  const amountDue = baseFee - discount;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-black tracking-tight text-zinc-100 uppercase italic">Membership Transaction</div>
              <div className="mt-1 text-xs text-zinc-500">Processing <strong>tbl_membership</strong> + <strong>tbl_transaction</strong>.</div>
            </div>
            <div className="rounded-2xl bg-[#CCFF00]/10 p-3 ring-1 ring-[#CCFF00]/20 text-[#CCFF00]">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              
              {/* CUSTOMER SEARCH */}
              <div className="md:col-span-2 space-y-2">
                <FieldLabel>SELECT MEMBER</FieldLabel>
                <div className="relative">
                  <SelectField 
                    value={form.customer_id} 
                    onChange={(e) => setForm({...form, customer_id: e.target.value})}
                  >
                    <option value="">Search Existing Customer...</option>
                    <option value="101">Juan Dela Cruz (C-101)</option>
                    <option value="102">Maria Santos (C-102)</option>
                  </SelectField>
                  <UserSearch className="absolute right-8 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* MEMBERSHIP SELECTION */}
              <div className="space-y-2">
                <FieldLabel>MEMBERSHIP TYPE</FieldLabel>
                <SelectField 
                  value={form.membershiptype_id} 
                  onChange={(e) => setForm({...form, membershiptype_id: e.target.value})}
                >
                  <option value="1">Whole Gym Access</option>
                  <option value="2">Whole Gym & Muay Thai</option>
                </SelectField>
              </div>

              <div className="space-y-2">
                <FieldLabel>PAYMENT TYPE</FieldLabel>
                <SelectField 
                  value={form.paymenttype_id} 
                  onChange={(e) => setForm({...form, paymenttype_id: e.target.value})}
                >
                  <option value="1">Cash</option>
                  <option value="2">GCash / Digital</option>
                </SelectField>
              </div>

              {/* DURATION */}
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
                />
              </div>

              {/* DISCOUNT */}
              <div className="space-y-2">
                <FieldLabel>DISCOUNT APPLIED</FieldLabel>
                <SelectField 
                  value={form.discounttype_id} 
                  onChange={(e) => setForm({...form, discounttype_id: e.target.value})}
                >
                  <option value="1">No Discount (Standard)</option>
                  <option value="2">Student / Senior (-₱200)</option>
                  <option value="3">Referral Promo (-₱500)</option>
                </SelectField>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <Button type="submit" variant="primary" className="w-full md:w-auto">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Finalize Transaction
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* BILLING SUMMARY SIDEBAR */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="text-sm font-black tracking-tight text-zinc-100 uppercase">Billing Summary</div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="text-center py-6 rounded-2xl bg-black/40 ring-1 ring-white/5 border-b-2 border-[#CCFF00]">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount Due</div>
                <div className="text-4xl font-black text-white italic">₱{amountDue.toLocaleString()}</div>
              </div>
              
              <div className="space-y-3 px-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Base Membership:</span>
                  <span className="text-zinc-100 font-bold">₱{baseFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-red-400">
                  <span className="flex items-center gap-1"><TicketPercent className="h-3 w-3" /> Discount:</span>
                  <span>- ₱{discount.toLocaleString()}</span>
                </div>
                <div className="h-px bg-white/5 my-2" />
                <div className="flex justify-between text-[10px] text-[#CCFF00] font-black uppercase tracking-tighter">
                  <span>Grand Total:</span>
                  <span className="text-sm">₱{amountDue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="rounded-2xl bg-zinc-900/50 p-4 border border-white/5 text-[10px] text-zinc-500 italic leading-relaxed">
          <strong>Note:</strong> Finalizing this will update <u>tbl_membership</u> status and generate a transaction receipt in <u>tbl_transaction</u>.
        </div>
      </div>
    </div>
  )
}