import React from 'react'
import { LayoutDashboard, Users, UserPlus, LogOut, X } from 'lucide-react'

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'members', label: 'Members', icon: Users },
  { key: 'registration', label: 'Registration', icon: UserPlus },
]

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#CCFF00] text-black shadow-[0_0_0_1px_rgba(204,255,0,0.25),0_18px_60px_rgba(204,255,0,0.12)]">
        <span className="text-sm font-black tracking-tight">LVL</span>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-black tracking-widest text-zinc-100">LVLUP</div>
        <div className="text-[11px] font-semibold tracking-widest text-zinc-500">FITNESS • STAFF</div>
      </div>
    </div>
  )
}

export function Sidebar({ activeKey, onNavigate, onLogout, open, setOpen }) {
  return (
    <>
      <div className="hidden md:flex md:w-72 md:flex-col md:border-r md:border-white/10 md:bg-[#0A0A0A]">
        <div className="px-5 py-5">
          <Brand />
        </div>

        <div className="px-3 pb-4">
          <div className="rounded-2xl bg-[#161616] ring-1 ring-white/10 p-2">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-widest text-zinc-500">
              NAVIGATION
            </div>
            <nav className="space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon
                const active = item.key === activeKey
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onNavigate?.(item.key)}
                    className={[
                      'w-full group flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold tracking-wide transition',
                      active
                        ? 'bg-[#CCFF00]/10 text-[#CCFF00] ring-1 ring-[#CCFF00]/20'
                        : 'text-zinc-200 hover:bg-white/5 active:bg-white/10',
                    ].join(' ')}
                  >
                    <Icon className={active ? 'h-4 w-4' : 'h-4 w-4 text-zinc-400 group-hover:text-zinc-200'} />
                    <span className="flex-1">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="my-3 h-px bg-white/10" />

            <button
              type="button"
              onClick={() => onLogout?.()}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold tracking-wide text-zinc-200 hover:bg-white/5 active:bg-white/10"
            >
              <LogOut className="h-4 w-4 text-zinc-400" />
              Logout
            </button>
          </div>
        </div>

        <div className="mt-auto px-5 pb-6">
          <div className="rounded-2xl bg-black/30 ring-1 ring-white/10 p-4">
            <div className="text-xs font-semibold tracking-widest text-zinc-500">INDUSTRIAL DARK</div>
            <div className="mt-2 text-sm font-bold text-zinc-200">
              Keep it clean. Keep it loud.
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              This is UI-only. Plug in your auth + DB later.
            </div>
          </div>
        </div>
      </div>

      {/* Tablet / small screens drawer */}
      {open ? (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen?.(false)} />
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-xs bg-[#0A0A0A] border-r border-white/10">
            <div className="flex items-center justify-between px-5 py-5">
              <Brand />
              <button
                type="button"
                className="rounded-xl bg-white/0 p-2 text-zinc-200 ring-1 ring-white/10 hover:bg-white/5 active:bg-white/10"
                onClick={() => setOpen?.(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-3 pb-4">
              <div className="rounded-2xl bg-[#161616] ring-1 ring-white/10 p-2">
                <div className="px-3 py-2 text-[11px] font-semibold tracking-widest text-zinc-500">
                  NAVIGATION
                </div>
                <nav className="space-y-1">
                  {NAV.map((item) => {
                    const Icon = item.icon
                    const active = item.key === activeKey
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          onNavigate?.(item.key)
                          setOpen?.(false)
                        }}
                        className={[
                          'w-full group flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold tracking-wide transition',
                          active
                            ? 'bg-[#CCFF00]/10 text-[#CCFF00] ring-1 ring-[#CCFF00]/20'
                            : 'text-zinc-200 hover:bg-white/5 active:bg-white/10',
                        ].join(' ')}
                      >
                        <Icon className={active ? 'h-4 w-4' : 'h-4 w-4 text-zinc-400 group-hover:text-zinc-200'} />
                        <span className="flex-1">{item.label}</span>
                      </button>
                    )
                  })}
                </nav>

                <div className="my-3 h-px bg-white/10" />

                <button
                  type="button"
                  onClick={() => onLogout?.()}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold tracking-wide text-zinc-200 hover:bg-white/5 active:bg-white/10"
                >
                  <LogOut className="h-4 w-4 text-zinc-400" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

