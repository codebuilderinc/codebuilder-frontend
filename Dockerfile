# ====================
# 1) Build Stage
# ====================
FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --strict-peer-dependencies=false

COPY . .
RUN npx prisma generate
RUN pnpm run build

# ====================
# 2) Production Stage
# ====================
FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Install production-only dependencies
RUN pnpm install --prod --strict-peer-dependencies=false

EXPOSE 3000
CMD ["pnpm", "start"]
