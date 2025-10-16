import { Link } from 'react-router-dom'

const featureCards = [
  {
    title: 'Church Connect',
    items: ['Free church website', 'Church app & online giving', 'Member portal'],
  },
  {
    title: 'Contributions & online giving',
    items: ['Online donations', 'Text giving', 'Contribution statements'],
  },
  {
    title: 'Accounting & budgeting',
    items: ['Bank syncing', 'Create budgets', 'Print checks'],
  },
  {
    title: 'Calendar & attendance',
    items: ['Event registrations', 'Track attendance', 'Manage calendar'],
  },
  {
    title: 'Automate admin tasks',
    items: ['Automate tasks', 'Send reports', 'Message your church'],
  },
  {
    title: 'People & member management',
    items: ['Church directory', 'Send mass email', 'Text your church'],
  },
  {
    title: 'Check-in & security',
    items: ['Record allergies', 'Print name tags', 'Text parents'],
  },
  {
    title: 'Worship planning & scheduling',
    items: ['Create service outlines', 'Import from SongSelect', 'Schedule teams'],
  },
]

const platformHighlights = [
  'Secure church database',
  'Keep your ministry organized',
  'Automate church admin tasks',
  'Simplify event planning and attendance',
  'Affordable for churches of all sizes',
  'Simplify church finances - easier than QuickBooks, better than spreadsheets',
]

const valueProps = [
  'Affordable all-included plans with no hidden fees',
  'Combines multiple apps into one simple platform',
  'Easy-to-use, even for tech-challenged volunteers',
  'Best-in-business support',
  'Weekly live training workshops',
  'Includes website, app, and member portal',
  'Trusted by thousands of churches since 2002',
  'Weekly updates with regular new feature releases',
]

const leaderRoles = [
  'Senior Pastor',
  'Church Admin',
  'Church Treasurer',
  'Worship Leader',
  "Kid's Ministry",
  'Communications',
  'Pastoral Staff',
  'Group Leader',
]

const demoCredentials = {
  email: 'demo@tima.church',
  password: 'TryTIMA!24',
}

export default function MarketingFeaturesPage() {
  return (
    <div className="space-y-20 pb-20">
      <section className="border-b border-neutral-200/60 bg-white/80 py-20 dark:border-neutral-900/80 dark:bg-neutral-950/80">
        <div className="container-px mx-auto text-center space-y-4">
          <span className="inline-flex rounded-full bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700 dark:bg-brand-900/30">
            Features
          </span>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50 sm:text-4xl">
            Your all-in-one church donation software.
          </h1>
          <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-300">
            TIMA brings together giving, accounting, communication, and ministry tools so you can replace spreadsheets and siloed apps with one connected system.
          </p>
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card) => (
            <div key={card.title} className="card h-full p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{card.title}</h2>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="card grid gap-6 p-8 md:grid-cols-2">
          {platformHighlights.map((highlight) => (
            <div key={highlight} className="flex gap-3 text-neutral-600 dark:text-neutral-300">
              <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Why churches choose TIMA</h2>
          <ul className="mt-4 grid gap-3 text-sm text-neutral-600 dark:text-neutral-300 md:grid-cols-2">
            {valueProps.map((value) => (
              <li key={value} className="flex gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-500" />
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="card p-10">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Built for every church leader</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            Equip pastors, admins, and volunteers with views tailored to their responsibilities.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-neutral-600 dark:text-neutral-300 sm:grid-cols-2 lg:grid-cols-4">
            {leaderRoles.map((role) => (
              <span key={role} className="rounded-full border border-neutral-200 px-3 py-1 text-center dark:border-neutral-800">
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="card bg-gradient-to-r from-brand-600 to-brand-700 p-10 text-white">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl font-semibold">See TIMA in action.</h3>
              <p className="mt-2 text-white/80">
                Schedule a live walkthrough or jump into the sandbox with our shared demo account to explore the full platform.
              </p>
              <div className="mt-6 rounded-lg bg-white/10 p-4 text-sm backdrop-blur">
                <p className="font-medium text-white">Demo sandbox login</p>
                <p className="mt-2 text-white/80">
                  Email: <span className="font-mono">{demoCredentials.email}</span>
                </p>
                <p className="text-white/80">
                  Password: <span className="font-mono">{demoCredentials.password}</span>
                </p>
                <p className="mt-3 text-xs text-white/70">
                  Tip: Reset the household data before presenting to keep the experience fresh for your team.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <a className="btn bg-white text-brand-600 hover:bg-brand-100" href="mailto:demo@tima.church">
                Book a demo
              </a>
              <Link className="btn btn-primary border border-white/20 bg-white/10 text-white hover:bg-white/20" to="/login">
                Launch sandbox
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
