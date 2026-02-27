import React, { useMemo } from 'react'
import { Calendar, Phone, Shield, User, Mail, Timer, Sparkles } from 'lucide-react'
import { Modal } from './Modal.jsx'
import { Badge } from './Badge.jsx'
import { Button } from './Button.jsx'
import { daysRemaining, formatISO, isActiveMember } from '../utils/dates.js'

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
      <div className="mt-0.5 text-zinc-400">{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-widest text-zinc-500">{label}</div>
        <div className="mt-1 truncate text-sm font-bold text-zinc-200">{value || '—'}</div>
      </div>
    </div>
  )
}

export function MemberProfileModal({ member, open, onClose }) {
  const remaining = useMemo(() => (member ? daysRemaining(member.endDate) : null), [member])
  const active = member ? isActiveMember(member) : false

  return (
    <Modal
      open={open}
      title={member ? `${member.name} • ${member.id}` : 'Member Profile'}
      onClose={onClose}
    >
      {!member ? null : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-[#161616] p-5 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold tracking-widest text-zinc-500">STATUS</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge tone={active ? 'active' : 'expired'}>{active ? 'Active' : 'Expired'}</Badge>
                    <Badge tone="neutral">{member.tier}</Badge>
                  </div>
                </div>
                <div className="rounded-2xl bg-black/30 p-3 ring-1 ring-white/10 text-zinc-200">
                  <Shield className="h-5 w-5 text-[#CCFF00]" />
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold tracking-widest text-zinc-500">DAYS REMAINING</div>
                  <Timer className="h-4 w-4 text-zinc-500" />
                </div>
                <div className="mt-3 text-5xl font-black tracking-tight">
                  <span className={active ? 'text-[#CCFF00]' : 'text-[#FF4500]'}>
                    {remaining == null ? '—' : remaining}
                  </span>
                </div>
                <div className="mt-2 text-xs text-zinc-500">
                  Ends {formatISO(member.endDate)} • Started {formatISO(member.startDate)}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button
                  variant="orange"
                  type="button"
                  onClick={() => {
                    // TODO: Group will implement Renew Membership here.
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  Renew
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    // TODO: Group will implement Edit Member Details here.
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InfoRow icon={<User className="h-4 w-4" />} label="FULL NAME" value={member.name} />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="EMAIL" value={member.contact} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="PHONE" value={member.phone} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="MEMBERSHIP TIER" value={member.tier} />
            </div>

            <div className="rounded-2xl bg-[#161616] p-5 ring-1 ring-white/10">
              <div className="text-sm font-black tracking-tight text-zinc-100">Member Notes</div>
              <div className="mt-1 text-xs text-zinc-500">
                // TODO: Group will implement notes, check-in history, and payment ledger here.
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
                  <div className="text-xs font-semibold tracking-widest text-zinc-500">CHECK-INS</div>
                  <div className="mt-2 text-2xl font-black tracking-tight text-zinc-200">—</div>
                </div>
                <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
                  <div className="text-xs font-semibold tracking-widest text-zinc-500">LAST VISIT</div>
                  <div className="mt-2 text-2xl font-black tracking-tight text-zinc-200">—</div>
                </div>
                <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
                  <div className="text-xs font-semibold tracking-widest text-zinc-500">BALANCE</div>
                  <div className="mt-2 text-2xl font-black tracking-tight text-zinc-200">—</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-zinc-600">
                Member profile is a modal UI only (mock). Hook up real actions later.
              </div>
              <Button
                variant="subtle"
                type="button"
                onClick={() => {
                  // TODO: Group will implement Delete Member here.
                }}
              >
                Archive Member
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

