# Local Development Runbook (Initial)

Prereqs: Node 20+, pnpm 9+, Docker Desktop, Git, gh CLI.

- Clone & setup
  - `git clone <this repo>`
  - `pnpm i` (after monorepo scaffolding)

- Start services (once scaffolded)
  - `docker compose up -d db redis mailhog`
  - `pnpm --filter @apps/api dev`
  - `pnpm --filter @apps/web dev`

- Environment variables
  - Copy `.env.example` to `.env` in each app
  - Provide DB URLs, Redis URL, mail sender (dev uses MailHog)

- Testing
  - `pnpm test` (unit), `pnpm e2e` (end-to-end)

- Common issues
  - Prisma migration drift → `prisma migrate reset --force` (dev only)
  - Containers not starting → check Docker Desktop resources
