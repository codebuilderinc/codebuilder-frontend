#!/bin/sh
#
# This script is the entrypoint for the Docker container.
# It ensures the database is ready before running migrations and starting the app.

# Exit immediately if a command exits with a non-zero status.
set -e

# Enable color output
export FORCE_COLOR=1
export NODE_ENV=${NODE_ENV:-production}

# The host for the database, read from an environment variable.
# We'll set this to 'db' in the docker-compose.yml file.
DB_HOST=${DATABASE_HOST:-db}
DB_PORT=${DATABASE_PORT:-5432}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Starting CodeBuilder application...${NC}"
echo -e "${YELLOW}⏳ Waiting for database at $DB_HOST:$DB_PORT to be ready...${NC}"

# Loop until we can successfully connect to the database port.
# nc (netcat) is a small utility perfect for this.
while ! nc -z $DB_HOST $DB_PORT; do
      sleep 1 # wait for 1 second before trying again
done

echo -e "${GREEN}✅ Database is ready.${NC}"

# Run Prisma migrations.
# 'prisma migrate deploy' is the command intended for production/CI/CD environments.
# It applies pending migrations without generating new ones.
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
npx prisma migrate deploy

echo -e "${GREEN}✅ Migrations complete.${NC}"

echo -e "${BLUE}🚀 Starting Next.js application...${NC}"

# Now, execute the main command provided to the container (e.g., "pnpm start").
# 'exec "$@"' replaces the shell process with the given command,
# ensuring it becomes the main process (PID 1) and receives signals correctly.
exec "$@"
