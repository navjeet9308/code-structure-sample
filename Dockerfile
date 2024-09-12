FROM node:18-alpine AS builder
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo@1.5.5
COPY . .
RUN turbo prune --scope=@my-app/server --docker

# Add lockfile and package.json's of isolated subworkspace
# Add lockfile and package.json's of isolated subworkspace
FROM node:18-alpine AS installer
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/full/ .

COPY .gitignore .gitignore
COPY turbo.json turbo.json  
RUN yarn install
RUN yarn turbo run build --filter=@my-app/server...

FROM node:18-alpine AS runner
# ENV NODE_ENV=staging
WORKDIR /app

# Don't run production as root
# RUN addgroup --system --gid 1001 expressjs
# RUN adduser --system --uid 1001 expressjs
# USER expressjs
COPY --from=installer /app .
RUN mkdir -p apps/api/build/utils/logs
EXPOSE 8080
CMD node apps/api/build/index.js