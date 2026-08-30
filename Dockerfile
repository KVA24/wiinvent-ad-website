# dev_* and prod_* tags each build their own image. SITE_URL feeds the
# prerendered canonicals/sitemap so it is a build arg; PORT is runtime.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
ARG SITE_URL=https://ad.wiinvent.tv
ENV SITE_URL=$SITE_URL NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:${PORT}/robots.txt >/dev/null || exit 1
CMD ["node", "server.js"]
