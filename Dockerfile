FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Dependencies stage - this will be cached unless package files change
FROM base AS deps
WORKDIR /usr/src/app

# Copy only package files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/gateway/package.json ./apps/gateway/
COPY packages/client/package.json ./packages/client/
COPY packages/mqtt-envelope/package.json ./packages/mqtt-envelope/

# Install all dependencies (including dev dependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build stage - depends on deps
FROM deps AS build
COPY . .
ENV PLT_SERVER_LOGGER_LEVEL=info
ENV NODE_ENV=production
RUN pnpm --filter @brocabs/mqtt-envelope build
RUN pnpm build

# Runtime stage - minimal final image
FROM base AS runtime
WORKDIR /usr/src/app

# Copy production dependencies only
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/gateway/package.json ./apps/gateway/
COPY packages/client/package.json ./packages/client/
COPY packages/mqtt-envelope/package.json ./packages/mqtt-envelope/

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

# Copy built artifacts from build stage
COPY --from=build /usr/src/app/apps/api/dist ./apps/api/dist
COPY --from=build /usr/src/app/packages/mqtt-envelope/dist ./packages/mqtt-envelope/dist
COPY --from=build /usr/src/app/apps/web/.output ./apps/web/.output
COPY --from=build /usr/src/app/apps/api/watt.json ./apps/api/watt.json
COPY apps/api/docker-migrate.sh ./apps/api/docker-migrate.sh
RUN chmod +x ./apps/api/docker-migrate.sh
COPY --from=build /usr/src/app/apps/gateway/watt.json ./apps/gateway/watt.json
COPY --from=build /usr/src/app/apps/web/watt.json ./apps/web/watt.json
COPY --from=build /usr/src/app/watt.json ./watt.json

# Set ownership to node user for security
RUN chown -R node:node /usr/src/app
USER node

# Health check using node (removes curl dependency)
HEALTHCHECK --interval=30s --timeout=10s --retries=5 \
  CMD node -e "require('http').get('http://localhost:9090/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1)).on('error', () => process.exit(1))"

EXPOSE 3042 9090
CMD [ "pnpm", "run", "start" ]