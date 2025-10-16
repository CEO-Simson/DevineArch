import { Link } from 'react-router-dom'

const pricingTiers = [
  {
    name: 'Starter',
    price: '$26',
    churchSize: 'up to 125 people',
    description: 'Perfect for church plants and revitalization projects launching their systems.',
    features: ['All core modules included', 'Unlimited users & volunteer accounts', 'Online & text giving', 'Free data import'],
  },
  {
    name: 'Growth',
    price: '$39',
    churchSize: 'up to 250 people',
    description: 'Adds deeper automations, additional workflows, and advanced check-in capabilities.',
    features: ['Everything in Starter', 'Workflow automations & smart lists', 'Multi-event registrations', 'Priority chat support'],
    highlight: true,
  },
  {
    name: 'Multiply',
    price: '$55',
    churchSize: '1000 people included',
    description: 'Multi-campus ready with advanced reporting, accounting sync, and API access.',
    features: ['Dedicated success manager', 'Fund accounting + QuickBooks sync', 'Custom domains & themes', 'Open API & webhooks'],
  },
]

const faqs = [
  {
    q: 'Is there a contract or setup fee?',
    a: 'No. Plans are month-to-month with simple pricing. We include migration and onboarding at no additional cost.',
  },
  {
    q: 'Can we upgrade or downgrade later?',
    a: 'Yes. Change plans at any time as your church grows. Your data, customizations, and automations stay intact.',
  },
  {
    q: 'Do you support multi-campus churches?',
    a: 'Absolutely. Campus filtering, campus-level dashboards, and permission sets are included on Growth and Multiply.',
  },
]

export default function MarketingPricingPage() {
  return (
    <div className="space-y-20 pb-20">
      <section className="border-b border-neutral-200/60 bg-white/80 py-20 text-center dark:border-neutral-900/70 dark:bg-neutral-950/80">
        <div className="container-px mx-auto space-y-4">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50 sm:text-4xl">
            Simple, transparent pricing for churches of every size.
          </h1>
          <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-300">
            Every plan includes people, giving, check-in, worship planning, scheduling, reporting, and the member portal. No hidden fees, no modules to unlock later.
          </p>
        </div>
      </section>

      <section className="container-px mx-auto">
        <div className="grid gap-8 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`card h-full p-8 transition ${tier.highlight ? 'ring-2 ring-brand-500 shadow-lg shadow-brand-500/20' : 'hover:-translate-y-1 hover:shadow-lg'}`}
            >
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{tier.name}</h2>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-900/30">
                  {tier.churchSize}
                </span>
              </div>
              <p className="mt-6 text-4xl font-semibold text-neutral-900 dark:text-neutral-50">{tier.price}<span className="text-base font-normal text-neutral-500">/mo</span></p>
              <p className="mt-3 text-sm text-neutral-500">{tier.description}</p>
              <ul className="mt-8 space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700" to="/login">
                Start free trial
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container-px mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Need enterprise or denomination pricing?</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Our Multiply plan scales to large, multi-site churches and denominations. Add managed onboarding, dedicated CSM, and custom SLAs tailored to your network.
          </p>
          <a className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600" href="mailto:sales@tima.church">
            Connect with sales →
          </a>
        </div>
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Included in every plan</h3>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
            <li>✓ Unlimited people records, volunteers, and admin accounts</li>
            <li>✓ Free text and email credits for connection workflows</li>
            <li>✓ Online giving with industry-low processing fees (1.9% + 30¢)</li>
            <li>✓ Migration of people, giving, and groups from your current system</li>
            <li>✓ 24/7 help center, office hours, and ministry-specific training</li>
          </ul>
        </div>
      </section>

      <section className="container-px mx-auto grid gap-6 md:grid-cols-3">
        {faqs.map((faq) => (
          <div key={faq.q} className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{faq.q}</h3>
            <p className="mt-2 text-sm text-neutral-500">{faq.a}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
