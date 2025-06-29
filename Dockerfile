# Stage 1: Build the application
# We name this stage 'builder'
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package manifests and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --strict-peer-dependencies=false

# Copy the rest of your application code
COPY . .

# Run Prisma Generate (this is safe and often needed for types)
RUN npx prisma generate

# Build the application. This succeeds because the database is available.
RUN pnpm run build

# Stage 2: Production Image
# Create a smaller, cleaner image for production
FROM node:22-alpine

WORKDIR /app

# ===================================================================
# THE FIX: Install pnpm in the final production image as well.
# ===================================================================
RUN npm install -g pnpm

# Install netcat for the entrypoint healthcheck
RUN apk add --no-cache netcat-openbsd

# Set environment variables for better console output
ENV FORCE_COLOR=1
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only the necessary production artifacts from the 'builder' stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY docker-entrypoint.sh .

# Ensure the entrypoint is executable
RUN chmod +x docker-entrypoint.sh

# This is the command that will run when the container starts
ENTRYPOINT ["./docker-entrypoint.sh"]

# The default command for the entrypoint script
CMD ["pnpm", "start"]