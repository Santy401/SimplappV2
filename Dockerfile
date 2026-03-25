FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN apk update

COPY . .
RUN pnpm install

RUN echo "Combining Prisma schemas..." && \
    mkdir -p apps/web/prisma/src/generated/prisma && \
    cat apps/web/prisma/schema/base.prisma > apps/web/prisma/src/generated/prisma/schema.prisma && \
    for f in apps/web/prisma/schema/*.prisma; do \
      [ "$(basename "$f")" = "base.prisma" ] && continue; \
      echo "" >> apps/web/prisma/src/generated/prisma/schema.prisma; \
      cat "$f" >> apps/web/prisma/src/generated/prisma/schema.prisma; \
    done && \
    sed -i 's|output     = "../src/generated/prisma"|output     = "./"|' apps/web/prisma/src/generated/prisma/schema.prisma && \
    echo "Schema combined successfully"

RUN npx prisma generate --schema=apps/web/prisma/src/generated/prisma/schema.prisma

ENV USE_STANDALONE=true
WORKDIR /app
RUN pnpm turbo build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
