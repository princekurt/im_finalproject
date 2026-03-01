import React, { useMemo, useState } from 'react'
import { ClipboardSignature, UserPlus } from 'lucide-react'
import { Button } from '../components/Button.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { FieldLabel, SelectField, TextField } from '../components/Field.jsx'
import { MEMBERSHIP_TYPES } from '../data/members.js' // Changed to match your new list name

export function RegistrationPage() {
  // Reference the new Membership Types list
  const types = useMemo(() => MEMBERSHIP_TYPES, [])

  const [form, setForm] = useState({
    name: '',
    contact: '',
    phone: '',
    membershipType: 'Whole Gym Access', // Changed key from 'tier'
    startDate: '',
    endDate: '',
  })

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
              console.log('Form Submitted:', form)
              // TODO: Group will implement Save Member to Database here.
            }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel>FULL NAME</FieldLabel>
                <TextField
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="e.g. Jamie Smith"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>CONTACT (EMAIL)</FieldLabel>
                <TextField
                  value={form.contact}
                  onChange={(e) => setForm((s) => ({ ...s, contact: e.target.value }))}
                  placeholder="jamie.smith@example.com"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>PHONE</FieldLabel>
                <TextField
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="(555) 010-0000"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>MEMBERSHIP TYPE</FieldLabel>
                <SelectField
                  value={form.membershipType}
                  onChange={(e) => setForm((s) => ({ ...s, membershipType: e.target.value }))}
                >
                  {types.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </SelectField>
              </div>
              <div className="space-y-2">
                <FieldLabel>START DATE</FieldLabel>
                <TextField
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((s) => ({ ...s, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>END DATE</FieldLabel>
                <TextField
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((s) => ({ ...s, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between border-t border-white/5 pt-5">
              <div className="text-[10px] uppercase font-bold text-zinc-600">
                Staff Verification Required: ID + Waiver Status.
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" onClick={() => setForm((s) => ({ ...s, name: '', contact: '', phone: '' }))}>
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
            <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
              <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">ACCESS LEVEL</div>
              <div className="mt-2 font-bold text-zinc-100">Gym vs. Muay Thai</div>
              <div className="mt-1 text-xs text-zinc-500 italic">Access type determines facility permissions.</div>
            </div>
            <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
              <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">FINANCE</div>
              <div className="mt-2 font-bold text-zinc-100">Payment + Receipt</div>
              <div className="mt-1 text-xs text-zinc-500 italic">
                // TODO: Group to implement billing integration.
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}