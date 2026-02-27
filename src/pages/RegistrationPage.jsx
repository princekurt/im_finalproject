import React, { useMemo, useState } from 'react'
import { ClipboardSignature, UserPlus } from 'lucide-react'
import { Button } from '../components/Button.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { FieldLabel, SelectField, TextField } from '../components/Field.jsx'
import { MEMBERSHIP_TIERS } from '../data/members.js'

export function RegistrationPage() {
  const tiers = useMemo(() => MEMBERSHIP_TIERS, [])

  const [form, setForm] = useState({
    name: '',
    contact: '',
    phone: '',
    tier: 'Standard',
    startDate: '',
    endDate: '',
  })

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-black tracking-tight text-zinc-100">New Member Registration</div>
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
              // TODO: Group will implement Save Member here.
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
                <FieldLabel>MEMBERSHIP TIER</FieldLabel>
                <SelectField
                  value={form.tier}
                  onChange={(e) => setForm((s) => ({ ...s, tier: e.target.value }))}
                >
                  {tiers.map((t) => (
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

            <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-zinc-600">
                By saving, you confirm staff verified ID and waiver status.
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
          <div className="text-sm font-black tracking-tight text-zinc-100">Registration Checklist</div>
          <div className="mt-1 text-xs text-zinc-500">Operational guardrails.</div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3 text-sm text-zinc-300">
            <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">VERIFY</div>
              <div className="mt-2 font-bold">Government ID + waiver</div>
              <div className="mt-1 text-xs text-zinc-500">Confirm identity before activation.</div>
            </div>
            <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">SETUP</div>
              <div className="mt-2 font-bold">Tier + dates</div>
              <div className="mt-1 text-xs text-zinc-500">End date drives active/expired status.</div>
            </div>
            <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">TODO</div>
              <div className="mt-2 font-bold">Payment + receipt</div>
              <div className="mt-1 text-xs text-zinc-500">
                // TODO: Group will implement Payment capture + receipts here.
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

