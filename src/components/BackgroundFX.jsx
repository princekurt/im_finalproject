import React from 'react'

export function BackgroundFX({ intensity = 'default' }) {
  const glow =
    intensity === 'login'
      ? 'opacity-100'
      : 'opacity-70'

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={['absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl', glow].join(' ')}>
        <div className="h-full w-full rounded-full bg-[#CCFF00]/12" />
      </div>
      <div className="absolute -bottom-56 -right-40 h-[560px] w-[560px] rounded-full bg-[#FF4500]/10 blur-3xl opacity-70" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_20%_0%,rgba(204,255,0,0.08),transparent_55%),radial-gradient(900px_500px_at_80%_100%,rgba(255,69,0,0.07),transparent_55%)]" />
    </div>
  )
}

