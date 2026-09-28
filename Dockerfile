# --- Stage 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl \
  && corepack enable \
  && corepack prepare pnpm@10.30.3 --activate

# Build-time public values (SITE_URL, R2_PUBLIC_BASE_URL) come from the committed .env.production.
ENV NEXT_TELEMETRY_DISABLED=1

# prisma/ is needed by the postinstall `prisma generate`
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# --- Stage 2: Production ---
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl \
  && corepack enable \
  && corepack prepare pnpm@10.30.3 --activate

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PRISMA_HIDE_UPDATE_MESSAGE=1 PATH=/app/node_modules/.bin:$PATH

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --prod --frozen-lockfile

# node owns .next so Next can write its image/ISR cache at runtime
COPY --from=builder --chown=node:node /app/.next ./.next
COPY public ./public
COPY scripts ./scripts
COPY next.config.ts docker-entrypoint.sh ./

USER node
EXPOSE 3000

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
