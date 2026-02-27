import React from 'react'

export function Card({ className = '', ...props }) {
  return (
    <div
      className={[
        'rounded-2xl bg-[#161616] ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export function CardHeader({ className = '', ...props }) {
  return <div className={['px-5 pt-5', className].join(' ')} {...props} />
}

export function CardBody({ className = '', ...props }) {
  return <div className={['px-5 pb-5', className].join(' ')} {...props} />
}

