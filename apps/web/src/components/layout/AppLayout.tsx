import { NavLink, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'

const navLinks = [
  { to: '/app/people', label: 'People' },
  { to: '/app/giving', label: 'Giving' },
  { to: '/app/reports', label: 'Reports' },
]

export function AppLayout() {
  const { logout } = useAuth()
  const status = useQuery({
    queryKey: ['subscription-status'],
    queryFn: () => api<{ state: 'active'|'grace'|'expired'; daysRemaining?: number; daysPastDue?: number; graceDays: number }>(`/api/subscriptions/status`),
    staleTime: 60_000,
  })
  return (
    <div className="min-h-dvh flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/70 backdrop-blur">
        <div className="container-px mx-auto flex h-14 items-center justify-between">
          <NavLink to="/app/people" className="font-semibold tracking-tight text-brand-700">
            TIMA Admin
          </NavLink>
          <nav className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }: { isActive: boolean }) =>
                  `hover:text-brand-600 transition-colors ${isActive ? 'text-brand-600 font-semibold' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {status.data && status.data.state !== 'active' ? (
              <NavLink to="/app/billing" className={({isActive}) => `hover:text-brand-600 ${isActive ? 'text-brand-600 font-semibold' : ''}`}>Billing</NavLink>
            ) : null}
            <button className="text-sm hover:text-brand-600" onClick={logout}>
              Logout
            </button>
          </nav>
        </div>
        {status.data?.state === 'grace' ? (
          <div className="bg-yellow-50 text-yellow-900 border-t border-yellow-200">
            <div className="container-px mx-auto text-sm py-2">
              Subscription past due. {status.data.daysPastDue} days into 30‑day grace. Please <NavLink className="underline" to="/app/billing">make payment</NavLink>.
            </div>
          </div>
        ) : null}
      </header>

      <main className="container-px mx-auto py-10 flex-1">
        {status.data?.state === 'expired' ? (
          <div className="max-w-xl mx-auto card p-6 text-center">
            <h2 className="font-semibold text-lg">Account paused</h2>
            <p className="text-sm text-neutral-600 mt-2">Your subscription has expired. Please contact support or proceed to payment to restore access.</p>
            <div className="mt-4 flex justify-center gap-3">
              <a className="btn" href="mailto:support@tima.church">Contact Support</a>
              <NavLink className="btn btn-primary" to="/app/billing">Make Payment</NavLink>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <footer className="py-10 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} TIMA Church OS
      </footer>
    </div>
  )
}
