# Deployment Guide

## Frontend (Vercel)
- Create a new Vercel project, import from GitHub, set root to `apps/web`.
- Framework preset: Vite.
- Env vars: `VITE_API_URL` pointing to your backend URL.
- Build command: `pnpm --filter @tima/web build`
- Output directory: `apps/web/dist` (Vercel auto-detects for Vite; alternatively set project root).

## Backend (Render)
- New Web Service → Connect your repo → root: `apps/api`.
- Runtime: Node 20; Build command: `pnpm i --frozen-lockfile && pnpm --filter @tima/api build`.
- Start command: `node dist/server.js`.
- Env vars: from `apps/api/.env.example` (`PORT`, `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`).
- Add a MongoDB (Render add-on) or MongoDB Atlas; set `MONGO_URI` accordingly.

## Backend (AWS, optional)
- Use ECS Fargate + ALB; create Dockerfile in `apps/api`.
- Use AWS Secrets Manager for env secrets; R53 + ACM for TLS; CloudWatch logs.
- Infra as code with Terraform in `infra/` (to be added).

## CI/CD
- GitHub Actions: build and test on PR; deploy on merge to `main`.
- Vercel connects directly via Git integration; Render can auto-deploy on push.
