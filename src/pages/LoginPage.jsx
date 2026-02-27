import React, { useState } from 'react'
import { Lock, Shield, User } from 'lucide-react'
import { BackgroundFX } from '../components/BackgroundFX.jsx'
import { Button } from '../components/Button.jsx'
import { FieldLabel, TextField } from '../components/Field.jsx'

export function LoginPage({ onLogin }) {
  const [staffId, setStaffId] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100">
      <div className="relative min-h-screen">
        <BackgroundFX intensity="login" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div className="hidden md:block">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/0 px-3 py-1 text-xs font-semibold tracking-widest text-zinc-400 ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_25px_rgba(204,255,0,0.35)]" />
                STAFF ACCESS
              </div>
              <h1 className="mt-5 text-5xl font-black tracking-tight">
                <span className="text-zinc-100">LVLUP</span>{' '}
                <span className="text-[#CCFF00]">Fitness</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
                Gym Membership Management System UI — industrial dark mode built for fast check-ins,
                clean registration, and at-a-glance membership status.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
                <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
                  <div className="text-xs font-semibold tracking-widest text-zinc-500">FOCUS</div>
                  <div className="mt-2 text-sm font-bold text-zinc-200">Speed + clarity</div>
                </div>
                <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
                  <div className="text-xs font-semibold tracking-widest text-zinc-500">VIBE</div>
                  <div className="mt-2 text-sm font-bold text-zinc-200">Garage-gym grit</div>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl ring-1 ring-white/15 shadow-[0_30px_120px_rgba(0,0,0,0.75)]">
                <div className="absolute inset-0 bg-[radial-gradient(700px_240px_at_15%_0%,rgba(204,255,0,0.12),transparent_60%)]" />
                <div className="relative p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-[11px] font-semibold tracking-widest text-zinc-400 ring-1 ring-white/10">
                        <Shield className="h-3.5 w-3.5 text-[#CCFF00]" />
                        STAFF ACCESS
                      </div>
                      <div className="mt-4 text-2xl font-black tracking-tight">Admin Login</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        Authorized staff only • Secure console
                      </div>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black/30 ring-1 ring-white/10">
                      <span className="text-sm font-black tracking-tight text-[#CCFF00]">LVL</span>
                    </div>
                  </div>

                  <form
                    className="mt-6 space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault()
                      onLogin?.({ staffId, password })
                    }}
                  >
                    <div className="space-y-2">
                      <FieldLabel htmlFor="staffId">STAFF ID</FieldLabel>
                      <TextField
                        id="staffId"
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        placeholder="e.g. LVL-STAFF-042"
                        leading={<User className="h-4 w-4" />}
                        autoComplete="username"
                      />
                    </div>

                    <div className="space-y-2">
                      <FieldLabel htmlFor="password">PASSWORD</FieldLabel>
                      <TextField
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        leading={<Lock className="h-4 w-4" />}
                        autoComplete="current-password"
                      />
                    </div>

                    <div className="pt-2">
                      <Button className="w-full" variant="primary" type="submit">
                        <Shield className="h-4 w-4" />
                        Enter Console
                      </Button>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF4500]/70" />
                          No backend wired (mock UI)
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00]/70" />
                          Tailwind + Lucide
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="mt-5 text-center text-xs text-zinc-600">
                LVLUP Fitness • Membership Console • UI-only build
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

