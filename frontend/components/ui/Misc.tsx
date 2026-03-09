interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`${sizes[size]} border-2 border-ink-600 border-t-signal rounded-full animate-spin inline-block`}
    />
  )
}

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex items-center gap-2 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-4 py-3 font-body"
    >
      <span aria-hidden="true">⚠</span>
      {message}
    </div>
  )
}

export function Avatar({ username, size = 'md' }: { username: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }
  const initial = username.charAt(0).toUpperCase()
  return (
    <span
      aria-label={username}
      className={`${sizes[size]} rounded-full bg-signal-muted border border-signal/30 text-signal font-display font-bold inline-flex items-center justify-center shrink-0`}
    >
      {initial}
    </span>
  )
}
