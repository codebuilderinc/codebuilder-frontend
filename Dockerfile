# ====================
# 1) Build Stage
# ====================
FROM node:22-alpine AS builder
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
FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm

# We use 'nc' to check if the database port is open.
RUN apk add --no-cache netcat-openbsd

# Copy only the necessary files from the builder stage.
COPY --from=builder /app/node_modules ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Copy and prepare the entrypoint script.
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh


# Install production-only dependencies.
RUN pnpm install --prod --strict-peer-dependencies=false

EXPOSE 3000

# The ENTRYPOINT is our script.
# The CMD is the command that gets passed to our script after migrations run.
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["pnpm", "start"]
