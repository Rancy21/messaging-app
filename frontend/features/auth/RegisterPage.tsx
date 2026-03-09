import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter, Link } from '@tanstack/react-router'
import { authApi } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/input'
import { ErrorMessage } from '../../components/ui/Misc'
import type { RegisterRequest } from '../../types'

export function RegisterPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState<RegisterRequest>({ username: '', password: '' })
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState('')

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.username)
      void router.navigate({ to: '/chat' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== confirm) {
      setLocalError('Passwords do not match.')
      return
    }
    setLocalError('')
    mutation.mutate(form)
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#2a2e10_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-extrabold text-ink-50 tracking-tight">
            relay<span className="text-signal">.</span>
          </h1>
          <p className="mt-2 font-body text-sm text-ink-400">Create your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-ink-900 border border-ink-800 rounded-2xl p-8 flex flex-col gap-5 shadow-2xl"
          aria-label="Register form"
        >
          <Input
            label="Username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            required
            placeholder="choose_a_username"
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            placeholder="••••••••"
          />
          <Input
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="••••••••"
            error={localError}
          />

          {mutation.isError && (
            <ErrorMessage
              message={
                mutation.error instanceof Error
                  ? mutation.error.message
                  : 'Registration failed.'
              }
            />
          )}

          <Button type="submit" fullWidth loading={mutation.isPending} className="mt-1">
            Create account
          </Button>

          <p className="text-center text-xs font-body text-ink-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-signal hover:text-signal-dim underline underline-offset-2 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
