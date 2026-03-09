import type { ButtonHTMLAttributes, ReactNode } from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode
    variant?: 'primary'| 'ghost'| 'danger'
    loading?: boolean
    fullWidth?: boolean
}


export function Button({
    children,
    variant = 'primary',
    loading= false,
    fullWidth = false,
    className = '',
    disabled,
    ...rest
}: ButtonProps){
  const base =
    'inline-flex items-center justify-center gap-2 font-display font-semibold text-sm rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-signal text-ink-950 hover:bg-signal-dim active:scale-95 px-4 py-2.5',
    ghost:
      'bg-transparent text-ink-300 hover:bg-ink-800 hover:text-ink-100 border border-ink-700 px-4 py-2.5',
    danger:
      'bg-transparent text-red-400 hover:bg-red-950 border border-red-800 px-4 py-2.5',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span
          className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}