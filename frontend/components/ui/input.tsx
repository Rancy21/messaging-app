import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...rest }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-display font-semibold uppercase tracking-widest text-ink-400"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full bg-ink-800 border border-ink-700 rounded-lg
          px-3.5 py-2.5 text-sm font-body text-ink-100
          placeholder:text-ink-500
          focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal
          transition-colors duration-150
          ${error ? 'border-red-600 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...rest}
      />
      {error && (
        <p className="text-xs text-red-400 font-body" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}