import React from 'react'

const styles = {
  active:
    'bg-[#CCFF00]/15 text-[#CCFF00] ring-1 ring-[#CCFF00]/25 shadow-[0_0_30px_rgba(204,255,0,0.12)]',
  expired: 'bg-[#FF4500]/10 text-[#FF4500]/90 ring-1 ring-[#FF4500]/20 opacity-80',
  neutral: 'bg-white/5 text-zinc-300 ring-1 ring-white/10',
}

export function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide',
        styles[tone] || styles.neutral,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}

