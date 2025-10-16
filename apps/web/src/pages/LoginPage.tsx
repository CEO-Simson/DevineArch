import { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const from = (location.state as { from?: Location })?.from?.pathname || '/app/people'

  const register = useMutation({
    mutationFn: (data: { email: string; name: string; password: string }) =>
      api<{ token: string }>(`/api/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (d) => {
      auth.login(d.token)
      navigate(from, { replace: true })
    },
  })

  const login = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api<{ token: string }>(`/api/auth/login`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (d) => {
      auth.login(d.token)
      navigate(from, { replace: true })
    },
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    login.mutate({
      email: String(form.get('email') || ''),
      password: String(form.get('password') || ''),
    })
  }

  return (
    <div className="min-h-dvh anglican-bg text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="login-card rounded-2xl p-8">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-[color:var(--gold,#D4AF37)]/90 text-neutral-900 grid place-items-center shadow">
              <span className="font-serif text-lg">✝</span>
            </div>
            <h1 className="login-title text-2xl">Welcome to TIMA</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Admin console for your parish or diocese</p>
          </div>

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="input" placeholder="you@parish.org" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className="input" placeholder="••••••••" required />
            </div>
            {login.isError ? <p className="text-sm text-red-600">{(login.error as Error).message}</p> : null}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button className="btn-gold" type="submit" disabled={login.isPending}>
                {login.isPending ? 'Signing in…' : 'Sign in'}
              </button>
              <button
                type="button"
                className="btn-ornate"
                onClick={() =>
                  register.mutate({
                    email: `demo+${Date.now()}@example.com`,
                    name: 'Demo User',
                    password: 'password123',
                  })
                }
                disabled={register.isPending}
                aria-label="Create demo account"
              >
                {register.isPending ? 'Creating…' : 'Quick demo account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-xs text-neutral-500 text-center">
            By continuing, you agree to our stewardship and privacy guidelines.
          </div>
        </div>
      </div>
    </div>
  )
}
