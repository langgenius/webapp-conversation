# Build stage
FROM --platform=linux/amd64 node:19-alpine AS deps

WORKDIR /app

# 只复制 package 文件
COPY package*.json ./

# 安装依赖，并清理缓存
RUN npm ci --only=production --no-audit && \
    npm cache clean --force

# Builder stage
FROM --platform=linux/amd64 node:19-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用
RUN npm run build && \
    rm -rf .next/cache

# Production stage
FROM --platform=linux/amd64 node:19-alpine AS runner
WORKDIR /app

# 安装生产环境必需的系统包
RUN apk add --no-cache bash curl

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 只复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 复制启动脚本
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 清理和优化
RUN rm -rf /app/.next/cache && \
    find /app -type d -name ".git" -exec rm -rf {} + && \
    find /app -type d -name "node_modules" -exec rm -rf {} + && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 33896

ENV NODE_ENV=production \
    PORT=33896 \
    HOSTNAME="0.0.0.0"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
