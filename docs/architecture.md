# System Architecture

A multi‑tenant SaaS built with TypeScript across the stack for speed, maintainability, and hiring leverage.

- Frontend: `Next.js` (App Router) + TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zod
- Backend: `NestJS` (TypeScript) modular monolith, REST + WebSocket/SSE, background jobs with BullMQ
- Data: `PostgreSQL` (RLS for multi‑tenant isolation) + Prisma ORM; Redis for cache/queues
- Files: S3‑compatible storage (AWS S3) for attachments, exports, label templates
- Email/SMS: Postmark or AWS SES for email; Twilio/Vonage for SMS (Phase 2)
- Payments: Stripe for online giving + subscription billing (Phase 2)
- Realtime: WebSocket gateway for check‑in sessions, kiosk presence, notifications
- Observability: OpenTelemetry, Sentry, structured logs (pino), metrics (Prometheus)

## Multi‑Tenancy Strategy
- Tenant = Organization (church). Optional `campus` level beneath tenant.
- Use PostgreSQL Row‑Level Security (RLS) with `tenant_id` on all tenant tables.
- On auth, set `app.current_tenant` (via Postgres `SET LOCAL` or Prisma middleware); enforce policies per role.
- Migration model compatible with RLS and seed scripts; use database-level constraints for safety.

## Security & Compliance
- JWT + refresh tokens with device/session tracking; optional 2FA (TOTP)
- Least‑privilege RBAC: Owner, Admin, Staff, Volunteer, Member
- PII encryption at rest (field‑level for sensitive data), secrets in AWS Secrets Manager
- Backups with PITR on RDS; encrypted S3; audit logs (immutable append‑only table)
- GDPR/CCPA data export/delete flows; email/SMS consent and unsubscribe

## Deployment
- Local: Docker Compose (web, api, db, redis, mailhog)
- Prod: AWS (RDS Postgres, ElastiCache Redis, ECS Fargate, S3, CloudFront, SES)
- CI/CD: GitHub Actions with preview deployments; IaC via Terraform (infra/)

## Service Modules (Backend)
- `auth`: users/sessions/roles; org & campus context
- `people`: households, profiles, tags, groups, attendance
- `giving`: funds, pledges, batches, deposits, statements
- `comm`: email/SMS templates, campaigns, delivery logs
- `events`: calendar, services, registrations
- `checkin`: sessions, stations, labels, children/guardians
- `worship`: plans, songs, arrangements, volunteers
- `accounting`: chart, ledger, budgets, reconciliation
- `reports`: exports, dashboards; async job pipeline
- `admin`: imports, audit log, org settings, billing (Stripe)

## Kiosk & Printing
- Web kiosk (PWA) with offline queue; secure check‑in codes
- Label printing via WebUSB/WebHID (where supported) or companion desktop agent (Electron) for DYMO/Zebra
