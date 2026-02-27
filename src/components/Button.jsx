import React from 'react'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold tracking-wide transition focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/40 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary:
    'bg-[#CCFF00] text-black hover:brightness-110 active:brightness-95 shadow-[0_0_0_1px_rgba(204,255,0,0.25),0_10px_30px_rgba(204,255,0,0.08)]',
  orange:
    'bg-[#FF4500] text-black hover:brightness-110 active:brightness-95 shadow-[0_0_0_1px_rgba(255,69,0,0.25),0_10px_30px_rgba(255,69,0,0.08)]',
  ghost:
    'bg-white/0 text-zinc-200 hover:bg-white/5 active:bg-white/10 ring-1 ring-white/10',
  subtle:
    'bg-[#161616] text-zinc-200 hover:bg-[#1b1b1b] active:bg-[#141414] ring-1 ring-white/10',
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const cls = `${base} ${variants[variant] || variants.primary} ${className}`
  return <button className={cls} {...props} />
}

