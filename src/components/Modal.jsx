import React, { useEffect } from 'react'

export function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onClose?.()}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-[#111] ring-1 ring-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-black tracking-widest text-zinc-100">
                {title}
              </div>
              <div className="text-xs text-zinc-500">LVLUP Fitness • Member Profile</div>
            </div>
            <button
              className="rounded-xl bg-white/0 px-3 py-2 text-xs font-semibold tracking-widest text-zinc-300 ring-1 ring-white/10 hover:bg-white/5 active:bg-white/10"
              onClick={() => onClose?.()}
              type="button"
            >
              Close
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

