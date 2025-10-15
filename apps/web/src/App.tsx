import { useMutation } from '@tanstack/react-query'
import { api, setAuthToken, authHeaders } from './api/client'

function Login() {
  const register = useMutation({
    mutationFn: (data: { email: string; name: string; password: string }) =>
      api<{ token: string }>(`/api/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (d) => setAuthToken(d.token),
  })
  const login = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api<{ token: string }>(`/api/auth/login`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (d) => setAuthToken(d.token),
  })

  return (
    <div className="card max-w-md w-full p-6">
      <h2 className="text-xl font-semibold mb-4">Welcome</h2>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          const f = new FormData(e.currentTarget as HTMLFormElement)
          login.mutate({ email: String(f.get('email') || ''), password: String(f.get('password') || '') })
        }}
      >
        <input name="email" type="email" placeholder="Email" className="input" required />
        <input name="password" type="password" placeholder="Password" className="input" required />
        <button className="btn btn-primary w-full" type="submit" disabled={login.isPending}>
          {login.isPending ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <div className="mt-4 text-sm text-neutral-500">
        No account?{' '}
        <button
          className="underline"
          onClick={() =>
            register.mutate({ email: `demo+${Date.now()}@example.com`, name: 'Demo User', password: 'password123' })
          }
        >
          Quick register
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100">
      <header className="border-b border-neutral-200/70 dark:border-neutral-800">
        <div className="container-px mx-auto flex h-14 items-center justify-between">
          <div className="font-semibold">TIMA</div>
          <nav className="hidden sm:flex gap-6 text-sm text-neutral-600 dark:text-neutral-300">
            <a className="hover:text-brand-600" href="#features">Features</a>
            <a className="hover:text-brand-600" href="#pricing">Pricing</a>
            <a className="hover:text-brand-600" href="#about">About</a>
          </nav>
        </div>
      </header>

      <main className="container-px mx-auto py-10 grid place-items-center">
        <Login />
      </main>

      <footer className="py-10 text-center text-sm text-neutral-500">© {new Date().getFullYear()} TIMA</footer>
    </div>
  )
}
