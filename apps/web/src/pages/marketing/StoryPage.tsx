const timeline = [
  { year: '2012', text: 'Our founding team launched TIMA to help a handful of churches replace spreadsheets with ministry-first software.' },
  { year: '2016', text: 'Introduced online giving and check-in, serving hundreds of congregations across North America.' },
  { year: '2019', text: 'Expanded worship planning, volunteer scheduling, and multi-campus capabilities.' },
  { year: '2023', text: 'Rolled out the TIMA Church OS platform—modern UI, automations, and deep integrations inspired by ChurchTrac customers.' },
]

export default function MarketingStoryPage() {
  return (
    <div className="space-y-20 pb-20">
      <section className="border-b border-neutral-200/60 bg-white/80 py-20 dark:border-neutral-900/80 dark:bg-neutral-950/80">
        <div className="container-px mx-auto max-w-3xl space-y-6 text-center">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">Built by church leaders, backed by technology pros.</h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            We are musicians, pastors, administrators, and developers who spent years serving in local churches. TIMA Church OS is a continuation of that calling—giving every ministry a platform that supports discipleship and growth.
          </p>
        </div>
      </section>

      <section className="container-px mx-auto grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Why we exist</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Church leaders deserve tools that are affordable, intuitive, and ministry-savvy. Inspired by ChurchTrac’s legacy, we set out to modernize the experience while keeping the same heart: serving the local church.
          </p>
          <p className="text-neutral-600 dark:text-neutral-300">
            Today TIMA powers congregations of every size—from church plants to multi-site movements. Our mission is to get technology out of the way so you can focus on people and the mission.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Milestones</h3>
          <ul className="mt-4 space-y-4">
            {timeline.map((item) => (
              <li key={item.year} className="flex gap-4">
                <span className="text-sm font-semibold text-brand-600">{item.year}</span>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-px mx-auto card bg-gradient-to-r from-brand-600 to-brand-500 p-10 text-white">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-2xl font-semibold">We’re committed to the long haul.</h3>
            <p className="mt-2 text-white/80">
              Our roadmap is guided by customer churches and a council of pastors. Expect frequent updates, transparent communication, and resources that equip your staff and volunteers.
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/80">
            <p>✓ Quarterly product webinars</p>
            <p>✓ Ministry playbooks for growth, assimilation, worship, and generosity</p>
            <p>✓ Regional meet-ups and coaching intensives</p>
          </div>
        </div>
      </section>
    </div>
  )
}
