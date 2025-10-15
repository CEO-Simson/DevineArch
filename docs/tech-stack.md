# Tech Stack & Tooling

- Language: TypeScript (frontend + backend)
- Frontend: Next.js 15, App Router, Tailwind CSS, shadcn/ui, TanStack Query, Zod, Playwright (e2e)
- Backend: NestJS 11, REST + WebSocket, Prisma ORM, BullMQ (Redis), Jest + Supertest
- Database: PostgreSQL 16, pgvector (future semantic search), RLS, Prisma Migrate
- Cache/Queues: Redis 7
- Email/SMS: Postmark/SES, Twilio (Phase 2)
- Payments: Stripe (donations + subscriptions) (Phase 2)
- Infra: Docker, docker-compose, Terraform for AWS
- CI/CD: GitHub Actions (lint, typecheck, tests, build, deploy); Dependabot
- Quality: ESLint, Prettier, Husky + lint-staged, Conventional Commits

## Repo Structure (Monorepo)
- `apps/web` — Next.js app (admin + portal)
- `apps/api` — NestJS API server
- `packages/ui` — shared UI components
- `packages/config` — ESLint/Prettier/tsconfig
- `packages/types` — shared types & Zod schemas
- `infra/` — Terraform + deployment scripts
- `docs/` — product, architecture, and runbooks

## Environments
- Local: docker-compose with seeded data
- Preview: PR environments (web on Vercel or container), API on staging cluster
- Staging: mirrors prod with guardrails; sample billing providers in test mode
- Production: AWS (RDS, ECS Fargate, S3, CloudFront, SES)
