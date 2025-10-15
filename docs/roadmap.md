# Delivery Roadmap

Assumes 2-week sprints, core team of 3–5 devs + 1 designer/PM.

## Sprint 0 – Foundations
- Monorepo setup (pnpm/turbo), apps `web`/`api`, shared packages
- Auth (email/pass, org creation, roles), tenancy plumbing (RLS)
- Base UI shell, design system, CI/CD, dev/staging envs

## Sprints 1–2 – People & Giving (MVP)
- People: households, profiles, tags/smart lists, CSV import
- Groups + attendance capture and basic reporting
- Giving offline: funds, pledges, batches, deposits, statements
- Email basics: transactional emails + simple campaigns

## Sprints 3–4 – Events & Admin
- Events calendar (list/month), attendance integration
- Audit log, org settings, export (CSV), basic dashboards
- Hardening: permissions, RLS tests, rate limits, error tracking

MVP Release (end of Sprint 4)
- Onboard pilot churches (5–10), support & feedback loop

## Phase 2 (Sprints 5–8)
- Online giving (Stripe), recurring, donor portal, statements
- SMS (Twilio), forms & registrations, PWA member portal
- Check‑in: sessions, kiosk mode, browser printing (where possible)

## Phase 3 (Sprints 9–12)
- Worship planning (songs, plans, volunteers), service run‑sheet
- Fund accounting (chart, ledger, budgets), deposits integration
- Resource management (rooms/equipment), conflict detection

## Ongoing
- Advanced reports, integrations, performance, accessibility, localization
- Security reviews, backups drills, SLOs, cost optimization
