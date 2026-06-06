FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY apps/web/package.json apps/web/package-lock.json* ./
RUN npm ci --silent

FROM deps AS builder
COPY apps/web/ ./
ARG OPENROUTER_API_KEY
ARG OPENROUTER_MODEL
ENV OPENROUTER_API_KEY=$OPENROUTER_API_KEY
ENV OPENROUTER_MODEL=$OPENROUTER_MODEL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/content ./content
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
