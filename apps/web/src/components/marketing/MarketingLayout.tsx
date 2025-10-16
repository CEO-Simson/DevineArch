import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/story', label: 'Our Story' },
]

export function MarketingLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-950 dark:to-black">
      <header className="sticky top-0 z-30 border-b border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-neutral-950/80 backdrop-blur">
        <div className="container-px mx-auto flex h-16 items-center justify-between">
          <NavLink to="/" className="text-xl font-semibold tracking-tight text-brand-700" onClick={() => setMenuOpen(false)}>
            TIMA Church OS
          </NavLink>
          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-600 dark:text-neutral-300">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }: { isActive: boolean }) =>
                  `transition-colors hover:text-brand-600 ${isActive ? 'text-brand-600 font-semibold' : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <NavLink to="/login" className="text-neutral-600 hover:text-brand-600 dark:text-neutral-300" onClick={() => setMenuOpen(false)}>
              Login
            </NavLink>
            <NavLink
              to="/login"
              className="btn btn-primary shadow-sm shadow-brand-500/20"
              onClick={() => setMenuOpen(false)}
            >
              Start Free Trial
            </NavLink>
          </div>
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-neutral-600"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
        {menuOpen ? (
          <div className="md:hidden border-t border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-neutral-950">
            <nav className="container-px mx-auto py-4 space-y-4 text-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }: { isActive: boolean }) =>
                    `block ${isActive ? 'text-brand-600 font-semibold' : 'text-neutral-600 dark:text-neutral-300'}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex gap-3 pt-2">
                <NavLink to="/login" className="btn flex-1" onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/login" className="btn-primary flex-1" onClick={() => setMenuOpen(false)}>
                  Start Trial
                </NavLink>
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/60 backdrop-blur">
        <div className="container-px mx-auto py-10 text-sm text-neutral-500">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-200">TIMA Church OS</p>
              <p className="mt-2 text-sm">All-in-one church management software for people, giving, worship, and more.</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-200">Explore</p>
              <ul className="mt-2 space-y-1">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} className="hover:text-brand-600">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <NavLink to="/login" className="hover:text-brand-600">
                    Login
                  </NavLink>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-200">Contact</p>
              <ul className="mt-2 space-y-1">
                <li>Email: hello@tima.church</li>
                <li>Support: weekdays 9a–6p EST</li>
                <li>20000+ churches served worldwide</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-xs">© {new Date().getFullYear()} TIMA Church OS. Crafted for ministry teams of every size.</p>
        </div>
      </footer>
    </div>
  )
}
