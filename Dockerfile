# syntax=docker/dockerfile:1.7
# CareAI — Next.js 15 Multi-Stage Production Image
# Base → Deps → Builder → Runner (non-root).

ARG NODE_VERSION=20-alpine

# ------------------------------------------------------------------
FROM node:${NODE_VERSION} AS base
RUN apk add --no-cache libc6-compat tini
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# ------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --include=dev --no-audit --no-fund

# ------------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build with standalone output for smallest runtime image.
RUN npm run build \
    && npm prune --omit=dev --no-audit --no-fund

# ------------------------------------------------------------------
FROM base AS runner
ENV PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

# Non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -u 1001 -S careai -G nodejs

WORKDIR /app

# Standalone build output (Next.js 15)
COPY --from=builder --chown=careai:nodejs /app/public ./public
COPY --from=builder --chown=careai:nodejs /app/.next/standalone ./
COPY --from=builder --chown=careai:nodejs /app/.next/static ./.next/static

# Run migrations at container start if DATABASE_URL points to Postgres.
COPY --from=builder --chown=careai:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=careai:nodejs /app/scripts/deploy ./scripts/deploy

USER careai
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
