import { Link } from 'react-router-dom'

const featureHighlights = [
  {
    title: 'People & Groups',
    description: 'Profiles, households, smart lists, and pathways keep every relationship organized.',
    points: ['Households and custom fields', 'Smart lists & follow-up workflows', 'Attendance and group insights'],
  },
  {
    title: 'Giving & Pledges',
    description: 'Track offline and online generosity with deposits, statements, and fund designations.',
    points: ['Unlimited funds & campaigns', 'Recurring and text-to-give ready', 'Year-end statements in minutes'],
  },
  {
    title: 'Check-In & Safety',
    description: 'Secure child check-in with kiosk mode, name badges, and guardian codes built-in.',
    points: ['Touch-friendly kiosks', 'Medical notes & allergies', 'Real-time attendance dashboards'],
  },
  {
    title: 'Worship & Volunteers',
    description: 'Plan services, schedule teams, and distribute chord charts from a single source of truth.',
    points: ['Drag-and-drop service plans', 'Song library with keys & arrangements', 'Volunteer scheduling & reminders'],
  },
  {
    title: 'Accounting & Reporting',
    description: 'Fund accounting that ties directly to giving, budgets, and approval workflows.',
    points: ['Chart of accounts & budgets', 'Bank reconciliation & exports', 'Dashboards with live KPIs'],
  },
  {
    title: 'Member Portal',
    description: 'Give your church a branded portal to register, give, and stay in the loop anywhere.',
    points: ['Mobile-first portal experience', 'Online forms and event registrations', 'Self-service profiles & statements'],
  },
]

const metrics = [
  { label: 'Churches served', value: '20,000+' },
  { label: 'Volunteer hours saved', value: '4.6M+' },
  { label: 'Average launch time', value: '10 days' },
  { label: 'Customer satisfaction', value: '98%' },
]

const testimonials = [
  {
    quote:
      'We launched TIMA in a single weekend. The team imported our people, set up online giving, and our staff actually loves using it.',
    author: 'Pastor Renee — Hope City Church',
  },
  {
    quote:
      'The worship planner and smart lists keep every campus aligned. It feels like TIMA was built specifically for our church.',
    author: 'Marcus, Executive Pastor',
  },
]

export default function MarketingHomePage() {
  return (
    <div className="space-y-24 pb-20">
      <section className="relative overflow-hidden border-b border-neutral-200/60 dark:border-neutral-900/80 bg-gradient-to-br from-brand-50 via-white to-transparent dark:from-brand-900/20 dark:via-neutral-950 dark:to-black">
        <div className="container-px mx-auto py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-brand-700 shadow-sm shadow-brand-500/20 dark:bg-neutral-900/80">
                <span className="h-2 w-2 rounded-full bg-brand-500" /> Church Management, modernized
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
                All-in-one church software that feels ministry-ready from day one.
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300">
                TIMA Church OS helps your team care for people, grow generosity, and coordinate Sundays without juggling a dozen tools.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link className="btn btn-primary sm:min-w-[180px]" to="/login">
                  Start free 30-day trial
                </Link>
                <Link className="btn border border-neutral-300 bg-white text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200" to="/features">
                  Explore all features
                </Link>
              </div>
              <div className="flex flex-wrap gap-8 pt-4 text-sm text-neutral-500">
                <div>
                  <p className="font-semibold text-neutral-700 dark:text-neutral-100">Ministry-first onboarding</p>
                  <p>Concierge data migration & training</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-700 dark:text-neutral-100">Transparent pricing</p>
                  <p>No add-on fees or contracts</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="mx-auto max-w-xl rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl shadow-brand-500/10 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Everything in one place</p>
                <ul className="mt-4 space-y-4 text-neutral-700 dark:text-neutral-200">
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg">①</span>
                    Launch people & groups in minutes
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg">②</span>
                    Accept online, text, and in-person giving
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg">③</span>
                    Plan services, schedule volunteers, print labels
                  </li>
                </ul>
                <div className="mt-8 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white shadow-lg">
                  <p className="text-sm uppercase tracking-widest text-white/70">Launch bundle</p>
                  <p className="mt-2 text-2xl font-semibold">Concierge migration, staff training, donor import included.</p>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-10 -top-10 hidden h-32 w-32 rounded-full bg-brand-200 blur-3xl lg:block" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="grid gap-6 rounded-2xl bg-white/90 p-6 shadow-sm shadow-brand-500/10 dark:bg-neutral-900/80 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="border-l border-neutral-200/70 pl-6 first:border-none first:pl-0 dark:border-neutral-800/70">
              <p className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">{metric.value}</p>
              <p className="text-sm text-neutral-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">Purpose-built tools for every ministry lane</h2>
          <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-300">
            TIMA brings the core ChurchTrac-style modules together with a modern workflow so your staff and volunteers stay aligned.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featureHighlights.map((feature) => (
            <div key={feature.title} className="card h-full p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{feature.title}</h3>
              <p className="mt-2 text-sm text-neutral-500">{feature.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                {feature.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="text-brand-500">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container-px mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">Launch with a team that understands ministry rhythms.</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Your launch specialist handles data import, configures permissions, and hosts live workshops with your staff. After launch, you get unlimited support from people who actually serve in local churches.
          </p>
          <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
            <li>✓ Free migration of people, donors, and giving history</li>
            <li>✓ Volunteer onboarding toolkit & template library</li>
            <li>✓ Office hours, webinars, and a fully searchable knowledge base</li>
          </ul>
        </div>
        <div className="relative">
          <div className="h-full w-full rounded-3xl border border-brand-200/40 bg-gradient-to-br from-brand-100 via-white to-brand-50 p-6 shadow-lg dark:from-brand-500/10 dark:via-neutral-900 dark:to-neutral-900">
            <div className="rounded-2xl bg-white/90 p-6 shadow-inner dark:bg-neutral-950/80">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-brand-600">Launch Timeline</p>
                <p className="text-xs text-neutral-500">Avg. 10-day rollout</p>
              </div>
              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100">Day 1</p>
                  <p className="text-neutral-500">Kickoff call & data gathering</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100">Day 4</p>
                  <p className="text-neutral-500">System configured, permissions & automations</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100">Day 7</p>
                  <p className="text-neutral-500">Staff training + volunteer toolkit</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100">Day 10</p>
                  <p className="text-neutral-500">Go live with smart lists, giving, and check-in</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.author} className="card h-full p-6">
              <blockquote className="text-lg text-neutral-700 dark:text-neutral-100">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-4 text-sm font-medium text-neutral-500">{testimonial.author}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="card overflow-hidden border-0 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 p-10 text-white shadow-xl">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-3xl font-semibold">Your ministry deserves software that serves you back.</h3>
              <p className="mt-3 text-white/80">
                Join thousands of churches using TIMA Church OS to disciple people, steward generosity, and lead teams with clarity.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <Link className="btn bg-white text-brand-600 hover:bg-brand-100" to="/pricing">
                See pricing
              </Link>
              <Link className="btn btn-primary border border-white/20 bg-white/10 text-white hover:bg-white/20" to="/login">
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
