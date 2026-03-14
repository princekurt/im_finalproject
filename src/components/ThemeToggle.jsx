import React from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({ theme = 'dark', onToggle, compact = false }) {
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        'inline-flex items-center gap-2 rounded-xl ring-1 transition backdrop-blur-md',
        compact ? 'px-2.5 py-2 text-xs' : 'px-3 py-2 text-xs',
        'bg-black/30 text-zinc-200 ring-white/10 hover:bg-white/5 active:bg-white/10',
      ].join(' ')}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="font-semibold tracking-wide">{isLight ? 'Dark' : 'Light'}</span>
    </button>
  )
}
