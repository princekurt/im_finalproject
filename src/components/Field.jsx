import React from 'react'

export function FieldLabel({ className = '', ...props }) {
  return <label className={['text-xs font-semibold tracking-widest text-zinc-400', className].join(' ')} {...props} />
}

export function TextField({
  className = '',
  inputClassName = '',
  leading,
  ...props
}) {
  return (
    <div
      className={[
        'flex items-center gap-2 rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10 focus-within:ring-[#CCFF00]/35',
        className,
      ].join(' ')}
    >
      {leading ? <div className="text-zinc-400">{leading}</div> : null}
      <input
        className={[
          'w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none',
          inputClassName,
        ].join(' ')}
        {...props}
      />
    </div>
  )
}

export function SelectField({ className = '', ...props }) {
  return (
    <select
      className={[
        'w-full rounded-xl bg-black/30 px-3 py-2 text-sm text-zinc-100 ring-1 ring-white/10 outline-none focus:ring-[#CCFF00]/35',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

