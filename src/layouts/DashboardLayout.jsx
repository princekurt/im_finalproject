import React, { useMemo, useState } from 'react'
import { Menu, ShieldCheck } from 'lucide-react'
import { Sidebar } from '../components/Sidebar.jsx'
import { BackgroundFX } from '../components/BackgroundFX.jsx'

const TITLES = {
  dashboard: { title: 'Snapshot', sub: 'Realtime gym intel. Stay sharp.' },
  members: { title: 'Member Directory', sub: 'Search, verify status, view profiles.' },
  registration: { title: 'Registration', sub: 'Log new members into the system.' },
}

export function DashboardLayout({ activeKey, onNavigate, onLogout, staffId, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const meta = useMemo(() => TITLES[activeKey] || TITLES.dashboard, [activeKey])

  return (
    <div className="min-h-full bg-[#0A0A0A] text-zinc-100">
      <div className="relative min-h-screen">
        <BackgroundFX />
        <div className="relative flex min-h-screen">
          <Sidebar
            activeKey={activeKey}
            onNavigate={onNavigate}
            onLogout={onLogout}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0A0A0A]/75 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/55">
              <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="md:hidden rounded-xl bg-white/0 p-2 text-zinc-200 ring-1 ring-white/10 hover:bg-white/5 active:bg-white/10"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open navigation"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                  <div className="min-w-0">
                    <div className="truncate text-lg font-black tracking-tight">{meta.title}</div>
                    <div className="truncate text-xs text-zinc-500">{meta.sub}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-[#161616] px-3 py-2 ring-1 ring-white/10">
                  <ShieldCheck className="h-4 w-4 text-[#CCFF00]" />
                  <div className="leading-tight">
                    <div className="text-[11px] font-semibold tracking-widest text-zinc-500">STAFF</div>
                    <div className="text-xs font-bold text-zinc-200">{staffId || '—'}</div>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 md:px-6">
              <div className="mx-auto w-full max-w-6xl">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

