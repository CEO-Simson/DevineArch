# Production image for API
FROM node:20-alpine AS base
WORKDIR /app

# Expect repo root as build context
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

COPY apps/api apps/api
COPY tsconfig.base.json tsconfig.base.json

RUN pnpm -C apps/api install --prod --frozen-lockfile || pnpm -C apps/api install --prod
RUN pnpm -C apps/api build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/package.json ./package.json
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate && pnpm install --prod --frozen-lockfile || pnpm install --prod
EXPOSE 4000
CMD ["node", "dist/server.js"]
