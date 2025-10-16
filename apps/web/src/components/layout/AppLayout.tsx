import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navLinks = [
  { to: '/people', label: 'People' },
  { to: '/giving', label: 'Giving' },
  { to: '/reports', label: 'Reports' },
]

export function AppLayout() {
  const { logout } = useAuth()
  return (
    <div className="min-h-dvh">
      <header className="border-b border-neutral-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/70 backdrop-blur">
        <div className="container-px mx-auto flex h-14 items-center justify-between">
          <div className="font-semibold tracking-tight">TIMA</div>
          <nav className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `hover:text-brand-600 transition-colors ${isActive ? 'text-brand-600 font-semibold' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button className="text-sm hover:text-brand-600" onClick={logout}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container-px mx-auto py-10">
        <Outlet />
      </main>

      <footer className="py-10 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} TIMA
      </footer>
    </div>
  )
}
