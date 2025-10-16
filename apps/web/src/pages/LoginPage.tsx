import { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const from = (location.state as { from?: Location })?.from?.pathname || '/people'

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
    <div className="min-h-dvh bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Sign in to TIMA</h1>
          <p className="text-sm text-neutral-500 mt-2">Manage your people, giving, and reports</p>
        </div>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" placeholder="••••••••" required />
          </div>
          {login.isError ? <p className="text-sm text-red-600">{(login.error as Error).message}</p> : null}
          <button className="btn btn-primary w-full" type="submit" disabled={login.isPending}>
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-sm text-neutral-500">
          Need an account?{' '}
          <button
            className="underline"
            onClick={() =>
              register.mutate({
                email: `demo+${Date.now()}@example.com`,
                name: 'Demo User',
                password: 'password123',
              })
            }
            disabled={register.isPending}
          >
            {register.isPending ? 'Creating…' : 'Create quick demo user'}
          </button>
        </div>
      </div>
    </div>
  )
}
