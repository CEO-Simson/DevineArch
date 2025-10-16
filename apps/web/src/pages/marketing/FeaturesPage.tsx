import { Link } from 'react-router-dom'

const featureCategories = [
  {
    name: 'People & Engagement',
    description: 'Pastoral care, groups, follow-up, and communications built to shepherd your entire congregation.',
    items: [
      'Households with custom fields and timeline notes',
      'Smart lists for workflows, texts, and emails',
      'Built-in forms for prayer requests, guest cards, serving',
      'Attendance dashboards for campuses and ministries',
    ],
  },
  {
    name: 'Giving & Finance',
    description: 'A unified generosity stack that connects pledges, deposits, accounting, and reporting.',
    items: [
      'Recurring, text, and kiosk giving options',
      'Fund accounting with budgets and approvals',
      'Deposits tied directly to accounting and statements',
      'Donor portal with contribution history and tax receipts',
    ],
  },
  {
    name: 'Services & Volunteers',
    description: 'Plan gatherings, schedule volunteers, and resource your worship team without spreadsheets.',
    items: [
      'Service plans with drag-and-drop elements and cues',
      'Song library with keys, arrangements, and chord charts',
      'Volunteer scheduling with availability and reminders',
      'Check-in kiosks with label printing and guardian codes',
    ],
  },
  {
    name: 'Member Experience',
    description: 'A branded portal that lets people give, register, view statements, and update household info.',
    items: [
      'Mobile-first portal and app shell',
      'Event registrations with payments & capacity management',
      'Self-service profile updates & directory preferences',
      'Shareable landing pages for campaigns and announcements',
    ],
  },
]

const automationHighlights = [
  {
    title: 'Automations',
    text: 'Trigger workflows when someone gives, attends, or submits a form. Assign tasks, send emails, and keep ministry teams accountable.',
  },
  {
    title: 'Reporting Studio',
    text: 'Build dashboards with giving, attendance, and engagement metrics. Schedule email reports to pastors and board members.',
  },
  {
    title: 'Open Integrations',
    text: 'Link Stripe, Planning Center imports, ProPresenter, Mailchimp, and more. REST API and webhooks for custom automations.',
  },
]

export default function MarketingFeaturesPage() {
  return (
    <div className="space-y-20 pb-20">
      <section className="border-b border-neutral-200/60 bg-white/80 py-20 dark:border-neutral-900/80 dark:bg-neutral-950/80">
        <div className="container-px mx-auto text-center space-y-4">
          <span className="inline-flex rounded-full bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700 dark:bg-brand-900/30">
            Product Overview
          </span>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50 sm:text-4xl">
            Every ministry lane in a single, connected platform.
          </h1>
          <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-300">
            TIMA Church OS mirrors the reach of ChurchTrac’s proven modules—now delivered with a refreshed experience, deeper automation, and multi-campus readiness.
          </p>
        </div>
      </section>

      <section className="container-px mx-auto space-y-16">
        {featureCategories.map((category) => (
          <div key={category.name} className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{category.name}</h2>
              <p className="mt-3 text-neutral-600 dark:text-neutral-300">{category.description}</p>
            </div>
            <div className="card p-6">
              <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                {category.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <section className="container-px mx-auto">
        <div className="card grid gap-8 p-8 lg:grid-cols-3">
          {automationHighlights.map((highlight) => (
            <div key={highlight.title}>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{highlight.title}</h3>
              <p className="mt-2 text-sm text-neutral-500">{highlight.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="card bg-gradient-to-r from-brand-600 to-brand-700 p-10 text-white">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl font-semibold">See TIMA in action.</h3>
              <p className="mt-2 text-white/80">
                Schedule a live demo tailored to your ministry or explore the sandbox site to click around immediately.
              </p>
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
