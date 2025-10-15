# Production Checklist

1. Architecture & Code Quality
- Clear module boundaries; shared types; strict TS; lint + format pre-commit

2. Frontend (React + TS + TailwindCSS)
- Accessible components (ARIA), keyboard nav, color contrast; responsive layouts; lazy loading routes

3. Backend (Node.js + Express + TypeScript)
- Layered: routes/controllers/services; centralized error handler; validation with Zod; logging

4. Database (MongoDB + Mongoose)
- Schemas with validation + indexes; lean reads; backup & retention plan

5. Security
- JWT rotation/expiry; HTTPS everywhere; Helmet; rate limiting; input validation; secrets management

6. Performance & Reliability
- Caching where appropriate; connection pooling; health checks; readiness/liveness probes

7. CI/CD & Deployment
- Build + test pipelines; preview envs; automated deploy on main; versioned releases

8. Monitoring & Observability
- Structured logs; error tracking; metrics + dashboards; alerts on SLOs

9. DevOps & Infrastructure
- IaC (Terraform); Docker images; environment parity (dev/stage/prod); cost visibility

10. Documentation & Handoff
- Runbooks; architecture decisions; API docs (OpenAPI); onboarding guide
