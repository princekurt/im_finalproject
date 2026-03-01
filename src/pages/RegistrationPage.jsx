import React, { useMemo, useState } from 'react'
import { ClipboardSignature, UserPlus } from 'lucide-react'
import { Button } from '../components/Button.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { FieldLabel, SelectField, TextField } from '../components/Field.jsx'
import { MEMBERSHIP_TYPES } from '../data/members.js'

export function RegistrationPage() {
  const types = useMemo(() => MEMBERSHIP_TYPES, [])

  const [form, setForm] = useState({
    full_name: '',
    contact_number: '',
    address: '',
    gender_id: '1',
    dob: '',
    relation_status_id: '1',
    membershiptype_id: '1',
    discount: 0,
    start_date: '',
    end_date: '',
  })

  // Pricing Logic based on your ERD's MembershipType table
  const basePrice = form.membershiptype_id === '2' ? 2500 : 1000;
  const finalPrice = basePrice - Number(form.discount);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-black tracking-tight text-zinc-100 uppercase">New Member Registration</div>
              <div className="mt-1 text-xs text-zinc-500">
                Rugged intake form for staff. UI-only with TODO hooks.
              </div>
            </div>
            <div className="rounded-2xl bg-black/30 p-3 ring-1 ring-white/10 text-zinc-200">
              <ClipboardSignature className="h-5 w-5 text-[#CCFF00]" />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              console.log('Form Submitted to Database:', form)
              // TODO: Implement Supabase multi-table insert (Customer then Membership)
            }}
          >
            <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
              {/* --- CUSTOMER INFO --- */}
              <div className="space-y-2">
                <FieldLabel>FULL NAME</FieldLabel>
                <TextField
                  value={form.full_name}
                  onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))}
                  placeholder="e.g. Jamie Smith"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>CONTACT NUMBER</FieldLabel>
                <TextField
                  value={form.contact_number}
                  onChange={(e) => setForm((s) => ({ ...s, contact_number: e.target.value }))}
                  placeholder="0912 345 6789"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <FieldLabel>HOME ADDRESS</FieldLabel>
                <TextField
                  value={form.address}
                  onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
                  placeholder="House #, Street, City"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>GENDER</FieldLabel>
                <SelectField
                  value={form.gender_id}
                  onChange={(e) => setForm((s) => ({ ...s, gender_id: e.target.value }))}
                >
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </SelectField>
              </div>

              <div className="space-y-2">
                <FieldLabel>DATE OF BIRTH</FieldLabel>
                <TextField
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm((s) => ({ ...s, dob: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>RELATIONSHIP STATUS</FieldLabel>
                <SelectField
                  value={form.relation_status_id}
                  onChange={(e) => setForm((s) => ({ ...s, relation_status_id: e.target.value }))}
                >
                  <option value="1">Single</option>
                  <option value="2">Married</option>
                </SelectField>
              </div>

              {/* --- MEMBERSHIP INFO --- */}
              <div className="space-y-2">
                <FieldLabel>MEMBERSHIP TYPE</FieldLabel>
                <SelectField
                  value={form.membershiptype_id}
                  onChange={(e) => setForm((s) => ({ ...s, membershiptype_id: e.target.value }))}
                >
                  <option value="1">Whole Gym Access</option>
                  <option value="2">Whole Gym & Muay Thai Access</option>
                </SelectField>
                <div className="text-[10px] font-bold text-[#CCFF00] mt-1 tracking-widest uppercase italic">
                  Base Fee: ₱{basePrice.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel>START DATE</FieldLabel>
                <TextField
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm((s) => ({ ...s, start_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>END DATE</FieldLabel>
                <TextField
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm((s) => ({ ...s, end_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>DISCOUNT (PHP)</FieldLabel>
                <TextField
                  type="number"
                  value={form.discount}
                  onChange={(e) => setForm((s) => ({ ...s, discount: e.target.value }))}
                  placeholder="0"
                />
                <div className="text-[10px] font-bold text-zinc-500 mt-1 tracking-widest uppercase">
                  Final Amount: <span className="text-white">₱{finalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between border-t border-white/5 pt-5">
              <div className="text-[10px] uppercase font-bold text-zinc-600">
                Staff Verification Required: ID + Waiver Status.
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setForm({ 
                    full_name: '', contact_number: '', address: '', 
                    gender_id: '1', dob: '', relation_status_id: '1', 
                    membershiptype_id: '1', discount: 0, start_date: '', end_date: '' 
                  })}
                >
                  Clear
                </Button>
                <Button type="submit" variant="primary">
                  <UserPlus className="h-4 w-4" />
                  Save Member
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-black tracking-tight text-zinc-100 uppercase">Registration Checklist</div>
          <div className="mt-1 text-xs text-zinc-500">Operational guardrails.</div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3 text-sm text-zinc-300">
            <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10 border-l-2 border-[#CCFF00]">
              <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">VERIFY</div>
              <div className="mt-2 font-bold text-zinc-100">Government ID + Waiver</div>
              <div className="mt-1 text-xs text-zinc-500 italic">Confirm identity before facility access.</div>
            </div>
            
            <div className="rounded-2xl bg-[#CCFF00]/5 p-4 ring-1 ring-[#CCFF00]/20">
              <div className="text-[10px] font-black tracking-widest text-[#CCFF00] uppercase">FINANCE: TOTAL DUE</div>
              <div className="mt-2 text-2xl font-black text-white italic">₱{finalPrice.toLocaleString()}</div>
              <div className="mt-1 text-xs text-zinc-500 italic">
                {form.discount > 0 ? `Discount of ₱${form.discount} applied.` : 'No discount applied.'}
              </div>
            </div>

            <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10 opacity-50">
              <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">DATABASE STATUS</div>
              <div className="mt-2 font-bold text-zinc-100">Ready for Sync</div>
              <div className="mt-1 text-xs text-zinc-500 italic uppercase">
                Schema: Customer + Membership
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}