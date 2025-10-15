import { useMutation } from '@tanstack/react-query'
import { api, setAuthToken } from './api/client'
import { AuthProvider, useAuth } from './hooks/useAuth'
import PeoplePage from './pages/PeoplePage'
import GivingPage from './pages/GivingPage'
import ReportsPage from './pages/ReportsPage'

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

function Shell() {
  const { token, logout } = useAuth()
  const [route, setRoute] = ((): [string, (s: string) => void] => {
    const get = () => (location.hash?.slice(1) || 'people')
    const set = (s: string) => { location.hash = s }
    return [get(), set]
  })()

  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100">
      <header className="border-b border-neutral-200/70 dark:border-neutral-800">
        <div className="container-px mx-auto flex h-14 items-center justify-between">
          <div className="font-semibold">TIMA</div>
          <nav className="flex gap-4 text-sm text-neutral-600 dark:text-neutral-300">
            {token ? (
              <>
                <button className={`hover:text-brand-600 ${route==='people'?'text-brand-600 font-medium':''}`} onClick={() => setRoute('people')}>People</button>
                <button className={`hover:text-brand-600 ${route==='giving'?'text-brand-600 font-medium':''}`} onClick={() => setRoute('giving')}>Giving</button>
                <button className={`hover:text-brand-600 ${route==='reports'?'text-brand-600 font-medium':''}`} onClick={() => setRoute('reports')}>Reports</button>
                <button className="ml-4 hover:text-brand-600" onClick={logout}>Logout</button>
              </>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="container-px mx-auto py-10 grid">
        {!token ? (
          <div className="place-self-center"><Login /></div>
        ) : route === 'people' ? (
          <PeoplePage />
        ) : route === 'giving' ? (
          <GivingPage />
        ) : (
          <ReportsPage />
        )}
      </main>

      <footer className="py-10 text-center text-sm text-neutral-500">© {new Date().getFullYear()} TIMA</footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}
