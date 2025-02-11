# Build stage
FROM --platform=linux/amd64 node:19-bullseye-slim AS builder

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

# Production stage
FROM --platform=linux/amd64 node:19-bullseye-slim

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 33896

ENV PORT 33896
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
